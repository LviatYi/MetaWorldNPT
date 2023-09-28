import {Getter} from "../../accessor/Getter";
import {Setter} from "../../accessor/Setter";
import TweenTaskBase from "./TweenTaskBase";
import IFlowTweenTask from "./IFlowTweenTask";
import Easing, {CubicBezier, CubicBezierBase, EasingFunction} from "../../easing/Easing";
import {RecursivePartial} from "../RecursivePartial";
import InnerWaterween from "../Waterween";
import * as console from "console";
import TweenDataUtil from "../dateUtil/TweenDataUtil";

/**
 * SingleTweenTask.
 * A task that describes how a property changes.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class FlowTweenTask<T> extends TweenTaskBase<T> implements IFlowTweenTask<T> {
//region Constant
    private static readonly DEFAULT_SENSITIVE_RATIO = 0.1;
//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 上次更新时间戳.
     * @private
     */
    private _lastUpdateTime: number = 0;

    private _virtualStartTime: number = 0;

    private _toCacheId: number;

    private _startValue: T;

    private _endValue: T;

    /**
     * 敏度倍率.
     * 敏度阈值 = 敏度倍率 * 当前任务 Duration.
     * 当再次调用 To 时 若与上次调用时间差低于 敏度阈值 则延迟更新.
     * @private
     */
    private _sensitivityRatio: number;

    private _isLazy: boolean;

    private _currDuration: number = 0;

    private _fixedDuration: number;

    private _avgVelocity: number;

    /**
     * 原插值函数.
     * @private
     */
    private _originEasingFunc: CubicBezierBase | EasingFunction;

    /**
     * 当前插值函数.
     * @private
     */
    private _currEasingFuncList: (CubicBezierBase | EasingFunction)[];

    private get easingList(): EasingFunction[] {
        return this._currEasingFuncList.map((item) => {
            if (item instanceof CubicBezierBase) {
                return item.bezier;
            } else {
                return item;
            }
        });
    }

    constructor(getter: Getter<T>,
                setter: Setter<T>,
                fixedDurationOrAvgVelocity: number = 1e3,
                isDuration: boolean = true,
                easing: CubicBezierBase | EasingFunction = new CubicBezier(.5, 0, .5, 1),
                sensitiveRatio: number = FlowTweenTask.DEFAULT_SENSITIVE_RATIO,
                twoPhaseTweenBorder: number = TweenTaskBase.DEFAULT_TWO_PHASE_TWEEN_BORDER,
    ) {
        const startTime = Date.now();
        super(
            getter,
            setter,
            startTime,
            twoPhaseTweenBorder,
        );
        if (isDuration) {
            this.setFixedDuration(fixedDurationOrAvgVelocity);
        } else {
            this.setAvgVelocity(fixedDurationOrAvgVelocity);
        }
        this._originEasingFunc = easing;
        this.sensitivityRatio = sensitiveRatio;
    }

    public get elapsed(): number {
        return (Date.now() - this._virtualStartTime) / this._currDuration;
    }

    public get isPause(): boolean {
        return this._task === null;
    }

    /**
     * 敏度倍率.
     * 敏度阈值 = 敏度倍率 * 当前任务 Duration.
     * 当再次调用 To 时 若与上次调用时间差低于 敏度阈值 则延迟更新.
     * @private
     */
    public get sensitivityRatio(): number {
        return this._sensitivityRatio;
    }

    public set sensitivityRatio(value: number) {
        this._sensitivityRatio = value;
    }

    /**
     * 是否 懒惰的.
     * 当懒惰时 调用带有与当前任务具有相同终值的 to 时将不启动新任务.
     */
    public get isLazy(): boolean {
        return this._isLazy;
    }

    /**
     * @param value
     */
    public set isLazy(value: boolean) {
        this._isLazy = value;
    }

    /**
     * 设置 时长 ms.
     * @param duration
     */
    public setFixedDuration(duration: number): FlowTweenTask<T> {
        if (duration < 0) {
            console.error(`duration must greater than or equal to 0.`);
            duration = 0;
        }
        this._fixedDuration = duration;
        this._avgVelocity = null;

        return this;
    }

    /**
     * 设置 移动速度 ms.
     * @param avgVelocity
     */
    public setAvgVelocity(avgVelocity: number): FlowTweenTask<T> {
        if (avgVelocity <= 0) {
            avgVelocity = 1;
            console.error(`velocity must greater than 0`);
        }

        this._avgVelocity = avgVelocity;
        this._fixedDuration = null;

        return this;
    }

    public to(dist: RecursivePartial<T>,
              durationOrAvgVelocity: number = undefined,
              easingOrBezier: EasingFunction | CubicBezierBase = undefined,
              isLazy = undefined): FlowTweenTask<T> {
        const current = Date.now();

        clearTimeout(this._toCacheId);
        this._toCacheId = null;

        if (current - this._lastUpdateTime > this._currDuration * this._sensitivityRatio) {
            const currentValue = this._getter();
            let newTask: TweenTask<number>;
            let easing: EasingFunction;
            let targetEasing: ((x: number) => number) | CubicBezierBase;
            if (easingOrBezier !== null && easingOrBezier !== undefined) {
                targetEasing = easingOrBezier;
            } else {
                targetEasing = this._originEasingFunc;
            }

            if (this._tasks) {
                InnerWaterween.destroyTweenTask(this._tasks);
                let scaleX1: number;
                let scaleY1: number;
                let toDist: number = null;
                const lazy = isLazy !== undefined ? isLazy : this.isLazy;
                const isReg = Math.abs(dist - currentValue) < 1e-6;
                const lastDuration = this._currDuration;
                if (lazy && this._endValue === dist) {
                    return this;
                }

                if (isReg) {
                    toDist = this._endValue;
                    if (this._fixedDuration) {
                        this._currDuration = durationOrAvgVelocity ? durationOrAvgVelocity : this._fixedDuration;
                    } else {
                        this._currDuration = Math.abs(toDist - currentValue) / (durationOrAvgVelocity ? durationOrAvgVelocity : this._avgVelocity);
                    }
                    scaleX1 = lastDuration / this._currDuration;
                    scaleY1 = 1;
                } else {
                    toDist = dist;
                    if (this._fixedDuration) {
                        this._currDuration = durationOrAvgVelocity ? durationOrAvgVelocity : this._fixedDuration;
                    } else {
                        this._currDuration = Math.abs(toDist - currentValue) / (durationOrAvgVelocity ? durationOrAvgVelocity : this._avgVelocity);
                    }
                    scaleX1 = lastDuration / this._currDuration;
                    scaleY1 = (this._endValue - this._startValue) / (toDist - currentValue);
                }

                if (targetEasing instanceof CubicBezierBase) {
                    this._currEasingFuncList = Easing.smoothBezier(
                        this._currEasingFuncList,
                        targetEasing,
                        this._tasks.elapsed,
                        scaleX1,
                        scaleY1,
                        undefined,
                        undefined,
                        isReg,
                    );
                    easing = this._currEasingFuncList.bezier;
                } else {
                    this._currEasingFuncList = targetEasing;
                    easing = this._currEasingFuncList;
                }

                newTask = InnerWaterween.to(
                    this._getter,
                    this._setter,
                    toDist,
                    this._currDuration,
                    null,
                    easing,
                ) as TweenTask<number>;

                this._startValue = currentValue;
                this._endValue = toDist;
            } else {
                if (Math.abs(this._getter() - dist) < 1e-6) {
                    return this;
                }

                if (this._fixedDuration) {
                    this._currDuration = durationOrAvgVelocity ?? this._fixedDuration;
                } else {
                    this._currDuration = Math.abs((dist - currentValue)) / (durationOrAvgVelocity ?? this._avgVelocity);
                }

                if (targetEasing instanceof CubicBezierBase) {
                    easing = targetEasing.bezier;
                } else {
                    easing = targetEasing;
                }

                this._currEasingFuncList = targetEasing;
                newTask = InnerWaterween.to(
                    this._getter,
                    this._setter,
                    dist,
                    this._currDuration,
                    null,
                    easing,
                ) as TweenTask<number>;

                this._startValue = currentValue;
                this._endValue = dist;
            }

            newTask.onDone.add((param) => {
                this._tasks = null;
            });
            newTask.autoDestroy(true);

            this._tasks = newTask;
            this._lastUpdateTime = current;
        } else {
            this._toCacheId = setTimeout(() => {
                this.to(dist, durationOrAvgVelocity);
            }, this._currDuration * this.sensitivityRatio);
        }

        return this;
    }

    public easing(bezier: CubicBezierBase | EasingFunction): FlowTweenTask<T> {
        this._originEasingFunc = bezier;

        return this;
    }

    public call(now: number = undefined, isTimestamp: boolean = true): FlowTweenTask<T> {
        if (this.isDone || this.isPause) {
            return this;
        }

        let elapsed: number;
        if (now !== undefined) {
            if (!isTimestamp) {
                elapsed = now;
            } else {
                elapsed = (now - this._virtualStartTime) / this._currDuration;
            }
        } else {
            elapsed = this.elapsed;
        }

        try {
            if (this._endValue !== null && this._endValue !== undefined) {
                this._setter(
                    TweenDataUtil.marshalDataTween(this._startValue, this._endValue, this.easingList));
            } else {
                console.error(`endValue is invalid`);
            }
        } catch (e) {
            console.error("tween task crashed while setter is called. it will be autoDestroy");
            this.isDone = true;
            this.autoDestroy(true);
        }

        // 确保到达终点后再结束.
        if (elapsed >= 1) {
            if (this._isPingPong && !this.isBackward) {
                this.backward(true, false);
            } else if (this._isRepeat) {
                this.restart();
            } else {
                this.isDone = true;
            }

            this._forwardStartVal = this._startValue;
            this.onDone.invoke(this.isBackward);
        }

        return this;
    }

    private;
}