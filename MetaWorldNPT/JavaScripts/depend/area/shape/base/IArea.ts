import { AnyPoint, IPoint2, IPoint3 } from "./IPoint";
import Enumerable from "linq";
import IEnumerator = Enumerable.IEnumerator;
import Rectangle from "../r-tree/Rectangle";

export default class Area {
    private _areas: IAreaElement<AnyPoint>[] = [];

    /**
     * 是否 一点在 2D 区域内.
     * @param pos
     */
    public inArea(pos: AnyPoint): boolean {
        if ("z" in pos && this.in3DArea(pos)) {
            return true;
        }

        return this.in2DArea(pos);
    }

    private in2DArea(pos: IPoint2) {
        return this._areas.some((a) => a.type === "Shape" && a.inShape(pos));
    }

    private in3DArea(pos: IPoint3) {
        return this._areas.some((a) => a.type === "PointSet" && a.inShape(pos));
    }
}

export interface IAreaElement<P extends AnyPoint> {
    type: "PointSet" | "Shape";

    /**
     * 定义点.
     * 不允许更改.
     */
    points(): Enumerable.IEnumerable<AnyPoint>;

    /**
     * 是否 给定点在 Shape 内.
     * @param point
     */
    inShape(point: P): boolean;

    /**
     * 随机获取 Shape 内一点.
     * @param {AnyPoint[]} except 排除区域.
     * @param {number} range 排除区域大小.
     * @param {number} trial 最大尝试次数.
     * @returns {Readonly<P> | undefined}
     */
    randomPoint(except: AnyPoint[], range: number, trial: number): Readonly<P> | undefined;

    randomPoint(except: AnyPoint[], range: number): Readonly<P> | undefined;

    randomPoint(except: AnyPoint[]): Readonly<P> | undefined;

    randomPoint(): Readonly<P> | undefined;

    /**
     * 包围盒.
     * @returns {Rectangle}
     */
    boundingBox(): Rectangle;

    /**
     * 包围盒权重.
     */
    boundingBoxWeight(): number;
}
