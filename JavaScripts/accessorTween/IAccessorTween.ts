import {TweenTask} from "./AccessorTween.js";
import {EasingFunction} from "../easing/Easing.js";

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
     * @param forceStartVal force from specified start value.
     * @param easing easing Function. default should be linear.
     * @public
     * @beta
     */
    to<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, forceStartVal: Partial<T>, easing: EasingFunction): TweenTask<T>;

    /**
     * from startVal to (startVal + dist).
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
     * Create await task.
     * It does nothing and just calls the {@link TweenTask.onDone} function after the duration.
     * @param duration
     */
    await<T>(duration: number): TweenTask<T>;
}