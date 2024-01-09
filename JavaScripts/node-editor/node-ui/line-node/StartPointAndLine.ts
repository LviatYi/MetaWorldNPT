/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-10 11:19:35
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-02 15:14:20
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\StartPointAndLine.ts
 * @Description  : 画线出发点
 */


import { EndPoint } from "./EndPoint";
import DragNodeCanvas from "../../canvas-ui/DragNodeCanvas";
import { BaseUINode } from "../BaseUINode";
import { NodeAndLineManager } from "../manager/NodeAndLineManager";


export class StartPointAndLine extends mw.UIScript {
    public startPointImg: mw.Image;

    public size: mw.Vector2 = new mw.Vector2(30, 30);

    private _lastDot: mw.Vector2 = undefined;

    //画布Canvas
    public parentCanvas: DragNodeCanvas = undefined;

    //宿主node
    public hostNode: BaseUINode = undefined;

    public currentStartPoint: mw.Vector2 = undefined;


    public hasLinedEndPoint: boolean = false;


    //绑定父类的位置引用

    public offsetPosInNode: mw.Vector2 = undefined;



    onStart(): void {

        //左上对齐
        this.rootCanvas.constraints = new mw.UIConstraintAnchors(mw.UIConstraintHorizontal.Left, mw.UIConstraintVertical.Top);
        this.startPointImg = mw.Image.newObject(this.rootCanvas);
        this.startPointImg.size = this.size;
        this.startPointImg.imageGuid = "37822";

        this.startPointImg.visibility = mw.SlateVisibility.Visible;

        this.startPointImg.setImageColorByHex("#EEC900");
        this.startPointImg.enable = true;
        this.startPointImg.zOrder = mw.UILayerTop;
        this.canUpdate = true;


    }



    getCenterPosInScreen(): mw.Vector2 {
        let result = this.hostNode.uiObject.position.clone().add(this.offsetPosInNode);
        return result;
    }

    protected onAdded() {
        //console.log(this.canvas.size);
        // this.perGenerateLineUi();
    }

    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    onTouchStarted(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.log("onPointTouchStarted");
        return this.detectDragIfPressed(InPointerEvent, mw.Keys.AnyKey)
    }

    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    onTouchEnded(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.log("onPointTouchEnded");
        return mw.EventReply.handled;
    }

    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    public dragAndDrawLine(startPoint: mw.Vector2, endPoint: mw.Vector2) {
        if (startPoint && endPoint) {
            this.currentStartPoint = startPoint;
            //超过原结束点的半径才画点
            const distance = mw.Vector2.distance(startPoint, endPoint);
            //console.log("distance:"+distance+"startPoint:"+this.startPoint+"endPoint:"+this.endPoint);
            if (distance > this.size.x * 0.5 && this._lastDot !== endPoint) {

                NodeAndLineManager.ins.updateNewLine(startPoint, endPoint);

                this._lastDot = endPoint;
            }
        } else {
            //隐藏
            NodeAndLineManager.ins.cancelNewLine();
        }
    }

    /** 
     * @description: 取消画线
     * @return {*}
     */
    public cancelDrawLine() {
        this.dragAndDrawLine(undefined, undefined);
    }

    /**
     * @description :点连接到结束点上
     * @param {mw.Vector2} endPoint 结束点
     * @return {string} 连线的uuid
     */
    public finishDrawLine(endPoint: mw.Vector2, endNodeId: number): void {

        let flag = NodeAndLineManager.ins.isLineExisted(this.currentStartPoint, endPoint);

        if (!flag) {
            this.dragAndDrawLine(this.currentStartPoint, endPoint);
            NodeAndLineManager.ins.addLine(this.currentStartPoint, endPoint, this.hostNode.nodeId, endNodeId);

            this.hasLinedEndPoint = true;
        } else {
            NodeAndLineManager.ins.cancelNewLine();
        }
    }

    /** 
     * @description: 直接设置线
     * @param {Type} startPoint 起点
     * @param {Type} endPoint 终点
     * @return {*}
     */
    public setLineToEndPoint(endPoint: EndPoint, endNodeId: number): void {
        this.currentStartPoint = this.getCenterPosInScreen();
        this.finishDrawLine(endPoint.getCenterPosInScreen(), endNodeId);
    }
}