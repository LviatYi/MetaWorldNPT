import Gtk, { Delegate, Singleton } from "gtoolkit";
import { applySoundOption, ISoundOption } from "./sound/ISoundOption";
import AssetController from "../asset/AssetController";
import { MwSoundPlayStatePaused } from "./base/SoundPlayState";
import Log4Ts from "mw-log4ts/Log4Ts";

export class MediaService extends Singleton<MediaService>() {
    private _debug: boolean = true;

    private _validSoundId: number = 0;

    private _validSoundIdOverflow: boolean = false;

    private _clientSoundMap: Map<number, SoundProxy> = new Map();

    /**
     * 调试模式.
     * @param {boolean} enable=true 是否启用 调试模式.
     * @return {this}
     */
    public debug(enable: boolean = true): this {
        this._debug = enable;

        return this;
    }

    public loadSound(option: ISoundOption,
                     location?: mw.Vector,
                     parent?: mw.GameObject,
                     autoDestroy: boolean = true): number | undefined {
        const sid = this.getValidSoundId();
        if (Gtk.isNullOrUndefined(sid)) {
            this.logENoValidSoundId();
            return undefined;
        }

        if (isClient()) {
            return this.loadSoundHandler(sid,
                option,
                location,
                parent,
                autoDestroy);
        } else if (isServer()) {

        }
    }

    /**
     * 获取一个客户端加载的声效.
     * @desc 仅客户端.
     * @param {number} sid
     * @return {SoundProxy | undefined}
     */
    public getSoundBySid(sid: number): SoundProxy | undefined {
        return this._clientSoundMap.get(sid);
    }

    /**
     * 加载一个声效.
     * @desc 仅客户端.
     * @param {number} sid
     * @param {ISoundOption} option
     * @param {mw.Vector} location
     * @param {mw.GameObject} parent
     * @param {boolean} autoDestroy
     * @return {number} sid
     * @private
     */
    private loadSoundHandler(sid: number,
                             option: ISoundOption,
                             location?: mw.Vector,
                             parent?: mw.GameObject,
                             autoDestroy: boolean = true): number | undefined {
        const sound = new SoundProxy(option, autoDestroy);

        this._clientSoundMap.set(sid, sound);
        return sid;
    }

    public getSoundProxy(assetId: string): SoundProxy[] {
        return [];
    }

    public getSoundProxyExclusive(assetId: string): SoundProxy | undefined {
        return undefined;
    }

    private getValidSoundId(): number | undefined {
        if (!this._validSoundIdOverflow) {
            if (this._validSoundId >= Number.MAX_SAFE_INTEGER) {
                this._validSoundIdOverflow = true;
                this._validSoundId = 0;
            } else {
                return this._validSoundId++;
            }
        }

        let valid = false;
        while (true) {
            if (!this._clientSoundMap.has(this._validSoundId)) {
                valid = true;
                break;
            }

            ++this._validSoundId;
            if (this._validSoundId >= Number.MAX_SAFE_INTEGER) {
                this._validSoundId = 0;
                break;
            }
        }

        return valid ? this._validSoundId++ : undefined;
    }

//#region Log
    private logENoValidSoundId() {
        this._debug && Log4Ts.error(MediaService, `there is no more valid sid.`);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

interface IMediaEvent {
    onPlay: Delegate.SimpleDelegate | undefined;

    onPause: Delegate.SimpleDelegate | undefined;

    onFinish: Delegate.SimpleDelegate | undefined;
}

abstract class AMediaProxy implements IMediaEvent {
    public onPlay: Delegate.SimpleDelegate | undefined = new Delegate.SimpleDelegate();

    public onPause: Delegate.SimpleDelegate | undefined = new Delegate.SimpleDelegate();

    public onFinish: Delegate.SimpleDelegate | undefined = new Delegate.SimpleDelegate();
}

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
}

export class SoundProxy extends AMediaProxy {
    private _holdGo: mw.Sound | undefined;

    private _state: SoundState = SoundState.Stop;

    constructor(
        private _option: ISoundOption,
        private _autoDestroy: boolean) {
        super();
    }

    public play(startTime: number = 0,
                clipReadyTime: boolean = false) {
        this.playHandler(startTime, clipReadyTime);
    }

    public stop() {
        this._state = SoundState.Stop;
        this._holdGo?.stop();
    }

    public pause() {
        this._state = SoundState.Pause;
        this._holdGo?.pause(true);
    }

    public continue() {
        this._state = SoundState.Play;
        this._holdGo?.pause(false);
    }

    private async playHandler(startTime: number = 0,
                              clipReadyTime: boolean = false): Promise<boolean> {
        this._state = SoundState.Play;
        const realStart = Date.now();
        if (!this._holdGo) {
            this._holdGo = await mw.Sound.asyncSpawn<mw.Sound>(this._option.assetId);
            if (!this._holdGo) {
                this._holdGo = undefined;
                return false;
            }

            await AssetController
                .load(this._option.assetId);

            applySoundOption(this._holdGo, this._option);
        }

        if (this._state === SoundState.Play) {
            this._holdGo.play(startTime + (clipReadyTime ? Date.now() - realStart : 0));
            if (this._holdGo.playState === MwSoundPlayStatePaused) this._holdGo.pause(false);
        } else {
            switch (this._state) {
                case SoundState.Pause:
                    this._holdGo.pause(true);
                    break;
                case SoundState.Stop:
                default:
                    this._holdGo.stop();
                    break;
            }
        }

        return true;
    }
}

// export class EffectProxy extends AMediaProxy {
//
// }

function isClient(): boolean {
    return mw.SystemUtil.isClient();
}

function isServer(): boolean {
    return mw.SystemUtil.isServer();
}

const soundLengthMap: Map<string, number> = new Map();