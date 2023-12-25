/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-06 16:05:11
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2023-12-25 10:29:25
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\LinePanelNode.ts
 * @Description  : 包含连接线的节点
 */

import { BaseUINode } from "./BaseUINode";
import { DragEndPoint } from "./DragEndPoint";
import { DragStartPointAndLine } from "./DragStartPointAndLine";


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

    protected onCollapsedBtnClick(): void {
        if (this.isCollapsed) {
            if (this._startLinePoint.hasLinedEndPoint) {
                this._startLinePoint.showAllLinkedLine();
            }
            this._endLinePoint.linkedStartPoints.forEach((val, key) => {
                val.showLinkedLine(key);
            });

        } else {
            if (this._startLinePoint.hasLinedEndPoint) {
                this._startLinePoint.collapsedAllLinkedLine();
            }
            this._endLinePoint.linkedStartPoints.forEach((val, key) => {
                val.collapsedLinkedLine(key);
            });

        }
        super.onCollapsedBtnClick();
    }

    public onDeleteBtnClick(): void {
        if (this._startLinePoint.hasLinedEndPoint) {
            this._startLinePoint.clearAllLinkedLine();
        }
        this._endLinePoint.linkedStartPoints.forEach((val, key) => {
            val.clearLinkedLine(key);
        });
        this._endLinePoint.linkedStartPoints.clear();

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
        if (this._startLinePoint.hasLinedEndPoint) {
            //接受rollcanvas的通知画线，终点在rollcanvas里设置好了
            const startPoint = this._startLinePoint.getCenterPosInScreen();
            this._startLinePoint.updateDrawedLineStartPoint(startPoint);
        }

        this._endLinePoint.linkedStartPoints.forEach((val, key) => {
            //设置结束点
            const endPoint = this._endLinePoint.getCenterPosInScreen();
            val.updateDrawedLineEndPoint(endPoint, key);
        });
    }

    /** 
     * @description: 设置所有连线的zorder
     */
    setAllLineZOrder(zorder: number): void {
        if (this._startLinePoint.hasLinedEndPoint) {
            this._startLinePoint.setLineUIZOrder(zorder);
        }

        this._endLinePoint.linkedStartPoints.forEach((val, key) => {
            val.setLineUIZOrder(zorder, key);
        });
    }

    onStartDragEvent(ui: BaseUINode) {
        if (ui === this) {
            this.uiObject.zOrder = mw.UILayerTop;
            this.setAllLineZOrder(mw.UILayerTop);
        } else {
            this.uiObject.zOrder = mw.UILayerBottom;
            this.setAllLineZOrder(mw.UILayerBottom);
        }
    }
}