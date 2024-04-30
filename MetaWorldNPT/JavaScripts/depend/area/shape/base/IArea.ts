import { AnyPoint, IPoint2, IPoint3 } from "./IPoint";

// export type Area<P extends AnyPoint> = IAreaElement<P>[];

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
    points(): Readonly<P[]>;

    /**
     * 是否 给定点在 Shape 内.
     * @param point
     */
    inShape(point: P): boolean;

    /**
     * 随机获取 Shape 内一点.
     * @desc Monte Carlo 法.
     * @param trial 最大尝试次数.
     */
    randomPoint(trial: number): P | null;

    /**
     * 包围盒.
     * @return [P, P] [{x 最小值,y 最小值},{x 最大值,y 最大值}]
     */
    boundingBox(): [P, P];

    /**
     * 包围盒权重.
     */
    boundingBoxWeight(): number;
}
