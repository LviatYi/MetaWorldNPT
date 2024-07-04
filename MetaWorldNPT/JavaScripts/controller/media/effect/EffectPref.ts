import { IEffectLike } from "./IEffectLike";
import { IAssetEffectOption } from "./IEffectOption";
import Log4Ts from "mw-log4ts/Log4Ts";
import { queryEffectLength } from "../MediaService";
import { DefaultEffectLength } from "../base/Constant";
import Gtk from "gtoolkit";

/**
 * 由 Prefab 构成的 粒子特效组合.
 */
export class EffectPref implements IEffectLike {
    private _effects: IEffectLike[];

    public option: IAssetEffectOption;

    public get parent(): mw.GameObject | undefined {
        return this.root.parent;
    }

    public set parent(obj: mw.GameObject | undefined) {
        this.root.parent = obj as mw.GameObject;
    }

    public get worldTransform() {
        return this.root.worldTransform;
    }

    public set worldTransform(transform: mw.Transform) {
        this.root.worldTransform = transform;
    }

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

    public get effect(): any {
        Log4Ts.warn(EffectPref, `pause is not supported.`);
        return undefined;
    }

    private get perLength(): number {
        return queryEffectLength(this.option.assetId) ?? DefaultEffectLength;
    }

    public setColor(parameterName: string, value: mw.LinearColor): void {
        Log4Ts.warn(EffectPref, `setColor is not support for EffectPref`);
    }

    public setColorRandom(parameterName: string, maxValue: mw.LinearColor, minValue: mw.LinearColor): void {
        Log4Ts.warn(EffectPref, `setColorRandom is not support for EffectPref`);
    }

    public setCullDistance(inCullDistance: number): void {
        Log4Ts.warn(EffectPref, `setCullDistance is not support for EffectPref`);
    }

    public setFloat(parameterName: string, value: number): void {
        Log4Ts.warn(EffectPref, `setFloat is not support for EffectPref`);
    }

    public setFloatRandom(parameterName: string, maxValue: number, minValue: number): void {
        Log4Ts.warn(EffectPref, `setFloatRandom is not support for EffectPref`);
    }

    public setVector(parameterName: string, value: mw.Vector): void {
        Log4Ts.warn(EffectPref, `setVector is not support for EffectPref`);
    }

    public setVectorRandom(parameterName: string, maxValue: mw.Vector, minValue: mw.Vector): void {
        Log4Ts.warn(EffectPref, `setVectorRandom is not support for EffectPref`);
    }

    private _startTime: number | undefined;

    private _singlePlayTimer: number | undefined;

    private _destroyed: boolean = false;

    private _lastLoop: number = 0;

    constructor(option: IAssetEffectOption,
                public root: mw.GameObject,
                public loop: boolean,
                position: mw.Vector | undefined,
                parent: mw.GameObject | undefined) {
        if (!mw.SystemUtil.isClient()) {
            Log4Ts.error(EffectPref, `could be created only in Client.`);
        }
        this.option = option;
        if (position) this.worldTransform.position = position;
        this.parent = parent;
        this._effects = Gtk.getChildren(this.root)
            .filter(item => item instanceof mw.Effect) as unknown as IEffectLike[];
    }

    play(): void {
        if (this._destroyed) return;
        if (!this.loop) this._lastLoop = this.loopCount;

        this.playHandler();
    }

    stop(): void {
        if (this._destroyed ||
            this._startTime === undefined) return;

        this._startTime = undefined;
        this.clearWatchTimer();

        for (const e of this._effects) e?.stop();
    }

    destroy(): void {
        if (this._destroyed) return;
        this.clearWatchTimer();
        this.onFinish.clear();

        for (const e of this._effects) e?.destroy();

        this._destroyed = true;
    }

    public onFinish: mw.MulticastDelegate<() => void> = new mw.MulticastDelegate();

    public playHandler(): void {
        if (!this.loop && this._lastLoop > 0) --this._lastLoop;
        this._startTime = Date.now();
        this.refreshWatchTimer(0);

        for (const e of this._effects) e?.play();
    }

    private refreshWatchTimer(startAt: number) {
        this.clearWatchTimer();

        if (this.loop) {
            if (this.duration === 0) return;
        } else {
            if (this.loopCount === 0) return;
        }

        this._singlePlayTimer = mw.setTimeout(() => {
                this._singlePlayTimer = undefined;

                if (!this.loop && this._lastLoop > 0) {
                    this.playHandler();
                } else {
                    this.stop();
                    this.onFinish.broadcast();
                }
            },
            this.loop ?
                this.duration - startAt :
                (this.perLength * this.loopCount) - startAt,
        );
    }

    private clearWatchTimer() {
        if (this._singlePlayTimer !== undefined) mw.clearTimeout(this._singlePlayTimer);
    }
}