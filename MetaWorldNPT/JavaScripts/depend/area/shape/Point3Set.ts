import { AnyPoint, IPoint3 } from "./base/IPoint";
import { IAreaElement } from "./base/IArea";
import Enumerable from "linq";
import Rectangle from "./Rectangle";
import { RTree } from "../r-tree/RTree";
import { point3ToRect, pointToArray } from "./util/Util";

/**
 * Point3Set 三维点集.
 * @desc 组成一系列离散点.
 * @desc 允许重复点.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class Point3Set implements IAreaElement<IPoint3> {
    private readonly _pointMap: Map<Rectangle, IPoint3> = new Map();

    private readonly _tree: RTree = new RTree();

    public get size(): number {
        return this._tree.size;
    }

    constructor(points: IPoint3[]) {
        for (const point of points) {
            const rect = point3ToRect(point);
            this._pointMap.set(rect, point);
            this._tree.insert(rect);
        }
    }

    public type: "PointSet" = "PointSet";

    public points(): Enumerable.IEnumerable<IPoint3> {
        return Enumerable
            .from(this._tree[Symbol.iterator]())
            .select(element => this._pointMap.get(element));
    }

    public inShape(point: IPoint3): boolean {
        return !!this._tree.queryIncludePoint(pointToArray(point)).next();
    }

    public randomPoint(except: AnyPoint[] = undefined, range: number = 0, trial: number = undefined): Readonly<IPoint3> | undefined {
        if (this._tree.size === 0) return undefined;

        let candidateMap = new Map();
        let count = this._tree.size;
        for (const key of this._pointMap.keys()) {
            candidateMap.set(key, this._pointMap.get(key));
        }

        if (except) {
            let minZ = this.boundingBox().p1[2];
            let maxZ = this.boundingBox().p2[2];
            for (const ex of except) {
                let q: Generator<Rectangle>;
                if ("z" in ex) {
                    q = this._tree
                        .queryIncludeRect(point3ToRect(ex, range));
                } else {
                    q = this._tree
                        .queryIncludeRect(new Rectangle(
                            [ex.x - range / 2, ex.y - range / 2, minZ],
                            [ex.x + range / 2, ex.y + range / 2, maxZ],
                        ));
                }
                for (const r of q) {
                    --count;
                    candidateMap.delete(r);
                }
            }
        }

        let rand = Math.random() * count;
        for (const key of candidateMap.keys()) {
            if (rand < 1) return candidateMap.get(key);
            --rand;
        }

        return undefined;
    }

    public boundingBoxWeight(): number {
        return this.boundingBox().weight;
    }

    public boundingBox(): Rectangle {
        return this._tree.box;
    }
}
