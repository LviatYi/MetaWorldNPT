import { Delegate, Singleton } from "../../util/GToolkit";
import { AnyPoint, IPoint2, IPoint3 } from "./shape/base/IPoint";
import { IAreaElement } from "./shape/base/IArea";
import Enumerable from "linq";
import Rectangle from "./shape/r-tree/Rectangle";
import { RTree } from "./shape/r-tree/RTree";
import { PolygonShape } from "./shape/PolygonShape";
import { Point3Set } from "./shape/Point3Set";
import { pointToArray } from "./shape/util/Util";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * @desc # AreaManager 区域管理器.
 * @desc
 * @desc 提供由 3D 点集或 2D 多边形构成区域的管理.
 * @desc
 * @desc ## 包依赖 Dependencies
 * @desc
 * @desc depends on robust-predicates.
 * @desc `npm install robust-predicates`
 * @desc
 * @desc ## 定义 Definition
 * @desc
 * @desc - 区域: 由 2维形状或 3维点集构成. 用于包含信息点.
 * @desc    - 2维形状: 由一系列2维点定义 构成凸包或非凸包.
 * @desc    - 3维点集: 由一系列3维点定义.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 31.0.0
 */
export default class AreaManager extends Singleton<AreaManager>() {
    //#region Constant
    private static readonly POINTS_3D_AREA_HOLDER_TAG = "points-3d-area-holder-tag";
    private static readonly SHAPE_2D_AREA_HOLDER_TAG = "shape-2d-area-holder-tag";
    public static readonly AREA_ID_TAG_PREFIX = "area-id-tag-";
    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _areaMap: Map<number, IAreaElement<AnyPoint>[]> = new Map();

    private _rectMap: Map<Rectangle, number>;

    private _treeForShape: RTree = new RTree();

    private _traceMap: Map<mw.GameObject, number> = new Map();

    private _tracerMap: Map<mw.GameObject, () => void> = new Map();

    private _traceInterval: number = 0.5e3;

    public get traceInterval(): number {
        return this._traceInterval;
    }

    public set traceInterval(value: number) {
        if (value === this._traceInterval) return;
        this._traceInterval = value;

        for (const [obj, timer] of this._traceMap) {
            mw.clearInterval(timer);
            this._traceMap.set(
                obj,
                mw.setInterval(() => this.getTraceHandler(obj)(),
                    this._traceInterval,
                ));
        }
    }

    /**
     * 是否指定 AreaId 的区域中包含形状.
     * @param {number} id
     * @return {boolean}
     */
    public isIncludeShape(id: number): boolean {
        return Enumerable.from(this._areaMap.get(id))
            .any(a => a.type === "Shape");
    }

    /**
     * 获取区域中定义的点集合.
     * @desc
     * @param {number} id
     * @return {Enumerable.IEnumerable<IPoint3>}
     */
    public getPointSet(id: number): Enumerable.IEnumerable<IPoint3> {
        return Enumerable.from(this._areaMap.get(id))
            .where(a => a.type === "PointSet")
            .selectMany(a => a.points() as Enumerable.IEnumerable<IPoint3>);
    }

    /**
     * 注册一块形状至指定区域.
     * @param {number} areaId
     * @param {IPoint2[]} points
     * @param {boolean} ordered
     */
    public registerShapeToArea(areaId: number, points: IPoint2[], ordered: boolean): void {
        let areas = this._areaMap.get(areaId);
        if (!areas) {
            areas = [];
            this._areaMap.set(areaId, areas);
        }

        let shape = ordered ?
            PolygonShape.toSeqPoint(points) :
            PolygonShape.toConvexHull(points);

        areas.push(shape);
        let rect = shape.boundingBox();
        this._rectMap.set(rect, areaId);
        this._treeForShape.insert(rect);
    }

    /**
     * 注册一块形状至指定区域.
     * @param {number} areaId
     * @param {IPoint3[]} points
     */
    public registerPointsToArea(areaId: number, points: IPoint3[]): void {
        let areas = this._areaMap.get(areaId);
        if (!areas) {
            areas = [];
            this._areaMap.set(areaId, areas);
        }

        let pointSet = new Point3Set(points);
        areas.push(pointSet);
    }

    public trace(obj: mw.GameObject) {
        if (this.isTracing(obj)) return;
        this._traceMap.set(
            obj,
            mw.setInterval(() => this.getTraceHandler(obj)(),
                this._traceInterval,
            ));
    }

    public disableTrace(obj: mw.GameObject) {
        if (!this.isTracing(obj)) return;
        mw.clearInterval(this._traceMap.get(obj));
        this._traceMap.delete(obj);
        this._tracerMap.delete(obj);
    }

    public isTracing(obj: mw.GameObject): boolean {
        return this._traceMap.has(obj);
    }

    private getTraceHandler(obj: mw.GameObject) {
        if (!this._tracerMap.has(obj)) {
            let enteredAreas: Set<number> = new Set();
            let counter = 0;
            this._tracerMap.set(
                obj,
                () => {
                    let areas = Enumerable
                        .from(this._treeForShape
                            .queryPoint(pointToArray(obj.worldTransform.position)))
                        .select((element) => this._rectMap.get(element))
                        .where(item => item !== undefined);
                    let areaArray: number[] = [];
                    for (const area of areas) {
                        areaArray.push(area);
                        if (!enteredAreas.has(area)) {
                            enteredAreas.add(area);
                            ++counter;
                            this.onEnterArea.invoke(obj, area);
                        }
                    }
                    if (counter !== areaArray.length) {
                        for (const area of enteredAreas.keys()) {
                            if (areaArray.indexOf(area) < 0) {
                                enteredAreas.delete(area);
                                this.onLeaveArea.invoke(obj, area);
                            }
                        }
                    }
                });
        }

        return this._tracerMap.get(obj);
    }

    //#region Event
    /**
     * 跟踪物体 进入 Area 事件.
     * @type {Delegate.SimpleDelegate<[obj: mw.GameObject, areaId: number]>}
     */
    public onEnterArea: SimpleDelegate<[obj: mw.GameObject, areaId: number]> = new Delegate.SimpleDelegate();

    /**
     * 跟踪物体 离开 Area 事件.
     * @type {Delegate.SimpleDelegate<[obj: mw.GameObject, areaId: number]>}
     */
    public onLeaveArea: SimpleDelegate<[obj: mw.GameObject, areaId: number]> = new Delegate.SimpleDelegate();
    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}
