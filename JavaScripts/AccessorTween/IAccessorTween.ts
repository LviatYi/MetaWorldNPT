import {TweenTask} from "./AccessorTween";

export type Getter<T> = () => T;
export type Setter<T> = (val: T) => void;

export default interface IAccessorTween {

    /**
     * from startVal to dist.
     * @param getter
     * @param setter
     * @param dist
     * @param duration
     * @public
     */
    to<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number): TweenTask<T>;

    /**
     * from startVal to (startVal + dist).
     * @param getter
     * @param setter
     * @param dist
     * @param duration
     * @public
     */
    move<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number): TweenTask<T>;
}