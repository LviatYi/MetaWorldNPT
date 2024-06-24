import Gtk, { IPoint2, IPoint3, Regulator, Singleton } from "gtoolkit";
import Rectangle from "./shape/Rectangle";
import { RTree } from "./r-tree/RTree";
import Log4Ts from "mw-log4ts/Log4Ts";

/**
 * 空间一级索引标签.
 * @desc > 最快捷的性能提升发生在编译期前.
 */
export type SpaceTag = "monster" | "player" | "enemy" | "env" | string;

/**
 * GameObject 矩形化 函数.
 */
export type Rectify = (go: mw.GameObject) => Rectangle

/**
 * 受跟踪的 GameObject.
 */
class TracedGo {
    private regulator: Regulator;

    constructor(public go: mw.GameObject,
                public rectify: Rectify,
                reportInterval: number) {
        if (reportInterval !== undefined) this.regulator = new Regulator(reportInterval);
    }

    public calRectangle(precision: number): Rectangle {
        return Rectangle.adjustPrecise(
            this.rectify(this.go),
            precision);
    }

    public ready(): boolean {
        return this.regulator?.request() ?? true;
    }
}

/**
 * 空间索引.
 */
export class SpaceIndexer {
    public goToTrace: Map<mw.GameObject, TracedGo> = new Map();

    public traceToRect: Map<TracedGo, Rectangle> = new Map();

    public rectToTrace: Map<Rectangle, TracedGo> = new Map();

    private _tree: RTree;

    private _focusingRound: number = 0;

    private _round: number;

    constructor(private _precision: number) {
    }

    public get round() {
        return this._round;
    }

    private get tree() {
        if (!this._tree) this._tree = new RTree();

        return this._tree;
    }

    public isTracing(go: mw.GameObject): boolean {
        return this.goToTrace.has(go);
    }

    public setRound(val: number): this {
        this._round = val;
        return this;
    }

    public* queryGoInCircle(center: IPoint2, radius: number, include: boolean = true): Generator<mw.GameObject> {
        for (const go of this.queryGoInRect(
            [{x: center.x - radius, y: center.y - radius},
                {x: center.x + radius, y: center.y + radius}],
            include)) {
            if (Gtk.squaredEuclideanDistance2(go.worldTransform.position, center) <= radius * radius) {
                yield go;
            }
        }
    }

    public* queryGoInSphere(center: IPoint3, radius: number, include: boolean = true): Generator<mw.GameObject> {
        for (const go of this.queryGoInRect(
            [{x: center.x - radius, y: center.y - radius},
                {x: center.x + radius, y: center.y + radius}],
            include)) {
            if (Gtk.squaredEuclideanDistance3(go.worldTransform.position, center) <= radius * radius) {
                yield go;
            }
        }
        return;
    }

    public* queryGoInRect(rect: [IPoint2, IPoint2], include: boolean = true): Generator<mw.GameObject> {
        const queryRect = Rectangle.fromUnordered(
            [rect[0].x, rect[0].y],
            [rect[1].x, rect[1].y]);

        let generate = this.queryRect(queryRect, include);

        for (const rect of generate) {
            yield this.rectToTrace.get(rect).go;
        }
        return;
    }

    public* queryGoInCube(cube: [IPoint3, IPoint3], include: boolean = true): Generator<mw.GameObject> {
        for (const go of this.queryGoInRect(cube, include)) {
            if (cube[0].z <= go.worldTransform.position.z &&
                go.worldTransform.position.z <= cube[1].z) {
                yield go;
            }
        }

        return;
    }

    public trace(go: mw.GameObject, rectify: Rectify, reportInterval: number): boolean {
        if (this.isTracing(go)) return false;

        const tracedGo = new TracedGo(go, rectify, reportInterval);
        const rect = tracedGo.calRectangle(this._precision);

        this.goToTrace.set(go, tracedGo);
        this.traceToRect.set(tracedGo, rect);
        this.rectToTrace.set(rect, tracedGo);
        this.tree.insert(rect);

        return true;
    }

