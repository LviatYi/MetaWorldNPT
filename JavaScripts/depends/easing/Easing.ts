export type EasingFunction = (x: number) => number;

const pow = Math.pow;
const sin = Math.sin;
const cos = Math.cos;
const sqrt = Math.sqrt;
const PI = Math.PI;
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * PI) / 3;
const c5 = (2 * PI) / 4.5;

/**
 * Vector 2.
 * [x,y]
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
type Vector2 = [number, number];

const VECTOR2_ZERO: Vector2 = [0, 0];
const VECTOR2_UNIT: Vector2 = [1, 1];
const VECTOR2_RIGHT: Vector2 = [1, 0];

/**
 * Cubic Bezier Base.
 * 三阶贝塞尔函数基类.
 *
 * 使用 Newton 迭代法逼近 x 值.
 * CubicBezier 将是一个关于 t 的参数方程.
 * 对于输入的 x 值 将使用牛顿迭代法得出 t 得出 curveX(t) 以模拟 x.
 * 允许设定迭代次数与精度.
 */
export abstract class CubicBezierBase {
//region Constant

    protected static readonly ZERO = VECTOR2_ZERO;

    protected static readonly UNIT = VECTOR2_UNIT;

    protected static readonly RIGHT = VECTOR2_RIGHT;

    protected static readonly DEFAULT_GUESS_VALUE = 0.5;

    protected static readonly DEFAULT_NEWTON_TIME = 16;

    protected static readonly DEFAULT_PRECISION = 1e-6;
//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Precision Config Member

    protected _newtonTime: number = CubicBezier.DEFAULT_NEWTON_TIME;

    protected _precision: number = CubicBezier.DEFAULT_PRECISION;

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    protected constructor(x1: number, y1: number, x2: number, y2: number) {
        this.setP1(x1, y1);
        this.setP2(x2, y2);

//region Points
    }

    protected _p0: Vector2;
    /**
     * P0.
     */
    public get p0(): Vector2 {
        return this._p0;
    }

    protected _p1: Vector2;

    /**
     * P1.
     */
    public get p1(): Vector2 {
        return this._p1;
    }

    protected _p2: Vector2;

    /**
     * P2.
     */
    public get p2(): Vector2 {
        return this._p2;
    }

    protected _p3: Vector2;

    /**
     * P3.
     */
    public get p3(): Vector2 {
        return this._p3;
    }

    /**
     * 设置初始锚点.
     * @param x
     * @param y
     */
    public setP1(x: number, y: number) {
        x = Easing.clamp01(x);
        this._p1 = [x, y];
    }

