import { Delegate } from "gtoolkit";

export interface IMediaEvent {
    onPlay: Delegate.SimpleDelegate;

    onPause: Delegate.SimpleDelegate;

    onContinue: Delegate.SimpleDelegate;

    onStop: Delegate.SimpleDelegate;

    /**
     * 播放完成.
     * @desc 循环播放时不会触发.
     * @desc 指定次数循环时, 最后一次播放完成时触发.
     */
    onFinish: Delegate.SimpleDelegate;

    onDestroy: Delegate.SimpleDelegate;
}

export abstract class AMediaProxy implements IMediaEvent {
    public onPlay: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    public onPause: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    public onContinue: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    public onStop: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    public onFinish: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    public onDestroy: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();
}