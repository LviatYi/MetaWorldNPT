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
class Vector2 {
    /**
     * (0,0)
     */
    public static get zero() {
        return new Vector2(0, 0);
    }

    /**
     * (1,1)
     */
    public static get unit() {
        return new Vector2(1, 1);
    }

    /**
     * (0,1)
     */
    public static get up() {
        return new Vector2(0, 1);
    }

    /**
     * (0,-1)
     */
    public static get down() {
        return new Vector2(0, -1);
    }

    /**
     * (-1,0)
     */
    public static get left() {
        return new Vector2(-1, 0);
    }

    /**
     * (1,0)
     */
    public static get right() {
        return new Vector2(1, 0);
    }

    public x: number;

    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Cubic Bezier.
 * 三阶贝塞尔函数.
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
export class CubicBezier {
    private static readonly _zero = Vector2.zero;

    private static readonly _unit = Vector2.unit;

    private _p1: Vector2;

    private _p2: Vector2;

    public get p0(): Vector2 {
        return CubicBezier._zero;
    }

    public get p1(): Vector2 {
        return this._p1;
    }

    public setP1(x: number, y: number) {
        this._p1 = new Vector2(x, y);
    }

    public get p2(): Vector2 {
        return this._p2;
    }

    public setP2(x: number, y: number) {
        this._p2 = new Vector2(x, y);
    }

    public get p3(): Vector2 {
        return CubicBezier._unit;
    }

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.setP1(x1, y1);
        this.setP2(x2, y2);
    }

    public curveX(t: number): number {
        const d = 1 - t;
        return 3 * this.p1.x * d * d * t + 3 * this.p2.x * d * t * t + t * t * t;
    }

    public curveY(t: number): number {
        const d = 1 - t;
        return 3 * this.p1.y * d * d * t + 3 * this.p2.y * d * t * t + t * t * t;
    }

    public derivativeCurveX(t: number) {
        const d = 1 - t;
        return 3 * this.p1.x * (d * d - 2 * d * t) + 3 * this.p2.x * (-t * t + 2 * d * t) + 3 * t * t;
    }

    public func = (x: number): number => {
        const d = 1 - x;
        return 3 * d * d * x * this.p1.y + 3 * d * x * x * this.p2.y + x * x * x;
    };
}

/**
 * Easing functions.
 *
 * all range of easing functions is [0,1].
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @version 1.0.2a
 * @see https://easings.net/
 */
export default class Easing {
    /**
     * linear curve.
     * @return y in [0,1]
     * @static
     * @public
     */
    public static linear: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x;
    };

    /**
     * easeInQuad curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInQuad: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x * x;
    };

    /**
     * easeOutQuad curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeOutQuad: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return 1 - (1 - x) * (1 - x);
    };

    /**
     * easeInOutQuad curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInOutQuad: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
    };

    /**
     * easeInCubic curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInCubic: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x * x * x;
    };

    /**
     * easeOutCubic curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeOutCubic: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return 1 - pow(1 - x, 3);
    };

    /**
     * easeInOutCubic curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInOutCubic: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
    };

    /**
     * easeInQuart curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInQuart: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x * x * x * x;
    };

    /**
     * easeOutQuart curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeOutQuart: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return 1 - pow(1 - x, 4);
    };

    /**
     * easeInOutQuart curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInOutQuart: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
    };

    /**
     * easeInQuint curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInQuint: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x * x * x * x * x;
    };

    /**
     * easeOutQuint curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeOutQuint: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return 1 - pow(1 - x, 5);
    };

    /**
     * easeInOutQuint curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInOutQuint: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
    };

    /**
     * easeInSine curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInSine: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return 1 - cos((x * PI) / 2);
    };

    /**
     * easeOutSine curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeOutSine: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return sin((x * PI) / 2);
    };

    /**
     * easeInOutSine curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInOutSine: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return -(cos(PI * x) - 1) / 2;
    };

    /**
     * easeInExpo curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInExpo: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x === 0 ? 0 : pow(2, 10 * x - 10);
    };

    /**
     * easeOutExpo curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeOutExpo: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x === 1 ? 1 : 1 - pow(2, -10 * x);
    };

    /**
     * easeInOutExpo curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInOutExpo: EasingFunction = (x: number) => {
        x = this.clamp01(x);
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
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInCirc: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return 1 - sqrt(1 - pow(x, 2));
    };

    /**
     * easeOutCirc curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeOutCirc: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return sqrt(1 - pow(x - 1, 2));
    };

    /**
     * easeInOutCirc curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInOutCirc: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x < 0.5
            ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
            : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
    };

    /**
     * easeInBack curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInBack: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return c3 * x * x * x - c1 * x * x;
    };

    /**
     * easeOutBack curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeOutBack: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
    };

    /**
     * easeInOutBack curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInOutBack: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x < 0.5
            ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    };

    /**
     * easeInElastic curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInElastic: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x === 0
            ? 0
            : x === 1
                ? 1
                : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
    };

    /**
     * easeOutElastic curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeOutElastic: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x === 0
            ? 0
            : x === 1
                ? 1
                : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
    };

    /**
     * easeInOutElastic curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInOutElastic: EasingFunction = (x: number) => {
        x = this.clamp01(x);
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
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInBounce: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return 1 - this.easeInOutBounce(1 - x);
    };

    /**
     * easeOutBounce curve.
     * @param x
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeOutBounce: EasingFunction = (x: number) => {
        x = this.clamp01(x);
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
     * @return y in [0,1]
     * @static
     * @public
     */
    public static easeInOutBounce: EasingFunction = (x: number) => {
        x = this.clamp01(x);
        return x < 0.5
            ? (1 - this.easeInOutBounce(1 - 2 * x)) / 2
            : (1 + this.easeInOutBounce(2 * x - 1)) / 2;
    };

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
     * return input clamped in [0,1].
     * @param input
     */
    public static clamp01(input: number) {
        return this.clamp(input, 0, 1);
    }

    /**
     * cubic bezier.
     * create bezier by
     */
    public static cubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction {
        return (new CubicBezier(x1, y1, x2, y2)).func;
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
}