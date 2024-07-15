import { ITweenTask } from "./ITweenTask";
import { IBackwardTweenTask } from "./IBackwardTweenTask";

/**
 * ITweenTaskGroup.
 * Tween task interface who working as a group.
 */
export interface ITweenTaskGroup extends ITweenTask, IBackwardTweenTask {

}