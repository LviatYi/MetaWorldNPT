import {RecursivePartial} from "../RecursivePartial";
import {EasingFunction} from "../../easing/Easing";
import TweenTaskBase from "./TweenTaskBase";
import TweenDataUtil, {DataTweenFunction} from "../dateUtil/TweenDataUtil";
import IAdvancedTweenTask from "./IAdvancedTweenTask";
import {Getter, Setter} from "../../../util/GToolkit";

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
export class AdvancedTweenTask<T> extends TweenTaskBase<T> implements IAdvancedTweenTask {
    private readonly _startValue: T;

    private readonly _endValue: RecursivePartial<T>;

    /**
     * 󰐊正放 时的虚拟 startValue.
     * 用于重校对 curves.
     * @private
     */
    private _forwardStartVal: T;

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

    /**
     * 自定义数据插值函数.
     * @private
     */
    private _customDataTween: (start: T, end: T, t: number) => T = null;

    private _boardCache: object = undefined;

    private _restartFlag: boolean = true;

    constructor(getter: Getter<T>,
                setter: Setter<T>,
                dist: RecursivePartial<T>,
                duration: number,
                forceStartValue: RecursivePartial<T> = null,
                easing: EasingFunction = undefined,
                isRepeat: boolean = false,
                isPingPong: boolean = false,
                now: number = undefined,
                twoPhaseTweenBorder: number = undefined,
                dataTweenFunction: DataTweenFunction<T> = null,
                isFullAsT: boolean = false) {
        super(
            getter,
            setter,
            duration,
            easing,
            now,
            twoPhaseTweenBorder,
        );
        this._virtualStartTime = this._createTime;
        let startVal: T = null;
        if (!TweenDataUtil.isNullOrUndefined(forceStartValue)) {
            if (isFullAsT) {
                startVal = forceStartValue as T;
            } else {
                startVal = TweenDataUtil.dataOverride(forceStartValue, this._getter());
            }
        }
        this._startValue = startVal ?? this._getter();
        this._forwardStartVal = this._startValue;
        this._endValue = dist;
        this._isRepeat = isRepeat;
        this._isPingPong = isPingPong;
        this._customDataTween = dataTweenFunction;
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

//#region Tween Action

    public continue(recurve: boolean = true): this {
        if (this.isPause || recurve) {
            if (this.isPause) {
                this._virtualStartTime += Date.now() - this._lastStopTime;
            }
            this.isDone = false;
            if (recurve) this.recurve();

            this._lastStopTime = null;
            this.onContinue.invoke();
        }

        return this;
    }

    public restart(pause: boolean = false): this {
        if (!this._restartFlag) {
            this._setter(this._startValue);
            this._restartFlag = true;
        }
        this._forwardStartVal = this._startValue;
        this._backwardStartVal = null;
        this._virtualStartTime = Date.now();
        this._lastStopTime = null;
        if (pause) {
            this.pause();
        } else {
            this.continue(false);
        }

        this.onRestart.invoke();

        return this;
    }

    public backward(recurve: boolean = true, pause: boolean = false): this {
        this._backwardStartVal = this._getter();

        if (pause) {
            this.pause();
            if (recurve) this.recurve();
        } else {
            this.continue(recurve);
        }

        return this;
    }

    public forward(recurve: boolean = true, pause: boolean = false): this {
        this._backwardStartVal = null;
        this._forwardStartVal = this._getter();

        if (pause) {
            this.pause();
            if (recurve) this.recurve();
        } else {
            this.continue(recurve);
        }

        return this;
    }

    public repeat(repeat: boolean = true): this {
        this._isRepeat = repeat;

        return this;
    }

    public pingPong(pingPong: boolean = true, repeat: boolean = true): this {
        this._isPingPong = pingPong;
        this.repeat(repeat);

        return this;
    }

    /**
     * 重设 动画曲线.
     */
    private recurve(): this {
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

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public call(now: number = undefined, isTimestamp: boolean = true): this {
        if (this.isDone || this.isPause) {
            return this;
        }

        console.log(`get now: ${now}`);
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
            this._restartFlag = false;
            if (this._endValue !== null && this._endValue !== undefined) {
                const lhs = this.isBackward ? this._backwardStartVal : this._forwardStartVal;
                const rhs = this.isBackward ? this._startValue : this._endValue;
                this._setter(
                    this._customDataTween ?
                        this._customDataTween(lhs, rhs as T, this.easingFunc(elapsed)) :
                        TweenDataUtil.dataHeal(
                            TweenDataUtil.partialDataTween(
                                lhs,
                                rhs,
                                this.easingFunc(elapsed),
                                this.twoPhaseTweenBorder,
                                this._boardCache),
                            this._getter,
                            this._startValue),
                );
            }
        } catch (e) {
            console.error(`tween task crashed while setter is called. it will be autoDestroy. ${e}`);
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