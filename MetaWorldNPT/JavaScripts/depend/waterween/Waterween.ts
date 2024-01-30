import { Getter } from "../accessor/Getter";
import { Setter } from "../accessor/Setter";
import Easing, { CubicBezierBase, EasingFunction } from "../easing/Easing";
import IAccessorTween, { TaskNode } from "./IAccessorTween";
import { RecursivePartial } from "./RecursivePartial";
import TweenTaskGroup from "./TweenTaskGroup";
import WaterweenBehavior from "./WaterweenBehavior";
import TweenDataUtil, { DataTweenFunction } from "./dateUtil/TweenDataUtil";
import { AdvancedTweenTask } from "./tweenTask/AdvancedTweenTask";
import { FlowTweenTask } from "./tweenTask/FlowTweenTask";
import TweenTaskBase from "./tweenTask/TweenTaskBase";
import GToolkit from "../../util/GToolkit";

/**
 * Waterween.
 * A Tween utility driven by Getter & Setter.
 *
 * 水 形 无 穷.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 2.2.1b
 */
class Waterween implements IAccessorTween {
    private _tasks: TweenTaskBase<unknown>[] = [];

    private _behavior: WaterweenBehavior = null;

    private get behavior() {
        if (!this._behavior) {
            this._behavior = GToolkit.addRootScript(WaterweenBehavior);
        }

        return this._behavior;
    }

    public to<T>(getter: Getter<T>,
                 setter: Setter<T>,
                 dist: RecursivePartial<T>,
                 duration: number,
                 forceStartVal: RecursivePartial<T> = null,
                 easing: EasingFunction = Easing.linear,
                 dataTweenFunction: DataTweenFunction<T> = undefined): AdvancedTweenTask<T> {
        return this.addAdvancedTweenTask(getter, setter, dist, duration, forceStartVal, easing, undefined, undefined, undefined, dataTweenFunction);
    }

    public move<T>(getter: Getter<T>,
                   setter: Setter<T>,
                   dist: RecursivePartial<T>,
                   duration: number,
                   forceStartVal: RecursivePartial<T> = null,
                   easing: EasingFunction = Easing.linear,
                   dataTweenFunction: DataTweenFunction<T> = undefined): AdvancedTweenTask<T> {
        let startVal: T;

        if (forceStartVal) {
            if (TweenDataUtil.isPrimitiveType(forceStartVal)) {
                startVal = forceStartVal as unknown as T;
            } else {
                startVal = {...getter(), ...forceStartVal};
            }
        } else {
            startVal = getter();
        }

        return this.addAdvancedTweenTask(getter, setter, TweenDataUtil.moveAdd(startVal, dist), duration, forceStartVal, easing, undefined, undefined, undefined, dataTweenFunction);
    }

    public await(duration: number): AdvancedTweenTask<unknown> {
        return this.addAdvancedTweenTask(() => {
            return null;
        }, (val) => {
        }, null, duration);
    }

    public group<T>(getter: Getter<T>,
                    setter: Setter<T>,
                    nodes: TaskNode<T>[],
                    forceStartNode: RecursivePartial<T> = null,
                    easing: EasingFunction = Easing.linear): TweenTaskGroup {
        const group: TweenTaskGroup = new TweenTaskGroup().sequence();

        let mainLineGroup: TweenTaskGroup = group;
        let parallelGroup: TweenTaskGroup = null;
        let prediction: T = TweenDataUtil.dataOverride(forceStartNode, getter());
        let parallelPrediction: T = null;

        for (const node of nodes) {
            [mainLineGroup, parallelGroup, prediction, parallelPrediction] = this.groupHandler(
                getter,
                setter,
                mainLineGroup,
                parallelGroup,
                node,
                prediction,
                parallelPrediction,
                easing,
            );
        }

        return group.restart(true);
    }

