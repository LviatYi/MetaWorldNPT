import AccessorTweenBehavior from "./AccessorTweenBehavior";
import IAccessorTween, {Getter, Setter} from "./IAccessorTween";
import Easing, {EasingFunction} from "../easing/Easing";
import MultiDelegate from "../delegate/MultiDelegate";
import ITweenTask from "./ITweenTask";

/**
 * Tween Task.
 * A task that describes how a tween works.
 *
 * Tips: Tween Task is energetic, it means that if `pause` is optional, it always defaults to false.
 * Tips: Tween Task is cautious, it means that it is always trying to reset the animation curve.
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
export class TweenTask<T> implements ITweenTask<T> {
    /**
     * 创建时间戳.
     * @private
     */
    private readonly _createTime: number;

    /**
     * 虚拟开始时间戳.
     * @private
     */
    private _virtualStartTime: number;

    /**
     * 上次暂停时间戳.
     * @private
     */
    private _lastStopTime?: number = undefined;

    private readonly _duration: number;

    private readonly _startValue: T;

    private readonly _endValue: T;

    /**
     * 󰐊正放 时的虚拟 startValue.
     * 用于重校对 curves.
     * @private
     */
    private _forwardStartVal: T;

    private readonly _getter: Getter<T>;

    private readonly _setter: Setter<T>;

    /**
     * 插值函数.
     * @private
     */
    private _easingFunc: EasingFunction;

    /**
     * 结束时自动销毁.
     */
    public isAutoDestroy: boolean = true;

    /**
     * 是否 重复 播放.
     *      重复 播放指结束时自动 重置 并 󰐊播放.
     * @private
     */
    private _isRepeat: boolean = false;

    /**
     * 是否 󱞳往复 播放.
     *      󱞳往复 播放指结束时自动 󰓕倒放 至开头.
     *      并不意味着 󰓕倒放 完成后会继续 󰐊播放. 这种行为仍需要 {@link _isRepeat} 参与.
     * @private
     */
    private _isPingPong: boolean = false;

    /**
     * 󰓕倒放 位移量.
     * @private
     */
    private _backwardStartVal?: T;

    /**
     * 是否 任务已 󰄲完成.
     */
    public isDone: boolean = false;

    public get isPause(): boolean {
        return this._lastStopTime !== undefined;
    }

    public get isBackward(): boolean {
        return this._backwardStartVal !== undefined;
    }

    public get elapsed(): number {
        return (Date.now() - this._virtualStartTime) / this._duration;
    }

