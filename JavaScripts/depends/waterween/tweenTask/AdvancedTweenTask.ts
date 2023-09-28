import {RecursivePartial} from "../RecursivePartial";
import {Getter} from "../../accessor/Getter";
import {Setter} from "../../accessor/Setter";
import Easing, {EasingFunction} from "../../easing/Easing";
import MultiDelegate from "../../delegate/MultiDelegate";
import TweenTaskBase from "./TweenTaskBase";
import TweenDataUtil from "../dateUtil/TweenDataUtil";
import IAdvancedTweenTask from "./IAdvancedTweenTask";

/**
 * Advanced Tween Task.
 * A task that describes how a tween works.
 *
 * Tips: Tween Task is energetic, it means that if `pause` is optional, it always defaults to false.
 * Tips: Tween Task is cautious, it means that it is always trying to reset the animation curve.
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
export class AdvancedTweenTask<T> extends TweenTaskBase<T> implements IAdvancedTweenTask<T> {

    /**
     * 虚拟开始时间戳.
     * @private
     */
    private _virtualStartTime: number;

    /**
     * 上次暂停时间戳.
     * @private
     */
    private _lastStopTime?: number = null;

    private readonly _duration: number;

    private readonly _startValue: T;

    private readonly _endValue: RecursivePartial<T>;

    /**
     * 󰐊正放 时的虚拟 startValue.
     * 用于重校对 curves.
     * @private
     */
    private _forwardStartVal: T;

    /**
     * 插值函数.
     * @private
     */
    private _easingFunc: EasingFunction;

    /**
     * 结束时自动销毁.
     */
    public isAutoDestroy: boolean = false;

    /**
     * 是否 重复 播放.
     *      重复 播放指结束时自动 重置 并 󰐊播放.
     * @private
     */
    private _isRepeat: boolean = false;

    /**
     * 是否 󱞳往复 播放.
     *      󱞳往复 播放指结束时自动 󰓕倒放 至开头.
     *      并不意味着 󰓕倒放 完成后会继续 󰐊播放. 这种行为仍需要 {@link _isRepeat} 参与.
     * @private
     */
    private _isPingPong: boolean = false;

    /**
     * 󰓕倒放 位移量.
     * @private
     */
    private _backwardStartVal?: T = null;

    constructor(getter: Getter<T>,
                setter: Setter<T>,
                dist: RecursivePartial<T>,
                duration: number,
                forceStartValue: RecursivePartial<T> = null,
                easing: EasingFunction = Easing.linear,
                isRepeat: boolean = false,
                isPingPong: boolean = false,
                twoPhaseTweenBorder: number = TweenTaskBase.DEFAULT_TWO_PHASE_TWEEN_BORDER) {
        const startTime = Date.now();
        super(
            getter,
            setter,
            startTime,
            twoPhaseTweenBorder);
        this._virtualStartTime = startTime;
        this._duration = duration;
        let startVal: T = null;
        if (forceStartValue !== undefined && forceStartValue !== null) {
            if (TweenDataUtil.isPrimitiveType(forceStartValue)) {
                startVal = forceStartValue as unknown as T;
            } else {
                startVal = {...getter(), ...forceStartValue};
            }
        }
        this._startValue = startVal ?? getter();
        this._forwardStartVal = this._startValue;
        this._endValue = dist;
        this._easingFunc = easing;
        this._isRepeat = isRepeat;
        this._isPingPong = isPingPong;
    }

    public get twoPhaseTweenBorder(): number {
        return this._twoPhaseTweenBorder;
    }

    public get isPause(): boolean {
        return this._lastStopTime !== null;
    }

    public get isBackward(): boolean {
        return this._backwardStartVal !== null;
    }

    public get isRepeat(): boolean {
        return this._isRepeat;
    }

    public get isPingPong(): boolean {
        return this._isPingPong;
    }

    public get elapsed(): number {
        return (Date.now() - this._virtualStartTime) / this._duration;
    }

    public set elapsed(value: number) {
        this._virtualStartTime = Date.now() - (this.isPause ? this._lastStopTime : 0) - this._duration * (Math.max(Math.min(value, 1), 0));
    }

