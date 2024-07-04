import { applySoundOptionToGo, ISoundOption } from "./ISoundOption";
import AssetController from "../../asset/AssetController";
import { MwSoundPlayStatePaused } from "../base/SoundPlayState";
import { AMediaProxy } from "../base/AMediaProxy";
import { querySoundLength, recordSoundLength } from "../MediaService";
import Gtk, { RevisedInterval } from "gtoolkit";
import { MediaState } from "../base/MediaState";
import Log4Ts from "mw-log4ts";
import { Echo } from "./Echo";
import { ISoundLike } from "./ISoundLike";

/**
 * 可听谓词.
 */
export type AudiblePredicate = (position: mw.Vector,
                                option: ISoundOption,
                                toleration: number) => boolean;

export class SoundProxy extends AMediaProxy<mw.Sound> {
//#region Constant
    /**
     * 可感知距离容纳值.
     */
    public static readonly PERCEPTION_TOLERATE_DIST = 200;

    /**
     * 自动追踪间隔. ms
     */
    public static readonly AUTO_TRACE_INTERVAL = 0.5e3;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _holdGo: ISoundLike | undefined;

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

    private get audible(): boolean {
        return (this._audibleTester ?? audible)(this.position,
            this._option,
            SoundProxy.PERCEPTION_TOLERATE_DIST);
    }

    private _finishInterval: RevisedInterval | undefined;

    private _lastLoop: number | undefined;

    private _autoTraceTimer: number | undefined;

    private _positionToWrite?: mw.Vector;

    private _parentToWrite?: mw.GameObject;

    constructor(private _option: ISoundOption,
                private _autoDestroy: boolean,
                private _audibleTester?: AudiblePredicate,
                debug: boolean = false) {
        super();
        this.debug = debug;
    }

//#region Controller
    /**
     * 󰐊（从头）播放.
     * @param {number} startAt
     * @param {boolean} clipReadyTime
     */
    public play(startAt: number = 0,
                clipReadyTime: boolean = false): this {
        if (this._state === MediaState.Destroy) return this;
        this.playHandler(startAt, clipReadyTime, true, true);

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
        if (this._autoDestroy) {
            this.debug && Log4Ts.log(SoundProxy, `auto destroy.`,
                `assetId: ${this._option.assetId}.`,
                `at ${this._holdGo!.worldTransform.position}`);
            this.destroy();
        }

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
        this._holdGo?.pause(true);
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
        this._holdGo?.pause(false);
        this._holdGo!.isLoop && this.startSimulateOnStageFinish();
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
        if (this._state === MediaState.Destroy) return this;
        this._autoDestroy = enable;

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public get o(): Promise<mw.Sound> {
        if (this._holdGo instanceof mw.Sound) {
            return Promise.resolve(this._holdGo as mw.Sound);
        } else {
            return this.turnToSound().then(() => this._holdGo as mw.Sound);
        }
    }

    private async loadMwSoundGo(): Promise<void> {
        this._holdGo = await mw.Sound.asyncSpawn<mw.Sound>(this._option.assetId);
        if (!this._holdGo) return undefined;

        await AssetController.load(this._option.assetId);
        (this._holdGo as mw.Sound).setSoundAsset(this._option.assetId);

        this.registerNonLoopOnFinishInSoundObj();

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

        this.registerNonLoopOnFinishInSoundObj();
    }

    private async turnToSound() {
        // noinspection SuspiciousTypeOfGuard
        if (this._state === MediaState.Destroy ||
            this._holdGo instanceof mw.Sound) return;

        const echo = this._holdGo as Echo;
        await this.loadMwSoundGo();

        switch (this._state) {
            case MediaState.Play:
                this.playHandler(echo.timeAt, false, true, false);
                break;
            case MediaState.Pause:
                await this.playHandler(echo.timeAt, false, false, false);
                this.pause();
                break;
            case MediaState.Stop:
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
        // as MediaState is necessary when `checkStateIs` is not use.
        // this._state = MediaState.Play as MediaState;
        this._state = MediaState.Play;
        const realStart = Date.now();
        if (!this._holdGo) {
            if (this._option.isSpatial && !this.audible) await this.loadEcho();
            else await this.loadMwSoundGo();

            if (!this._holdGo) return false;

            this.onFinish.setProtected().add(() => {
                if (this._holdGo!.isLoop || this._lastLoop) {
                    this.playHandler(0, true, false, false);
                    return;
                }

                if (this._autoDestroy) {
                    this.debug && Log4Ts.log(SoundProxy, `auto destroy.`,
                        `assetId: ${this._option.assetId}.`,
                        `at ${this._holdGo!.worldTransform.position}`);
                    this.destroy();
                }
            });
        }

        return this.checkStateIs(
            MediaState.Play,
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
                    this._holdGo!.isLoop && this.startSimulateOnStageFinish();
                    event && this.onPlay.invoke();
                } else {
                    this._state = MediaState.Stop;
                }
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
                if (this._holdGo) {
                    this._holdGo.play(0);
                    if (this._holdGo.playState === MwSoundPlayStatePaused) {
                        this._holdGo.pause(false);
                    }
                }
                break;
            case MediaState.Pause:
                this._holdGo?.pause(true);
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
                this.onFinish.invoke(undefined);
                if (this._lastLoop === 0) this.stopSimulateOnStageFinish();
            },
            this._holdGo!.timeLength ?? 1,
            this._holdGo!.timeLength ?? 1 - at,
            true);
    }

    private stopSimulateOnStageFinish() {
        this._finishInterval?.shutdown();
        this._finishInterval = undefined;
    }

    private registerNonLoopOnFinishInSoundObj() {
        if (!this._holdGo!.isLoop) {
            this._holdGo!.onFinish.add(() => {
                if (this._lastLoop === 0) this._state = MediaState.Stop;
                this.onFinish.invoke(this._lastLoop);
            });
        }
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