//region Tween Action

    public easing(easingFunc: EasingFunction) {
        this._easingFunc = easingFunc;
    }

    public pause(): TweenTask<T> {
        this._lastStopTime = Date.now();
        this.onPause.invoke();

        return this;
    }

    public fastForwardToEnd(): TweenTask<T> {
        this._virtualStartTime = 0;

        return this;
    }

    public continue(recurve: boolean = true): TweenTask<T> {
        if (this.isPause) {
            this._virtualStartTime += Date.now() - this._lastStopTime;
        }

        this.isDone = false;
        this.recurve(recurve);

        this._lastStopTime = undefined;
        this.onContinue.invoke();

        return this;
    }

    public restart(pause: boolean = false): TweenTask<T> {
        this._setter(this._startValue);
        this._forwardStartVal = this._startValue;
        this._backwardStartVal = undefined;
        this._virtualStartTime = Date.now();
        this._lastStopTime = undefined;
        if (pause) {
            this.pause();
        } else {
            this.continue();
        }

        this.onRestart.invoke();

        return this;
    }

    public backward(recurve: boolean = true, pause: boolean = false): TweenTask<T> {
        this._backwardStartVal = this._getter();

        if (pause) {
            this.pause();
            this.recurve(recurve);
        } else {
            this.continue(recurve);
        }

        return this;
    }

    public forward(recurve: boolean = true, pause: boolean = false) {
        this._backwardStartVal = undefined;
        this._forwardStartVal = this._getter();

        if (pause) {
            this.pause();
            this.recurve(recurve);
        } else {
            this.continue(recurve);
        }

        return this;
    }

    public recurve(recurve: boolean = true): TweenTask<T> {
        if (!recurve) {
            return;
        }
        if (this.isBackward) {
            this._backwardStartVal = this._getter();
        } else {
            this._forwardStartVal = this._getter();
        }

        this._virtualStartTime = Date.now();
        if (this.isPause) {
            this._lastStopTime = Date.now();
        }

        return this;
    }

    public repeat(repeat: boolean = true): TweenTask<T> {
        this._isRepeat = repeat;

        return this;
    }

    public pingPong(pingPong: boolean = true, repeat: boolean = true): TweenTask<T> {
        this._isPingPong = pingPong;
        this.repeat(repeat);

        return this;
    }

    /**
     * 设置 󰩺自动销毁.
     * @param auto
     * @public
     */
    public autoDestroy(auto: boolean): TweenTask<T> {
        this.isAutoDestroy = auto;
        return this;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Event

    /**
     * 当 󰄲完成 时.
     *      val: 是否 任务正 󰓕倒放.
     * @public
     * @beta
     */
    public onDone: MultiDelegate<boolean> = new MultiDelegate<boolean>();

    /**
     * 当 󰩺销毁 时.
     * @public
     * @beta
     */
    public onDestroy: MultiDelegate<void> = new MultiDelegate<void>();

    /**
     * 当 󰏤暂停 时.
     * @public
     * @beta
     */
    public onPause: MultiDelegate<void> = new MultiDelegate<void>();

    /**
     * 当 󰐊继续 时.
     * @public
     * @beta
     */
    public onContinue: MultiDelegate<void> = new MultiDelegate<void>();

    /**
     * 当 重置 时.
     * @public
     * @beta
     */
    public onRestart: MultiDelegate<void> = new MultiDelegate<void>();

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 调用任务.
     * 除非强制 当 󰄲完成(done) 或 󰏤暂停(pause) 时 不调用 setter.
     *
     * @param force 强制调用. default is false.
     * @public
     * @beta
     */
    public call(force: boolean = false): TweenTask<T> {
        if (!force && (this.isDone || this.isPause)) {
            return this;
        }
        const elapsed = this.elapsed;
        if (this.isBackward) {
            this._setter(dataTween(this._backwardStartVal, this._startValue, this._easingFunc(elapsed)));
        } else {
            this._setter(dataTween(this._forwardStartVal, this._endValue, this._easingFunc(elapsed)));
        }

        // 确保到达终点后再结束.
        if (elapsed >= 1) {
            if (this._isPingPong && !this.isBackward) {
                this.backward(true, false);
            } else if (this._isRepeat) {
                this.restart();
            } else {
                this.isDone = true;
            }

            this._forwardStartVal = this._startValue;
            this.onDone.invoke(this.isBackward);
        }

        return this;
    }

    constructor(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartValue: Partial<T> = undefined, easing: EasingFunction = Easing.linear, isRepeat: boolean = false, isPingPong: boolean = false) {
        const startTime = Date.now();
        this._getter = getter;
        this._setter = setter;
        this._createTime = startTime;
        this._virtualStartTime = startTime;
        this._duration = duration;
        if (forceStartValue !== undefined) {
            let startVal: T;
            if (isPrimitiveType(forceStartValue)) {
                startVal = forceStartValue as unknown as T;
            } else {
                startVal = {...getter(), ...forceStartValue};
            }
            this._setter(startVal);
        }
        this._startValue = getter();
        this._forwardStartVal = this._startValue;
        this._endValue = dist;
        this._easingFunc = easing;
        this._isRepeat = isRepeat;
        this._isPingPong = isPingPong;
    }
}

/**
 * Accessor Tween.
 * A Tween utility driven by Getter & Setter.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 0.6.6b
 */
class AccessorTween implements IAccessorTween {
    private static readonly _twoPhaseTweenBorder: number = 0.5;

    private _tasks: TweenTask<unknown>[] = [];

    private _behavior: AccessorTweenBehavior = undefined;

    private get behavior() {
        if (!this._behavior) {
            Core.Script.spawnScript(AccessorTweenBehavior).then(script => {
                this._behavior = script;
            });
        }

        return this._behavior;
    }

