import {KOMUtil} from "./extends/AABB";
import Gtk, {IRecyclable, ObjectPool} from "../../util/GToolkit";
import {Input} from "postcss";
import Log4Ts from "../../depend/log4ts/Log4Ts";

const clipStatus: Map<mw.Widget, mw.Canvas> = new Map();

export class KeyOperationHoverController {
    private _hoverTree = new KOMUtil.AABBTree();

    private _nodeMap: Map<string, KOMUtil.Node> = new Map();

    private _widgetMap: Map<string, mw.Widget> = new Map();

    private _checkInterval = 0.5e3;

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
        let pos = new mw.Vector2();
        let outPixelPosition = new mw.Vector2();
        mw.localToViewport(widget.cachedGeometry, mw.Vector2.zero, outPixelPosition, pos);
        let maxPos = new mw.Vector2();
        let outMaxPixelPosition = new mw.Vector2();
        mw.localToViewport(widget.cachedGeometry, widget.size, outMaxPixelPosition, maxPos);
        let size = maxPos.clone().subtract(pos);

        return new KOMUtil.AABB(pos.clone(), pos.add(size.clone()));
    }

    private traceAll() {
        for (let key of this._nodeMap.keys()) {
            const widget = this._widgetMap.get(key);
            this.updateWidget(key);
        }
    }

//#region Controller
    public insertWidget(widget: mw.Widget) {
        const guid = widget.guid;
        if (this._widgetMap.has(guid)) {
            Log4Ts.log(KeyOperationHoverController, `already has widget ${guid}`);
            return;
        }

        let node = this._hoverTree.createNode(guid, this.getWidgetAABBInViewPort(widget));
        this._widgetMap.set(guid, widget);
        this._nodeMap.set(guid, node);
    }

    private updateWidget(guid: string) {
        let aabb = this.getWidgetAABBInViewPort(this._widgetMap.get(guid));
        let node = this._nodeMap.get(guid);

        if (!node.aabb.equals(aabb)) {
            this._hoverTree.moveNode(node, aabb);
        }
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

function queryAncestorClipStatus(widget: mw.Widget): mw.Canvas {
    if (clipStatus.has(widget)) {
        return clipStatus.get(widget);
    }

    if ((widget.parent as mw.Canvas)?.clipEnable ?? false) {
        clipStatus.set(widget, widget.parent as mw.Canvas);
        return widget.parent as mw.Canvas;
    }

    const c = queryAncestorClipStatus(widget.parent);
    if (c) clipStatus.set(widget, c);
    else return null;
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