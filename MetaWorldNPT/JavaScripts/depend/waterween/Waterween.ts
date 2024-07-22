import { CubicBezier, CubicBezierBase, Easing, EasingFunction } from "./easing/Easing";
import { IAccessorTween, SeqTaskNode } from "./base/interface/IAccessorTween";
import { AdvancedTweenTask } from "./base/task/AdvancedTweenTask";
import Gtk, { Getter, Setter } from "gtoolkit";
import { TweenTaskBase } from "./base/task/TweenTaskBase";
import { RecursivePartial } from "./date-util/RecursivePartial";
import { DataTweenFunction, TweenDataUtil } from "./date-util/TweenDataUtil";
import { FlowTweenTask } from "./base/task/FlowTweenTask";
import { ITweenTask } from "./base/interface/ITweenTask";
import { GroupElement, GroupMode, TweenTaskGroupBase } from "./base/task/TweenTaskGroupBase";
import { SeqTweenTaskGroup } from "./base/task/SeqTweenTaskGroup";
import { ParTweenTaskGroup } from "./base/task/ParTweenTaskGroup";

export * from "./base/interface/IAccessorTween";
export * from "./base/interface/IAdvancedTweenTask";
export * from "./base/interface/IBackwardTweenTask";
export * from "./base/interface/IFlowTweenTask";
export * from "./base/interface/IRestartTweenTask";
export * from "./base/interface/ITweenTask";
export * from "./base/interface/ITweenTaskEvent";
export * from "./base/interface/ITweenTaskGroup";
export * from "./base/task/AdvancedTweenTask";
export * from "./base/task/FlowTweenTask";
export * from "./base/task/ParTweenTaskGroup";
export * from "./base/task/SeqTweenTaskGroup";
export * from "./base/task/TweenTaskBase";
export * from "./base/task/TweenTaskGroupBase";
export * from "./date-util/RecursivePartial";
export * from "./date-util/TweenDataUtil";

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
 */
class Waterween implements IAccessorTween {
    private _tasks: ITweenTask[] = [];

    private _touched: boolean = false;

    public to<T>(getter: Getter<T>,
                 setter: Setter<T>,
                 dist: RecursivePartial<T>,
                 duration: number,
                 forceStartVal: RecursivePartial<T> = undefined,
                 easing: EasingFunction = Easing.linear,
                 dataTweenFunction: DataTweenFunction<T> = undefined,
                 isFullAsT: boolean = false): AdvancedTweenTask<T> {
        return this.addAdvancedTweenTask(
            getter,
            setter,
            dist,
            duration,
            forceStartVal,
            easing,
            false,
            false,
            0.5,
            dataTweenFunction,
            isFullAsT);
    }

    public await(duration: number): AdvancedTweenTask<unknown> {
        return this.addAdvancedTweenTask(
            () => undefined,
            (_) => {
            },
            undefined,
            duration,
            undefined,
            Easing.linear,
            false,
            false,
            0.5,
            undefined,
            true);
    }

    public flow<T>(getter: Getter<T>,
                   setter: Setter<T>,
                   duration: number = 1e3,
                   easing: CubicBezierBase | EasingFunction = new CubicBezier(.4, 0, .6, 1),
                   sensitiveRatio: number = FlowTweenTask.DEFAULT_SENSITIVE_RATIO,
                   isLazy: boolean = true,
                   isSmooth: boolean = true,
    ): FlowTweenTask<T> {
        return this.addFlowTweenTask(
            getter,
            setter,
            duration,
            easing,
            sensitiveRatio,
            isLazy,
            isSmooth,
            TweenTaskBase.DEFAULT_TWO_PHASE_TWEEN_BORDER,
        );
    }

