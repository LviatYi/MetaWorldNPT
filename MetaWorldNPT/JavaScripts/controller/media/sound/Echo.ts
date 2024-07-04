import { ISoundOption } from "./ISoundOption";
import { querySoundLength } from "../MediaService";
import { MwSoundPlayStatePaused, MwSoundPlayStatePlaying, MwSoundPlayStateStopped } from "../base/SoundPlayState";
import Log4Ts from "mw-log4ts";
import { FakeTransform } from "../base/FakeTransform";
import { ISoundLike } from "./ISoundLike";

/**
 * Echo 回声.
 * @desc 虚假的 声效，但拥有等价于 {@link mw.Sound} 的播报能力.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class Echo implements ISoundLike {
    public option: ISoundOption;

    public parent: mw.GameObject | undefined;

    public worldTransform: { position: mw.Vector | undefined };

    public get playState(): SoundPlayState {
        if (!this._lastPauseTime === undefined) return MwSoundPlayStatePaused;
        if (!this._startTime === undefined) return MwSoundPlayStatePlaying;
        return MwSoundPlayStateStopped;
    }

    public get timeLength(): number | undefined {
        return querySoundLength(this.option.assetId);
    }

    /**
     * 当前播放位置.
     * @desc 总时间将考虑循环次数.
     * @return {number}
     */
    public get timeAt(): number {
        if (this._startTime === undefined) return 0;
        return ((this._lastPauseTime ?? Date.now()) - this._startTime);
    }

    public get isLoop(): boolean {
        return (this.option.loopCount ?? 1) <= 0;
    }

    private _startTime: number | undefined;

    private _lastPauseTime: number | undefined;

    private _fakePlayTimer: number | undefined;

    private _destroyed: boolean = false;

    constructor(option: ISoundOption,
                position: mw.Vector | undefined,
                parent: mw.GameObject | undefined) {
        if (!mw.SystemUtil.isClient()) {
            Log4Ts.error(Echo, `could be created only in Client.`);
        }
        this.option = option;
        this.worldTransform = new FakeTransform(position, parent);
        this.parent = parent;
    }

    play(startAt?: number): void {
        if (this._destroyed) return;
        this._startTime = Date.now() - (startAt ?? 0);
        if (!this.isLoop) this.refreshWatchTimer(startAt ?? 0);

        this.onPlay.broadcast();
    }

    stop(): void {
        if (this._destroyed ||
            this._startTime === undefined) return;

        this._startTime = undefined;
        this.clearWatchTimer();
    }

    pause(bPause?: boolean): void {
        if (this._destroyed ||
            this._startTime === undefined) return;

        if (bPause) {
            if (this._lastPauseTime !== undefined) return;

            this._lastPauseTime = Date.now();
            this.clearWatchTimer();
            this.onPause.broadcast();
        } else {
            if (this._lastPauseTime === undefined) return;

            this.refreshWatchTimer(this._lastPauseTime - this._startTime);
            this._startTime += Date.now() - this._lastPauseTime;
        }
    }

    destroy(): void {
        if (this._destroyed) return;
        this.clearWatchTimer();
        this.onPlay.clear();
        this.onPause.clear();
        this.onFinish.clear();
        this._destroyed = true;
    }

    public onFinish: mw.MulticastDelegate<() => void> = new mw.MulticastDelegate();

    public onPlay: mw.MulticastDelegate<() => void> = new mw.MulticastDelegate();

    public onPause: mw.MulticastDelegate<() => void> = new mw.MulticastDelegate();

    private refreshWatchTimer(startAt: number) {
        this.clearWatchTimer();

        this._fakePlayTimer = mw.setTimeout(() => {
                this.onFinish.broadcast();
                this._fakePlayTimer = undefined;
            },
            (this.timeLength ?? 1) - startAt);
    }

    private clearWatchTimer() {
        if (this._fakePlayTimer !== undefined) mw.clearTimeout(this._fakePlayTimer);
    }
}