import { ITweenTask } from "./ITweenTask";
import { IBackwardTweenTask } from "./IBackwardTweenTask";
import { ITweenTaskEvent } from "./ITweenTaskEvent";

/**
 * ITweenTaskGroup.
 * Tween task interface who working as a group.
 */
export interface ITweenTaskGroup extends ITweenTask, IBackwardTweenTask, ITweenTaskEvent {
}