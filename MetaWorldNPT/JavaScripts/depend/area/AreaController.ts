import Gtk, { IPoint2, IPoint3, Regulator, Singleton } from "gtoolkit";
import Rectangle from "./shape/Rectangle";
import { RTree } from "./r-tree/RTree";
import Log4Ts from "mw-log4ts";

/**
 * 空间一级索引标签.
 * @desc > 最快捷的性能提升发生在编译期前.
 */
export type SpaceTag = "monster" | "player" | "enemy" | "env" | string;

/**
 * GameObject 矩形化 函数.
 */
export type Rectify = (go: ITransform, outer?: Rectangle) => Rectangle;

//#region Util
/**
 * 全局 二维 Rectangle 缓存.
 */
let globalRectangleCache2: Rectangle = Rectangle.Zero(2);

/**
 * 全局 三维 Rectangle 缓存.
 */
let globalRectangleCache3: Rectangle = Rectangle.Zero(3);

/**
 * 默认 二维 Rectify 函数.
 */
export function defaultRectify2(go: ITransform,
                                outer?: Rectangle): Rectangle {
    if (!outer) outer = Rectangle.Zero(2);
    let {x, y} = go.worldTransform.position;
    outer.p1[0] = x;
    outer.p1[1] = y;
    outer.p2[0] = x;
    outer.p2[1] = y;

    return outer;
}

/**
 * 默认 三维 Rectify 函数.
 */
export function defaultRectify3(go: ITransform,
                                outer?: Rectangle): Rectangle {
    if (!outer) outer = Rectangle.Zero(3);
    let {x, y, z} = go.worldTransform.position;
    outer.p1[0] = x;
    outer.p1[1] = y;
    outer.p1[2] = z;
    outer.p2[0] = x;
    outer.p2[1] = y;
    outer.p2[2] = z;

    return outer;
}

/**
 * 跟踪 位置脏标记.
 */
export const traceInjectKey = Symbol("__TRACE_INJECT_SIGN__");

//#endregion

/**
 * 具备 Transform 的.
 */
export interface ITransform {
    worldTransform: mw.Transform;
}

/**
 * 受跟踪的 GameObject.
 */
class TracedGo {
    private regulator: Regulator;

    constructor(public go: ITransform,
                public rectify: Rectify,
                reportInterval: number,
                public autoTrace: boolean = true) {
        if (reportInterval !== undefined) this.regulator = new Regulator(reportInterval);
    }

    public calRectangle(precision: number, create: boolean = true): Rectangle {
        return Rectangle.adjustPrecise(
            this.rectify(this.go, create ? undefined : globalRectangleCache2),
            precision);
    }

    public ready(): boolean {
        return this.regulator?.request() ?? true;
    }
}

export interface ISpatialQueryProvider {
    queryGoInCircle<T extends ITransform = ITransform>(center: IPoint2, radius: number, include?: boolean): Generator<T>;

    queryGoInSphere<T extends ITransform = ITransform>(center: IPoint3, radius: number, include?: boolean): Generator<T>;

    queryGoInRect<T extends ITransform = ITransform>(rect: [IPoint2, IPoint2], include?: boolean): Generator<T>;

    queryGoInCube<T extends ITransform = ITransform>(cube: [IPoint3, IPoint3], include?: boolean): Generator<T>;

    clear(): void;
}

/**
 * 空间索引.
 */
export class SpaceIndexer implements ISpatialQueryProvider {
    public goToTrace: Map<ITransform, TracedGo> = new Map();

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

    public isTracing(go: ITransform): boolean {
        return this.goToTrace.has(go);
    }

    public setRound(val: number): this {
        this._round = val;
        return this;
    }

    public* queryGoInCircle<T extends ITransform = ITransform>(center: IPoint2, radius: number, include: boolean = true)
        : Generator<T> {
        for (const go of this.queryGoInRect(
            [{x: center.x - radius, y: center.y - radius},
                {x: center.x + radius, y: center.y + radius}],
            include)) {
            try {
                if (Gtk.squaredEuclideanDistance2(go.worldTransform.position, center) <= radius * radius) {
                    yield go as T;
                }
            } catch (e) {
                this.logEObjectInvalid(e, "query");
                this.autoUnTrace(this.goToTrace.get(go)!);
            }
        }
    }

    public* queryGoInSphere<T extends ITransform = ITransform>(center: IPoint3, radius: number, include: boolean = true)
        : Generator<T> {
        for (const go of this.queryGoInRect(
            [{x: center.x - radius, y: center.y - radius},
                {x: center.x + radius, y: center.y + radius}],
            include)) {
            try {
                if (Gtk.squaredEuclideanDistance3(go.worldTransform.position, center) <= radius * radius) {
                    yield go as T;
                }
            } catch (e) {
                this.logEObjectInvalid(e, "query");
                this.autoUnTrace(this.goToTrace.get(go)!);
            }
        }
        return;
    }

