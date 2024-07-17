import { RecursivePartial } from "../RecursivePartial";
import { EasingFunction } from "../../easing/Easing";
import { Getter } from "gtoolkit";

export type DataTweenFunction<T> = (from: T, to: T, process: number) => T;

/**
 * Tween data util.
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
export class TweenDataUtil {
//#region Data Util
    /**
     * Calculate tween data from startVal to distVal according to process.
     *
     * @param startVal val start.
     * @param distVal val end.
     * @param process process ratio.
     * @param twoPhaseTweenBorder tween border of two phase value.
     * @param objectBoard object board cached.
     */
    public static dataTween<T>(startVal: T,
                               distVal: T,
                               process: number,
                               twoPhaseTweenBorder: number = 0.5,
                               objectBoard: object = undefined): T | undefined {
        //TODO_LviatYi 补间函数应按基本类型 参数化、客制化
        switch (typeof startVal) {
            case "number":
                return ((distVal as number - startVal) * process + startVal) as T;
            case "bigint":
                return ((distVal as bigint - startVal) * BigInt(process) + startVal) as T;
            case "object":
                if (Array.isArray(startVal)) {
                    return (process < twoPhaseTweenBorder ? startVal : distVal) as T;
                } else {
                    if (!objectBoard) objectBoard = {};
                    Object.keys(startVal).forEach(
                        item => {
                            objectBoard[item] = TweenDataUtil.dataTween(startVal[item],
                                distVal[item],
                                process,
                                twoPhaseTweenBorder,
                                objectBoard);
                        });

                    return objectBoard as T;
                }
            case "boolean":
            case "function":
                return (process < twoPhaseTweenBorder ? startVal : distVal) as T;
            case "string":
                return (process < twoPhaseTweenBorder ? startVal : distVal) as T;
            case "symbol":
            case "undefined":
                return undefined;
        }

        return undefined;
    }

    /**
     * Calculate tween data from startVal to distVal in Recursive Partial according to process.
     * @param startVal
     * @param distVal
     * @param process
     * @param twoPhaseTweenBorder
     * @param objectBoard object board cached.
     */
    public static partialDataTween<T, P extends RecursivePartial<T>>
    (startVal: T,
     distVal: P,
     process: number,
     twoPhaseTweenBorder: number = 0.5,
     objectBoard: object = undefined): P {
        if (this.isPrimitiveType(startVal) ||
            this.isSameType(startVal, distVal)) {
            return TweenDataUtil.dataTween(startVal,
                distVal as unknown as T,
                process,
                twoPhaseTweenBorder,
                objectBoard) as unknown as P;
        }
        if (!objectBoard) objectBoard = {};
        Object.keys(distVal).forEach(
            item => {
                objectBoard[item] = TweenDataUtil.partialDataTween(
                    startVal[item],
                    distVal[item],
                    process,
                    objectBoard[item]);
            });

        return objectBoard as P;
    }

    /**
     * easing func list tween.
     * @param startValue
     * @param endValue
     * @param easingList
     * @param process
     * @param objectBoard object board cached.
     */
    public static marshalDataTween<T>(startValue: T,
                                      endValue: T,
                                      easingList: EasingFunction[],
                                      process: number,
                                      objectBoard: object = undefined): T {
        return TweenDataUtil.marshalDataTweenHandler(startValue,
            endValue,
            easingList,
            process,
            0,
            objectBoard)[0];
    }

    private static marshalDataTweenHandler<T>(startValue: T,
                                              endValue: T,
                                              easingList: EasingFunction[],
                                              process: number,
                                              index: number = 0,
                                              objectBoard: object = undefined): [T, number] {
        if (TweenDataUtil.isPrimitiveType(startValue)) {
            return [TweenDataUtil.dataTween(startValue,
                endValue as T,
                easingList[index](process)),
                index + 1];
        }
        if (!objectBoard) objectBoard = TweenDataUtil.clone(startValue as object);
        let nextIndex = index;
        Object.keys(startValue).forEach(
            item => {
                [objectBoard[item], nextIndex] = TweenDataUtil.marshalDataTweenHandler(
                    startValue[item],
                    endValue[item],
                    easingList,
                    process,
                    nextIndex);
            });

        return [objectBoard as T, nextIndex];
    }

    /**
     * Heal the RecursivePartial<T> to T by getter.
     * @param partial
     * @param getter
     * @param criterionForJs criterion who is object of T.
     */
    public static dataHeal<T>(partial: RecursivePartial<T>, getter: Getter<T>, criterionForJs: T): T {
        if (TweenDataUtil.isPrimitiveType(partial) ||
            TweenDataUtil.isSameType(partial, criterionForJs)) return partial as T;
        else return TweenDataUtil.dataOverride(partial, getter());
    }

    /**
     * Override the origin data T by RecursivePartial<T>.
     * origin may be borrowed.
     * @param partial
     * @param origin
     */
    public static dataOverride<T>(partial: RecursivePartial<T>, origin: T): T {
        if (TweenDataUtil.isPrimitiveType(origin) ||
            TweenDataUtil.isFunction(origin) ||
            this.isNullOrUndefined(origin) ||
            this.isNullOrUndefined(partial)) {
            if (this.isNullOrUndefined(partial)) {
                return origin as T;
            } else {
                return partial as T;
            }
        }

        for (const originKey in origin) {
            partial[originKey] = TweenDataUtil.dataOverride(partial[originKey], origin[originKey]);
        }

        return partial as T;
    }

    /**
     * Determine add behavior of data in Tween move.
     *
     * @param start start.
     * @param dist dist.
     */
    public static moveAdd<T>(start: T, dist: T): T {
        if (TweenDataUtil.isNumber(start) && TweenDataUtil.isNumber(dist)) {
            return (dist + start) as T;
        }

        if (TweenDataUtil.isObject(start) && TweenDataUtil.isObject(dist)) {
            const result = TweenDataUtil.clone(start);
            for (const valKey in start) {
                result[valKey] = TweenDataUtil.moveAdd(start[valKey], dist[valKey]);
            }
            return result;
        }

        return dist;
    }

    /**
     * Clone enumerable properties.
     * @param data
     */
    public static clone<T extends object>(data: T): T {
        return {...data};
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Type Guard

    /**
     * Is Primitive Type.
     * @param value
     */
    public static isPrimitiveType<T>(value: T)
        : value is T extends string | number | boolean | symbol ? T : never {
        return typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            typeof value === "symbol";
    }

    /**
     * Is Function Type.
     * @param value
     * @return {value is Function}
     */
    public static isFunction(value: unknown): value is Function {
        return typeof value === "function";
    }

    /**
     * Is Object Type.
     * @param {T} value
     * @return {value is T extends object ? T : never}
     */
    public static isObjectType<T>(value: T): value is T extends object ? T : never {
        return typeof value === "object";
    }

    /**
     * Is number.
     * @param value
     */
    public static isNumber<T>(value: T): value is T extends number ? T : never {
        return typeof value === "number";
    }

    /**
     * Is string.
     * @param value
     */
    public static isString<T>(value: T): value is T extends string ? T : never {
        return typeof value === "string";
    }

    /**
     * Is boolean.
     * @param value
     */
    public static isBoolean<T>(value: T): value is T extends boolean ? T : never {
        return typeof value === "boolean";
    }

    /**
     * Is object.
     * @param value
     */
    public static isObject<T>(value: T): value is T extends object ? T : never {
        return typeof value === "object";
    }

    /**
     * Is null or undefined.
     * @param value
     */
    public static isNullOrUndefined(value: unknown): value is null | undefined {
        return value == null;
    }

    /**
     * whether two objects have the same field.
     * @param lhs
     * @param rhs
     * @return {boolean}
     */
    public static isSameType(lhs: unknown, rhs: unknown): boolean {
        if (TweenDataUtil.isNullOrUndefined(lhs) || TweenDataUtil.isNullOrUndefined(rhs)) {
            return lhs === rhs;
        }
        if (typeof lhs !== typeof rhs) {
            return false;
        }
        if (TweenDataUtil.isObjectType(lhs) && TweenDataUtil.isObjectType(rhs)) {
            let keysInLhs = Object.keys(lhs);
            let keysInRhs = Object.keys(rhs);
            if (keysInLhs.length !== keysInRhs.length) {
                return false;
            }

            for (const keyInLhs of keysInLhs) {
                if (!keysInRhs.includes(keyInLhs)) return false;
                else if (!TweenDataUtil.isSameType(lhs[keyInLhs], rhs[keyInLhs])) return false;
            }
            return true;
        }
        return true;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}
