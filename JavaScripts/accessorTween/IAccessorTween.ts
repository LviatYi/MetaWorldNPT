import {EasingFunction} from "../easing/Easing.js";
import ITweenTask from "./ITweenTask";
import TweenTaskGroup from "./TweenTaskGroup";
import {RecursivePartial} from "./RecursivePartial";

export type Getter<T> = () => T;
export type Setter<T> = (val: T) => void;

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
     * allow you to create tween tasks like that: P isParallel, B isBranch
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
     *              ==> | P  B  | ==> |           |
     *
     * @param getter
     * @param setter
     * @param nodes
     *      dist: dist
     *      duration: duration in ms.
     *      await: await time in ms.
     *      isParallel: is parallel with last node is not parallel.
     *      isBranch: is force add continue node from this node.
     *          - false don't work when !isParallel.
     * @public
     */
    group<T>(getter: Getter<T>,
             setter: Setter<T>,
             nodes: (
                 {
                     dist: RecursivePartial<T>
                 } &
                 {
                     duration: number,
                     await?: number,
                     isParallel?: boolean,
                     followPrev?: boolean
                 })[]): TweenTaskGroup;

    /**
     * from startNode to dist.
     * allow you to create tween tasks like that: P isParallel, B isBranch
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
     *              ==> | P  B  | ==> |           |
     *
     * @param getter
     * @param setter
     * @param nodes
     *      dist: dist
     *      duration: duration in ms.
     *      await: await time in ms.
     *      isParallel: is parallel with last node is not parallel.
     *      isBranch: is force add continue node from this node.
     *          - false don't work when !isParallel.
     * @param forceStartNode force from specified start value. default is undefined.
     * @public
     */
    group<T>(getter: Getter<T>,
             setter: Setter<T>,
             nodes: (
                 {
                     dist: RecursivePartial<T>
                 } &
                 {
                     duration: number,
                     await?: number,
                     isParallel?: boolean,
                     followPrev?: boolean
                 })[],
             forceStartNode: RecursivePartial<T>): TweenTaskGroup;

    /**
     * from startNode to dist.
     * allow you to create tween tasks like that: P isParallel, B isBranch
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
     *              ==> | P  B  | ==> |           |
     *
     * @param getter
     * @param setter
     * @param nodes
     *      dist: dist
     *      duration: duration in ms.
     *      await: await time in ms.
     *      isParallel: is parallel with last node is not parallel.
     *      isBranch: is force add continue node from this node.
     *          - false don't work when !isParallel.
     * @param forceStartNode force from specified start value. default is undefined.
     * @param easing easing Function. default should be linear.
     * @public
     */
    group<T>(getter: Getter<T>,
             setter: Setter<T>,
             nodes: (
                 {
                     dist: RecursivePartial<T>
                 } &
                 {
                     duration: number,
                     await?: number,
                     isParallel?: boolean,
                     followPrev?: boolean
                 })[],
             forceStartNode: RecursivePartial<T>,
             easing: EasingFunction): TweenTaskGroup;
}