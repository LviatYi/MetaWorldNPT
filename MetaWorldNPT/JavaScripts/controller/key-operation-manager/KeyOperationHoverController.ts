import {KOMUtil} from "./extends/AABB";
import Gtk, {IRecyclable, ObjectPool, Regulator, Switcher} from "../../util/GToolkit";
import Log4Ts from "../../depend/log4ts/Log4Ts";

const clipStatus: Map<mw.Widget, mw.Canvas> = new Map();

export class KeyOperationHoverController {
    private _hoverTree = new KOMUtil.AABBTree();

    private _nodeMap: Map<string, KOMUtil.Node> = new Map();

    private _widgetMap: Map<string, mw.Widget> = new Map();

    /**
     * 是否无可 Hover 节点.
     * @return {boolean}
     */
    public empty(): boolean {
        return this._nodeMap.keys().next().done;
    }

    private _widgetTraceRegulator: Regulator;

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
        const leftTop = Gtk.getUiResolvedPosition(widget);
        return new KOMUtil.AABB(leftTop, leftTop.add(Gtk.getUiResolvedSize(widget)));
    }

    /**
     * 尝试更新所有树节点.
     * @private
     */
    private traceAll() {
        for (let [guid, widget] of this._widgetMap.entries()) {
            let broken = false;
            if (!widget.parent) broken = true;
            else new Switcher()
                .case(() => broken = !this.updateTreeNode(guid), true, true)
                .case(() => broken = !this.reAddToTree(guid), true, false)
                .case(() => this.tempRemoveFromTree(guid), false, true)
                .judge(widget.visible, this._nodeMap.has(guid));

            if (broken) {
                const node = this._nodeMap.get(guid);
                if (node) {
                    this._hoverTree.destroyNode(this._nodeMap.get(guid));
                    this._nodeMap.delete(guid);
                }
                this._widgetMap.delete(guid);
            }
        }
    }

//#region Controller
    /**
     * 插入 Widget.
     * @param {mw.Widget} widget
     */
    public insertWidget(widget: mw.Widget): boolean {
        const guid = widget.guid;
        if (this._widgetMap.has(guid)) {
            Log4Ts.log(KeyOperationHoverController, `already has widget ${guid}`);
            return false;
        }
        this._widgetMap.set(guid, widget);
        return this.addToTree(widget);
    }

    /**
     * 更新 Widget 的 AABB.
     * @param {string} guid
     * @return {boolean}
     * @private
     */
    private updateTreeNode(guid: string): boolean {
        let aabb: KOMUtil.AABB;
        try {
            aabb = this.getWidgetAABBInViewPort(this._widgetMap.get(guid));
        } catch (e) {
            Log4Ts.log(KeyOperationHoverController, `error occurs when update widget. maybe widget has been destroyed ${guid}`);
            return false;
        }
        let node = this._nodeMap.get(guid);
        if (!node.aabb.equals(aabb)) {
            this._hoverTree.moveNode(node, aabb);
        }

        return true;
    }

    public removeWidget(widgetOrGuid: mw.Widget | string) {
        const guid = typeof widgetOrGuid === "string" ? widgetOrGuid : widgetOrGuid.guid;
        if (!this._widgetMap.has(guid)) {
            Log4Ts.log(KeyOperationHoverController, `widget not found ${guid}`);
            return;
        }

        this._hoverTree.destroyNode(this._nodeMap.get(guid));
        this._nodeMap.delete(guid);
        this._widgetMap.delete(guid);
    }

    /**
     * 临时从树中移除控件.
     * @param {string} guid
     * @private
     */
    private tempRemoveFromTree(guid: string) {
        this._hoverTree.destroyNode(this._nodeMap.get(guid));
        this._nodeMap.delete(guid);
    }

    private reAddToTree(guid: string): boolean {
        const widget = this._widgetMap.get(guid);
        if (!widget) {
            Log4Ts.log(KeyOperationHoverController, `widget not found ${guid}`);
            return false;
        }

        return this.addToTree(widget);
    }

    private addToTree(widget: mw.Widget): boolean {
        try {
            let node = this._hoverTree.createNode(widget.guid, this.getWidgetAABBInViewPort(widget));
            this._nodeMap.set(widget.guid, node);
            return true;
        } catch (e) {
            Log4Ts.log(KeyOperationHoverController, `error occurs when update widget. maybe widget has been destroyed ${widget?.guid}`);
            return false;
        }
    }

    /**
     * 测试某点下的 Widget.
     * @param {mw.Vector2} tester 测试点.
     * @returns {mw.Widget | null} 击中的第一个 Widget.
     *      - 如果没有击中任何 Widget, 返回 null.
     */
    public testPoint(tester: mw.Vector2): mw.Widget | null {
        const arr = this._hoverTree
            .queryPoint(tester)
            .map(item => {
                return this._widgetMap.get(item.data as string);

            })
            .filter(item => {
                const p = queryAncestorClipStatus(item);
                return !p || this.isPointInWidget(tester, p);
            })
            .sort(Gtk.compareWidgetStack);

        return arr.length > 0 ? arr[arr.length - 1] : null;
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
 * @return {mw.Canvas | null}
 *  - 首个具有裁切状态的祖先控件.
 *  - 如果没有找到 返回 null.
 */
function queryAncestorClipStatus(widget: mw.Widget): mw.Canvas | null {
    if (clipStatus.has(widget)) {
        return clipStatus.get(widget);
    }

    if (!widget.parent) return null;
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
class BVHTreeNodeDebugImage implements IRecyclable {
    public image: mw.Image;

    makeEnable(node: KOMUtil.Node): void {
        Gtk.setUiSize(this.image, node.aabb.max.x - node.aabb.min.x, node.aabb.max.y - node.aabb.min.y);
        Gtk.setUiPosition(this.image, node.aabb.min.x, node.aabb.min.y);
        Gtk.trySetVisibility(this.image, true);
    }

    makeDisable(): void {
        Gtk.trySetVisibility(this.image, false);
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
    destructor: (img) => {
        img.image.destroyObject();
    }
});

const debugImages: BVHTreeNodeDebugImage[] = [];

function drawBVHTree(tree: KOMUtil.AABBTree) {
    debugImagesPool.push(...debugImages);
    debugImages.length = 0;
    tree.traverse((node) => {
        debugImages.push(this._debugImagesPool.pop(node));
    });
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