    public* queryGoInRect<T extends ITransform = ITransform>(rect: [IPoint2, IPoint2], include: boolean = true)
        : Generator<T> {
        const queryRect = Rectangle.fromUnordered(
            [rect[0].x, rect[0].y],
            [rect[1].x, rect[1].y]);

        let generate = this.queryRect(queryRect, include);

        for (const rect of generate) {
            yield this.rectToTrace.get(rect)!.go as T;
        }
        return;
    }

    public* queryGoInCube<T extends ITransform = ITransform>(cube: [IPoint3, IPoint3], include: boolean = true)
        : Generator<T> {
        for (const go of this.queryGoInRect(cube, include)) {
            try {
                if (cube[0].z <= go.worldTransform.position.z &&
                    go.worldTransform.position.z <= cube[1].z) {
                    yield go as T;
                }
            } catch (e) {
                this.logEObjectInvalid(e, "query");
                this.autoUnTrace(this.goToTrace.get(go)!);
            }
        }

        return;
    }

    public trace(go: ITransform, rectify: Rectify, reportInterval: number, autoTrace: boolean): boolean {
        if (this.isTracing(go)) return false;

        const tracedGo = new TracedGo(go, rectify, reportInterval, autoTrace);
        const rect = tracedGo.calRectangle(this._precision);

        this.goToTrace.set(go, tracedGo);
        this.traceToRect.set(tracedGo, rect);
        this.rectToTrace.set(rect, tracedGo);
        this.tree.insert(rect);

        return true;
    }

    public unTrace(go: ITransform): boolean {
        if (!this.isTracing(go)) return false;

        const traceInfo = this.goToTrace.get(go);
        const rect = this.traceToRect.get(traceInfo!);

        this.goToTrace.delete(go);
        traceInfo && this.traceToRect.delete(traceInfo);
        rect && this.rectToTrace.delete(rect);
        rect && this.tree.remove(rect);

        return true;
    }

    public clear() {
        this._tree.clear();
    }

    /**
     * 自动跟踪 GameObject.
     */
    public autoTraceGameObject() {
        let index = 0;
        for (const [_, traceInfo] of this.goToTrace) {
            if (!traceInfo.autoTrace) continue;
            if (index % this._round === this._focusingRound) {
                const rect = this.traceToRect.get(traceInfo);

                if (traceInfo.ready()) {
                    if (traceInfo.go[traceInjectKey] === undefined) {
                        this.tryUpdate(traceInfo, rect!);
                    } else if (traceInfo.go[traceInjectKey] === true) {
                        traceInfo.go[traceInjectKey] = false;
                        this.tryUpdate(traceInfo, rect!);
                    }
                }
            }

            ++index;
        }

        this._focusingRound = (this._focusingRound + 1) % this._round;
    }

    /**
     * 立即跟踪 GameObject.
     * @param {ITransform} go
     */
    public traceInstantly(go: ITransform): boolean {
        if (!this.isTracing(go)) return false;
        const traceInfo = this.goToTrace.get(go);
        const rect = this.traceToRect.get(traceInfo!);

        return this.tryUpdate(traceInfo!, rect!);
    }

    private tryUpdate(traceInfo: TracedGo, oldRect: Rectangle): boolean {
        try {
            const calRect = traceInfo.calRectangle(this._precision, false);
            if (!oldRect.equal(calRect)) {
                const newRect = calRect.clone();
                this.tree.remove(oldRect);
                this.tree.insert(newRect);
                this.traceToRect.set(traceInfo, newRect);
                this.rectToTrace.delete(oldRect);
                this.rectToTrace.set(newRect, traceInfo);

                return true;
            }
            return false;
        } catch (e) {
            this.logEObjectInvalid(e, "tryUpdate");

            this.autoUnTrace(traceInfo);

            return false;
        }
    }

    private queryRect(rect: Rectangle, include: boolean): Generator<Rectangle> {
        return include ?
            this.tree.queryRectInclude(rect) :
            this.tree.queryRectIntersect(rect);
    }

