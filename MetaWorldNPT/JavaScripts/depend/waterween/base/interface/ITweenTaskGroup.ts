import { ITweenTask } from "./ITweenTask";
import { IBackwardTweenTask } from "./IBackwardTweenTask";
import { ITweenTaskEvent } from "./ITweenTaskEvent";
import { IRestartTweenTask } from "./IRestartTweenTask";

/**
 * ITweenTaskGroup.
 * Tween task interface who working as a group.
 */
export interface ITweenTaskGroup
    extends ITweenTask,
        IRestartTweenTask,
        IBackwardTweenTask,
        ITweenTaskEvent {
    /**
     * 是否 任务列表为空.
     * @return {boolean}
     */
    get empty(): boolean;
}