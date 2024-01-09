/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-03 15:04:31
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-08 19:11:26
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\BaseUINode.ts
 * @Description  : UI节点基类，放在单独的文件里，和BaseAddUINodeBtn类放一起的话会引入MainUI循环依赖问题
 */

import BaseUINode_Generate from "../../ui-generate/node-ui/BaseUINode_generate";
import DragNodeCanvas from "../canvas-ui/DragNodeCanvas";
import { EventNotify } from "../EventNotify";
import { NodeAndLineManager } from "./manager/NodeAndLineManager";
import Event = mw.Event;


/** 通用UI节点 */
export abstract class BaseUINode extends BaseUINode_Generate {

    public borderHighlightColor = "#F7F7FA"
    public borderColor = "#2F3E3E"
    //宿主
    public parentCanvas: DragNodeCanvas = undefined;

    //显隐内容栏
    public isCollapsed: boolean = false;

    protected _isDraging = false;
    private _dragListener: mw.EventListener = undefined;
    private _deleteListener: mw.EventListener = undefined;
    public nodeId = -1;

    //标题栏和内容栏的间隔
    //public titleCanvPadding = 10;
    public onStart() {
        this.uiObject.zOrder = mw.UILayerBottom;
        this.uiObject.name = "BaseUINode";

        this.deleteBtn.onClicked.add(this.onDeleteBtnClick.bind(this));
        this.collapseBtn.onClicked.add(this.onCollapsedBtnClick.bind(this));
        this._dragListener = Event.addLocalListener(EventNotify.SetCurrentDragNode, this.onStartDragEvent.bind(this));
        this._deleteListener = Event.addLocalListener(EventNotify.DeleteAllUI, this.onUIDestroy.bind(this));
        this.onStartPanel();
    }

    public setNodeInfo(parentCanvas: DragNodeCanvas, titleText: string, nodeId: number) {
        this.parentCanvas = parentCanvas;
        this.titleText.text = titleText;
        this.nodeId = nodeId;
    }

    /** 
     * @description: onStart base onStart调用之后会调用子类的onStartPanel
     * @return {*}
     */
    protected abstract onStartPanel(): void;


    public onDeleteBtnClick() {
        NodeAndLineManager.ins.deleteNode(this.nodeId);
        this.uiObject.destroyObject();
    }

    protected onCollapsedBtnClick() {
        if (this.isCollapsed) {
            this.contentCanvas.visibility = mw.SlateVisibility.Visible;
            //this.backGround.size = this.rootCanvas.size;  
        } else {
            this.contentCanvas.visibility = mw.SlateVisibility.Collapsed;

            //this.backGround.size = new mw.Vector2(this.rootCanvas.size.x,this.tittleCanv.size.y+5);
        }
        this.isCollapsed = !this.isCollapsed;
    }

    /**
     * 当鼠标进入此UI范围内时会触发此函数
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onMouseEnter(InGemotry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.error("UI Has onMouseEnter===")

        this.titleBorder.imageColor = LinearColor.colorHexToLinearColor(this.borderHighlightColor);
        this.contentBorder.imageColor = LinearColor.colorHexToLinearColor(this.borderHighlightColor);

        return mw.EventReply.handled; //mw.EventReply.unhandled
    }

    /**
    * 当鼠标离开此UI 的范围时会触发此函数
    */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onMouseLeave(InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.error("UI Has onMouseLeave===")
        this._isDraging = false;
        this.titleBorder.imageColor = LinearColor.black;
        this.contentBorder.imageColor = LinearColor.black;

        return mw.EventReply.handled; //mw.EventReply.unhandled
    }




    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    onTouchStarted(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.log("OnTouchStarted: ");
        return this.detectDragIfPressed(InPointerEvent, mw.Keys.AnyKey);
    }

    //处理touchmoved事件否则会传递给下层画布的touchmove
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onTouchMoved(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.log("onTouchMoved");

        return mw.EventReply.handled;
    }

    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onDragDetected(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.DragDropOperation {
        //console.log("OnDragDetected: " + InPointerEvent.screenSpacePosition);
        //设置当前拖拽节点
        //MainUI.ins.mainCanvas.currentDragNode = this;

        Event.dispatchToLocal(EventNotify.SetCurrentDragNode, this);

        //返回拖拽事件
        const payload = new mw.DragDropPayLoad();
        payload.name = "DragNode";
        this._isDraging = true;
        return this.newDragDrop(null, "", payload, mw.DragPivot.CenterCenter, mw.Vector2.zero);
    }


    /**
     * 拖拽事件完成，因为是在Node上完成的拖拽事件所有下面的事件会执行
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    onDrop(InGeometry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InOperation: mw.DragDropOperation) {
        const payLoad = InOperation.tryGetDragDropPayLoad();
        if (payLoad.name === "DragNode" && this._isDraging) {
            this._isDraging = false;
            this.titleBorder.imageColor = LinearColor.colorHexToLinearColor(this.borderColor);
            this.contentBorder.imageColor = LinearColor.colorHexToLinearColor(this.borderColor);
            Event.dispatchToLocal(EventNotify.SetCurrentDragNode, undefined);
        }
    }

    /**
     * 拖拽操作生成事件触发后进入这个UI时触发
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onDragEnter(InGeometry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation) {

        this.titleBorder.imageColor = LinearColor.colorHexToLinearColor(this.borderHighlightColor);
        this.contentBorder.imageColor = LinearColor.colorHexToLinearColor(this.borderHighlightColor);

    }

    /**
     * 拖拽操作生成事件触发后离开这个UI时触发
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onDragLeave(InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation) {
        console.log("onDragLeaveNode");
        //if (this._isDraging) return true;
        //this.backGround.imageColor = LinearColor.colorHexToLinearColor(this.bgColor);
        this.titleBorder.imageColor = LinearColor.colorHexToLinearColor(this.borderColor);
        this.contentBorder.imageColor = LinearColor.colorHexToLinearColor(this.borderColor);

        //console.warn("1onDragLeave"+InDragDropEvent.screenSpacePosition)
    }

    /**
      * 拖拽操作生成事件触发后，拖拽事件没有完成而是取消时触发
      */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onDragCancelled(InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation) {
        //this.backGround.imageColor = LinearColor.colorHexToLinearColor(this.bgColor);
        this.titleBorder.imageColor = LinearColor.colorHexToLinearColor(this.borderHighlightColor);
        this.contentBorder.imageColor = LinearColor.colorHexToLinearColor(this.borderHighlightColor);
        //console.warn("onDragCancelled"+InDragDropEvent.screenSpacePosition)
    }

    abstract onStartDragEvent(ui: BaseUINode);

    onUIDestroy() {
        Event.removeListener(this._dragListener);
        Event.removeListener(this._deleteListener);
        this.destroy();
    }
}
