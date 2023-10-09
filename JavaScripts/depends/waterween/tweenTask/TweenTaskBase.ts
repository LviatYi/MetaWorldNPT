import {Getter} from "../../accessor/Getter";
import {Setter} from "../../accessor/Setter";
import ITweenTaskEvent from "../ITweenTaskEvent";
import MultiDelegate from "../../delegate/MultiDelegate";
import ITweenTask from "./ITweenTask";
import Easing, {CubicBezier, CubicBezierBase, EasingFunction} from "../../easing/Easing";

/**
 * TweenTask Base.
 */
export default abstract class TweenTaskBase<T> implements ITweenTask<T>, ITweenTaskEvent {
    /**
     * 默认 两相值 Tween 变化边界.
     */
    public static readonly DEFAULT_TWO_PHASE_TWEEN_BORDER = 0.5;

    /**
     * 两相值 Tween 变化边界.
     * @protected
     */
    protected _twoPhaseTweenBorder: number;

    /**
     * 两相值 Tween 变化边界.
     */
    public get twoPhaseTweenBorder(): number {
        return 0;
    }

    public set twoPhaseTweenBorder(value: number) {
        this._twoPhaseTweenBorder = value;
    }

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
    protected _lastStopTime?: number = null;

    /**
     * 上次执行进度.
     * @protected
     */
    protected _lastElapsed: number = 0;

    /**
     * 是否 任务已 󰄲完成.
     * 当任务 是 重复 播放的 isDone 永远不会为 true. 但仍能调用 {@link onDone}.
     */
    public isDone: boolean = true;

    /**
     * 是否 任务已 󰏤暂停.
     */
    public get isPause(): boolean {
        return this._lastStopTime !== null;
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
        waterEasing: CubicBezierBase | EasingFunction = new CubicBezier(.5, 0, .5, 1),
        twoPhaseTweenBorder: number = TweenTaskBase.DEFAULT_TWO_PHASE_TWEEN_BORDER,
    ) {
        this._createTime = Date.now();
        this._getter = getter;
        this._setter = setter;
        this._duration = duration;
        this._waterEasing = waterEasing;
        this._twoPhaseTweenBorder = twoPhaseTweenBorder;
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
        this._virtualStartTime = Date.now() - this._duration;
        this.call();

        return this;
    };

    public pause(): this {
        this._lastStopTime = Date.now();
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

//region Event

    public onDone: MultiDelegate<boolean> = new MultiDelegate<boolean>();

    public onDestroy: MultiDelegate<void> = new MultiDelegate<void>();

    public onPause: MultiDelegate<void> = new MultiDelegate<void>();

    public onContinue: MultiDelegate<void> = new MultiDelegate<void>();

    public onRestart: MultiDelegate<void> = new MultiDelegate<void>();

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * @abstract
     */
    public abstract call(now?: number, isTimestamp?: boolean): this;
}