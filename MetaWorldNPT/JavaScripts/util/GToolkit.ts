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
 * @see https://github.com/LviatYi/MetaWorldNPT/tree/main/MetaWorldNPT/JavaScripts/util
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
class GToolkit {
//#region Pure Js
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
    private static readonly FULL_HD: IPoint2 = {x: 1920, y: 1080};

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
    private static readonly MillisecondInSecond = 1e3;

    /**
     * 默认 随机函数.
     * @type {() => number}
     */
    public static defaultRandomFunc: () => number = Math.random;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member

    private static _characterDescriptionLockers: Set<string> = new Set();

    private static _batchHandlerPool: Map<Method, BatchInfo> = new Map();

    private static _repeatBatchHandlerPool: Map<Method, RepeatableBatchInfo> = new Map();

    private static _waitHandlerPool: Map<Method, WaitInfo> = new Map();

    private static _globalOnlyOnBlurDelegate: Delegate.SimpleDelegate<void> = undefined;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * Is Primitive.
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

    /**
     * 对 instance 进行强制类型推断.
     * @param instance 对象
     * @param method 对象方法名
     * @returns boolean
     */
    public static is<T extends object>(instance: object, method: string | ((instance: object) => boolean)): instance is T {
        if (!instance) return false;
        if (typeof method === "string") {
            return method in instance;
        }

        return method(instance);
    }

    /**
     * Ts 枚举值.
     * traverse values in enum.
     * @param {T} enumType
     * @return {ValueTypeInEnum<T>[]}
     */
    public static enumVals<T>(enumType: T): ValueTypeInEnum<T>[] {
        return Object
            .entries(enumType)
            .filter(([key, value]) => isNaN(Number(key)))
            .map(([key, value]) => value) as ValueTypeInEnum<T>[];
    }

    /**
     * is the array or string empty.
     * define empty is undefined or null or [""].
     * @param textOrArray str or array.
     */
    public static isNullOrEmpty(textOrArray: ArrayLike<unknown> | null | undefined)
        : textOrArray is (null | undefined) {
        return this.isNullOrUndefined(textOrArray) || textOrArray.length === 0;
    }

    /**
     * is the value null or undefined.
     * @param value
     */
    public static isNullOrUndefined(value: unknown | null | undefined): value is (null | undefined) {
        return value == undefined;
    }

