import {EasingFunction} from "../easing/Easing.js";
import ITweenTask from "./ITweenTask";
import TweenTaskGroup from "./TweenTaskGroup";

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
     * @beta
     */
    to<T>(getter: Getter<T>, setter: Setter<T>, dist: Partial<T>, duration: number): ITweenTask<T>;

    /**
     * from startVal to dist.
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value. default is undefined.
     * @public
     * @beta
     */
    to<T>(getter: Getter<T>, setter: Setter<T>, dist: Partial<T>, duration: number, forceStartVal: Partial<T>): ITweenTask<T>;

    /**
     * from startVal to dist.
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value. default is undefined.
     * @param easing easing Function. default should be linear.
     * @public
     * @beta
     */
    to<T>(getter: Getter<T>, setter: Setter<T>, dist: Partial<T>, duration: number, forceStartVal: Partial<T>, easing: EasingFunction): ITweenTask<T>;

    /**
     * from startVal to (startVal + dist).
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @public
     * @beta
     */
    move<T>(getter: Getter<T>, setter: Setter<T>, dist: Partial<T>, duration: number): ITweenTask<T>;

    /**
     * from startVal to (startVal + dist).
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value. default is undefined.
     * @public
     * @beta
     */
    move<T>(getter: Getter<T>, setter: Setter<T>, dist: Partial<T>, duration: number, forceStartVal: Partial<T>): ITweenTask<T>;

    /**
     * from startVal to (startVal + dist).
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value. default is undefined.
     * @param easing easing Function. default should be linear.
     * @public
     * @beta
     */
    move<T>(getter: Getter<T>, setter: Setter<T>, dist: Partial<T>, duration: number, forceStartVal: Partial<T>, easing: EasingFunction): ITweenTask<T>;

    /**
     * Create await task.
     * It does nothing and just calls the {@link ITweenTask.onDone} function after the duration.
     * @param duration
     */
    await<T>(duration: number): ITweenTask<T>;

    /**
     * from startNode to dist.
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
     * @beta
     */
    group<T>(getter: Getter<T>,
             setter: Setter<T>,
             nodes: (
                 {
                     dist: Partial<T>
                 } &
                 {
                     duration: number,
                     await?: number,
                     isParallel?: boolean,
                     followPrev?: boolean
                 })[]): TweenTaskGroup;

    /**
     * from startNode to dist.
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
     * @beta
     */
    group<T>(getter: Getter<T>,
             setter: Setter<T>,
             nodes: (
                 {
                     dist: Partial<T>
                 } &
                 {
                     duration: number,
                     await?: number,
                     isParallel?: boolean,
                     followPrev?: boolean
                 })[],
             forceStartNode: Partial<T>): TweenTaskGroup;

    /**
     * from startNode to dist.
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
     * @beta
     */
    group<T>(getter: Getter<T>,
             setter: Setter<T>,
             nodes: (
                 {
                     dist: Partial<T>
                 } &
                 {
                     duration: number,
                     await?: number,
                     isParallel?: boolean,
                     followPrev?: boolean
                 })[],
             forceStartNode: Partial<T>,
             easing: EasingFunction): TweenTaskGroup;
}