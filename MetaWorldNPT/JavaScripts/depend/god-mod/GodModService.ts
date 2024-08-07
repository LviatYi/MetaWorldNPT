import { AcceptableParamType, ConfigBase, GodCommandParamOption, IElementBase, InferParamType } from "./GodModParam";
import { GodModPanel } from "./ui/GodModPanel";
import Gtk, { AnyPoint, GtkTypes, Regulator, Singleton } from "gtoolkit";
import Log4Ts from "mw-log4ts";
import { ClientCmdType, CmdResultType, GodCommandItem, ServerCmdType } from "./GodCommandItem";

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
                        this.showUiResult(e.result,
                            this._commands.get(e.label)?.paramOption?.resultShowTime);
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

        registerCommonCommands();
    }

    public addCommand<P extends AcceptableParamType>(label: string,
                                                     paramType: P = "string" as P,
                                                     clientCmd: ClientCmdType<P> = undefined,
                                                     serverCmd: ServerCmdType<P> = undefined,
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

        return this.refreshGm();
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

        let result: CmdResultType;

        if (command.isClientCmd) {
            try {
                if (typeof command.paramType === "object" &&
                    Gtk.is<ConfigBase<IElementBase>>(command.paramType, "getElement")) {
                    let config = command.paramType.getElement(p);
                    result = command.clientCmd(config);
                } else {
                    result = command.clientCmd(p);
                }
            } catch (e) {
                Log4Ts.error(GodModService,
                    `error occurs in client command.`,
                    e);
            }
        }

        if (command.serverCmd && autoDispatchToServer) {
            mw.Event.dispatchToServer(this.getEventName(command.label), p);
        } else {
            this.showUiResult(typeof result === "string" ?
                result :
                result !== false);
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
            `command: ${label}`,
            `by user: ${player.userId}`);

        let r: CmdResultType;
        if (command.isServerCmd) {
            try {
                if (typeof command.paramType === "object" &&
                    Gtk.is<ConfigBase<IElementBase>>(command.paramType, "getElement")) {
                    let config = command.paramType.getElement(p);
                    r = command.serverCmd(player, config);
                } else {
                    r = command.serverCmd(player, p);
                }

                mw.Event.dispatchToClient(player,
                    GodModService.GodModCommandRunResultInServerEventName,
                    {
                        label: label,
                        result: typeof r == "string" ? r : r !== false,
                    } as GodModCommandRunResult);
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
     * 刷新 God Mod 面板.
     */
    private refreshGm(): this {
        if (mw.SystemUtil.isClient()) this._view?.refreshCmdItems(
            Array.from(this._commands.values()),
        );

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
     * @param {number} showTime 显示时间. ms
     * @private
     */
    private showUiResult(result: boolean | string, showTime?: number) {
        if (typeof result === "string") {
            this._view?.showTips(result, showTime);
        } else {
            if (result) this._view?.showSuccess();
            else this._view?.showError();
        }
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

    result: boolean | string;
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

//#region Common Command Item
function registerCommonCommands() {
    addGMCommand("所有玩家信息 | G",
        "void",
        showAllPlayer,
        showAllPlayer,
        undefined,
        "GodMod",
    );

    addGMCommand("传送 | G",
        "vector",
        undefined,
        (player, params) => {
            player.character.worldTransform.position = params;
        },
        undefined,
        "GodMod",
    );

    addGMCommand("传送至我 | G",
        "string",
        undefined,
        (player, params) => {
            const target = mw.Player.getPlayer(params);
            if (!target) {
                Log4Ts.error(GodModService, `Player not exist. userid: ${params}`);
                throw Error();
            }

            target.character.worldTransform.position = player.character.worldTransform.position.clone();
        },
        {
            label: "UserId",
            validator: [{
                reason: "用户不存在",
                validator: (param) => !!mw.Player.getPlayer(param),
            }],
        },
        "GodMod",
    );

    addGMCommand("传送至 Ta | G",
        "string",
        undefined,
        (player, params) => {
            const target = mw.Player.getPlayer(params);
            if (!target) {
                Log4Ts.error(GodModService, `Player not exist. userid: ${params}`);
                throw Error();
            }

            player.character.worldTransform.position = target.character.worldTransform.position.clone();
        },
        {
            label: "UserId",
            validator: [{
                reason: "用户不存在",
                validator: (param) => !!mw.Player.getPlayer(param),
            }],
        },
        "GodMod",
    );

    addGMCommand("踢出游戏 | G",
        "string",
        undefined,
        (player, params) => {
            const target = mw.Player.getPlayer(params);
            if (!target) {
                Log4Ts.error(GodModService, `Player not exist. userid: ${params}`);
                throw Error();
            }

            mw.RoomService.kick(target, "Kicked by GodMod Admin");
        },
        {
            label: "UserId",
            validator: [{
                reason: "用户不存在",
                validator: (param) => !!mw.Player.getPlayer(param),
            }],
        },
        "GodMod",
    );

    addGMCommand("查看当前位置 | G",
        "string",
        (guid: string) => {
            let out: mw.Vector | undefined;
            const printGameObj = !Gtk.isNullOrEmpty(guid);
            if (printGameObj) {
                const target = mw.GameObject.findGameObjectById(guid);

                out = target?.worldTransform?.position ?? undefined;
                if (out) {
                    Log4Ts.log(GodModService,
                        `position of target whose guid is ${guid}:`,
                        out);
                } else {
                    Log4Ts.log(registerCommonCommands, `guid ${guid} not found.`);
                }
            }

            const playerPos = mw.Player.localPlayer.character.worldTransform.position;
            if (!printGameObj) out = playerPos;

            Log4Ts.log(GodModService,
                `Current player position:`,
                playerPos);

            return anyPointToString(out, 0);
        },
        undefined,
        {label: "GameObject Id. 可不填 同时输出玩家"},
        "GodMod",
    );

    addGMCommand("查看当前旋转 | G",
        "string",
        (guid: string) => {
            let out: mw.Rotation | undefined;
            const printGameObj = !Gtk.isNullOrEmpty(guid);
            if (printGameObj) {
                const target = mw.GameObject.findGameObjectById(guid);

                out = target?.worldTransform?.rotation ?? undefined;
                if (out) {
                    Log4Ts.log(GodModService,
                        `rotation of target whose guid is ${guid}:`,
                        out);
                } else {
                    Log4Ts.log(registerCommonCommands, `guid ${guid} not found.`);
                }
            }

            const playerRot = mw.Player.localPlayer.character.worldTransform.rotation;
            if (!printGameObj) out = playerRot;

            Log4Ts.log(GodModService,
                `Current player rotation:`,
                playerRot);

            return rotationToString(out, 0);
        },
        undefined,
        {label: "GameObject Id. 可不填 同时输出玩家"},
        "GodMod",
    );

    addGMCommand("我的房间 | G",
        "void",
        undefined,
        (player, params) => {
            Log4Ts.log(registerCommonCommands,
                `room id: ${mw.SystemUtil.roomId}`,
                `game id: ${mw.SystemUtil.getGameId()}`,
                `scene id: ${mw.SystemUtil.sceneId}`);

            return mw.SystemUtil.roomId;
        });

    addGMCommand("跳转房间 | G",
        "string",
        undefined,
        (player, roomId) => {
            mw.TeleportService.asyncTeleportToRoom(roomId, [player.userId], {})
                .then((reason) => {
                    switch (reason.status) {
                        case mw.TeleportStatus.success:
                            break;
                        case mw.TeleportStatus.error:
                        case mw.TeleportStatus.timeout:
                        case mw.TeleportStatus.ignored:
                            Log4Ts.error(GodModService,
                                `Jump to room failed.`,
                                `roomId: ${roomId}`,
                                `status: ${reason.status}`,
                                `users: ${reason.userIds}`,
                                `error code: ${reason.errorCode}`,
                                `reason: ${reason.message}`);

                            throw new Error(reason.message);
                    }
                });
        },
        undefined,
        "GodMod",
    );

    addGMCommand("行走速度 | G",
        "number",
        () => {
            const player = mw.Player.localPlayer;
            Log4Ts.log(GodModService,
                `current walk speed: ${player.character.maxWalkSpeed}`,
                `current acceleration: ${player.character.maxAcceleration}`,
            );
        },
        (player, params) => {
            if (Number.isNaN(params) || params <= 0) params = 2000;

            player.character.maxWalkSpeed = params;
            player.character.maxAcceleration = params * 2;
        },
        undefined,
        "GodMod",
    );

    addGMCommand("行走加速度 | G",
        "number",
        () => {
            const player = mw.Player.localPlayer;
            Log4Ts.log(GodModService,
                `current walk speed: ${player.character.maxWalkSpeed}`,
                `current acceleration: ${player.character.maxAcceleration}`,
            );
        },
        (player, params) => {
            if (Number.isNaN(params) || params <= 0) params = 4000;

            player.character.maxAcceleration = params;
        },
        undefined,
        "GodMod",
    );

    addGMCommand("停止该房间 GodMod 服务 | G",
        "string",
        undefined,
        (player, params) => {
            if (Gtk.isNullOrEmpty(params)) return;
            if (params === "我确定") {
                GodModService.getInstance().shutdown();
            }
        },
        {label: "你确定吗？"},
        "GodMod",
    );
}

function showAllPlayer() {
    Log4Ts.log(GodModService, `All player:`);
    mw.Player.getAllPlayers().forEach((player) => {
        Log4Ts.log(undefined,
            `displayName: ${player.character.displayName}`,
            `nickName: ${player.nickname}`,
            `userId: ${player.userId}`,
            `playerId: ${player.playerId}`,
            `position: ${player.character.worldTransform.position}`,
            `walkSpeed: ${player.character.maxWalkSpeed}`,
            `currentState: ${mw.CharacterStateType[player.character.getCurrentState()]}`,
            `--------------------------------------------------`,
        );
    });
}

function anyPointToString(vec: AnyPoint, fixed: number = 2): string {
    if ("z" in vec) {
        return `x:${vec.x.toFixed(fixed)
        }, y:${vec.y.toFixed(fixed)
        }, z:${vec.z.toFixed(fixed)}`;
    }

    return `${vec.x.toFixed(fixed)}, ${vec.y.toFixed(fixed)}`;
}

function rotationToString(vec: Rotation, fixed: number = 2): string {
    return `x:${vec.x.toFixed(fixed)
    }, y:${vec.y.toFixed(fixed)
    }, z:${vec.z.toFixed(fixed)}`;
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