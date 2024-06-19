import { Delegate, Getter, Setter } from "gtoolkit";
import { dataTween } from "./Base";
import Easing, { EasingFunction } from "./Easing";

/**
 * AdvanceTweenTask
 * Inspired By Waterween.
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
export class AdvancedTweenTask {
    public static to(
        getter: Getter<number>,
        setter: Setter<number>,
        dist: number,
        duration: number,
        forceStartVal: number,
        easing: EasingFunction,
    ): AdvancedTweenTask {
        return new AdvancedTweenTask(getter,
            setter,
            dist,
            duration,
            forceStartVal,
            easing);
    }

    public constructor(
        private _getter: Getter<number>,
        private _setter: Setter<number>,
        private _endVal: number,
        private _duration: number,
        private _forceStartVal?: number,
        private _easing: EasingFunction = Easing.linear) {
        if (this._forceStartVal === undefined) this._forceStartVal = this._getter();
        this._startVal = this._forceStartVal;
        mw.TimeUtil.onEnterFrame.add(this._handler);
    }

    private _lastPauseTime: number;

    public _startTime: number;

    private _startVal: number;

    private _running: boolean;

    public restart(pause: boolean = false) {
        this._running = true;
        this._startVal = this._forceStartVal;
        this._startTime = Date.now();
        this._lastPauseTime = undefined;
        this._setter(this._startVal);
        if (pause) this.pause();
    }

    public pause() {
        this._lastPauseTime = Date.now();
    }

    public fastForwardToEnd(): this {
        this._setter(this._endVal);
        this.onDone.invoke();
        this._running = false;

        return this;
    }

    public continue() {
        if (!this._running) return;
        if (this._lastPauseTime === undefined) return;

        mw.TimeUtil.onEnterFrame.add(this._handler);
        this._startTime += Date.now() - this._lastPauseTime;
        this._lastPauseTime = undefined;
    }

    public destroy() {
        mw.TimeUtil.onEnterFrame.remove(this._handler);
    }

    public onDone: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    private _handler = () => {
        if (!this._running || this._lastPauseTime !== undefined) return;

        let now = Date.now();
        let progress = (now - this._startTime) / this._duration;
        if (progress > 1) {
            this._setter(this._endVal);
            this.onDone.invoke();
            this._running = false;
            return;
        }

        this._setter(
            dataTween(this._startVal,
                this._endVal,
                this._easing(progress)));
    };
}