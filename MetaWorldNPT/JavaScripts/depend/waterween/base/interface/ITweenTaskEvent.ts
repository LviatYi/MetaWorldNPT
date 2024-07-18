import { Delegate } from "gtoolkit";

/**
 * ITweenTaskEvent.
 * Events broadcast by tween task.
 */
export interface ITweenTaskEvent {
    /**
     * 当 󰄲完成 时.
     *      val: 是否 任务正 󰐊正放.
     */
    onDone: Delegate.SimpleDelegate<boolean>;

    /**
     * 当 󰏤暂停 时.
     */
    onPause: Delegate.SimpleDelegate;

    /**
     * 当 󰐊继续 时.
     */
    onContinue: Delegate.SimpleDelegate;

    /**
     * 当 重置 时.
     */
    onRestart: Delegate.SimpleDelegate;
}