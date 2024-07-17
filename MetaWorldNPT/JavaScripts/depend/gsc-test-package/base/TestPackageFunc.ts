export type TestHandler<P = undefined> = (p?: P) => void;

export abstract class FuncPackage<P = undefined> {
    constructor(public func: TestHandler<P>) {
    }
}

export class InitFuncPackage extends FuncPackage {
}

export class DelayFuncPackage extends FuncPackage {
    delay: number | undefined;

    constructor(func: TestHandler, delay?: number) {
        super(func);
        this.delay = delay;
    }
}

export class IntervalFuncPackage extends FuncPackage<number> {
}

export class TouchFuncPackage extends FuncPackage {
    key?: mw.Keys | undefined;

    constructor(func: TestHandler, key?: mw.Keys) {
        super(func);
        this.key = key;
    }
}

export class BenchFuncPackage extends FuncPackage {
    maxTime: number | undefined;

    constructor(func: TestHandler, maxTime?: number) {
        super(func);
        this.maxTime = maxTime;
    }
}

export type AllowFuncPackage = InitFuncPackage |
    DelayFuncPackage |
    IntervalFuncPackage |
    TouchFuncPackage |
    BenchFuncPackage;