import Gtk, { Delegate } from "gtoolkit";
import Log4Ts from "mw-log4ts/Log4Ts";

interface GodModItemStatistic {
    /**
     * 命令标签.
     */
    label: string;

    /**
     * 已使用次数.
     */
    usedCount: number;

    /**
     * 最后使用时间.
     */
    lastUsedTime: number;

    /**
     * 最后使用参数.
     */
    lastParams: unknown;
}

interface GodModItemUpdateContext {
    /**
     * 命令标签.
     */
    label: string;

    /**
     * 使用时间.
     */
    time: number;

    /**
     * 使用参数.
     */
    params: unknown;
}

type GodModUserData = GodModItemStatistic[];

export class GodModDB {
//#region Constant
    private static readonly EVENT_NAME_USER_DATA_UPDATE =
        "__GOD_MOD_USER_DATA_UPDATE__";

    private static readonly EVENT_NAME_USER_DATA_REFRESH =
        "__GOD_MOD_USER_DATA_REFRESH__";

    /**
     * 记录缩容触发阈值.
     */
    public static readonly DEDUCTION_THRESHOLD = 40;

    /**
     * 单次缩容数量.
     */
    public static readonly DEDUCTION_COUNT = 20;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public static init() {
        if (mw.SystemUtil.isClient()) {
            mw.Event.addServerListener(
                this.EVENT_NAME_USER_DATA_REFRESH,
                (context: GodModUserData) => {
                    this.receiveUserData(mw.Player.localPlayer.userId,
                        context,
                        false);
                });
        }

        if (mw.SystemUtil.isServer()) {
            mw.Event.addClientListener(
                this.EVENT_NAME_USER_DATA_UPDATE,
                (player, context: GodModItemUpdateContext) => {
                    this.innerUpdateUserData(player.userId, context);
                });
        }
    }

    public static memMap: Map<string, Map<string, GodModItemStatistic>> = new Map();

    public static UserDataLoadedEvent: Delegate.SimpleDelegate<[GodModUserData]> = new Delegate.SimpleDelegate();

    public static isUserDataReady(userId: string): boolean {
        return !Gtk.isNullOrUndefined(this.memMap.get(userId));
    }

    private static isUserDataLoading(userId: string): boolean {
        return this.memMap.get(userId) === null;
    }

    /**
     * 更新用户数据.
     * @desc 仅客户端调用.
     * @param {GodModItemUpdateContext} context
     * @return {boolean}
     */
    public static updateUserDataInC(context: GodModItemUpdateContext): boolean {
        const userId = mw.Player.localPlayer.userId;
        let res = this.innerUpdateUserData(userId, context);
        if (res) {
            mw.Event.dispatchToServer(this.EVENT_NAME_USER_DATA_UPDATE, context);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 刷新用户数据.
     * @desc 调用端生效.
     * @desc 双端应同步调用.
     * @param {string} userId
     */
    public static refreshUserData(userId: string) {
        this.memMap.set(userId, new Map());
    }

    /**
     * 加载用户数据.
     * @desc 仅服务器生效.
     * @param {string} userId
     * @param {number} retry 重试次数.
     */
    public static loadUserData(userId: string, retry: number = 3) {
        if (!mw.SystemUtil.isServer()) return;
        if (this.memMap.get(userId) === undefined) this.memMap.set(userId, null);

        mw.DataStorage.asyncGetData(this.getUserDataKey(userId))
            .then(res => {
                const player = mw.Player.getPlayer(userId);
                if (Gtk.isNullOrUndefined(player)) {
                    Log4Ts.error(GodModDB, `player not found.`);
                    return;
                }
                if (!this.isUserDataLoading(userId)) {
                    Log4Ts.log(GodModDB, `user may called refreshing.`);
                } else if (res.code === 200) {
                    Log4Ts.log(GodModDB, `load user data success.`);
                    this.receiveUserData(userId, res.data as GodModUserData, true);
                    mw.Event.dispatchToClient(player,
                        this.EVENT_NAME_USER_DATA_REFRESH,
                        res.data);
                } else if (retry > 0) {
                    Log4Ts.warn(GodModDB,
                        `load user data ${res.code} failed.`,
                        `retry: ${retry}`);
                    this.loadUserData(userId, --retry);
                }
            });
    }

    /**
     * 保存用户数据.
     * @desc 仅服务器生效.
     * @param {string} userId
     */
    public static saveUserData(userId: string) {
        if (!mw.SystemUtil.isServer()) return;

        if (this.isUserDataLoading(userId)) {
            Log4Ts.log(GodModDB, `user data is loading. cancel save and load.`);
            this.memMap.delete(userId);
        } else if (!this.isUserDataReady(userId)) {
            Log4Ts.log(GodModDB, `user data is not ready. cancel save.`);
            return;
        }

        let mapData = this.memMap.get(userId);
        const data = Array.from(mapData.values());
        this.memMap.delete(userId);
        this.dataDeduction(data);

        mw.DataStorage.asyncSetData(this.getUserDataKey(userId), data)
            .then((value) => {
                if (value === 200) Log4Ts.log(GodModDB, `save user data success.`);
                else Log4Ts.error(GodModDB, `save user data failed. error code: ${value}`);
            });
    }

    private static innerUpdateUserData(userId: string, context: GodModItemUpdateContext) {
        if (!this.isUserDataReady(userId)) {
            Log4Ts.warn(GodModDB, `user data not ready.`);
            return false;
        }

        const d = Gtk.tryGet(this.memMap.get(userId)!,
            context.label,
            () => ({
                label: context.label,
                usedCount: 0,
                lastUsedTime: 0,
                lastParams: null,
            }));

        d.usedCount++;
        d.lastUsedTime = context.time;
        d.lastParams = context.params;

        return true;
    }

    private static receiveUserData(userId: string, data: GodModUserData, force: boolean = false) {
        if (!force && !this.isUserDataLoading(userId)) {
            Log4Ts.log(GodModDB, `user may called refreshing.`);
        } else {
            const d = (data ?? []) as GodModUserData;
            const map = new Map<string, GodModItemStatistic>();
            for (const e of d) {
                map.set(e.label, e);
            }
            this.memMap.set(userId, map);
            this.UserDataLoadedEvent.invoke(d);
        }
    }

    private static dataDeduction(data: GodModUserData) {
        if (data.length <= this.DEDUCTION_THRESHOLD) return;

        data.sort((a, b) => b.usedCount - a.usedCount);
        data.length = this.DEDUCTION_THRESHOLD - this.DEDUCTION_COUNT;
    }

    private static getUserDataKey(userId: string) {
        return `${userId}_GOD_MOD_USER_DATA`;
    }
}