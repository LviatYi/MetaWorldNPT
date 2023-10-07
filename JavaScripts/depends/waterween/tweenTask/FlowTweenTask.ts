import {Getter} from "../../accessor/Getter";
import {Setter} from "../../accessor/Setter";
import TweenTaskBase from "./TweenTaskBase";
import IFlowTweenTask from "./IFlowTweenTask";
import Easing, {CubicBezierBase, EasingFunction} from "../../easing/Easing";
import TweenDataUtil from "../dateUtil/TweenDataUtil";
import MultiDelegate from "../../delegate/MultiDelegate";

/**
 * FlowTweenTask.
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

    private _startValue: T;

    private _endValue: T;

    /**
     * 上次 To 缓存 id.
     * @private
     */
    private _toCacheId: number;

    /**
     * 敏度倍率.
     * 敏度阈值 = 敏度倍率 * 当前任务 Duration.
     * 当再次调用 To 时 若与上次调用时间差低于 敏度阈值 则延迟更新.
     * @private
     */
    private _sensitivityRatio: number;

    private _isLazy: boolean;

    /**
     * 固定时长.
     * @private
     */
    private _fixedDuration: number;

    private _lastUpdateTime: number;

    /**
     * 当前插值函数.
     * @private
     */
    private _currEasingFuncList: (CubicBezierBase | EasingFunction)[];

    /**
     * Easing List 长度缓存.
     * @private
     */
    private _defaultEasingLength: number = null;

    public get isLazy(): boolean {
        return this._isLazy;
    }

    public set isLazy(value: boolean) {
        this._isLazy = value;
    }

    public setFixDuration(duration: number): this {
        if (duration < 0) {
            console.error(`duration must greater than or equal to 0.`);
            duration = 0;
        }
        this._fixedDuration = duration;

        return this;
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
                duration: number = 1e3,
                easing: CubicBezierBase | EasingFunction = undefined,
                sensitiveRatio: number = FlowTweenTask.DEFAULT_SENSITIVE_RATIO,
                twoPhaseTweenBorder: number = undefined,
    ) {
        super(
            getter,
            setter,
            duration,
            easing,
            twoPhaseTweenBorder,
        );
        this.setFixDuration(duration);

        this._waterEasing = easing;
        this.sensitivityRatio = sensitiveRatio;
    }

