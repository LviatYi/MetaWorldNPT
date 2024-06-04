import Log4Ts from "../log4ts/Log4Ts";
import { AcceptableParamType, GodCommandParamOption, InferParamType } from "./GodModParam";
import { GodModPanel } from "./ui/GodModPanel";

/**
 * God Command Item 命令项.
 * @desc 描述一个 God 命令.
 */
export class GodCommandItem<P extends AcceptableParamType> {
    public pinyin: string;

    /**
     * God Command Item constructor.
     * @param {string} label 名称. 唯一的.
     * @param {P} paramType 参数类型.
     * @param {(params: P) => void} clientCmd client 命令.
     * @param {(player: mw.Player, params: P) => void} serverCmd server 命令.
     * @param {GodCommandParamOption<P>} paramOption 参数选项.
     * @param {string} group 分组.
     */
    public constructor(public label: string,
                       public paramType: P,
                       public clientCmd: (params: InferParamType<P>) => void = undefined,
                       public serverCmd: (player: mw.Player, params: InferParamType<P>) => void = undefined,
                       public paramOption: GodCommandParamOption<InferParamType<P>> = undefined,
                       public group?: string) {
        this.pinyin = "not supported now.";
    }

    /**
     * 是否 󰍹客户端命令.
     * @return {boolean}
     */
    public get isClientCmd(): boolean {
        return !!this.clientCmd;
    }

    /**
     * 是否 󰒋服务器命令.
     * @return {boolean}
     */
    public get isServerCmd(): boolean {
        return !!this.serverCmd;
    }

    /**
     * 是否通过 󰄲数据验证.
     * @param {P} p
     * @return {boolean} 是否 通过验证.
     */
    public isParamValid(p: InferParamType<P>): boolean {
        if (isNullOrUndefined(this.paramOption?.dataValidate)) return true;

        for (const validator of this.paramOption.dataValidate) {
            try {
                if (typeof validator === "function") {
                    if (!validator(p)) return false;
                } else {
                    if (!validator?.validator(p)) return false;
                    //TODO_LviatYi Reason Output.
                }
            } catch (e) {
                Log4Ts.error(GodCommandItem,
                    `error occurs in validator.`,
                    e);
                return false;
            }
        }

        return true;
    }
}

export class GodModService extends Singleton<GodModService>() {
    public static readonly GodModAdminListStorageKey = "GOD_MOD_ADMIN_LIST__STORAGE_KEY";

    /**
     * God Mod 请求事件名称前缀.
     * @type {string}
     */
    public static readonly GodModRequestEventNamePrefix = "__GOD_MOD_REQUEST_EVENT_NAME__";

    private _queriedAdminList: boolean = false;

    /**
     * GodCommands 库.
     * @type {Map<string, GodCommandItem<unknown>>}
     * @private
     */
    private _commands: Map<string, GodCommandItem<AcceptableParamType>> = new Map();

    /**
     * 管理员列表.
     * @type {Set<string>}
     * @private
     */
    private _adminList: Set<string> = undefined;

    public addCommand<P extends AcceptableParamType>(label: string,
                                                     paramType: P = "string" as P,
                                                     clientCmd: (params: InferParamType<P>) => void = undefined,
                                                     serverCmd: (player: mw.Player, params: InferParamType<P>) => void = undefined,
                                                     paramOption: GodCommandParamOption<InferParamType<P>> = undefined,
                                                     group?: string) {
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
            this._commands.set(label,
                new GodCommandItem(label,
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
        if (!mw.SystemUtil.isClient()) return;
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
        if (!mw.SystemUtil.isServer()) return;
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
        GodModPanel
            .create({
                items: Array.from(this._commands.values()),
                zOrder: 65000,
            })
            .attach(mw.UIService.canvas);
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
    }

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

/**
 * Singleton factory By Gtk.
 * To create a Singleton,
 * extends Singleton<YourClass>().
 * @example
 * class UserDefineSingleton extends Singleton<UserDefineSingleton>() {
 *      public name: string;
 *
 *      public someSubMethod(): void {
 *          console.log("someSubMethod in UserDefineSingleton called");
 *      }
 *
 *      protected onConstruct(): void {
 *          this.name = "user define singleton";
 *      }
 *  }
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @constructor
 * @beta
 */
function Singleton<T>() {
    return class Singleton {
        private static _instance?: T = null;

        public createTime: Date;

        /**
         * we don't recommend to use it.
         * if you want to do something when constructing, override onConstructor.
         * @protected
         */
        protected constructor() {
            this.createTime = new Date();
        }

        public static getInstance(): T {
            if (!this._instance) {
                this._instance = new this() as T;
                (this._instance as Singleton).onConstruct();
            }
            return this._instance;
        }

        /**
         * override when need extend constructor.
         * @virtual
         * @protected
         */
        protected onConstruct(): void {
        }
    };
}

function isNullOrUndefined(p: unknown): boolean {
    return p == undefined;
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