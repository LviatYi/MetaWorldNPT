import { RevisedInterval } from "../../../util/GToolkit";
import { applyEffectOptionToGo, IEffectOption } from "./IEffectOption";
import { AMediaProxy } from "../base/AMediaProxy";
import { queryEffectLength, recordEffectLength } from "../MediaService";
import { MediaState } from "../base/MediaState";

/**
 * 可见谓词.
 */
export type VisiblePredicate = (position: mw.Vector,
                                option: IEffectOption,
                                toleration: number) => boolean;

export class EffectProxy extends AMediaProxy {
//#region Constant
    /**
     * 可感知距离容纳值.
     */
    public static readonly PERCEPTION_TOLERATE_DIST = 200;

    /**
     * 自动追踪间隔.
     */
    public static readonly AUTO_TRACE_INTERVAL = 0.5e3;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _holdGo: mw.Effect | undefined;

    private _state: MediaState = MediaState.Stop;

    public get state(): MediaState {
        return this._state;
    }

    private get position(): mw.Vector {
        const parentPos = this._parentToWrite?.worldTransform.position;
        const pX = parentPos?.x ?? 0;
        const pY = parentPos?.y ?? 0;
        const pZ = parentPos?.z ?? 0;
        return this._holdGo?.worldTransform.position ??
            (this._positionToWrite ?
                new mw.Vector(
                    this._positionToWrite.x + pX,
                    this._positionToWrite.y + pY,
                    this._positionToWrite.z + pZ)
                : mw.Vector.zero);
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

    constructor(private _option: IEffectOption,
                private _autoDestroy: boolean,
                private _visibleTester?: VisiblePredicate) {
        super();
    }

//#region Controller
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
        if (this._state === MediaState.Destroy ||
            this._state === MediaState.Stop ||
            this._state === MediaState.Pause) return this;
        this._state = MediaState.Pause;
        if (this._holdGo) this._holdGo["effect"]["CascadeParticleSystemComponent"]["CustomTimeDilation"] = 0;
        this._lastPauseTime = Date.now();
        this.stopSimulateOnStageFinish();
        this.onPause.invoke();

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
        if (this._holdGo) this._holdGo["effect"]["CascadeParticleSystemComponent"]["CustomTimeDilation"] = 1;
        this._lastPauseTime = undefined;
        this._virtualStartTime! += Date.now() - this._lastPauseTime!;
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
     * @param {boolean} applyOffset=true 应用 {@link IEffectOption.positionOffset}.
     * @return {this}
     */
    public setPosition(position?: mw.Vector, applyOffset: boolean = true): this {
        if (this._state === MediaState.Destroy) return this;

        const pos = position ?? mw.Vector.zero;
        if (applyOffset && this._option.positionOffset) pos.add(this._option.positionOffset);

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
        this._holdGo = await mw.Effect.asyncSpawn<mw.Effect>(this._option.assetId);
        if (!this._holdGo) return undefined;
        if (!this._holdGo.loop) {
            this._holdGo.onFinish.add(() => {
                recordEffectLength(
                    this._option.assetId,
                    ((Date.now() - this._virtualStartTime!) / (this._option.loopCountOrDuration ?? 1)));
                this._virtualStartTime = undefined;
            });
        }

        this._holdGo.parent = this._parentToWrite!;
        if (this._holdGo.parent instanceof mw.Character && this._option.slotType) {
            this._holdGo.parent.attachToSlot(this._holdGo, this._option.slotType);
        }
        if (this._positionToWrite) this._holdGo!.worldTransform.position = this._positionToWrite;

        if (!this._holdGo.loop) {
            this._holdGo.onFinish.add(() => this._autoDestroy && this.destroy());
        }

        applyEffectOptionToGo(this._holdGo as mw.Effect, this._option);
    }

    private async loadBlur(): Promise<void> {
        // this._holdGo = new Echo(this._option, this._positionToWrite, this._parentToWrite);
        // this._autoTraceTimer = mw.setInterval(() => {
        //         if (this.visible) {
        //             mw.clearInterval(this._autoTraceTimer);
        //             this.turnToEffect();
        //         }
        //     },
        //     EffectProxy.AUTO_TRACE_INTERVAL);
        //
        // if (!this._holdGo.isLoop) {
        //     this._holdGo.onFinish.add(() => this.onFinish.invoke(this._lastLoop));
        // }

        return;
    }

    private async turnToEffect() {
        // noinspection SuspiciousTypeOfGuard
        // if (this.state === MediaState.Destroy ||
        //     this._holdGo instanceof mw.Effect) return;
        //
        // const echo = this._holdGo as Echo;
        // await this.loadMwEffectGo();
        //
        // switch (this.state) {
        //     case MediaState.Play:
        //         this.playHandler(echo.timeAt, false, true, false);
        //         break;
        //     case MediaState.Pause:
        //         await this.playHandler(echo.timeAt, false, false, false);
        //         this.pause();
        //         break;
        //     case MediaState.Stop:
        //         this._holdGo?.stop();
        //         break;
        // }
        // echo.destroy();
    }

    private async playHandler(): Promise<boolean> {
        // Microsoft Typescript Trade-offs in Control Flow Analysis #9998
        // https://github.com/microsoft/TypeScript/issues/9998
        // as MediaState is necessary when `checkStateIs` is not use.
        // this._state = MediaState.Play as MediaState;
        this._state = MediaState.Play;
        if (!this._holdGo) {
            // if (this._option.isSpatial && !this.visible) await this.loadBlur();
            // else await this.loadMwEffectGo();

            await this.loadMwEffectGo();
            if (!this._holdGo) return false;
        }

        return this.checkStateIs(
            MediaState.Play,
            () => {
                this._virtualStartTime = Date.now();
                if (!this._holdGo.loop) this._lastLoop = Math.floor(this._option.loopCountOrDuration) ?? 1;
                this._holdGo!.play();
                this._holdGo!["effect"]["CascadeParticleSystemComponent"]["CustomTimeDilation"] = 1;
                this.startSimulateOnStageFinish();
                this.onPlay.invoke();
            });
    }

    private destroyHandler() {
        this._holdGo?.destroy();
        this.stopSimulateOnStageFinish();
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
        if (this._finishInterval) this._finishInterval.shutdown();

        const effectLength = queryEffectLength(this._option.assetId);
        this._finishInterval = new RevisedInterval(
            () => {
                if (this._lastLoop !== undefined) --this._lastLoop;
                this.onFinish.invoke(this._lastLoop);
                if (this._lastLoop === 0) this.stopSimulateOnStageFinish();
            },
            this._option.singleLength ?? effectLength,
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
 * @param {IEffectOption} option
 * @param {number} toleration
 * @return {boolean}
 */
export function visible(position: mw.Vector,
                        option: IEffectOption,
                        toleration: number): boolean {
    // if (!mw.SystemUtil.isClient()) return false;
    //
    // const selfPos = mw.Player.localPlayer?.character?.worldTransform?.position ?? undefined;
    // if (selfPos === undefined) return false;
    //
    // const extentsMax = option.attenuationShapeExtents ?
    //     Math.max(...option.attenuationShapeExtents) :
    //     0;
    // const visibleMaxDist = extentsMax + (option.falloffDistance ?? 0) + toleration;
    //
    // return Gtk.squaredEuclideanDistance(selfPos, position) <= visibleMaxDist * visibleMaxDist;
    return false;
}