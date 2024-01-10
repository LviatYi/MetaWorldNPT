/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-06 16:05:11
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-08 18:38:54
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\line-node\LinePanelNode.ts
 * @Description  : 包含连接线的节点
 */


import { DragStartPointAndLine } from "./DragStartPointAndLine";
import Event = mw.Event;
import { EventNotify } from "../../EventNotify";
import { BaseUINode } from "../BaseUINode";
import { NodeType, NodeAndLineManager } from "../manager/NodeAndLineManager";
import { DragEndPoint } from "./DragEndPoint";

export class LinePanelNode extends BaseUINode {

    public startLinePoint: DragStartPointAndLine;

    public endLinePoint: DragEndPoint;

    public nodeType: NodeType;

    protected onStartPanel(): void {
        //this.playNowBtn.visibility = mw.SlateVisibility.Collapsed;
        this.startLinePoint = mw.createUIOnlyClass(DragStartPointAndLine);
        this.startLinePoint.uiObject.position = new mw.Vector2(this.contentCanvas.size.x - this.startLinePoint.size.x * 0.5,
            this.contentCanvas.size.y * 0.5 - this.startLinePoint.size.y * 0.5);
        //记录在屏幕下的位置，使用node的position的引用
        this.startLinePoint.offsetPosInNode = new mw.Vector2(0, this.titleCanvas.size.y)
            .add(this.startLinePoint.uiObject.position.clone())
            .add(this.startLinePoint.size.clone().multiply(0.25));


        this.endLinePoint = mw.createUIOnlyClass(DragEndPoint);
        this.endLinePoint.uiObject.position = new mw.Vector2(-this.startLinePoint.size.x * 0.5,
            this.contentCanvas.size.y * 0.5 - this.startLinePoint.size.y * 0.5);

        this.endLinePoint.offsetPosInNode = new mw.Vector2(0, this.titleCanvas.size.y)
            .add(this.endLinePoint.uiObject.position.clone())
            .add(this.endLinePoint.size.clone().multiply(0.25));
        this.canUpdate = true;
        // Event.addLocalListener(EventNotify.UpdateAllLine, this.updateAllLine.bind(this));
    }

    get startLinePointPosInScreen(): Vector2 {
        return this.startLinePoint.getCenterPosInScreen();
    }

    get endLinePointPosInScreen(): Vector2 {
        return this.endLinePoint.getCenterPosInScreen();
    }

    protected onCollapsedBtnClick(): void {
        if (this.isCollapsed) {

            NodeAndLineManager.ins.showLineByNodeId(this.nodeId);

        } else {

            NodeAndLineManager.ins.collapseLineByNodeId(this.nodeId);

        }
        super.onCollapsedBtnClick();
    }

    public onDeleteBtnClick(): void {

        NodeAndLineManager.ins.deleteLineByNodeId(this.nodeId);
        Event.dispatchToLocal(EventNotify.DeleteNode, this.nodeId);
        super.onDeleteBtnClick();
    }

    protected onAdded() {
        //onAdded的时候才被赋值
        this.startLinePoint.parentCanvas = this.parentCanvas;
        this.startLinePoint.hostNode = this;
        this.contentCanvas.addChild(this.startLinePoint.uiObject);

        this.endLinePoint.parentCanvas = this.parentCanvas;
        this.endLinePoint.hostNode = this;
        this.contentCanvas.addChild(this.endLinePoint.uiObject);
    }

    updateAllLine() {

        NodeAndLineManager.ins.updateExistedLine(this.nodeId);
    }

    /** 
     * @description: 设置所有连线的zorder
     */
    setAllLineZOrder(zorder: number): void {

        NodeAndLineManager.ins.setLineZOrderByNodeId(this.nodeId, zorder);
    }




    onStartDragEvent(ui: BaseUINode) {
        if (!ui) return;
        if (ui === this) {
            this.uiObject.zOrder = mw.UILayerTop;
            // this.setAllLineZOrder(mw.UILayerTop);
        } else {
            this.uiObject.zOrder = mw.UILayerMiddle;
            // this.setAllLineZOrder(mw.UILayerBottom);
        }
    }
}