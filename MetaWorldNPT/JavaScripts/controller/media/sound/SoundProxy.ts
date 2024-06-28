import { applySoundOptionToGo, ISoundOption } from "./ISoundOption";
import AssetController from "../../asset/AssetController";
import { MwSoundPlayStatePaused } from "../base/SoundPlayState";
import { AMediaProxy } from "../base/AMediaProxy";
import { querySoundLength, recordSoundLength } from "../MediaService";

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

export class SoundProxy extends AMediaProxy {
    private _holdGo: mw.Sound | undefined;

    private _state: SoundState = SoundState.Stop;

    public get state(): SoundState {
        return this._state;
    }

    private _lastLoop: number | undefined;

    constructor(
        private _option: ISoundOption,
        private _autoDestroy: boolean) {
        super();
    }

//#region Controller
    /**
     * 󰐊（从头）播放.
     * @param {number} startTime
     * @param {boolean} clipReadyTime
     */
    public play(startTime: number = 0,
                clipReadyTime: boolean = false): this {
        if (this._state === SoundState.Destroy) return this;
        this.playHandler(startTime, clipReadyTime, true);

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

    private async playHandler(startTime: number = 0,
                              clipReadyTime: boolean,
                              refreshLoop: boolean): Promise<boolean> {
        // Microsoft Typescript Trade-offs in Control Flow Analysis #9998
        // https://github.com/microsoft/TypeScript/issues/9998
        // as SoundState is necessary when `checkStateIs` is not use.
        // this._state = SoundState.Play as SoundState;
        this._state = SoundState.Play;
        const realStart = Date.now();
        if (!this._holdGo) {
            this._holdGo = await mw.Sound.asyncSpawn<mw.Sound>(this._option.assetId);
            if (!this._holdGo) {
                this._holdGo = undefined;
                return false;
            }

            this._holdGo.onPlay.add(() => this.onPlay.invoke());
            this._holdGo.onPause.add(() => this.onPause.invoke());
            this._holdGo.onFinish.add(() => this.onFinish.invoke());

            await AssetController.load(this._option.assetId);
            recordSoundLength(this._option.assetId, this._holdGo.timeLength);

            this.onFinish.setProtected().add(() => {
                if (this._lastLoop) {
                    --this._lastLoop;
                    this.playHandler(0, true, false);
                    return;
                }

                if (this._autoDestroy) this.destroy();
            });

            applySoundOptionToGo(this._holdGo, this._option);
        }

        return this.checkStateIs(
            SoundState.Play,
            () => {
                const reqStart = startTime + (clipReadyTime ? Date.now() - realStart : 0);
                const length = querySoundLength(this._option.assetId);

                if (refreshLoop && !this._holdGo!.isLoop) {
                    this._lastLoop = (this._option.loopCount ?? 1) - 1;
                    if (reqStart > length) {
                        this._lastLoop -= Math.floor(reqStart / length);
                    }
                }

                if (this._holdGo!.isLoop || this._lastLoop! >= 0) {
                    this._holdGo!.play(reqStart % length);
                    if (this._holdGo!.playState === MwSoundPlayStatePaused) this._holdGo!.pause(false);
                    this.onPlay.invoke();
                }
            });
    }

    private destroyHandler() {
        this._holdGo?.destroy();
        this.onDestroy.invoke();
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
}