    public group(mode: GroupMode, ...tasks: GroupElement[]): TweenTaskGroupBase {
        let result: TweenTaskGroupBase;
        switch (mode) {
            case "sequence":
                result = new SeqTweenTaskGroup();
                break;
            case "parallel":
                result = new ParTweenTaskGroup();
                break;
        }

        for (const task of tasks) {
            result.addTask(task);
            Gtk.remove(this._tasks, task);
        }

        this._tasks.push(result);

        return result;
    }

    public pipe<T>(getter: Getter<T>,
                   setter: Setter<T>,
                   nodes: SeqTaskNode<T>[],
                   forceStartNode: RecursivePartial<T> = undefined,
                   easing: EasingFunction = Easing.linear): SeqTweenTaskGroup {
        const pipe: SeqTweenTaskGroup = new SeqTweenTaskGroup();
        let prediction: T = TweenDataUtil.dataHeal(forceStartNode, getter());

        for (const node of nodes) {
            const newTask = node.dist !== undefined ?
                this.to(getter,
                    setter,
                    node.dist,
                    node.duration,
                    prediction,
                    node.easing ?? easing,
                    undefined,
                    true) :
                this.await(node.duration);
            if (node.onDone) newTask.onDone.add(node.onDone);

            Gtk.remove(this._tasks, newTask);
            pipe.addTask(newTask);
            prediction = TweenDataUtil.dataHeal(node.dist, prediction);
        }

        this._tasks.push(pipe);

        return pipe;
    }

    private addAdvancedTweenTask<T>(getter: Getter<T>,
                                    setter: Setter<T>,
                                    endVal: RecursivePartial<T>,
                                    duration: number,
                                    forceStartVal: RecursivePartial<T>,
                                    easing: EasingFunction,
                                    isRepeat: boolean,
                                    isPingPong: boolean,
                                    twoPhaseTweenBorder: number,
                                    dataTweenFunction: DataTweenFunction<T>,
                                    isFullAsT: boolean): AdvancedTweenTask<T> {
        if (duration <= 0) return undefined;
        if (duration < 0.1e3) logWDurationTooShort();

        this.touchBehavior();

        const newTask = new AdvancedTweenTask(
            getter,
            setter,
            endVal,
            duration,
            forceStartVal,
            easing,
            isRepeat,
            isPingPong,
            twoPhaseTweenBorder,
            dataTweenFunction,
            isFullAsT);
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
                                easing: CubicBezierBase | EasingFunction,
                                sensitiveRatio: number,
                                isLazy: boolean,
                                isSmooth: boolean,
                                twoPhaseTweenBorder: number,
    ): FlowTweenTask<T> {
        if (duration <= 0) return undefined;
        if (duration < 0.1e3) logWDurationTooShort();

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
     * @param {number} dt 更新间隔. ms
     * @public
     */
    public update(dt: number) {
        const doneCacheIndex: number[] = [];
        for (let i = 0; i < this._tasks.length; i++) {
            const task = this._tasks[i];
            if (task.destroyed) doneCacheIndex.push(i);
            else task.call(dt);
        }

        for (let i = doneCacheIndex.length - 1;
             i >= 0;
             --i) this._tasks.splice(i, 1);
    }

//#region Behavior
    private updateHandler = (dt: number) => {
        this.update(dt * 1000);
    };

    /**
     * 自动挂载 Behavior.
     * @private
     */
    private touchBehavior() {
        if (!this._touched) this.setAutoBehavior();
    }

    /**
     * 停止自动挂载的 Behavior.
     */
    public stopAutoBehavior() {
        this._touched = true;
        mw.TimeUtil.onEnterFrame.remove(this.updateHandler);
    }

    /**
     * 设置自动挂载的 Behavior.
     */
    public setAutoBehavior() {
        this._touched = true;
        mw.TimeUtil.onEnterFrame.add(this.updateHandler);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

//#region Export
export default new Waterween();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

function logWDurationTooShort() {
    console.warn("Waterween: you created a tween task whose duration < 0.1s,\n maybe you need to check the params of duration.");
}