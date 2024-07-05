export interface ISoundLike {
    parent: mw.GameObject | undefined;

    localTransform: { position: mw.Vector | undefined };

    worldTransform: { position: mw.Vector | undefined };

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
