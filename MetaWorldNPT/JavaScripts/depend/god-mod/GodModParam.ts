export type AcceptableParamType = "string" | "number" | "boolean";

export type InferParamType<P> =
    P extends "string" ? string :
        P extends "number" ? number :
            P extends "boolean" ? boolean :
                never;

/**
 * 󰌆数据验证器.
 */
type DataValidator<P> = (param: P) => boolean

/**
 * 归因 󰌆数据验证器.
 */
interface DataValidatorWithReason<P> {
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
    dataValidate: (DataValidator<P> | DataValidatorWithReason<P>)[];
}

//#region Validator Preset
export function RangeDataValidator(min: number, max: number) {
    return (param: number) => param >= min && param <= max;
}

export function IntegerDataValidator() {
    return (param: number) => Number.isInteger(param);
}
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