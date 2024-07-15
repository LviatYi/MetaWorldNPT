import { ITweenTask } from "./ITweenTask";
import { CubicBezierBase, EasingFunction } from "../../../easing/Easing";

/**
 * IFlowTweenTask.
 * Tween task interface working as a flow.
 * One way Tween Task.
 */
export interface IFlowTweenTask<T> extends ITweenTask {
    /**
     * 是否 懒惰的.
     * 当懒惰时 调用带有与当前任务具有相同终值的 to 时将不启动新任务.
     * default true.
     */
    get isLazy(): boolean;

    set isLazy(val: boolean);

    /**
     * 设置 固定时长 ms.
     * 当 to 未传入 duration 时使用固定时长.
     * @param duration
     */
    setFixDuration(duration: number): this;

    /**
     * 敏度倍率.
     * 敏度阈值 = 敏度倍率 * 当前任务 Duration.
     * 当再次调用 To 时 若与上次调用时间差低于 敏度阈值 则延迟更新.
     */
    get sensitivityRatio(): number;

    set sensitivityRatio(val: number);

//#region Flow Tween Action

    /**
     * to Dist.
     * @param dist
     * @param duration
     * @param easingOrBezier
     * @param isLazy
     */
    to(
        dist?: T,
        duration?: number,
        easingOrBezier?: EasingFunction | CubicBezierBase,
        isLazy?: boolean,
    ): this;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}