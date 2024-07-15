import SimpleDelegate = Delegate.SimpleDelegate;
import { Delegate } from "gtoolkit";

/**
 * ITweenTaskEvent.
 * Events broadcast by tween task.
 */
export interface ITweenTaskEvent {
    /**
     * 当 󰄲完成 时.
     *      0: 是否 任务正 󰓕倒放.
     *      1: 唤起时间.
     */
    onDone: SimpleDelegate<[boolean, number]>;

    /**
     * 当 󰩺销毁 时.
     *      val: 唤起时间.
     */
    onDestroy: SimpleDelegate<number>;

    /**
     * 当 󰏤暂停 时.
     *      val: 唤起时间.
     */
    onPause: SimpleDelegate<number>;

    /**
     * 当 󰐊继续 时.
     *      val: 唤起时间.
     */
    onContinue: SimpleDelegate<number>;

    /**
     * 当 重置 时.
     *      val: 唤起时间.
     */
    onRestart: SimpleDelegate<number>;
}