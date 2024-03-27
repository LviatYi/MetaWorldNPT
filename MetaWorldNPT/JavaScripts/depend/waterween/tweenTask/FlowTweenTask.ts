import {Getter, Setter} from "../../../util/GToolkit";
import TweenTaskBase from "./TweenTaskBase";
import IFlowTweenTask from "./IFlowTweenTask";
import Easing, {CubicBezierBase, EasingFunction} from "../../easing/Easing";
import TweenDataUtil from "../dateUtil/TweenDataUtil";
import {Delegate} from "../../delegate/Delegate";
import SimpleDelegate = Delegate.SimpleDelegate;

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
//#region Constant
    private static readonly DEFAULT_SENSITIVE_RATIO = 0.1;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _startValue: T;

    private _endValue: T;

    /**
     * 上次 To 缓存 id.
     * @private
     */
    private _toCacheId: number;

    private _sensitivityRatio: number;

    private _isLazy: boolean;

    /**
     * 固定时长.
     * @private
     */
    private _fixedDuration: number;

    private _lastUpdateTime: number = 0;

    /**
     * 是否 已损坏.
     * 当损坏时 不再接受新的 to 命令.
     * @private
     */
    private _isBroken: boolean = false;

    /**
     * 当前插值函数.
     * @private
     */
    private _currEasingFuncList: (CubicBezierBase | EasingFunction)[] = [];

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

    private _isSmooth: boolean;

    public setFixDuration(duration: number): this {
        if (duration < 0) {
            console.error(`duration must greater than or equal to 0.`);
            duration = 0;
        }
        this._fixedDuration = duration;

        return this;
    }

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
                isLazy: boolean = true,
                isSmooth: boolean = true,
                twoPhaseTweenBorder: number = undefined,
    ) {
        super(
            getter,
            setter,
            duration,
            easing,
            twoPhaseTweenBorder,
        );
        this._virtualStartTime = this._createTime;
        this.setFixDuration(duration);
        this.isLazy = isLazy;
        this._isSmooth = isSmooth;
        this.isDone = true;

        this.sensitivityRatio = sensitiveRatio;
    }

//#region Flow Tween Action

    /**
     * @override
     */
    public continue(recurve?: boolean): this {
        //TODO_LviatYi 重播曲线.
        if (this.isPause) {
            this._virtualStartTime = Date.now() - this._lastStopTime;
            this.isDone = false;

            this._lastStopTime = null;
            this.onContinue.invoke();
        }

        return this;
    }

    public to(dist: T,
              duration: number = undefined,
              easingOrBezier: EasingFunction | CubicBezierBase = undefined,
              isLazy: boolean = undefined,
              isSmooth: boolean = true): this {
        if (this._isBroken) return;
        if (this.isPause) this.continue();

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
                    this._setter(dist);
                    return this;
                }

                this._duration = duration || this._fixedDuration;
                this.regenerateEasingListDefault(dist);
            } else {
                if (isLazy === undefined) {
                    isLazy = this.isLazy;
                }
                if (isLazy && !this.isOverMinVibrationThreshold(this._endValue, dist)) {
                    this._endValue = dist;
                    return this;
                }

                const newDuration = duration || this._fixedDuration;

                if (isSmooth ?? this._isSmooth) {
                    this.regenerateEasingList(currentValue,
                        dist,
                        this._startValue,
                        this._endValue,
                        targetEasing,
                        newDuration);
                } else {
                    this.regenerateEasingListDefault(dist);
                }

                this._duration = newDuration;
            }

            this._virtualStartTime = current;
            this._startValue = currentValue;
            this._endValue = dist;
            this._lastUpdateTime = current;
            this.isDone = false;
        } else {
            this._toCacheId = mw.setTimeout(() => {
                this.to(
                    dist,
                    duration,
                    easingOrBezier,
                    isLazy,
                    isSmooth,
                );
            }, this._duration * this.sensitivityRatio);
        }

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event

    public onDone: SimpleDelegate<boolean> = new SimpleDelegate<boolean>();

    public onDestroy: SimpleDelegate<void> = new SimpleDelegate<void>();

    public onPause: SimpleDelegate<void> = new SimpleDelegate<void>();

    public onContinue: SimpleDelegate<void> = new SimpleDelegate<void>();

    public onRestart: SimpleDelegate<void> = new SimpleDelegate<void>();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private regenerateEasingList(currValue: T,
                                 dist: T,
                                 originStart: T,
                                 originDist: T,
                                 targetEasing: EasingFunction | CubicBezierBase,
                                 newDuration: number,
                                 index: number = 0): number {
        if (TweenDataUtil.isObject(currValue)) {
            const keys = Object.keys(currValue);
            for (const element of keys) {
                const key = element;
                index = this.regenerateEasingList(
                    currValue[key],
                    dist[key],
                    originStart[key],
                    originDist[key],
                    targetEasing,
                    newDuration,
                    index);
            }
        } else if (TweenDataUtil.isNumber(currValue) && targetEasing instanceof CubicBezierBase) {
            const isReg = Math.abs(dist as number - currValue) < 1e-6;
            const scaleX1 = this._duration / newDuration;
            const scaleY1 = isReg ?
                1 :
                ((originDist as number) - (originStart as number)) / (dist as number - currValue);

            this._currEasingFuncList[index] = Easing.smoothBezier(
                this._currEasingFuncList[index],
                isReg ? undefined : targetEasing,
                this.elapsed,
                scaleX1,
                scaleY1,
                undefined,
                undefined,
                isReg,
            );

            ++index;
        } else {
            this._currEasingFuncList[index] = targetEasing;
            ++index;
        }

        return index;
    }

    private regenerateEasingListDefault(value: T, easingFunction: CubicBezierBase | EasingFunction = undefined, index = 0): number {
        if (index === 0 && this._defaultEasingLength !== null) {
            this._currEasingFuncList.length = this._defaultEasingLength;
            if (easingFunction === undefined) easingFunction = this._waterEasing;
            for (let i = 0; i < this._defaultEasingLength; i++) {
                this._currEasingFuncList[i] = easingFunction;
            }
        } else {
            if (TweenDataUtil.isObject(value)) {
                Object.keys(value).forEach((key) => {
                    index = this.regenerateEasingListDefault(value[key], easingFunction, index);
                });
            } else {
                this._currEasingFuncList[index] = easingFunction ?? this._waterEasing;
                ++index;
            }

            this._defaultEasingLength = index;
        }
        return index;
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

            for (const element of keys) {
                const key = element;
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
                    TweenDataUtil.marshalDataTween(this._startValue, this._endValue, this.easingList, this._lastElapsed));
            }
        } catch (e) {
            console.error(`tween task crashed while setter is called. it will be autoDestroy. ${e}`);
            this.isDone = true;
            this._isBroken = true;
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