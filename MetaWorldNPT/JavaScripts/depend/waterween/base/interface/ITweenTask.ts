import { EasingFunction } from "../../../easing/Easing";

/**
 * ITweenTask.
 * Tween task interface.
 */
export interface ITweenTask {
    /**
     * 两相值 Tween 变化边界.
     */
    twoPhaseTweenBorder: number;

    /**
     * 是否 任务已 󰏤暂停.
     *      󰏤暂停 意味着 Task 可以继续播放
     */
    isPause: boolean;

    /**
     * 经过时长.
     */
    get elapsedTime(): number;

    /**
     * 重设 经过时长.
     * 用以控制播放进度.
     */
    set elapsedTime(value: number);

    /**
     * 经过比率. [0,1]
     */
    get elapsed(): number;

    /**
     * 重设 经过比率. [0,1]
     * 用以控制播放进度.
     */
    set elapsed(value: number);

    /**
     * 当次时长.
     * @return {number}
     */
    get duration(): number;

//#region Tween Action

    /**
     * 更新插值函数.
     * @param easingFunc
     */
    easing(easingFunc: EasingFunction): void;

    /**
     * 󰏤暂停 补间.
     */
    pause(): this;

    /**
     * 快进至结束.
     */
    fastForwardToEnd(): this;

    /**
     * 󰐊播放 补间.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从暂停前继续播放.
     */
    continue(recurve?: boolean): this;

    /**
     * 󰩺主动销毁.
     */
    destroy(): this;

    /**
     * 设置 󰩺自动销毁.
     * @param auto
     *      - true default.
     */
    autoDestroy(auto?: boolean): this;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 调用任务.
     * 除非强制 当 󰄲完成(done) 或 󰏤暂停(pause) 时 不调用 setter.
     * @param dtOrElapsed=0 时间差 或 进度值.
     *  - 为 0 时 意味着以当前属性立即调用一次.
     * @param isDt=true 是否 {@link dtOrElapsed} 作为时间差.
     *  - true. dtOrElapsed 为 时间差.
     *  - false. dtOrElapsed 为进度值. 0 为起始 1 为结束.
     */
    call(dtOrElapsed?: number, isDt?: boolean): this;
}