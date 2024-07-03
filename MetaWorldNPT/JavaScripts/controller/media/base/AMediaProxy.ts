import { Delegate } from "gtoolkit";

export interface IMediaEvent {
    onPlay: Delegate.SimpleDelegate;

    onPause: Delegate.SimpleDelegate;

    onContinue: Delegate.SimpleDelegate;

    onStop: Delegate.SimpleDelegate;

    /**
     * 单次播放完成.
     * @desc {number: 剩余次数. 循环播放时返回 undefined.}
     */
    onFinish: Delegate.SimpleDelegate<number | undefined>;

    onDestroy: Delegate.SimpleDelegate;
}

export abstract class AMediaProxy<O extends mw.Sound | mw.Effect> implements IMediaEvent {
    /**
     * 原生 mw 对象.
     * 将立即触发 load.
     * @return {Promise<O>}
     */
    public abstract get o(): Promise<O>

    public debug: boolean = false;

    public onPlay: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    public onPause: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    public onContinue: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    public onStop: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    public onFinish: Delegate.SimpleDelegate<number | undefined> = new Delegate.SimpleDelegate();

    public onDestroy: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();
}