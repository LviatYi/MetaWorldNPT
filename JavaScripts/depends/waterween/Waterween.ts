import WaterweenBehavior from "./WaterweenBehavior";
import IAdvancedTweenTask from "./tweenTask/IAdvancedTweenTask";
import IAccessorTween, {TaskNode} from "./IAccessorTween";
import Easing, {CubicBezier, CubicBezierBase, EasingFunction} from "../easing/Easing";
import TweenTaskGroup from "./TweenTaskGroup";
import {RecursivePartial} from "./RecursivePartial";
import {Getter} from "../accessor/Getter";
import {Setter} from "../accessor/Setter";
import {AdvancedTweenTask} from "./tweenTask/AdvancedTweenTask";
import TweenDataUtil from "./dateUtil/TweenDataUtil";

export class FlowTweenTask {

}

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
 * @version 1.4.6b
 */
class Waterween implements IAccessorTween {
    private _tasks: AdvancedTweenTask<unknown>[] = [];

    private _behavior: WaterweenBehavior = null;

    private _behaviorMutex: boolean = false;

    private get behavior() {
        if (!this._behaviorMutex) {
            this._behaviorMutex = true;
            Core.Script.spawnScript(WaterweenBehavior).then(script => {
                this._behavior = script;
            });
        }
        return this._behavior;
    }

    public to<T>(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number, forceStartVal: RecursivePartial<T> = null, easing: EasingFunction = Easing.linear): IAdvancedTweenTask<T> {
        return this.addTweenTask(getter, setter, dist, duration, forceStartVal, easing);
    }

    public move<T>(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number, forceStartVal: RecursivePartial<T> = null, easing: EasingFunction = Easing.linear): IAdvancedTweenTask<T> {
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

        return this.addTweenTask(getter, setter, TweenDataUtil.moveAdd(startVal, dist), duration, forceStartVal, easing);
    }

    public await(duration: number): IAdvancedTweenTask<unknown> {
        return this.addTweenTask(() => {
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

        for (let i = 0; i < nodes.length; i++) {
            [mainLineGroup, parallelGroup, prediction, parallelPrediction] = this.groupHandler(
                getter,
                setter,
                mainLineGroup,
                parallelGroup,
                nodes[i],
                prediction,
                parallelPrediction,
                easing,
            );
        }

        return group.restart(true);
    }

    public flow(getter: Getter<number>,
                setter: Setter<number>,
                fixedDurationOrAvgVelocity: number = 1e3,
                isDuration: boolean = true,
                easing: CubicBezierBase = new CubicBezier(0.4, 0, 0.6, 1),
    ): FlowTweenTask {
        // return new FlowTweenTask(
        //     getter,
        //     setter,
        //     fixedDurationOrAvgVelocity,
        //     isDuration,
        //     easing,
        // );
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

        const newTask = node.dist ? this.to(getter,
            setter,
            node.dist,
            node.duration,
            node.isParallel ? parallelPrediction : prediction,
            node.easing ?? easing) : this.await(node.duration);

        const newNode: TweenTaskGroup | IAdvancedTweenTask<RecursivePartial<RecursivePartial<T>>> =
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
                            forceStartVal: RecursivePartial<T> = null,
                            easing: EasingFunction = Easing.linear,
                            isRepeat: boolean = false,
                            isPingPong: boolean = false): AdvancedTweenTask<T> {
        if (duration < 0) {
            return null;
        }

        this.touchBehavior();

        const newTask = new AdvancedTweenTask(getter, setter, endVal, duration, forceStartVal, easing, isRepeat, isPingPong);
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
     * 移除任务.
     * @param task
     * @public
     * @beta
     */
    public destroyTweenTask<T>(task: IAdvancedTweenTask<T>): boolean {
        const index = this._tasks.indexOf(task as AdvancedTweenTask<T>);
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

//region Export
// export default new Waterween();

const InnerWaterween = new Waterween();

export default InnerWaterween;
//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