import Gtk, { Delegate, Getter, Setter } from "gtoolkit";
import { ITweenTaskEvent } from "../interface/ITweenTaskEvent";
import { CubicBezierBase, EasingFunction } from "../../../easing/Easing";
import { ITweenTask } from "../interface/ITweenTask";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * TweenTask Base.
 */
export abstract class TweenTaskBase<T> implements ITweenTask, ITweenTaskEvent {
    /**
     * 默认 两相值 Tween 变化边界.
     */
    public static readonly DEFAULT_TWO_PHASE_TWEEN_BORDER = 0.5;

    public static validId: number = 0;

    public readonly id: number = TweenTaskBase.validId++;

    private _needDestroy: boolean = false;

    /**
     * 是否 已被标记销毁.
     */
    public get needDestroy(): boolean {
        return this._needDestroy;
    }

    /**
     * 两相值 Tween 变化边界.
     * @protected
     */
    public twoPhaseTweenBorder: number;

    /**
     * Getter.
     * @protected
     */
    protected readonly _getter: Getter<T>;

    /**
     * Setter.
     * @protected
     */
    protected readonly _setter: Setter<T>;

    /**
     * Water 插值.
     * 可能为 CubicBezierBase 或 EasingFunction.
     * @protected
     */
    protected _waterEasing: CubicBezierBase | EasingFunction;

    /**
     * 插值函数.
     */
    public get easingFunc(): EasingFunction {
        return this._waterEasing instanceof CubicBezierBase ?
            this._waterEasing.bezier :
            this._waterEasing;
    }

    /**
     * 是否 任务已 󰄲完成.
     * 当任务 是 重复 播放的 isDone 永远不会为 true. 但仍能调用 {@link onDone}.
     */
    public isDone: boolean = false;

    /**
     * 是否 任务已 󰏤暂停.
     */
    public isPause: boolean;

    protected _elapsedTime: number = 0;

    /**
     * 经过时长.
     */
    public get elapsedTime(): number {
        return this._elapsedTime;
    }

    /**
     * 重设 经过时长.
     * 用以控制播放进度.
     */
    public set elapsedTime(value: number) {
        this._elapsedTime = Gtk.clamp(value, 0, this._duration);
    }

    /**
     * 经过比率. [0,1]
     */
    public get elapsed(): number {
        return this._elapsedTime / this._duration;
    }

    /**
     * 重设 经过比率. [0,1]
     * 用以控制播放进度.
     */
    public set elapsed(value: number) {
        this._elapsedTime = this._duration * Gtk.clamp(value);
    }

    protected _duration: number;

    public get duration(): number {
        return this._duration;
    }

    /**
     * 结束时自动销毁.
     */
    public isAutoDestroy: boolean = false;

    protected constructor(
        getter: Getter<T>,
        setter: Setter<T>,
        duration: number,
        waterEasing: CubicBezierBase | EasingFunction,
        twoPhaseTweenBorder: number,
    ) {
        this._getter = getter;
        this._setter = setter;
        this._duration = duration;
        this._waterEasing = waterEasing;
        this.twoPhaseTweenBorder = twoPhaseTweenBorder;
    }

//#region Tween Action
    /**
     * @abstract
     */
    public abstract continue(): this;

    /**
     * @param easingFunc
     * @abstract
     */
    public easing(easingFunc: CubicBezierBase | EasingFunction): this {
        this._waterEasing = easingFunc;
        return this;
    }

    public fastForwardToEnd(): this {
        this.continue();
        this._elapsedTime = this._duration;
        this.call(0);

        return this;
    }

    public pause(): this {
        if (this.isPause === true) return this;

        this.isPause = true;
        this.onPause.invoke();
        return this;
    }

    public destroy(): this {
        this._needDestroy = true;
        return this;
    }

    /**
     * 设置 󰩺自动销毁.
     * @param auto
     * @public
     */
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

    /**
     * @abstract
     */
    public abstract call(dtOrElapsed: number, isDt?: boolean): this;
}

export function logESetterCrashed(e: Error) {
    console.error(`tween task crashed while setter is called. it will be autoDestroy. ${e}`);
}