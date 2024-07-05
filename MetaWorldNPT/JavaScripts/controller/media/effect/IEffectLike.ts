export interface IEffectLike {
    parent: mw.GameObject | undefined;

    localTransform: { position: mw.Vector | undefined };

    worldTransform: { position: mw.Vector | undefined };

    get loop(): boolean;

    loopCount: number;

    duration: number;

    get effect(): {
        CascadeParticleSystemComponent: {
            CustomTimeDilation: number
        }
    };

    play(): void;

    stop(): void;

    setFloat(parameterName: string, value: number): void;

    setFloatRandom(parameterName: string, maxValue: number, minValue: number): void;

    setVector(parameterName: string, value: mw.Vector): void;

    setVectorRandom(parameterName: string, maxValue: mw.Vector, minValue: mw.Vector): void;

    setColor(parameterName: string, value: mw.LinearColor): void;

    setColorRandom(parameterName: string, maxValue: mw.LinearColor, minValue: mw.LinearColor): void;

    setCullDistance(inCullDistance: number): void;

    onFinish: mw.MulticastDelegate<() => void>;

    destroy(): void;
}