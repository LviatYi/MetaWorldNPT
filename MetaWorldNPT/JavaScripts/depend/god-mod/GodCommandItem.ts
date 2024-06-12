import { pinyin } from "pinyin-pro";
import { AcceptableParamType, GodCommandParamOption, InferParamType } from "./GodModParam";
import Log4Ts from "mw-log4ts";

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
                       public clientCmd?: (params: InferParamType<P>) => boolean | void,
                       public serverCmd?: (player: mw.Player, params: InferParamType<P>) => boolean | void,
                       public paramOption?: GodCommandParamOption<InferParamType<P>>,
                       public group?: string) {
        this.pinyin = pinyin(
            label,
            {
                type: "string",
                separator: "",
                toneType: "none",
                v: true,
            });
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
        if (isNullOrUndefined(this.paramOption?.validator)) return true;

        for (const validator of this.paramOption.validator) {
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

function isNullOrUndefined(p: unknown): boolean {
    return p == undefined;
}