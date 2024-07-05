import { IAssetEffectOption } from "./IEffectOption";
import { FakeTransform } from "../base/FakeTransform";
import { queryEffectLength, queryEffectLoop } from "../MediaService";
import { FakeUeEffect } from "../base/FakeCascadeParticleSystemComponent";
import { DefaultEffectLength } from "../base/Constant";
import Log4Ts from "mw-log4ts";
import { IEffectLike } from "./IEffectLike";

/**
 * Blur 残影.
 * @desc 虚假的 粒子特效，但拥有等价于 {@link mw.Effect} 的播报能力.
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
export class Blur implements IEffectLike {
    public option: IAssetEffectOption;

    public parent: mw.GameObject | undefined;

    public localTransform: { position: mw.Vector | undefined };

    public worldTransform: { position: mw.Vector | undefined };

    public set loopCount(_) {
        return;
    }

    public get loopCount(): number {
        return this.option.loopCountOrDuration ?? 1;
    }

    public set duration(_) {
        return;
    }

    public get duration(): number {
        return this.option.loopCountOrDuration ?? 0;
    }

    public effect = new FakeUeEffect(() => {
        if (this._destroyed ||
            this._startTime === undefined) return;

        if (this.effect.CascadeParticleSystemComponent.CustomTimeDilation === 0) {
            if (this._lastPauseTime !== undefined) return;

            this._lastPauseTime = Date.now();
            this.clearWatchTimer();
        } else {
            if (this._lastPauseTime === undefined) return;

            this.refreshWatchTimer(this._lastPauseTime - this._startTime);
            this._startTime += Date.now() - this._lastPauseTime;
        }
    });

    public get loop(): boolean {
        return queryEffectLoop(this.option.assetId);
    }

    private get perLength(): number {
        return queryEffectLength(this.option.assetId) ?? DefaultEffectLength;
    }

    public setColor(parameterName: string, value: mw.LinearColor): void {
    }

    public setColorRandom(parameterName: string, maxValue: mw.LinearColor, minValue: mw.LinearColor): void {
    }

    public setCullDistance(inCullDistance: number): void {
    }

    public setFloat(parameterName: string, value: number): void {
    }

    public setFloatRandom(parameterName: string, maxValue: number, minValue: number): void {
    }

    public setVector(parameterName: string, value: mw.Vector): void {
    }

    public setVectorRandom(parameterName: string, maxValue: mw.Vector, minValue: mw.Vector): void {
    }

    private _startTime: number | undefined;

    private _lastPauseTime: number | undefined;

    private _fakePlayTimer: number | undefined;

    private _destroyed: boolean = false;

    constructor(option: IAssetEffectOption,
                position: mw.Vector | undefined,
                parent: mw.GameObject | undefined) {
        if (!mw.SystemUtil.isClient()) Log4Ts.error(Blur, `could be created only in Client.`);

        this.option = option;
        this.localTransform = new FakeTransform(position);
        this.worldTransform = new FakeTransform(position, parent);
        this.parent = parent;
    }

    play(): void {
        if (this._destroyed) return;
        this._startTime = Date.now();
        this.refreshWatchTimer(0);
    }

    stop(): void {
        if (this._destroyed ||
            this._startTime === undefined) return;

        this._startTime = undefined;
        this.clearWatchTimer();
    }

    destroy(): void {
        if (this._destroyed) return;
        this.clearWatchTimer();
        this.onFinish.clear();
        this._destroyed = true;
    }

    public onFinish: mw.MulticastDelegate<() => void> = new mw.MulticastDelegate();

    private refreshWatchTimer(startAt: number) {
        this.clearWatchTimer();

        if (this.loop) {
            if (this.duration === 0) return;
        } else {
            if (this.loopCount === 0) return;
        }

        this._fakePlayTimer = mw.setTimeout(() => {
                this.onFinish.broadcast();
                this._fakePlayTimer = undefined;
            },
            this.loop ?
                this.duration - startAt :
                (this.perLength * this.loopCount) - startAt,
        );
    }

    private clearWatchTimer() {
        if (this._fakePlayTimer !== undefined) mw.clearTimeout(this._fakePlayTimer);
    }
}