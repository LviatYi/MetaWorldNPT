import { IAreaElement } from "./base/IArea";
import { AnyPoint, IPoint2 } from "./base/IPoint";
import { orient2d } from "robust-predicates";
import Rectangle, { getBoundingBox } from "./r-tree/Rectangle";
import Enumerable from "linq";
import { point2ToRect } from "./util/Util";

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

    private _boundingBox: Rectangle = undefined;

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

    public points(): Enumerable.IEnumerable<IPoint2> {
        return Enumerable
            .from(this._seqPoints);
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

    /**
     * @desc Monte Carlo 蒙特卡洛采样.
     * @param {IPoint2[]} except
     * @param {number} range
     * @param {number} trial
     * @returns {Readonly<IPoint2> | undefined}
     */
    public randomPoint(except: AnyPoint[] = undefined, range: number = 0, trial: number = RANDOM_MAX_TRIAL): Readonly<IPoint2> | undefined {
        if (this._seqPoints.length === 0) return undefined;

        const boundingBox = this.boundingBox();
        const [pointMin, pointMax] = [boundingBox.p1, boundingBox.p2];
        let tried = 0;

        let x: number = undefined;
        let y: number = undefined;

        choose: while (tried < trial) {
            x = Math.random() * (pointMax[0] - pointMin[0]) + pointMin[0];
            y = Math.random() * (pointMax[1] - pointMin[1]) + pointMin[1];
            if (this.inShape({x, y})) {
                for (const ex of except) {
                    if (Math.abs(ex.x - x) < range ||
                        Math.abs(ex.y - y) < range ||
                        (ex.x - x) ** 2 + (ex.y - y) ** 2 < range ** 2) {
                        continue choose;
                    }
                }
                return {x: x, y: y};
            }
            ++tried;
        }

        return undefined;
    }

    public boundingBox(): Rectangle {
        if (this._boundingBox === undefined) {
            for (const seqPoint of this._seqPoints) {
                if (this._boundingBox === undefined) {
                    this._boundingBox = new Rectangle([seqPoint.x, seqPoint.y], [seqPoint.x, seqPoint.y]);
                } else {
                    getBoundingBox(this._boundingBox, point2ToRect(seqPoint), this._boundingBox);
                }
            }
        }

        return this._boundingBox;
    }

    public boundingBoxWeight(): number {
        return this.boundingBox().weight;
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
