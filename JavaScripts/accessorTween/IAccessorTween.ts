import {TweenTask} from "./AccessorTween";
import {EasingFunction} from "../easing/Easing";

export type Getter<T> = () => T;
export type Setter<T> = (val: T) => void;

export default interface IAccessorTween {
    /**
     * from startVal to dist.
     *
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value.
     * @param easing easing Function. default should be linear.
     * @public
     * @beta
     */
    to<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T>, easing: EasingFunction): TweenTask<T>;

    /**
     * from startVal to (startVal + dist).
     *
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value.
     * @param easing easing Function. default should be linear.
     * @public
     * @beta
     */
    move<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T>, easing: EasingFunction): TweenTask<T>;

    /**
     * from startVal to (startVal + dist). then repeat.
     *
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value.
     * @param easing easing Function. default should be linear.
     * @public
     * @beta
     */
    repeat<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T>, easing: EasingFunction): TweenTask<T>;


    /**
     * from startVal to (startVal + dist). then go back repeat.
     *
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param forceStartVal force from specified start value.
     * @param easing easing Function. default should be linear.
     * @param once only once.
     * @public
     * @beta
     */
    pingPong<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T>, easing: EasingFunction, once: boolean): TweenTask<T>;
}