    public unTrace(go: mw.GameObject): boolean {
        if (this.isTracing(go)) return false;

        const traceInfo = this.goToTrace.get(go);
        const rect = this.traceToRect.get(traceInfo);

        this.goToTrace.delete(go);
        this.traceToRect.delete(traceInfo);
        this.rectToTrace.delete(rect);
        this.tree.remove(rect);

        return true;
    }

    /**
     * 自动跟踪 GameObject.
     */
    public autoTraceGameObject() {
        let index = 0;
        for (const [go, traceInfo] of this.goToTrace) {
            if (index % this._round === this._focusingRound) {
                const rect = this.traceToRect.get(traceInfo);

                if (traceInfo.ready()) this.tryUpdate(traceInfo, rect);
            }

            ++index;
        }

        this._focusingRound = (this._focusingRound + 1) % this._round;
    }

    /**
     * 立即跟踪 GameObject.
     * @param {mw.GameObject} go
     */
    public traceInstantly(go: mw.GameObject): boolean {
        if (!this.isTracing(go)) return false;
        const traceInfo = this.goToTrace.get(go);
        const rect = this.traceToRect.get(traceInfo);

        return this.tryUpdate(traceInfo, rect);
    }

    private tryUpdate(traceInfo: TracedGo, oldRect: Rectangle): boolean {
        const newRect = traceInfo.calRectangle(this._precision);
        if (!oldRect.equal(newRect)) {
            this.tree.remove(oldRect);
            this.tree.insert(newRect);
            this.traceToRect.set(traceInfo, newRect);
            this.rectToTrace.delete(oldRect);
            this.rectToTrace.set(newRect, traceInfo);

            return true;
        }
        return false;
    }

    private queryRect(rect: Rectangle, include: boolean): Generator<Rectangle> {
        return include ?
            this.tree.queryRectInclude(rect) :
            this.tree.queryRectIntersect(rect);
    }
}

/**
 * AreaManager 区域管理.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 31.0.9
 */
export default class AreaController extends Singleton<AreaController>() {
//#region Constant
    public static readonly RectanglePrecision = 1;

    /**
     * 自动跟踪的轮数.
     * @desc 由于 GameObject 的数量可能较多 因此采用轮数的方式分散计算.
     * @type {number}
     */
    public static readonly AutoTraceRound = 5;

