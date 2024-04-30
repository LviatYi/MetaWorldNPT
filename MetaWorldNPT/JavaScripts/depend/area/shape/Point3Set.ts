import { IPoint3 } from "./base/IPoint";
import { pointsBoundingBoxIn3D } from "./util/Util";
import { IAreaElement } from "./base/IArea";

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
    private readonly _points: IPoint3[];

    constructor(points: IPoint3[]) {
        this._points = points;
    }

    public type: "PointSet" = "PointSet";

    public points(): Readonly<IPoint3[]> {
        return this._points;
    }

    public inShape(point: IPoint3): boolean {
        return (
            this._points.find((value) => value.x === point.x && value.y === point.y && value.z === point.z) !==
            undefined
        );
    }

    public randomPoint(trial: number = undefined): IPoint3 | null {
        const rand = this._points[(this._points.length * Math.random()) | 0];
        return {x: rand.x, y: rand.y, z: rand.z};
    }

    public randomPointExcept(except: IPoint3[], trail: number = undefined) {
        // Enumerable.

    }

    public boundingBoxWeight(): number {
        const [p1, p2] = this.boundingBox();
        return (p2.x - p1.x) * (p2.y - p1.y) * (p2.z - p1.z);
    }

    public boundingBox(): [IPoint3, IPoint3] {
        return pointsBoundingBoxIn3D(this._points);
    }
}
