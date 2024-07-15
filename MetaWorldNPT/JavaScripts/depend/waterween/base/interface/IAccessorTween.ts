import { CubicBezierBase, EasingFunction } from "../../../easing/Easing";
import TweenTaskGroup from "../../TweenTaskGroup";
import { RecursivePartial } from "../../RecursivePartial";
import { FlowTweenTask } from "../task/FlowTweenTask";
import { AdvancedTweenTask } from "../task/AdvancedTweenTask";
import { DataTweenFunction } from "../../dateUtil/TweenDataUtil";
import { Delegate, Getter, Setter } from "gtoolkit";
import SimpleDelegateFunction = Delegate.SimpleDelegateFunction;

/**
 * TaskNode.
 */
export type TaskNode<T> = {
        /**
         * Node dist.
         */
        dist?: RecursivePartial<T>,

        /**
         * Sub Nodes.
         */
        subNodes?: TaskNode<T>[],
    }
    &
    {
        /**
         * Duration. ms
         */
        duration: number,

        /**
         * is Parallel.
         */
        isParallel?: boolean,

        /**
         * is Focus this node.
         */
        isFocus?: boolean,

        /**
         * Easing function.
         */
        easing?: EasingFunction,

        /**
         * onDone callback.
         *      val: 是否 任务正 󰓕倒放.
         */
        onDone?: SimpleDelegateFunction<[boolean, number]>,
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
export default interface IAccessorTween {
    /**
     * Create await task.
     * It does nothing and just calls the {@link IAdvancedTweenTask.onDone} function after the duration.
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
     * @param now current time. ms
     */
    flow<T>(getter: Getter<T>,
            setter: Setter<T>,
            duration: number,
            easing?: CubicBezierBase | EasingFunction,
            sensitiveRatio?: number,
            isLazy?: boolean,
            isSmooth?: boolean,
            now?: number,
    ): FlowTweenTask<T>;

    /**
     * from startNode to dist.
     * allow you to create tween tasks like that: P isParallel, F isFocus
     *  1)
     *  |* task1 *| ==> |****** task2 ******| ==> |* task3 *| ==> |** task4 **|
     *  |         |     |                   |     |         |     |           |
     *
     *  2)
     *  |* task1 *| ==> |****** task2 ******| ==> |** task4 **|
     *  |         |     |      P            |     |           |
     *              ==> |* task3 *..........|
     *                  | P                 |
     *
     *  3)
     *  |* task1 *| ==> |****** task2 ******|
     *  |         | ==> |     P             |
     *              ==> |*task3*| ==> |** task4 **|
     *              ==> | P  F  | ==> |           |
     *
     * @param getter
     * @param setter
     * @param nodes
     *      dist: dist. await when null.
     *      duration: duration. ms
     *      isParallel: is parallel with last node is not parallel.
     *      isFocus: is force add next unparalleled node from this node.
     * @param forceStartNode force from specified start value. default is undefined.
     * @param easing easing Function. default should be linear.
     * @param now current time. ms
     * @public
     * @beta
     */
    group<T>(getter: Getter<T>,
             setter: Setter<T>,
             nodes: TaskNode<T>[],
             forceStartNode?: RecursivePartial<T>,
             easing?: EasingFunction,
             now?: number): TweenTaskGroup;

    /**
     * from startVal to (startVal + dist).
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration. ms
     * @param forceStartVal force from specified start value. default is undefined.
     * @param easing easing Function. default should be linear.
     * @param dataTweenFunction custom data tween function.
     * @param now current time. ms
     * @public
     */
    move<T>(getter: Getter<T>,
            setter: Setter<T>,
            dist: RecursivePartial<T>,
            duration: number,
            forceStartVal?: RecursivePartial<T>,
            easing?: EasingFunction,
            dataTweenFunction?: DataTweenFunction<T>,
            now?: number): AdvancedTweenTask<T>;

    /**
     * from startVal to dist.
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration. ms
     * @param forceStartVal force from specified start value. default is undefined.
     * @param easing easing Function. default should be linear.
     * @param dataTweenFunction custom data tween function.
     * @param now current time. ms
     * @param isFullAsT for perf. use it to avoid calling the getter.
     *  - use true when forceStartVal as same type as T.
     *  - default is false.
     * @public
     */
    to<T>(getter: Getter<T>,
          setter: Setter<T>,
          dist: RecursivePartial<T>,
          duration: number,
          forceStartVal?: RecursivePartial<T>,
          easing?: EasingFunction,
          dataTweenFunction?: DataTweenFunction<T>,
          now?: number,
          isFullAsT?: boolean): AdvancedTweenTask<T>;
}