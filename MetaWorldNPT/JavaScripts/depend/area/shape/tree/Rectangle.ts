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

    public get isPoint() {
        return this.p1.every((v, i) => v === this.p2[i]);
    }

    public hit(p: number[]): boolean {
        return p.every(
            (v, i) => this.p1[i] <= v && v <= this.p2[i],
        );
    }

    public intersect(r: Rectangle): boolean {
        return this.p1.every(
            (v, i) => v <= r.p2[i] && r.p1[i] <= this.p2[i],
        );
    }

    public clone(): Rectangle {
        return new Rectangle([...this.p1], [...this.p2]);
    }

    public equal(r: Rectangle, epsilon: number = 0.1e-3): boolean {
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
    const boxMin = out?.p1 ?? new Array<number>(r1.dimension);
    const boxMax = out?.p2 ?? new Array<number>(r1.dimension);

    for (let i = 0; i < r1.dimension; ++i) {
        boxMin[i] = Math.min(r1.p1[i], r2.p1[i]);
        boxMax[i] = Math.max(r1.p2[i], r2.p2[i]);
    }

    return out ? out : new Rectangle(boxMin, boxMax);
}

export function getOuterBoundingBoxWeight(r1: Rectangle, r2: Rectangle): number {
    return getBoundingBox(r1, r2, getGlobalRectangleCache()).weight;
}