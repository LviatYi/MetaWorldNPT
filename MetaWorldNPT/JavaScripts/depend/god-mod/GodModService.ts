export * from "./GodModParam";
export * from "./GodCommandItem";
export * from "./ui/GodModPanel";
export * from "./ui/param-base/IGodModParamInput";
export * from "./ui/param-base/IGodModParamValidatorOption";
export * from "./ui/param-input/GodModIntegerParamInput";
export * from "./ui/param-input/GodModNumberParamInput";
export * from "./ui/param-input/GodModStringParamInput";
export * from "./ui/param-input/GodModVectorParamInput";

import { AcceptableParamType, GodCommandParamOption, InferParamType } from "./GodModParam";
import { GodModPanel } from "./ui/GodModPanel";
import { GtkTypes, Regulator, Singleton } from "gtoolkit";
import Log4Ts from "mw-log4ts";
import { GodCommandItem } from "./GodCommandItem";

export default class GodModService extends Singleton<GodModService>() {
//#region Constant
    /**
     * 管理员列表存储键.
     * @type {string}
     */
    public static readonly GodModAdminListStorageKey = "GOD_MOD_ADMIN_LIST__STORAGE_KEY";

    /**
     * God Mod 请求事件名称前缀.
     * @type {string}
     */
    public static readonly GodModRequestEventNamePrefix = "__GOD_MOD_REQUEST_EVENT_NAME__";
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

    public onConstruct() {
        mw.TimeUtil.onEnterFrame.add(() => {
            if (this._checkAuthorityRegulator.request()) {
                this.queryAdminList();
            }
        });
    }

    public addCommand<P extends AcceptableParamType>(label: string,
                                                     paramType: P = "string" as P,
                                                     clientCmd: (params: InferParamType<P>) => void = undefined,
                                                     serverCmd: (player: mw.Player, params: InferParamType<P>) => void = undefined,
                                                     paramOption: GodCommandParamOption<InferParamType<P>> = undefined,
                                                     group?: string) {
        if (this._shutdown) return;

        if (this._commands.get(label)) {
            Log4Ts.error(GodModService,
                `A command with the same label already exists.`,
                label);
        } else if (!clientCmd && !serverCmd) {
            Log4Ts.error(
                GodModService,
                `at least one of the client command and server command must be provided.`);
            return;
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
    }

    public removeCommand(label: string) {
        this._commands.delete(label);
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

        try {
            command.clientCmd?.(p);
        } catch (e) {
            Log4Ts.error(GodModService,
                `error occurs in client command.`,
                e);
        }

        if (command.serverCmd && autoDispatchToServer) {
            Event.dispatchToServer(this.getEventName(command.label), p);
        }
    }

    public runCommandInServer(player: mw.Player,
                              label: string,
                              p: any) {
        if (this._shutdown || !mw.SystemUtil.isServer()) return;
        if (!this.verifyAuthority(player.userId)) return;
        const command = this._commands.get(label);
        if (!command || !command.isParamValid(p)) return;

        try {
            command.serverCmd?.(player, p);
        } catch (e) {
            Log4Ts.error(GodModService,
                `error occurs in server command.`,
                e);
        }
    }

    public showGm() {
        if (mw.SystemUtil.isClient()) {
            if (!this._view) {
                this._view = GodModPanel
                    .create({
                        items: Array.from(this._commands.values()),
                        zOrder: 65000,
                    })
                    .attach(mw.UIService.canvas)
                    .registerCommandHandler((label, p, autoDispatchToServer) => {
                        this.runCommandInClient(label, p, autoDispatchToServer);
                    });
            } else {
                this._view.attach(mw.UIService.canvas);
            }
        }
    }

    public hideGm() {
        if (mw.SystemUtil.isClient()) {
            this._view?.detach();
        }
    }

    public shutdown(): this {
        this._shutdown = true;
        this._commands.clear();
        return this;
    }

    private verifyAuthority(userId: string): boolean {
        return this._adminList === undefined || (this._adminList && this._adminList.has(userId));
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
                            if (result.data === undefined) {
                                mw.DataStorage.asyncSetData(GodModService.GodModAdminListStorageKey, []);
                            } else {
                                if ((result.data as [])?.length > 0 ?? false) {
                                    this._adminList = new Set();
                                    for (const d of result.data) {
                                        this._adminList.add(d as string);
                                    }
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
        return GodModService.GodModRequestEventNamePrefix + label;
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