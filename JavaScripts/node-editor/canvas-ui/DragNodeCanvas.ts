
/** 
 * AUTHOR: zevzhang
 * TIME: 2023.08.11-15.40.12
 */

import { EventNotify } from "../EventNotify";
import { BaseUINode } from "../node-ui/BaseUINode";
import { DragStartPointAndLine } from "../node-ui/DragStartPointAndLine";
import { LinePanelNode } from "../node-ui/LinePanelNode";
import { mousePosToCanvasPos } from "../utils/Utils";



export default class DragNodeCanvas extends mw.UIScript {
    //当前拖动的节点
    public currentDragNode: BaseUINode = undefined;

    //记录拖动节点的鼠标位置和节点坐标的偏移
    protected dragOffset: mw.Vector2 = undefined;

    //当前拖动的节点
    public currentDragPoint: DragStartPointAndLine = undefined;

    //记录加入Canvas的节点UI、线UI的index
    public uiRecord: string[] = [];

    private _setDragPointListener: mw.EventListener = undefined;
    private _setDragNodeListener: mw.EventListener = undefined;

    public onStart() {

        //改成visible，快速拖动时不会dragleave
        this.rootCanvas.visibility = mw.SlateVisibility.Visible;


        this._setDragPointListener = Event.addLocalListener(EventNotify.SetCurrentDragPoint, (ui: DragStartPointAndLine) => {

            this.currentDragPoint = ui;
        });
        this._setDragNodeListener = Event.addLocalListener(EventNotify.SetCurrentDragNode, (ui: BaseUINode) => {

            this.currentDragNode = ui;
        });
    }

    public addUI(ui: mw.Widget) {
        this.rootCanvas.addChild(ui);
        this.uiRecord.push(ui.name);
    }

    public removeAllUI(): void {
        //删除所有的inspectorNode
        // inspectorNodes.forEach((value, key) => {
        //     value.onDeleteBtnClick();
        // });
        // inspectorNodes.clear();
        this.uiRecord.forEach(element => {
            //有的点可能已经销毁了
            const item = this.rootCanvas.getChildByName(element);
            if (item) {
                item.destroyObject();
            }
        });
        this.uiRecord = [];
    }

    onDestroy() {
        Event.removeListener(this._setDragPointListener);
        Event.removeListener(this._setDragNodeListener);
    }

    /**
     * 拖拽事件完成,node的drop事件也会穿透下来
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    onDrop(InGemotry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InOperation: mw.DragDropOperation): boolean {
        console.log("onDrop");
        const payLoad = InOperation.tryGetDragDropPayLoad();
        if (payLoad.name === "DragNode" && this.currentDragNode) {
            //在node中处理过了
        } else if (payLoad.name === "DragLine" && this.currentDragPoint) {
            this.currentDragPoint.cancelDrawLine();
            this.currentDragPoint = undefined;
        }
        return true;
    }

    /**
    * 拖拽操作生成事件触发后进入这个UI时触发
    */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onDragEnter(InGeometry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation) {
        console.log("onDragEnter");
        const payLoad = InDragDropOperation.tryGetDragDropPayLoad();
        if (this.currentDragNode && payLoad.name === "DragNode") {
            const dragOriPos = mousePosToCanvasPos(InGeometry, InDragDropEvent, this.rootCanvas.size, this.rootCanvas.position, this.rootCanvas.renderScale);

            this.dragOffset = dragOriPos.subtract(this.currentDragNode.uiObject.position);
        } else if (payLoad.name === "DragLine" && this.currentDragPoint) {
            //console.log("DragLineEnters");
            //计算起点
            //起点是左上角0，0的屏幕坐标系
            const startPoint = this.currentDragPoint.getCenterPosInScreen();
            this.currentDragPoint.currentStartPoint = startPoint;
        }
    }

    /**
     * 必须在外部处理拖拽enter,over事件，如果在BaseUINode内部处理的话，得到的ingeometry是错误的
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onDragOver(InGeometry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation): boolean {
        console.log("onDragOver");
        const realPos = mousePosToCanvasPos(InGeometry, InDragDropEvent, this.rootCanvas.size, this.rootCanvas.position, this.rootCanvas.renderScale);
        const payLoad = InDragDropOperation.tryGetDragDropPayLoad();
        if (payLoad.name === "DragNode" && this.currentDragNode) {
            //节点根据点击的位置移动
            this.currentDragNode.uiObject.position = realPos.subtract(this.dragOffset);
            if (this.currentDragNode instanceof LinePanelNode) {
                const node = this.currentDragNode as LinePanelNode;
                node.updateAllLine();
            }
            // if (this.currentDragNode instanceof InspectorNode) {
            //     const node = this.currentDragNode as InspectorNode;
            //     node.updateAllLine();
            // }

        } else if (payLoad.name === "DragLine" && this.currentDragPoint) {
            this.currentDragPoint.dragAndDrawLine(this.currentDragPoint.currentStartPoint, realPos);
        }
        return true;
    }

    /**
     * 拖拽操作生成事件触发后离开这个UI时触发
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onDragLeave(InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation) {
        console.log("onDragLeave");
        // if (this._isDraging) {
        //     const realPos = screenPosToCanvasPos(InDragDropEvent.screenSpacePosition, this.rootCanvas.size, this.rootCanvas.position, this.rootCanvas.renderScale);
        //     const payLoad = InDragDropOperation.tryGetDragDropPayLoad();
        //     if (payLoad.name === "DragNode" && this.currentDragNode) {
        //         //节点根据点击的位置移动
        //         this.currentDragNode.uiObject.position = realPos.subtract(this.dragOffset);
        //         if (this.currentDragNode instanceof LinePanelNode) {
        //             const node = this.currentDragNode as LinePanelNode;
        //             node.updateAllLine();
        //         }
        //         if (this.currentDragNode instanceof InspectorNode) {
        //             const node = this.currentDragNode as InspectorNode;
        //             node.updateAllLine();
        //         }

        //     } else if (payLoad.name === "DragLine" && this.currentDragPoint) {
        //         this.currentDragPoint.dragAndDrawLine(this.currentDragPoint.currentStartPoint, realPos);
        //     }
        // }

        const payLoad = InDragDropOperation.tryGetDragDropPayLoad();
        if (payLoad.name === "DragLine") {
            this.currentDragPoint.cancelDrawLine();
            this.currentDragPoint = undefined;
        }
    }

    /**
         * 当这个UI界面是可以接收事件的时候
         * 手指或则鼠标触发一次Touch时触发
         * 返回事件是否处理了
         * 如果处理了，那么这个UI界面可以接收这次Touch后续的Move和End事件
         * 如果没有处理，那么这个UI界面就无法接收这次Touch后续的Move和End事件
         */
    protected onTouchStarted(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        console.log("onTouchStarted");

        return mw.EventReply.unHandled; //mw.EventReply.handled
    }

    /**
     * 手指或则鼠标再UI界面上移动时
     */
    protected onTouchMoved(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        console.log("onTouchMoved");
        return mw.EventReply.unHandled; //mw.EventReply.handled
    }

    /**
     * 手指或则鼠标离开UI界面时
     */
    protected onTouchEnded(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        console.log("onTouchEnded");
        return mw.EventReply.unHandled; //mw.EventReply.handled
    }
}
