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

    public get isDone(): boolean {
        return this._elapsedTime >= this._duration;
    }

    protected _isPause: boolean = false;

    public get isPause(): boolean {
        return this._isPause;
    }

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
        let newV = Gtk.clamp(value, 0, this._duration);
        if (newV === this._elapsedTime) return;

        this._elapsedTime = newV;

        this.call(0);
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
        let newV = this._duration * Gtk.clamp(value);
        if (Gtk.equal(newV, this.elapsed)) return;
        this._elapsedTime = newV;

        this.call(0);
    }

    protected _duration: number;

    public get duration(): number {
        return this._duration;
    }

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
    public setEasing(easingFunc: CubicBezierBase | EasingFunction): this {
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
        if (this.isPause) return this;

        this._isPause = true;
        this.onPause.invoke();
        return this;
    }

    private _destroyed: boolean = false;

    public get destroyed(): boolean {
        return this._destroyed;
    }

    public destroy(): this {
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

    /**
     * @abstract
     */
    public abstract call(dtOrElapsed: number, isDt?: boolean): this;
}

export function logESetterCrashed(e: Error) {
    console.error(`tween task crashed while setter is called. it will be autoDestroy. ${e}`);
}