import { IAreaElement } from "./base/IArea";
import { IPoint2 } from "./base/IPoint";
import { orient2d } from "robust-predicates";
import { pointsBoundingBoxIn2D } from "./util/Util";

const RANDOM_MAX_TRIAL = 20;

/**
 * PolygonShape 多边形.
 * @desc 由一系列点 依先后顺序构成.
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
export class PolygonShape implements IAreaElement<IPoint2> {
    /**
     * 顺序点.
     * @desc 按顺序存储的点.
     * @desc 按顺序构成一个图形。
     * @private
     */
    private readonly _seqPoints: IPoint2[];

    /**
     * 将给定点转换为凸包并作为 PolygonShape.
     * 仅接受有效参数. 有效参数指:
     *   - 设定输入点为 p0,p1...pn. 定义其构成边 l, 其中 li 由两相邻点 (pi-1,pi) i>1 或 (pn,p0) 构成.
     *   - 输入点个数 n>=3 且任意两边 li,lj 不相交.
     * @desc Graham's Scan 法构建.
     * @param points
     * @constructor
     */
    public static toConvexHull(points: IPoint2[]): PolygonShape {
        if (!this.lengthCheck(points)) {
            return null;
        }

        const minPoint = this.getMinPoint(points);
        this.sortByPolarAngle(points, minPoint);
        const convexHull: IPoint2[] = [points[0], points[1], points[2]];

        for (let i = 3; i < points.length; i++) {
            let point = points[i];
            if (i < 2) {
                convexHull.push(point);
                continue;
            }
            while (
                orient2d(
                    convexHull[convexHull.length - 2].x,
                    convexHull[convexHull.length - 2].y,
                    convexHull[convexHull.length - 1].x,
                    convexHull[convexHull.length - 1].y,
                    point.x,
                    point.y,
                ) > 0
                ) {
                convexHull.pop();
            }

            convexHull.push(point);
        }

        return new PolygonShape(convexHull);
    }

    /**
     * 将给定点作为 PolygonShape.
     * 仅接受有效参数. 有效参数指:
     * - 设定输入点为 p0,p1...pn. 定义其构成边 l, 其中 li 由两相邻点 (pi-1,pi) i>1 或 (pn,p0) 构成.
     * - 输入点个数 n>=3 且任意两边 li,lj 不相交.
     *
     * @param points
     * @constructor
     */
    public static toSeqPoint(points: IPoint2[]): PolygonShape {
        if (!this.lengthCheck(points)) {
            return null;
        }

        return new PolygonShape(points);
    }

    constructor(seqPoints: IPoint2[]) {
        this._seqPoints = seqPoints;
    }

    public type: "Shape" = "Shape";

    public points(): IPoint2[] {
        return this._seqPoints;
    }

    public inShape(point: IPoint2): boolean {
        let inside = false;

        for (let i = 0, j = this._seqPoints.length - 1; i < this._seqPoints.length; j = i++) {
            const pi = this._seqPoints[i];
            const pj = this._seqPoints[j];

            const intersect =
                pi.y > point.y !== pj.y > point.y &&
                point.x < ((pj.x - pi.x) * (point.y - pi.y)) / (pj.y - pi.y) + pi.x;

            if (intersect) {
                inside = !inside;
            }
        }

        return inside;
    }

    public randomPoint(trial: number = RANDOM_MAX_TRIAL): IPoint2 | null {
        const [pointMin, pointMax] = this.boundingBox();
        let tried = 0;

        let x: number = null;
        let y: number = null;

        while (tried < trial) {
            x = Math.random() * (pointMax.x - pointMin.x) + pointMin.x;
            y = Math.random() * (pointMax.y - pointMin.y) + pointMin.y;
            if (this.inShape({x, y})) return {x: x, y: y};
            ++tried;
        }

        return null;
    }

    public boundingBox(): [IPoint2, IPoint2] {
        return pointsBoundingBoxIn2D(this._seqPoints);
    }

    public boundingBoxWeight(): number {
        const [p1, p2] = this.boundingBox();
        return (p2.y - p1.y) * (p2.x - p1.x);
    }

    //#region Util
    /**
     * 参数长度检查.
     * @desc 区域至少需要 3 个点.
     * @param points
     */
    private static lengthCheck(points: IPoint2[]): boolean {
        return points.length >= 3;
    }

    /**
     * 获取最小点.
     * @desc 最小点指 y 值最小的点，如果 y 值相同则取 x 值最小的点.
     * @param points
     */
    private static getMinPoint(points: IPoint2[]) {
        let minPoint = points[0];
        let i = 1;
        for (; i < points.length; i++) {
            const curr = points[i];
            if (curr.y < minPoint.y || (curr.y === minPoint.y && curr.x < minPoint.x)) {
                minPoint = curr;
            }
        }

        return minPoint;
    }

    /**
     * 极角排序.
     * @param points
     * @param center
     */
    private static sortByPolarAngle(points: IPoint2[], center: IPoint2) {
        points.sort((a, b) => {
            let aAngle = Math.atan2(a.y - center.y, a.x - center.x);
            let bAngle = Math.atan2(b.y - center.y, b.x - center.x);
            if (aAngle < 0) aAngle += Math.PI * 2;
            if (bAngle < 0) bAngle += Math.PI * 2;
            return aAngle - bAngle;
        });
    }

    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}
