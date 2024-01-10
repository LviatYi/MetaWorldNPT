/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-04 18:16:35
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-07 16:33:18
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\canvas-ui\DragAndScaleCanvas.ts
 * @Description  : 全局滚动缩放画布
 */


import { EventNotify } from "../EventNotify";
import { BaseUINode } from "../node-ui/BaseUINode";
import DragNodeCanvas from "./DragNodeCanvas";
import Event = mw.Event;

export class DragAndScaleCanvas extends DragNodeCanvas {
    //节点画布背景
    public contantBG: mw.Image = undefined;

    private _lastDragPos: mw.Vector2 = new mw.Vector2(0, 0);

    protected canvasSize: mw.Vector2 = new mw.Vector2(10000, 2000);

    //点击开始时是点在rollcanvas上才可以拖动
    private _canMove: boolean = false;

    public onStart() {
        super.onStart();
        this.rootCanvas.size = this.canvasSize;
        this.rootCanvas.constraints = new mw.UIConstraintAnchors(mw.UIConstraintHorizontal.Left, mw.UIConstraintVertical.Top);

        this.rootCanvas.clipEnable = true;
        const size = WindowUtil.getViewportSize();
        this.rootCanvas.position = this.rootCanvas.size.multiply(0.5).subtract(size.multiply(0.5)).negative;
        this.contantBG = mw.Image.newObject(this.rootCanvas);

        this.contantBG.size = this.rootCanvas.size;
        this.contantBG.imageColor = LinearColor.colorHexToLinearColor("#363636");
        this.contantBG.renderOpacity = 0.3;
        this.contantBG.zOrder = mw.UILayerScene;
        this.contantBG.visibility = mw.SlateVisibility.Visible;

    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    onTouchStarted(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {

        //console.log("OnTouchStarted: roll" + InPointerEvent.screenSpacePosition);
        this._canMove = true;
        return mw.EventReply.handled;
    }


    /**
     * 手指或则鼠标再UI界面上移动时
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onTouchMoved(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.log("onTouchMovedRoll");
        if (this._lastDragPos != undefined && !this._lastDragPos.equals(mw.Vector2.zero) && this._canMove) {
            const pos = mw.absoluteToLocal(InGeometry, InPointerEvent.screenSpacePosition);
            const offset = pos.subtract(this._lastDragPos);
            const size = WindowUtil.getViewportSize();
            //位置偏移
            const result = this.rootCanvas.position.add(offset);

            //限制在视口范围内，考虑画布缩放
            //用vector乘法会丢精度，所以用这种方式
            const scaleOffect = new mw.Vector2(this.rootCanvas.size.x * this.rootCanvas.renderScale.x,
                this.rootCanvas.size.y * this.rootCanvas.renderScale.y).subtract(this.rootCanvas.size).multiply(0.5);
            const max = mw.Vector2.zero.add(scaleOffect);
            const min = this.rootCanvas.size.subtract(size).add(scaleOffect).negative;
            this.rootCanvas.position = mw.Vector2.clamp(result, min, max);
        }
        this._lastDragPos = mw.absoluteToLocal(InGeometry, InPointerEvent.screenSpacePosition);
        return mw.EventReply.handled; //mw.EventReply.handled
    }

    /**
     * 手指或则鼠标离开UI界面时
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onTouchEnded(InGemotry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        this._lastDragPos = undefined;
        //console.log("touchedend roll");
        this._canMove = false
        return mw.EventReply.handled; //mw.EventReply.unHandled
    }

    /**
    * 在此UI上面滑动鼠标滚轮会执行此函数
    */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onMouseWheel(InGemotry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {

        const delta = new mw.Vector2(InPointerEvent.mouseWheelDelta, InPointerEvent.mouseWheelDelta);
        const result = this.rootCanvas.renderScale.add(delta.multiply(0.05));
        this.rootCanvas.renderScale = mw.Vector2.clamp(result, new mw.Vector2(0.3, 0.3), new mw.Vector2(5, 5));
        return mw.EventReply.handled; //mw.EventReply.unhandled
    }

    /**
     * 拖拽事件完成,node的drop事件也会穿透下来
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    onDrop(InGemotry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InOperation: mw.DragDropOperation): boolean {
        const payLoad = InOperation.tryGetDragDropPayLoad();
        if (payLoad.name === "DragNode" && this.currentDragNode) {
            //在边缘的时候，node上的drop事件不会触发
            Event.dispatchToLocal(EventNotify.SetCurrentDragNode, undefined);

        } else if (payLoad.name === "DragLine" && this.currentDragPoint) {
            //console.log("DragLineDropOnCanvas");
            //如果没连到节点上，就删除

            this.currentDragPoint.cancelDrawLine();
            this.currentDragPoint = undefined;

        }
        return true;
    }

    /**
     * 拖拽操作生成事件触发后，没有完成完成的拖拽事件而取消时触发
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onDragCancelled(InGemotry: mw.Geometry, InDragDropEvent: mw.PointerEvent) {

    }

}