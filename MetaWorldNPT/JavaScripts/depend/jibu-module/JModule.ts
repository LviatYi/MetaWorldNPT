import Log4Ts from "../log4ts/Log4Ts";
import {Delegate, NoOverride, Predicate} from "../../util/GToolkit";
import SimpleDelegate = Delegate.SimpleDelegate;
import SimpleDelegateFunction = Delegate.SimpleDelegateFunction;

const EVENT_NAME_NET_METHOD_CALLED_BY_CLIENT = "__mw_developer_O_Ask_repoleved_wm__";

export type DataUpgradeMethod<SD extends mwext.Subdata> = (data: SD) => void;

export abstract class JModuleData extends mwext.Subdata {

    /**
     * 已经发布的正式数据版本号.
     * @desc 以版本发布时间 升序排列.
     * @desc 定义为符号 RV.
     * @desc bitwise readonly.
     */
    protected get releasedVersions(): number[] {
        return [
            1,
        ];
    }

    /**
     * 版本升级办法.
     * UVM[n] : 从 RV[n] 升级到 RV[n+1] 的方法.
     */
    protected get updateVersionMethod(): DataUpgradeMethod<this>[] {
        return [
            // (data) => {
            // },
        ];
    }

    /**
     * 定义为最新版本号.
     * 无需覆写.
     * @protected
     */
    protected get version(): number {
        return this.releasedVersions[this.releasedVersions.length - 1];
    }

    /**
     * 你不应重写此方法.
     * @desc 当需要 覆写 {@link mwext.Subdata.onDataInit} 时 请覆写 {@link JModuleData.onJDataInit}.
     * @sealed
     */
    protected onDataInit(): NoOverride {
        super.onDataInit();
        this.onJDataInit();
        this.checkVersion();
        return;
    }

    protected onJDataInit(): void {
    }

    /**
     * 数据版本检查器.
     */
    protected checkVersion() {
        if (this.currentVersion === this.version) return;

        Log4Ts.log(JModuleData,
            `数据准备升级`,
            () => `当前版本: ${this.currentVersion}`,
            () => `最新版本: ${this.version}.`,
        );

        const startIndex = this.releasedVersions.indexOf(this.currentVersion);
        if (startIndex < 0) {
            Log4Ts.error(
                JModuleData,
                `数据号版本异常`,
                `不是已发布的版本号`,
                () => `当前版本: ${this.currentVersion}.`);
            return;
        }

        for (let i = startIndex; i < this.updateVersionMethod.length - 1; ++i) {
            const backUp: object = {};
            for (const key of Object.keys(this)) backUp[key] = this[key];
            try {
                this.updateVersionMethod[i](this);
                this.currentVersion = this.releasedVersions[i + 1];
            } catch (e) {
                Log4Ts.error(JModuleData, `数据版本升级失败. 将回退至旧版数据. ${e}`);
                for (const key of Object.keys(this)) this[key] = backUp[key];
                break;
            }
        }
    }
}

/**
 * Jibu Module
 * @desc 提供 Ready 回调与其他注入功能的 Module.
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 31.0.0
 */
export abstract class JModuleC<S, D extends mwext.Subdata> extends mwext.ModuleC<S, D> {
//#region J Ready
    private _isReady: boolean = false;

    public get isReady(): boolean {
        return this._isReady;
    }

    private _onReady: SimpleDelegate<void> = new SimpleDelegate<void>();