//region Flow Tween Action

    /**
     * @override
     */
    public continue(recurve?: boolean): this {
        this._lastStopTime = null;
        return this;
    }

    public to(dist: T,
              duration: number = undefined,
              easingOrBezier: EasingFunction | CubicBezierBase = undefined,
              isLazy: boolean = undefined): this {
        const current = Date.now();

        clearTimeout(this._toCacheId);
        this._toCacheId = null;

        if (current - this._lastUpdateTime > this._duration * this._sensitivityRatio) {
            const currentValue = this._getter();
            let targetEasing: ((x: number) => number) | CubicBezierBase;
            if (easingOrBezier !== null && easingOrBezier !== undefined) {
                targetEasing = easingOrBezier;
            } else {
                targetEasing = this._waterEasing;
            }

            if (this.isDone) {
                if (!this.isOverMinVibrationThreshold(this._getter(), dist)) {
                    return this;
                }

                this.regenerateEasingListDefault(dist);

                this._startValue = currentValue;
                this._endValue = dist;
            } else {
                const lazy = isLazy !== undefined ? isLazy : this.isLazy;
                if (lazy && this._endValue === dist) {
                    return this;
                }
                const lastDuration = this._duration;
                this._duration = duration ? duration : this._fixedDuration;

                this.regenerateEasingList(currentValue,
                    dist,
                    this._startValue,
                    this._endValue,
                    targetEasing,
                    lastDuration);

                this._startValue = currentValue;
                this._endValue = dist;
            }

            this._lastUpdateTime = current;
        } else {
            this._toCacheId = setTimeout(() => {
                this.to(dist, duration);
            }, this._duration * this.sensitivityRatio);
        }

        return this;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Event

    public onDone: MultiDelegate<boolean> = new MultiDelegate<boolean>();

    public onDestroy: MultiDelegate<void> = new MultiDelegate<void>();

    public onPause: MultiDelegate<void> = new MultiDelegate<void>();

    public onContinue: MultiDelegate<void> = new MultiDelegate<void>();

    public onRestart: MultiDelegate<void> = new MultiDelegate<void>();

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private regenerateEasingList(currValue: T, dist: T, originStart: T, originDist: T, targetEasing: EasingFunction | CubicBezierBase = undefined, lastDuration: number, index: number = 0) {
        if (TweenDataUtil.isObject(currValue)) {
            const keys = Object.keys(currValue);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                this.regenerateEasingList(
                    currValue[key],
                    dist[key],
                    originStart[key],
                    originDist[key],
                    targetEasing,
                    i);
            }
        } else if (TweenDataUtil.isNumber(currValue) && targetEasing instanceof CubicBezierBase) {
            const isReg = Math.abs(dist as number - currValue) < 1e-6;
            const scaleX1 = lastDuration / this._duration;
            const scaleY1 = isReg ?
                //TODO_LviatYi 1 过小. 请优化.
                1 :
                (originDist as number - (originStart as number)) / (dist as number - currValue);

            this._currEasingFuncList[index++] = Easing.smoothBezier(
                this._currEasingFuncList[index],
                targetEasing,
                this.elapsed,
                scaleX1,
                scaleY1,
                undefined,
                undefined,
                isReg,
            );
        } else {
            this._currEasingFuncList[index++] = targetEasing;
        }
    };

    private regenerateEasingListDefault(value: T, index = 0) {
        if (index === 0 && this._defaultEasingLength !== null) {
            this._currEasingFuncList.length = this._defaultEasingLength;
            for (let i = 0; i < this._defaultEasingLength; i++) {
                this._currEasingFuncList[i] = this._waterEasing;
            }
        } else {
            if (TweenDataUtil.isObject(value)) {
                Object.keys(value).forEach((key) => {
                    this.regenerateEasingListDefault(value[key], index);
                });
            } else {
                this._currEasingFuncList[index++] = this._waterEasing;
            }

            this._defaultEasingLength = index;
        }
    }

    private isOverMinVibrationThreshold(currValue: T, newValue: T, min: number = 1e-6): boolean {
        if (TweenDataUtil.isPrimitiveType(newValue)) {
            if (TweenDataUtil.isNumber(newValue) && TweenDataUtil.isNumber(currValue)) {
                return Math.abs(newValue - currValue) > min;
            } else {
                return newValue !== currValue;
            }
        } else if (TweenDataUtil.isObject(newValue)) {
            const keys = Object.keys(newValue);

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (this.isOverMinVibrationThreshold(currValue[key], newValue[key], min)) {
                    return true;
                }
            }
            return false;
        } else {
            console.log("maybe value is unsupported type");
            return false;
        }
    }

    /**
     * @override
     */
    public call(now: number = undefined, isTimestamp: boolean = true): this {
        if (this.isDone || this.isPause) {
            return this;
        }

        if (now !== undefined) {
            this._lastElapsed = isTimestamp ? (now - this._virtualStartTime) / this._duration : now;
        } else {
            this._lastElapsed = this.elapsed;
        }

        try {
            if (this._endValue !== null && this._endValue !== undefined) {
                this._setter(
                    TweenDataUtil.marshalDataTween(this._startValue, this._endValue, this.easingList));
            } else {
                const msg = `endValue is invalid`;
                console.error(msg);
                throw new Error(msg);
            }
        } catch (e) {
            console.error("tween task crashed while setter is called. it will be autoDestroy");
            this.isDone = true;
            this.autoDestroy(true);
        }

        // 确保到达终点后再结束.
        if (this._lastElapsed >= 1) {
            this.isDone = true;
            this.onDone.invoke(false);
        }

        return this;
    }
}