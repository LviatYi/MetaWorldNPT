declare namespace actions {
    abstract class BaseAction<T> {
        private _tag;
        private _target;
        private _originalTarget;
        protected _duration: number;
        get target(): T;
        set target(value: T);
        getOriginalTarget(): T;
        startWithTarget(target: T): void;
        get originalTarget(): T;
        set tag(value: string);
        get tag(): string;
        stop(): void;
        release(): void;
        get duration(): number;
    }
}
declare namespace actions {
    /**
     * 有限时间动作，这种动作拥有时长 duration 属性。
     */
    abstract class FiniteTimeAction<T> extends BaseAction<T> implements IAction<T> {
        constructor(duration: number);
        abstract clone(): FiniteTimeAction<T>;
        abstract step(dt: number): any;
        abstract isDone(): boolean;
        abstract update(dt: number): any;
        abstract reverse(): FiniteTimeAction<T>;
        initWithDuration(d: number): void;
    }
}
declare namespace actions {
    abstract class InstanceAction<T> extends FiniteTimeAction<T> implements IAction<T> {
        constructor();
        step(dt: number): void;
        isDone(): boolean;
    }
}
declare namespace actions {
    /**
     *  时间间隔动作，这种动作在已定时间内完成
     */
    abstract class IntervalAction<T> extends FiniteTimeAction<T> {
        private _elapsed;
        private _isFirstTick;
        constructor(duration: number);
        abstract clone(): IntervalAction<T>;
        abstract reverse(): IntervalAction<T>;
        /**
         *
         * @param d
         * @returns
         */
        initWithDuration(d: number): boolean;
        isDone(): boolean;
        step(dt: number): void;
        abstract update(dt: number): any;
        startWithTarget(target: T): void;
        protected computeEaseTime(dt: number): number;
        get elapsed(): number;
    }
}
declare namespace actions {
    class SetAction<T> extends InstanceAction<T> {
        private _props;
        private _originProps;
        constructor(props?: TConstructorType<T>);
        init(props: TConstructorType<T>): boolean;
        update(dt: number): void;
        clone(): SetAction<T>;
        reverse(): SetAction<T>;
        release(): void;
    }
}
declare namespace actions {
    export interface ActionTarget extends Object {
        __signActionId?: number;
    }
    class ActionManager {
        private _elementPool;
        private _hashTargets;
        private _arrayTargets;
        private _currentTarget;
        private getElement;
        private putElement;
        addAction(action: actions.IAction<unknown>, target: ActionTarget, paused: boolean): void;
        removeAllActions(): void;
        removeAllActionsFromTarget(target: ActionTarget): void;
        removeAction(action: actions.IAction<ActionTarget>): void;
        private _removeActionByTag;
        removeActionByTag(tag: string, target?: ActionTarget): void;
        getActionByTag(tag: string, target: ActionTarget): IAction<unknown>;
        getNumberOfRunningActionsInTarget(target: ActionTarget): number;
        pauseTarget(target: ActionTarget): void;
        resumeTarget(target: ActionTarget): void;
        pauseAllRunningActions(): any[];
        resumeTargets(targetsToResume: ActionTarget[]): void;
        pauseTargets(targetsToPause: ActionTarget[]): void;
        private _removeActionAtIndex;
        private deleteHashElement;
        update(dt: number): void;
    }
    export const AcitonMgr: ActionManager;
    export { };
}
declare namespace actions {
    class CallFunAction<T> extends InstanceAction<T> implements IAction<T> {
        private func;
        private _thisArgs;
        private _passArgs;
        constructor(func: Function, thisArg: unknown, ...data: any[]);
        clone(): CallFunAction<T>;
        update(dt: number): void;
        reverse(): FiniteTimeAction<T>;
        private execute;
        release(): void;
    }
}
declare namespace actions {
    class DelayAction extends IntervalAction<any> implements IAction<any> {
        clone(): DelayAction;
        reverse(): DelayAction;
        update(dt: number): void;
    }
}
declare namespace actions {
    /**
     * 目前支持的Ease动画
     */
    enum Ease {
        Constant = "constant",
        Linear = "linear",
        /**平方曲线缓入函数。运动由慢到快。 */
        QuadIn = "quadIn",
        /**平方曲线缓出函数。运动由快到慢。 */
        QuadOut = "quadOut",
        QuadInOut = "quadInOut",
        QuadOutIn = "quadOutIn"
    }
    /**
     * 缓动函数类，为Tween提供缓动效果函数。
     * 函数效果演示： https://easings.net/
     *
     */
    class easing {
        static constant(): number;
        static linear(k: number): number;
        /**
         *
         * 平方曲线缓入函数。运动由慢到快。
         * @method quadIn
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value
         */
        static quadIn(k: number): number;
        /**
         * Easing out with quadratic formula. From fast to slow.
         * 平方曲线缓出函数。运动由快到慢。
         * @method quadOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value
         */
        static quadOut(k: number): number;
        /**
         *
         * 平方曲线缓入缓出函数。运动由慢到快再到慢。
         * @method quadInOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value
         */
        static quadInOut(k: number): number;
        /**
         * Easing in with cubic formula. From slow to fast.
         * 立方曲线缓入函数。运动由慢到快。
         * @method cubicIn
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static cubicIn(k: number): number;
        /**
         * Easing out with cubic formula. From slow to fast.
         * 立方曲线缓出函数。运动由快到慢。
         * @method cubicOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static cubicOut(k: number): number;
        /**
         * Easing in and out with cubic formula. From slow to fast, then back to slow.
         * 立方曲线缓入缓出函数。运动由慢到快再到慢。
         * @method cubicInOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static cubicInOut(k: number): number;
        /**
         * Easing in with quartic formula. From slow to fast.
         * 四次方曲线缓入函数。运动由慢到快。
         * @method quartIn
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static quartIn(k: number): number;
        /**
         * Easing out with quartic formula. From fast to slow.
         * 四次方曲线缓出函数。运动由快到慢。
         * @method quartOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static quartOut(k: number): number;
        /**
         * Easing in and out with quartic formula. From slow to fast, then back to slow.
         * 四次方曲线缓入缓出函数。运动由慢到快再到慢。
         * @method quartInOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static quartInOut(k: number): number;
        /**
         * Easing in with quintic formula. From slow to fast.
         * 五次方曲线缓入函数。运动由慢到快。
         * @method quintIn
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static quintIn(k: number): number;
        /**
         * Easing out with quintic formula. From fast to slow.
         * 五次方曲线缓出函数。运动由快到慢。
         * @method quintOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static quintOut(k: number): number;
        /**
         * Easing in and out with quintic formula. From slow to fast, then back to slow.
         * 五次方曲线缓入缓出函数。运动由慢到快再到慢。
         * @method quintInOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static quintInOut(k: number): number;
        /**
         * Easing in and out with sine formula. From slow to fast.
         * 正弦曲线缓入函数。运动由慢到快。
         * @method sineIn
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static sineIn(k: number): number;
        /**
         * Easing in and out with sine formula. From fast to slow.
         * 正弦曲线缓出函数。运动由快到慢。
         * @method sineOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static sineOut(k: number): number;
        /**
         * Easing in and out with sine formula. From slow to fast, then back to slow.
         * 正弦曲线缓入缓出函数。运动由慢到快再到慢。
         * @method sineInOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static sineInOut(k: number): number;
        /**
         * Easing in and out with exponential formula. From slow to fast.
         * 指数曲线缓入函数。运动由慢到快。
         * @method expoIn
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static expoIn(k: number): number;
        /**
         * Easing in and out with exponential formula. From fast to slow.
         * 指数曲线缓出函数。运动由快到慢。
         * @method expoOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static expoOut(k: number): number;
        /**
         * Easing in and out with exponential formula. From slow to fast.
         * 指数曲线缓入和缓出函数。运动由慢到很快再到慢。
         * @method expoInOut
         * @param {Number} t The current time as a percentage of the total time, then back to slow.
         * @return {Number} The correct value.
         */
        static expoInOut(k: number): number;
        /**
         * Easing in and out with circular formula. From slow to fast.
         * 循环公式缓入函数。运动由慢到快。
         * @method circIn
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static circIn(k: number): number;
        /**
         * Easing in and out with circular formula. From fast to slow.
         * 循环公式缓出函数。运动由快到慢。
         * @method circOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static circOut(k: number): number;
        /**
         * Easing in and out with circular formula. From slow to fast.
         * 指数曲线缓入缓出函数。运动由慢到很快再到慢。
         * @method circInOut
         * @param {Number} t The current time as a percentage of the total time, then back to slow.
         * @return {Number} The correct value.
         */
        static circInOut(k: number): number;
        /**
         * Easing in action with a spring oscillating effect.
         * 弹簧回震效果的缓入函数。
         * @method elasticIn
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static elasticIn(k: number): number;
        /**
         * Easing out action with a spring oscillating effect.
         * 弹簧回震效果的缓出函数。
         * @method elasticOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static elasticOut(k: number): number;
        /**
         * Easing in and out action with a spring oscillating effect.
         * 弹簧回震效果的缓入缓出函数。
         * @method elasticInOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static elasticInOut(k: number): number;
        /**
         * Easing in action with "back up" behavior.
         * 回退效果的缓入函数。
         * @method backIn
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static backIn(k: number): number;
        /**
         * Easing out action with "back up" behavior.
         * 回退效果的缓出函数。
         * @method backOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static backOut(k: number): number;
        /**
         * Easing in and out action with "back up" behavior.
         * 回退效果的缓入缓出函数。
         * @method backInOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static backInOut(k: number): number;
        /**
         * Easing in action with bouncing effect.
         * 弹跳效果的缓入函数。
         * @method bounceIn
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static bounceIn(k: number): number;
        /**
         * Easing out action with bouncing effect.
         * 弹跳效果的缓出函数。
         * @method bounceOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static bounceOut(k: number): number;
        /**
         * Easing in and out action with bouncing effect.
         * 弹跳效果的缓入缓出函数。
         * @method bounceInOut
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static bounceInOut(k: number): number;
        /**
         * Target will run action with smooth effect.
         * 平滑效果函数。
         * @method smooth
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static smooth(t: number): number;
        /**
         * Target will run action with fade effect.
         * 渐褪效果函数。
         * @method fade
         * @param {Number} t The current time as a percentage of the total time.
         * @return {Number} The correct value.
         */
        static fade(t: number): number;
        static quadOutIn: (k: number) => number;
        static cubicOutIn: (k: number) => number;
        static quartOutIn: (k: number) => number;
        static quintOutIn: (k: number) => number;
        static sineOutIn: (k: number) => number;
        static expoOutIn: (k: number) => number;
        static circOutIn: (k: number) => number;
        static backOutIn: (k: number) => number;
    }
}
declare namespace actions {
    class SequenceAction extends IntervalAction<any> {
        private _actions;
        private _split;
        private _lastIndex;
        private _reversed;
        constructor(...args: IAction<any>[]);
        clone(): SequenceAction;
        startWithTarget(target: unknown): void;
        stop(): void;
        reverse(): SequenceAction;
        initWithTwoActions(actionOne: IAction<any>, actionTwo: IAction<any>): boolean;
        update(dt: number): void;
        release(): void;
        static actionOneTwo(actionOne: IAction<any>, actionTwo: IAction<any>): SequenceAction;
    }
}
declare namespace actions {
    class SpawnAction extends IntervalAction<any> implements IAction<any> {
        private _one;
        private _two;
        constructor(...args: IAction<any>[]);
        initWithTwoActions(action1: IAction<any>, action2: IAction<any>): boolean;
        clone(): SpawnAction;
        startWithTarget(target: any): void;
        stop(): void;
        reverse(): SpawnAction;
        update(dt: number): void;
        static actionOneTwo(actionOne: IAction<any>, actionTwo: IAction<any>): SpawnAction;
        release(): void;
    }
}
declare namespace actions {
    interface IAction<T> {
        tag: string;
        originalTarget: T;
        duration: number;
        clone(): IAction<T>;
        isDone(): boolean;
        reverse(): IAction<T>;
        startWithTarget(target: T): any;
        stop(): any;
        step(dt: number): any;
        release(): any;
        update(dt: number): any;
    }
}
declare namespace actions {
    /**
     * 可变速率的action
     */
    class FlexSpeedAction<T> extends BaseAction<T> implements IAction<T> {
        private _innerAction;
        private _speed;
        set innerAction(value: IAction<T>);
        get innerAction(): IAction<T>;
        set speed(value: number);
        get speed(): number;
        constructor(action: IAction<T>, speed: number);
        private initWithAction;
        clone(): FlexSpeedAction<T>;
        isDone(): boolean;
        startWithTarget(target: any): void;
        step(dt: number): void;
        stop(): void;
        update(dt: number): void;
        reverse(): FlexSpeedAction<T>;
        release(): void;
    }
}
declare namespace actions.utils {
    interface IVector {
        x: number;
        y: number;
        z: number;
    }
    export class Bezier {
        static bezier(start: IVector, c1: IVector, c2: IVector, end: IVector, t: number): [number, number, number];
        static bezier(start: number, c1: number, c2: number, end: number, t: number): number;
    }
    export class CatmullRom {
        /**
         * 通过控制点以及张力以及插值返回样条曲线中的点
         * https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline
         * @param p0
         * @param p1
         * @param p2
         * @param p3
         * @param tension
         * @param t
         * @returns
         */
        static cardinalSplineAt(p0: IVector, p1: IVector, p2: IVector, p3: IVector, tension: number, t: number): [number, number, number];
        /**
         * 从控制点中取出一个点
         * @param controlPoints
         * @param pos
         * @returns
         */
        static getControlPointAt(controlPoints: number[], pos: number): number;
    }
    export { };
}
declare namespace actions {
    class RepeatAction<T> extends IntervalAction<T> implements IAction<T> {
        private _times;
        private _total;
        private _nextDt;
        private _actionInstant;
        private _innerAction;
        constructor(action: IAction<T>, times: number);
        initWithAction(action: IAction<T>, times: number): boolean;
        update(dt: number): void;
        clone(): RepeatAction<T>;
        startWithTarget(target: T): void;
        stop(): void;
        isDone(): boolean;
        reverse(): RepeatAction<T>;
        release(): void;
    }
}
declare namespace actions {
    class RepeatForeverAction<T> extends IntervalAction<T> implements IAction<T> {
        private _innerAction;
        constructor(action: IntervalAction<T>);
        update(dt: number): void;
        clone(): RepeatForeverAction<T>;
        reverse(): RepeatForeverAction<T>;
        startWithTarget(target: T): void;
        step(dt: number): void;
        isDone(): boolean;
        release(): void;
    }
}
declare type FlagExcludedType<Base, Type> = {
    [Key in keyof Base]: Base[Key] extends Type ? never : Key;
};
declare type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
declare type KeyPartial<T, K extends keyof T> = {
    [P in K]?: T[P];
};
declare type OmitType<Base, Type> = KeyPartial<Base, AllowedNames<Base, Type>>;
declare type TConstructorType<T> = OmitType<T, Function>;
declare namespace actions.tweens {
    import ActionInterval = actions.IntervalAction;
    import IAction = actions.IAction;
    import FiniteTimeAction = actions.FiniteTimeAction;
    type EaseFunc = (k: number) => number;
    interface ITweenObject {
        addition(target: ITweenObject, out?: ITweenObject): ITweenObject;
        multiply(target: ITweenObject, out?: ITweenObject): ITweenObject;
        lerp(to: ITweenObject, ratio: number, out?: ITweenObject): ITweenObject;
        clone(): ITweenObject;
    }
    interface IVector extends ITweenObject {
        x: number;
        y: number;
        z?: number;
    }
    interface ITweenOpts {
        progress?: (start: ITweenObject | number, end: ITweenObject | number, current: ITweenObject | number, t: number) => number | ITweenObject;
        easing?: EaseFunc | string;
        relative?: boolean;
        onUpdate?: (target: any, t: number) => void;
    }
    export function stopAll(): void;
    export function stopAllByTag(tag: string): void;
    export function stopAllByTarget(target: unknown): void;
    export class Tween<T extends actions.ActionTarget> {
        private _actions;
        private _finalAction;
        private _target;
        private _tag;
        private static _gid;
        get tag(): string;
        get originalTarget(): T;
        constructor(target: T);
        initWith(target: T): void;
        then(other: IAction<T> | Tween<T>): this;
        target(target: T): Tween<T>;
        start(): void;
        stop(): this;
        setTag(tag: string): this;
        clone(target?: any): Tween<T>;
        union(): this;
        private _union;
        private _wrapInternalAction;
        release(): void;
        /**
         * 添加一个对属性进行相对值计算的 action
         * @param duration 动作持续时间
         * @param props 要变更的属性 {location:Type.Vector(100,1001,100)} 或 {location:{value:Type.Vector(100,1001,100),easing:"ease",progress:"()=>{}"}}
         * @param opts 参数
         * @returns
         */
        to<OPTS extends Partial<ITweenOpts>>(duration: number, props: TConstructorType<T>, opts?: OPTS): Tween<T>;
        by<OPTS extends Partial<ITweenOpts>>(duration: number, props: TConstructorType<T>, opts?: OPTS): Tween<T>;
        set(props: TConstructorType<T>): this;
        delay(d: number): this;
        call(callBack: Function, selecttarget?: any, data?: any): this;
        /**
         * 添加一个队列Action
         * @param actions
         * @returns
         */
        sequence(action: (IAction<T> | Tween<T>), ...args: (IAction<T> | Tween<T>)[]): Tween<T>;
        /**
         * 添加一个并列Action
         * @param action
         * @param actions
         * @returns
         */
        parallel(...args: (FiniteTimeAction<T> | Tween<T>)[]): Tween<T>;
        repeat(repeatTimes: number, args?: IAction<T> | Tween<T>): Tween<T>;
        repeatForever(args?: ActionInterval<T> | Tween<T>): this;
        /**
         * 使用贝塞尔曲线移动到目标位置
         * @param duration 动作持续时间
         * @param c1 控制点1
         * @param c2 控制点2
         * @param to 要移动的目标点
         * @param opts
         * @returns
         */
        bezierTo(duration: number, c1: IVector, c2: IVector, to: IVector, opts?: ITweenOpts): Tween<T>;
        bezierBy(duration: number, c1: IVector, c2: IVector, to: IVector, opts?: ITweenOpts): Tween<T>;
        static isTween(obj: unknown): obj is Tween<any>;
    }
    export { };
}
declare namespace actions {
    function repeat<T>(times: number, action: IAction<T>): RepeatAction<T>;
    function repeatForever<T>(action: IntervalAction<T>): RepeatForeverAction<T>;
    function delay(time: number): DelayAction;
    function call(func: Function, thisArg: unknown, ...data: any[]): CallFunAction<unknown>;
    function spawn(...actions: IAction<any>[]): SpawnAction;
    function sequence(...actions: IAction<any>[]): SequenceAction;
    function speed(speed: number, action: IAction<any>): FlexSpeedAction<any>;
    function tween<T extends ActionTarget>(target: T): tweens.Tween<T>;
}

