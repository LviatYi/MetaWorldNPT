import { CubicBezierBase, EasingFunction } from "../../easing/Easing";
import { RecursivePartial } from "../../date-util/RecursivePartial";
import { AdvancedTweenTask } from "../task/AdvancedTweenTask";
import { DataTweenFunction } from "../../date-util/TweenDataUtil";
import { Delegate, Getter, Setter } from "gtoolkit";
import { FlowTweenTask } from "../task/FlowTweenTask";
import { GroupElement, GroupMode, TweenTaskGroupBase } from "../task/TweenTaskGroupBase";
import { SeqTweenTaskGroup } from "../task/SeqTweenTaskGroup";
import SimpleDelegateFunction = Delegate.SimpleDelegateFunction;

/**
 * SeqTaskNode.
 */
export type SeqTaskNode<T> = {
    /**
     * Node dist.
     */
    dist?: RecursivePartial<T>,

    /**
     * Duration. ms
     */
    duration: number,

    /**
     * Easing function.
     */
    easing?: EasingFunction,

    /**
     * onDone callback.
     *      val: 是否 任务正 󰐊正放.
     */
    onDone?: SimpleDelegateFunction<boolean>,
}

/**
 * IAccessorTween.
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
export interface IAccessorTween {
    /**
     * create await task.
     * it does nothing and just calls the {@link IAdvancedTweenTask.onDone} function after the duration.
     * @param duration
     */
    await(duration: number): AdvancedTweenTask<unknown>;

    /**
     * create a tween who allows setting the destination at any time.
     * @param getter
     * @param setter
     * @param duration default is 1e3. ms
     * @param easing easing Function or {@link CubicBezierBase}. default is CubicBezier(.4,0,.6,1).
     * recommend use bezier for smoother animation.
     * @param sensitiveRatio 敏度倍率.
     *      敏度阈值 = 敏度倍率 * 当前任务 Duration.
     *      当再次调用 To 时 若与上次调用时间差低于 敏度阈值 则延迟更新.
     * @param isLazy 是否 懒惰的.
     *      当懒惰时 调用带有与当前任务具有相同终值的 to 时将不启动新任务.
     *      default true.
     * @param isSmooth 是否 平滑的.
     *      当平滑时 补间函数间将进行平滑处理.
     */
    flow<T>(getter: Getter<T>,
            setter: Setter<T>,
            duration: number,
            easing?: CubicBezierBase | EasingFunction,
            sensitiveRatio?: number,
            isLazy?: boolean,
            isSmooth?: boolean,
    ): FlowTweenTask<T>;

    /**
     * from startVal to dist.
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration. ms
     * @param forceStartVal force from specified start value. default is undefined.
     * @param easing easing Function. default should be linear.
     * @param dataTweenFunction custom data tween function.
     * @param isFullAsT for perf. use it to avoid calling the getter.
     *  - use true when forceStartVal as same type as T.
     *  - default is false.
     */
    to<T>(getter: Getter<T>,
          setter: Setter<T>,
          dist: RecursivePartial<T>,
          duration: number,
          forceStartVal?: RecursivePartial<T>,
          easing?: EasingFunction,
          dataTweenFunction?: DataTweenFunction<T>,
          isFullAsT?: boolean,
    ): AdvancedTweenTask<T>;

    /**
     * create group by tasks.
     * @param {GroupMode} mode
     * @param {GroupElement} tasks
     * @return {TweenTaskGroupBase}
     */
    group(mode: GroupMode, ...tasks: GroupElement[]): TweenTaskGroupBase;

    /**
     * create sequence group by nodes.
     * @param {Getter<T>} getter
     * @param {Setter<T>} setter
     * @param {SeqTaskNode<T>[]} nodes
     * @param {RecursivePartial<T>} forceStartNode
     * @param {EasingFunction} easing
     * @return {SeqTweenTaskGroup}
     */
    pipe<T>(getter: Getter<T>,
            setter: Setter<T>,
            nodes: SeqTaskNode<T>[],
            forceStartNode?: RecursivePartial<T>,
            easing?: EasingFunction): SeqTweenTaskGroup;
}