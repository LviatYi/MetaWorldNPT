import Character = mw.Character;
import GameObject = mw.GameObject;
import UIScript = mw.UIScript;
import DataStorageResultCode = mw.DataStorageResultCode;

/**
 * GToolkit.
 * General Toolkit deep binding MW Ts.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author G.S.C. Gtk Standards Committee. Gtk 标准委员会.
 * @author LviatYi
 * @author minjia.zhang
 * @author zewei.zhang
 * @author yuanming.hu
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 31.1.6b
 * @beta
 */
class GToolkit {
//#region Constant
    /**
     * 角度限制常数.
     * @private
     */
    private static readonly DEFAULT_ANGLE_CLAMP = [-180, 180];

    /**
     * 圆周角.
     * @private
     */
    private static readonly CIRCLE_ANGLE = 360;

    /**
     * 简略精度.
     * @private
     */
    private static readonly SIMPLE_EPSILON = 1e-6;

    /**
     * 全高清分辨率.
     * @private
     */
    private static readonly FULL_HD: mw.Vector2 = new mw.Vector2(1920, 1080);

    /**
     * 全高清分辨率比例.
     * @private
     */
    private static readonly FULL_HD_RATIO: number = GToolkit.FULL_HD.x / GToolkit.FULL_HD.y;

    /**
     * 1 天 24 小时.
     * @private
     */
    private static readonly HourInDay = 24;

    /**
     * 1 小时 60 分钟.
     * @private
     */
    private static readonly MinuteInHour = 60;

    /**
     * 1 分钟 60 秒.
     * @private
     */
    private static readonly SecondInMinute = 60;

    /**
     * 1 秒 1000 毫秒.
     * @private
     */
    private static readonly MillisecondInSecond = 1000;

    /**
     * Tag of Root GameObject.
     */
    public readonly ROOT_GAME_OBJECT_GUID = "SceneRoot";

    /**
     * 全透明图片 GUID.
     * @type {string}
     */
    public readonly IMAGE_FULLY_TRANSPARENT_GUID = "168495";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member

    public defaultRandomFunc: () => number = Math.random;

    private _characterDescriptionLockers: Set<string> = new Set();
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Type Guard

    /**
     * Is Primitive mw.
     * @param value
     */
    public isPrimitiveType<T>(value: T): value is T extends string | number | boolean | symbol ? T : never {
        return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "symbol";
    }

    /**
     * Is number.
     * @param value
     */
    public isNumber<T>(value: T): value is T extends number ? T : never {
        return typeof value === "number";
    }

    /**
     * Is string.
     * @param value
     */
    public isString<T>(value: T): value is T extends string ? T : never {
        return typeof value === "string";
    }

    /**
     * Is boolean.
     * @param value
     */
    public isBoolean<T>(value: T): value is T extends boolean ? T : never {
        return typeof value === "boolean";
    }

    /**
     * Is object.
     * @param value
     */
    public isObject<T>(value: T): value is T extends object ? T : never {
        return typeof value === "object";
    }

