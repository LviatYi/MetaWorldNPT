export * from "./GodModParam";
export * from "./GodCommandItem";
export * from "./ui/GodModPanel";
export * from "./ui/param-base/GodModParamInputBase";
export * from "./ui/param-base/IGodModParamInput";
export * from "./ui/param-input/GodModEnumParamInput";
export * from "./ui/param-input/GodModGameConfigParamInput";
export * from "./ui/param-input/GodModIntegerParamInput";
export * from "./ui/param-input/GodModNumberParamInput";
export * from "./ui/param-input/GodModRotationParamInput";
export * from "./ui/param-input/GodModStringParamInput";
export * from "./ui/param-input/GodModVectorParamInput";
export * from "./ui/param-input/GodModVector2ParamInput";
export * from "./ui/param-renderer/GodModGameConfigRenderer";
export * from "./ui/icon/ExpandIcon";
export * from "./ui/icon/MoveIcon";

import { AcceptableParamType, ConfigBase, GodCommandParamOption, IElementBase, InferParamType } from "./GodModParam";
import { GodModPanel } from "./ui/GodModPanel";
import Gtk, { GtkTypes, Regulator, Singleton } from "gtoolkit";
import Log4Ts from "mw-log4ts";
import { GodCommandItem } from "./GodCommandItem";

export type AuthStrategy = "strong" | "weak";