    /**
     * is the value NaN or Zero.
     * @param value
     */
    public static isNullNanOrZero(value: number): value is (null | undefined) {
        return value == undefined || isNaN(value) || value === 0;
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
    public static safeIndex(index: number, arr: unknown[], safeStrategy: "cut" | "cycle" = "cut"): number {
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
    public static safeIndexItem<T>(index: number, arr: T[], safeStrategy: "cut" | "cycle" = "cut"): T {
        let safeIndex = this.safeIndex(index, arr, safeStrategy);
        return safeIndex === -1 ? null : arr[safeIndex];
    }

    /**
     * remove item from array.
     * @param array
     * @param item
     * @param {boolean} holdOrder hold order after remove.
     */
    public static remove<T>(array: T[], item: T, holdOrder: boolean = true): boolean {
        if (!array) return;
        const index = array.indexOf(item);
        if (index > -1) {
            if (holdOrder) {
                array.splice(index, 1);
            } else {
                array[index] = array[array.length - 1];
                array.pop();
            }
            return true;
        }
        return false;
    }

    /**
     * remove item from array by index.
     * @desc original order is not maintained.
     * @param {T[]} array
     * @param {number} index
     */
    public static removeByIndex(array: unknown[], index: number): boolean {
        if (index < 0 || index > array.length) {
            return false;
        }
        array[index] = array[array.length - 1];
        --array.length;

        return true;
    }

    /**
     * build an advanced switch.
     */
    public static switch(): Switcher {
        return new Switcher();
    }

    /**
     * fold data.
     * @param data
     * @param foldCount
     * @param func
     */
    public static fold<UF, F>(data: UF[], foldCount: number, func: (data: UF[]) => F): F[] {
        const result: F[] = [];
        for (let i = 0; i < data.length; i += foldCount) {
            result.push(func(data.slice(i, i + foldCount)));
        }

        return result;
    }

    /**
     * unfold data.
     * @param data
     * @param func
     */
    public static unfold<F, UF>(data: F[], func: (data: F) => UF[]): UF[] {
        const result: UF[] = [];

        for (const element of data) {
            result.push(...func(element));
        }

        return result;
    }

    /**
     * confirm get value from map with key.
     * @param {Map<K, V>} map
     * @param {K} key
     * @param {()=>V} generate
     * @return {V}
     */
    public static tryGet<K, V>(map: Map<K, V>, key: K, generate: Expression<V> | V): V {
        let result = map.get(key);
        if (result === undefined) {
            result = typeof generate === "function" ?
                (generate as Expression<V>)() :
                generate;
            map.set(key, result);
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
    public static doWhenTrue(predicate: () => boolean,
                             callback: () => void,
                             interval: number = 100,
                             instant: boolean = true,
                             timeout: number = 0,
                             onError: Expression<void> = undefined,
                             onTimeout: Expression<void> = undefined): number | null {
        const startTime = Date.now();
        let holdId = null;
        const callbackWithCatch = () => {
            try {
                callback();
            } catch (e) {
                try {
                    mw.console.error("GToolkit: error occurs in doWhenTrue callback.");
                    mw.console.error(e.stack);
                    onError && onError();
                } catch (e) {
                    mw.console.error("GToolkit: error occurs in onError callback.");
                    mw.console.error(e.stack);
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
    public static doUntilTrue(predicate: () => boolean,
                              callback: () => void,
                              interval: number = 100,
                              instant: boolean = true,
                              timeout: number = 0,
                              onError: Expression<void> = undefined,
                              onTimeout: Expression<void> = undefined): number | null {
        const startTime = Date.now();
        let holdId = null;
        const callbackWithCatch = () => {
            try {
                callback();
            } catch (e) {
                try {
                    mw.console.error("GToolkit: error occurs in doUntilTrue callback.");
                    mw.console.error(e.stack);
                    onError && onError();
                } catch (e) {
                    mw.console.error("GToolkit: error occurs in onError callback.");
                    mw.console.error(e.stack);
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

    /**
     * Performs a delayed batch operation.
     * @desc Collects incoming data items into a batch queue,
     * @desc and executes the batch callback function once after a specified wait time.
     * @desc The batchCallback required is a function that processes the arrayed data in a single pass.
     * @desc 要求提供的 batchCallback 是一个能够单次处理数组化数据的函数.
     * @param {TArg} data
     * @param {(data: TArg[]) => void} batchCallback
     *      - do not use an anonymous function here.
     * @param {number} waitTime=undefined 󰅐wait time. ms.
     *      if first register the batchCallback, the waitTime will be 100 ms.
     *      else the waitTime will use last waitTime.
     * @param {boolean} reTouch=false reclock when data added.
     *      it allows a single instance to store and manage multiple data batch queues based on different tags.
     * @param {boolean} instantly=false do instantly.
     * @return {number} timer id.
     */
    public static batchDo<TArg>(data: TArg,
                                batchCallback: (data: TArg[]) => void,
                                waitTime: number = undefined,
                                reTouch: boolean = false,
                                instantly: boolean = false): number | undefined {
        let existBatch = this.tryGet(
            this._batchHandlerPool,
            batchCallback,
            () => ({
                timerId: undefined,
                data: [],
                delayDo: () => {
                    if (existBatch.timerId !== undefined) {
                        mw.clearTimeout(existBatch.timerId);
                    }
                    this._batchHandlerPool.delete(batchCallback);
                    batchCallback(existBatch.data as TArg[]);
                },
                lastWaitDuration: waitTime,
            }));

        existBatch.data.push(data);
        if (instantly) {
            existBatch.delayDo();
        } else if (existBatch.timerId === undefined || reTouch) {
            if (existBatch.timerId !== undefined) mw.clearTimeout(existBatch.timerId);
            if (waitTime !== undefined) existBatch.lastWaitDuration = waitTime;
            existBatch.timerId = mw.setTimeout(
                existBatch.delayDo,
                existBatch.lastWaitDuration ?? 0.1e3);
        }

        return existBatch.timerId;
    }

    /**
     * Performs a delayed batch operation.
     * @desc Collects incoming data items into a batch queue,
     * @desc and loop executes the batch callback function once after a specified wait time.
     * @desc The batchCallback required is a function that processes the arrayed data in a single pass.
     * @desc 要求提供的 batchCallback 是一个能够单次处理单批数据的函数. batchRepeatDo 将循环调用它.
     * @param {Parameters<Func>} data
     * @param {Func extends Method} batchCallback
     *      - do not use an anonymous function here.
     * @param {number} waitTime=undefined 󰅐wait time. ms.
     *      if first register the batchCallback, the waitTime will be 100 ms.
     *      else the waitTime will use last waitTime.
     * @param {boolean} reTouch=false reclock when data added.
     *      it allows a single instance to store and manage multiple data batch queues based on different tags.
     * @param {boolean} instantly=false do instantly.
     * @return {number} timer id.
     */
    public static batchRepeatDo<Func extends Method>(
        data: Parameters<Func>,
        batchCallback: Func,
        waitTime: number = undefined,
        reTouch: boolean = false,
        instantly: boolean = false): number | undefined {
        let existBatch = this.tryGet(
            this._repeatBatchHandlerPool,
            batchCallback,
            () => ({
                timerId: undefined,
                data: [],
                delayDo: () => {
                    if (existBatch.timerId !== undefined) {
                        mw.clearTimeout(existBatch.timerId);
                    }
                    this._batchHandlerPool.delete(batchCallback);
                    for (const p of existBatch.data) {
                        batchCallback(...p);
                    }
                },
                lastWaitDuration: waitTime,
            }));

        existBatch.data.push(data);
        if (instantly) {
            existBatch.delayDo();
        } else if (existBatch.timerId === undefined || reTouch) {
            if (existBatch.timerId !== undefined) mw.clearTimeout(existBatch.timerId);
            if (waitTime !== undefined) existBatch.lastWaitDuration = waitTime;
            existBatch.timerId = mw.setTimeout(
                existBatch.delayDo,
                existBatch.lastWaitDuration ?? 0.1e3);
        }

        return existBatch.timerId;
    }

    /**
     * do a delayed batch operation who wait for data.
     * @param {TArg} data
     * @param {(data: TArg) => void} waitCallback
     *      - do not use an anonymous function here.
     * @param {number} waitTime=undefined 󰅐wait time. ms.
     *      if first register the waitCallback, the waitTime will be 100 ms.
     *      else the waitTime will use last waitTime.
     * @param {boolean} reTouch=true reclock when data added.
     *      it allows a single instance to store and manage multiple data batch queues based on different tags.
     * @param {boolean} instantly=false do instantly.
     * @return {number} timer id.
     */
    public static waitDo<TArg>(data: TArg,
                               waitCallback: (data: TArg) => void,
                               waitTime: number = undefined,
                               reTouch: boolean = true,
                               instantly: boolean = false): number | undefined {
        let existBatch = this.tryGet(
            this._waitHandlerPool,
            waitCallback,
            () => ({
                timerId: undefined,
                data: undefined,
                delayDo: () => {
                    if (existBatch.timerId !== undefined) {
                        mw.clearTimeout(existBatch.timerId);
                    }
                    this._waitHandlerPool.delete(waitCallback);
                    waitCallback(existBatch.data as TArg);
                },
                lastWaitDuration: waitTime,
            }));

        existBatch.data = data;
        if (instantly) {
            existBatch.delayDo();
        } else if (existBatch.timerId === undefined || reTouch) {
            if (existBatch.timerId !== undefined) mw.clearTimeout(existBatch.timerId);
            if (waitTime !== undefined) existBatch.lastWaitDuration = waitTime;
            existBatch.timerId = mw.setTimeout(
                existBatch.delayDo,
                existBatch.lastWaitDuration ?? 1e3);
        }

        return existBatch.timerId;
    }

    /**
     * whether the two times are equal.
     * @param {number} lhs
     * @param {number} rhs
     * @param {GtkTypes.TimeFormatDimensionFlagsLike} precision=GtkTypes.Tf.D
     * @return {boolean}
     */
    public static isSameTime(lhs: number,
                             rhs: number,
                             precision: GtkTypes.TimeFormatDimensionFlagsLike = GtkTypes.Tf.D): boolean {
        if (precision === GtkTypes.Tf.Ms) return lhs === rhs;
        let lhsDate = new Date(lhs);
        let rhsDate = new Date(rhs);
        switch (precision) {
            case GtkTypes.Tf.Y:
                return lhsDate.getFullYear() === rhsDate.getFullYear();
            case GtkTypes.Tf.Mon:
                return lhsDate.getFullYear() === rhsDate.getFullYear() &&
                    lhsDate.getMonth() === rhsDate.getMonth();
            case GtkTypes.Tf.D:
                return lhsDate.getFullYear() === rhsDate.getFullYear() &&
                    lhsDate.getMonth() === rhsDate.getMonth() &&
                    lhsDate.getDate() === rhsDate.getDate();
            case GtkTypes.Tf.H:
                return lhsDate.getFullYear() === rhsDate.getFullYear() &&
                    lhsDate.getMonth() === rhsDate.getMonth() &&
                    lhsDate.getDate() === rhsDate.getDate() &&
                    lhsDate.getHours() === rhsDate.getHours();
            case GtkTypes.Tf.M:
                return lhsDate.getFullYear() === rhsDate.getFullYear() &&
                    lhsDate.getMonth() === rhsDate.getMonth() &&
                    lhsDate.getDate() === rhsDate.getDate() &&
                    lhsDate.getHours() === rhsDate.getHours() &&
                    lhsDate.getMinutes() === rhsDate.getMinutes();
            case GtkTypes.Tf.S:
                return lhsDate.getFullYear() === rhsDate.getFullYear() &&
                    lhsDate.getMonth() === rhsDate.getMonth() &&
                    lhsDate.getDate() === rhsDate.getDate() &&
                    lhsDate.getHours() === rhsDate.getHours() &&
                    lhsDate.getMinutes() === rhsDate.getMinutes() &&
                    lhsDate.getSeconds() === rhsDate.getSeconds();
            default:
                return false;
        }
    }

    /**
     * 获取所有成员 key.
     * @param {object} obj
     * @param {boolean} ignoreObjectProto=true 是否 忽略 Object.prototype 原型.
     * @param {boolean} ignoreConstructor=true 是否 忽略 constructor.
     * @return {string[]}
     */
    public static getAllMember(obj: object,
                               ignoreObjectProto: boolean = true,
                               ignoreConstructor: boolean = true): string[] {
        let props: string[] = [];
        let currentObj = obj;
        while (currentObj &&
        (!ignoreObjectProto || currentObj !== Object.prototype)) {
            props.push(...(
                ignoreConstructor ?
                    Object.getOwnPropertyNames(currentObj)
                        .filter(item => item !== "constructor") :
                    Object.getOwnPropertyNames(currentObj)),
            );
            currentObj = Object.getPrototypeOf(currentObj);
        }
        return props;
    }

    /**
     * find property descriptor.
     * @param obj
     * @param {string} prop
     * @return {PropertyDescriptor | null}
     */
    public static findPropertyDescriptor(obj: unknown, prop: string): PropertyDescriptor | undefined {
        while (obj != null) {
            let descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            if (descriptor) {
                return descriptor;
            }
            obj = Object.getPrototypeOf(obj);
        }
        return undefined;
    }

    /**
     * angle to radius.
     * @param angle
     */
    public static radius(angle: number): number {
        return angle / 180 * Math.PI;
    }

    /**
     * radius to angle.
     * @param radius
     */
    public static angle(radius: number): number {
        return radius / Math.PI * 180;
    }

    /**
     * random in range [min,max).
     * @param min default 0.
     * @param max default min + 1.
     * @param integer return a integer.
     */
    public static random(min: number = undefined, max: number = undefined, integer: boolean = false): number {
        if (min === undefined) {
            min = 0;
        }
        if (max === undefined) {
            max = min + 1;
        }

        let result = this.defaultRandomFunc() * (max - min) + min;

        return integer ? result | 0 : result;
    }

    /**
     * random with weight.
     * @desc dichotomy search.
     * @param weight
     * @param total total weight. add last weight as total-sum(weight)
     *      example: use five item whose total weight is 100,
     *      we can pass [10,10,20,30] as weight param, and 100 as total param.
     *      then the randomWeight will be [0,10),[10,20),[20,40),[40,70),[70,100).
     * @return number [0,n).
     *      - total undefined. n is length of weight.
     *      - total defined. n is 1 + length of weight.
     */
    public static randomWeight(weight: number[], total: number = undefined): number {
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
    public static randomArrayItem<T>(array: Array<T>): T | undefined {
        if (!array || array.length === 0) return undefined;
        return array[this.random(0, array.length, true)];
    }

    /**
     * random shuffle the order from 0 to count.
     * Fisher–Yates.
     * @param count
     */
    public static randomShuffleOrder(count: number): number[] {
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
    public static randomShuffleArray<T>(items: T[]): T[] {
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
    public static randomGenerator(length: number | number[] = 3): RandomGenerator {
        return new RandomGenerator().random(length, this.defaultRandomFunc);
    }

    /**
     * Generate a random point located on the surface of a unit sphere in an arbitrary number of dimensions,
     * by Box-Muller transform and normalization.
     * @param dimension
     * @param randomFunc
     */
    public static randomDimensionSphere(dimension: number = 2, randomFunc = undefined): number[] {
        if (dimension < 0 || dimension != (dimension | 0)) return [];
        if (randomFunc === undefined) {
            randomFunc = this.defaultRandomFunc;
        }
        if (dimension === 1) {
            return randomFunc() >= 0.5 ? [1] : [-1];
        }
        if (dimension === 2) {
            const angle = this.defaultRandomFunc() * 2 * Math.PI;
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
     * 格式化 Timestamp 至 00:00.
     *
     * @param timestamp
     * @param option 选择需显示的时间维度.
     */
    public static formatTimeFromTimestamp(
        timestamp: number,
        option: GtkTypes.TimeFormatDimensionFlagsLike =
        GtkTypes.TimeFormatDimensionFlags.Second |
        GtkTypes.TimeFormatDimensionFlags.Minute): string {
        const date = new Date(timestamp);
        let result = "";
        if ((option & GtkTypes.TimeFormatDimensionFlags.Hour) > 0) {
            const hour = date.getHours().toString().padStart(2, "0");
            if (result.length > 0) {
                result += ":";
            }
            result += hour;
        }
        if ((option & GtkTypes.TimeFormatDimensionFlags.Minute) > 0) {
            const minutes = date.getMinutes().toString().padStart(2, "0");
            if (result.length > 0) {
                result += ":";
            }
            result += minutes;
        }
        if ((option & GtkTypes.TimeFormatDimensionFlags.Second) > 0) {
            const seconds = date.getSeconds().toString().padStart(2, "0");
            if (result.length > 0) {
                result += ":";
            }
            result += seconds;
        }
        return result;
    }

    /**
     * 时间转换.
     * 支持的时间单位范围：[毫秒,天]
     * @param val 原值.
     * @param from 原值时间维度.
     * @param to 目标时间维度.
     * @return {null} 入参在不支持的范围内时.
     */
    public static timeConvert(val: number,
                              from: GtkTypes.TimeFormatDimensionFlagsLike,
                              to: GtkTypes.TimeFormatDimensionFlagsLike): number {
        if (from === to) return val;
        if (this.hammingWeight(from) !== 1 || this.hammingWeight(to) !== 1) return null;

        if (
            (0x1 << this.bitFirstOne(from)) as GtkTypes.TimeFormatDimensionFlags > GtkTypes.TimeFormatDimensionFlags.Day ||
            (0x1 << this.bitFirstOne(to)) as GtkTypes.TimeFormatDimensionFlags > GtkTypes.TimeFormatDimensionFlags.Day
        ) {
            return null;
        }

        while (from !== to) {
            if (from > to) {
                switch (from) {
                    case GtkTypes.TimeFormatDimensionFlags.Second:
                        val *= GToolkit.MillisecondInSecond;
                        break;
                    case GtkTypes.TimeFormatDimensionFlags.Minute:
                        val *= GToolkit.SecondInMinute;
                        break;
                    case GtkTypes.TimeFormatDimensionFlags.Hour:
                        val *= GToolkit.MinuteInHour;
                        break;
                    case GtkTypes.TimeFormatDimensionFlags.Day:
                        val *= GToolkit.HourInDay;
                        break;
                    default:
                        break;
                }
                from >>= 0x1;
            } else {
                switch (from) {
                    case GtkTypes.TimeFormatDimensionFlags.Millisecond:
                        val /= GToolkit.MillisecondInSecond;
                        break;
                    case GtkTypes.TimeFormatDimensionFlags.Second:
                        val /= GToolkit.SecondInMinute;
                        break;
                    case GtkTypes.TimeFormatDimensionFlags.Minute:
                        val /= GToolkit.MinuteInHour;
                        break;
                    case GtkTypes.TimeFormatDimensionFlags.Hour:
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

    /**
     * Clamp.
     * @param {number} val
     * @param {number} min=0
     * @param {number} max=1
     * @return {number}
     */
    public static clamp(val: number,
                        min: number = 0,
                        max: number = 1): number {
        return Math.min(max, Math.max(min, val));
    }

    /**
     * Hamming Weight. 汉明重量.
     * num 作为二进制时 1 的个数.
     * @param num
     */
    public static hammingWeight(num: number): number {
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
    public static bitFirstOne(num: number): number {
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
    public static bitIn(num: number, bit: number): boolean {
        return (num & (0x1 << bit)) > 0;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region MW

//#region Constant
    /**
     * Guid of Root GameObject.
     */
    public static readonly ROOT_GAME_OBJECT_GUID = "SceneRoot";

    /**
     * Guid of Root GameObject (old).
     */
    public static readonly ROOT_GAME_OBJECT_GUID_BACKUP = "ComponentRoot";

    /**
     * Tag of Root GameObject.
     * @type {string}
     */
    public static readonly ROOT_GAME_OBJECT_TAG_CUSTOM = "SceneRootTagByGtk";

    /**
     * Cache key for ui script of world ui object.
     */
    private static readonly WORLD_UI_SCRIPT_CACHE_KEY: symbol = Symbol("__WORLD_UI_SCRIPT_CACHE_KEY__");

    /**
     * 全透明图片 GUID.
     * @type {string}
     */
    public static readonly IMAGE_FULLY_TRANSPARENT_GUID = "168495";

    /**
     * 纯黑圆形遮罩 GUID.
     */
    public static readonly IMAGE_CIRCLE_MASK_GUID = "212681";

    /**
     * 白色方块 GUID.
     * @type {string}
     */
    public static readonly IMAGE_WHITE_SQUARE_GUID = "114028";

    /**
     * mw 导出颜色字符串正则.
     * @type {RegExp}
     * @private
     */
    private static readonly REGEX_MW_EXPORT_COLOR_STR: RegExp = /(?=.*R)(?=.*G)(?=.*B)\(([RGBA]=\d*(\.\d*)?,?)+\)/g;

    /**
     * mw 导出颜色值正则.
     * @type {RegExp}
     * @private
     */
    private static readonly REGEX_MW_EXPORT_COLOR_VALUE_STR: RegExp = /([RGBA])=(\d*(\.\d*)?)/g;

    /**
     * 十六进制颜色字符串正则.
     * @type {RegExp}
     * @private
     */
    private static readonly REGEX_HEX_COLOR_STR: RegExp = /^#?[\dA-Fa-f]+$/g;

    /**
     * mw 配置颜色字符串正则.
     * @type {RegExp}
     * @private
     */
    private static readonly REGEX_MW_ARRAY_COLOR_STR: RegExp = /^[.|\d]+$/g;

    /**
     * 最小 UI 安全透明度.
     */
    public static readonly MIN_SAFE_UI_RENDER_OPACITY = 1 / 255;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member
    /**
     * mw 场景根对象 引用.
     * @type {mw.GameObject}
     * @private
     */
    private static _rootObj: mw.GameObject;

    /**
     * 该平台是否 use mouse 缓存.
     * @type {boolean}
     * @private
     */
    private static _useMouse: boolean = undefined;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 导出颜色字符串统一化.
     * @param {string} str
     * @param {boolean} fallback=false 是否 值不合法时 回退至透明.
     * @returns {mw.LinearColor | undefined}
     */
    public static catchMwExportColor(str: string, fallback: boolean = false): mw.LinearColor | undefined {
        if (this.isNullOrEmpty(str)) return fallback ? new mw.LinearColor(0, 0, 0, 0) : undefined;
        str = str.replace(/\s/g, "");
        if (this.isNullOrEmpty(str)) return fallback ? new mw.LinearColor(0, 0, 0, 0) : undefined;

        let result = this.tryCatchHexColor(str);
        if (result) return this.colorLikeToMwColor(result);

        result = this.tryCatchMwArrayColor(str);
        if (result) return this.colorLikeToMwColor(result);

        result = this.tryCatchMwExportColor(str);
        if (result) return this.colorLikeToMwColor(result);

        return fallback ? new mw.LinearColor(0, 0, 0, 0) : undefined;
    }

    /**
     * 尝试捕获 mw 导出颜色字符串.
     * @param {string} str
     * @returns {IColor | undefined}
     */
    public static tryCatchMwExportColor(str: string): IColor | undefined {
        this.REGEX_MW_EXPORT_COLOR_STR.lastIndex = 0;
        if (this.REGEX_MW_EXPORT_COLOR_STR.test(str)) {
            let ret = {r: 0, g: 0, b: 0, a: 0};
            for (let regArray of this.REGEX_MW_EXPORT_COLOR_VALUE_STR[Symbol.matchAll](str)) {
                let v: number = Number(regArray[2]);
                if (Number.isNaN(v)) continue;
                switch (regArray[1].toUpperCase() as "R" | "G" | "B" | "A") {
                    case "R":
                        ret.r = v;
                        break;
                    case "G":
                        ret.g = v;
                        break;
                    case "B":
                        ret.b = v;
                        break;
                    case "A":
                        ret.a = v;
                        break;
                }
            }

            if (ret.r === undefined) ret.r = 0;
            if (ret.g === undefined) ret.g = 0;
            if (ret.b === undefined) ret.b = 0;
            return ret;
        } else {
            return undefined;
        }
    }

    /**
     * 尝试捕获十六进制颜色字符串.
     * @param {string} str
     * @returns {IColor | undefined}
     */
    public static tryCatchHexColor(str: string): IColor | undefined {
        this.REGEX_HEX_COLOR_STR.lastIndex = 0;
        if (this.REGEX_HEX_COLOR_STR.test(str)) {
            let ret = {r: 0, g: 0, b: 0, a: 0};
            let strPure = str.replace("#", "");
            if (strPure.length === 3) {
                // to 6
                strPure = strPure.split("").map(item => `${item}${item}`).join();
            } else if (strPure.length === 4) {
                // to 8
                strPure = strPure.split("").map(item => `${item}${item}`).join();
            } else if (strPure.length !== 6 && strPure.length !== 8) {
                if (strPure.length <= 6) {
                    strPure = strPure + new Array(6 - strPure.length).fill("0").join("");
                } else {
                    // 这**绝对是来捣乱的
                    return undefined;
                }
            }

            ret.r = parseInt(strPure.slice(0, 2), 16);
            ret.g = parseInt(strPure.slice(2, 4), 16);
            ret.b = parseInt(strPure.slice(4, 6), 16);
            ret.a = parseInt(strPure.slice(6, 8), 16);

            if (Number.isNaN(ret.a)) ret.a = undefined;
            return ret;
        } else {
            return undefined;
        }
    }

    /**
     * 尝试捕获 mw 配置颜色字符串.
     * @param {string} str
     * @returns {IColor | undefined}
     */
    public static tryCatchMwArrayColor(str: string): IColor | undefined {
        this.REGEX_MW_ARRAY_COLOR_STR.lastIndex = 0;
        if (this.REGEX_MW_ARRAY_COLOR_STR.test(str)) {
            let elements = str.split("|")
                .map(item => Number(item))
                .filter(item => !isNaN(item));
            if (elements.length < 3) {
                return undefined;
            }
            return {r: elements[0], g: elements[1], b: elements[2], a: elements[3]};
        } else {
            return undefined;
        }
    }

    private static colorLikeToMwColor(colorLike: IColor): mw.LinearColor {
        if (colorLike.r > 1 || colorLike.g > 1 || colorLike.b > 1 || (colorLike.a ?? 0) > 1) {
            return new mw.LinearColor(
                colorLike.r / 255,
                colorLike.g / 255,
                colorLike.b / 255,
                colorLike?.a / 255 ?? 1);
        }

        return new mw.LinearColor(colorLike.r, colorLike.g, colorLike.b, colorLike?.a ?? 1);
    }

    /**
     * return a vector whose value is vec + v.
     * @param {V} vec
     * @param {number | V} v
     * @param {V} outer return new vector when undefined.
     * @return {V}
     */
    public static vectorAdd<V extends mw.Vector | mw.Vector2 | mw.Vector4>(vec: V, v: number | V, outer: V = undefined): V {
        if (!outer) outer = vec.clone() as V;
        else {
            outer.x = vec.x;
            outer.y = vec.y;
            if ("z" in vec) outer["z"] = vec.z;
            if ("w" in vec) outer["w"] = vec.w;
        }

        if (this.isNumber(v)) {
            outer.x += v;
            outer.y += v;
            if ("z" in outer) outer.z += v;
            if ("w" in outer) outer.w += v;
        } else outer.add(v as any);

        return outer;
    }

    /**
     * return a vector whose value is vec - v.
     * @param {V} vec
     * @param {number | V} v
     * @param {V} outer return new vector when undefined.
     * @return {V}
     */
    public static vectorSub<V extends mw.Vector | mw.Vector2 | mw.Vector4>(vec: V, v: number | V, outer: V = undefined): V {
        if (!outer) outer = vec.clone() as V;
        else {
            outer.x = vec.x;
            outer.y = vec.y;
            if ("z" in vec) outer["z"] = vec.z;
            if ("w" in vec) outer["w"] = vec.w;
        }

        if (this.isNumber(v)) {
            outer.x -= v;
            outer.y -= v;
            if ("z" in vec) outer["z"] -= v;
            if ("w" in vec) outer["w"] -= v;
        } else outer.subtract(v as any);

        return outer;
    }

    /**
     *
     * return a vector whose value is vec * v.
     * @param {V} vec
     * @param {number | V} v
     * @param {V} outer return new vector when undefined.
     * @return {V}
     */
    public static vectorMul<V extends mw.Vector | mw.Vector2 | mw.Vector4>(vec: V, v: number | V, outer: V = undefined): V {
        if (!outer) outer = vec.clone() as V;
        else {
            outer.x = vec.x;
            outer.y = vec.y;
            if ("z" in vec) outer["z"] = vec.z;
            if ("w" in vec) outer["w"] = vec.w;
        }

        if (this.isNumber(v)) {
            outer.x *= v;
            outer.y *= v;
            if ("z" in outer) outer.z *= v;
            if ("w" in outer) outer.w *= v;
        } else outer.multiply(v as any);

        return outer;
    }

    /**
     *
     * return a vector whose value is vec / v.
     * @param {V} vec
     * @param {number | V} v
     * @param {V} outer return new vector when undefined.
     * @return {V}
     */
    public static vectorDiv<V extends mw.Vector | mw.Vector2 | mw.Vector4>(vec: V, v: number | V, outer: V = undefined): V {
        if (!outer) outer = vec.clone() as V;
        else {
            outer.x = vec.x;
            outer.y = vec.y;
            if ("z" in vec) outer["z"] = vec.z;
            if ("w" in vec) outer["w"] = vec.w;
        }

        if (this.isNumber(v)) {
            outer.x /= v;
            outer.y /= v;
            if ("z" in outer) outer.z /= v;
            if ("w" in outer) outer.w /= v;
        } else outer.divide(v as any);

        return outer;
    }

    public static newWithX(vec: mw.Vector, val: number): mw.Vector;

    public static newWithX(vec: mw.Vector2, val: number): mw.Vector2;

    public static newWithX(vec: mw.Rotation, val: number): mw.Rotation;

    /**
     * clone a new vector with a new x.
     * @param vec origin vector.
     * @param val new value.
     */
    public static newWithX(vec: mw.Vector | mw.Vector2 | mw.Rotation, val: number) {
        if (vec instanceof mw.Vector) {
            return new mw.Vector(val, vec.y, vec.z);
        } else if (vec instanceof mw.Rotation) {
            return new mw.Rotation(val, vec.y, vec.z);
        } else if (vec instanceof mw.Vector2) {
            return new mw.Vector2(val, vec.y);
        }
    }

    public static newWithY(vec: mw.Vector, val: number): mw.Vector;

    public static newWithY(vec: mw.Vector2, val: number): mw.Vector2;

    public static newWithY(vec: mw.Rotation, val: number): mw.Rotation;

    /**
     * clone a new vector with a new y.
     * @param vec origin vector.
     * @param val new value.
     */
    public static newWithY(vec: mw.Vector | mw.Vector2 | mw.Rotation, val: number) {
        if (vec instanceof mw.Vector) {
            return new mw.Vector(vec.x, val, vec.z);
        } else if (vec instanceof mw.Rotation) {
            return new mw.Rotation(vec.x, val, vec.z);
        } else if (vec instanceof mw.Vector2) {
            return new mw.Vector2(vec.x, val);
        }
    }

    public static newWithZ(vec: mw.Vector, val: number): mw.Vector;

    public static newWithZ(vec: mw.Rotation, val: number): mw.Rotation;

    /**
     * clone a new vector with a new z.
     * @param vec origin vector.
     * @param val new value.
     */
    public static newWithZ(vec: mw.Vector | mw.Rotation, val: number) {
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
    public static quaternionBetweenVector(lhs: mw.Vector, rhs: mw.Vector, fallbackAxis: mw.Vector = undefined): mw.Quaternion {
        if (this.equal(lhs, rhs, GToolkit.SIMPLE_EPSILON)) {
            return mw.Quaternion.identity;
        }

        let axis = mw.Vector.cross(lhs, rhs);
        if (Math.abs(axis.length) < GToolkit.SIMPLE_EPSILON) {
            if (fallbackAxis !== undefined) {
                if (mw.Vector.dot(fallbackAxis, lhs) !== 0) {
                    axis = fallbackAxis;
                } else {
                    mw.console.warn("fallback Axis is not valid.");
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
     * //TODO_LviatYi [待补完]
     * 等值判断.
     * @param lhs
     * @param rhs
     * @param epsilon 精度误差.
     * @alpha
     */
    public static equal<T>(lhs: T, rhs: T, epsilon: T | number = GtkTypes.Epsilon.Normal): boolean {
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
     * Manhattan Distance.
     * 曼哈顿距离.
     * 当 b 为 undefined 时 将 a 视为向量. 并计算其长度平方.
     */
    public static manhattanDistance<T extends number[] | AnyPoint>(a: T, b: T = undefined): number {
        let result = 0;
        if (a instanceof Array) {
            if (b && a.length !== (b as Array<number>).length) return result;

            for (let i = 0; i < a.length; i++) {
                result += Math.abs(a[i] - (b ? b[i] : 0));
            }

            return result;
        } else {
            result = Math.abs(a.x - (b ? (b as IPoint3).x : 0)) +
                Math.abs(a.y - (b ? (b as IPoint3).y : 0));
            if ("z" in a && "z" in b) {
                result += Math.abs(a.z as number - (b ? (b as IPoint3).z : 0));
            }
            return result;
        }
    }

    /**
     * Squared Euclid Distance.
     * 两点欧几里得距离的平方.
     * 当 b 为 undefined 时 将 a 视为向量. 并计算其长度平方.
     * @param a
     * @param b
     */
    public static squaredEuclideanDistance<T extends number[] | AnyPoint>(a: T, b: T = undefined): number {
        let result = 0;
        if (a instanceof Array) {
            if (b && a.length !== (b as Array<number>).length) return result;

            for (let i = 0; i < a.length; i++) {
                result += Math.pow(a[i] - (b ? b[i] : 0), 2);
            }

            return result;
        } else {
            result = Math.pow(a.x - (b ? (b as IPoint3).x : 0), 2) +
                Math.pow(a.y - (b ? (b as IPoint3).y : 0), 2);
            if ("z" in a && "z" in b) {
                result += Math.pow(a.z as number - (b ? (b as IPoint3).z : 0), 2);
            }
            return result;
        }
    }

    /**
     * Euclid Distance.
     * 欧几里得距离.
     * 当 b 为 undefined 时 将 a 视为向量. 并计算其长度.
     * @param a
     * @param b
     */
    public static euclideanDistance<T extends number[] | AnyPoint>(a: T, b: T = undefined): number {
        return Math.sqrt(this.squaredEuclideanDistance(a, b));
    }

    /**
     * Manhattan Distance.
     * 曼哈顿距离.
     * 当 b 为 undefined 时 将 a 视为向量. 并计算其长度平方.
     */
    public static manhattanDistance2(a: IPoint2, b: IPoint2 = undefined): number {
        let result = 0;

        result = Math.abs(a.x - (b ? b.x : 0)) +
            Math.abs(a.y - (b ? b.y : 0));
        return result;
    }

    /**
     * Squared Euclid Distance.
     * 两点欧几里得距离的平方.
     * 当 b 为 undefined 时 将 a 视为向量. 并计算其长度平方.
     * @param a
     * @param b
     */
    public static squaredEuclideanDistance2(a: IPoint2, b: IPoint2 = undefined): number {
        let result = 0;

        result = Math.pow(a.x - (b ? b.x : 0), 2) +
            Math.pow(a.y - (b ? b.y : 0), 2);
        return result;
    }

    /**
     * Euclid Distance.
     * 欧几里得距离.
     * 当 b 为 undefined 时 将 a 视为向量. 并计算其长度.
     * @param a
     * @param b
     */
    public static euclideanDistance2(a: IPoint2, b: IPoint2 = undefined): number {
        return Math.sqrt(this.squaredEuclideanDistance2(a, b));
    }

    /**
     * Manhattan Distance.
     * 曼哈顿距离.
     * 当 b 为 undefined 时 将 a 视为向量. 并计算其长度平方.
     */
    public static manhattanDistance3(a: IPoint3, b: IPoint3 = undefined): number {
        let result = 0;

        result = Math.abs(a.x - (b ? b.x : 0)) +
            Math.abs(a.y - (b ? b.y : 0)) +
            Math.abs(a.z - (b ? b.z : 0));
        return result;

    }

    /**
     * Squared Euclid Distance.
     * 两点欧几里得距离的平方.
     * 当 b 为 undefined 时 将 a 视为向量. 并计算其长度平方.
     * @param a
     * @param b
     */
    public static squaredEuclideanDistance3(a: IPoint3, b: IPoint3 = undefined): number {
        let result = 0;

        result = Math.pow(a.x - (b ? b.x : 0), 2) +
            Math.pow(a.y - (b ? b.y : 0), 2) +
            Math.pow(a.z - (b ? b.z : 0), 2);
        return result;
    }

    /**
     * Euclid Distance.
     * 欧几里得距离.
     * 当 b 为 undefined 时 将 a 视为向量. 并计算其长度.
     * @param a
     * @param b
     */
    public static euclideanDistance3(a: IPoint3, b: IPoint3 = undefined): number {
        return Math.sqrt(this.squaredEuclideanDistance(a, b));
    }

    /**
     * 将 origin 向量围绕 axis 轴旋转 angle 角度.
     * @param origin 初始向量.
     * @param axis
     * @param angle
     */
    public static rotateVector(origin: mw.Vector,
                               axis: mw.Vector,
                               angle: number) {
        const quaternion = mw.Quaternion.fromAxisAngle(axis.normalized, this.radius(angle));
        return quaternion.toRotation().rotateVector(origin);
    }

    /**
     * 屏幕坐标系 转 UI 坐标系.
     * @param location
     * @param parent=undefined 指定的父级 Widget.
     *      - undefined 使用 UIService.canvas 作为父级.
     *      - 全无效时使用 zero.
     */
    public static screenToUI(location: mw.Vector2, parent?: mw.Widget): mw.Vector2 {
        return location
            .clone()
            .subtract(
                parent
                    ?.cachedGeometry
                    ?.getAbsolutePosition() ??
                UIService?.canvas
                    ?.cachedGeometry
                    ?.getAbsolutePosition() ??
                mw.Vector2.zero)
            .divide(mw.getViewportScale());
    }

    /**
     * 泛型获取 GameObject.
     * @param guid
     */
    public static getGameObjectByGuid<T>(guid: string): T | null {
        return (mw.GameObject.findGameObjectById(guid) ?? null) as T;
    }

    /**
     * 获取 GameObject 及其子 GameObject 下的所有指定脚本.
     * @param object
     * @param scriptCls
     * @param traverse 遍历深度. 从 1 计数.
     *      0 default. 无限遍历.
     */
    public static getComponent<T extends mw.Script>(
        object: mw.GameObject,
        scriptCls: AbstractAllowClass<T>,
        traverse: number = 0): T[] {
        if (!object) return [];

        const result: T[] = [];

        let traversed: number = 0;
        let stack: mw.GameObject[] = [object];
        let cache: mw.GameObject[] = [];

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
    public static getFirstComponent<T extends mw.Script>(object: mw.GameObject,
                                                         scriptCls: AbstractAllowClass<T>,
                                                         traverse: number = 0): T | null {
        if (!object) return null;

        let traversed: number = 0;
        let stack: mw.GameObject[] = [object];
        let cache: mw.GameObject[] = [];

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
    public static getComponentIs<T extends mw.Script>(
        object: mw.GameObject,
        method: string | ((instance: object) => boolean),
        traverse: number = 0): T[] {
        if (!object) return [];

        const result: T[] = [];

        let traversed: number = 0;
        let stack: mw.GameObject[] = [object];
        let cache: mw.GameObject[] = [];

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
    public static getFirstComponentIs<T extends mw.Script>(object: mw.GameObject,
                                                           method: string | ((instance: object) => boolean),
                                                           traverse: number = 0): T | null {
        if (!object) return null;

        let traversed: number = 0;
        let stack: mw.GameObject[] = [object];
        let cache: mw.GameObject[] = [];

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
    public static getGameObject(object: mw.GameObject, name: string): mw.GameObject[] {
        if (!object) return [];

        const result: mw.GameObject[] = [];

        let p: mw.GameObject = object;
        let stack: mw.GameObject[] = [p];

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
    public static getFirstGameObject(object: mw.GameObject, name: string): mw.GameObject | null {
        if (!object) return null;

        let p: mw.GameObject = object;
        let stack: mw.GameObject[] = [p];

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
    public static getChildren(object: mw.GameObject, traverse: number = undefined): mw.GameObject[] {
        if (!object) return [];

        let result: mw.GameObject[] = [...object.getChildren()];

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
    public static getRootGameObject(): mw.GameObject | undefined {
        if (this._rootObj) return this._rootObj;
        this._rootObj = mw.GameObject.findGameObjectById(this.ROOT_GAME_OBJECT_GUID);
        if (!this._rootObj) this._rootObj = mw.GameObject.findGameObjectById(this.ROOT_GAME_OBJECT_GUID_BACKUP);
        if (!this._rootObj) this._rootObj = mw.GameObject.findGameObjectsByTag(this.ROOT_GAME_OBJECT_TAG_CUSTOM)[0];

        return this._rootObj;
    }

    /**
     * 在场景中的根 GameObject 上挂载脚本.
     */
    public static addRootScript<T extends mw.Script>(scriptCls: Constructor<T>): T {
        let root = this.getRootGameObject();

        if (!root) root = mw.GameObject.spawn("Anchor", {
            replicates: false,
        });

        return root?.addComponent(scriptCls) ?? undefined;
    }

    /**
     * 在场景中的根 GameObject 上获取脚本.
     * @param {Constructor<T>} scriptCls
     * @return {T | null}
     */
    public static getRootScript<T extends mw.Script>(scriptCls: Constructor<T>): T | null {
        return this.getRootGameObject()?.getComponent(scriptCls) ?? null;
    }

    /**
     * 在场景中的根 GameObject 上获取所有脚本.
     * @param {Constructor<T>} scriptCls
     * @return {T[] | null}
     */
    public static getRootScripts<T extends mw.Script>(scriptCls: Constructor<T>): T[] | null {
        return this.getRootGameObject()?.getComponents(scriptCls) ?? null;
    }

    /**
     * 在世界 UI 上获取脚本.
     * @desc 为了更好的编译期提示.
     * @param {mw.UIWidget} obj
     * @param {()=>T} scriptGenerator
     * @return {T | undefined}
     */
    public static getUiScriptFromWorldUi<T extends mw.UIScript>(
        obj: mw.UIWidget,
        scriptGenerator: () => T): T | undefined {
        if (this.isNullOrUndefined(obj)) return undefined;
        const targetWidget = obj.getTargetUIWidget();
        if (this.isNullOrUndefined(targetWidget)) return undefined;
        if (this.isNullOrUndefined(obj[this.WORLD_UI_SCRIPT_CACHE_KEY])) {
            const uis = mw.findUIScript(targetWidget) as T;
            obj[this.WORLD_UI_SCRIPT_CACHE_KEY] = uis ?? scriptGenerator();
            if (obj[this.WORLD_UI_SCRIPT_CACHE_KEY]) {
                obj[this.WORLD_UI_SCRIPT_CACHE_KEY].uiObjectPtr = targetWidget;
            }
        }

        return obj[this.WORLD_UI_SCRIPT_CACHE_KEY] ?? undefined;
    }

    /**
     * 角色 性别.
     */
    public static gender(character: mw.Character): GtkTypes.GenderTypes {
        let type = character.getDescription()
            .advance
            .base
            .characterSetting.somatotype;

        if (
            type === mw.SomatotypeV2.AnimeMale ||
            type === mw.SomatotypeV2.LowpolyAdultMale ||
            type === mw.SomatotypeV2.RealisticAdultMale ||
            type === mw.SomatotypeV2.CartoonyMale
        ) {
            return GtkTypes.GenderTypes.Male;
        } else if (
            type === mw.SomatotypeV2.AnimeFemale ||
            type === mw.SomatotypeV2.LowpolyAdultFemale ||
            type === mw.SomatotypeV2.RealisticAdultFemale ||
            type === mw.SomatotypeV2.CartoonyFemale
        ) {
            return GtkTypes.GenderTypes.Female;
        } else {
            return GtkTypes.GenderTypes.Helicopter;
        }
    }

    /**
     * GameObject 是否为 Character.
     * @param obj
     */
    public static isCharacter(obj: mw.GameObject): obj is mw.Character {
        return (obj instanceof mw.Character) && obj.player !== null;
    }

    /**
     * 是否 playerId gameObjectId 或 obj 指向自己.
     * @scope 仅客户端.
     * @param idOrObj
     */
    public static isSelfCharacter(idOrObj: number | string | mw.GameObject) {
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
     * playerId userId 与 player 归一化 player.
     * @param player
     */
    public static queryPlayer(player: UniquePlayerIdentifier): mw.Player | undefined {
        if (player === undefined) return undefined;
        if (typeof player === "number" ||
            typeof player === "string") {
            return Player.getPlayer(player);
        }

        return player;
    }

    /**
     * 获取角色胶囊体 下圆心坐标.
     * @param character
     */
    public static getCharacterCapsuleLowerCenter(character: mw.Character): mw.Vector {
        return character.worldTransform.position.add(this.getCharacterCapsuleLowerCenterRelative(character));
    }

    /**
     * 获取角色胶囊体 下圆心相对坐标.
     * @param character
     */
    public static getCharacterCapsuleLowerCenterRelative(character: mw.Character): mw.Vector {
        let pVec = this.getCharacterCapsuleLowerCenterVector(character).multiply(character.worldTransform.scale.z);
        pVec = character.localTransform.rotation.rotateVector(pVec);

        return pVec;
    }

    /**
     * 获取角色胶囊体 下圆心 相对于角色位置 向量.
     * 主管的 不受角色属性影响.
     * @param character
     */
    public static getCharacterCapsuleLowerCenterVector(character: mw.Character): mw.Vector {
        const rectHalfHeight = character.collisionExtent.z - character.collisionExtent.x;
        return mw.Vector.down.multiply(rectHalfHeight);
    }

    /**
     * 获取角色胶囊体 底部点.
     * @param character
     */
    public static getCharacterCapsuleBottomPoint(character: mw.Character): mw.Vector {
        let pVec = mw.Vector.down.multiply(character.collisionExtent.z * character.worldTransform.scale.z);
        pVec = character.localTransform.rotation.rotateVector(pVec);

        return character.worldTransform.position.add(pVec);
    }

    /**
     * 获取角色胶囊体 底部点.
     * @param character
     */
    public static getCharacterCapsuleBottomPointRelative(character: mw.Character): mw.Vector {
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
    public static safeSetDescription(character: mw.Character, description: string): boolean | null {
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
    public static setButtonGuid(button: mw.Button | mw.StaleButton,
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
     * @desc 自 Gtk 31.16.4 起. false 将映射为 Collapsed.
     * @desc 原则上要求 Gtk 应优先保证原有功能性. 然而自 035 后 Hidden 在仍可用的前提下不再保证布局的可计算性.
     * @desc 这一破坏性更新意味着「布局保持」将 彻底 无效. 应该立即弃用所有 Hidden.
     * @desc Gtk 将使用 Collapsed 替换 Hidden. 因为 Hidden 在固有经验中是「非预期的」.
     * @desc 如要保持布局，请尝试仅调整控件的 renderOpacity 属性.
     * @param ui
     * @param visibility
     *  当为 boolean 时 将按照常用策略将 true 映射为 {@link mw.SlateVisibility.Visible} 或 {@link mw.SlateVisibility.SelfHitTestInvisible}.
     *  将 false 映射为 {@link mw.SlateVisibility.Collapsed}.
     * @param syncEnable=true 是否同步设置 enable.
     *  当 ui 为 {@link mw.Button} 或 {@link mw.StaleButton} 时 将根据 visibility 同步设置 enable.
     * @return 返回是否发生实际更改.
     */
    public static trySetVisibility(ui: mw.Widget | mw.UIScript,
                                   visibility: mw.SlateVisibility | boolean,
                                   syncEnable: boolean = true): boolean {
        ui = ui instanceof mw.Widget ? ui : ui.uiObject;

        if (typeof visibility === "boolean") {
            if (ui instanceof mw.Button || ui instanceof mw.StaleButton) {
                visibility = visibility ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
            } else {
                visibility = visibility ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed;
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
     * @desc 使用 LviatYi 等提供的 UIScriptHeader_Template. 将提供自动比较.
     * @param {{ text: string }} ui
     * @param {string} text
     * @return {boolean}
     */
    public static trySetText(ui: { text: string }, text: string): boolean {
        if (ui.text === text) return false;
        ui.text = text;
        return true;
    }

    /**
     * 是否 给定平台绝对坐标 在 UI 控件内.
     * @param ui
     * @param position
     */
    public static isPlatformAbsoluteInWidget(position: mw.Vector2, ui: mw.Widget) {
        const absPos = ui.cachedGeometry.getAbsolutePosition();
        const absSize = ui.cachedGeometry.getAbsoluteSize();

        return position.x >= absPos.x &&
            position.x <= absPos.x + absSize.x &&
            position.y >= absPos.y &&
            position.y <= absPos.y + absSize.y;
    }

    /**
     * 获取 UI 空间下 控件的 计算后坐标.
     * @desc 计算后大小将考虑父子关系的坐标.
     * @param {Widget} ui
     * @return {mw.Vector2}
     */
    public static getUiResolvedPosition(ui: mw.Widget): mw.Vector2 {
        return absoluteToLocal(
            UIService.canvas.cachedGeometry,
            ui.cachedGeometry.getAbsolutePosition());
    }

    /**
     * 获取 UI 空间下 控件的 计算后大小.
     * @desc 计算后大小将考虑父子关系的缩放.
     * @param {Widget} ui
     */
    public static getUiResolvedSize(ui: mw.Widget): mw.Vector2 {
        return ui
            .cachedGeometry
            .getAbsoluteSize()
            .divide(getViewportScale());
    }

    /**
     * 获取 UiScript 构成的列表中 最上层 UiScript.
     * @desc 仅当
     * @param uis
     */
    public static getTopUi(uis: mw.UIScript[]): mw.UIScript | null {
        if (this.isNullOrEmpty(uis)) return null;
        let topUi: mw.UIScript = uis[0];
        if (!(topUi?.uiObject ?? null)) return null;
        for (let i = 1; i < uis.length; ++i) {
            const ui = uis[i];
            if (!(ui?.uiObject ?? null)) continue;
            if (ui.layer > topUi.layer ||
                (ui.uiObject["slot"]?.zOrder ?? -1) > (topUi.uiObject["slot"]?.zOrder ?? -1)) topUi = ui;
        }

        return topUi ?? null;
    }

    public static compareWidgetStack(lhs: mw.Widget, rhs: mw.Widget): number {
        const root = UIService.canvas;
        let rootLhs: mw.Widget;
        let rootRhs: mw.Widget;
        let pl = lhs;
        let pr = rhs;
        let lastPl: mw.Widget;
        let lastPr: mw.Widget;

        while (pl && pr) {
            if (pl === pr) {
                return this.compareSameParentWidgetStack(lastPl, lastPr) *
                    (!rootLhs && !rootRhs ? 1 : -1);
            }

            lastPl = pl;
            lastPr = pr;
            if (pl.parent && pl.parent !== root) pl = pl.parent;
            else if (!rootLhs) {
                if (pl.parent !== root) return this.isWidgetAttachOnRoot(pr) ? -1 : 0;
                rootLhs = pl;
                pl = rhs;
            }

            if (pr.parent && pr.parent !== root) pr = pr.parent;
            else if (!rootRhs) {
                if (pr.parent !== root) return this.isWidgetAttachOnRoot(pl) ? -1 : 0;
                rootRhs = pr;
                pr = lhs;
            }

            if (rootLhs && rootRhs) {
                // UIService layer manager needed.
                return rootLhs.zOrder - rootRhs.zOrder;
            }
        }
        return 0;
    }

    /**
     * Compare widget stack who has same parent.
     * @param {mw.Widget} lhs
     * @param {mw.Widget} rhs
     * @return {number}
     */
    public static compareSameParentWidgetStack(lhs: mw.Widget, rhs: mw.Widget): number {
        if (lhs.zOrder !== rhs.zOrder) return lhs.zOrder - rhs.zOrder;
        return this.getWidgetIndexInParent(lhs) - this.getWidgetIndexInParent(rhs);
    }

    /**
     * Check if widget is attached on root.
     * 检查是否 Widget 挂在在指定的 root 上
     * @param {mw.Widget} widget
     * @param {mw.Widget} root=undefined
     *      - undefined: 默认指向 {@link UIService.canvas}
     * @return {boolean}
     */
    public static isWidgetAttachOnRoot(widget: mw.Widget, root: mw.Widget = undefined): boolean {
        if (!widget) return false;
        if (!root) root = UIService.canvas;
        let p = widget;
        while (p) {
            if (p === root) return true;
            p = p.parent;
        }
        return false;
    }

    /**
     * Get widget index in parent.
     * @param {mw.Widget} widget
     * @return {number}
     *     - -1: widget is not attached on parent.
     */
    public static getWidgetIndexInParent(widget: mw.Widget): number {
        if (!widget.parent) {
            return -1;
        }
        return widget.parent["get"]()?.GetChildIndex(widget["get"]()) ?? -1;
    }

    /**
     * 获取 Ui 指定层数的所有子 Ui.
     * @param widget
     * @param traverse 遍历深度. 从 1 计数.
     *      - default 1.
     *      - null 或 undefined 无限遍历.
     */
    public static getUiChildren<Item = mw.Widget>(widget: mw.Widget, traverse: number = 1): Item[] {
        if (!widget) return [];

        let result: Item[] = [];
        for (let i = 0; i < widget.getChildrenCount(); ++i) result.push(widget.getChildAt(i) as Item);

        let p: number = 0;
        let traversed: number = 1;
        while (p < result.length && (this.isNullOrUndefined(traverse) || traversed < traverse)) {
            const currLength = result.length;
            for (; p < currLength; ++p) {
                for (let i = 0; i < (result[p] as mw.Widget).getChildrenCount(); ++i)
                    result.push((result[p] as mw.Widget).getChildAt(i) as Item);
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
    public static setUiPosition(ui: mw.Widget, x: number, y: number) {
        try {
            ui["get"]()["SetPosition"](x, y);
        } catch (e) {
            ui.position = new mw.Vector2(x, y);
        }
    }

    public static setUiPositionX(ui: mw.Widget, x: number) {
        this.setUiPosition(ui, x, ui.position.y);
    }

    public static setUiPositionY(ui: mw.Widget, y: number) {
        this.setUiPosition(ui, ui.position.x, y);
    }

    /**
     * 使用 x,y 而非 Vector2 直接设定 UI 大小.
     * @param {Widget} ui
     * @param {number} x
     * @param {number} y
     */
    public static setUiSize(ui: mw.Widget, x: number, y: number) {
        try {
            ui["get"]()["SetSize"](x, y);
        } catch (_) {
            ui.size = new mw.Vector2(x, y);
        }
    }

    public static setUiSizeX(ui: mw.Widget, x: number) {
        const size = ui.size;
        if (size.x === x) return;
        this.setUiSize(ui, x, size.y);
    }

    public static setUiSizeY(ui: mw.Widget, y: number) {
        const size = ui.size;
        if (size.y === y) return;
        this.setUiSize(ui, size.x, y);
    }

    /**
     * 使用 x,y 而非 Vector2 直接设定 UI 缩放.
     * @param {Widget} ui
     * @param {number} x
     * @param {number} y
     */
    public static setUiScale(ui: mw.Widget, x: number, y: number) {
        try {
            if (!ui["_setRenderScale"]) {
                ui["_setRenderScale"] = new mw.Vector2(x, y)["toUEVector2D"]();
            } else {
                ui["_setRenderScale"].X = x;
                ui["_setRenderScale"].Y = y;
            }
            ui["w"]["SetRenderScale"](ui["_setRenderScale"]);
        } catch (_) {
            ui.renderScale = new mw.Vector2(x, y);
        }
    }

    public static setUiScaleX(ui: mw.Widget, x: number) {
        const scale = ui.renderScale;
        if (scale.x === x) return;
        this.setUiScale(ui, x, scale.y);
    }

    public static setUiScaleY(ui: mw.Widget, y: number) {
        const scale = ui.renderScale;
        if (scale.y === y) return;
        this.setUiScale(ui, scale.x, y);
    }

    /**
     * 检查为何 UI 控件未显示.
     * @param {mw.Widget} widget
     * @returns {[WidgetNotShownReason, AttributiveNotShownWidget[]]}
     */
    public static whyUiNotShown(widget: mw.Widget): [WidgetNotShownReason, AttributiveNotShownWidget[]] {
        let focus = widget;
        let self = true;
        let attached = false;
        let selfReason: WidgetNotShownReason;
        let gaps: AttributiveNotShownWidget[] = [];
        let viewPortSize = this.getUiVirtualFullSize();

        while (focus) {
            let reason: WidgetNotShownReason = WidgetNotShownReason.Null;
            if (focus.renderOpacity <= 1e-6) {
                reason |= WidgetNotShownReason.Transparent;
            }
            if (focus.visibility === mw.SlateVisibility.Hidden) {
                reason |= WidgetNotShownReason.Hidden;
            } else if (focus.visibility === mw.SlateVisibility.Collapsed) {
                reason |= WidgetNotShownReason.Collapsed;
            }

            const position = focus.position;
            const size = focus.size;
            const scale = focus.renderScale;

            if (position.x + size.x < 0 ||
                position.y + size.y < 0 ||
                position.x > viewPortSize.x ||
                position.y > viewPortSize.y) {
                reason |= WidgetNotShownReason.OutOfView;
            }

            if (size.x * size.y * scale.x * scale.y < 10) {
                reason |= WidgetNotShownReason.TooSmall;
            }
            if (self) {
                selfReason = reason;
            } else if (reason !== WidgetNotShownReason.Null) {
                gaps.push({
                    gap: focus,
                    reason: reason,
                });
            }

            if (self &&
                widget instanceof mw.Button &&
                widget.normalImageDrawType === mw.SlateBrushDrawType.NoDrawType) {
                reason |= WidgetNotShownReason.BtnImageNoDraw;
            }

            self = false;
            focus = focus.parent;
            if (focus === mw.UIService.canvas) attached = true;
        }

        if (!attached) {
            selfReason |= WidgetNotShownReason.NotAttached;
        }
        return [selfReason, gaps];
    }

    /**
     * UI 坐标系下 Viewport 全尺寸.
     * @return {mw.Vector2}
     */
    public static getUiVirtualFullSize(): mw.Vector2 {
        return getViewportWidgetGeometry()
            ?.getAbsoluteSize()
            ?.divide(getViewportScale());
    }

    /**
     * Viewport 纵横比. x/y.
     * @return {number}
     */
    public static getViewportRatio(): number {
        const s = getViewportSize();
        return s.x / s.y;
    }

    /**
     * 获取 窗口失焦回调.
     * @desc WindowUtil.onDefocus 的多次调用将生成多次回调.
     * @return {Delegate.SimpleDelegate<void>}
     */
    public static getOnWindowsBlurDelegate(): Delegate.SimpleDelegate<void> {
        if (!this._globalOnlyOnBlurDelegate) {
            this._globalOnlyOnBlurDelegate = new Delegate.SimpleDelegate<void>();
            WindowUtil.onDefocus.add(() => this._globalOnlyOnBlurDelegate.invoke());
        }

        return this._globalOnlyOnBlurDelegate;
    }

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
    public static detectVerticalTerrain(startPoint: mw.Vector,
                                        length: number = 1000,
                                        self: mw.GameObject = undefined,
                                        ignoreObjectGuids: string[] = [],
                                        debug: boolean = false): mw.HitResult | undefined {
        return QueryUtil.lineTrace(
            startPoint,
            this.newWithZ(startPoint, startPoint.z - length),
            false,
            debug,
            self ? [self.gameObjectId, ...ignoreObjectGuids] : [...ignoreObjectGuids],
            false,
            false)[0] ?? undefined;
    }

    /**
     * 垂直地形采样.
     * 从起始平台创建一条垂直向下的射线 返回命中到任何其他物体的命中点位置.
     * @param {IPoint2} startPoint
     * @param {number} platform
     * @param {number} length
     * @param {string[]} ignores
     * @param {boolean} ignoreByType
     * @param {boolean} traceSkeletonOnly
     * @param {mw.GameObject} self
     * @param {boolean} down
     * @param {boolean} debug
     * @return {mw.HitResult[] | undefined}
     */
    public static sampleVerticalTerrain(startPoint: IPoint2,
                                        platform: number,
                                        length: number,
                                        down: boolean = true,
                                        ignores: string[] = undefined,
                                        ignoreByType: boolean = false,
                                        traceSkeletonOnly: boolean = false,
                                        self: mw.GameObject = undefined,
                                        debug: boolean = false): mw.HitResult[] | undefined {
        return QueryUtil.lineTrace(
            new Vector(startPoint.x, startPoint.y, platform),
            new Vector(startPoint.x, startPoint.y, platform + (down ? (-length) : length)),
            true,
            debug,
            ignores,
            ignoreByType,
            traceSkeletonOnly,
            self) ?? undefined;
    }

    /**
     * 忽略自身的 GameObject 垂直地形侦测.
     * @param self
     * @param length
     * @param ignoreObjectGuids
     * @param debug
     */
    public static detectGameObjectVerticalTerrain(self: mw.GameObject,
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
     * @param length 最大探测距离.
     * @param ignoreObjectGuids 忽略物体 Guid.
     * @param debug 是否 绘制调试线.
     * @return hitPoint 命中首个点的命中信息 当未命中时返回 null.
     */
    public static detectCurrentCharacterTerrain(length: number = 1000,
                                                ignoreObjectGuids: string[] = [],
                                                debug: boolean = false) {
        if (!SystemUtil.isClient()) {
            return null;
        }

        const character = Player.localPlayer.character;
        const result = this.detectVerticalTerrain(
            this.getCharacterCapsuleLowerCenter(character),
            length,
            character,
            ignoreObjectGuids);
        if (debug && result) {
            this.drawRay(result.position, result.impactNormal, 100);
        }

        return result;
    }

    /**
     * 计算角色在地形上运动时的倾倒角.
     * 返回值为以正交系轴为参考.
     * @param character
     * @param ignoreObjectGuids 忽略物体 Guid.
     * @return [pitch, roll] 旋转角度.
     */
    public static calCentripetalAngle(character: mw.Character,
                                      ignoreObjectGuids: string[] = []) {
        const hitInfo = this.detectCurrentCharacterTerrain(undefined, ignoreObjectGuids, false);
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

    /**
     * 绘制 Debug 用射线.
     * @param startPoint
     * @param direction
     * @param distance
     */
    public static drawRay(startPoint: mw.Vector,
                          direction: mw.Vector,
                          distance: number = 3000): void {
        mw.QueryUtil.lineTrace(
            startPoint,
            startPoint.clone().add(direction.clone().normalize().multiply(distance)),
            true,
            true);
    }

    /**
     * 是否 两点之间存在合法路径.
     * @param origin
     * @param dest
     */
    public static hasValidPath(origin: Vector, dest: Vector): boolean {
        return Navigation.findPath(
            origin,
            dest,
        ).length > 0;
    }

    /**
     * KV 方式查询 ModuleData.
     * @param {string} moduleDataName
     * @param {string} userId
     * @param {string} defaultValue
     * @return {Promise<string>}
     */
    public static async queryModuleData<T extends object>(moduleDataName: string, userId: string, defaultValue: T = {} as T): Promise<T> {
        const data = await mw.DataStorage.asyncGetData(this.getModuleDataKey(userId, moduleDataName));
        if (data.code !== mw.DataStorageResultCode.Success) return Promise.reject(`Query failed. error code: ${data.code}.`);

        if (this.isNullOrUndefined(data.data)) return defaultValue;
        else return data.data;
    }

    /**
     * KV 方式更新 ModuleData.
     * @param {string} moduleDataName
     * @param {string} userId
     * @param {string} value
     * @return {Promise<boolean>}
     */
    public static async updateModuleData(moduleDataName: string, userId: string, value: object): Promise<boolean> {
        const data: mw.DataStorageResultCode = await mw.DataStorage.asyncSetData(this.getModuleDataKey(userId, moduleDataName), value);
        if (data !== mw.DataStorageResultCode.Success) {
            mw.console.warn(`update other game module data failed. error code: ${data}`);
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
    public static getModuleDataKey(userId: string, moduleDataName: string): string {
        return `${userId}_SubData_${moduleDataName}`;
    }

    /**
     * 获取当前游戏版本.
     */
    public static getEditorVersion(): EditorVersion {
        let version = mw.SystemUtil.getFullEditorVersion();
        if (version.startsWith("v") || version.startsWith("V")) {
            version = version.substring(1);
        }
        const versions = version.split(".");
        return new EditorVersion(Number(versions[1] ?? 0),
            Number(versions[3] ?? 0),
            Number(versions[4] ?? 0));
    }

    /**
     * 是否 当前平台默认使用鼠标.
     * @return {boolean}
     */
    public static get useMouse(): boolean {
        if (this._useMouse === undefined) {
            switch (mw.SystemUtil.currentPlatform) {
                case  mw.RuntimePlatform.Windows:
                case  mw.RuntimePlatform.Linux:
                case  mw.RuntimePlatform.MacOS:
                    this._useMouse = true;
                    break;
                case  mw.RuntimePlatform.Android:
                case  mw.RuntimePlatform.iOS:
                default:
                    this._useMouse = false;
                    break;
            }
        }

        return this._useMouse;
    }

    private static _devStageAssertion: Predicate;

    /**
     * 注册 开发阶段断言.
     * @param {Predicate} assertion 一个谓词，当其返回 true 时，推断当前环境为开发阶段.
     */
    public static registerDevAssertion(assertion: Predicate) {
        this._devStageAssertion = assertion;
    }

    /**
     * 推断当前环境为开发阶段.
     * @desc 当 PIE 模式，一定为开发阶段.
     * @desc 可以通过 {@link registerDevAssertion} 注册额外的谓词
     * @desc - 当其返回 true 时，推断当前环境为开发阶段.
     * @desc - 当自定义额外谓词时，准确程度可能受自定义时机影响.
     * @desc - 因此不建议在顶级语句中尝试通过该函数推断当前是否为开发阶段 除非确保注册时机早于它.
     * @return {boolean}
     */
    public static get inferInDev(): boolean {
        return mw.SystemUtil.isPIE ||
            (this._devStageAssertion ? false : this._devStageAssertion());
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
 */
export type Predicate = () => boolean;

/**
 * A function taking one argument and returning a boolean result.
 */
export type Predicate1<A> = (a: A) => boolean;

/**
 * A function taking one argument and returning a boolean result.
 */
export type Predicate2<A, B> = (a: A, b: B) => boolean;

/**
 * A function taking one argument and returning a boolean result.
 */
export type Predicate3<A, B, C> = (a: A, b: B, c: C) => boolean;

/**
 * A function taking one argument and returning a boolean result.
 */
export type Predicate4<A, B, C, D> = (a: A, b: B, c: C, d: D) => boolean;

/**
 * A function taking one argument and returning a boolean result.
 */
export type Predicate5<A, B, C, D, E> = (a: A, b: B, c: C, d: D, e: E) => boolean;

/**
 * A function taking one argument and returning a boolean result.
 */
export type Predicate6<A, B, C, D, E, F> = (a: A, b: B, c: C, d: D, e: E, f: F) => boolean;

/**
 * A function taking no argument and returning a result.
 */
export type Expression<TResult> = () => TResult;

/**
 * A function taking any arguments and returning any result.
 */
export type Method<TResult = unknown> = (...params: unknown[]) => TResult;

/**
 * Type of Value in enum.
 */
export type ValueTypeInEnum<E> = E[keyof E];

/**
 * Types of ParamList in Func.
 * @example
 * function testFunc(a: number, b: string, c: boolean) {
 *     mw.console.log(a, b, c);
 * }
 *
 * class Foo {
 *     testFunc(a: number, b: string, c: boolean) {
 *         mw.console.log(a, b, c);
 *     }
 * }
 *
 * const paramList: ParamListInFunc<typeof testFunc> = [1, "2", false];
 * const paramListInClass: ParamListInFunc<Foo["testFunc"]> = [1, "2", true];
 */
export type ParamListInFunc<T> = T extends (...args: infer P) => unknown ? P : never;

/**
 * Types of Plural Optional.
 * @desc If T is Array, return T, else return [T].
 */
export type PluralOptional<T> = T extends Array<unknown> ? T : [T];

/**
 * Unique Id for mw.Player.
 */
export type UniquePlayerId = string | number;

/**
 * Unique Identifier for mw.Player.
 */
export type UniquePlayerIdentifier = mw.Player | string | number;

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
        /**
         * 年.
         */
        Year = 1 << 7,
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
        /**
         * 年.
         */
        Y = 1 << 7,
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
     * 精度 枚举.
     */
    export enum Epsilon {
        /**
         * 正常.
         * @type {Epsilon.Normal}
         */
        Normal = 1e-6,
        /**
         * 低精度.
         * @type {Epsilon.Low}
         */
        Low = 1e-4,
        /**
         * 高精度.
         * @type {Epsilon.High}
         */
        High = 1e-8,
        /**
         * 超高精度.
         * @type {Epsilon.ExtraHigh}
         */
        ExtraHigh = 1e-12,
        /**
         *
         * @type {Epsilon.Scientific}
         */
        Scientific = 1e-16,
    }

    /**
     * 时间间隔 枚举.
     */
    export enum Interval {
        None = 0,
        Hz144 = 1e3 / 144,
        Hz120 = 1e3 / 120,
        Hz90 = 1e3 / 90,
        Hz60 = 1e3 / 60,
        Hz30 = 1e3 / 30,
        Sensitive = 0.1e3,
        Fast = 0.5e3,
        PerSec = 1e3,
        Slow = 3e3,
        Logy = 5e3,
        PerMin = 60e3,
        PerHour = 60e3 * 60,
    }
}

interface IBatchInfoBase {
    /**
     * last wait duration.
     */
    lastWaitDuration?: number;

    /**
     * delay handler.
     */
    delayDo: () => void;

    /**
     * timer id.
     * @type {number}
     */
    timerId: number;
}

/**
 * Batch Info.
 */
interface BatchInfo extends IBatchInfoBase {
    /**
     * Data cache.
     * @type {unknown[]}
     */
    data: unknown[];
}

/**
 * Loop Batch Info.
 */
interface RepeatableBatchInfo extends IBatchInfoBase {
    /**
     * Data cache.
     * @type {unknown[]}
     */
    data: unknown[][];
}

/**
 * Wait Info.
 */
interface WaitInfo {
    /**
     * last wait duration.
     */
    lastWaitDuration?: number;

    /**
     * delay handler.
     */
    delayDo: () => void;

    /**
     * timer id.
     * @type {number}
     */
    timerId: number;

    /**
     * Data cache.
     * @type {unknown[]}
     */
    data: unknown;
}

export interface IColor {
    r: number,
    g: number,
    b: number,
    a?: number
}

export type AnyPoint = IPoint2 | IPoint3;

/**
 * Point in 2D.
 */
export interface IPoint2 {
    x: number;
    y: number;
}

/**
 * Point in 3D.
 */
export interface IPoint3 {
    x: number;
    y: number;
    z: number;
}

/**
 * ITransform like.
 */
export interface ITransform {
    position: IPoint3;
}

/**
 * ITransformable.
 * @desc an object with a parent and a position.
 */
export interface ITransformable {
    parent: mw.GameObject | undefined;

    worldTransform: ITransform;

    localTransform: ITransform;
}

/**
 * Mw 编辑器版本号.
 * @desc 0.35.0.1.20240723102234
 * @desc 35 1 20240723102234
 */
export interface IEditorVersion {
    /**
     * 主版本号.
     * 35
     */
    main: number;
    /**
     * 次版本号.
     * 1
     */
    sub?: number;
    /**
     * 补丁版本号.
     * 年月日时分秒.
     * 20240723102234
     */
    patch?: number;
}

/**
 * Editor Version.
 */
export class EditorVersion implements IEditorVersion {
    public constructor(
        public main: number,
        public sub?: number,
        public patch?: number,
    ) {
    }

    /**
     * 版本比较.
     * @desc 将忽略 undefined 字段，且遇到后不再继续比较.
     * @param {EditorVersion} rhs
     * @returns {number}
     *      >0 自身较新.
     *      =0 版本一直.
     *      <0 自身较旧.
     */
    public compare(rhs: IEditorVersion): number {
        let cmp: number = this.main - rhs.main;
        if (cmp > 0) return cmp;

        if (this.sub == undefined || rhs.sub == undefined) return 0;
        cmp = this.sub - rhs.sub;
        if (cmp > 0) return cmp;

        if (this.patch == undefined || rhs.patch == undefined) return 0;
        cmp = this.patch - rhs.patch;
        return cmp;
    }
}

/**
 * 控件不显示原因.
 * @flag
 */
export enum WidgetNotShownReason {
    /**
     * 空置.
     * @type {WidgetNotShownReason.Null}
     */
    Null = 0,
    /**
     * 透明的.
     * @desc render opacity 为 0.
     */
    Transparent = 1 << 0,
    /**
     * 隐藏的.
     * @desc visibility = {@link mw.Visiblity.Hidden}.
     */
    Hidden = 1 << 1,
    /**
     * 收缩的.
     * @desc visibility = {@link mw.Visibility.Collapsed}.
     */
    Collapsed = 1 << 2,
    /**
     * 越界的.
     * @desc 超出 Viewport.
     */
    OutOfView = 1 << 3,
    /**
     * 过小的.
     * @desc 面积小于 10 px.
     * @desc x * y * scale
     */
    TooSmall = 1 << 4,
    /**
     * 未绘制按钮.
     * @desc 作为 Button 时，未绘制图片.
     */
    BtnImageNoDraw = 1 << 5,
    /**
     * 未挂载.
     * @desc 未挂载于 ViewPort.
     */
    NotAttached = 1 << 6,
}

/**
 * Widget 未显示原因.
 */
export interface AttributiveNotShownWidget {
    gap: mw.Widget;

    reason: WidgetNotShownReason;
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Delegate
/**
 * Delegate. 委托.
 * @desc provide some useful delegate.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export namespace Delegate {
    interface IDelegate<T, Func extends Function> {
        /**
         * add a delegate.
         * @param {Func extends Funciton} func
         * @param thisArg
         * @param {number} alive call times.
         *      default = -1. 无限制.
         * @param {boolean} repeatable  whether can be added repeatedly.
         *      default = false.
         * @return {boolean}
         *      - true success.
         *      - false already exist.
         */
        add(func: Func, alive?: number, repeatable?: boolean, thisArg?: unknown): boolean;

        /**
         * add a delegate. can be only invoke once.
         * behaves the same as add(func, 1)
         * @param {Func extends Function} func
         * @param thisArg
         * @return {boolean}
         *      - true success.
         *      - false already exist.
         */
        once(func: Func, thisArg?: unknown): boolean;

        /**
         * add a delegate as the only alive callback.
         * @desc remove all and add this.
         * @param func
         * @param thisArg
         * @return {boolean}
         *      - true success.
         *      - false already exist.
         */
        only(func: Func, thisArg?: unknown): boolean;

        /**
         * invoke delegate.
         * @desc you should not rely on the add order.
         * @param param
         */
        invoke(...param: PluralOptional<T>): void;

        /**
         * remove a delegate.
         * @param func
         * @param thisArg
         * @return boolean
         *      - true success.
         *      - false already exist.
         */
        remove(func: Func, thisArg?: unknown): boolean;
    }

    export type SimpleDelegateFunction<T = void> = (...param: PluralOptional<T>) => void;

    export type ConditionDelegateFunction<T = void> = (...param: PluralOptional<T>) => boolean;

    abstract class DelegateInfo {
        callback: Function;

        hitPoint: number;

        thisArg: unknown;

        protected constructor(callback: Function, hitPoint: number, thisArg?: unknown) {
            this.callback = callback;
            this.hitPoint = hitPoint;
            this.thisArg = thisArg;
        }

        public equal(callback: Function, thisArg?: unknown): boolean {
            return this.callback === callback &&
                this.thisArg === thisArg;
        }
    }

    class SimpleDelegateInfo<T> extends DelegateInfo {
        declare callback: SimpleDelegateFunction<T>;

        constructor(callback: SimpleDelegateFunction<T>, hitPoint: number, thisArg?: unknown) {
            super(callback, hitPoint, thisArg);
        }
    }

    class ConditionDelegateInfo<T> extends DelegateInfo {
        declare callback: ConditionDelegateFunction<T>;

        constructor(callback: ConditionDelegateFunction<T>, hitPoint: number, thisArg?: unknown) {
            super(callback, hitPoint, thisArg);
        }
    }

    abstract class Delegate<DI extends DelegateInfo> {
        protected _callbackInfo: DI[] = [];

        /**
         * try to get the index of an existing delegate.
         * @param func
         * @param thisArg
         * @return index func index. -1 not exist.
         * @protected
         */
        protected getIndex(func: Function, thisArg?: unknown): number {
            return this._callbackInfo.findIndex(item => {
                return item.equal(func, thisArg);
            });
        }

        /**
         * remove Func by index.
         * @param index
         * @protected
         */
        protected removeByIndex(index: number): void {
            Gtk.removeByIndex(this._callbackInfo, index);
        }

        private _clearable: boolean = true;

        /**
         * remove all delegate.
         */
        public clear(): void {
            if (this._clearable) this._callbackInfo.length = 0;
            else mw.console.warn("GToolkit.Delegate", "Protected delegate can't be cleared.");
        }

        /**
         * whether remove all delegate is enable.
         */
        public get clearable(): boolean {
            return this._clearable;
        }

        /**
         * set clearable to false.
         */
        public setProtected(): this {
            this._clearable = false;
            return this;
        }
    }

    /**
     * Simple Delegate.
     * 简单委托.
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
    export class SimpleDelegate<T = void>
        extends Delegate<SimpleDelegateInfo<T>>
        implements IDelegate<T, SimpleDelegateFunction<T>> {
        public add(func: SimpleDelegateFunction<T>,
                   alive: number = -1,
                   repeatable: boolean = false,
                   thisArg?: unknown): boolean {
            if (!repeatable && this.getIndex(func, thisArg) !== -1) {
                return false;
            }
            this._callbackInfo.push(new SimpleDelegateInfo(func, alive, thisArg));
        }

        public once(func: SimpleDelegateFunction<T>, thisArg?: unknown): boolean {
            return this.add(func, 1, false, thisArg);
        }

        public only(func: SimpleDelegateFunction<T>, thisArg?: unknown): boolean {
            this.clear();
            return this.add(func, undefined, false, thisArg);
        }

        public invoke(...param: PluralOptional<T>): void {
            for (let i = this._callbackInfo.length - 1; i >= 0; --i) {
                const callbackInfo = this._callbackInfo[i];

                try {
                    if (callbackInfo.hitPoint !== 0) {
                        callbackInfo.callback.call(callbackInfo.thisArg, ...param);
                    }
                    if (callbackInfo.hitPoint > 0) --callbackInfo.hitPoint;
                    if (callbackInfo.hitPoint === 0) this.removeByIndex(i);
                } catch (e) {
                    mw.console.error(e.stack);
                }
            }
        }

        public remove(func: SimpleDelegateFunction<T>, thisArg?: unknown): boolean {
            const index: number = this.getIndex(func, thisArg);
            if (index !== -1) {
                this.removeByIndex(index);
                return true;
            }
            return false;
        }
    }

    /**
     * Condition Delegate
     * 条件委托.
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
    export class ConditionDelegate<T = void>
        extends Delegate<ConditionDelegateInfo<T>>
        implements IDelegate<T, ConditionDelegateFunction<T>> {
        public add(func: ConditionDelegateFunction<T>,
                   alive: number = -1,
                   repeatable: boolean = false,
                   thisArg?: unknown): boolean {
            if (!repeatable && this.getIndex(func, thisArg) !== -1) {
                return false;
            }
            this._callbackInfo.push(new ConditionDelegateInfo(func, alive, thisArg));
        }

        public once(func: ConditionDelegateFunction<T>, thisArg?: unknown): boolean {
            return this.add(func, 1, false, thisArg);
        }

        public only(func: ConditionDelegateFunction<T>, thisArg?: unknown): boolean {
            this.clear();
            return this.add(func, 1, false, thisArg);
        }

        public invoke(...param: PluralOptional<T>): void {
            for (let i = this._callbackInfo.length - 1; i >= 0; --i) {
                const callbackInfo = this._callbackInfo[i];
                let ret: boolean;
                if (callbackInfo.hitPoint !== 0) {
                    try {
                        ret = callbackInfo.callback.call(callbackInfo.thisArg, ...param);
                    } catch (e) {
                        ret = false;
                        mw.console.error(e.stack);
                    }
                }

                if (callbackInfo.hitPoint > 0 && ret) {
                    --callbackInfo.hitPoint;
                }

                if (callbackInfo.hitPoint === 0) {
                    this.removeByIndex(i);
                }
            }
        }

        public remove(func: ConditionDelegateFunction<T>, thisArg?: unknown): boolean {
            const index: number = this.getIndex(func, thisArg);
            if (index !== -1) {
                this.removeByIndex(index);
                return true;
            }
            return false;
        }
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Singleton
/**
 * Singleton factory.
 * To create a Singleton, extends Singleton<YourClass>().
 * @example
 * class UserDefineSingleton extends Singleton<UserDefineSingleton>() {
 *      public name: string;
 *
 *      public someSubMethod(): void {
 *          mw.console.log("someSubMethod in UserDefineSingleton called");
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
export function Singleton<T>() {
    return class {
        public static _instance: T = undefined;

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
            if (!this["_instance"]) {
                this["_instance"] = new this() as T;
                (this["_instance"] as any).onConstruct();
            }
            return this._instance;
        }

        /**
         * override when need extend constructor.
         */
        public onConstruct(): void {
        }
    };
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Random Generator
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
     * generate random point on unit circle.
     * @return {this}
     */
    public randomCircle(randomFunc: () => number = Math.random): this {
        let r = randomFunc() * Math.PI * 2;
        this._result = [Math.cos(r), Math.sin(r)];
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

//#region Switcher
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
    public default(callback: Method): this {
        this._default = callback;

        return this;
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

        this?._default?.();
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Regulator
/**
 * 分帧器.
 * @desc 为某个行为设定频率上限.
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
    private _lastUpdates: number[] = [];

    /**
     * 更新间隔. ms.
     */
    public updateInterval: number;

    /**
     * 生命值.
     * @desc 阶段时间内的可用次数.
     * @type {number}
     */
    public hitPoint: number = 1;

    /**
     * 尝试申请 下一次.
     */
    public request(): boolean {
        const now = Date.now();
        const threshold = now - this.updateInterval;
        while (this._lastUpdates.length >= this.hitPoint) {
            if (this._lastUpdates[0] < threshold) {
                this._lastUpdates.shift();
            } else {
                break;
            }
        }
        if (this._lastUpdates.length < this.hitPoint) {
            this._lastUpdates.push(now);
            return true;
        }
        return false;
    }

    /**
     * @param updateInterval 更新间隔. ms
     * @param hitPoint 时段内次数.
     */
    constructor(updateInterval: number = 1e3, hitPoint = 1) {
        this.updateInterval = updateInterval;
        this.hitPoint = hitPoint;
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

    /**
     * 获取只读的更新时间列表.
     */
    public getRecord(): ReadonlyArray<number> {
        return this._lastUpdates;
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Object Pool
/**
 * 可暂时回收的.
 */
export interface IRecyclable {
    /**
     * 使能. 赋能. 激活.
     * @param param
     */
    makeEnable(...param: unknown[]): void;

    /**
     * 去使能. 回收. 去活.
     */
    makeDisable(): void;

    /**
     * 析构函数.
     */
    makeDestroy?(): void;
}

/**
 * 对象池选项.
 */
export interface IObjectPoolOption<T> {
    /**
     * 构造函数.
     * @desc 用于在对象池空时生成新实例.
     * @desc 与构造函数二选一即可.
     * @desc 构造函数优先.
     */
    construct?: Constructor<T>;

    /**
     * 实例生成函数.
     * @desc 用于在对象池空时生成新实例.
     * @desc 与构造函数二选一即可.
     * @desc 构造函数优先.
     * @return {T}
     */
    generator?: () => T;

    /**
     * 自动减半时间间隔. ms.
     *      - 0 [不推荐] 不开启自动回收.
     */
    autoHalvingInterval?: number;

    /**
     * 最低阈值.
     */
    floor?: number;

    /**
     * 立即按照最低阈值生成实例.
     * @desc default false.
     */
    instantly?: boolean;
}

/**
 * 对象池.
 * @desc 执行自动垃圾回收.
 * @desc 可回收对象需实现 {@link IRecyclable} 接口.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class ObjectPool<T extends IRecyclable> {
//#region Member
    private readonly _itemConstructor: Constructor<T>;

    private readonly _itemGenerator: () => T;

    private _pool: T[] = [];

    private _tempPool: T[] = [];

    private _lastAutoRecycleTime: number = 0;

    private readonly _floor: number;

    private _autoHalvingInterval: number;

    public get autoHalvingInterval(): number {
        return this._autoHalvingInterval;
    }

    /**
     * 自动减半时间间隔. ms.
     *      - 0 [不推荐] 不开启自动回收.
     *      - 5 * 60e3. 5 min. 默认的.
     */
    public set autoHalvingInterval(value: number) {
        if (value === this._autoHalvingInterval) {
            return;
        }

        this._autoHalvingInterval = value;
        if (this._autoHalvingTimer) {
            clearInterval(this._autoHalvingTimer);
            this._autoHalvingTimer = null;
        }
        if (value !== 0) {
            this._autoHalvingTimer = mw.setInterval(
                () => this.autoRecycle(),
                value);
        }
    }

    private _autoHalvingTimer: number;

    private getNew(): T | null {
        return this._itemConstructor ?
            new this._itemConstructor() :
            this?._itemGenerator() ?? null;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event

    /**
     * 归还事件.
     * @type {Delegate.SimpleDelegate<T>}
     */
    public readonly onPush: Delegate.SimpleDelegate<T> = new Delegate.SimpleDelegate();

    /**
     * 借出事件.
     * @type {Delegate.SimpleDelegate<T>}
     */
    public readonly onPop: Delegate.SimpleDelegate<T> = new Delegate.SimpleDelegate();

    /**
     * 垃圾回收事件.
     * @type {Delegate.SimpleDelegate<T[]>}
     */
    public readonly onRecycle: Delegate.SimpleDelegate<[T[]]> = new Delegate.SimpleDelegate();

    /**
     * 清除事件.
     * @type {Delegate.SimpleDelegate<T[]>}
     */
    public readonly onClear: Delegate.SimpleDelegate<[T[]]> = new Delegate.SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public constructor(option: IObjectPoolOption<T>) {
        this._itemConstructor = option?.construct;
        this._itemGenerator = option?.generator;

        if (!this._itemConstructor && !this._itemGenerator) {
            mw.console.log(
                "GToolkit.ObjectPool",
                `you must provide a constructor or a generator.`);
            return;
        }

        this.autoHalvingInterval = option?.autoHalvingInterval ?? 5 * 60e3;
        this._floor = option?.floor ?? 0;

        if (option?.instantly) {
            for (let i = 0; i < this._floor; i++) {
                this.push(this.getNew());
            }
        }
    }

//#region Controller

    /**
     * 使池回收一个对象.
     * @param {T} rub
     */
    public push(...rub: T[]) {
        try {
            rub.forEach(r => r.makeDisable());
            this._pool.push(...rub);
            rub.forEach(r => this.onPush.invoke(...[r] as PluralOptional<T>));
        } catch (e) {
            mw.console.error("GToolkit.ObjectPool");
            mw.console.error(`error occurs in makeDisable. ${e}`);
            mw.console.error(e.stack);
        }
    }

    /**
     * 从池中取出一个对象 并赋初值..
     * @param {any} params
     */
    public pop(...params: ParamListInFunc<T["makeEnable"]>): T | null {
        this._lastAutoRecycleTime = Date.now();
        let need: T;
        if (this._tempPool.length > 0) need = this._tempPool.pop();
        else need = this._pool.pop();

        if (!need) need = this.getNew();
        if (!need) {
            mw.console.warn(
                "GToolkit.ObjectPool",
                `item couldn't be generated.`);
            return null;
        }

        this.onPop.invoke(...[need] as PluralOptional<T>);
        try {
            need.makeEnable(...params);
        } catch (e) {
            mw.console.error("GToolkit.ObjectPool");
            mw.console.error(`error occurs in makeEnable. ${e}`);
            mw.console.error(e.stack);
        }
        return need;
    }

    /**
     * 临时回收一个对象.
     * @desc 临时回收的对象直到 {@link finishTemp} 后才调用 {@link makeDisable}.
     * @desc 减少一次 {@link makeDisable} 调用
     * @param {T} rub
     */
    public tempPush(...rub: T[]) {
        this._tempPool.push(...rub);
    }

    /**
     * 结束临时回收.
     * @desc 立即回收所有临时回收对象
     */
    public finishTemp() {
        this.push(...this._tempPool);
        this._tempPool.length = 0;
    }

    /**
     * 立即执行自动垃圾回收策略.
     */
    public doRecycle() {
        if (this._tempPool.length > 0) this.finishTemp();
        this.autoRecycle();
    }

    /**
     * 清空池.
     */
    public clear() {
        if (this._tempPool.length > 0) this.finishTemp();
        this.onClear.invoke(this._pool);
        this._pool.forEach(item => {
            try {
                item?.makeDestroy();
            } catch (e) {
                mw.console.error("GToolkit.ObjectPool", `error occurs in makeDestroy.\n${e.stack}`);
            }
        });
        this._pool = [];
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private autoRecycle() {
        if (this._pool.length <= this._floor) return;
        const newLength = Math.max(
            Math.floor(this._pool.length / 2),
            this._floor,
        );
        const recycle = this._pool.splice(newLength);
        this.onRecycle.invoke(recycle);
        recycle.forEach(item => {
            try {
                item?.makeDestroy();
            } catch (e) {
                mw.console.error("GToolkit.ObjectPool", `error occurs in makeDestroy.\n${e.stack}`);
            }
        });
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Hyper Text
/**
 * HyperText 超文本解析器.
 * @desc 将超文本字符串转换为 Dom 树.
 * @desc 提供字符串切片功能.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class HyperText {
    public static readonly RegTag = /<\s*(\/?)\s*(u|b|i|s|color|size)\s*(=.*?)?>/g;
    public static readonly RegElement = /<\s*(u|b|i|s|color|size)\s*(=.*?)?>(.*?)<\s*\/\1\s*>/g;
    public tag: string | undefined = undefined;
    public attr: string = undefined;
    public content: (string | HyperText)[] = [];

    private _length: number;

    public get length() {
        if (this._length === undefined) {
            this._length = this
                .content
                .reduce((prev, curr) => prev + curr.length, 0);
        }

        return this._length;
    }

    /**
     * 转换为严格的超文本.
     * @desc 严格超文本将补全未闭合的标签.
     * @param {string} str
     * @return {string | undefined} 当传入的超文本字符串非法时 返回 undefined.
     *      - 当标签发生交错时 无效.
     */
    public static toStrictHyperText(str: string): string | undefined {
        let tagStack: string[] = [];
        this.RegTag.lastIndex = 0;

        while (true) {
            let result = this.RegTag.exec(str);
            if (result) {
                if (!Gtk.isNullOrEmpty(result[1])) {
                    if (tagStack.length > 0 && tagStack[tagStack.length - 1] === result[2]) {
                        tagStack.pop();
                    } else {
                        // Invalid HyperText.
                        // 交错 Tag.
                        return undefined;
                    }
                } else {
                    tagStack.push(result[2]);
                }
            } else {
                break;
            }
        }

        while (tagStack.length > 0) {
            str += `</${tagStack.pop()}>`;
        }

        return str;
    }

    /**
     * 从超文本字符串构建.
     * @param {string} str
     * @param {string} tag
     * @param {string} attr
     * @param {boolean} strict=true 是否 启用严格检查.
     *      - false 需保证提供了严格有效的超文本字符串.
     * @return {HyperText | undefined} 当传入的超文本字符串非法时 返回 undefined.
     *      - 当标签发生交错时 无效.
     */
    public static fromString(str: string, tag?: string, attr?: string, strict: boolean = true): HyperText | undefined {
        if (strict) str = this.toStrictHyperText(str);
        if (!str) return undefined;

        let hyperText: HyperText = new HyperText();
        hyperText.tag = tag;
        hyperText.attr = attr;

        let walked = 0;
        this.RegElement.lastIndex = 0;

        while (walked < str.length) {
            let result = this.RegElement.exec(str);

            let pureLeft = result?.index ?? 0;
            if (pureLeft > walked) {
                hyperText.content.push(str.slice(walked, pureLeft));
            }
            if (result) {
                let lastIndex = this.RegElement.lastIndex;
                hyperText.content.push(
                    HyperText.fromString(
                        str.slice(
                            pureLeft + result[1].length + (result[2]?.length ?? 0) + 2,
                            pureLeft + result[1].length + (result[2]?.length ?? 0) + 2 + result[3].length),
                        result[1],
                        result[2],
                        false),
                );
                this.RegElement.lastIndex = lastIndex;
                walked = result.index + result[0].length;
            } else {
                hyperText.content.push(str.slice(walked));
                break;
            }
        }

        return hyperText;
    }

    /**
     * 切片.
     * @param {number} start
     * @param {number} end
     * @return {string}
     */
    public slice(start?: number, end?: number): string {
        let result = "";

        let walked = 0;
        for (const content of this.content) {
            if (walked >= end) break;

            if (walked + content.length <= start) {
                start -= content.length;
                walked += content.length;
                continue;
            }

            result += content.slice(start, end - walked);
            start = Math.max(0, start - content.length);
            walked += Math.min(content.length, end - walked);
        }

        return this.tag ? surroundByTag(result, this.tag, this.attr) : result;
    }
}

/**
 * surround the string with tag.
 * @param {string} tag
 * @param {string} str
 * @param {string} attr
 * @return {string}
 */
function surroundByTag(str: string, tag: string, attr?: string): string {
    return `<${tag}${attr ?? ""}>${str}</${tag}>`;
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Revised Interval

/**
 * Revised Interval.
 * @desc 提供时间校正的间隔执行.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class RevisedInterval {
    private _timer: number;

    private _last: number;

    /**
     * @param {() => void} _callback Callback.
     * @param {number} _interval Interval.
     * @param {number} delay Delay.
     * @param {boolean} instant if instant is true, callback will be called immediately.
     */
    constructor(
        private _callback: () => void,
        private _interval: number,
        delay: number = 0,
        instant: boolean = false) {
        const now = Date.now();
        if (delay > 0 && instant) {
            this._timer = mw.setTimeout(this.revisedIntervalHandler, delay);
            this._last = now - this._interval + delay;
        } else {
            if (instant) this.safeCallback();
            this._timer = mw.setTimeout(this.revisedIntervalHandler, this._interval + delay);
            this._last = now + delay;
        }
    }

    private revisedIntervalHandler = () => {
        const now = Date.now();
        this.safeCallback();

        // effect of callback may shutdown this interval.
        if (this._timer === undefined) return;
        this._timer = mw.setTimeout(this.revisedIntervalHandler, 2 * this._interval - now + this._last);
        this._last = now;
    };

    public shutdown() {
        if (this._timer === undefined) return;
        mw.clearTimeout(this._timer);
        this._timer = undefined;
    }

    private safeCallback() {
        try {
            this._callback?.();
        } catch (e) {
            mw.console.error("GToolkit.RevisedInterval");
            mw.console.error(`error occurs in callback. ${e}`);
            mw.console.error(e.stack);
        }
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Single Frame Cache
const singleFrameCacheHoldMap: Map<WeakRef<object>, unknown> = new Map();

let isSingleFrameCacheRegistered: boolean = false;

/**
 * 单帧缓存.
 * @desc 为 getter 的结果在该帧之内进行持久化.
 * @param {() => boolean} dirtyPred 脏谓词. 当该函数存在且执行为 true 时，将强制刷新缓存. 请在内部消耗 dirty 状态.
 * @return {(target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor}
 */
export function SingleFrameCache(dirtyPred?: () => boolean) {
    if (!isSingleFrameCacheRegistered) {
        mw.TimeUtil.onEnterFrame.add(() => {
            for (const [key, value] of singleFrameCacheHoldMap) {
                if (key.deref() === undefined) {
                    singleFrameCacheHoldMap.delete(key);
                } else {
                    singleFrameCacheHoldMap.set(key, undefined);
                }
            }
        });
        isSingleFrameCacheRegistered = true;
    }

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor || typeof descriptor.get !== "function") {
            throw new Error("SingleFrameCache can only be applied to getters.");
        }
        const weakRef = new WeakRef(target);
        singleFrameCacheHoldMap.set(weakRef, undefined);
        const originalGetter = descriptor.get;

        descriptor.get = function () {
            let value = singleFrameCacheHoldMap.get(weakRef);
            if (value !== undefined && !(dirtyPred?.() ?? false)) {
                return value;
            } else {
                value = originalGetter.apply(this);
                singleFrameCacheHoldMap.set(weakRef, value);
                return value;
            }
        };

        return descriptor;
    };
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region MwTransform
export class SimulatedWorldTransform implements ITransform {
    public parent: mw.GameObject | undefined;

    public localPos: IPoint3 = {
        x: 0,
        y: 0,
        z: 0,
    };

    private _cached: IPoint3;

    public get position(): IPoint3 {
        if (!this.parent) return this.localPos;

        if (!this._cached) this._cached = {x: 0, y: 0, z: 0};
        this._cached.x = this.localPos.x + this.parent.worldTransform.position.x;
        this._cached.y = this.localPos.y + this.parent.worldTransform.position.y;
        this._cached.z = this.localPos.z + this.parent.worldTransform.position.z;

        return this._cached;
    }

    public set position(pos: IPoint3) {
        if (this.parent) {
            const parentPos = this.parent.worldTransform.position;
            this.localPos.x = pos.x - parentPos.x;
            this.localPos.y = pos.y - parentPos.y;
            this.localPos.z = pos.z - parentPos.z;
        } else {
            this.localPos.x = pos.x;
            this.localPos.y = pos.y;
            this.localPos.z = pos.z;
        }
    }

    constructor(pos: IPoint3,
                parent: mw.GameObject | undefined) {
        this.parent = parent;
        this.localPos.x = pos.x;
        this.localPos.y = pos.y;
        this.localPos.z = pos.z;
    }
}

export class LinkedLocalTransform implements ITransform {
    private _linked: SimulatedWorldTransform;

    public set position(pos: IPoint3) {
        this._linked.localPos.x = pos.x;
        this._linked.localPos.y = pos.y;
        this._linked.localPos.z = pos.z;
    }

    public get position(): IPoint3 {
        return this._linked.localPos;
    }

    constructor(linked: SimulatedWorldTransform) {
        this._linked = linked;
    }
}

/**
 * MW 场景 Transform.
 */
export class MwTransform implements ITransformable {
    parent: mw.GameObject | undefined;

    worldTransform: ITransform;

    localTransform: ITransform;

    constructor(localPosition?: IPoint3, parent?: mw.GameObject) {
        const simulatedWorldTransform = new SimulatedWorldTransform(
            localPosition ?? {x: 0, y: 0, z: 0},
            parent);
        this.worldTransform = simulatedWorldTransform;
        this.localTransform = new LinkedLocalTransform(simulatedWorldTransform);
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Provider
/**
 * 服务聚合提供者.
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
export type Provider<T extends object> = {
    [P in keyof T]: T[P] extends (...args: unknown[]) => (void | Array<unknown>) ? T[P] : never;
}

/**
 * 服务聚合化.
 * @desc 允许聚合调用多个同类型对象的公共方法.
 * @desc 允许聚合无返回值或拥有数组返回值的方法.
 * @desc 当原型方法返回一个数组时 聚合方法将返回一个合并的数组 否则无返回值.
 * @param {T[]} selector
 * @return {Provider<T> | undefined}
 */
export function createProvider<T extends object>(selector: T[]): Provider<T> | undefined {
    if (!selector || selector.length <= 0) return undefined;

    let criterion = selector[0];

    let provider = {} as unknown;

    const providerHandler = function (funcName: string, args: unknown[]): void | Array<unknown> {
        let cluster: Array<unknown> | undefined = undefined;
        for (const s of selector) {
            let r = s[funcName]?.(...args);
            if (Array.isArray(r)) {
                if (!cluster) cluster = [];
                cluster.push(...r);
            }
        }

        if (cluster) return cluster;
        else return;
    };

    let enumerable = Object.getPrototypeOf(criterion);
    if (enumerable === Object.prototype) enumerable = criterion;
    for (const key of Gtk.getAllMember(enumerable)) {
        if (typeof criterion[key] === "function" &&
            key !== "constructor") {
            provider[key] = (...args: unknown[]) => {
                return providerHandler(key, args);
            };
        }
    }

    return provider as Provider<T>;
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Indexer
export type IndexerKey = number | string

/**
 * 反向索引.
 * @desc 为本应出现在同关系表中的关系构建一对一索引.
 */
export class ReverseIndexer<P, F, FI> {
    public map: Map<FI, P> = new Map();

    public query(f: FI): P | undefined {
        return this.map.get(f);
    }

    public static build<P, F, IK extends IndexerKey, FI extends F | IK = F>(
        allPrimariesGetter: Getter<ReadonlyArray<P>>,
        foreignKeySelector: (item: Readonly<P>) => IK,
        foreignerItemGetter: (key: IK) => Readonly<F>,
        queryKeySelector?: (item: Readonly<F>) => FI,
    ): ReverseIndexer<P, F, FI> {
        const indexer = new ReverseIndexer<P, F, FI>();
        const allPrimaries = allPrimariesGetter();
        for (const p of allPrimaries) {
            let f = foreignerItemGetter(foreignKeySelector(p));
            if (!f) continue;
            indexer.map.set(queryKeySelector?.(f) ?? (f as FI), p);
        }

        return indexer;
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Export
const Gtk = GToolkit;

export default Gtk;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