    /**
     * 对 instance 进行强制类型推断.
     * @param instance 对象
     * @param method 对象方法名
     * @returns boolean
     */
    public is<T extends object>(instance: object, method: string | ((instance: object) => boolean)): instance is T {
        if (!instance) return false;
        if (typeof method === "string") {
            return method in instance;
        }

        return method(instance);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄1

//#region Data Guard
    /**
     * is the array or string empty.
     * define empty is undefined or null or [""].
     * @param textOrArray str or array.
     * @param checkEmpty is defined empty include "".
     *      - true default.
     */
    public isNullOrEmpty(textOrArray: string | unknown[], checkEmpty: boolean = true): boolean {
        return typeof textOrArray === "string" ?
            (checkEmpty && textOrArray === "")
            : textOrArray === undefined || textOrArray === null || (checkEmpty && textOrArray.length === 0);
    }

    /**
     * is the value null or undefined.
     * @param value
     */
    public isNullOrUndefined(value: unknown) {
        return value === null || value === undefined;
    }

    /**
     * return the safe index.
     * @param index
     * @param arr
     * @param safeStrategy 索引越界时的安全策略.
     *      - "cut" default. 截断至合法索引.
     *      - "cycle" 循环. 非法时对值取余.
     * @return 当数组为空时返回 -1. 否则按策略返回合法索引.
     */
    public safeIndex(index: number, arr: unknown[], safeStrategy: "cut" | "cycle" = "cut"): number {
        if (this.isNullOrEmpty(arr)) return -1;
        if (index < 0) switch (safeStrategy) {
            case "cycle":
                return (arr.length + index % arr.length) % arr.length;
            case "cut":
            default:
                return 0;
        }
        if (index >= arr.length) switch (safeStrategy) {
            case "cycle":
                return index % arr.length;
            case "cut":
            default:
                return arr.length - 1;
        }

        return index;
    }

    /**
     * return item by index who maybe unsafe.
     * @param index
     * @param arr
     * @param safeStrategy 索引越界时的安全策略.
     *      - "cut" default. 截断至合法索引.
     *      - "cycle" 循环. 非法时对值取余.
     * @return 当数组为空时返回 null. 否则按策略返回合法元素.
     */
    public safeIndexItem<T>(index: number, arr: T[], safeStrategy: "cut" | "cycle" = "cut"): T {
        let safeIndex = this.safeIndex(index, arr, safeStrategy);
        return safeIndex === -1 ? null : arr[safeIndex];
    }

    /**
     * remove item from array.
     * @param array
     * @param item
     */
    public remove<T>(array: T[], item: T): boolean {
        if (!array) return;
        const index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * build an advanced switch.
     */
    public switch(): Switcher {
        return new Switcher();
    };

    /**
     * fold data.
     * @param data
     * @param foldCount
     * @param func
     */
    public fold<UF, F>(data: UF[], foldCount: number, func: (data: UF[]) => F): F[] {
        const result: F[] = [];
        for (let i = 0; i < data.length; i += foldCount) {
            result.push(func(data.slice(i, i + foldCount)));
        }

        return result;
    }

    /**
     * unfold data.
     * @param data
     * @param foldCount
     * @param func
     */
    public unfold<F, UF>(data: F[], foldCount: number, func: (data: F) => UF[]): UF[] {
        const result: UF[] = [];

        for (const element of data) {
            result.push(...func(element));
        }

        return result;
    }

    /**
     * do callback once when predicate return true.
     * @param predicate
     * @param callback
     * @param interval test predicate interval. ms.
     *      - 100 default.
     * @param instant test predicate at once.
     * @param timeout timeout. stop predicate test after timeout. ms.
     *      - 0 default. no timeout.
     * @param onError on error callback.
     * @param onTimeout on timeout callback.
     * @return interval hold id.
     */
    public doWhenTrue(predicate: () => boolean,
                      callback: () => void,
                      interval: number = 100,
                      instant: boolean = true,
                      timeout: number = 0,
                      onError: Expression<void> = undefined,
                      onTimeout: Expression<void> = undefined,): number | null {
        const startTime = Date.now();
        let holdId = null;
        const callbackWithCatch = () => {
            try {
                callback();
            } catch (e) {
                try {
                    onError && onError();
                } catch {
                }
            } finally {
                holdId && clearInterval(holdId);
            }
        };
        if (instant && predicate()) {
            callbackWithCatch();
            return null;
        }

        holdId = mw.setInterval(() => {
                if (timeout > 0 && Date.now() - startTime > timeout) {
                    clearInterval(holdId);
                    onTimeout && onTimeout();
                    return;
                }
                if (!predicate()) return;
                callbackWithCatch();
            },
            interval,
        );

        return holdId;
    }

    /**
     * do callback persistently until predicate return true.
     * @param predicate
     * @param callback
     * @param interval ms. test predicate interval.
     *      100 default.
     * @param instant test predicate at once.
     * @param timeout timeout. stop predicate test after timeout. ms.
     *      - 0 default. no timeout.
     * @param onError on error callback.
     * @param onTimeout on timeout callback.
     * @return interval hold id.
     */
    public doUntilTrue(predicate: () => boolean,
                       callback: () => void,
                       interval: number = 100,
                       instant: boolean = true,
                       timeout: number = 0,
                       onError: Expression<void> = undefined,
                       onTimeout: Expression<void> = undefined,): number | null {
        const startTime = Date.now();
        let holdId = null;
        const callbackWithCatch = () => {
            try {
                callback();
            } catch (e) {
                try {
                    onError && onError();
                } catch {
                }
            } finally {
                holdId && clearInterval(holdId);
            }
        };
        if (instant) {
            if (predicate()) return null;
            else callbackWithCatch();
        }

        holdId = mw.setInterval(() => {
                if (timeout > 0 && Date.now() - startTime > timeout) {
                    clearInterval(holdId);
                    onTimeout && onTimeout();
                    return;
                }
                if (predicate()) {
                    clearInterval(holdId);
                    return;
                }
                callbackWithCatch();
            },
            interval,
        );

        return holdId;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Prototype
    /**
     * 获取所有成员 key.
     * @param obj 指定实例.
     * @param exceptConstructor 是否 排除构造函数.
     * @param exceptObject 是否 排除 Js Object.
     */
    public getAllMember(obj: object, exceptConstructor: boolean = true, exceptObject: boolean = true): string[] {
        const props: string[] = [];
        let focus = obj;
        do {
            if (exceptObject && focus === Object.prototype) {
                break;
            }
            props.push(...Object.getOwnPropertyNames(focus).filter(item => !(exceptConstructor && item === "constructor")));
        }
        while (focus = Object.getPrototypeOf(focus));

        return props;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Math
    /**
     * angle to radius.
     * @param angle
     */
    public radius(angle: number): number {
        return angle / 180 * Math.PI;
    }

    /**
     * radius to angle.
     * @param radius
     */
    public angle(radius: number): number {
        return radius / Math.PI * 180;
    }

    /**
     * random in range [min,max).
     * @param min default 0.
     * @param max default min + 1.
     * @param integer return a integer.
     */
    public random(min: number = undefined, max: number = undefined, integer: boolean = false): number {
        if (min === undefined) {
            min = 0;
        }
        if (max === undefined) {
            max = min + 1;
        }

        let result = Math.random() * (max - min) + min;

        return integer ? result | 0 : result;
    }

    /**
     * random with weight.
     * @param weight
     * @param total total weight. add last weight as total-sum(weight)
     * @return number [0,weight.length)
     */
    public randomWeight(weight: number[], total: number = undefined): number {
        const stepWeight = new Array<number>(weight.length);
        for (let i = 0; i < weight.length; i++) {
            stepWeight[i] = (i === 0 ? 0 : stepWeight[i - 1]) + weight[i];
        }
        if (total !== undefined && total > stepWeight[stepWeight.length - 1]) {
            stepWeight.push(total);
        }

        const r = this.random(0, stepWeight[stepWeight.length - 1]);
        let start: number = 0;
        let end = stepWeight.length;
        while (start < end) {
            let mid = ((start + end) / 2) | 0;
            if (r < stepWeight[mid]) {
                end = mid;
            } else {
                start = mid + 1;
            }
        }
        return start;
    }

    /**
     * random in array.
     * return null when array invalid or length is zero.
     * @param array
     */
    public randomArrayItem<T>(array: Array<T>): T | null {
        if (!array || array.length === 0) return null;
        return array[this.random(0, array.length, true)];
    }

    /**
     * random shuffle the order from 0 to count.
     * Fisher–Yates.
     * @param count
     */
    public randomShuffleOrder(count: number): number[] {
        const result = new Array<number>(count);
        for (let i = 0; i < count; i++) {
            result[i] = i;
        }
        for (let i = count - 1; i > 0; i--) {
            const j = this.random(0, i, true);
            result[i] = result[i] ^ result[j];
            result[j] = result[i] ^ result[j];
            result[i] = result[i] ^ result[j];
        }
        return result;
    }

    /**
     * random shuffle the array.
     * Fisher–Yates.
     * @param items
     */
    public randomShuffleArray<T>(items: T[]): T[] {
        if (this.isNullOrEmpty(items)) return [];
        const count = items.length;
        const result = [...items];
        for (let i = count - 1; i > 0; i--) {
            const j = this.random(0, i, true);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * Get a random generator.
     * @param {number | number[]} length length or scale.
     * @return {RandomGenerator}
     */
    public randomGenerator(length: number | number[] = 3): RandomGenerator {
        return new RandomGenerator().random(3, this.defaultRandomFunc);
    }

    /**
     * Generate a random point located on the surface of a unit sphere in an arbitrary number of dimensions,
     * by Box-Muller transform and normalization.
     * @param dimension
     * @param randomFunc
     */
    public randomDimensionSphere(dimension: number = 2, randomFunc = undefined): number[] {
        if (dimension < 0 || dimension != (dimension | 0)) return [];
        if (randomFunc === undefined) {
            randomFunc = this.defaultRandomFunc;
        }
        if (dimension === 1) {
            return randomFunc() >= 0.5 ? [1] : [-1];
        }
        if (dimension === 2) {
            const angle = Math.random() * 2 * Math.PI;
            return [Math.cos(angle), Math.sin(angle)];
        }

        const ans: number[] = new Array<number>(dimension);

        let d2: number = Math.floor(dimension >> 1) << 1;
        let r2: number = 0;

        for (let i = 0; i < d2; i += 2) {
            const rr = -2.0 * Math.log(randomFunc());
            const r = Math.sqrt(rr);
            const theta = 2.0 * Math.PI * randomFunc();

            r2 += rr;
            ans[i] = r * Math.cos(theta);
            ans[i + 1] = r * Math.sin(theta);
        }

        if (dimension % 2) {
            const x = Math.sqrt(-2.0 * Math.log(randomFunc())) * Math.cos(2.0 * Math.PI * randomFunc());
            ans[dimension - 1] = x;
            r2 += Math.pow(x, 2);
        }

        const h = 1.0 / Math.sqrt(r2);

        for (let i = 0; i < dimension; ++i) {
            ans[i] *= h;
        }

        return ans;
    }

    /**
     * return a new vector whose value is vec1 - vec2.
     * @param vec1 vector1
     * @param vec2 vector2
     */
    public vector2Minus(vec1: mw.Vector2, vec2: mw.Vector2) {
        return new mw.Vector2(vec1.x - vec2.x, vec1.y - vec2.y);
    }

    /**
     * return a new vector whose value is vec / divisor.
     * @param vec vector
     * @param divisor divisor
     */
    public vector2Div(vec: mw.Vector2, divisor: number) {
        return new mw.Vector2(vec.x / divisor, vec.y / divisor);
    }

    public newWithX(vec: mw.Vector, val: number): mw.Vector;

    public newWithX(vec: mw.Vector2, val: number): mw.Vector2;

    public newWithX(vec: mw.Rotation, val: number): mw.Rotation;

    /**
     * clone a new vector with a new x.
     * @param vec origin vector.
     * @param val new value.
     */
    public newWithX(vec: mw.Vector | mw.Vector2 | mw.Rotation, val: number) {
        if (vec instanceof mw.Vector) {
            return new mw.Vector(val, vec.y, vec.z);
        } else if (vec instanceof mw.Rotation) {
            return new mw.Rotation(val, vec.y, vec.z);
        } else if (vec instanceof mw.Vector2) {
            return new mw.Vector2(val, vec.y);
        }
    }

    public newWithY(vec: mw.Vector, val: number): mw.Vector;

    public newWithY(vec: mw.Vector2, val: number): mw.Vector2;

    public newWithY(vec: mw.Rotation, val: number): mw.Rotation;

    /**
     * clone a new vector with a new y.
     * @param vec origin vector.
     * @param val new value.
     */
    public newWithY(vec: mw.Vector | mw.Vector2 | mw.Rotation, val: number) {
        if (vec instanceof mw.Vector) {
            return new mw.Vector(vec.x, val, vec.z);
        } else if (vec instanceof mw.Rotation) {
            return new mw.Rotation(vec.x, val, vec.z);
        } else if (vec instanceof mw.Vector2) {
            return new mw.Vector2(vec.x, val);
        }
    }

    public newWithZ(vec: mw.Vector, val: number): mw.Vector;

    public newWithZ(vec: mw.Rotation, val: number): mw.Rotation;

    /**
     * clone a new vector with a new z.
     * @param vec origin vector.
     * @param val new value.
     */
    public newWithZ(vec: mw.Vector | mw.Rotation, val: number) {
        if (vec instanceof mw.Vector) {
            return new mw.Vector(vec.x, vec.y, val);
        } else if (vec instanceof mw.Rotation) {
            return new mw.Rotation(vec.x, vec.y, val);
        }
    }

    /**
     * 计算向量 a 至 b 之间的四元数.
     * @param lhs
     * @param rhs
     * @param fallbackAxis 回退轴. 当 lhs 与 rhs 共线时使用.
     */
    public quaternionBetweenVector(lhs: mw.Vector, rhs: mw.Vector, fallbackAxis: mw.Vector = undefined): mw.Quaternion {
        if (this.equal(lhs, rhs, GToolkit.SIMPLE_EPSILON)) {
            return mw.Quaternion.identity;
        }

        let axis = mw.Vector.cross(lhs, rhs);
        if (Math.abs(axis.length) < GToolkit.SIMPLE_EPSILON) {
            if (fallbackAxis !== undefined) {
                if (mw.Vector.dot(fallbackAxis, lhs) !== 0) {
                    axis = fallbackAxis;
                } else {
                    console.warn("fallback Axis is not valid.");
                }
            }

            if (axis.length === 0) {
                axis = mw.Vector.cross(lhs, mw.Vector.right);
            }
            if (axis.length === 0) {
                axis = mw.Vector.cross(lhs, mw.Vector.up);
            }
        }

        const angle = mw.Vector.angle3D(lhs, rhs);
        return mw.Quaternion.fromAxisAngle(axis.normalized, this.radius(angle));

    }

    /**
     * 格式化 Timestamp 至 00:00.
     *
     * @param timestamp
     * @param option 选择需显示的时间维度.
     */
    public formatTimeFromTimestamp(timestamp: number, option: TimeFormatDimensionFlagsLike = TimeFormatDimensionFlags.Second | TimeFormatDimensionFlags.Minute): string {
        const date = new Date(timestamp);
        let result = "";
        if ((option & TimeFormatDimensionFlags.Hour) > 0) {
            const hour = date.getHours().toString().padStart(2, "0");
            if (result.length > 0) {
                result += ":";
            }
            result += hour;
        }
        if ((option & TimeFormatDimensionFlags.Minute) > 0) {
            const minutes = date.getMinutes().toString().padStart(2, "0");
            if (result.length > 0) {
                result += ":";
            }
            result += minutes;
        }
        if ((option & TimeFormatDimensionFlags.Second) > 0) {
            const seconds = date.getSeconds().toString().padStart(2, "0");
            if (result.length > 0) {
                result += ":";
            }
            result += seconds;
        }
        return result;
    };

    /**
     * //TODO_LviatYi [待补完]
     * 等值判断.
     * @param lhs
     * @param rhs
     * @param epsilon 精度误差.
     * @alpha
     */
    public equal<T>(lhs: T, rhs: T, epsilon: T | number = Number.EPSILON): boolean {
        if (this.isNumber(lhs)) {
            return Math.abs(lhs - (rhs as number)) < (epsilon as number);
        }
        if (lhs instanceof mw.Vector && rhs instanceof mw.Vector) {
            if (typeof epsilon === "number") {
                return this.equal(lhs.x, rhs.x, epsilon) &&
                    this.equal(lhs.y, rhs.y, epsilon) &&
                    this.equal(lhs.z, rhs.z, epsilon);
            } else if (epsilon instanceof mw.Vector) {
                return this.equal(lhs.x, rhs.x, epsilon.x) &&
                    this.equal(lhs.y, rhs.y, epsilon.y) &&
                    this.equal(lhs.z, rhs.z, epsilon.z);
            }
        }

        return false;
    }

    /**
     * 时间转换.
     * 支持的时间单位范围：[毫秒,天]
     * @param val 原值.
     * @param from 原值时间维度.
     * @param to 目标时间维度.
     * @return {null} 入参在不支持的范围内时.
     */
    public timeConvert(val: number, from: TimeFormatDimensionFlagsLike, to: TimeFormatDimensionFlagsLike): number {
        if (from === to) return val;
        if (this.hammingWeight(from) !== 1 || this.hammingWeight(to) !== 1) return null;

        if (
            (0x1 << this.bitFirstOne(from)) as TimeFormatDimensionFlags > TimeFormatDimensionFlags.Day ||
            (0x1 << this.bitFirstOne(to)) as TimeFormatDimensionFlags > TimeFormatDimensionFlags.Day
        ) {
            return null;
        }

        while (from !== to) {
            if (from > to) {
                switch (from) {
                    case TimeFormatDimensionFlags.Second:
                        val *= GToolkit.MillisecondInSecond;
                        break;
                    case TimeFormatDimensionFlags.Minute:
                        val *= GToolkit.SecondInMinute;
                        break;
                    case TimeFormatDimensionFlags.Hour:
                        val *= GToolkit.MinuteInHour;
                        break;
                    case TimeFormatDimensionFlags.Day:
                        val *= GToolkit.HourInDay;
                        break;
                    default:
                        break;
                }
                from >>= 0x1;
            } else {
                switch (from) {
                    case TimeFormatDimensionFlags.Millisecond:
                        val /= GToolkit.MillisecondInSecond;
                        break;
                    case TimeFormatDimensionFlags.Second:
                        val /= GToolkit.SecondInMinute;
                        break;
                    case TimeFormatDimensionFlags.Minute:
                        val /= GToolkit.MinuteInHour;
                        break;
                    case TimeFormatDimensionFlags.Hour:
                        val /= GToolkit.HourInDay;
                        break;
                    default:
                        break;
                }
                from <<= 0x1;
            }
        }
        return val;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Geometry

    /**
     * Manhattan Distance.
     * 曼哈顿距离.
     * 当 b 为 null 时 将 a 视为向量. 并计算其长度平方.
     */
    public manhattanDistance(a: number[] | GtkTypes.Vector2 | GtkTypes.Vector3, b: number[] | GtkTypes.Vector2 | GtkTypes.Vector3 = null): number {
        let result = 0;
        if (a instanceof Array) {
            if (b && a.length !== (b as Array<number>).length) return result;

            for (let i = 0; i < a.length; i++) {
                result += Math.abs(a[i] - (b ? b[i] : 0));
            }

            return result;
        } else {
            result = Math.abs(a.x - (b ? (b as GtkTypes.Vector3).x : 0)) +
                Math.abs(a.y - (b ? (b as GtkTypes.Vector3).y : 0));
            if ("z" in a) {
                result += Math.abs(a.z as number - (b ? (b as GtkTypes.Vector3).z : 0));
            }
            return result;
        }
    }

    /**
     * Squared Euclid Distance.
     * 两点欧几里得距离的平方.
     * 当 b 为 null 时 将 a 视为向量. 并计算其长度平方.
     * @param a
     * @param b
     */
    public squaredEuclideanDistance<T extends (number[] | GtkTypes.Vector2 | GtkTypes.Vector3)>(a: T, b: T = null): number {
        let result = 0;
        if (a instanceof Array) {
            if (b && a.length !== (b as Array<number>).length) return result;

            for (let i = 0; i < a.length; i++) {
                result += Math.pow(a[i] - (b ? b[i] : 0), 2);
            }

            return result;
        } else {
            result = Math.pow(a.x - (b ? (b as GtkTypes.Vector3).x : 0), 2) +
                Math.pow(a.y - (b ? (b as GtkTypes.Vector3).y : 0), 2);
            if ("z" in a) {
                result += Math.pow(a.z as number - (b ? (b as GtkTypes.Vector3).z : 0), 2);
            }
            return result;
        }
    }

    /**
     * Euclid Distance.
     * 欧几里得距离.
     * 当 b 为 null 时 将 a 视为向量. 并计算其长度.
     * @param a
     * @param b
     */
    public euclideanDistance(a: number[], b: number[] = null): number {
        return Math.sqrt(this.squaredEuclideanDistance(a, b));
    }

    /**
     * Clamp for angle.
     * @param angle
     * @param min
     * @param max
     */
    public angleClamp(angle: number, min: number = -180, max: number = 180): number {
        if (angle < GToolkit.DEFAULT_ANGLE_CLAMP[0]) {
            angle += GToolkit.CIRCLE_ANGLE;
        } else if (angle >= GToolkit.DEFAULT_ANGLE_CLAMP[1]) {
            angle -= GToolkit.CIRCLE_ANGLE;
        }

        return Math.min(max, Math.max(min, angle));
    }

    /**
     * 将 origin 向量围绕 axis 轴旋转 angle 角度.
     * @param origin 初始向量.
     * @param axis
     * @param angle
     */
    public rotateVector(origin: Vector, axis: Vector, angle: number) {
        const quaternion = Quaternion.fromAxisAngle(axis.normalized, this.radius(angle));
        return quaternion.toRotation().rotateVector(origin);
    }

    public expandToArray() {

    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Bit

    /**
     * 汉明重量.
     * num 作为二进制时 1 的个数.
     * @param num
     */
    public hammingWeight(num: number): number {
        let result: number = 0;
        let handle: number = 0;
        while ((0x1 << handle) <= num) {
            if ((num & 0x1 << handle) > 0) {
                ++result;
            }
            ++handle;
        }
        return result;
    }

    /**
     * num 的二进制形式中第一个 1 的位置.
     * @param num
     * @return {number} 位置.
     *      {-1} 时入参不合法.
     */
    public bitFirstOne(num: number): number {
        if ((num | 0) !== num) return -1;

        let handle: number = 0;
        while ((0x1 << handle) <= num) ++handle;
        return handle - 1;
    }

    /**
     * num 的二进制形式中指定数位是否为 1.
     * @param num
     * @param bit 从右向左数第 bit 位.
     */
    public bitIn(num: number, bit: number): boolean {
        return (num & (0x1 << bit)) > 0;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//# region Coordinate System
    /**
     * 屏幕坐标系 转 UI 坐标系.
     * @param location
     */
    public screenToUI(location: mw.Vector2): mw.Vector2 {
        return location.divide(mw.getViewportScale());
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Game Object
    /**
     * 泛型获取 GameObject.
     * @param guid
     */
    public getGameObjectByGuid<T>(guid: string): T | null {
        return (GameObject.findGameObjectById(guid) ?? null) as T;
    }

    /**
     * 获取 GameObject 及其子 GameObject 下的所有指定脚本.
     * @param object
     * @param scriptCls
     * @param traverse 遍历深度. 从 1 计数.
     *      0 default. 无限遍历.
     */
    public getComponent<T extends mw.Script>(
        object: GameObject,
        scriptCls: AbstractAllowClass<T>,
        traverse: number = 0): T[] {
        if (!object) return [];

        const result: T[] = [];

        let traversed: number = 0;
        let stack: GameObject[] = [object];
        let cache: GameObject[] = [];

        do {
            for (const go of stack) {
                cache.push(...go.getChildren());
                result.push(...go.getComponents(scriptCls as Constructor<T>));
            }
            stack = cache;
            cache = [];
            ++traversed;
        } while (stack.length > 0 && (traverse === 0 || (traversed < traverse)));

        return result;
    }

    /**
     * 获取 GameObject 及其子 GameObject 下的首个指定脚本.
     * @param object
     * @param scriptCls
     * @param traverse 遍历深度. 从 1 计数.
     *      0 default. 无限遍历.
     */
    public getFirstComponent<T extends mw.Script>(object: GameObject,
                                                  scriptCls: AbstractAllowClass<T>,
                                                  traverse: number = 0): T | null {
        if (!object) return null;

        let traversed: number = 0;
        let stack: GameObject[] = [object];
        let cache: GameObject[] = [];

        do {
            for (const go of stack) {
                cache.push(...go.getChildren());
                const script = go.getComponent(scriptCls as Constructor<T>);
                if (script) return script as T;
            }
            stack = cache;
            cache = [];
            ++traversed;
        } while (stack.length > 0 && (traverse === 0 || (traversed < traverse)));

        return null;
    }


    /**
     * 获取 GameObject 及其子 GameObject 下的所有指定脚本.
     * @param object
     * @param method
     * @param traverse 遍历深度. 从 1 计数.
     *      0 default. 无限遍历.
     */
    public getComponentIs<T extends mw.Script>(
        object: GameObject,
        method: string | ((instance: object) => boolean),
        traverse: number = 0): T[] {
        if (!object) return [];

        const result: T[] = [];

        let traversed: number = 0;
        let stack: GameObject[] = [object];
        let cache: GameObject[] = [];

        do {
            for (const go of stack) {
                cache.push(...go.getChildren());
                result.push(...go.getComponents()
                    .filter(script => this.is<T>(script, method))
                    .map((value) => (value as T)));
            }
            stack = cache;
            cache = [];
            ++traversed;
        } while (stack.length > 0 && (traverse === 0 || (traversed < traverse)));

        return result;
    }

    /**
     * 获取 GameObject 及其子 GameObject 下的首个指定脚本.
     * @param object
     * @param method
     * @param traverse 遍历深度. 从 1 计数.
     *      0 default. 无限遍历.
     */
    public getFirstComponentIs<T extends mw.Script>(object: GameObject,
                                                    method: string | ((instance: object) => boolean),
                                                    traverse: number = 0): T | null {
        if (!object) return null;

        let traversed: number = 0;
        let stack: GameObject[] = [object];
        let cache: GameObject[] = [];

        do {
            for (const go of stack) {
                cache.push(...go.getChildren());
                const script = go.getComponents().find((s) => {
                    return this.is(s, method);
                });
                if (script) return script as T;
            }
            stack = cache;
            cache = [];
            ++traversed;
        } while (stack.length > 0 && (traverse === 0 || (traversed < traverse)));

        return null;
    }

    /**
     * 获取 GameObject 及其子 GameObject 下的所有同名 GameObject.
     * @param object
     * @param name
     */
    public getGameObject(object: GameObject, name: string): GameObject[] {
        if (!object) return [];

        const result: GameObject[] = [];

        let p: GameObject = object;
        let stack: GameObject[] = [p];

        while (stack.length > 0) {
            p = stack.shift();
            stack.push(...p.getChildren());
            result.push(...p.getChildren()
                .filter(g => g.name === name));
        }

        return result;
    }

    /**
     * 获取 GameObject 及其子 GameObject 下的首个同名 GameObject.
     * @param object
     * @param name
     */
    public getFirstGameObject(object: GameObject, name: string): GameObject | null {
        if (!object) return null;

        let p: GameObject = object;
        let stack: GameObject[] = [p];

        while (stack.length > 0) {
            p = stack.shift();
            stack.push(...p.getChildren());
            const result = p.getChildren().find((g) => {
                return g.name === name;
            });
            if (result) return result;
        }

        return null;
    }

    /**
     * 获取 GameObject 指定层数的所有子 GameObject.
     * @param object
     * @param traverse 遍历深度. 从 1 计数.
     *      - default undefined.
     *      - null 或 undefined 无限遍历.
     */
    public getChildren(object: GameObject, traverse: number = undefined): GameObject[] {
        if (!object) return [];

        let result: GameObject[] = [...object.getChildren()];

        let p: number = 0;
        let traversed: number = 1;
        while (p < result.length && (this.isNullOrUndefined(traverse) || traversed < traverse)) {
            const currLength = result.length;
            for (; p < currLength; ++p) {
                result.push(...result[p].getChildren());
            }
            ++traversed;
        }

        return result;
    }

    /**
     * 获取场景中的根 GameObject.
     */
    public getRootGameObject(): mw.GameObject {
        return mw.GameObject.findGameObjectById(this.ROOT_GAME_OBJECT_GUID);
    }

    /**
     * 在场景中的根 GameObject 上挂载脚本.
     */
    public addRootScript<T extends mw.Script>(scriptCls: Constructor<T>): T {
        let root = this.getRootGameObject();

        if (!root) root = GameObject.spawn("Anchor", {
            replicates: false,
        });

        return root.addComponent(scriptCls);
    }

    /**
     * 在场景中的根 GameObject 上获取脚本.
     * @param {Constructor<T>} scriptCls
     * @return {T | null}
     */
    public getRootScript<T extends mw.Script>(scriptCls: Constructor<T>): T | null {
        return this.getRootGameObject()?.getComponent(scriptCls) ?? null;
    }

    /**
     * 在场景中的根 GameObject 上获取所有脚本.
     * @param {Constructor<T>} scriptCls
     * @return {T[] | null}
     */
    public getRootScripts<T extends mw.Script>(scriptCls: Constructor<T>): T[] | null {
        return this.getRootGameObject()?.getComponents(scriptCls) ?? null;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Character
    /**
     * 角色 性别.
     */
    public gender(character: mw.Character): GenderTypes {

        let type = character.getDescription().advance.base.characterSetting.somatotype;

        if (
            type === mw.SomatotypeV2.AnimeMale ||
            type === mw.SomatotypeV2.LowpolyAdultMale ||
            type === mw.SomatotypeV2.RealisticAdultMale ||
            type === mw.SomatotypeV2.CartoonyMale
        ) {
            return GenderTypes.Male;
        } else if (
            type === mw.SomatotypeV2.AnimeFemale ||
            type === mw.SomatotypeV2.LowpolyAdultFemale ||
            type === mw.SomatotypeV2.RealisticAdultFemale ||
            type === mw.SomatotypeV2.CartoonyFemale
        ) {
            return GenderTypes.Female;
        } else {
            return GenderTypes.Helicopter;
        }
    }

    /**
     * GameObject 是否为 Character.
     * @param obj
     */
    public isCharacter(obj: GameObject): obj is Character {
        return (obj instanceof Character) && obj.player !== null;
    }

    /**
     * 是否 playerId gameObjectId 或 obj 指向自己.
     * @scope 仅客户端.
     * @param idOrObj
     */
    public isSelfCharacter(idOrObj: number | string | GameObject) {
        if (!SystemUtil.isClient()) {
            return false;
        }
        const self: Player = Player.localPlayer;

        if (typeof idOrObj === "number") {
            return self.playerId === idOrObj;
        } else if (typeof idOrObj === "string") {
            return self.character.gameObjectId === idOrObj;
        } else {
            return this.isCharacter(idOrObj) && idOrObj.player === self;
        }
    }

    /**
     * playerId 与 player 获取 player.
     * @param player
     */
    public queryPlayer(player: number | Player) {
        if (typeof player === "number") {
            return Player.getPlayer(player);
        }
        return player;
    }

    /**
     * 获取角色胶囊体 下圆心坐标.
     * @param character
     */
    public getCharacterCapsuleLowerCenter(character: mw.Character): mw.Vector {
        return character.worldTransform.position.add(this.getCharacterCapsuleLowerCenterRelative(character));
    }

    /**
     * 获取角色胶囊体 下圆心相对坐标.
     * @param character
     */
    public getCharacterCapsuleLowerCenterRelative(character: mw.Character): mw.Vector {
        let pVec = this.getCharacterCapsuleLowerCenterVector(character).multiply(character.worldTransform.scale.z);
        pVec = character.localTransform.rotation.rotateVector(pVec);

        return pVec;
    }

    /**
     * 获取角色胶囊体 下圆心 相对于角色位置 向量.
     * 主管的 不受角色属性影响.
     * @param character
     */
    public getCharacterCapsuleLowerCenterVector(character: mw.Character): mw.Vector {
        const rectHalfHeight = character.collisionExtent.z - character.collisionExtent.x;
        return mw.Vector.down.multiply(rectHalfHeight);
    }

    /**
     * 获取角色胶囊体 底部点.
     * @param character
     */
    public getCharacterCapsuleBottomPoint(character: mw.Character): mw.Vector {
        let pVec = mw.Vector.down.multiply(character.collisionExtent.z * character.worldTransform.scale.z);
        pVec = character.localTransform.rotation.rotateVector(pVec);

        return character.worldTransform.position.add(pVec);
    }

    /**
     * 获取角色胶囊体 底部点.
     * @param character
     */
    public getCharacterCapsuleBottomPointRelative(character: mw.Character): mw.Vector {
        let pVec = mw.Vector.down.multiply(character.collisionExtent.z * character.worldTransform.scale.z);
        pVec = character.localTransform.rotation.rotateVector(pVec);

        return pVec;
    }

    /**
     * 安全设置 Character Description.
     * @param character
     * @param description
     * @return set interval character state.
     */
    public safeSetDescription(character: mw.Character, description: string): boolean | null {
        if (!character || this.isNullOrEmpty(character?.gameObjectId)) return false;
        if (this._characterDescriptionLockers.has(character.gameObjectId)) return false;
        this._characterDescriptionLockers.add(character.gameObjectId);
        character
            .asyncReady()
            .then(
                () => {
                    this.doWhenTrue(
                        () => character.isDescriptionReady,
                        () => {
                            character.setDescription([description]);
                            this._characterDescriptionLockers.delete(character.gameObjectId);
                        },
                    );
                },
            );
        return true;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region UI
    /**
     * 设置 Button Guid.
     * 默认将 normalImageGuid 传播至:
     *   normalImageGuid
     *   pressedImageGuid
     *   disableImageGuid
     * @param button
     * @param normalGuid
     * @param pressedGuid
     * @param disableGuid
     */
    public setButtonGuid(button: mw.Button | mw.StaleButton,
                         normalGuid: string,
                         pressedGuid: string = undefined,
                         disableGuid: string = undefined) {
        if (!pressedGuid) {
            pressedGuid = normalGuid;
        }
        if (!disableGuid) {
            disableGuid = normalGuid;
        }
        button.normalImageGuid = normalGuid;
        button.pressedImageGuid = pressedGuid;
        button.disableImageGuid = disableGuid;
    }

    /**
     * 尝试设置 UI 可见性.
     * 当不需改变时不设置.
     *
     * @param ui
     * @param visibility
     *  当为 boolean 时 将按照常用策略将 true 映射为 {@link mw.SlateVisibility.Visible} 或 {@link mw.SlateVisibility.SelfHitTestInvisible}.
     * @param syncEnable 是否同步设置 enable.
     *      true default. 当 ui 为 {@link mw.Button} 或 {@link mw.StaleButton} 时 将根据 visibility 同步设置 enable.
     * @return 返回是否发生实际更改.
     */
    public trySetVisibility(ui: mw.Widget, visibility: mw.SlateVisibility | boolean, syncEnable: boolean = true): boolean {
        if (typeof visibility === "boolean") {
            if (ui instanceof mw.Button || ui instanceof mw.StaleButton) {
                visibility = visibility ? mw.SlateVisibility.Visible : mw.SlateVisibility.Hidden;
            } else {
                visibility = visibility ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Hidden;
            }
        }

        if (syncEnable && (ui instanceof mw.Button || ui instanceof mw.StaleButton)) {
            ui.enable = visibility === mw.SlateVisibility.Visible;
        }
        if (ui.visibility === visibility) {
            return false;
        }

        ui.visibility = visibility;
        return true;
    }

    /**
     * 尝试设置 UI 文本性.
     * @param {mw.Text} ui
     * @param {string} text
     * @return {boolean}
     */
    public trySetText(ui: mw.TextBlock, text: string): boolean {
        if (ui.text === text) return false;
        ui.text = text;
        return true;
    }

    /**
     * 是否 给定平台绝对坐标 在 UI 控件内.
     * @param ui
     * @param position
     */
    public isPlatformAbsoluteInWidget(position: mw.Vector2, ui: Widget) {
        const absPos = ui.cachedGeometry.getAbsolutePosition();
        const absSize = ui.cachedGeometry.getAbsoluteSize();

        return position.x >= absPos.x &&
            position.x <= absPos.x + absSize.x &&
            position.y >= absPos.y &&
            position.y <= absPos.y + absSize.y;
    }

    /**
     * 获取指定 uiScript 列表下的 最上层 ui.
     * @desc 仅当
     * @param uis
     */
    public getTopUi(uis: UIScript[]): UIScript | null {
        if (this.isNullOrEmpty(uis)) return null;
        let topUi: UIScript = uis[0];
        if (!(topUi?.uiObject ?? null)) return null;
        for (let i = 1; i < uis.length; ++i) {
            const ui = uis[i];
            if (!(ui?.uiObject ?? null)) continue;
            if (ui.layer > topUi.layer ||
                (ui.uiObject["slot"]?.zOrder ?? -1) > (topUi.uiObject["slot"]?.zOrder ?? -1)) topUi = ui;
        }

        return topUi ?? null;
    }

    /**
     * 获取 Ui 指定层数的所有子 Ui.
     * @param object
     * @param traverse 遍历深度. 从 1 计数.
     *      - default 1.
     *      - null 或 undefined 无限遍历.
     */
    public getUiChildren<Item = Widget>(object: Widget, traverse: number = 1): Item[] {
        if (!object) return [];

        let result: Item[] = [];
        for (let i = 0; i < object.getChildrenCount(); ++i) result.push(object.getChildAt(i) as Item);

        let p: number = 0;
        let traversed: number = 1;
        while (p < result.length && (this.isNullOrUndefined(traverse) || traversed < traverse)) {
            const currLength = result.length;
            for (; p < currLength; ++p) {
                for (let i = 0; i < (result[p] as Widget).getChildrenCount(); ++i)
                    result.push((result[p] as Widget).getChildAt(i) as Item);
            }

            ++traversed;
        }

        return result;
    }

    /**
     * 使用 x,y 而非 Vector2 直接设定 UI 位置.
     * @param {Widget} ui
     * @param {number} x
     * @param {number} y
     */
    public setUiPosition(ui: Widget, x: number, y: number) {
        try {
            ui["get"]()["SetPosition"](x, y);
        } catch (e) {
            ui.position = new mw.Vector2(x, y);
        }
    }

    /**
     * 使用 x,y 而非 Vector2 直接设定 UI 缩放.
     * @param {Widget} ui
     * @param {number} x
     * @param {number} y
     */
    public setUiScale(ui: Widget, x: number, y: number) {
        try {
            if (!ui["_setRenderScale"]) {
                ui["_setRenderScale"] = new mw.Vector2(x, y)["toUEVector2D"]();
            } else {
                ui["_setRenderScale"].x = x;
                ui["_setRenderScale"].y = y;
            }
            ui["w"]["SetRenderScale"](this["_setRenderScale"]);
        } catch (_) {
            ui.renderScale = new mw.Vector2(x, y);
        }
    }


//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Sensor
    /**
     * 垂直地形侦测.
     * 从起始点创建一条垂直向下的射线 返回命中到任何其他物体的命中点信息.
     * @param startPoint 起始点.
     * @param length 侦测距离.
     * @param self 自身 不参与检测.
     * @param ignoreObjectGuids 忽略物体 Guid.
     * @param debug 是否 绘制调试线.
     * @return hitPoint 命中首个点的命中信息 当未命中时返回 null.
     */
    public detectVerticalTerrain(startPoint: mw.Vector,
                                 length: number = 1000,
                                 self: mw.GameObject = null,
                                 ignoreObjectGuids: string[] = [],
                                 debug: boolean = false): mw.HitResult | null {
        return QueryUtil.lineTrace(
            startPoint,
            this.newWithZ(startPoint, startPoint.z - length),
            false,
            debug,
            [self.gameObjectId, ...ignoreObjectGuids],
            false,
            false)[0] ?? null;
    }

    /**
     * 忽略自身的 GameObject 垂直地形侦测.
     * @param self
     * @param length
     * @param ignoreObjectGuids
     * @param debug
     */
    public detectGameObjectVerticalTerrain(self: GameObject,
                                           length: number = 1000,
                                           ignoreObjectGuids: string[] = [],
                                           debug: boolean = false): mw.HitResult | null {
        if (!self) return null;
        return this.detectVerticalTerrain(
            self.worldTransform.position,
            length,
            self,
            ignoreObjectGuids,
            debug,
        );
    }

    /**
     * 角色正下方地形侦测.
     * 从 角色角色胶囊体 下圆心 创建一条垂直向下的射线 返回命中到任何其他物体的命中点信息.
     * @param ignoreObjectGuids 忽略物体 Guid.
     * @param debug 是否 绘制调试线.
     * @return hitPoint 命中首个点的命中信息 当未命中时返回 null.
     */
    public detectCurrentCharacterTerrain(ignoreObjectGuids: string[] = [], debug: boolean = false) {
        if (!SystemUtil.isClient()) {
            return null;
        }

        const character = Player.localPlayer.character;
        const result = this.detectVerticalTerrain(
            this.getCharacterCapsuleLowerCenter(character),
            1000,
            character,
            ignoreObjectGuids);
        if (debug && result) {
            this.drawRay(result.position, result.impactNormal, 100);
        }

        return result;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Functional
    /**
     * 计算角色在地形上运动时的倾倒角.
     * 返回值为以正交系轴为参考.
     * @param character
     * @param ignoreObjectGuids 忽略物体 Guid.
     * @return [pitch, roll] 旋转角度.
     */
    public calCentripetalAngle(character: mw.Character, ignoreObjectGuids: string[] = []) {
        const hitInfo = this.detectCurrentCharacterTerrain(ignoreObjectGuids, false);
        if (hitInfo) {
            const terrainNormal = hitInfo.impactNormal;
            const transform = character.worldTransform;

            const currUnitRight = mw.Vector.projectOnPlane(transform.getRightVector(), mw.Vector.up);
            const currUnitForward = mw.Vector.projectOnPlane(transform.getForwardVector(), mw.Vector.up);
            const currUnitUp = mw.Vector.cross(currUnitForward, currUnitRight);

            const sidePlaneNormal = currUnitRight;
            const frontPlaneNormal = currUnitForward;

            const projSide = mw.Vector.projectOnPlane(
                terrainNormal,
                sidePlaneNormal,
            );
            const projFront = mw.Vector.projectOnPlane(
                terrainNormal,
                frontPlaneNormal,
            );

            let pitch: number = mw.Vector.angle3D(
                currUnitUp,
                projSide);
            let roll: number = mw.Vector.angle3D(
                currUnitUp,
                projFront);

            pitch *= mw.Vector.angle3D(
                currUnitForward,
                projSide) > 90 ? -1 : 1;
            roll *= mw.Vector.angle3D(
                currUnitRight,
                projFront) > 90 ? -1 : 1;

            return [pitch, roll];
        } else return null;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Debug
    /**
     * 绘制 Debug 用射线.
     * @param startPoint
     * @param direction
     * @param distance
     */
    drawRay(startPoint: mw.Vector, direction: mw.Vector, distance: number = 3000): void {
        QueryUtil.lineTrace(
            startPoint,
            startPoint.clone().add(direction.clone().normalize().multiply(distance)),
            true,
            true);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Navigator
    /**
     * 是否 两点之间存在合法路径.
     * @param origin
     * @param dest
     */
    public hasValidPath(origin: Vector, dest: Vector): boolean {
        return Navigation.findPath(
            origin,
            dest,
        ).length > 0;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Data Storage
    /**
     * 查询其他游戏 ModuleData.
     * @param {string} moduleDataName
     * @param {string} userId
     * @param {string} defaultValue
     * @return {Promise<string>}
     */
    public async queryOtherSceneModuleData<T extends object>(moduleDataName: string, userId: string, defaultValue: T = {} as T): Promise<T> {
        const data = await DataStorage.asyncGetData(this.getModuleDataKey(userId, moduleDataName));
        if (data.code !== DataStorageResultCode.Success) return Promise.reject(`Query failed. error code: ${data.code}.`);

        if (this.isNullOrUndefined(data.data)) return defaultValue;
        else return data.data;
    }

    /**
     * 更新其他游戏 ModuleData.
     * @param {string} moduleDataName
     * @param {string} userId
     * @param {string} value
     * @return {Promise<boolean>}
     */
    public async updateOtherSceneModuleData(moduleDataName: string, userId: string, value: object): Promise<boolean> {
        const data: DataStorageResultCode = await DataStorage.asyncSetData(this.getModuleDataKey(userId, moduleDataName), value);
        if (data !== DataStorageResultCode.Success) {
            console.warn(`update other game module data failed. error code: ${data}`);
            return false;
        }

        return true;
    }

    /**
     * 获取 ModuleData Key.
     * @param {string} userId
     * @param {string} moduleDataName
     * @return {string}
     */
    public getModuleDataKey(userId: string, moduleDataName: string): string {
        return `${userId}_SubData_${moduleDataName}`;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

//#region Type Guard
/**
 * Prototype of a class constructor.
 */
export type Constructor<TResult> = new (...args: Array<unknown>) => TResult;

/**
 * Constructor of an abstract-allow class.
 */
export type AbstractAllowClass<TResult> = Constructor<TResult> | Function;

/**
 * A function taking one argument and returning a boolean result.
 * TArg void default.
 */
export type Predicate<TArg = void> = (arg: TArg) => boolean;

/**
 * A function taking no argument and returning a result.
 */
export type Expression<TResult> = () => TResult;

/**
 * A function taking any arguments and returning any result.
 */
export type Method = (...params: unknown[]) => unknown;

/**
 * Getter.
 */
export type Getter<T> = () => T;

/**
 * Setter.
 */
export type Setter<T> = (val: T) => void;

declare const _: unique symbol;

/**
 * NoOverride.
 * @desc you shouldn't override the function return this type.
 * @desc 你不应该重写返回此类型的函数.
 */
export type NoOverride = { [_]: typeof _; }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Types
export namespace GtkTypes {
    export interface Vector2 {
        x: number;
        y: number;
    }

    export interface Vector3 {
        x: number;
        y: number;
        z: number;
    }
}

export type TimeFormatDimensionFlagsLike = TimeFormatDimensionFlags | Tf;

/**
 * 时间值维度 枚举.
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
export enum TimeFormatDimensionFlags {
    /**
     * 毫秒.
     */
    Millisecond = 1 << 1,
    /**
     * 秒.
     */
    Second = 1 << 2,
    /**
     * 分.
     */
    Minute = 1 << 3,
    /**
     * 时.
     */
    Hour = 1 << 4,
    /**
     * 日.
     */
    Day = 1 << 5,
    /**
     * 月.
     */
    Month = 1 << 6,
}

/**
 * 时间值维度 枚举 简写.
 * @desc 等价于 {@link TimeFormatDimensionFlags}.
 */
export enum Tf {
    /**
     * 毫秒.
     */
    Ms = 1 << 1,
    /**
     * 秒.
     */
    S = 1 << 2,
    /**
     * 分.
     */
    M = 1 << 3,
    /**
     * 时.
     */
    H = 1 << 4,
    /**
     * 日.
     */
    D = 1 << 5,
    /**
     * 月.
     */
    Mon = 1 << 6,
}

/**
 * 性别 枚举.
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
export enum GenderTypes {
    /**
     * 武装直升机.
     */
    Helicopter,
    /**
     * 女性.
     */
    Female,
    /**
     * 男性.
     */
    Male,
}

/**
 * Random Generator.
 * generate a number array and convert to supported types.
 */
export class RandomGenerator {
    private _result: number[] = [];

    public toVector3(fill: number = 0): mw.Vector {
        return new mw.Vector(this._result[0] ?? fill, this._result[1] ?? fill, this._result[2] ?? fill);
    }

    public toVector2(fill: number = 0): mw.Vector2 {
        return new mw.Vector2(this._result[0] ?? fill, this._result[1] ?? fill);
    }

    public toRotation(fill: number = 0): mw.Rotation {
        return new mw.Rotation(this._result[0] ?? fill, this._result[1] ?? fill, this._result[2] ?? fill);
    }

    public from(value: number[]): this {
        this._result = value;
        return this;
    }

    /**
     * generate random array.
     * @param {number | number[]} length length or scale.
     * @param {() => number} randomFunc random function.
     *      - default Math.random
     * @return {this}
     */
    public random(length: number | number[], randomFunc: () => number = Math.random): this {
        const isLength = typeof length === "number";
        this._result = new Array(isLength ? length : length.length);
        for (let i = 0; i < this._result.length; i++) {
            this._result[i] = randomFunc() * (isLength ? 1 : length[i]);
        }
        return this;
    }

    /**
     * handle result by index.
     * @param {(value: number, index: number) => number} handler
     * @return {this}
     */
    public handle(handler: (value: number, index: number) => number): this {
        for (let i = 0; i < this._result.length; i++) {
            this._result[i] = handler(this._result[i], i);
        }
        return this;
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

/**
 * advance switch.
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class Switcher {
    private _cases: (boolean | number)[][] = [];
    private _callbacks: Method[] = [];
    private _default: Method = null;

    /**
     * build judge case.
     * @param callback
     * @param values
     *  when value is null or undefined, it will be ignored.
     */
    public case(callback: Method, ...values: (boolean | number)[]): this {
        this._cases.push(values);
        this._callbacks.push(callback);

        return this;
    }

    /**
     * build judge default case.
     * @param callback
     */
    public default(callback: Method): void {
        this._default = callback;
    }

    /**
     * judge values.
     * @param values
     */
    public judge(...values: (boolean | number)[]) {
        for (let i = 0; i < this._cases.length; i++) {
            let result = true;
            for (let j = 0; j < values.length; j++) {
                const pole = this._cases[i][j];
                if (pole === null || pole === undefined) {
                    continue;
                }
                result = values[j] === pole;
                if (!result) break;
            }

            if (result) {
                this?._callbacks[i]?.();
                return;
            }
        }

        this?._default();
    }
}

/**
 * 分帧器.
 * @desc 为某个请求设定频率上限.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author minjia.zhang
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class Regulator {
    /**
     * 更新间隔. ms.
     */
    public updateInterval: number;

    /**
     * 上次就绪时间.
     */
    public lastUpdate: number = 0;

    public elapsed(now: number): number {
        return now - this.lastUpdate;
    }

    /**
     * 是否 就绪.
     */
    public ready(): boolean {
        const now = Date.now();
        if (this.elapsed(now) >= this.updateInterval) {
            this.lastUpdate = now;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param updateInterval 更新间隔. ms
     */
    constructor(updateInterval?: number) {
        this.updateInterval = updateInterval ?? 1000;
    }

    /**
     * 频率. 每秒 ready 次数.
     */
    public frequency(val: number): this {
        this.updateInterval = 1000 / val;
        return this;
    }

    /**
     * 间隔.
     * @param val
     */
    public interval(val: number): this {
        this.updateInterval = val;
        return this;
    }
}

//#region Export
const Gtk = new GToolkit();

export default Gtk;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