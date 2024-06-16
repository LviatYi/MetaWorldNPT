import { ValueTypeInEnum } from "gtoolkit";

export interface IElementBase {
    id: number;
}

export interface ConfigBase<T extends IElementBase> {
    getElement(id: number | string): T;

    findElement(fieldName: string, fieldValue: any): T;

    findElements(fieldName: string, fieldValue: any): Array<T>;

    getAllElement(): Array<T>;
}

export type AcceptableParamType =
    "void"
    | "string"
    | "integer"
    | "number"
    | "vector"
    | "vector2"
    | "rotation"
    | ConfigBase<IElementBase>
    | object

export type InferParamType<P extends AcceptableParamType> =
    P extends "void" ? void :
        P extends "string" ? string :
            P extends "integer" ? number :
                P extends "number" ? number :
                    P extends "vector" ? mw.Vector :
                        P extends "vector2" ? mw.Vector2 :
                            P extends "rotation" ? mw.Rotation :
                                P extends ConfigBase<infer E> ? E :
                                    P extends object ? ValueTypeInEnum<P> :
                                        never;

export type InferParamTypeForTransmit<P extends AcceptableParamType> =
    P extends "void" ? void :
        P extends "string" ? string :
            P extends "integer" ? number :
                P extends "number" ? number :
                    P extends "vector" ? mw.Vector :
                        P extends "vector2" ? mw.Vector2 :
                            P extends "rotation" ? mw.Rotation :
                                P extends ConfigBase<IElementBase> ? number :
                                    P extends object ? ValueTypeInEnum<P> :
                                        never;

export type GodModInferParamForTransmit = InferParamTypeForTransmit<AcceptableParamType>

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
    validator?: (DataValidator<P> | DataValidatorWithReason<P>)[];

    label?: string;
}

//#region Validator Preset
export function RangeDataValidator(min: number, max: number): DataValidatorWithReason<number> {
    return {
        validator: (param: number) => param >= min && param <= max,
        reason: `参数必须在 ${min} 和 ${max} 之间`,
    };
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