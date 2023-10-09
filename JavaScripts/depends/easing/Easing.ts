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
 * readonly.
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
export class Vector2 {
    public readonly x: number;

    public readonly y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public static get zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public static get unit(): Vector2 {
        return new Vector2(1, 1);
    }

    public static get right(): Vector2 {
        return new Vector2(1, 0);
    }

    /**
     * Manhattan distance.
     */
    public get manhattanDist() {
        return Math.abs(this.x) + Math.abs(this.y);
    }

    /**
     * Euclidean distance.
     */
    public dist(rhs: Vector2 = Vector2.zero): number {
        return Math.sqrt(this.sqrDist(rhs));
    }

    /**
     * square of Euclidean distance.
     */
    public sqrDist(rhs: Vector2 = Vector2.zero): number {
        return (this.x - rhs.x) ** 2 + (this.y - rhs.y) ** 2;
    }

    public clone() {
        return new Vector2(this.x, this.y);
    }

    public opposite() {
        return new Vector2(-this.x, -this.y);
    }

    public add(rhs: Vector2): Vector2 {
        return new Vector2(
            this.x + rhs.x,
            this.y + rhs.y,
        );
    }

    public subtract(rhs: Vector2) {
        return new Vector2(
            this.x - rhs.x,
            this.y - rhs.y,
        );
    }

    public multiple(rhs: number | Vector2) {
        if (typeof rhs === "number") {
            return new Vector2(
                this.x * rhs,
                this.y * rhs,
            );
        } else {
            return new Vector2(
                this.x * rhs.x,
                this.y * rhs.y,
            );
        }
    }

    public divide(rhs: number | Vector2) {
        if (typeof rhs === "number") {
            return new Vector2(
                this.x / rhs,
                this.y / rhs,
            );
        } else {
            return new Vector2(
                this.x / rhs.x,
                this.y / rhs.y,
            );
        }
    }

    public toString() {
        return `[${this.x},${this.y}]`;
    }
}

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

    public static readonly ZERO = Vector2.zero;

    public static readonly UNIT = Vector2.unit;

    public static readonly RIGHT = Vector2.right;

    protected static readonly DEFAULT_GUESS_VALUE = 0.5;

    protected static readonly DEFAULT_NEWTON_TIME = 16;

    protected static readonly DEFAULT_PRECISION = 1e-6;

    protected static readonly PRECISION_CHECK_TOLERATION = 100;

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    protected _newtonTime: number = CubicBezier.DEFAULT_NEWTON_TIME;

