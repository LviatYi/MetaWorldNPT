class DimensionIncompatible extends Error {
    constructor(message: string = "Dimensions are incompatible") {
        super(message);
        this.name = "DimensionIncompatible";
    }
}

/**
 * Rectangle.
 * High dimensions allowed.
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
export default class Rectangle {
    public p1: number[];
    public p2: number[];

    public constructor(p1: number[], p2: number[]) {
        if (p1.length !== p2.length) {
            throw new Error("The dimension of two points must be equal.");
        }

        this.p1 = p1;
        this.p2 = p2;
    }

    public static Zero(dimension: number): Rectangle {
        return new Rectangle(new Array(dimension).fill(0), new Array(dimension).fill(0));
    }

    public static One(dimension: number): Rectangle {
        return new Rectangle(new Array(dimension).fill(1), new Array(dimension).fill(1));
    }

    public get dimension(): number {
        return this.p1.length;
    }

    public get weight(): number {
        let w = 1;
        for (let i = 0; i < this.dimension; ++i) {
            w *= this.p2[i] - this.p1[i];
        }
        return w;
    }

    /**
     * 增量超体积.
     * @return {number[]}
     */
    public get increaseWeight(): number[] {
        let w: number[] = [];
        let increase = 1;
        for (let i = 0; i < this.dimension; ++i) {
            let d = this.p2[i] - this.p1[i];
            if (d > 0) {
                increase *= d;
                w.push(increase);
            }
        }

        return w;
    }

    public get isPoint() {
        return this.p1.every((v, i) => v === this.p2[i]);
    }

    public hit(p: number[], epsilon: number = 0): boolean {
        if (p.length < this.dimension) throw new DimensionIncompatible();
        return p.every(
            (v, i) => v - this.p1[i] >= -epsilon && this.p2[i] - v >= -epsilon,
        );
    }

    public intersect(r: Rectangle, epsilon: number = 0): boolean {
        if (r.dimension < this.dimension) throw new DimensionIncompatible();
        return this.p1.every(
            (v, i) => r.p2[i] - v >= -epsilon && this.p2[i] - r.p1[i] >= -epsilon,
        );
    }

    public include(r: Rectangle, epsilon: number = 0): boolean {
        if (r.dimension < this.dimension) throw new DimensionIncompatible();
        return this.p1.every(
            (v, i) => r.p1[i] - v >= -epsilon && this.p2[i] - r.p2[i] >= -epsilon,
        );
    }

    public clone(): Rectangle {
        return new Rectangle([...this.p1], [...this.p2]);
    }

    public equal(r: Rectangle, epsilon: number = 0.1e-3): boolean {
        if (r.dimension < this.dimension) throw new DimensionIncompatible();
        return this.p1.every(
            (v, i) =>
                Math.abs(v - r.p1[i]) < epsilon &&
                Math.abs(this.p2[i] - r.p2[i]) < epsilon,
        );
    }
}

let boxWeightCache: Rectangle = undefined;

export function getGlobalRectangleCache(): Rectangle {
    if (boxWeightCache === undefined) {
        boxWeightCache = new Rectangle([], []);
    }
    return boxWeightCache;
}

export function getBoundingBox(r1: Rectangle, r2: Rectangle, out?: Rectangle): Rectangle {
    if (!r1 || !r2) {
        if (!r1 && !r2) return undefined;
        let valid = r1 ? r1 : r2;

        if (out) for (let i = 0; i < valid.dimension; ++i) {
            out.p1[i] = valid.p1[i];
            out.p2[i] = valid.p2[i];
        } else return valid.clone();
    }

    if (r1.dimension > r2.dimension) throw new DimensionIncompatible();

    const boxMin = out?.p1 ?? new Array<number>(r1.dimension);
    const boxMax = out?.p2 ?? new Array<number>(r1.dimension);

    for (let i = 0; i < r1.dimension; ++i) {
        boxMin[i] = Math.min(r1.p1[i], r2.p1[i]);
        boxMax[i] = Math.max(r1.p2[i], r2.p2[i]);
    }

    return out ? out : new Rectangle(boxMin, boxMax);
}

export function getBoundingBoxWeight(r1: Rectangle, r2: Rectangle): number {
    return getBoundingBox(r1, r2, getGlobalRectangleCache()).weight;
}

export function compareWeightByIncrease(r1: Rectangle, r2: Rectangle, useCache: boolean = false): number {
    let rw1 = r1.weight;
    let rw2 = r2.weight;
    if (rw1 !== 0 || rw2 !== 0) {
        if (rw1 > rw2) return 1;
        if (rw1 === rw2) return 0;
        return -1;
    }
    let rw1s = useCache ? getIncreaseWeightWithMemory(r1) : r1.increaseWeight;
    let rw2s = useCache ? getIncreaseWeightWithMemory(r2) : r2.increaseWeight;

    if (rw1s.length !== rw2s.length) {
        if (rw1s.length > rw2s.length) return 1;
        if (rw1s.length === rw2s.length) return 0;
        return -1;
    }

    let i = 0;
    for (; i < rw1s.length && i < rw2s.length; ++i) {
        if (rw1s[i] > rw2s[i]) return 1;
        if (rw1s[i] < rw2s[i]) return -1;
    }

    if (i < rw1s.length) return 1;
    else return -1;
}

const increaseWeightCacheMap: WeakMap<Rectangle, number[]> = new WeakMap();

export function getIncreaseWeightWithMemory(r: Rectangle): number[] {
    let result = increaseWeightCacheMap.get(r);
    if (!result) {
        result = r.increaseWeight;
        increaseWeightCacheMap.set(r, result);
    }

    return result;
}