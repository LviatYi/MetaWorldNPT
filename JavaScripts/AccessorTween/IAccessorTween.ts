import {TweenTask} from "./AccessorTween";
import Easing, {EasingFunction} from "../lab/easing/Easing";

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
     * @param easing easing Function. default should be linear.
     * @public
     */
    to<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, easing: EasingFunction): TweenTask<T>;

    /**
     * from startVal to (startVal + dist).
     *
     * @param getter
     * @param setter
     * @param dist
     * @param duration duration in ms.
     * @param easing easing Function. default should be linear.
     * @public
     */
    move<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, easing: EasingFunction): TweenTask<T>;
}