//region Precision Config Member
    protected _precision: number = CubicBezier.DEFAULT_PRECISION;

    protected constructor(x1: number, y1: number, x2: number, y2: number) {
        this.setP1(x1, y1);
        this.setP2(x2, y2);

//region Points
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    protected _p0: Vector2;

    /**
     * P0.
     */
    public get p0(): Vector2 {
        return this._p0.clone();
    }

    protected _p1: Vector2;

    /**
     * P1.
     */
    public get p1(): Vector2 {
        return this._p1.clone();
    }

    protected _p2: Vector2;

    /**
     * P2.
     */
    public get p2(): Vector2 {
        return this._p2.clone();
    }

    protected _p3: Vector2;

    /**
     * P3.
     */
    public get p3(): Vector2 {
        return this._p3.clone();
    }

    /**
     * 设置初始锚点.
     * @param x
     * @param y
     */
    public setP1(x: number, y: number) {
        x = Easing.clamp01(x);
        this._p1 = new Vector2(x, y);
    }

    /**
     * 设置结束锚点.
     * @param x
     * @param y
     */
    public setP2(x: number, y: number) {
        x = Easing.clamp01(x);
        this._p2 = new Vector2(x, y);
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
     * curve of t.
     * @param t
     * @profession
     */
    public curve = (t: number): Vector2 => {
        return new Vector2(
            this.curveX(t),
            this.curveY(t),
        );
    };

    /**
     * curve x of t.
     * @param t
     * @profession
     */
    public curveX = (t: number): number => {
        const v = 1 - t;
        return this.p0.x * v * v * v + 3 * this.p1.x * v * v * t + 3 * this.p2.x * v * t * t + this.p3.x * t * t * t;
    };

    /**
     * curve y of t.
     * @param t
     * @profession
     */
    public curveY = (t: number): number => {
        const v = 1 - t;
        return this.p0.y * v * v * v + 3 * this.p1.y * v * v * t + 3 * this.p2.y * v * t * t + this.p3.y * t * t * t;
    };

    /**
     * sub Cubic Bezier of current curve from new p0[p0] to new p3[curveX(cutT),curveY(cutT)].
     * @param cutT
     * @param u
     */
    public firstSubCurve = (cutT: number, u: number): Vector2 => {
        return new Vector2(
            this.firstSubCurveX(cutT, u),
            this.firstSubCurveY(cutT, u),
        );
    };

    /**
     * x of sub Cubic Bezier of current curve from new p0[p0] to new p3[curveX(cutT),curveY(cutT)].
     * @param cutT
     * @param u
     */
    public firstSubCurveX = (cutT: number, u: number): number => {
        const t = u * cutT;
        const d = 1 - t;
        return this.p0.x * d * d * d + 3 * this.p1.x * d * d * t + this.p2.x * d * t * t + this.p3.x * t * t * t;
    };

    /**
     * y of sub Cubic Bezier of current curve from new p0[p0] to new p3[curveX(cutT),curveY(cutT)].
     * @param cutT
     * @param u
     */
    public firstSubCurveY = (cutT: number, u: number) => {
        const t = u * cutT;
        const d = 1 - t;
        return this.p0.y * d * d * d + 3 * this.p1.y * d * d * t + this.p2.y * d * t * t + this.p3.y * t * t * t;
    };

    /**
     *
     * @param t
     * @profession
     */
    public firstSubCurveP0(t: number): Vector2 {
        return this.p0.clone();
    }

    /**
     *
     * @param t
     * @profession
     */
    public firstSubCurveP1(t: number): Vector2 {
        const p0 = this.p0;
        const p1 = this.p1;
        return new Vector2(
            p0.x + (p1.x - p0.x) * t,
            p0.y + (p1.y - p0.y) * t,
        );
    }

    /**
     *
     * @param t
     * @profession
     */
    public firstSubCurveP2(t: number): Vector2 {
        const p1 = this.p1;
        const p2 = this.p2;
        const g: Vector2 = new Vector2(
            p1.x + (p2.x - p1.x) * t,
            p1.y + (p2.y - p1.y) * t,
        );
        const f: Vector2 = this.firstSubCurveP1(t);
        return new Vector2(
            f.x + (g.x - f.x) * t,
            f.y + (g.y - f.y) * t,
        );
    }

    /**
     *
     * @param t
     * @profession
     */
    public firstSubCurveP3(t: number): Vector2 {
        return new Vector2(
            this.curveX(t),
            this.curveY(t),
        );
    }

    /**
     * 非线性函数 curveX(t) = x 的近似解.
     * @param x
     * @profession
     */
    public getT = (x: number): number => {
        let t = CubicBezier.DEFAULT_GUESS_VALUE;
        let simulateX: number;

        for (let i = 0; i < this._newtonTime; i++) {
            simulateX = this.curveX(t);
            if (Math.abs(simulateX - x) < this._precision) {
                break;
            }

            const d = this.derivativeCurveX(t);
            if (d === Infinity || d === 0) {
                t = (t + (x < simulateX ? 0 : 1)) / 2;
                i--;
            } else {
                t = t - (simulateX - x) / d;
            }
        }

        if (Math.abs(simulateX - x) > this._precision * CubicBezierBase.PRECISION_CHECK_TOLERATION) {
            console.log(`Error is too large. It is recommended to adjust the precision. current is ${simulateX} but want ${x}`);
        }

        return t;
    };

    /**
     * first derivative CurveX of t.
     * @param t
     * @profession
     */
    public derivativeCurveX = (t: number): number => {
        const d = 1 - t;
        return 3 * this.p1.x * (d * d - 2 * d * t) + 3 * this.p2.x * (-t * t + 2 * d * t) + 3 * t * t;
    };

    /**
     * first derivative CurveY of t.
     * @param t
     * @profession
     */
    public derivativeCurveY = (t: number): number => {
        const d = 1 - t;
        return 3 * this.p1.y * (d * d - 2 * d * t) + 3 * this.p2.y * (-t * t + 2 * d * t) + 3 * t * t;
    };

    /**
     * first derivative of t.
     * @param t
     * @profession
     */
    public derivative = (t: number): number => {
        return this.derivativeCurveY(t) / this.derivativeCurveX(t);
    };

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Debug
    public logState(): void {
        console.log(`Bezier State: 
    p1: ${this.p1},
    p2: ${this.p2}`);
    }

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

//region Smooth Bezier Strategy

/**
 * 贝塞尔曲线平滑策略.
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
export abstract class SmoothBezierStrategy {
//region Constant
    protected static readonly DEFAULT_DIR: Vector2 = Vector2.right;
//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    protected _bezier1: CubicBezierBase;

    protected _bezier2: CubicBezierBase;

    protected _t: number;

    protected _scaleX1: number;

    protected _scaleY1: number;

    protected _scaleX2: number;

    protected _scaleY2: number;

    protected _isReg: boolean;

    protected constructor() {
    }

    /**
     * t 点作为 p3 时 p2 的负方向.
     * @protected
     */
    protected get currDir(): Vector2 {
        let currDir: Vector2 = this._bezier1.firstSubCurveP2(this._t);
        return currDir = new Vector2(
            this._bezier1.curveX(this._t) - currDir.x,
            this._bezier1.curveY(this._t) - currDir.y,
        );
    }

    protected get scaledP1() {
        return this.currDir.multiple(new Vector2(this._scaleX1, this._scaleY1));
    }

    protected get scaledP2() {
        return ((this._isReg ? CubicBezierBase.RIGHT : CubicBezierBase.UNIT)
            .add(this._bezier2.p2
                .subtract(this._bezier2.p3)))
            .multiple(new Vector2(this._scaleX2, this._scaleY2));
    }

    /**
     * 获取策略.
     * @return [p1,p2]
     */
    public abstract getStrategy(
        bezier1: CubicBezierBase,
        bezier2: CubicBezierBase,
        t: number,
        scaleX1: number,
        scaleY1: number,
        scaleX2: number,
        scaleY2: number,
        isReg: boolean,
    ): [Vector2, Vector2];

    protected init(
        bezier1: CubicBezierBase,
        bezier2: CubicBezierBase,
        t: number,
        scaleX1: number,
        scaleY1: number,
        scaleX2: number,
        scaleY2: number,
        isReg: boolean,
    ): void {
        this._bezier1 = bezier1;
        this._bezier2 = bezier2;
        this._t = t;
        this._scaleX1 = scaleX1;
        this._scaleY1 = scaleY1;
        this._scaleX2 = scaleX2;
        this._scaleY2 = scaleY2;
        this._isReg = isReg;
    }
}

/**
 * 默认策略.
 */
export class DefaultSmoothBezierStrategy extends SmoothBezierStrategy {
    private readonly _minDist: number;

    constructor(minDist: number = 0.2) {
        super();
        this._minDist = minDist;
    }

    public override getStrategy(
        bezier1: CubicBezierBase,
        bezier2: CubicBezierBase,
        t: number,
        scaleX1: number,
        scaleY1: number,
        scaleX2: number,
        scaleY2: number,
        isReg: boolean,
    ): [Vector2, Vector2] {
        this.init(
            bezier1,
            bezier2,
            t,
            scaleX1,
            scaleY1,
            scaleX2,
            scaleY2,
            isReg,
        );

        return [this.scaledP1, this.scaledP2];
    }
}

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

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
 * @version 2.6.4b
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
     * cut bezier1 at t and connect to bezier2 with smoothing.
     * return a new CubicBezierBase with p1 from current direction and p2 from bezier2.p2.
     *
     * @param easing1
     * @param easing2
     * @param cutXorT default 1.
     * @param scaleX1 default 1.
     * @param scaleY1 default 1.
     * @param scaleX2 default 1.
     * @param scaleY2 default 1.
     * @param isReg 是否 回归.
     * @param isX is cut in x.
     * @param strategy
     * @see CubicBezierBase
     * @profession
     */
    public static smoothBezier(easing1: CubicBezier | EasingFunction,
                               easing2: CubicBezier,
                               cutXorT: number = 1,
                               scaleX1: number = 1,
                               scaleY1: number = 1,
                               scaleX2: number = 1,
                               scaleY2: number = 1,
                               isReg: boolean = true,
                               isX: boolean = true,
                               strategy: SmoothBezierStrategy = new DefaultSmoothBezierStrategy()): CubicBezier {
        let newP1: Vector2;
        let newP2: Vector2;
        if (easing1 instanceof CubicBezierBase) {
            if (isX) {
                cutXorT = easing1.getT(cutXorT);
            }
            [newP1, newP2] = strategy.getStrategy(
                easing1,
                easing2,
                cutXorT,
                scaleX1,
                scaleY1,
                scaleX2,
                scaleY2,
                isReg,
            );
        } else {
            const d1 = Easing.getFirstDerivation(easing1)(cutXorT);
            const d2 = Easing.getSecondDerivation(easing1)(cutXorT);
            const angle = Math.atan(d1);
            newP1 = new Vector2(Math.cos(angle), Math.sin(angle)).multiple(d2);
            newP2 = new Vector2(1 / 2, isReg ? 0 : 1);
        }

        return isReg ?
            new RegCubicBezier(
                newP1.x,
                newP1.y,
                newP2.x,
                newP2.y,
            ) :
            new CubicBezier(
                newP1.x,
                newP1.y,
                newP2.x,
                newP2.y,
            );
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
        const points: Vector2[] = [];

        let x = from;
        while (x < to) {
            points.push(new Vector2(x, func(x)));
            x += epsilon;
        }
        if (x !== to) {
            points.push(new Vector2(to, func(to)));
        }
        return points;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}