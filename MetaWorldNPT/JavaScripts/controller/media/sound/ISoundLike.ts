import { IPoint3 } from "gtoolkit";

export interface ISoundLike {
    parent: mw.GameObject | undefined;

    localTransform: { position: IPoint3 };

    worldTransform: { position: IPoint3 };

    get timeLength(): number | undefined;

    isLoop: boolean;

    get playState(): SoundPlayState;

    play(startTime?: number): void;

    stop(): void;

    pause(bPause?: boolean): void;

    destroy(): void;

    onFinish: mw.MulticastDelegate<() => void>;

    onPlay: mw.MulticastDelegate<() => void>;

    onPause: mw.MulticastDelegate<() => void>;
}
