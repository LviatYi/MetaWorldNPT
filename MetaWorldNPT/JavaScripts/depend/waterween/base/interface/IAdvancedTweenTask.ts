import { ITweenTask } from "./ITweenTask";
import { IBackwardTweenTask } from "./IBackwardTweenTask";

/**
 * IAdvancedTweenTask.
 * Tween task interface who has more media controller.
 */
export interface IAdvancedTweenTask extends ITweenTask, IBackwardTweenTask {
    /**
     * 是否 任务正 重复 播放.
     */
    get isRepeat(): boolean;

    /**
     * 是否 任务正 󱞳往复 播放.
     */
    get isPingPong(): boolean;

//#region Advanced Tween Action

    /**
     * 重置 补间.
     * @param pause 是否伴随 󰏤暂停. default false.
     * @param now 当前时间. 用于同步. ms
     *      - undefined use Date.now().
     */
    restart(pause?: boolean, now?: number): this;

    /**
     * 重复 播放.
     * @param repeat 是否 重复 播放.
     *      - true default. 完成后 重置 补间.
     */
    repeat(repeat?: boolean): this;

    /**
     * 󱞳往复 播放.
     * @param pingPong 是否 󱞳往复 播放
     *      - true default. 󰐊正放 结束后 󰓕倒放.
     * @param repeat 是否 重复 播放.
     *      - true default.
     */
    pingPong(pingPong?: boolean, repeat?: boolean): this;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}