    public autoUnTrace(traceInfo: TracedGo) {
        this.unTrace(traceInfo.go);
        Log4Ts.log(SpaceIndexer, `auto un trace for go who is invalid.`);
    }

//#region Log
    public logEObjectInvalid(e: unknown, occasion: "tryUpdate" | "query") {
        Log4Ts.error(SpaceIndexer,
            `error occurs when ${occasion}`,
            `object may be destroyed. you should call unregister to remove it.`,
            e);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

/**
 * 空间索引器.
 */
export class SpatialProvider implements ISpatialQueryProvider {
    constructor(private _selector: Iterable<ISpatialQueryProvider>) {
    }

    public* queryGoInCircle<T extends ITransform = ITransform>(center: IPoint2, radius: number, include?: boolean): Generator<T> {
        for (const select of this._selector) {
            const iter = select.queryGoInCircle(center, radius, include);
            for (const item of iter) yield item as T;
        }
    }

    public* queryGoInSphere<T extends ITransform = ITransform>(center: IPoint3, radius: number, include?: boolean): Generator<T> {
        for (const select of this._selector) {
            const iter = select.queryGoInSphere(center, radius, include);
            for (const item of iter) yield item as T;
        }
    }

    public* queryGoInRect<T extends ITransform = ITransform>(rect: [IPoint2, IPoint2], include?: boolean): Generator<T> {
        for (const select of this._selector) {
            const iter = select.queryGoInRect(rect, include);
            for (const item of iter) yield item as T;
        }
    }

    public* queryGoInCube<T extends ITransform = ITransform>(cube: [IPoint3, IPoint3], include?: boolean): Generator<T> {
        for (const select of this._selector) {
            const iter = select.queryGoInCube(cube, include);
            for (const item of iter) yield item as T;
        }
    }

    clear(): void {
        for (const select of this._selector) select.clear();
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
 * @version 31.1.2
 */
export default class AreaController extends Singleton<AreaController>() {
//#region Constant
    public static readonly RectanglePrecision = 1;

    /**
     * 自动跟踪的轮数.
     * @desc 由于 GameObject 的数量可能较多 因此采用轮数的方式分散计算.
     * @type {number}
     */
    public static readonly AutoTraceRound = 1;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 以 Tag 静态修饰的空间索引器.
     * @desc 要求人为地添加一级索引.
     * @type {Map<SpaceTag, SpaceIndexer>}
     * @private
     */
    private _spaceIndexers: Map<SpaceTag, SpaceIndexer> = new Map();

    public debug: boolean = false;

    /**
     * 注册一个 GameObject 至空间索引.
     * @param {ITransform} go 作为主键.
     * @param {SpaceTag} tag Tag. 由暂时未限定 Tag 相关的约定 因此请自行定义.
     * @param {(go: ITransform) => Rectangle} rectify 计算 GameObject 的空间 Rectangle.
     * @param {number} reportInterval 汇报位置更新间隔. ms
     * @param {boolean} autoTrace=true 是否 自动跟踪.
     */
    public registerGameObject(go: { worldTransform: mw.Transform },
                              tag: SpaceTag,
                              rectify?: (go: ITransform) => Rectangle,
                              reportInterval?: number,
                              autoTrace: boolean = true): this {
        const indexer = Gtk.tryGet(this._spaceIndexers,
            tag,
            () => new SpaceIndexer(AreaController.RectanglePrecision)
                .setRound(AreaController.AutoTraceRound));

        indexer.trace(go, rectify ?? defaultRectify2, reportInterval!, autoTrace);

        return this;
    }

    /**
     * 立即刷新对象的空间索引.
     * @desc 出于性能考虑 对象的空间索引并不会每帧更新.
     * @desc 当对象的速度较慢 空间索引的低频更新是足用的.
     * @desc 当偶现的高速移动或瞬移发生后 可调用此函数立即跟踪.
     * @param {SpaceTag} tag 指定的 空间索引标签.
     * @param {ITransform} gos
     * @return {number} 更新数量.
     */
    public reportInstantlyByTag(tag: SpaceTag, ...gos: ITransform[]): number {
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
     * @param {ITransform} gos
     * @return {number} 删除数量.
     */
    public unregisterGameObject(tag: SpaceTag, ...gos: ITransform[]): number {
        const indexer = this._spaceIndexers.get(tag);
        if (!indexer) return 0;

        let count = 0;
        for (const go of gos) {
            if (indexer.unTrace(go)) ++count;

            if (go[traceInjectKey] !== undefined) delete go[traceInjectKey];
        }

        return count;
    }

    /**
     * 选择一个或多个空间索引器.
     * @param {SpaceTag} tags
     * @return {SpaceIndexer[]}
     */
    public selectSource(...tags: SpaceTag[]): ISpatialQueryProvider {
        return new SpatialProvider(tags.map(tag => this._spaceIndexers.get(tag))
            .filter(item => item !== undefined));
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
        for (const [_, indexer] of this._spaceIndexers) {
            indexer.autoTraceGameObject();
        }
        this.debug && Log4Ts.log(AreaController, `trace all cost time: ${Date.now() - time}ms`);
    }
}

//#region Auto Register
mw.TimeUtil.onEnterFrame.add((dt) => {
    AreaController.getInstance().autoTraceGameObject();
});

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
