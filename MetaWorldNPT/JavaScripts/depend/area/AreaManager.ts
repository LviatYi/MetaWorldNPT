import Gtk, { Delegate, Singleton } from "../../util/GToolkit";
import { AnyPoint, IPoint2, IPoint3 } from "./shape/base/IPoint";
import { IAreaElement } from "./shape/base/IArea";
import Enumerable from "linq";
import Rectangle from "./shape/r-tree/Rectangle";
import { RTree } from "./shape/r-tree/RTree";
import { PolygonShape } from "./shape/PolygonShape";
import { Point3Set } from "./shape/Point3Set";
import { pointToArray } from "./shape/util/Util";
import Log4Ts from "../log4ts/Log4Ts";
import { GameConfig } from "../../config/GameConfig";
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
 * @desc - 区域: 由一系列 2维形状或 3维点集构成. 用于包含信息点.
 * @desc    - 2维形状: 由一系列2维点定义 构成凸包或非凸包.
 * @desc      ![2维形状](https://raw.githubusercontent.com/LviatYi/MetaWorldNPT/main/MetaWorldNPT/JavaScripts/depend/area/pic/2d-shape.png)
 * @desc    - 3维点集: 由一系列3维点定义.
 * @desc      ![3维点集](https://github.com/LviatYi/MetaWorldNPT/blob/main/MetaWorldNPT/JavaScripts/depend/area/pic/3d-point-set.png?raw=true)
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 31.1.20
 */
export default class AreaManager extends Singleton<AreaManager>() {
//#region Constant
    private static readonly POINTS_3D_AREA_HOLDER_TAG = "points-3d-area-holder-tag";
    private static readonly SHAPE_2D_AREA_HOLDER_TAG = "shape-2d-area-holder-tag";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _areaMap: Map<number, IAreaElement<AnyPoint>[]> = new Map();

    private _rectIndexer: Map<Rectangle, IAreaElement<AnyPoint>> = new Map();

    private _areaElementIndexer: Map<IAreaElement<AnyPoint>, number> = new Map();

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

    private _sceneInjected: boolean = false;

    private _configInjected: boolean = false;

    /**
     * 是否指定 AreaId 的区域中包含形状.
     * @param {number} id
     * @return {boolean}
     */
    public isIncludeAnyShape(id: number): boolean {
        return Enumerable.from(this._areaMap.get(id))
            .any(a => a.type === "Shape");
    }

    /**
     * 获取区域中定义的点集.
     * @param {number} areaId
     * @return {Enumerable.IEnumerable<IPoint3>}
     */
    public getAreaPointSet(areaId: number): Enumerable.IEnumerable<IPoint3> {
        return Enumerable.from(this._areaMap.get(areaId))
            .where(a => a.type === "PointSet")
            .selectMany(a => a.points() as Enumerable.IEnumerable<IPoint3>);
    }

    /**
     * 获取区域中定义的点集大小.
     * @param {number} areaId
     * @return {number}
     */
    public getAreaPointSetSize(areaId: number): number {
        return Enumerable.from(this._areaMap.get(areaId))
            .sum(area => area.type === "PointSet" ? (area as Point3Set).size : 0);
    }

    /**
     * 获取区域中定义的形状.
     * @param {number} areaId
     * @return {Enumerable.IEnumerable<PolygonShape>}
     */
    public getShape(areaId: number): Enumerable.IEnumerable<PolygonShape> {
        return Enumerable.from(this._areaMap.get(areaId))
            .where(a => a.type === "Shape")
            .select(s => s as PolygonShape);
    }

    /**
     * 是否 一个 3D 点 在 Area 的 3D 点集中.
     * @param {number} areaId
     * @param {IPoint3} point
     * @return {boolean}
     */
    public isPoint3DInAreaByPointSet(areaId: number, point: IPoint3): boolean {
        return Enumerable
            .from(this._areaMap.get(areaId))
            .any(element =>
                element.type === "PointSet" && element.inShape(point),
            );
    }

    /**
     * 是否 一个点在 Area 中.
     * @param {number} areaId
     * @param {AnyPoint} point
     * @return {boolean}
     */
    public isPointInArea(areaId: number, point: AnyPoint): boolean {
        return Enumerable
            .from(this._areaMap.get(areaId))
            .any(element =>
                element.type === "Shape" && element.inShape(point) ||
                element.type === "PointSet" && "z" in point && (element as Point3Set).inShape(point),
            );
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
        this._rectIndexer.set(rect, shape);
        this._areaElementIndexer.set(shape, areaId);
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

    /**
     * 获取指定区域的随机一点.
     * @param {number} areaId
     * @param {AnyPoint[]} expect 排除点.
     * @param {number} exceptRange
     * @returns {AnyPoint|undefined}
     */
    public getRandomPoint(areaId: number, expect: AnyPoint[] = undefined, exceptRange: number = 0): AnyPoint | undefined {
        let areaElements = this._areaMap.get(areaId);
        if (Gtk.isNullOrUndefined(areaElements)) {
            this.logAreaNotExist(areaId);
            return undefined;
        }
        let shapes = areaElements.filter(a => a.type === "Shape") as PolygonShape[];
        let points = areaElements.filter(a => a.type === "PointSet") as Point3Set[];

        return this.randomPointInShapeOrPointSet(shapes, points, expect, exceptRange);
    }

    /**
     * 获取指定区域中 3D 点集的随机一点.
     * @param {number} areaId
     * @param {AnyPoint[]} expect 排除点.
     * @param {number} exceptRange
     * @returns {AnyPoint|undefined}
     */
    public getRandom3DPoint(areaId: number, expect: AnyPoint[] = undefined, exceptRange: number = 0): IPoint3 | undefined {
        let areaElements = this._areaMap.get(areaId);
        if (Gtk.isNullOrUndefined(areaElements)) {
            this.logAreaNotExist(areaId);
            return undefined;
        }
        let points = areaElements.filter(a => a.type === "PointSet") as Point3Set[];

        return this.randomPointInShapeOrPointSet(undefined, points, expect, exceptRange) as IPoint3;
    }

    /**
     * 获取多个指定区域的随机一点.
     * @param {number[]} areaIds
     * @param {AnyPoint[]} expect
     * @param {number} exceptRange
     * @return {AnyPoint|undefined}
     */
    public getRandomPointInAreas(areaIds: number[], expect: AnyPoint[] = undefined, exceptRange: number = 0): AnyPoint | undefined {
        let areaElements = Enumerable.from(areaIds)
            .selectMany(areaId => this._areaMap.get(areaId));
        let shapes = areaElements.where(a => a.type === "Shape").toArray() as PolygonShape[];
        let points = areaElements.where(a => a.type === "PointSet").toArray() as Point3Set[];

        return this.randomPointInShapeOrPointSet(shapes, points, expect, exceptRange);
    }

    /**
     * 获取多个指定区域的随机一点.
     * @param {number[]} areaIds
     * @param {AnyPoint[]} expect
     * @param {number} exceptRange
     * @return {AnyPoint|undefined}
     */
    public getRandom3DPointInAreas(areaIds: number[], expect: AnyPoint[] = undefined, exceptRange: number = 0): IPoint3 | undefined {
        let areaElements = Enumerable.from(areaIds)
            .selectMany(areaId => this._areaMap.get(areaId));
        let points = areaElements.where(a => a.type === "PointSet").toArray() as Point3Set[];

        return this.randomPointInShapeOrPointSet(undefined, points, expect, exceptRange) as IPoint3;
    }

    private randomPointInShapeOrPointSet(shapes: PolygonShape[] = undefined, points: Point3Set[] = undefined, expect: AnyPoint[] = undefined, exceptRange: number = 0): AnyPoint | undefined {
        if (Gtk.isNullOrEmpty(shapes) && Gtk.isNullOrEmpty(points)) return undefined;
        let rand = Math.random() * ((shapes?.length ?? 0) + (points?.length ?? 0));
        if (rand < (shapes?.length ?? 0)) {
            return shapes[Gtk.randomWeight(shapes.map(shape => shape.boundingBoxWeight()))].randomPoint(expect, exceptRange);
        } else {
            return points[Gtk.randomWeight(points.map(pointSet => pointSet.size))].randomPoint(expect, exceptRange);
        }
    }

//#region Trace
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
                        .select((element) => (this._rectIndexer.get(element) as PolygonShape))
                        .where(element => element !== undefined && element.inShape(obj.worldTransform.position))
                        .select(element => this._areaElementIndexer.get(element) as number);
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

//#endregion

//#region Register
    public injectScenePoint() {
        if (this._sceneInjected) return;

        const pointsHolders = GameObject.findGameObjectsByTag(AreaManager.POINTS_3D_AREA_HOLDER_TAG);
        const shapeHolders = GameObject.findGameObjectsByTag(AreaManager.SHAPE_2D_AREA_HOLDER_TAG);

        let injectValid = false;

        if (Gtk.isNullOrEmpty(pointsHolders)) {
            Log4Ts.warn(AreaManager, `couldn't find holder or any child in it by tag: ${AreaManager.POINTS_3D_AREA_HOLDER_TAG}`);
        } else {
            injectValid = true;
        }
        if (Gtk.isNullOrEmpty(shapeHolders)) {
            Log4Ts.warn(AreaManager, `couldn't find holder or any child in it by tag: ${AreaManager.SHAPE_2D_AREA_HOLDER_TAG}`);
        } else {
            injectValid = true;
        }
        if (!injectValid) {
            this._sceneInjected = true;
            return;
        }

        Enumerable
            .from(pointsHolders)
            .select(ValidPacemakerFilter)
            .forEach(items => {
                items
                    .groupBy(item => item.areaId)
                    .forEach(item => {
                        this.registerPointsToArea(item.key(), item.select(item => item.position).toArray());
                    });
            });

        Enumerable
            .from(shapeHolders)
            .select(ValidPacemakerFilter)
            .forEach(items => {
                items
                    .groupBy(item => item.areaId)
                    .forEach(item => {
                        this.registerShapeToArea(item.key(), item.select(item => item.position).toArray(), false);
                    });
            });

        this._sceneInjected = true;
        return;
    }

    public injectGameConfigPoint() {
        if (this._configInjected) return;

        (GameConfig["Area"]
            ?.getAllElement() as unknown as IAreaConfigElement[])
            ?.forEach(
                item => {
                    let points3D = item
                        ?.points
                        ?.filter(p => p.length == 3)
                        .map(p => ({
                            x: p[0],
                            y: p[1],
                            z: p[2],
                        })) ?? undefined;
                    let points2D = item
                        ?.points
                        ?.filter(p => p.length == 2)
                        .map(p => ({x: p[0], y: p[1]})) ?? undefined;

                    !Gtk.isNullOrEmpty(points3D) && AreaManager
                        .getInstance()
                        .registerPointsToArea(item.id, points3D);
                    !Gtk.isNullOrEmpty(points2D) && AreaManager
                        .getInstance()
                        .registerShapeToArea(item.id, points2D, item?.ordered ?? false);
                },
            );

        this._configInjected = true;
    }

//#endregion

//#region Log
    public logAreaNotExist(id: number) {
        Log4Ts.warn(AreaManager, `area not exist. area id: ${id}`);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

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

/**
 * 标准的 Area 配置元素.
 */
export interface IAreaConfigElement {
    /**
     * 区域 ID.
     */
    id: number;

    /**
     * 名称.
     */
    name: string;

    /**
     * 点集.
     */
    points: number[][];

    /**
     * 是否构成排序后的非凸包.
     */
    ordered: boolean;
}

function ValidPacemakerFilter(obj: GameObject): Enumerable.IEnumerable<{ areaId: number; position: mw.Vector }> {
    return Enumerable
        .from(obj.getChildren())
        .where(item => !Gtk.isNullOrEmpty(item.tag))
        .select(item => {
            return {
                areaId: Number.parseInt(item.tag),
                position: item.worldTransform.position,
            };
        })
        .where(item => !Number.isNaN(item.areaId));
}

const autoRegisterSelf = () => {
    TimeUtil.onEnterFrame.remove(autoRegisterSelf);
    let ins = AreaManager.getInstance();
    ins?.injectScenePoint();
    ins?.injectGameConfigPoint();
};

TimeUtil.onEnterFrame.add(autoRegisterSelf);