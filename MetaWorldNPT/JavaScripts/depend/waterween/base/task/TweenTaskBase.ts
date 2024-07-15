import { Delegate, Getter, Setter } from "gtoolkit";
import { ITweenTaskEvent } from "../interface/ITweenTaskEvent";
import Easing, { CubicBezierBase, EasingFunction } from "../../../easing/Easing";
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
     * 虚拟开始时间戳.
     * @protected
     */
    protected _virtualStartTime: number;

    /**
     * 上次暂停时间戳.
     * @protected
     */
    protected _lastStopTime?: number = undefined;

    /**
     * 上次执行进度.
     * @protected
     */
    protected _lastElapsed: number = 0;

    /**
     * 是否 任务已 󰄲完成.
     * 当任务 是 重复 播放的 isDone 永远不会为 true. 但仍能调用 {@link onDone}.
     */
    public isDone: boolean = false;

    /**
     * 是否 任务已 󰏤暂停.
     */
    public get isPause(): boolean {
        return this._lastStopTime !== undefined;
    }

    /**
     * 创建时间戳.
     * @protected
     */
    protected readonly _createTime: number;

    /**
     * 当前任务 时长.
     * @protected
     */
    protected _duration: number;

    /**
     * 结束时自动销毁.
     */
    public isAutoDestroy: boolean = false;

    protected constructor(
        getter: Getter<T>,
        setter: Setter<T>,
        duration: number,
        waterEasing: CubicBezierBase | EasingFunction,
        now: number,
        twoPhaseTweenBorder: number,
    ) {
        this._createTime = now ?? Date.now();
        this._getter = getter;
        this._setter = setter;
        this._duration = duration;
        this._waterEasing = waterEasing;
        this.twoPhaseTweenBorder = twoPhaseTweenBorder;
    }

    /**
     * @param recurve
     * @abstract
     */
    public abstract continue(recurve?: boolean): this;

    /**
     * @param easingFunc
     * @abstract
     */
    public easing(easingFunc: CubicBezierBase | EasingFunction): this {
        this._waterEasing = easingFunc;
        return this;
    }

    public get elapsed(): number {
        return (Date.now() - this._virtualStartTime) / this._duration;
    }

    public set elapsed(value: number) {
        this._virtualStartTime = Date.now() - (this.isPause ? this._lastStopTime : 0) - this._duration * Easing.clamp01(value);
    }

    public fastForwardToEnd(): this {
        this.continue(false);
        this._virtualStartTime = Date.now() - this._duration;
        this.call();

        return this;
    };

    public pause(now: number = undefined): this {
        if (this._lastStopTime === undefined) {
            this._lastStopTime = now ?? Date.now();
            this.onPause.invoke(now);
        }
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

//#region Event

    public onDone: SimpleDelegate<[boolean, number]> = new SimpleDelegate();

    public onDestroy: SimpleDelegate<number> = new SimpleDelegate();

    public onPause: SimpleDelegate<number> = new SimpleDelegate();

    public onContinue: SimpleDelegate<number> = new SimpleDelegate();

    public onRestart: SimpleDelegate<number> = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * @abstract
     */
    public abstract call(nowOrTimestamp?: number, isTimestamp?: boolean): this;
}

export function logESetterCrashed(e: Error) {
    console.error(`tween task crashed while setter is called. it will be autoDestroy. ${e}`);
}