/**
 * God Mod 服务.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export default class GodModService extends Singleton<GodModService>() {
//#region Constant
    /**
     * 管理员列表存储键.
     */
    public static readonly GodModAdminListStorageKey
        = "GOD_MOD_ADMIN_LIST__STORAGE_KEY";

    /**
     * 缺省 管理员 UserId.
     */
    public static readonly GodModDefaultAdmin = "ADMIN_USER_ID";

    /**
     * God Mod 请求运行 事件名前缀.
     */
    public static readonly GodModRunRequestEventNamePrefix
        = "__GOD_MOD_RUN_REQUEST_EVENT_NAME__";

    /**
     * God Mod 命令于服务端运行完成 事件名.
     */
    public static readonly GodModCommandRunResultInServerEventName
        = "__GOD_MOD_COMMAND_RUN_RESULT_IN_SERVER_EVENT_NAME__";

    /**
     * God Mod 查询权限请求 事件名.
     */
    public static readonly GodModQueryAuthorityReqEventName
        = "__GOD_MOD_QUERY_AUTHORITY_REQ_EVENT_NAME__";

    /**
     * God Mod 查询权限回应 事件名.
     */
    public static readonly GodModQueryAuthorityRespEventName
        = "__GOD_MOD_QUERY_AUTHORITY_RESP_EVENT_NAME__";

    /**
     * God Mod 未授权调用 事件名.
     * event {@link GodModUnauthorizedCallEventArgs}
     * @desc 仅服务器.
     */
    public static readonly GodModUnauthorizedCallEventName
        = "__GOD_MOD_UNAUTHORIZED_CALL_EVENT_NAME__";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _queriedAdminList: boolean = false;

    private _view: GodModPanel;

    /**
     * GodCommands 库.
     * @type {Map<string, GodCommandItem<unknown>>}
     * @private
     */
    private _commands: Map<string, GodCommandItem<any>> = new Map();

    /**
     * 管理员列表.
     * @type {Set<string>}
     * @private
     */
    private _adminList: Set<string> = undefined;

    private _shutdown: boolean = false;

    private _checkAuthorityRegulator: Regulator = new Regulator(GtkTypes.Interval.PerMin * 5);

    private _currentFrontFocus: string;

    private _authStrategy: AuthStrategy = "weak";

    public onConstruct() {
        if (mw.SystemUtil.isClient()) {
            mw.Event.addServerListener(
                GodModService.GodModCommandRunResultInServerEventName,
                (event) => {
                    const e = event as GodModCommandRunResult;
                    if (this._currentFrontFocus === e.label) {
                        this.showUiResult(e.result);
                    }
                },
            );
        }

        if (mw.SystemUtil.isServer()) {
            mw.TimeUtil.onEnterFrame.add(() => {
                if (this._checkAuthorityRegulator.request()) {
                    this.queryAdminList();
                }
            });

            mw.Event.addClientListener(
                GodModService.GodModQueryAuthorityReqEventName,
                player => {
                    mw.Event.dispatchToClient(player,
                        GodModService.GodModQueryAuthorityRespEventName,
                        this.verifyAuthority(player.userId));
                });
        }
    }

    public addCommand<P extends AcceptableParamType>(label: string,
                                                     paramType: P = "string" as P,
                                                     clientCmd: (params: InferParamType<P>) => void = undefined,
                                                     serverCmd: (player: mw.Player, params: InferParamType<P>) => void = undefined,
                                                     paramOption: GodCommandParamOption<InferParamType<P>> = undefined,
                                                     group?: string): this {
        if (this._shutdown) return;

        if (this._commands.get(label)) {
            Log4Ts.error(GodModService,
                `A command with the same label already exists.`,
                label);
        } else {
            this._commands.set(label, new GodCommandItem(label,
                paramType,
                clientCmd,
                serverCmd,
                paramOption,
                group));
            if (mw.SystemUtil.isServer()) {
                mw.Event.addClientListener(
                    this.getEventName(label),
                    (player: mw.Player, p: any) => {
                        this.runCommandInServer(player, label, p);
                    });
            }
        }

        return this;
    }

    public removeCommand(label: string): this {
        this._commands.delete(label);

        return this;
    }

    public getAllCommands(): Readonly<GodCommandItem<AcceptableParamType>[]> {
        return [...this._commands.values()];
    }

    public runCommandInClient(label: string,
                              p: any,
                              autoDispatchToServer: boolean = true) {
        if (this._shutdown || !mw.SystemUtil.isClient()) return;
        const command = this._commands.get(label);
        if (!command || !command.isParamValid(p)) return;

        this._currentFrontFocus = label;
        Log4Ts.log(GodModService,
            `run command in client.`,
            `command: ${this._currentFrontFocus}`);

        let result = false;

        if (command.isClientCmd) {
            try {
                let r: boolean | void;
                if (typeof command.paramType === "object" &&
                    Gtk.is<ConfigBase<IElementBase>>(command.paramType, "getElement")) {
                    let config = command.paramType.getElement(p);
                    r = command.clientCmd(config);
                } else {
                    r = command.clientCmd(p);
                }

                if (r !== false) result = true;
            } catch (e) {
                Log4Ts.error(GodModService,
                    `error occurs in client command.`,
                    e);
            }
        }

        if (command.serverCmd && autoDispatchToServer) {
            mw.Event.dispatchToServer(this.getEventName(command.label), p);
        } else {
            this.showUiResult(result);
        }
    }

    public runCommandInServer(player: mw.Player,
                              label: string,
                              p: any) {
        if (this._shutdown || !mw.SystemUtil.isServer()) return;
        if (!this.verifyAuthority(player.userId)) {
            Log4Ts.warn(GodModService,
                `User has no authority.`,
                `NickName: ${player.nickname}`,
                `User: ${player.userId}`);
            mw.Event.dispatchToLocal(
                GodModService.GodModUnauthorizedCallEventName,
                {
                    userId: player.userId,
                    cmdLabel: label,
                } as GodModUnauthorizedCallEventArgs);
            return;
        }
        const command = this._commands.get(label);
        if (!command || !command.isParamValid(p)) return;

        Log4Ts.log(GodModService,
            `run command in server.`,
            `command: ${this._currentFrontFocus}`,
            `by user: ${player.userId}`);

        let result = false;
        if (command.isServerCmd) {
            try {
                let r: boolean | void;
                if (typeof command.paramType === "object" &&
                    Gtk.is<ConfigBase<IElementBase>>(command.paramType, "getElement")) {
                    let config = command.paramType.getElement(p);
                    r = command.serverCmd(player, config);
                } else {
                    r = command.serverCmd(player, p);
                }
                if (r !== false) result = true;
                mw.Event.dispatchToClient(player,
                    GodModService.GodModCommandRunResultInServerEventName,
                    {label: label, result} as GodModCommandRunResult);
            } catch (e) {
                Log4Ts.error(GodModService,
                    `error occurs in server command.`,
                    e);
                mw.Event.dispatchToClient(player,
                    GodModService.GodModCommandRunResultInServerEventName,
                    {label: label, result: false} as GodModCommandRunResult);
            }
        }
    }

    /**
     * 显示 God Mod 面板.
     */
    public showGm(): this {
        if (mw.SystemUtil.isClient()) {
            if (!this._view) {
                this._view = GodModPanel
                    .create({
                        items: Array.from(this._commands.values()),
                        zOrder: 650000,
                    })
                    .attach(mw.UIService.canvas)
                    .registerCommandHandler((label, p, autoDispatchToServer) => {
                        this.runCommandInClient(label, p, autoDispatchToServer);
                    });

                Gtk.setUiPositionY(this._view.root, 100);
            } else {
                this._view.attach(mw.UIService.canvas);
            }
        }

        return this;
    }

    /**
     * 隐藏 God Mod 面板.
     */
    public hideGm(): this {
        if (mw.SystemUtil.isClient()) {
            this._view?.detach();
        }

        return this;
    }

    /**
     * 带权限验证地 显示 God Mod 面板.
     * @desc 使用服务器的 权限认证策略.
     * @desc 当 PIE 环境时 无论如何将直接显示.
     */
    public authShowGm(): this {
        if (mw.SystemUtil.isPIE) this.showGm();

        if (mw.SystemUtil.isClient()) {
            this.hasAuthority()
                .then(value => {
                    if (value) this.showGm();
                    else this.hideGm();
                });
        }

        return this;
    }

    /**
     * 关闭 God Mod 服务.
     * @desc 执行后不再生效.
     */
    public shutdown(): this {
        this._shutdown = true;
        this._commands.clear();
        return this;
    }

    /**
     * 设置服务器 权限验证策略.
     * @param {AuthStrategy} strategy
     *  - "strong" 强权限验证.
     *    仅手动添加到管理员列表的用户可使用.
     *  - "weak" 弱权限验证.
     *    若不存在管理员列表则所有用户可使用.
     *    否则仅手动添加到管理员列表的用户可使用.
     * @return {this}
     */
    public setAuthStrategy(strategy: AuthStrategy): this {
        this._authStrategy = strategy;
        return this;
    }

