/**
 * IBackwardTweenTask.
 * Tween task interface who can backward.
 */
export interface IBackwardTweenTask {
    /**
     * 是否 任务正 󰐊正放.
     */
    get isForward(): boolean;

    /**
     * 󰓕倒放 播放状态.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从现有的曲线继续播放.
     * @param pause 是否 󰏤暂停. default false.
     */
    backward(recurve?: boolean, pause?: boolean): this;

    /**
     * 󰐊正放 播放状态.
     * @param recurve 是否重置动画曲线.
     *      - true default. Task 将重新完整地进行曲线插值.
     *      - false Task 将从现有的曲线继续播放.
     * @param pause 是否 󰏤暂停. default false.
     */
    forward(recurve?: boolean, pause?: boolean): this;
}