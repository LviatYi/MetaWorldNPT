import Gtk, { RevisedInterval } from "gtoolkit";
import { applyEffectOptionToEffect, applyEffectOptionToGo, IAssetEffectOption, IEffectOption } from "./IEffectOption";
import { AMediaProxy } from "../base/AMediaProxy";
import { queryEffectLength, recordEffectLength, recordEffectLoop, requestQueryEffectLoop } from "../MediaService";
import { MediaState } from "../base/MediaState";
import { Blur } from "./Blur";
import Log4Ts from "mw-log4ts";
import { DefaultEffectLength } from "../base/Constant";
import { IEffectLike } from "./IEffectLike";
import { EffectPref } from "./EffectPref";

/**
 * 可见谓词.
 */
export type VisiblePredicate = (position: mw.Vector,
                                option: IAssetEffectOption,
                                toleration: number) => boolean;

export class EffectProxy extends AMediaProxy<mw.Effect | mw.GameObject> {
//#region Constant
    /**
     * 可感知距离容纳值.
     */
    public static readonly PERCEPTION_TOLERATE_DIST = 600;

    /**
     * 自动追踪间隔. ms
     */
    public static readonly AUTO_TRACE_INTERVAL = 0.5e3;

    /**
     * 默认视距.
     */
    public static readonly DEFAULT_MAX_RANGE_VISIBILITY = 2000;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _holdGo: IEffectLike | undefined;

    private _state: MediaState = MediaState.Stop;

    public get state(): MediaState {
        return this._state;
    }

    private get position(): mw.Vector {
        if (this._holdGo) return this._holdGo.worldTransform.position ?? mw.Vector.zero;

        const parentPos = this._parentToWrite?.worldTransform.position;
        const pX = parentPos?.x ?? 0;
        const pY = parentPos?.y ?? 0;
        const pZ = parentPos?.z ?? 0;
        return new mw.Vector(
            (this._positionToWrite?.x ?? 0) + pX,
            (this._positionToWrite?.y ?? 0) + pY,
            (this._positionToWrite?.z ?? 0) + pZ);
    }

    private get visible(): boolean {
        return (this._visibleTester ?? visible)(this.position,
            this._option,
            EffectProxy.PERCEPTION_TOLERATE_DIST);
    }

    private _finishInterval: RevisedInterval | undefined;

    private _lastLoop: number | undefined;

    private _autoTraceTimer: number | undefined;

    private _virtualStartTime: number | undefined;

    private _lastPauseTime: number | undefined;

    private _positionToWrite?: mw.Vector;

    private _parentToWrite?: mw.GameObject;

    private _blurUnreliableLength: boolean = true;

    constructor(private _option: IEffectOption,
                private _autoDestroy: boolean,
                private _visibleTester?: VisiblePredicate,
                debug: boolean = false) {
        super();
        this.debug = debug;
    }

//#region Controller
    public get o(): Promise<mw.Effect | mw.GameObject> {
        // noinspection SuspiciousTypeOfGuard
        if (this._holdGo instanceof mw.Effect)
            return Promise.resolve(this._holdGo as mw.Effect);
        else if (this._holdGo instanceof EffectPref)
            return Promise.resolve(this._holdGo.root as mw.GameObject);
        else
            return this.turnToEffect().then(() => this._holdGo as unknown as mw.Effect);
    }

    /**
     * 󰐊播放.
     */
    public play(): this {
        if (this._state === MediaState.Destroy) return this;
        this.playHandler();

        return this;
    }

    /**
     * 󰓛停止.
     */
    public stop(): this {
        if (this._state === MediaState.Destroy ||
            this._state === MediaState.Stop) return this;
        this._state = MediaState.Stop;
        this._holdGo?.stop();
        this.stopSimulateOnStageFinish();
        this.onStop.invoke();
        if (this._autoDestroy) this.destroy();

        return this;
    }

