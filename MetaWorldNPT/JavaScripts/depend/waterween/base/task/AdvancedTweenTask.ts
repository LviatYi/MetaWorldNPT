import { RecursivePartial } from "../../date-util/RecursivePartial";
import { EasingFunction } from "../../easing/Easing";
import { logESetterCrashed, TweenTaskBase } from "./TweenTaskBase";
import { DataTweenFunction, TweenDataUtil } from "../../date-util/TweenDataUtil";
import { IAdvancedTweenTask } from "../interface/IAdvancedTweenTask";
import { Getter, Setter } from "gtoolkit";

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
export class AdvancedTweenTask<T>
    extends TweenTaskBase<T>
    implements IAdvancedTweenTask {
    private readonly _startValue: T;

    private readonly _endValue: RecursivePartial<T>;

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
     * 是否 任务正 󰐊正放.
     */
    private _isForward: boolean = true;

    /**
     * 上次重绘曲线 Easing 值.
     * @desc 影响实际的曲线计算.
     * @private
     */
    private _lastRecurveFE: number = 0;

    /**
     * 自定义数据插值函数.
     * @private
     */
    private _customDataTween: (start: T, end: T, t: number) => T = undefined;

    private _boardCache: object = undefined;

    public get isDone(): boolean {
        return this.isForward ?
            this._elapsedTime >= this._duration :
            this._elapsedTime <= 0;
    }

    public get isForward(): boolean {
        return this._isForward;
    }

    public get isRepeat(): boolean {
        return this._isRepeat;
    }

    public get isPingPong(): boolean {
        return this._isPingPong;
    }

    constructor(getter: Getter<T>,
                setter: Setter<T>,
                dist: RecursivePartial<T>,
                duration: number,
                forceStartValue: RecursivePartial<T>,
                easing: EasingFunction,
                isRepeat: boolean,
                isPingPong: boolean,
                twoPhaseTweenBorder: number,
                dataTweenFunction: DataTweenFunction<T>,
                isFullAsT: boolean) {
        super(getter,
            setter,
            duration,
            easing,
            twoPhaseTweenBorder,
        );
        let startVal: T = undefined;
        if (!TweenDataUtil.isNullOrUndefined(forceStartValue)) {
            if (isFullAsT) {
                startVal = forceStartValue as T;
            } else {
                startVal = TweenDataUtil.dataHeal(forceStartValue, this._getter());
            }
        }
        this._startValue = startVal ?? this._getter();
        this._endValue = dist;
        this._isRepeat = isRepeat;
        this._isPingPong = isPingPong;
        this._customDataTween = dataTweenFunction;
    }

//#region Tween Action

    public continue(recurve: boolean = true): this {
        if (this.isDone) return this;
        if (!this.isPause && !recurve) return this;

        if (this.isPause) this._isPause = false;
        if (recurve) this.recurve(this.isForward);

        this.onContinue.invoke();

        return this;
    }

    public restart(pause: boolean = false): this {
        if (this.isForward &&
            this._elapsedTime === 0 &&
            this.isPause === pause) return this;

        this._elapsedTime = 0;
        this._isForward = true;
        this._lastRecurveFE = 0;
        this._setter(this._startValue);

        this.onRestart.invoke();

        if (pause) this.pause();
        else this.continue(false);

        return this;
    }

    public forward(recurve: boolean = true, pause: boolean = false): this {
        if (this.isForward && (this.isDone || !recurve)) return this;
        if (!this.isForward) recurve = true;

        if (pause) {
            this.pause();
            recurve && this.recurve(true);
        } else {
            this.continue(false);
            recurve && this.recurve(true);
        }

        return this;
    }

    public backward(recurve: boolean = true, pause: boolean = false): this {
        if (!this.isForward && (this.isDone || !recurve)) return this;
        if (this.isForward) recurve = true;

        if (pause) {
            this.pause();
            recurve && this.recurve(false);
        } else {
            this.continue(false);
            recurve && this.recurve(false);
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

    public fastForwardToEnd(): this {
        this.continue(false);
        this._elapsedTime = this._duration;
        this._isForward = true;
        this._lastRecurveFE = 0;
        this.call(0);

        return this;
    }

    /**
     * 重设 动画曲线.
     */
    private recurve(turnToForward: boolean): this {
        this._lastRecurveFE = this.calAdvancedT(this.isForward);
        this._isForward = turnToForward;
        this._elapsedTime = turnToForward ? 0 : this._duration;

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private calAdvancedT(isForward?: boolean): number {
        if (isForward === undefined) isForward = this.isForward;

        if (isForward) {
            return this.easingFunc(this.elapsed) * (1 - this._lastRecurveFE) + this._lastRecurveFE;
        } else {
            return this.easingFunc(this.elapsed) * this._lastRecurveFE;
        }
    }

    public call(dtOrElapsed: number, isDt: boolean = true): this {
        if (dtOrElapsed > 0 &&
            (this.isDone || this.isPause)) return this;

        if (isDt) {
            if (this.isForward) this._elapsedTime =
                Math.min(this._elapsedTime + dtOrElapsed, this._duration);
            else this._elapsedTime =
                Math.max(this._elapsedTime - dtOrElapsed, 0);

            try {
                if (!TweenDataUtil.isNullOrUndefined(this._endValue)) {
                    this._setter(
                        this._customDataTween ?
                            this._customDataTween(this._startValue,
                                this._endValue as T,
                                this.calAdvancedT()) :
                            TweenDataUtil.dataHealWithCriterion(TweenDataUtil.partialDataTween(
                                    this._startValue,
                                    this._endValue,
                                    this.calAdvancedT(),
                                    this.twoPhaseTweenBorder,
                                    this._boardCache),
                                this._getter,
                                this._startValue),
                    );
                }

                if (this.isForward && this._elapsedTime >= this._duration ||
                    !this.isForward && this._elapsedTime <= 0) {
                    if (this._isPingPong && this.isForward) this.backward(true, false);
                    else if (this._isRepeat) this.restart(false);
                    else this._lastRecurveFE = 0;

                    this.onDone.invoke(this.isForward);
                    if (this.isAutoDestroy) this.destroy();
                }
            } catch (e) {
                logESetterCrashed(e);
                this._lastRecurveFE = 0;
                this._elapsedTime = this._duration;
                this.destroy();
            }
        } else {
            this._lastRecurveFE = 0;
            this.elapsed = dtOrElapsed;
        }

        return this;
    }
}