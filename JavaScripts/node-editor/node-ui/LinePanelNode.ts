/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-06 16:05:11
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-02 15:32:24
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\LinePanelNode.ts
 * @Description  : 包含连接线的节点
 */

import { EventNotify } from "../EventNotify";
import { BaseUINode } from "./BaseUINode";
import { DragEndPoint } from "./DragEndPoint";
import { DragStartPointAndLine } from "./DragStartPointAndLine";
import { NodeAndLineManager } from "./manager/NodeAndLineManager";


export class LinePanelNode extends BaseUINode {

    private _startLinePoint: DragStartPointAndLine;

    private _endLinePoint: DragEndPoint;

    protected onStartPanel(): void {
        //this.playNowBtn.visibility = mw.SlateVisibility.Collapsed;
        this._startLinePoint = mw.createUIOnlyClass(DragStartPointAndLine);
        this._startLinePoint.uiObject.position = new mw.Vector2(this.contentCanvas.size.x - this._startLinePoint.size.x * 0.5,
            this.contentCanvas.size.y * 0.5 - this._startLinePoint.size.y * 0.5);
        //记录在屏幕下的位置，使用node的position的引用
        this._startLinePoint.offsetPosInNode = new mw.Vector2(0, this.titleCanvas.size.y)
            .add(this._startLinePoint.uiObject.position.clone())
            .add(this._startLinePoint.size.clone().multiply(0.25));


        this._endLinePoint = mw.createUIOnlyClass(DragEndPoint);
        this._endLinePoint.uiObject.position = new mw.Vector2(-this._startLinePoint.size.x * 0.5,
            this.contentCanvas.size.y * 0.5 - this._startLinePoint.size.y * 0.5);

        this._endLinePoint.offsetPosInNode = new mw.Vector2(0, this.titleCanvas.size.y)
            .add(this._endLinePoint.uiObject.position.clone())
            .add(this._endLinePoint.size.clone().multiply(0.25));
        this.canUpdate = true;
        // Event.addLocalListener(EventNotify.UpdateAllLine, this.updateAllLine.bind(this));
    }

    get startLinePointPosInScreen(): Vector2 {
        return this._startLinePoint.getCenterPosInScreen();
    }

    get endLinePointPosInScreen(): Vector2 {
        return this._endLinePoint.getCenterPosInScreen();
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
        this._startLinePoint.parentCanvas = this.parentCanvas;
        this._startLinePoint.hostNode = this;
        this.contentCanvas.addChild(this._startLinePoint.uiObject);

        this._endLinePoint.parentCanvas = this.parentCanvas;
        this._endLinePoint.hostNode = this;
        this.contentCanvas.addChild(this._endLinePoint.uiObject);
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