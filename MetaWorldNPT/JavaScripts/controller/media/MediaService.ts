import { Delegate, Singleton } from "gtoolkit";

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

export interface ISoundConfig {
    /**
     * Config ID.
     */
    id: number;

    /**
     * Asset ID.
     */
    assetId: string;

    /**
     * 名称.
     */
    name?: string;

    /**
     * 循环次数
     * =0 不限次数
     * >0 指定次数
     */
    loopCount: number;

    /**
     * 音量大小
     */
    volume: number;

    /**
     * 是否是音效
     * 1 音效
     * 0 BGM
     */
    isEffect: boolean;

    /**
     * 是否是3D音效
     */
    isStereo: boolean;

    /**
     * 内部半径
     */
    innerRadius: number;

    /**
     * 衰减距离
     */
    falloffDistance: number;

    /**
     * 备注
     */
    ps: string;
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

export class GSoundProxy extends AMediaProxy {
    private _holdGo: mw.Sound | undefined;

    private _operationWaitForQueryInfo: Map<string, () => void> = new Map();

    private _queryInfo: { timeLength: number } = undefined;

    public play(startTime: number = 0,
                clipReadyTime: boolean = false,
                onSuccess?: () => void) {
        mw.SoundService
    }

    public stop() {
    }

    public pause() {
    }

    public continue() {
    }

    public onSampleDone() {

    }
}

// export class GEffectProxy extends AMediaProxy {
//
// }

function isClient(): boolean {
    return mw.SystemUtil.isClient();
}

function isServer(): boolean {
    return mw.SystemUtil.isServer();
}