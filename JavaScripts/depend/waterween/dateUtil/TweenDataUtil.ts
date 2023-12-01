import { RecursivePartial } from "../RecursivePartial";
import { Getter } from "../../accessor/Getter";
import { EasingFunction } from "../../easing/Easing";

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
export default class TweenDataUtil {
//#region Data Util
    /**
     * Calculate tween data from startVal to distVal according to process.
     *
     * @param startVal val start.
     * @param distVal val end.
     * @param process process ratio.
     * @param twoPhaseTweenBorder tween border of two phase value.
     */
    public static dataTween<T>(startVal: T, distVal: T, process: number, twoPhaseTweenBorder: number = 0.5): T {
        //TODO_LviatYi 补间函数应按基本类型 参数化、客制化

        if (TweenDataUtil.isNumber(startVal) && TweenDataUtil.isNumber(distVal)) {
            return ((distVal - startVal) * process + startVal) as T;
        }

        if (TweenDataUtil.isString(startVal) && TweenDataUtil.isString(distVal)) {
            //TODO_LviatYi 待定更花式的 string 补间.
            return (process < twoPhaseTweenBorder ? startVal : distVal) as T;
        }

        if (TweenDataUtil.isBoolean(startVal) && TweenDataUtil.isBoolean(distVal)) {
            return (process < twoPhaseTweenBorder ? startVal : distVal) as T;
        }

        if (Array.isArray(startVal) && Array.isArray(distVal)) {
            //TODO_LviatYi 待定更花式的 Array 补间.
            return (process < twoPhaseTweenBorder ? startVal : distVal) as T;
        }

        if (TweenDataUtil.isObject(startVal) && TweenDataUtil.isObject(distVal)) {
            const result: T = TweenDataUtil.clone(startVal);
            Object.keys(startVal).forEach(
                item => {
                    result[item] = TweenDataUtil.dataTween(startVal[item], distVal[item], process, twoPhaseTweenBorder);
                });

            return result;
        }

        return null;
    }

    /**
     * Calculate tween data from startVal to distVal in Recursive Partial according to process.
     * @param startVal
     * @param distVal
     * @param process
     * @param twoPhaseTweenBorder
     */
    public static partialDataTween<T>(startVal: T, distVal: RecursivePartial<T>, process: number, twoPhaseTweenBorder: number = 0.5): RecursivePartial<T> {
        if (TweenDataUtil.isPrimitiveType(startVal) ||
            Object.keys(startVal).length === Object.keys(distVal).length) {
            return TweenDataUtil.dataTween(startVal, distVal as T, process, twoPhaseTweenBorder);
        }
        const result: RecursivePartial<T> = {};
        Object.keys(distVal).forEach(
            item => {
                result[item] = TweenDataUtil.partialDataTween(
                    startVal[item],
                    distVal[item],
                    process,
                    twoPhaseTweenBorder);
            });

        return result;
    }

    /**
     * easing func list tween.
     * @param startValue
     * @param endValue
     * @param easingList
     * @param process
     */
    public static marshalDataTween<T>(startValue: T, endValue: T, easingList: EasingFunction[], process: number): T {
        return TweenDataUtil.marshalDataTweenHandler(startValue, endValue, easingList, process)[0];
    }

    private static marshalDataTweenHandler<T>(startValue: T, endValue: T, easingList: EasingFunction[], process: number, index: number = 0): [T, number] {
        if (TweenDataUtil.isPrimitiveType(startValue)) {
            return [TweenDataUtil.dataTween(startValue, endValue as T, easingList[index](process)), index + 1];
        }
        const result: T = TweenDataUtil.clone(startValue);
        let nextIndex = index;
        Object.keys(startValue).forEach(
            item => {
                const [value, nextIndexTemp] = TweenDataUtil.marshalDataTweenHandler(
                    startValue[item],
                    endValue[item],
                    easingList,
                    process,
                    nextIndex);
                result[item] = value;
                nextIndex = nextIndexTemp;
            });

        return [result, nextIndex];
    }

    /**
     * Heal the partial<T> to <T> by getter.
     * @param partial
     * @param getter
     */
    public static dataHeal<T>(partial: RecursivePartial<T>, getter: Getter<T>): T {
        if (TweenDataUtil.isPrimitiveType(partial)) {
            return partial as T;
        }

        const result = getter();

        return TweenDataUtil.dataOverride(partial, result);
    }

    /**
     * Override the origin data <T> by partial<T>.
     * @param partial
     * @param origin
     */
    public static dataOverride<T>(partial: RecursivePartial<T>, origin: T): T {
        if (TweenDataUtil.isPrimitiveType(partial)) {
            return partial as T;
        }
        const result: T = TweenDataUtil.clone(origin);

        for (const partialKey in partial) {
            result[partialKey] = TweenDataUtil.dataOverride(partial[partialKey], result[partialKey]);
        }
        return result;
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
    public static clone<T>(data: T): T {
        return Object.assign({}, data);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Type Guard

    /**
     * Is Primitive Type.
     * @param value
     */
    public static isPrimitiveType<T>(value: T): value is T extends string | number | boolean | symbol ? T : never {
        return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "symbol";
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

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}
