import AccessorTweenBehavior from "./AccessorTweenBehavior";
import IAccessorTween, {Getter, Setter} from "./IAccessorTween";
import Easing, {EasingFunction} from "../easing/Easing";

/**
 * Tween Task.
 * A task that describes how a tween works.
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
export class TweenTask<T> {
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
     * 󰓕倒放 位移量.
     * @private
     */
    private _backwardStartVal?: T;

    //TODO_LviatYi 循环任务支持.

    /**
     * 是否 任务已 󰄲完成.
     */
    public isDone: boolean = false;

    /**
     * 是否 任务已 󰏤暂停.
     *      󰏤暂停 意味着 Task 可以继续播放
     * @public
     * @beta
     */
    public get isPause(): boolean {
        return this._lastStopTime !== undefined;
    }

    /**
     * 是否 任务正 󰓕倒放.
     * @public
     * @beta
     */
    public get isBackward(): boolean {
        return this._backwardStartVal !== undefined;
    }

    /**
     * 从 _virtualStartTime 到调用时的时间经过比率.
     * 用以控制播放进度.
     * @public
     * @beta
     */
    public get elapsed(): number {
        return (Date.now() - this._virtualStartTime) / this._duration;
    }

//region Tween Action

    /**
     * 更新插值函数.
     * @param easingFunc
     * @public
     */
    public easing(easingFunc: EasingFunction) {
        this._easingFunc = easingFunc;
    }

    /**
     * 󰏤暂停 补间.
     * @public
     */
    public pause(): TweenTask<T> {
        this._lastStopTime = Date.now();
        this.onPause.invoke();

        return this;
    }

    /**
     * 快进至结束.
     * @public
     * @beta
     */
    public fastForwardToEnd(): TweenTask<T> {
        this._virtualStartTime = 0;

        return this;
    }

    /**
     * 󰐊播放 补间.
     * @param recurve 是否重置动画曲线.
     *      - true Task 将重新完整地进行曲线插值.
     *      - false default. Task 将从暂停前继续播放.
     * @public
     */
    public continue(recurve: boolean = false): TweenTask<T> {
        if (this.isPause) {
            this._virtualStartTime += Date.now() - this._lastStopTime;
        }
        if (recurve || this.isDone) {
            this._virtualStartTime = Date.now();
            this._forwardStartVal = this._getter();
        }

        this._lastStopTime = undefined;
        this.onContinue.invoke();

        return this;
    }

    /**
     * 重置 补间.
     * @param pause 是否伴随 󰏤暂停
     * @public
     */
    public restart(pause: boolean): TweenTask<T> {
        this._setter(this._startValue);
        this._virtualStartTime = Date.now();
        if (pause) {
            this.pause();
        } else {
            this.continue();
        }

        this.onRestart.invoke();

        return this;
    }

    /**
     * 󰓕倒放 播放状态.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从现有的曲线继续播放.
     * @param pause 是否 󰏤暂停. default false.
     * @public
     * @beta
     */
    public backward(recurve: boolean = true, pause: boolean = false): TweenTask<T> {
        this._backwardStartVal = this._getter();

        if (recurve) {
            this._virtualStartTime = Date.now();
        }

        if (pause) {
            this.pause();
        } else {
            this.continue();
        }

        return this;
    }

    /**
     * 󰐊正放 播放状态.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从现有的曲线继续播放.
     * @param pause 是否 󰏤暂停. default false.
     * @public
     * @beta
     */
    public forward(recurve: boolean = true, pause: boolean = false): TweenTask<T> {
        this._backwardStartVal = undefined;
        this._forwardStartVal = this._getter();

        if (recurve) {
            this._virtualStartTime = Date.now();
        }

        if (pause) {
            this.pause();
        } else {
            this.continue();
        }

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
    public call(force: boolean = false): void {
        if (!force && (this.isDone || this.isPause)) {
            return;
        }
        const elapsed = this.elapsed;
        if (this.isBackward) {
            this._setter(dataTween(this._backwardStartVal, this._startValue, this._easingFunc(elapsed)));
        } else {
            this._setter(dataTween(this._forwardStartVal, this._endValue, this._easingFunc(elapsed)));
        }
        if (elapsed >= 1) {
            this.isDone = true;
            this.onDone.invoke(this.isBackward);
            if (this.isBackward) {
                this._backwardStartVal = undefined;
            }
        }
    }

    constructor(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartValue: Partial<T> = undefined, easing: EasingFunction = Easing.linear) {
        const startTime = Date.now();
        this._getter = getter;
        this._setter = setter;
        this._createTime = startTime;
        this._virtualStartTime = startTime;
        this._duration = duration;
        const currentValue = getter();
        if (forceStartValue) {
            this._startValue = {...currentValue, ...forceStartValue};
            this._setter(this._startValue);
        } else {
            this._startValue = currentValue;
        }
        this._forwardStartVal = this._startValue;
        this._endValue = dist;
        this._easingFunc = easing;
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
 * @version 0.5.1b
 */
class AccessorTween implements IAccessorTween {
    private static readonly _twoPhaseTweenBorder: number = 0.5;

    private _tasks: TweenTask<unknown>[] = [];

    private _behavior: AccessorTweenBehavior;

    private _isBehaviorReady: boolean = false;

    private get behavior() {
        if (!this._isBehaviorReady) {
            Core.Script.spawnScript(AccessorTweenBehavior).then(script => {
                this._behavior = script;
                this._isBehaviorReady = true;
            });
        }

        return this._behavior;
    }

    public to<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T> = undefined, easing: EasingFunction = Easing.linear): TweenTask<T> {
        if (duration < 0) {
            return;
        }
        return this.addTweenTask(getter, setter, dist, duration, forceStartVal, easing);
    }

    public move<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T> = undefined, easing: EasingFunction = Easing.linear): TweenTask<T> {
        if (duration < 0) {
            return;
        }
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
     * @private
     */
    private addTweenTask<T>(getter: Getter<T>, setter: Setter<T>, endVal: T, duration: number, forceStartVal: Partial<T>, easing: EasingFunction) {
        this.touchBehavior();
        const newTask = new TweenTask(getter, setter, endVal, duration, forceStartVal, easing);
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
        if (SystemUtil?.getEditorVersion()) {
            this.behavior;
        }
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

    if (typeof startVal === "number" && typeof distVal === "number") {
        return ((distVal - startVal) * process + startVal) as T;
    }

    if (typeof startVal === "string" && typeof distVal === "string") {
        //TODO_LviatYi 待定更花式的 string 补间.
        return (process < this._twoPhaseTweenBorder ? startVal : distVal) as T;
    }

    if (typeof startVal === "boolean" && typeof distVal === "boolean") {
        return (process < this._twoPhaseTweenBorder ? startVal : distVal) as T;
    }

    if (Array.isArray(startVal) && Array.isArray(distVal)) {
        //TODO_LviatYi 待定更花式的 Array 补间.
        return (process < this._twoPhaseTweenBorder ? startVal : distVal) as T;
    }

    if (typeof startVal === "object" && typeof distVal === "object") {
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
    if (typeof start === "number" && typeof dist === "number") {
        return (dist + start) as T;
    }

    if (typeof start === "object" && typeof dist === "object") {
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