import AccessorTweenBehavior from "./AccessorTweenBehavior";
import ITweenTask from "./ITweenTask";
import IAccessorTween, {TaskNode} from "./IAccessorTween";
import Easing, {EasingFunction} from "../easing/Easing";
import MultiDelegate from "../delegate/MultiDelegate";
import ITweenTaskEvent from "./ITweenTaskEvent";
import TweenTaskGroup from "./TweenTaskGroup";
import {RecursivePartial} from "./RecursivePartial";
import {Getter} from "../accessor/Getter";
import {Setter} from "../accessor/Setter";

const defaultTwoPhaseTweenBorder = 0.5;

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
export class TweenTask<T> implements ITweenTask<T>, ITweenTaskEvent {
    /**
     * 两相值 Tween 变化边界.
     * @private
     */
    public twoPhaseTweenBorder: number = defaultTwoPhaseTweenBorder;

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

    private readonly _endValue: RecursivePartial<T>;

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

    public set elapsed(value: number) {
        this._virtualStartTime = Date.now() - (this.pause() ? this._lastStopTime : 0) - this._duration * (Math.max(Math.min(value, 1), 0));
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
    public autoDestroy(auto: boolean = false): ITweenTask<T> {
        this.isAutoDestroy = auto;
        return this;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Event

    public onDone: MultiDelegate<boolean> = new MultiDelegate<boolean>();

    public onDestroy: MultiDelegate<void> = new MultiDelegate<void>();

    public onPause: MultiDelegate<void> = new MultiDelegate<void>();

    public onContinue: MultiDelegate<void> = new MultiDelegate<void>();

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
        try {
            if (this.isBackward) {
                this._setter(dataHeal(partialDataTween(this._backwardStartVal, this._startValue, this._easingFunc(elapsed), this.twoPhaseTweenBorder), this._getter));
            } else {
                this._setter(dataHeal(partialDataTween(this._forwardStartVal, this._endValue, this._easingFunc(elapsed), this.twoPhaseTweenBorder), this._getter));
            }
        } catch (e) {
            console.error("tween task crashed while setter is called. it will be autoDestroy");
            this.isDone = true;
            this.fastForwardToEnd();
            this.autoDestroy(true);
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

    constructor(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number, forceStartValue: RecursivePartial<T> = undefined, easing: EasingFunction = Easing.linear, isRepeat: boolean = false, isPingPong: boolean = false) {
        const startTime = Date.now();
        this._getter = getter;
        this._setter = setter;
        this._createTime = startTime;
        this._virtualStartTime = startTime;
        this._duration = duration;
        let startVal: T = undefined;
        if (forceStartValue !== undefined) {
            if (isPrimitiveType(forceStartValue)) {
                startVal = forceStartValue as unknown as T;
            } else {
                startVal = {...getter(), ...forceStartValue};
            }
        }
        this._startValue = startVal ?? getter();
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
 * @version 1.1.1b
 */
class AccessorTween implements IAccessorTween {
    private _tasks: TweenTask<unknown>[] = [];

    private _behavior: AccessorTweenBehavior = undefined;

    private _behaviorMutex: boolean = false;

    private get behavior() {
        if (!this._behaviorMutex) {
            this._behaviorMutex = true;
            Core.Script.spawnScript(AccessorTweenBehavior).then(script => {
                this._behavior = script;
            });
        }
        return this._behavior;
    }

    public to<T>(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number, forceStartVal: RecursivePartial<T> = undefined, easing: EasingFunction = Easing.linear): ITweenTask<T> {
        return this.addTweenTask(getter, setter, dist, duration, forceStartVal, easing);
    }

    public move<T>(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number, forceStartVal: RecursivePartial<T> = undefined, easing: EasingFunction = Easing.linear): ITweenTask<T> {
        let startVal: T;

        if (forceStartVal) {
            if (isPrimitiveType(forceStartVal)) {
                startVal = forceStartVal as unknown as T;
            } else {
                startVal = {...getter(), ...forceStartVal};
            }
        } else {
            startVal = getter();
        }

        return this.addTweenTask(getter, setter, moveAdd(startVal, dist), duration, forceStartVal, easing);
    }

    public await(duration: number): ITweenTask<unknown> {
        return this.addTweenTask(() => {
            return null;
        }, (val) => {
        }, undefined, duration);
    }

    public group<T>(getter: Getter<T>,
                    setter: Setter<T>,
                    nodes: TaskNode<T>[],
                    forceStartNode: RecursivePartial<T> = undefined,
                    easing: EasingFunction = Easing.linear): TweenTaskGroup {
        const group: TweenTaskGroup = new TweenTaskGroup().sequence();

        let mainLineGroup: TweenTaskGroup = group;
        let parallelGroup: TweenTaskGroup = null;
        let prediction: T = dataOverride(forceStartNode, getter());
        let parallelPrediction: T = null;

        for (let i = 0; i < nodes.length; i++) {
            [mainLineGroup, parallelGroup, prediction, parallelPrediction] = this.groupHandler(
                getter,
                setter,
                mainLineGroup,
                parallelGroup,
                nodes[i],
                prediction,
                parallelPrediction,
                easing
            );
        }

        return group.restart(true);
    }

    private groupHandler<T>(getter: Getter<T>,
                            setter: Setter<T>,
                            mainLineGroup: TweenTaskGroup,
                            parallelGroup: TweenTaskGroup,
                            node: TaskNode<T>,
                            prediction: T,
                            parallelPrediction: T,
                            easing: EasingFunction = Easing.linear): [TweenTaskGroup, TweenTaskGroup, T, T] {
        let focus: TweenTaskGroup = mainLineGroup;

        if (node.isParallel) {
            if (!parallelGroup) {
                parallelGroup = new TweenTaskGroup().parallel();
                mainLineGroup.add(parallelGroup);
            }
            if (!parallelPrediction) {
                parallelPrediction = prediction;
            }
            focus = parallelGroup;
        } else {
            parallelPrediction = null;
            parallelGroup = null;
        }

        const newTask = node.dist ? this.to(getter, setter, node.dist, node.duration, node.isParallel ? parallelPrediction : prediction, easing) : this.await(node.duration);

        const newNode: TweenTaskGroup | ITweenTask<RecursivePartial<RecursivePartial<T>>> =
            node.subNodes && node.subNodes.length > 0 || node.isFocus ?
                new TweenTaskGroup().sequence().add(newTask) :
                newTask;

        focus.add(newNode);

        if (node.isFocus) {
            mainLineGroup = newNode as TweenTaskGroup;
        }

        prediction = dataOverride(node.dist, prediction);

        if (node.subNodes && node.subNodes.length > 0) {
            let subMainLine: TweenTaskGroup = newNode as TweenTaskGroup;
            let subParallelGroup: TweenTaskGroup = null;
            let subPrediction: T = prediction;
            let subParallelPrediction: T = null;
            for (let i = 0; i < node.subNodes.length; i++) {
                [subMainLine, subParallelGroup, subPrediction, subParallelPrediction] =
                    this.groupHandler(getter,
                        setter,
                        subMainLine,
                        subParallelGroup,
                        node.subNodes[i],
                        subPrediction,
                        subParallelPrediction,
                        easing);
            }
            if (subMainLine !== newNode) {
                mainLineGroup = subMainLine;
                prediction = subPrediction;
            }
        }

        return [mainLineGroup, parallelGroup, prediction, parallelPrediction];
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
    private addTweenTask<T>(getter: Getter<T>,
                            setter: Setter<T>,
                            endVal: RecursivePartial<T>,
                            duration: number,
                            forceStartVal: RecursivePartial<T> = undefined,
                            easing: EasingFunction = Easing.linear,
                            isRepeat: boolean = false,
                            isPingPong: boolean = false): TweenTask<T> {
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
                if (task.elapsed < 1) {
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
            this.destroyTweenTaskByIndex(i);
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
    public destroyTweenTask<T>(task: ITweenTask<T>): boolean {
        const index = this._tasks.indexOf(task as TweenTask<T>);
        return this.destroyTweenTaskByIndex(index);
    }

    /**
     * 根据索引在 `_task` 中移除 task.
     * @param index
     * @private
     */
    private destroyTweenTaskByIndex(index: number): boolean {
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
 * @param twoPhaseTweenBorder tween border of two phase value.
 */
function dataTween<T>(startVal: T, distVal: T, process: number, twoPhaseTweenBorder: number = 0.5): T {
    //TODO_LviatYi 补间函数应按基本类型 参数化、客制化

    if (isNumber(startVal) && isNumber(distVal)) {
        return ((distVal - startVal) * process + startVal) as T;
    }

    if (isString(startVal) && isString(distVal)) {
        //TODO_LviatYi 待定更花式的 string 补间.
        return (process < twoPhaseTweenBorder ? startVal : distVal) as T;
    }

    if (isBoolean(startVal) && isBoolean(distVal)) {
        return (process < twoPhaseTweenBorder ? startVal : distVal) as T;
    }

    if (Array.isArray(startVal) && Array.isArray(distVal)) {
        //TODO_LviatYi 待定更花式的 Array 补间.
        return (process < this._twoPhaseTweenBorder ? startVal : distVal) as T;
    }

    if (isObject(startVal) && isObject(distVal)) {
        const result: T = clone(startVal);
        Object.keys(startVal).forEach(
            item => {
                result[item] = dataTween(startVal[item], distVal[item], process);
            }
        );

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
function partialDataTween<T>(startVal: T, distVal: RecursivePartial<T>, process: number, twoPhaseTweenBorder: number = 0.5): RecursivePartial<T> {
    if (isPrimitiveType(startVal)) {
        return dataTween(startVal, distVal as T, process, twoPhaseTweenBorder);
    }
    const result: RecursivePartial<T> = {};
    Object.keys(distVal).forEach(
        item => {
            result[item] = partialDataTween(
                startVal[item],
                distVal[item],
                process,
                twoPhaseTweenBorder);
        }
    );

    return result;
}

/**
 * Heal the partial<T> to <T> by getter.
 * @param partial
 * @param getter
 */
function dataHeal<T>(partial: RecursivePartial<T>, getter: Getter<T>): T {
    if (isPrimitiveType(partial)) {
        return partial as T;
    }

    const result = getter();

    return dataOverride(partial, result);
}

/**
 * Override the origin data <T> by partial<T>.
 * @param partial
 * @param origin
 */
function dataOverride<T>(partial: RecursivePartial<T>, origin: T): T {
    if (isPrimitiveType(partial)) {
        return partial as T;
    }
    const result: T = clone(origin);

    for (const partialKey in partial) {
        result[partialKey] = dataOverride(partial[partialKey], result[partialKey]);
    }
    return result;
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