    /**
     * ready 委托.
     * @desc 非 ready 时等待 ready 委托调用.
     * @desc ready 时立即调用.
     * @param callback
     */
    public delegateOnReady(callback: SimpleDelegateFunction<void>) {
        if (this._isReady) {
            try {
                callback();
            } catch (e) {
                Log4Ts.error(JModuleC, e);
            }
        } else {
            this._onReady.once(callback);
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region J Module Event
    /**
     * 你不应重写此方法.
     * @desc 当需要 覆写 {@link mwext.ModuleC.onStart} 时 请覆写 {@link JModuleC.onJStart}.
     * @sealed
     */
    protected onStart(): NoOverride {
        super.onStart();
        this.onJStart();
        this._isReady = true;
        this._onReady.invoke();
        return;
    }

    /**
     * 注入后 生命周期方法 创建模块时调用.
     * @desc 当需要 覆写 onStart 时 请覆写 {@link JModuleC.onJStart}.
     * @protected
     */
    protected onJStart(): void {
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export abstract class JModuleS<C, D extends mwext.Subdata> extends mwext.ModuleS<C, D> {
//#region J Module Event
    /**
     * 你不应重写此方法.
     * @desc 当需要 覆写 {@link mwext.ModuleC.onStart} 时 请覆写 {@link JModuleC.onJStart}.
     * @sealed
     */
    protected onStart(): NoOverride {
        super.onStart();
        if (this.useJAntiCheat) this.jAntiCheat();
        this.onJStart();
        this._isReady = true;
        this._onReady.invoke();
        return;
    }

    /**
     * 注入后 生命周期方法 创建模块时调用.
     * @desc 当需要 覆写 onStart 时 请覆写 {@link JModuleC.onJStart}.
     * @protected
     */
    protected onJStart(): void {
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region J Ready
    private _isReady: boolean = false;

    public get isReady(): boolean {
        return this._isReady;
    }

    private _onReady: SimpleDelegate<void> = new SimpleDelegate<void>();

    /**
     * ready 委托.
     * @desc 非 ready 时等待 ready 委托调用.
     * @desc ready 时立即调用.
     * @param callback
     */
    public delegateOnReady(callback: SimpleDelegateFunction<void>) {
        if (this._isReady) {
            try {
                callback();
            } catch (e) {
                Log4Ts.error(JModuleC, e);
            }
        } else {
            this._onReady.once(callback);
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region J Anti Cheat
    /**
     * 是否启用 JAC 反作弊.
     * @desc JAC 反作弊是一种面向 (基于事件机制的非 net_ 函数的反常规调用) 防御机制.
     * @desc 整个游戏实例 只需要一个 JAC 反作弊模块实例.
     * @return {boolean}
     * @protected
     */
    protected useJAntiCheat: boolean = false;

    /**
     * J Anti Cheat Core.
     * @private
     */
    private jAntiCheat() {
        mw.Event.addClientListener(EVENT_NAME_NET_METHOD_CALLED_BY_CLIENT,
            (player, funTag: string, params) => {
                if (funTag.includes(".")) {
                    const strArr = funTag.split(".");
                    const netGuid = strArr[0];
                    const funName = strArr[1];
                    const obj =
                        (mwext
                            ?.["GameInitializer"]
                            ?.["getService"]?.("NetManager")
                            ?.["objMap"] as Map<string, object>)
                            ?.get(netGuid) ?? null;
                    if (obj["mTarget"] && obj["mTarget"] instanceof ModuleS && !funName.startsWith("net_")) {
                        Log4Ts.warn(JModuleS,
                            `player call non net_method of module from client directly.`,
                            `player suspected of cheating.`,
                            `playerId: ${player.playerId}`,
                            `userId: ${player.userId}`,
                        );
                        this.onPlayerSuspectedCheat(player);
                    }
                }
            });
    }

    /**
     * 当玩家被怀疑作弊时 调用.
     * @desc 默认行为 为立即踢出玩家.
     * @param {Player} player
     * @param {string} message 提示信息.
     * @protected
     */
    protected onPlayerSuspectedCheat(player: mw.Player, message: string = "Suspected of cheating.") {
        RoomService.kick(player, message);
    }

    /**
     * 作弊断言.
     * @param {mw.Player} player
     * @param {Predicate} predicate
     *      - 断言为 false 时疑似作弊.
     * @param {string} message 提示信息.
     */
    public assert(player: mw.Player, predicate: Predicate, message: string = undefined) {
        let result: boolean;
        try {
            result = predicate();
        } catch (e) {
            result = false;
        }

        if (!result) this.onPlayerSuspectedCheat(player, message);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}