    /**
     * 󰏤暂停
     */
    public pause(): this {
        this.pauseHandler();
        return this;
    }

    /**
     * 󰐊继续.
     */
    public continue(): this {
        if (this._state === MediaState.Destroy ||
            this._state === MediaState.Stop ||
            this._state === MediaState.Play) return this;
        this._state = MediaState.Play;
        trySetTimeDilation(this._holdGo, 1);
        this._virtualStartTime! += Date.now() - this._lastPauseTime!;
        this._lastPauseTime = undefined;
        this.startSimulateOnStageFinish();
        this.onContinue.invoke();

        return this;
    }

    /**
     * 󰩺销毁.
     */
    public destroy() {
        if (this._state === MediaState.Destroy) return;
        this._state = MediaState.Destroy;
        this.onDestroy.invoke();
        this.destroyHandler();
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config
    /**
     * 设置父节点.
     * @desc 仅空间音效时具有意义.
     * @param {mw.GameObject} parent
     *    undefined 时取消父节点.
     * @return {this}
     */
    public setParent(parent?: mw.GameObject): this {
        if (this._state === MediaState.Destroy) return this;
        if (this._holdGo) this._holdGo.parent = parent!;
        else this._parentToWrite = parent;
        return this;
    }

    /**
     * 设置位置.
     * @desc 仅空间音效时具有意义.
     * @param {mw.Vector} position
     * @return {this}
     */
    public setPosition(position?: mw.Vector): this {
        if (this._state === MediaState.Destroy) return this;

        const pos = position ?? mw.Vector.zero;
        if (this._option.positionOffset) pos.add(this._option.positionOffset);

        if (this._holdGo) this._holdGo.worldTransform.position = pos;
        else this._positionToWrite = pos;
        return this;
    }

    /**
     * 设置 是否 󰩺自动销毁.
     * @param {boolean} enable
     * @return {this}
     */
    public setAutoDestroy(enable: boolean): this {
        if (this._state === MediaState.Destroy) return this;
        this._autoDestroy = enable;

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private async loadMwEffectGo(): Promise<void> {
        this._holdGo = await mw.Effect.asyncSpawn<mw.Effect>(this._option.assetId!) as unknown as IEffectLike;
        if (!this._holdGo) return undefined;
        recordEffectLoop(this._option.assetId!, this._option.loop || this._holdGo.loop);

        if (!this._holdGo.loop || this._option.loopCountOrDuration) {
            this._holdGo.onFinish.add(() => {
                if (!this._option.singleLength &&
                    !this._blurUnreliableLength &&
                    this._holdGo &&
                    !this._holdGo.loop) {
                    recordEffectLength(
                        this._option.assetId!,
                        ((Date.now() - this._virtualStartTime!) / (this._option.loopCountOrDuration ?? 1)));
                }
                this._blurUnreliableLength = false;
                this._virtualStartTime = undefined;
                this._state = MediaState.Stop;
                if (!this._holdGo!.loop) this._lastLoop = 0;
                this.onFinish.invoke(this._lastLoop);
                if (this._autoDestroy) {
                    this.debug && Log4Ts.log(EffectProxy, `auto destroy.`,
                        `assetId: ${this._option.assetId}.`,
                        `at ${this._holdGo!.worldTransform.position}`);
                    this.destroy();
                }
            });
        }

        this._holdGo.parent = this._parentToWrite!;
        if (this._holdGo.parent instanceof mw.Character && this._option.slotType) {
            this._holdGo.parent.attachToSlot(this._holdGo as unknown as mw.Effect,
                this._option.slotType);
        }
        if (this._positionToWrite) this._holdGo!.worldTransform.position = this._positionToWrite;

        applyEffectOptionToEffect(this._holdGo as unknown as mw.Effect, this._option);
    }

    private async loadMwEffectPrefab(): Promise<void> {
        const root = await mw.GameObject.asyncSpawn(this._option.prefabGuid!);
        if (!root) return;

        let loop = this._option.loop === true;
        this._holdGo = new EffectPref(
            this._option,
            root,
            loop,
            this._positionToWrite,
            this._parentToWrite);

        recordEffectLoop(this._option.prefabGuid!, loop);

        if (!this._holdGo.loop || this._option.loopCountOrDuration) {
            this._holdGo.onFinish.add(() => {
                this._virtualStartTime = undefined;
                this._state = MediaState.Stop;
                if (!this._holdGo!.loop) this._lastLoop = 0;
                this.onFinish.invoke(this._lastLoop);
                if (this._autoDestroy) {
                    this.debug && Log4Ts.log(EffectProxy, `auto destroy.`,
                        `assetId: ${this._option.assetId}.`,
                        `at ${this._holdGo!.worldTransform.position}`);
                    this.destroy();
                }
            });
        }

        this._holdGo.parent = this._parentToWrite!;
        if (this._holdGo.parent instanceof mw.Character && this._option.slotType) {
            this._holdGo.parent.attachToSlot(this._holdGo as unknown as mw.Effect,
                this._option.slotType);
        }
        if (this._positionToWrite) this._holdGo!.worldTransform.position = this._positionToWrite;

        applyEffectOptionToGo(root, this._option);
    }

    private async loadBlur(): Promise<void> {
        if (!Gtk.isNullOrEmpty(this._option.assetId)) await requestQueryEffectLoop(this._option.assetId);

        this._holdGo = new Blur(this._option, this._positionToWrite, this._parentToWrite);
        this._autoTraceTimer = mw.setInterval(() => {
                if (this.visible) {
                    mw.clearInterval(this._autoTraceTimer);
                    if (!Gtk.isNullOrEmpty(this._option.assetId)) this.turnToEffect();
                    else this.turnToEffectPrefab();
                }
            },
            EffectProxy.AUTO_TRACE_INTERVAL);

        this._holdGo.onFinish.add(() => {
            this._virtualStartTime = undefined;
            this._state = MediaState.Stop;
            if (!this._holdGo!.loop) this._lastLoop = 0;
            this.onFinish.invoke(this._lastLoop);
            if (this._autoDestroy) {
                this.debug && Log4Ts.log(EffectProxy, `auto destroy.`,
                    `assetId: ${this._option.assetId}.`,
                    `at ${this._holdGo!.worldTransform.position}`);
                this.destroy();
            }
        });

        return;
    }

    private async turnToEffect() {
        // noinspection SuspiciousTypeOfGuard
        if (this._state === MediaState.Destroy || this._holdGo instanceof mw.Effect) return;

        const echo = this._holdGo as Blur;
        await this.loadMwEffectGo();

        switch (this._state) {
            case MediaState.Play:
                this.playHandler(this._lastLoop);
                break;
            case MediaState.Pause:
                await this.playHandler(this._lastLoop, false);
                this.pauseHandler(false);
                break;
            case MediaState.Stop:
                this._holdGo?.stop();
                break;
        }
        echo?.destroy();
    }

    private async turnToEffectPrefab() {
        // noinspection SuspiciousTypeOfGuard
        if (this._state === MediaState.Destroy || this._holdGo instanceof mw.Effect) return;

        const echo = this._holdGo as Blur;
        await this.loadMwEffectGo();

        switch (this._state) {
            case MediaState.Play:
                this.playHandler(this._lastLoop);
                break;
            case MediaState.Pause:
                await this.playHandler(this._lastLoop, false);
                this.pauseHandler(false);
                break;
            case MediaState.Stop:
                this._holdGo?.stop();
                break;
        }
        echo?.destroy();
    }

    private async playHandler(lastCount?: number, event: boolean = true): Promise<boolean> {
        // Microsoft Typescript Trade-offs in Control Flow Analysis #9998
        // https://github.com/microsoft/TypeScript/issues/9998
        // as MediaState is necessary when `checkStateIs` is not use.
        // this._state = MediaState.Play as MediaState;
        this._state = MediaState.Play;
        if (this._option.singleLength) recordEffectLength(this._option.assetId!, this._option.singleLength);
        if (!this._holdGo) {
            if (!this.visible) await this.loadBlur();
            else {
                this._blurUnreliableLength = false;
                if (!Gtk.isNullOrEmpty(this._option.assetId)) await this.loadMwEffectGo();
                else await this.loadMwEffectPrefab();
            }

            if (!this._holdGo) return false;
        }

        return this.checkStateIs(
            MediaState.Play,
            () => {
                this._virtualStartTime = Date.now();
                if (!this._holdGo!.loop) {
                    this._lastLoop = lastCount ??
                        Math.floor(this._option.loopCountOrDuration ?? 1);
                    this._holdGo!.loopCount = this._lastLoop;
                }
                this._holdGo!.play();
                trySetTimeDilation(this._holdGo, 1);
                this.startSimulateOnStageFinish();
                event && this.onPlay.invoke();
            });
    }

    private pauseHandler(event: boolean = true) {
        if (this._state === MediaState.Destroy ||
            this._state === MediaState.Stop ||
            this._state === MediaState.Pause) return this;
        this._state = MediaState.Pause;
        trySetTimeDilation(this._holdGo, 0);
        this._lastPauseTime = Date.now();
        this.stopSimulateOnStageFinish();
        event && this.onPause.invoke();

        return this;
    }

    private destroyHandler() {
        this._holdGo?.destroy();
    }

    private checkStateIs(state: MediaState, callback?: () => void): boolean {
        if (this._state === state) {
            callback?.();
            return true;
        }

        switch (this._state) {
            case MediaState.Play:
                if (this._holdGo) this._holdGo.play();
                break;
            case MediaState.Destroy:
                this.destroyHandler();
                break;
            case MediaState.Stop:
            default:
                this._holdGo?.stop();
                break;
        }
        return false;
    }

    private startSimulateOnStageFinish() {
        if (this._holdGo!.loop) return;
        if (this._finishInterval) this._finishInterval.shutdown();

        const effectLength = queryEffectLength(this._option.assetId!) ?? DefaultEffectLength;
        this._finishInterval = new RevisedInterval(
            () => {
                --this._lastLoop!;
                this.onFinish.invoke(this._lastLoop);

                if (this._lastLoop! <= 1 ||
                    this._state === MediaState.Destroy ||
                    this._state === MediaState.Stop) this.stopSimulateOnStageFinish();
            },
            effectLength,
            effectLength - (Date.now() - this._virtualStartTime!) % effectLength,
            true,
        );
    }

    private stopSimulateOnStageFinish() {
        this._finishInterval?.shutdown();
        this._finishInterval = undefined;
    }
}

/**
 * 是否 可见的.
 * @param {mw.Vector} position
 * @param {IAssetEffectOption} option
 * @param {number} toleration
 * @return {boolean}
 */
export function visible(position: mw.Vector,
                        option: IAssetEffectOption,
                        toleration: number): boolean {
    if (!mw.SystemUtil.isClient()) return false;

    const selfPos = mw.Player.localPlayer?.character?.worldTransform?.position ?? undefined;
    if (selfPos === undefined) return false;

    const visibleMaxDist = ((option.cullDistance ?? 0) === 0 ?
            EffectProxy.DEFAULT_MAX_RANGE_VISIBILITY :
            option.cullDistance!)
        + toleration;

    return Gtk.squaredEuclideanDistance(selfPos, position) <= visibleMaxDist * visibleMaxDist;
}

function trySetTimeDilation(holdGo: IEffectLike | undefined, val: number) {
    if (holdGo?.["effect"]?.["CascadeParticleSystemComponent"])
        holdGo["effect"]["CascadeParticleSystemComponent"]["CustomTimeDilation"] = val;
}