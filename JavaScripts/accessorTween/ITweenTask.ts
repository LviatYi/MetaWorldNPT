import {EasingFunction} from "../easing/Easing.js";
import MultiDelegate from "../delegate/MultiDelegate.js";

/**
 * ITweenTask.
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
export default interface ITweenTask<T> {

    /**
     * 是否 任务已 󰏤暂停.
     *      󰏤暂停 意味着 Task 可以继续播放
     * @beta
     */
    get isPause(): boolean;

    /**
     * 是否 任务正 󰓕倒放.
     * @beta
     */
    get isBackward(): boolean;

    /**
     * 从 _virtualStartTime 到调用时的时间经过比率.
     * 用以控制播放进度.
     * @beta
     */
    get elapsed(): number;

//region Tween Action

    /**
     * 更新插值函数.
     * @param easingFunc
     */
    easing(easingFunc: EasingFunction): void;

    /**
     * 󰏤暂停 补间.
     */
    pause(): ITweenTask<T>;

    /**
     * 快进至结束.
     * @beta
     */
    fastForwardToEnd(): ITweenTask<T>;

    /**
     * 󰐊播放 补间.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从暂停前继续播放.
     */
    continue(recurve: boolean): ITweenTask<T>;

    /**
     * 重置 补间.
     * @param pause 是否伴随 󰏤暂停. default false.
     */
    restart(pause: boolean): ITweenTask<T>;

    /**
     * 󰓕倒放 播放状态.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从现有的曲线继续播放.
     * @param pause 是否 󰏤暂停. default false.
     * @beta
     */
    backward(recurve: boolean, pause: boolean): ITweenTask<T>;

    /**
     * 󰐊正放 播放状态.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从现有的曲线继续播放.
     * @param pause 是否 󰏤暂停. default false.
     * @beta
     */
    forward(recurve: boolean, pause: boolean): ITweenTask<T>;

    /**
     * 重设 动画曲线.
     * @param recurve 是否重设.
     */
    recurve(recurve: boolean): ITweenTask<T>;

    /**
     *
     * @param repeat
     */
    repeat(repeat: boolean): ITweenTask<T>;

    /**
     * 󱞳往复 播放.
     * @param pingPong
     * @param repeat
     */
    pingPong(pingPong: boolean, repeat: boolean): ITweenTask<T>;

    /**
     * 设置 󰩺自动销毁.
     * @param auto
     */
    autoDestroy(auto: boolean): ITweenTask<T>;

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Event

    /**
     * 当 󰄲完成 时.
     *      val: 是否 任务正 󰓕倒放.
     * @beta
     */
    onDone: MultiDelegate<boolean>;

    /**
     * 当 󰩺销毁 时.
     * @beta
     */
    onDestroy: MultiDelegate<void>;

    /**
     * 当 󰏤暂停 时.
     * @beta
     */
    onPause: MultiDelegate<void>;

    /**
     * 当 󰐊继续 时.
     * @beta
     */
    onContinue: MultiDelegate<void>;

    /**
     * 当 重置 时.
     * @beta
     */
    onRestart: MultiDelegate<void>;

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 调用任务.
     * 除非强制 当 󰄲完成(done) 或 󰏤暂停(pause) 时 不调用 setter.
     *
     * @param force 强制调用. default is false.
     * @beta
     */
    call(force: boolean): ITweenTask<T>;

}