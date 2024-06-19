import { Delegate, Getter, Setter } from "gtoolkit";
import { dataTween } from "./Base";
import Easing, { EasingFunction } from "./Easing";

/**
 * FlowTweenTask
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
export class FlowTweenTask {
    public static flow(
        getter: Getter<number>,
        setter: Setter<number>,
        duration: number,
        easing: EasingFunction,
    ): FlowTweenTask {
        return new FlowTweenTask(getter,
            setter,
            duration,
            easing);
    }

    public constructor(
        private _getter: Getter<number>,
        private _setter: Setter<number>,
        private _duration: number,
        private _easing: EasingFunction = Easing.linear,
    ) {
        mw.TimeUtil.onEnterFrame.add(this._handler);
    }

    private _startValue: number;

    private _endValue: number;

    private _lastPauseTime: number;

    private _startTime: number;

    private _currentDuration: number;

    public to(dist: number, duration?: number) {
        this._currentDuration = duration;

        this._startValue = this._getter();
        this._endValue = dist;
        this._lastPauseTime = undefined;
        this._startTime = Date.now();
    }

    public pause() {
        this._lastPauseTime = Date.now();
    }

    public continue() {
        if (this._lastPauseTime === undefined) return;

        this._lastPauseTime = undefined;
        this._startTime += Date.now() - this._lastPauseTime;
    }

    public destroy() {
        mw.TimeUtil.onEnterFrame.remove(this._handler);
    }

    private _handler = () => {
        if (this._lastPauseTime !== undefined || this._endValue === undefined) return;
        let now = Date.now();
        let progress = (now - this._startTime) / (this._currentDuration ?? this._duration);
        if (progress > 1) {
            this._setter(this._endValue);
            this._endValue = undefined;
            this._currentDuration = undefined;
            this.onDone.invoke();
            return;
        }

        this._setter(dataTween(this._startValue, this._endValue, this._easing(progress)));
    };

    public onDone: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();
}