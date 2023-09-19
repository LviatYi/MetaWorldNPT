import ITweenTaskEvent from "./ITweenTaskEvent";
import {EasingFunction} from "../easing/Easing";

/**
 * IFlowTweenTask.
 * One way Tween Task.
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
export default interface IFlowTweenTask extends ITweenTaskEvent {
    /**
     * 是否 任务已 󰏤暂停.
     *      󰏤暂停 意味着 Task 可以继续播放
     */
    get isPause(): boolean;

    /**
     * 从 _virtualStartTime 到调用时的时间经过比率.
     * 用以查询播放进度.
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
     */
    easing(easingFunc: EasingFunction): void;

    /**
     * 󰏤暂停 补间.
     */
    pause(): IFlowTweenTask;

    /**
     * 快进至结束.
     */
    fastForwardToEnd(): IFlowTweenTask;

    /**
     * 󰐊播放 补间.
     */
    continue(): IFlowTweenTask;

    /**
     * 󰐊播放 补间.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从暂停前继续播放.
     */
    continue(recurve: boolean): IFlowTweenTask;

    /**
     * 重设 动画曲线.
     */
    recurve(): IFlowTweenTask;

    /**
     * 重设 动画曲线.
     * @param recurve 是否重设.
     */
    recurve(recurve: boolean): IFlowTweenTask;

    to(dist: number): IFlowTweenTask;

    /**
     * 设置 󰩺自动销毁.
     */
    autoDestroy(): IFlowTweenTask;

    /**
     * 设置 󰩺自动销毁.
     * @param auto
     *      - true default.
     */
    autoDestroy(auto: boolean): IFlowTweenTask;

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 调用任务.
     * 除非强制 当 󰄲完成(done) 或 󰏤暂停(pause) 时 不调用 setter.
     */
    call(): IFlowTweenTask;

    /**
     * 调用任务.
     * 除非强制 当 󰄲完成(done) 或 󰏤暂停(pause) 时 不调用 setter.
     *
     * @param force 强制调用. default is false.
     */
    call(force: boolean): IFlowTweenTask;
}