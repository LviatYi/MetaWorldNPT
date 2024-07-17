import { KOMUtil } from "./extends/AABB";
import Gtk, { GtkTypes, IRecyclable, ObjectPool, Regulator, Switcher } from "gtoolkit";
import Log4Ts from "../../depend/log4ts/Log4Ts";

const clipStatus: Map<mw.Widget, mw.Canvas | undefined> = new Map();

export class KeyOperationHoverController {
    private _hoverTree = new KOMUtil.AABBTree();

    private _nodeMap: Map<mw.Widget, KOMUtil.Node> = new Map();

    private _widgetSet: Set<mw.Widget> = new Set();

    /**
     * 是否无可 Hover 节点.
     * @return {boolean}
     */
    public empty(): boolean {
        return !!this._nodeMap.keys().next().done;
    }

    private _widgetTraceRegulator: Regulator = new Regulator(GtkTypes.Interval.Sensitive);

    public get widgetTraceInterval(): number {
        return this._widgetTraceRegulator.updateInterval;
    }

    /**
     * 控件 AABB 盒刷新检查间隔.
     * @param {number} value
     */
    public set widgetTraceInterval(value: number) {
        this._widgetTraceRegulator.interval(value);
    }

    constructor() {
        TimeUtil.onEnterFrame.add(() => {
            if (this._widgetTraceRegulator.request()) {
                this.traceAll();
            }
        });
    }

    /**
     * 是否 控件 A 和控件 B 有重叠.
     * @param {mw.Widget} widgetA
     * @param {mw.Widget} widgetB
     * @returns {boolean}
     * @private
     */
    private isWidgetRangeOverlap(widgetA: mw.Widget, widgetB: mw.Widget): boolean {
        let widgetA_AABB = this.getWidgetAABBInViewPort(widgetA);
        let widgetB_AABB = this.getWidgetAABBInViewPort(widgetB);
        return widgetA_AABB.testOverlap(widgetB_AABB);
    }

    /**
     * 是否 点在控件内.
     * @param {mw.Vector2} point
     * @param {mw.Widget} widget
     * @returns {boolean}
     * @private
     */
    private isPointInWidget(point: mw.Vector2, widget: mw.Widget): boolean {
        return this.getWidgetAABBInViewPort(widget).testPoint(point);
    }

    /**
     * 获取控件在视口空间下的 AABB.
     * @param widget UI 控件
     * @return 包围盒
     */
    private getWidgetAABBInViewPort(widget: mw.Widget): KOMUtil.AABB {
        const leftTop = widget.cachedGeometry.getAbsolutePosition();
        return new KOMUtil.AABB(leftTop, leftTop.clone().add(widget.cachedGeometry.getAbsoluteSize()));
    }

    /**
     * 尝试更新所有树节点.
     * @private
     */
    private traceAll() {
        for (let widget of this._widgetSet.keys()) {
            let broken = false;
            if (!widget.parent) broken = true;
            else new Switcher()
                .case(() => broken = !this.updateTreeNode(widget), true, true)
                .case(() => broken = !this.reAddToTree(widget), true, false)
                .case(() => this.tempRemoveFromTree(widget), false, true)
                .judge(widget.visible, this._nodeMap.has(widget));

            if (broken) {
                const node = this._nodeMap.get(widget);
                if (node) {
                    this._hoverTree.destroyNode(node);
                    this._nodeMap.delete(widget);
                }
                this._widgetSet.delete(widget);
            }
        }
    }

//#region Controller
    /**
     * 插入 Widget.
     * @param {mw.Widget} widget
     */
    public insertWidget(widget: mw.Widget): boolean {
        if (this._widgetSet.has(widget)) {
            Log4Ts.log(KeyOperationHoverController, `already has widget ${widget.guid}`);
            return false;
        }
        this._widgetSet.add(widget);
        return this.addToTree(widget);
    }

    /**
     * 更新 Widget 的 AABB.
     * @param {mw.Widget} widget
     * @return {boolean}
     * @private
     */
    private updateTreeNode(widget: mw.Widget): boolean {
        let aabb: KOMUtil.AABB;
        try {
            aabb = this.getWidgetAABBInViewPort(widget);
        } catch (e) {
            Log4Ts.log(KeyOperationHoverController, `error occurs when update widget. maybe widget has been destroyed ${widget.name}`);
            return false;
        }
        let node = this._nodeMap.get(widget);
        if (!node) return false;
        if (!node.aabb.equals(aabb)) {
            this._hoverTree.moveNode(node, aabb);
        }

        return true;
    }

    public removeWidget(widget: mw.Widget) {
        if (!this._widgetSet.has(widget)) {
            Log4Ts.log(KeyOperationHoverController, `widget not found ${widget.name}`);
            return;
        }
        const node = this._nodeMap.get(widget);
        if (!node) return;
        this._hoverTree.destroyNode(node);
        this._nodeMap.delete(widget);
        this._widgetSet.delete(widget);
    }