//#region UI Config
    /**
     * 设置 GodMod 面板 zOrder.
     * @param {number} zOrder
     * @return {this}
     */
    public setZOrder(zOrder: number): this {
        if (this._view && this._view.root) {
            this._view.root.zOrder = zOrder;
        }
        return this;
    }

    /**
     * 设置 GodMod 面板 位置.
     * @param {number} x
     * @param {number} y
     * @return {this}
     */
    public setPosition(x: number, y: number): this {
        if (this._view && this._view.root) {
            Gtk.setUiPosition(this._view.root, x, y);
        }
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 为所有 GameConfig 添加预览命令.
     * @param {object} gameConfig 传入 GameConfig.
     * @return {this}
     */
    public addPreviewForGameConfig(gameConfig: object): this {
        if (!mw.SystemUtil.isClient()) return this;

        Object.getOwnPropertyNames(gameConfig)
            ?.forEach(property => {
                const descriptor = Object.getOwnPropertyDescriptor(
                    gameConfig,
                    property);
                if (descriptor && typeof descriptor.get === "function") {
                    const configBase = gameConfig[property];
                    if ("getElement" in configBase) {
                        addGMCommand(`预览配置 ${property} | G`,
                            configBase as ConfigBase<IElementBase>,
                            undefined,
                            undefined,
                            {label: "Config Id"},
                            "GodMod");
                    }
                }
            });

        return this;
    }

    /**
     * 是否 具有权限.
     * @desc 仅服务端.
     * @param {string} userId
     * @return {boolean}
     * @private
     */
    private verifyAuthority(userId: string): boolean {
        switch (this._authStrategy) {
            case "weak":
                return this.verifyWeakAuthority(userId);
            case "strong":
            default:
                return this.verifyStrongAuthority(userId);
        }
    }

    /**
     * 是否 具有弱认证权限.
     * @desc 仅服务端.
     * @param {string} userId
     * @return {boolean}
     * @private
     */
    private verifyWeakAuthority(userId: string): boolean {
        return mw.SystemUtil.isPIE ||
            this._adminList === undefined ||
            (this._adminList && this._adminList.has(userId));
    }

    /**
     * 是否 具有强认证权限.
     * @desc 仅服务端.
     * @param {string} userId
     * @return {boolean}
     * @private
     */
    private verifyStrongAuthority(userId: string): boolean {
        return this._adminList?.has(userId) ?? false;
    }

    /**
     * 是否 自身具有认证权限.
     * @desc 仅客户端.
     * @desc 需服务器手动加入后生效.
     * @return {Promise<boolean>}
     */
    public async hasAuthority(): Promise<boolean> {
        if (!mw.SystemUtil.isClient()) return false;

        return new Promise((resolve, reject) => {
            const listener = mw.Event.addServerListener(
                GodModService.GodModQueryAuthorityRespEventName,
                (result) => {
                    listener.disconnect();
                    resolve(result as boolean);
                },
            );
            mw.setTimeout(() => {
                    listener.disconnect();
                    reject();
                },
                GtkTypes.Interval.PerSec * 3);

            mw.Event.dispatchToServer(GodModService.GodModQueryAuthorityReqEventName);
        });
    }

    /**
     * 查询管理员列表.
     */
    private queryAdminList() {
        mw.DataStorage
            ?.asyncGetData(GodModService.GodModAdminListStorageKey)
            ?.then(result => {
                    if (this._queriedAdminList) return;

                    switch (result.code) {
                        case mw.DataStorageResultCode.Success:
                            if (Gtk.isNullOrEmpty(result.data)) {
                                mw.DataStorage.asyncSetData(
                                    GodModService.GodModAdminListStorageKey,
                                    [GodModService.GodModDefaultAdmin]);
                            } else {
                                let set = new Set<string>();
                                for (const d of result.data) {
                                    if (d !== GodModService.GodModDefaultAdmin) set.add(d);
                                }

                                if (set.size > 0) {
                                    this._adminList = set;
                                } else {
                                    this._adminList = undefined;
                                }
                            }
                            break;
                        default:
                            break;
                    }

                    this._queriedAdminList = true;
                },
            );
    };

    /**
     * 获取填充类型名.
     * @param {string} label
     * @return {string}
     * @private
     */
    private getEventName(label: string): string {
        return GodModService.GodModRunRequestEventNamePrefix + label;
    }

    /**
     * 显示执行反馈结果。
     * @param {boolean} result
     * @private
     */
    private showUiResult(result: boolean) {
        if (result) this._view?.showSuccess();
        else this._view?.showError();
    }
}

export function addGMCommand<P extends AcceptableParamType>(
    label: string,
    paramType: P,
    clientCmd: (params: InferParamType<P>) => void = undefined,
    serverCmd: (player: mw.Player, params: InferParamType<P>) => void = undefined,
    paramOption: GodCommandParamOption<InferParamType<P>> = undefined,
    group?: string) {
    GodModService.getInstance().addCommand(label,
        paramType,
        clientCmd,
        serverCmd,
        paramOption,
        group);
}

/**
 * God Mod Command 运行结果.
 */
interface GodModCommandRunResult {
    label: string;

    result: boolean;
}

/**
 * GodMod 未授权调用 事件参数.
 */
interface GodModUnauthorizedCallEventArgs {
    /**
     * UserId.
     */
    userId: string,

    /**
     * GodMod Command Label.
     */
    cmdLabel: string,
}