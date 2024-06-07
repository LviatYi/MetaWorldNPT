import { ValueTypeInEnum } from "gtoolkit";

export interface IElementBase {
    id: number;
}

declare class ConfigBase<T extends IElementBase> {
    public getElement(id: number | string): T

    public findElement(fieldName: string, fieldValue: any): T

    public findElements(fieldName: string, fieldValue: any): Array<T>

    public getAllElement(): Array<T>
}

export type AcceptableParamType =
    "void"
    | "string"
    | "integer"
    | "number"
    | "vector"
    | ConfigBase<IElementBase>
    | object

export type InferParamType<P> =
    P extends "void" ? void :
        P extends "string" ? string :
            P extends "integer" ? number :
                P extends "number" ? number :
                    P extends "vector" ? mw.Vector :
                        P extends ConfigBase<IElementBase> ? number :
                            P extends object ? ValueTypeInEnum<P> :
                                never;

export type GodModInferredParamType = InferParamType<AcceptableParamType>

/**
 * 󰌆数据验证器.
 */
export type DataValidator<P> = (param: P) => boolean

/**
 * 归因 󰌆数据验证器.
 */
export interface DataValidatorWithReason<P> {
    /**
     * 󰌆数据验证器.
     */
    validator: DataValidator<P>;

    /**
     * 原因.
     */
    reason: string;
}

/**
 * God Mod 命令参数选项.
 */
export interface GodCommandParamOption<P = string> {
    /**
     * 󰌆数据验证器组合.
     */
    validator: (DataValidator<P> | DataValidatorWithReason<P>)[];
}

//#region Validator Preset
export function RangeDataValidator(min: number, max: number): DataValidatorWithReason<number> {
    return {
        validator: (param: number) => param >= min && param <= max,
        reason: `参数必须在 ${min} 和 ${max} 之间`,
    };
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