//region Tween Action

    public easing(easingFunc: EasingFunction) {
        this._easingFunc = easingFunc;
    }

    public pause(): AdvancedTweenTask<T> {
        this._lastStopTime = Date.now();
        this.onPause.invoke();

        return this;
    }

    public continue(recurve: boolean = true): AdvancedTweenTask<T> {
        if (this.isPause) {
            this._virtualStartTime += Date.now() - this._lastStopTime;
        }

        this.isDone = false;
        this.recurve(recurve);

        this._lastStopTime = null;
        this.onContinue.invoke();

        return this;
    }

    public restart(pause: boolean = false): AdvancedTweenTask<T> {
        this._setter(this._startValue);
        this._forwardStartVal = this._startValue;
        this._backwardStartVal = null;
        this._virtualStartTime = Date.now();
        this._lastStopTime = null;
        if (pause) {
            this.pause();
        } else {
            this.continue();
        }

        this.onRestart.invoke();

        return this;
    }

    public fastForwardToEnd(): AdvancedTweenTask<T> {
        this._virtualStartTime = 0;

        return this;
    }

    public backward(recurve: boolean = true, pause: boolean = false): AdvancedTweenTask<T> {
        this._backwardStartVal = this._getter();

        if (pause) {
            this.pause();
            this.recurve(recurve);
        } else {
            this.continue(recurve);
        }

        return this;
    }

    public forward(recurve: boolean = true, pause: boolean = false): AdvancedTweenTask<T> {
        this._backwardStartVal = null;
        this._forwardStartVal = this._getter();

        if (pause) {
            this.pause();
            this.recurve(recurve);
        } else {
            this.continue(recurve);
        }

        return this;
    }

    public repeat(repeat: boolean = true): AdvancedTweenTask<T> {
        this._isRepeat = repeat;

        return this;
    }

    public pingPong(pingPong: boolean = true, repeat: boolean = true): AdvancedTweenTask<T> {
        this._isPingPong = pingPong;
        this.repeat(repeat);

        return this;
    }

    /**
     * 设置 󰩺自动销毁.
     * @param auto
     * @public
     */
    public autoDestroy(auto: boolean = false): AdvancedTweenTask<T> {
        this.isAutoDestroy = auto;
        return this;
    }

    /**
     * 重设 动画曲线.
     * @param recurve 是否重设.
     */
    private recurve(recurve: boolean = true): AdvancedTweenTask<T> {
        if (!recurve) {
            return;
        }
        if (this.isBackward) {
            this._backwardStartVal = this._getter();
        } else {
            this._forwardStartVal = this._getter();
        }

        this._virtualStartTime = Date.now();
        if (this.isPause) {
            this._lastStopTime = Date.now();
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

    public call(now: number = undefined, isTimestamp: boolean = true): AdvancedTweenTask<T> {
        if (this.isDone || this.isPause) {
            return this;
        }

        let elapsed: number;
        if (now !== undefined) {
            if (!isTimestamp) {
                elapsed = now;
            } else {
                elapsed = (now - this._virtualStartTime) / this._duration;
            }
        } else {
            elapsed = this.elapsed;
        }

        try {
            if (this._endValue !== null && this._endValue !== undefined) {
                if (this.isBackward) {
                    this._setter(TweenDataUtil.dataHeal(
                        TweenDataUtil.partialDataTween(this._backwardStartVal, this._startValue, this._easingFunc(elapsed),
                            this.twoPhaseTweenBorder),
                        this._getter));
                } else {
                    this._setter(TweenDataUtil.dataHeal(
                        TweenDataUtil.partialDataTween(this._forwardStartVal, this._endValue, this._easingFunc(elapsed),
                            this.twoPhaseTweenBorder),
                        this._getter));
                }
            } else {
                console.error(`endValue is invalid`);
            }
        } catch (e) {
            console.error("tween task crashed while setter is called. it will be autoDestroy");
            this.isDone = true;
            this.fastForwardToEnd();
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
}