import {EasingFunction} from "../easing/Easing.js";
import ITweenTaskEvent from "./ITweenTaskEvent";

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
export default interface ITweenTask<T> extends ITweenTaskEvent {
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
     * 是否 任务正 重复 播放.
     * @beta
     */
    get isRepeat(): boolean;

    /**
     * 是否 任务正 󱞳往复 播放.
     * @beta
     */
    get isPingPong(): boolean;

    /**
     * 从 _virtualStartTime 到调用时的时间经过比率.
     * 用以查询播放进度.
     * @beta
     */
    get elapsed(): number;

    /**
     * 重设从 _virtualStartTime 到调用时的时间经过比率.
     * 用以控制播放进度.
     */
    set elapsed(value: number);

//region Tween Action

    /**
     * 更新插值函数.
     * @param easingFunc
     * @beta
     */
    easing(easingFunc: EasingFunction): void;

    /**
     * 󰏤暂停 补间.
     * @beta
     */
    pause(): ITweenTask<T>;

    /**
     * 快进至结束.
     * @beta
     */
    fastForwardToEnd(): ITweenTask<T>;

    /**
     * 󰐊播放 补间.
     * @beta
     */
    continue(): ITweenTask<T>;

    /**
     * 󰐊播放 补间.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从暂停前继续播放.
     * @beta
     */
    continue(recurve: boolean): ITweenTask<T>;

    /**
     * 重置 补间.
     * @beta
     */
    restart(): ITweenTask<T>;

    /**
     * 重置 补间.
     * @param pause 是否伴随 󰏤暂停. default false.
     * @beta
     */
    restart(pause: boolean): ITweenTask<T>;

    /**
     * 󰓕倒放 播放状态.
     * @beta
     */
    backward(): ITweenTask<T>;

    /**
     * 󰓕倒放 播放状态.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从现有的曲线继续播放.
     * @beta
     */
    backward(recurve: boolean): ITweenTask<T>;

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
     */
    forward(): ITweenTask<T>;

    /**
     * 󰐊正放 播放状态.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从现有的曲线继续播放.
     * @beta
     */
    forward(recurve: boolean): ITweenTask<T>;

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
     * @beta
     */
    recurve(): ITweenTask<T>;

    /**
     * 重设 动画曲线.
     * @param recurve 是否重设.
     * @beta
     */
    recurve(recurve: boolean): ITweenTask<T>;

    /**
     * 重复 播放.
     * @beta
     */
    repeat(): ITweenTask<T>;

    /**
     * 重复 播放.
     * @param repeat 是否 重复 播放.
     *      - true default. 完成后 重置 补间.
     * @beta
     */
    repeat(repeat: boolean): ITweenTask<T>;

    /**
     * 󱞳往复 播放.
     * @beta
     */
    pingPong(): ITweenTask<T>;

    /**
     * 󱞳往复 播放.
     * @param pingPong 󱞳往复 播放
     *      - true default. 󰐊正放 结束后 󰓕倒放.
     * @beta
     */
    pingPong(pingPong: boolean): ITweenTask<T>;

    /**
     * 󱞳往复 播放.
     * @param pingPong 是否 󱞳往复 播放
     *      - true default. 󰐊正放 结束后 󰓕倒放.
     * @param repeat 是否 重复 播放.
     * @beta
     */
    pingPong(pingPong: boolean, repeat: boolean): ITweenTask<T>;

    /**
     * 设置 󰩺自动销毁.
     * @beta
     */
    autoDestroy(): ITweenTask<T>;

    /**
     * 设置 󰩺自动销毁.
     * @param auto
     *      - true default.
     * @beta
     */
    autoDestroy(auto: boolean): ITweenTask<T>;

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 调用任务.
     * 除非强制 当 󰄲完成(done) 或 󰏤暂停(pause) 时 不调用 setter.
     *
     * @beta
     */
    call(): ITweenTask<T>;

    /**
     * 调用任务.
     * 除非强制 当 󰄲完成(done) 或 󰏤暂停(pause) 时 不调用 setter.
     *
     * @param force 强制调用. default is false.
     * @beta
     */
    call(force: boolean): ITweenTask<T>;
}