    /**
     * 临时从树中移除控件.
     * @param {mw.Widget} widget
     * @private
     */
    private tempRemoveFromTree(widget: mw.Widget) {
        const node = this._nodeMap.get(widget);
        if (!node) return;
        this._hoverTree.destroyNode(node);
        this._nodeMap.delete(widget);
    }

    private reAddToTree(widget: mw.Widget): boolean {
        if (!this._widgetSet.has(widget)) {
            Log4Ts.log(KeyOperationHoverController, `widget not found ${widget.name}`);
            return false;
        }

        return this.addToTree(widget);
    }

    private addToTree(widget: mw.Widget): boolean {
        try {
            let node = this._hoverTree.createNode(widget, this.getWidgetAABBInViewPort(widget));
            this._nodeMap.set(widget, node);
            return true;
        } catch (e) {
            Log4Ts.log(KeyOperationHoverController, `error occurs when update widget. maybe widget has been destroyed ${widget?.name}`);
            return false;
        }
    }

    /**
     * 测试某点下的 Widget.
     * @param {mw.Vector2} tester 测试点.
     * @returns {mw.Widget | undefined} 击中的第一个 Widget.
     *      - 如果没有击中任何 Widget, 返回 undefined.
     */
    public testPoint(tester: mw.Vector2): mw.Widget | undefined {
        const arr = this._hoverTree
            .queryPoint(tester)
            .map(item => {
                return item.data;
            })
            .filter(item => {
                const p = queryAncestorClipStatus(item);
                return !p || this.isPointInWidget(tester, p);
            })
            .sort(Gtk.compareWidgetStack);

        return arr.length > 0 ? arr[arr.length - 1] : undefined;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Debug
    /**
     * 在 UI root canvas 中绘制 BVH 树.
     */
    public drawTree() {
        drawBVHTree(this._hoverTree);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

/**
 * 查询控件祖先的裁剪状态.
 * @desc memorized. 将从 widget 的父级开始缓存查询结果.
 * @param {mw.Widget} widget
 * @return {mw.Canvas | undefined}
 *  - 首个具有裁切状态的祖先控件.
 *  - 如果没有找到 返回 undefined.
 */
function queryAncestorClipStatus(widget: mw.Widget): mw.Canvas | undefined {
    if (clipStatus.has(widget)) {
        return clipStatus.get(widget);
    }

    if (!widget.parent) return undefined;
    if ((widget.parent as mw.Canvas)?.clipEnable ?? false) {
        return widget.parent as mw.Canvas;
    }

    const c = queryAncestorClipStatus(widget.parent);
    clipStatus.set(widget, c);
    return c;
}

/**
 * 清除控件所有祖先的裁剪状态缓存.
 * @param {mw.Widget} widget
 */
export function clearAncestorClipStatusMemorized(widget: mw.Widget) {
    let p = widget.parent;
    while (p) {
        clipStatus.delete(widget);
        p = p.parent;
    }
}

//#region Debug
let viewportLeftTop: mw.Vector2 | undefined = undefined;

class BVHTreeNodeDebugImage implements IRecyclable {
    public image: mw.Image;

    public makeEnable(node: KOMUtil.Node): void {
        const viewportScale = mw.getViewportScale();

        Gtk.setUiSize(this.image, (node.aabb.max.x - node.aabb.min.x) / viewportScale + 4, (node.aabb.max.y - node.aabb.min.y) / viewportScale + 4);
        Gtk.setUiPosition(this.image, (node.aabb.min.x - (viewportLeftTop?.x ?? 0)) / viewportScale - 2, (node.aabb.min.y - (viewportLeftTop?.y ?? 0)) / viewportScale - 2);
        Gtk.trySetVisibility(this.image, true);
    }

    public makeDisable(): void {
        Gtk.trySetVisibility(this.image, false);
    }

    public makeDestroy(): void {
        this.image.destroyObject();
    }

    constructor(image: mw.Image) {
        this.image = image;
    }
}

const debugImagesPool = new ObjectPool({
    generator: () => {
        let image = mw.Image.newObject(UIService.canvas);
        image.imageGuid = Gtk.IMAGE_WHITE_SQUARE_GUID;
        image.imageDrawType = SlateBrushDrawType.Box;
        image.renderOpacity = 0.1;
        return new BVHTreeNodeDebugImage(image);
    },
});

const debugImages: BVHTreeNodeDebugImage[] = [];

function drawBVHTree(tree: KOMUtil.AABBTree) {
    debugImagesPool.tempPush(...debugImages);
    debugImages.length = 0;
    viewportLeftTop = UIService.canvas.cachedGeometry.getAbsolutePosition();

    tree.traverse((node) => {
        const debugImage = debugImagesPool.pop(node);
        if (!debugImage) return;
        debugImages.push(debugImage);
    });
    debugImagesPool.finishTemp();
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