    public to<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T> = undefined, easing: EasingFunction = Easing.linear): TweenTask<T> {
        return this.addTweenTask(getter, setter, dist, duration, forceStartVal, easing);
    }

    public move<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T> = undefined, easing: EasingFunction = Easing.linear): TweenTask<T> {
        let startVal: T;
        if (forceStartVal) {
            startVal = {...getter(), ...forceStartVal};
        }

        return this.addTweenTask(getter, setter, moveAdd(startVal, dist), duration, forceStartVal, easing);
    }

    /**
     * add tween task.
     *
     * @param getter
     * @param setter
     * @param endVal
     * @param duration
     * @param forceStartVal
     * @param easing
     * @param isRepeat
     * @param isPingPong
     * @private
     */
    private addTweenTask<T>(getter: Getter<T>, setter: Setter<T>, endVal: T, duration: number, forceStartVal: Partial<T> = undefined, easing: EasingFunction = Easing.linear, isRepeat: boolean = false, isPingPong: boolean = false): TweenTask<T> {
        if (duration < 0) {
            return null;
        }

        this.touchBehavior();

        const newTask = new TweenTask(getter, setter, endVal, duration, forceStartVal, easing, isRepeat, isPingPong);
        this._tasks.push(newTask);
        return newTask;
    }

    /**
     * 强制刷新.
     * @public
     */
    public update() {
        const doneCacheIndex: number[] = [];
        for (let i = 0; i < this._tasks.length; i++) {
            const task = this._tasks[i];
            if (task.isDone) {
                if (task.elapsed <= 1) {
                    task.isDone = false;
                    task.call();
                } else if (task.isAutoDestroy) {
                    doneCacheIndex.push(i);
                }
            } else {
                task.call();
            }
        }

        for (let i = doneCacheIndex.length - 1; i >= 0; --i) {
            this.removeTweenTaskByIndex(i);
        }
    }

    /**
     * 移除任务.
     * @param task
     * @public
     * @beta
     */
    public removeTweenTask<T>(task: TweenTask<T>): boolean {
        const index = this._tasks.indexOf(task);
        return this.removeTweenTaskByIndex(index);
    }

    /**
     * 根据索引在 `_task` 中移除 task.
     * @param index
     * @private
     */
    private removeTweenTaskByIndex(index: number): boolean {
        if (index > -1 && index < this._tasks.length) {
            this._tasks[index].onDestroy.invoke();
            this._tasks.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 自动挂载 Behavior.
     * @private
     */
    private touchBehavior() {
        this.behavior;
    }
}

export default new AccessorTween();

/**
 * Calculate tween data from startVal to distVal according to process.
 *
 * @param startVal val start.
 * @param distVal val end.
 * @param process process ratio.
 */
function dataTween<T>(startVal: T, distVal: T, process: number): T {
    //TODO_LviatYi 补间函数应按基本类型 参数化、客制化

    if (isNumber(startVal) && isNumber(distVal)) {
        return ((distVal - startVal) * process + startVal) as T;
    }

    if (isString(startVal) && isString(distVal)) {
        //TODO_LviatYi 待定更花式的 string 补间.
        return (process < this._twoPhaseTweenBorder ? startVal : distVal) as T;
    }

    if (isBoolean(startVal) && isBoolean(distVal)) {
        return (process < this._twoPhaseTweenBorder ? startVal : distVal) as T;
    }

    if (Array.isArray(startVal) && Array.isArray(distVal)) {
        //TODO_LviatYi 待定更花式的 Array 补间.
        return (process < this._twoPhaseTweenBorder ? startVal : distVal) as T;
    }

    if (isObject(startVal) && isObject(distVal)) {
        const result = clone(startVal);
        for (const valKey in startVal) {
            result[valKey] = dataTween(startVal[valKey], distVal[valKey], process);
        }
        return result;
    }

    return null;
}

/**
 * Determine add behavior of data in Tween move.
 *
 * @param start start.
 * @param dist dist.
 */
function moveAdd<T>(start: T, dist: T): T {
    if (isNumber(start) && isNumber(dist)) {
        return (dist + start) as T;
    }

    if (isObject(start) && isObject(dist)) {
        const result = clone(start);
        for (const valKey in start) {
            result[valKey] = moveAdd(start[valKey], dist[valKey]);
        }
        return result;
    }

    return dist;
}

/**
 * Clone enumerable properties.
 * @param data
 */
function clone<T>(data: T): T {
    return Object.assign({}, data);
}

/**
 * Is Primitive Type.
 * @param value
 */
function isPrimitiveType<T>(value: T): value is T extends string | number | boolean | symbol ? T : never {
    return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "symbol";
}

/**
 * Is number.
 * @param value
 */
function isNumber<T>(value: T): value is T extends number ? T : never {
    return typeof value === "number";
}

/**
 * Is string.
 * @param value
 */
function isString<T>(value: T): value is T extends string ? T : never {
    return typeof value === "string";
}

/**
 * Is boolean.
 * @param value
 */
function isBoolean<T>(value: T): value is T extends boolean ? T : never {
    return typeof value === "boolean";
}

/**
 * Is object.
 * @param value
 */
function isObject<T>(value: T): value is T extends object ? T : never {
    return typeof value === "object";
}