    private static defaultRectify2(go: mw.GameObject) {
        return defaultRectify2(go, AreaController.RectanglePrecision);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 以 Tag 静态修饰的空间索引器.
     * @desc 要求人为地添加一级索引.
     * @type {Map<SpaceTag, SpaceIndexer>}
     * @private
     */
    private _spaceIndexers: Map<SpaceTag, SpaceIndexer> = new Map();

    /**
     * 注册一个 GameObject 至空间索引.
     * @param {mw.GameObject} go 作为主键.
     * @param {SpaceTag} tag Tag. 由暂时未限定 Tag 相关的约定 因此请自行定义.
     * @param {(go: mw.GameObject) => Rectangle} rectify 计算 GameObject 的空间 Rectangle.
     * @param {number} reportInterval 汇报位置更新间隔. ms
     */
    public registerGameObject(go: mw.GameObject,
                              tag: SpaceTag,
                              rectify?: (go: mw.GameObject) => Rectangle,
                              reportInterval?: number): this {
        const indexer = Gtk.tryGet(this._spaceIndexers,
            tag,
            () => new SpaceIndexer(AreaController.RectanglePrecision)
                .setRound(AreaController.AutoTraceRound));

        indexer.trace(go, rectify ?? AreaController.defaultRectify2, reportInterval);

        return this;
    }

    /**
     * 立即刷新对象的空间索引.
     * @desc 出于性能考虑 对象的空间索引并不会每帧更新.
     * @desc 当对象的速度较慢 空间索引的低频更新是足用的.
     * @desc 当偶现的高速移动或瞬移发生后 可调用此函数立即跟踪.
     * @param {SpaceTag} tag 指定的 空间索引标签.
     * @param {mw.GameObject} gos
     * @return {number} 更新数量.
     */
    public reportInstantlyByTag(tag: SpaceTag, ...gos: mw.GameObject[]): number {
        const indexer = this._spaceIndexers.get(tag);
        if (!indexer) return 0;

        let count = 0;
        for (const go of gos) {
            if (indexer.traceInstantly(go)) ++count;
        }

        return count;
    }

    /**
     * 删除 GameObject 的空间索引.
     * @param {SpaceTag} tag 指定的 空间索引标签.
     * @param {mw.GameObject} gos
     * @return {number} 删除数量.
     */
    public unregisterGameObject(tag: SpaceTag, ...gos: mw.GameObject[]): number {
        const indexer = this._spaceIndexers.get(tag);
        if (!indexer) return;

        let count = 0;
        for (const go of gos) {
            if (indexer.unTrace(go)) ++count;
        }

        return count;
    }

    /**
     * 选择一个或多个空间索引器.
     * @param {SpaceTag} tags
     * @return {SpaceIndexer[]}
     */
    public* selectSource(...tags: SpaceTag[]): Generator<SpaceIndexer, void> {
        for (const tag of tags) {
            yield this._spaceIndexers.get(tag);
        }
    }

    /**
     * 排序一个二维点.
     * @param {IPoint2} p1
     * @param {IPoint2} p2
     * @return {[IPoint2, IPoint2]}
     */
    public sortPoint2(p1: IPoint2, p2: IPoint2): [IPoint2, IPoint2] {
        const [xMin, xMax] = [p1.x, p2.x].sort();
        const [yMin, yMax] = [p1.y, p2.y].sort();

        return [{x: xMin, y: yMin}, {x: xMax, y: yMax}];
    }

    /**
     * 排序一个三维点.
     * @param {IPoint3} p1
     * @param {IPoint3} p2
     * @return {[IPoint3, IPoint3]}
     */
    public sortPoint3(p1: IPoint3, p2: IPoint3): [IPoint3, IPoint3] {
        const [xMin, xMax] = [p1.x, p2.x].sort();
        const [yMin, yMax] = [p1.y, p2.y].sort();
        const [zMin, zMax] = [p1.z, p2.z].sort();

        return [{x: xMin, y: yMin, z: zMin}, {x: xMax, y: yMax, z: zMax}];
    }

    /**
     * 自动跟踪 GameObject.
     */
    public autoTraceGameObject() {
        let time = Date.now();
        for (const [tag, indexer] of this._spaceIndexers) {
            indexer.autoTraceGameObject();
        }
        Log4Ts.log(AreaController, `traced all time: ${Date.now() - time}ms`);
    }
}

//#region Util
/**
 * 全局 二维 Rectangle 缓存.
 */
const globalRectangleCache: Rectangle = Rectangle.Zero(2);

/**
 * 全局 三维 Rectangle 缓存.
 */
const globalRectangleCache3: Rectangle = Rectangle.Zero(3);

/**
 * 默认 二维 Rectify 函数.
 */
export function defaultRectify2(go: mw.GameObject,
                                precision: number,
                                outer?: Rectangle): Rectangle {
    if (!outer) outer = Rectangle.Zero(2);
    let {x, y} = go.worldTransform.position;
    outer.p1[0] = x;
    outer.p1[1] = y;
    outer.p2[0] = x;
    outer.p2[1] = y;

    Rectangle.adjustPrecise(outer, precision);

    return outer;
}

/**
 * 默认 三维 Rectify 函数.
 */
export function defaultRectify3(go: mw.GameObject,
                                precision: number,
                                outer?: Rectangle): Rectangle {
    if (!outer) outer = Rectangle.Zero(3);
    let {x, y, z} = go.worldTransform.position;
    outer.p1[0] = x;
    outer.p1[1] = y;
    outer.p1[2] = z;
    outer.p2[0] = x;
    outer.p2[1] = y;
    outer.p2[2] = z;

    Rectangle.adjustPrecise(outer, precision);

    return outer;
}

//#endregion

//#region Auto Register
mw.TimeUtil.onEnterFrame.add((dt) => {
    AreaController.getInstance().autoTraceGameObject();
});

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