    /**
     * 设置结束锚点.
     * @param x
     * @param y
     */
    public setP2(x: number, y: number) {
        x = Easing.clamp01(x);
        this._p2 = [x, y];
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Precision Config

    /**
     * 设置牛顿迭代次数.
     *
     * 每次牛顿迭代将指数级提高 curveX(t) 对 x 的接近程度.
     * @param value 模拟次数.
     */
    public setNewtonTimes(value: number) {
        this._newtonTime = value;
    }

    /**
     * 设置精度.
     *
     * 当达到精度时停止牛顿迭代.
     */
    public setPrecision(value: number) {
        this._precision = value;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Math

    /**
     * bezier 函数.
     * @param x
     * @param clamp is clamp x in [0,1].
     */
    public bezier = (x: number, clamp: boolean = true): number => {
        if (clamp) {
            x = Easing.clamp01(x);
        }

        return this.curveY(this.getT(x));
    };

    /**
     * curve x of t.
     * @param t
     * @professsion
     */
    public curveX = (t: number): number => {
        let v = 1 - t;
        return this.p0[0] * v * v * v + 3 * this.p1[0] * v * v * t + 3 * this.p2[0] * v * t * t + this.p3[0] * t * t * t;
    };

    /**
     * curve y of t.
     * @param t
     * @professsion
     */
    public curveY = (t: number): number => {
        let v = 1 - t;
        return this.p0[1] * v * v * v + 3 * this.p1[1] * v * v * t + 3 * this.p2[1] * v * t * t + this.p3[1] * t * t * t;
    };

    /**
     * 非线性函数 curveX(t) = x 的近似解.
     * @param x
     */
    public getT = (x: number): number => {
        let t = CubicBezier.DEFAULT_GUESS_VALUE;
        let simulateX: number;

        for (let i = 0; i < this._newtonTime; i++) {
            t = t - (this.curveX(t) - x) / this.derivativeCurveX(t);
            simulateX = this.curveX(t);
            if (Math.abs(simulateX - x) < this._precision) {
                break;
            }
        }

//region Exist for Test
        if (Math.abs(simulateX - x) > this._precision * 100) {
            console.log(`Error is too large. It is recommended to adjust the precision. current is ${simulateX} but want ${x}`);
        }
//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

        return t;
    };

    /**
     * first derivative curve x of t.
     * @param t
     * @professsion
     */
    public derivativeCurveX = (t: number): number => {
        const d = 1 - t;
        return 3 * this.p1[0] * (d * d - 2 * d * t) + 3 * this.p2[0] * (-t * t + 2 * d * t) + 3 * t * t;
    };

    /**
     * first derivative curve y of t.
     * @param t
     * @professsion
     */
    public derivativeCurveY = (t: number): number => {
        const d = 1 - t;
        return 3 * this.p1[1] * (d * d - 2 * d * t) + 3 * this.p2[1] * (-t * t + 2 * d * t) + 3 * t * t;
    };
//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

/**
 * Cubic Bezier.
 * 三阶贝塞尔函数.
 * 具有固定的 P0(0,0) P3(1,1).
 * 允许设定锚点 P1 P2. 锚点 x 将限定在 [0,1].
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @see https://cubic-bezier.com/
 * @see https://www.geogebra.org/graphing/mfgtqbbp
 */
export class CubicBezier extends CubicBezierBase {
    public constructor(x1: number, y1: number, x2: number, y2: number) {
        super(x1, y1, x2, y2);
        this._p0 = CubicBezierBase.ZERO;
        this._p3 = CubicBezierBase.UNIT;
    }
}

/**
 * Regressive Cubic Bezier.
 * 三阶回归贝塞尔函数.
 * 具有固定的 P0(0,0) P3(1,0).
 * 允许设定锚点 P1 P2. 锚点 x 将限定在 [0,1].
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class RegCubicBezier extends CubicBezierBase {
    public constructor(x1: number, y1: number, x2: number, y2: number) {
        super(x1, y1, x2, y2);
        this._p0 = CubicBezierBase.ZERO;
        this._p3 = CubicBezierBase.RIGHT;
    }
}

/**
 * Easing functions.
 * 强大的 Easing 函数库.
 * 附赠一个 CubicBezier 实现.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @version 2.0.0b
 * @see https://easings.net/
 * @see https://cubic-bezier.com/
 * @see https://www.geogebra.org/graphing/mfgtqbbp
 */
export default class Easing {
    /**
     * linear curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static linear: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x;
    };

    /**
     * easeInQuad curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInQuad: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x * x;
    };

    /**
     * easeOutQuad curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeOutQuad: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return 1 - (1 - x) * (1 - x);
    };

    /**
     * easeInOutQuad curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInOutQuad: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
    };

    /**
     * easeInCubic curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInCubic: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x * x * x;
    };

    /**
     * easeOutCubic curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeOutCubic: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return 1 - pow(1 - x, 3);
    };

    /**
     * easeInOutCubic curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInOutCubic: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
    };

    /**
     * easeInQuart curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInQuart: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x * x * x * x;
    };

    /**
     * easeOutQuart curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeOutQuart: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return 1 - pow(1 - x, 4);
    };

    /**
     * easeInOutQuart curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInOutQuart: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
    };

    /**
     * easeInQuint curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInQuint: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x * x * x * x * x;
    };

    /**
     * easeOutQuint curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeOutQuint: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return 1 - pow(1 - x, 5);
    };

    /**
     * easeInOutQuint curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInOutQuint: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
    };

    /**
     * easeInSine curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInSine: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return 1 - cos((x * PI) / 2);
    };

    /**
     * easeOutSine curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeOutSine: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return sin((x * PI) / 2);
    };

    /**
     * easeInOutSine curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInOutSine: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return -(cos(PI * x) - 1) / 2;
    };

    /**
     * easeInExpo curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInExpo: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x === 0 ? 0 : pow(2, 10 * x - 10);
    };

    /**
     * easeOutExpo curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeOutExpo: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x === 1 ? 1 : 1 - pow(2, -10 * x);
    };

    /**
     * easeInOutExpo curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInOutExpo: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? pow(2, 20 * x - 10) / 2
                    : (2 - pow(2, -20 * x + 10)) / 2;
    };

    /**
     * easeInCirc curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInCirc: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return 1 - sqrt(1 - pow(x, 2));
    };

    /**
     * easeOutCirc curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeOutCirc: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return sqrt(1 - pow(x - 1, 2));
    };

    /**
     * easeInOutCirc curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInOutCirc: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x < 0.5
            ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
            : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
    };

    /**
     * easeInBack curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInBack: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return c3 * x * x * x - c1 * x * x;
    };

    /**
     * easeOutBack curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeOutBack: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
    };

    /**
     * easeInOutBack curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInOutBack: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x < 0.5
            ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    };

    /**
     * easeInElastic curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInElastic: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x === 0
            ? 0
            : x === 1
                ? 1
                : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
    };

    /**
     * easeOutElastic curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeOutElastic: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x === 0
            ? 0
            : x === 1
                ? 1
                : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
    };

    /**
     * easeInOutElastic curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInOutElastic: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
                    : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
    };

    /**
     * easeInBounce curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInBounce: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return 1 - this.easeInOutBounce(1 - x);
    };

    /**
     * easeOutBounce curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeOutBounce: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    };

    /**
     * easeInOutBounce curve.
     * @param x
     * @param clamp is clamp x in [0,1].
     * @return y
     * @static
     * @public
     */
    public static easeInOutBounce: EasingFunction = (x: number, clamp: boolean = true) => {
        if (clamp) {
            x = this.clamp01(x);
        }
        return x < 0.5
            ? (1 - this.easeInOutBounce(1 - 2 * x)) / 2
            : (1 + this.easeInOutBounce(2 * x - 1)) / 2;
    };

    /**
     * cubic bezier.
     * create bezier by P1,P2.
     * x1 and x2 will be clamped in [0,1].
     */
    public static cubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction {
        return (new CubicBezier(x1, y1, x2, y2)).bezier;
    }

    /**
     * regressive cubic bezier.
     * create bezier by P1,P2.
     * x1 and x2 will be clamped in [0,1].
     */
    public static regCubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction {
        return (new RegCubicBezier(x1, y1, x2, y2)).bezier;
    }

    /**
     * return input clamped in [min,max].
     * @param input
     * @param min
     * @param max
     */
    public static clamp(input: number, min: number, max: number) {
        return Math.max(min, Math.min(max, input));
    }

    /**
     return input clamped in [0,1].
     * return input clamped.
     * @param input
     */
    public static clamp01(input: number) {
        return this.clamp(input, 0, 1);
    }

    /**
     * get first derivation.
     * @param easing
     * @param d
     */
    public static getFirstDerivation(easing: EasingFunction, d: number = 1e-6) {
        return (x: number) => {
            return (easing(x + d) - easing(x - d)) / 2 / d;
        };
    }

    /**
     * first derivative.
     * @param easing
     * @param x
     * @param d
     */
    public static firstDerivative(easing: EasingFunction, x: number, d: number = 1e-6) {
        return Easing.getFirstDerivation(easing, d)(x);
    }

    /**
     * get second derivation.
     * @param easing
     * @param d
     */
    public static getSecondDerivation(easing: EasingFunction, d: number = 1e-6) {
        const firstDerivation = Easing.getFirstDerivation(easing, d);
        return (x: number) => {
            return (firstDerivation(x + d) - firstDerivation(x - d)) / 2 / d;
        };
    }

    /**
     * second derivative.
     * @param easing
     * @param x
     * @param d
     */
    public static secondDerivative(easing: EasingFunction, x: number, d: number = 1e-6) {
        return Easing.getSecondDerivation(easing, d)(x);
    }

//region Util
    /**
     * sample given function in [from,to].
     * @param func function want sample.
     * @param from
     * @param to
     * @param epsilon default 1e-6.
     */
    public static sampleFunc(func: (x: number) => number, from: number = 0, to: number = 1, epsilon: number = 1e-3): Vector2[] {
        let points: [number, number][] = [];

        let x = from;
        while (x < to) {
            points.push([x, func(x)]);
            x += epsilon;
        }
        if (x !== to) {
            points.push([to, func(to)]);
        }
        return points;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}