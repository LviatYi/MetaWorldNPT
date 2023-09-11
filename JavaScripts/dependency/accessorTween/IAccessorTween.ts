import {EasingFunction} from "../easing/Easing";
import ITweenTask from "./ITweenTask";
import TweenTaskGroup from "./TweenTaskGroup";
import {RecursivePartial} from "./RecursivePartial";
import {Getter} from "../accessor/Getter";
import {Setter} from "../accessor/Setter";

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
         * Duration in ms.
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
     * from startVal to dist.
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @public
     */
    to<T>(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number): ITweenTask<T>;

    /**
     * from startVal to dist.
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value. default is undefined.
     * @public
     */
    to<T>(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number, forceStartVal: RecursivePartial<T>): ITweenTask<T>;

    /**
     * from startVal to dist.
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value. default is undefined.
     * @param easing easing Function. default should be linear.
     * @public
     */
    to<T>(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number, forceStartVal: RecursivePartial<T>, easing: EasingFunction): ITweenTask<T>;

    /**
     * from startVal to (startVal + dist).
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @public
     */
    move<T>(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number): ITweenTask<T>;

    /**
     * from startVal to (startVal + dist).
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value. default is undefined.
     * @public
     */
    move<T>(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number, forceStartVal: RecursivePartial<T>): ITweenTask<T>;

    /**
     * from startVal to (startVal + dist).
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value. default is undefined.
     * @param easing easing Function. default should be linear.
     * @public
     */
    move<T>(getter: Getter<T>, setter: Setter<T>, dist: RecursivePartial<T>, duration: number, forceStartVal: RecursivePartial<T>, easing: EasingFunction): ITweenTask<T>;

    /**
     * Create await task.
     * It does nothing and just calls the {@link ITweenTask.onDone} function after the duration.
     * @param duration
     */
    await<T>(duration: number): ITweenTask<T>;


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
     *      duration: duration in ms.
     *      isParallel: is parallel with last node is not parallel.
     *      isFocus: is force add next unparalleled node from this node.
     * @public
     * @beta
     */
    group<T>(getter: Getter<T>,
             setter: Setter<T>,
             nodes: TaskNode<T>[]): TweenTaskGroup;


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
     *      duration: duration in ms.
     *      isParallel: is parallel with last node is not parallel.
     *      isFocus: is force add next unparalleled node from this node.
     * @param forceStartNode force from specified start value. default is undefined.
     * @public
     * @beta
     */
    group<T>(getter: Getter<T>,
             setter: Setter<T>,
             nodes: TaskNode<T>[],
             forceStartNode: RecursivePartial<T>): TweenTaskGroup;

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
     *      duration: duration in ms.
     *      isParallel: is parallel with last node is not parallel.
     *      isFocus: is force add next unparalleled node from this node.
     * @param forceStartNode force from specified start value. default is undefined.
     * @param easing easing Function. default should be linear.
     * @public
     * @beta
     */
    group<T>(getter: Getter<T>,
             setter: Setter<T>,
             nodes: TaskNode<T>[],
             forceStartNode: RecursivePartial<T>,
             easing: EasingFunction): TweenTaskGroup;
}