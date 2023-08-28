import AccessorTweenBehavior from "./AccessorTweenBehavior";
import ITweenTask from "./ITweenTask.js";
import IAccessorTween, {Getter, Setter} from "./IAccessorTween.js";
import Easing, {EasingFunction} from "../easing/Easing.js";
import MultiDelegate from "../delegate/MultiDelegate.js";

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
    public isAutoDestroy: boolean = false;

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
     * 当任务 是 重复 播放的 isDone 永远不会为 true. 但仍能调用 {@link onDone}.
     */
    public isDone: boolean = false;

    public get isPause(): boolean {
        return this._lastStopTime !== undefined;
    }

    public get isBackward(): boolean {
        return this._backwardStartVal !== undefined;
    }

    public get isRepeat(): boolean {
        return this._isRepeat;
    }

    public get isPingPong(): boolean {
        return this._isPingPong;
    }

    public get elapsed(): number {
        return (Date.now() - this._virtualStartTime) / this._duration;
    }

//region Tween Action

    public easing(easingFunc: EasingFunction) {
        this._easingFunc = easingFunc;
    }

    public pause(): ITweenTask<T> {
        this._lastStopTime = Date.now();
        this.onPause.invoke();

        return this;
    }

    public continue(recurve: boolean = true): ITweenTask<T> {
        if (this.isPause) {
            this._virtualStartTime += Date.now() - this._lastStopTime;
        }

        this.isDone = false;
        this.recurve(recurve);

        this._lastStopTime = undefined;
        this.onContinue.invoke();

        return this;
    }

    public restart(pause: boolean = false): ITweenTask<T> {
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

    public fastForwardToEnd(): ITweenTask<T> {
        this._virtualStartTime = 0;

        return this;
    }

    public backward(recurve: boolean = true, pause: boolean = false): ITweenTask<T> {
        this._backwardStartVal = this._getter();

        if (pause) {
            this.pause();
            this.recurve(recurve);
        } else {
            this.continue(recurve);
        }

        return this;
    }

    public forward(recurve: boolean = true, pause: boolean = false): ITweenTask<T> {
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

    public recurve(recurve: boolean = true): ITweenTask<T> {
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

    public repeat(repeat: boolean = true): ITweenTask<T> {
        this._isRepeat = repeat;

        return this;
    }

    public pingPong(pingPong: boolean = true, repeat: boolean = true): ITweenTask<T> {
        this._isPingPong = pingPong;
        this.repeat(repeat);

        return this;
    }

    /**
     * 设置 󰩺自动销毁.
     * @param auto
     * @public
     */
    public autoDestroy(auto: boolean = true): ITweenTask<T> {
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
    public call(force: boolean = false): ITweenTask<T> {
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
 * TweenTaskGroup.
 * 允许将 TweenTask 编组并进行统一管理.
 * 允许顺序播放 TweenTask.
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
export class TweenTaskGroup {
    public readonly tasks: ITweenTask<unknown>[] = [];

    private readonly _loopCallbacks: ((isBackward: boolean) => void)[] = [];

    private _currentSeqIndex?: number = undefined;

    private _repeat: boolean = false;

    /**
     * 是否 重复 播放.
     * @beta
     */
    public get isRepeat(): boolean {
        return this._repeat;
    }

    /**
     * 是否 󰒿顺序 播放.
     * @beta
     */
    public get isSeq(): boolean {
        return this._currentSeqIndex !== undefined;
    };

    /**
     * 添加 task.
     * @param task
     * @beta
     */
    public add(task: ITweenTask<unknown>): TweenTaskGroup {
        if (this.isSeq) {
            task.repeat(false);
            task.autoDestroy(false);
            task.pause();
            const length = this.tasks.length;

            if (length > 0) {
                const lastIndex = length - 1;
                this.tasks[lastIndex].onDone.remove(this._loopCallbacks[lastIndex]);
                this._loopCallbacks[lastIndex] = (isBackward: boolean) => {
                    if (task.isPingPong && !isBackward) {
                        return;
                    }

                    task?.continue();
                };
            }
            this._loopCallbacks.push((isBackward: boolean) => {
                if (task.isPingPong && !isBackward) {
                    return;
                }

                this.restart();
            });
            if (this.isRepeat) {
                task.onDone.add(this._loopCallbacks[this.tasks.length]);
            }
        }
        this.tasks.push(task);

        return this;
    }

    /**
     * 移出 task.
     * @param indexOrTask
     * @beta
     */
    public remove(indexOrTask: number | ITweenTask<unknown>): TweenTaskGroup {
        const index = typeof indexOrTask === "number" ? indexOrTask : this.tasks.indexOf(indexOrTask);
        if (this.isSeq) {
            this._loopCallbacks.splice(index, 1);
        }

        return this;
    }

    /**
     * 调用 tasks.
     * @beta
     */
    public call(): TweenTaskGroup {
        if (this.isSeq) {
            this.tasks[this._currentSeqIndex].call();
        } else {
            for (const task of this.tasks) {
                task.call();
            }
        }

        return this;
    }

//region Tween

    /**
     * 顺序调用组内 task.
     * 不允许 task 是 重复 播放的 否则可能造成非预期的行为.
     * @param pause
     */
    public sequence(pause: boolean = false): TweenTaskGroup {
        if (this.isSeq) {
            return;
        }
        this._currentSeqIndex = 0;

        const length = this.tasks.length;
        this._loopCallbacks.length = 0;

        for (let i = 0; i < length - 1; i++) {
            const task = this.tasks[i];
            const taskNext = this.tasks[i + 1];
            task.repeat(false);
            task.autoDestroy(false);

            this._loopCallbacks.push((isBackward: boolean) => {
                if (task.isPingPong && !isBackward) {
                    return;
                }
                taskNext.continue();
            });

            this.tasks[i].onDone.add(this._loopCallbacks[i]);
        }

        if (length > 0) {
            this._loopCallbacks.push((isBackward: boolean) => {
                this.restart();
            });
            if (this.isRepeat) {
                this.tasks[length - 1].onDone.add(this._loopCallbacks[length - 1]);
            }
        }

        this.restart(pause);

        return this;
    }

    /**
     * 同时调用组内 task.
     * @param pause
     */
    public sameTime(pause: boolean = false): TweenTaskGroup {
        if (!this.isSeq) {
            return;
        }
        this._currentSeqIndex = undefined;

        const length = this.tasks.length;
        for (let i = 0; i < length; i++) {
            this.tasks[i].onDone.remove(this._loopCallbacks[i]);
        }

        this._loopCallbacks.length = 0;

        this.restart(pause);

        return this;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Tween Action

    public pause(): TweenTaskGroup {
        if (this.isSeq) {
            this.tasks[this._currentSeqIndex].pause();
        } else {
            for (const task of this.tasks) {
                task.pause();
            }
        }

        return this;
    }

    public restart(pause: boolean = false): TweenTaskGroup {
        for (const task of this.tasks) {
            task.restart(this.isSeq ? true : pause);
        }
        if (this.isSeq && this.tasks.length > 0 && !pause) {
            this.tasks[0].continue();
        }

        return this;
    }

    public continue(recurve: boolean = true): TweenTaskGroup {
        if (this.isSeq) {
            this.tasks[this._currentSeqIndex].continue(recurve);
        } else {
            for (const task of this.tasks) {
                task.continue(recurve);
            }
        }

        return this;
    }

    public repeat(repeat: boolean = true): TweenTaskGroup {
        if (this._repeat === repeat || this.tasks.length <= 0) {
            return;
        }
        if (this.isSeq){
            const lastIndex = this.tasks.length - 1;
            if (repeat) {
                this.tasks[lastIndex].onDone.add(this._loopCallbacks[lastIndex]);
            } else {
                this.tasks[lastIndex].onDone.remove(this._loopCallbacks[lastIndex]);
            }

            this._repeat = repeat;
        }

        this._repeat = repeat;

        return this;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
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
 * @version 0.7.4b
 */
class AccessorTween implements IAccessorTween {
    private static readonly _twoPhaseTweenBorder: number = 0.5;

    private _tasks: TweenTask<unknown>[] = [];

    private _isBehaviorReady: boolean = false;

    private _behavior: AccessorTweenBehavior = undefined;

    private get behavior() {
        if (!this._behavior) {
            Core.Script.spawnScript(AccessorTweenBehavior).then(script => {
                this._behavior = script;
            });
        }
        return this._behavior;
    }

    public to<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T> = undefined, easing: EasingFunction = Easing.linear): ITweenTask<T> {
        return this.addTweenTask(getter, setter, dist, duration, forceStartVal, easing);
    }

    public move<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T> = undefined, easing: EasingFunction = Easing.linear): ITweenTask<T> {
        let startVal: T;
        if (forceStartVal) {
            startVal = {...getter(), ...forceStartVal};
        }

        return this.addTweenTask(getter, setter, moveAdd(startVal, dist), duration, forceStartVal, easing);
    }

    public await<T>(duration: number): ITweenTask<T> {
        return this.addTweenTask(() => {
            return null;
        }, (val) => {
        }, 0, duration);
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
     * 自动挂载 Behavior.
     * @private
     */
    private touchBehavior() {
        this.behavior;
    }

    /**
     * 移除任务.
     * @param task
     * @public
     * @beta
     */
    public removeTweenTask<T>(task: ITweenTask<T>): boolean {
        const index = this._tasks.indexOf(task as TweenTask<T>);
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
}

//region Data Util

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

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Type Guard

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

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Export
export default new AccessorTween();

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