    public flow<T>(getter: Getter<T>,
                   setter: Setter<T>,
                   duration: number = 1e3,
                   easing: CubicBezierBase | EasingFunction = undefined,
                   sensitiveRatio: number = undefined,
                   isLazy: boolean = undefined,
                   isSmooth: boolean = undefined,
    ): FlowTweenTask<T> {
        return this.addFlowTweenTask(
            getter,
            setter,
            duration,
            easing,
            sensitiveRatio,
            isLazy,
            isSmooth,
        );
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

        const newTask = node.dist !== null ? this.to(getter,
            setter,
            node.dist,
            node.duration,
            node.isParallel ? parallelPrediction : prediction,
            node.easing ?? easing) : this.await(node.duration);
        if (node.onDone) newTask.onDone.add(node.onDone);

        const newNode: TweenTaskGroup | AdvancedTweenTask<unknown> =
            node.subNodes && node.subNodes.length > 0 || node.isFocus ?
                new TweenTaskGroup().sequence().add(newTask) :
                newTask;

        focus.add(newNode);

        if (node.isFocus) {
            mainLineGroup = newNode as TweenTaskGroup;
        }

        prediction = TweenDataUtil.dataOverride(node.dist, prediction);

        if (node.subNodes && node.subNodes.length > 0) {
            let subMainLine: TweenTaskGroup = newNode as TweenTaskGroup;
            let subParallelGroup: TweenTaskGroup = null;
            let subPrediction: T = prediction;
            let subParallelPrediction: T = null;
            for (const element of node.subNodes) {
                [subMainLine, subParallelGroup, subPrediction, subParallelPrediction] =
                    this.groupHandler(getter,
                        setter,
                        subMainLine,
                        subParallelGroup,
                        element,
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
     * add advanced tween task.
     *
     * @param getter
     * @param setter
     * @param endVal
     * @param duration
     * @param forceStartVal
     * @param easing
     * @param isRepeat
     * @param isPingPong
     * @param twoPhaseTweenBorder
     * @param dataTweenFunction
     * @private
     */
    private addAdvancedTweenTask<T>(getter: Getter<T>,
                                    setter: Setter<T>,
                                    endVal: RecursivePartial<T>,
                                    duration: number,
                                    forceStartVal: RecursivePartial<T> = null,
                                    easing: EasingFunction = Easing.linear,
                                    isRepeat: boolean = false,
                                    isPingPong: boolean = false,
                                    twoPhaseTweenBorder: number = undefined,
                                    dataTweenFunction: DataTweenFunction<T> = undefined): AdvancedTweenTask<T> {
        if (duration < 0) {
            return null;
        }

        this.touchBehavior();

        const newTask = new AdvancedTweenTask(getter,
            setter,
            endVal,
            duration,
            forceStartVal,
            easing,
            isRepeat,
            isPingPong,
            twoPhaseTweenBorder,
            dataTweenFunction);
        this._tasks.push(newTask);
        return newTask;
    }

    /**
     * add flow tween task.
     *
     * @param getter
     * @param setter
     * @param duration
     * @param easing
     * @param sensitiveRatio 敏度倍率.
     *      敏度阈值 = 敏度倍率 * 当前任务 Duration.
     *      当再次调用 To 时 若与上次调用时间差低于 敏度阈值 则延迟更新.
     * @param isLazy 是否 懒惰的.
     *      当懒惰时 调用带有与当前任务具有相同终值的 to 时将不启动新任务.
     *      default true.
     * @param isSmooth
     * @param twoPhaseTweenBorder
     * @private
     */
    private addFlowTweenTask<T>(getter: Getter<T>,
                                setter: Setter<T>,
                                duration: number,
                                easing: CubicBezierBase | EasingFunction = undefined,
                                sensitiveRatio: number = undefined,
                                isLazy: boolean = undefined,
                                isSmooth: boolean = undefined,
                                twoPhaseTweenBorder: number = undefined,
    ): FlowTweenTask<T> {
        if (duration < 0) {
            return null;
        }

        this.touchBehavior();

        const newTask = new FlowTweenTask(
            getter,
            setter,
            duration,
            easing,
            sensitiveRatio,
            isLazy,
            isSmooth,
            twoPhaseTweenBorder,
        );
        this._tasks.push(newTask);
        return newTask;
    }

    /**
     * 强制刷新.
     * @public
     */
    public update() {
        const doneCacheIndex: number[] = [];
        const now = Date.now();
        for (let i = 0; i < this._tasks.length; i++) {
            const task = this._tasks[i];
            if (task.needDestroy) {
                doneCacheIndex.push(i);
            } else if (task.isDone) {
                if (task.elapsed < 1) {
                    task.isDone = false;
                    task.call(now);
                } else if (task.isAutoDestroy) {
                    doneCacheIndex.push(i);
                }
            } else {
                task.call(now);
            }
        }

        for (let i = doneCacheIndex.length - 1; i >= 0; --i) {
            this.destroyTweenTaskByIndex(doneCacheIndex[i]);
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

//#region Export
export default new Waterween();
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