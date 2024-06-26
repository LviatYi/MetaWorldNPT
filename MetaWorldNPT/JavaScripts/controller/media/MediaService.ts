import { Delegate, Singleton } from "gtoolkit";
import { applySoundOption, ISoundOption } from "./sound/ISoundOption";
import AssetController from "../asset/AssetController";

export class MediaService extends Singleton<MediaService>() {
    private _debug: boolean = false;

    /**
     * 调试模式.
     * @param {boolean} enable=true 是否启用 调试模式.
     * @return {this}
     */
    public debug(enable: boolean = true): this {
        this._debug = enable;

        return this;
    }

    public playSound() {
        const go: mw.Sound = new mw.Sound();
        go.timeLength;
    }
}

interface IMediaEvent {

    onComplete: Delegate.SimpleDelegate;

    onStart: Delegate.SimpleDelegate;

    onPause: Delegate.SimpleDelegate;
}

abstract class AMediaProxy implements IMediaEvent {
    /**
     * client only
     * @type {Delegate.SimpleDelegate}
     */
    public onComplete: Delegate.SimpleDelegate = new Delegate.SimpleDelegate<void>();

    /**
     * client only
     * @type {Delegate.SimpleDelegate}
     */
    public onPause: Delegate.SimpleDelegate = new Delegate.SimpleDelegate<void>();

    /**
     * client only
     * @type {Delegate.SimpleDelegate}
     */
    public onStart: Delegate.SimpleDelegate = new Delegate.SimpleDelegate<void>();
}

export class SoundProxy extends AMediaProxy {
    private _holdGo: mw.Sound | undefined;

    private _operationWaitForQueryInfo: Map<string, () => void> = new Map();

    private _queryInfo: { timeLength: number } = undefined;

    private _option: ISoundOption;

    public play(startTime: number = 0,
                clipReadyTime: boolean = false,
                onSuccess?: () => void) {
        const now = Date.now();
        if (!this._holdGo) {
            mw.Sound.asyncSpawn<mw.Sound>(this._option.assetId)
                .then((value) => {
                    this._holdGo = value;
                    AssetController
                        .load(this._option.assetId)
                        .then(() => {
                            applySoundOption(this._holdGo, this._option);
                        });
                });
        }

    }

    public stop() {
    }

    public pause() {
    }

    public continue() {
    }

    public autoCheckPlayerEntered() {

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
