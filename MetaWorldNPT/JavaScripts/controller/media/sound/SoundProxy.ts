import { applySoundOptionToGo, ISoundOption } from "./ISoundOption";
import AssetController from "../../asset/AssetController";
import { MwSoundPlayStatePaused } from "../base/SoundPlayState";
import { AMediaProxy } from "../base/AMediaProxy";
import { querySoundLength, recordSoundLength } from "../MediaService";
import { Echo, ISoundLike } from "./Echo";
import Gtk, { RevisedInterval } from "gtoolkit";

export enum SoundState {
    /**
     * 播放.
     */
    Play,
    /**
     * 停止.
     */
    Stop,
    /**
     * 暂停.
     */
    Pause,
    /**
     * 销毁.
     */
    Destroy,
}

/**
 * 可听谓词.
 */
export type AudiblePredicate = (position: mw.Vector,
                                option: ISoundOption,
                                toleration: number) => boolean;

export class SoundProxy extends AMediaProxy {
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

    private _holdGo: ISoundLike | undefined;

    private _state: SoundState = SoundState.Stop;

    public get state(): SoundState {
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

    private get audible(): boolean {
        return (this._audibleTester ?? audible)(this.position,
            this._option,
            SoundProxy.PERCEPTION_TOLERATE_DIST);
    }

    private _finishInterval: RevisedInterval | undefined;

    private _lastLoop: number | undefined;

    private _autoTraceTimer: number | undefined;

    constructor(private _option: ISoundOption,
                private _autoDestroy: boolean,
                private _positionToWrite?: mw.Vector,
                private _parentToWrite?: mw.GameObject,
                private _audibleTester?: AudiblePredicate) {
        super();
    }

//#region Controller
    /**
     * 󰐊（从头）播放.
     * @param {number} startAt
     * @param {boolean} clipReadyTime
     */
    public play(startAt: number = 0,
                clipReadyTime: boolean = false): this {
        if (this._state === SoundState.Destroy) return this;
        this.playHandler(startAt, clipReadyTime, true, true);

        return this;
    }

    /**
     * 󰓛停止.
     */
    public stop(): this {
        if (this._state === SoundState.Destroy ||
            this._state === SoundState.Stop) return this;
        this._state = SoundState.Stop;
        this._holdGo?.stop();
        this.onStop.invoke();
        this.stopSimulateOnStageFinish();
        if (this._autoDestroy) this.destroy();

        return this;
    }

    /**
     * 󰏤暂停
     */
    public pause(): this {
        if (this._state === SoundState.Destroy ||
            this._state === SoundState.Stop ||
            this._state === SoundState.Pause) return this;
        this._state = SoundState.Pause;
        this._holdGo?.pause(true);
        this.onPause.invoke();
        this.stopSimulateOnStageFinish();

        return this;
    }

    /**
     * 󰐊继续.
     */
    public continue(): this {
        if (this._state === SoundState.Destroy ||
            this._state === SoundState.Stop ||
            this._state === SoundState.Play) return this;
        this._state = SoundState.Play;
        this._holdGo?.pause(false);
        this.onContinue.invoke();
        this.startSimulateOnStageFinish();

        return this;
    }

    /**
     * 󰩺销毁.
     */
    public destroy() {
        if (this._state === SoundState.Destroy) return;
        this._state = SoundState.Destroy;
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
        if (this._state === SoundState.Destroy) return this;
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
        if (this._state === SoundState.Destroy) return this;
        if (this._holdGo) this._holdGo.worldTransform.position = position ?? mw.Vector.zero;
        else this._positionToWrite = position;
        return this;
    }

    /**
     * 设置 是否 󰩺自动销毁.
     * @param {boolean} enable
     * @return {this}
     */
    public setAutoDestroy(enable: boolean): this {
        if (this._state === SoundState.Destroy) return this;
        this._autoDestroy = enable;

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private async loadMwSoundGo(): Promise<void> {
        this._holdGo = await mw.Sound.asyncSpawn<mw.Sound>(this._option.assetId);
        if (!this._holdGo) return undefined;

        await AssetController.load(this._option.assetId);
        (this._holdGo as mw.Sound).setSoundAsset(this._option.assetId);

        if (!this._holdGo.isLoop) {
            this._holdGo.onFinish.add(() => this.onFinish.invoke(this._lastLoop));
        }

        this._holdGo.parent = this._parentToWrite;
        if (this._positionToWrite) this._holdGo!.worldTransform.position = this._positionToWrite;

        recordSoundLength(this._option.assetId, this._holdGo.timeLength ?? 0);
        applySoundOptionToGo(this._holdGo as mw.Sound, this._option);
    }

    private async loadEcho(): Promise<void> {
        await AssetController.load(this._option.assetId);
        soundTemplate?.setSoundAsset(this._option.assetId);
        recordSoundLength(this._option.assetId, soundTemplate?.timeLength ?? 1);

        this._holdGo = new Echo(this._option, this._positionToWrite, this._parentToWrite);
        this._autoTraceTimer = mw.setInterval(() => {
                if (this.audible) {
                    mw.clearInterval(this._autoTraceTimer);
                    this.turnToSound();
                }
            },
            SoundProxy.AUTO_TRACE_INTERVAL);

        if (!this._holdGo.isLoop) {
            this._holdGo.onFinish.add(() => this.onFinish.invoke(this._lastLoop));
        }
    }

    private async turnToSound() {
        // noinspection SuspiciousTypeOfGuard
        if (this.state === SoundState.Destroy ||
            this._holdGo instanceof mw.Sound) return;

        const echo = this._holdGo as Echo;
        await this.loadMwSoundGo();

        switch (this.state) {
            case SoundState.Play:
                this.playHandler(echo.timeAt, false, true, false);
                break;
            case SoundState.Pause:
                await this.playHandler(echo.timeAt, false, false, false);
                this.pause();
                break;
            case SoundState.Stop:
                this._holdGo?.stop();
                break;
        }
        echo.destroy();
    }

    private async playHandler(startAt: number = 0,
                              clipReadyTime: boolean,
                              refreshLoop: boolean,
                              event: boolean): Promise<boolean> {
        // Microsoft Typescript Trade-offs in Control Flow Analysis #9998
        // https://github.com/microsoft/TypeScript/issues/9998
        // as SoundState is necessary when `checkStateIs` is not use.
        // this._state = SoundState.Play as SoundState;
        this._state = SoundState.Play;
        const realStart = Date.now();
        if (!this._holdGo) {
            if (this._option.isSpatial && !this.audible) await this.loadEcho();
            else await this.loadMwSoundGo();

            if (!this._holdGo) return false;

            this.onFinish.setProtected().add(() => {
                if (this._lastLoop) {
                    this.playHandler(0, true, false, false);
                    return;
                }

                if (this._autoDestroy) this.destroy();
            });
        }

        return this.checkStateIs(
            SoundState.Play,
            () => {
                const reqStart = startAt + (clipReadyTime ? Date.now() - realStart : 0);
                const length = querySoundLength(this._option.assetId) ?? 1;

                if (refreshLoop && !this._holdGo!.isLoop) {
                    this._lastLoop = this._option.loopCount ?? 1;
                    if (reqStart > length) this._lastLoop -= Math.floor(reqStart / length);
                }

                if (this._holdGo!.isLoop || this._lastLoop! > 0) {
                    if (this._lastLoop !== undefined) --this._lastLoop;
                    this._holdGo!.play(reqStart % length);
                    if (this._holdGo!.playState === MwSoundPlayStatePaused) this._holdGo!.pause(false);
                    this._holdGo.isLoop && this.startSimulateOnStageFinish();
                    event && this.onPlay.invoke();
                } else {
                    this._state = SoundState.Stop;
                }
            });
    }

    private destroyHandler() {
        this._holdGo?.destroy();
        this.onDestroy.invoke();
        this.stopSimulateOnStageFinish();
    }

    private checkStateIs(state: SoundState, callback?: () => void): boolean {
        if (this._state === state) {
            callback?.();
            return true;
        }

        switch (this._state) {
            case SoundState.Play:
                if (this._holdGo) {
                    this._holdGo.play(0);
                    if (this._holdGo.playState === MwSoundPlayStatePaused) {
                        this._holdGo.pause(false);
                    }
                }
                break;
            case SoundState.Pause:
                this._holdGo?.pause(true);
                break;
            case SoundState.Destroy:
                this.destroyHandler();
                break;
            case SoundState.Stop:
            default:
                this._holdGo?.stop();
                break;
        }
        return false;
    }

    private startSimulateOnStageFinish() {
        if (this._finishInterval) this._finishInterval.shutdown();

        let at: number | undefined = 0;
        // noinspection SuspiciousTypeOfGuard
        if (this._holdGo instanceof mw.Sound) {
            at = (this._holdGo as mw.Sound).timePosition;
        } else if (this._holdGo instanceof Echo) {
            at = (this._holdGo as Echo).timeAt % (this._holdGo.timeLength ?? 1);
        }

        if (at === undefined) return;

        this._finishInterval = new RevisedInterval(
            () => {
                this.onFinish.invoke(this._lastLoop);
                if (this._lastLoop === 0) this.stopSimulateOnStageFinish();
            },
            this._holdGo!.timeLength ?? 1,
            this._holdGo.timeLength ?? 1 - at,
            true);
    }

    private stopSimulateOnStageFinish() {
        this._finishInterval?.shutdown();
        this._finishInterval = undefined;
    }
}

/**
 * 是否 可听的.
 * @param {mw.Vector} position
 * @param {ISoundOption} option
 * @param {number} toleration
 * @return {boolean}
 */
export function audible(position: mw.Vector,
                        option: ISoundOption,
                        toleration: number): boolean {
    if (!mw.SystemUtil.isClient()) return false;

    const selfPos = mw.Player.localPlayer?.character?.worldTransform?.position ?? undefined;
    if (selfPos === undefined) return false;

    const extentsMax = option.attenuationShapeExtents ?
        Math.max(...option.attenuationShapeExtents) :
        0;
    const audibleMaxDist = extentsMax + (option.falloffDistance ?? 0) + toleration;

    return Gtk.squaredEuclideanDistance(selfPos, position) <= audibleMaxDist * audibleMaxDist;
}

let soundTemplate: mw.Sound | undefined = undefined;

function autoRegisterSoundTemplate() {
    mw.Sound.asyncSpawn("199625")
        .then((go: mw.Sound) => {
            soundTemplate = go;
            go.stop();
        });

    mw.TimeUtil.onEnterFrame.remove(autoRegisterSoundTemplate);
}

mw.TimeUtil.onEnterFrame.add(autoRegisterSoundTemplate);