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

//#region Tween Action

    /**
     * 更新插值函数.
     * @param easingFunc
     */
    easing(easingFunc: EasingFunction): void;

    /**
     * 󰏤暂停 补间..
     * @param now 当前时间. 用于同步. ms
     *      - undefined use Date.now().
     */
    pause(now?: number): this;

    /**
     * 快进至结束.
     */
    fastForwardToEnd(): this;

    /**
     * 󰐊播放 补间.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从暂停前继续播放..
     * @param now 当前时间. 用于同步. ms
     *      - undefined use Date.now().
     */
    continue(recurve?: boolean, now?: number): this;

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
     *
     * @param now 以此时间调用. 用于同步. 默认以时间戳形式.
     * @param isTimestamp 是否 {@link now} 作为时间戳.
     *  - true. default. now 为 时间戳.
     *  - false. now 为 elapsed 表示进度值. 0 为起始 1 为结束.
     */
    call(now?: number, isTimestamp?: boolean): this;
}