import { EasingFunction } from "../../../easing/Easing";
import { ITweenTaskGroup } from "../interface/ITweenTaskGroup";
import { Delegate } from "gtoolkit";
import { IAdvancedTweenTask } from "../interface/IAdvancedTweenTask";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * 组模式.
 * - sequence 󰒿顺序 播放.
 * - parallel 平行 播放.
 */
export type GroupMode = "sequence" | "parallel";

/**
 * 组元素.
 */
export type GroupElement = ITweenTaskGroup | IAdvancedTweenTask

export abstract class TweenTaskGroupBase implements ITweenTaskGroup {
    public abstract mode: GroupMode;

    public tasks: GroupElement[] = [];

    public get empty(): boolean {
        return this.tasks.length === 0;
    }

    public abstract get duration(): number ;

    /**
     * par && tasks 不为空时 不为 undefined.
     */
    private _maxParIndex: number | undefined;

    public twoPhaseTweenBorder: number;

    public abstract get elapsedTime(): number;

    public abstract set elapsedTime(value: number);

    public abstract get elapsed(): number;

    public abstract set elapsed(value: number);

    public abstract get isDone(): boolean;

    public abstract get isPause(): boolean;

    public abstract get isForward(): boolean;

//#region Tween Action
    public setEasing(easingFunc: EasingFunction): void {
        for (const task of this.tasks) task.setEasing(easingFunc);
    }

    public restart(pause?: boolean): this {
        if (this.elapsedTime === 0) return this;

        this.elapsedTime = 0;

        this.onRestart.invoke();

        if (pause) this.pause();
        else this.continue(false);

        return this;
    }

    public abstract pause(): this;

    public abstract fastForwardToEnd(): this;

    public abstract continue(recurve?: boolean): this;

    public abstract forward(recurve?: boolean, pause?: boolean): this;

    public abstract backward(recurve?: boolean, pause?: boolean): this;

    protected _destroyed: boolean = false;

    public get destroyed(): boolean {
        return this._destroyed;
    }

    public destroy(): this {
        for (const task of this.tasks) task.destroy();
        this._destroyed = true;

        this.onDestroy.invoke();

        return this;
    }

    public isAutoDestroy: boolean = false;

    public autoDestroy(auto: boolean = false): this {
        this.isAutoDestroy = auto;
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event
    public onDone: SimpleDelegate<boolean> = new SimpleDelegate();

    public onDestroy: SimpleDelegate = new SimpleDelegate();

    public onPause: SimpleDelegate = new SimpleDelegate();

    public onContinue: SimpleDelegate = new SimpleDelegate();

    public onRestart: SimpleDelegate = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public addTask(task: GroupElement) {
        this.tasks.push(task.pause());
    }

    public abstract call(dtOrElapsed?: number, isDt?: boolean): this;
}