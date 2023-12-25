/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-10 11:19:35
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2023-12-25 10:34:20
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\StartPointAndLine.ts
 * @Description  : 画线出发点
 */

import { Line } from "./Line";
import { LineUI } from "./LineUI";
import { EndPoint } from "./EndPoint";
import { EventNotify } from "../EventNotify";
import DragNodeCanvas from "../canvas-ui/DragNodeCanvas";
import { cubicBezierCurve } from "../utils/Utils";
import { BaseUINode } from "./BaseUINode";


export class StartPointAndLine extends mw.UIScript {
    public startPointImg: mw.Image;

    public size: mw.Vector2 = new mw.Vector2(20, 20);

    //保存所有连线
    public lines: Map<string, Line> = new Map<string, Line>();

    public lineDots: Array<LineUI> = [];

    private _lastDot: mw.Vector2 = undefined;

    private _dotCount: number = 200;

    private _dotInterval: number = 1 / this._dotCount;

    //画布Canvas
    public parentCanvas: DragNodeCanvas = undefined;

    //宿主node
    public hostNode: BaseUINode = undefined;

    public currentStartPoint: mw.Vector2 = undefined;

    private _lineDotOffset: number = 0;

    public hasLinedEndPoint: boolean = false;

    private _controlPointOffset = new mw.Vector2(80, 0);

    //绑定父类的位置引用

    public offsetPosInNode: mw.Vector2 = undefined;

    private _mouseEnterLineListener: mw.EventListener = undefined;
    private _mouseLeaveLineListener: mw.EventListener = undefined;


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

        this._mouseEnterLineListener = Event.addLocalListener(EventNotify.OnMouseEnterLine, this.onMouseEnterLine.bind(this));
        this._mouseLeaveLineListener = Event.addLocalListener(EventNotify.OnMouseLeaveLine, this.onMouseLeaveLine.bind(this));
    }

    onMouseEnterLine(lineID: number) {

    }

    onMouseLeaveLine(lineID: number) {
    }

    getCenterPosInScreen(): mw.Vector2 {
        let result = this.hostNode.uiObject.position.clone().add(this.offsetPosInNode);
        return result;
    }

    protected onAdded() {
        //console.log(this.canvas.size);
        this.perGenerateLineUi();
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
            //this.perGenerateLineUi();
            //超过原结束点的半径才画点
            const distance = mw.Vector2.distance(startPoint, endPoint);
            //console.log("distance:"+distance+"startPoint:"+this.startPoint+"endPoint:"+this.endPoint);
            if (distance > this.size.x * 0.5 && this._lastDot !== endPoint) {

                //通知画布加点
                //计算点的位置
                let startControlPoint = mw.Vector2.zero;
                let endControlPoint = mw.Vector2.zero;
                if (endPoint.x < startPoint.x) {
                    //起点控制点在起点左边
                    startControlPoint = startPoint.clone().subtract(this._controlPointOffset);
                    //终点控制点在终点右边
                    endControlPoint = endPoint.clone().add(this._controlPointOffset);
                } else {
                    //起点控制点在起点右边
                    startControlPoint = startPoint.clone().add(this._controlPointOffset);
                    //终点控制点在终点左边
                    endControlPoint = endPoint.clone().subtract(this._controlPointOffset);
                }
                //计算要多少个点,index会到10，从1开始
                for (let i = 0, index = this._lineDotOffset; i <= 1; i += this._dotInterval, index++) {

                    const dot = this.lineDots[index];

                    dot.uiObject.position = cubicBezierCurve(startPoint, startControlPoint, endPoint, endControlPoint, i);
                    dot.rootCanvas.visibility = mw.SlateVisibility.Visible;
                }

                this._lastDot = endPoint;
            }
        } else {
            //隐藏
            for (let i = this._lineDotOffset; i < this._lineDotOffset + this._dotCount; i++) {
                this.lineDots[i].rootCanvas.visibility = mw.SlateVisibility.Collapsed;
            }
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
     * @description: 预先生成画线的点
     * @return {*}
     */
    public perGenerateLineUi() {
        for (let i = 0; i < this._dotCount; i++) {
            const dot = mw.createUIOnlyClass(LineUI);
            //dot.uiObject.position = new mw.Vector2(Infinity, Infinity);
            this.lineDots.push(dot);
            //zOrder最低防止挡住拖拽点
            dot.uiObject.zOrder = mw.UILayerBottom;
            this.parentCanvas.addUI(dot.uiObject);
            //this.hostNode.rootCanvas.addChild(dot.uiObject);
            //this.parentCanvas.rootCanvas.addChild(dot.uiObject);
        }
    }

    /**
     * @description :点连接到结束点上
     * @param {mw.Vector2} endPoint 结束点
     * @return {string} 连线的uuid
     */
    public finishDrawLine(endPoint: mw.Vector2): string {
        let flag = false;
        this.lines.forEach(element => {
            if (element.endPoint.equals(endPoint)) {
                this.cancelDrawLine();
                //console.log("存在线了")
                flag = true;
            }
        });
        if (!flag) {
            this.dragAndDrawLine(this.currentStartPoint, endPoint);

            //记录下一次画线的点从何处开始
            this._lineDotOffset += this._dotCount;
            //记录画下来的线
            const line = new Line(this._lineDotOffset - this._dotCount, this._lineDotOffset - 1, this.currentStartPoint.clone(), endPoint.clone());
            this.lines.set(line.uuid, line);

            this.hasLinedEndPoint = true;
            //画布加线
            this.perGenerateLineUi();
            return line.uuid;
        }
        return;
    }

    /** 
     * @description: 直接设置线
     * @param {Type} startPoint 起点
     * @param {Type} endPoint 终点
     * @return {*}
     */
    public setLineToEndPoint(endPoint: EndPoint): void {
        this.currentStartPoint = this.getCenterPosInScreen();
        const uuid = this.finishDrawLine(endPoint.getCenterPosInScreen());;
        if (uuid) {
            //console.log("接收到线"+uuid);
            endPoint.linkedStartPoints.set(uuid, this);
        }

    }

    /** 
     * @description: 更新起点和连接线的位置
     * @param startPoint 是在屏幕画布坐标系下的位置
     * @return 
     */
    updateDrawedLineStartPoint(startPoint: mw.Vector2): void {
        this.lines.forEach(element => {

            const endPoint = element.endPoint;
            //通知画布加点
            //计算点的位置
            let startControlPoint = mw.Vector2.zero;
            let endControlPoint = mw.Vector2.zero;
            if (endPoint.x < startPoint.x) {
                //起点控制点在起点左边
                startControlPoint = startPoint.clone().subtract(this._controlPointOffset);
                //终点控制点在终点右边
                endControlPoint = endPoint.clone().add(this._controlPointOffset);
            } else {
                //起点控制点在起点右边
                startControlPoint = startPoint.clone().add(this._controlPointOffset);
                //终点控制点在终点左边
                endControlPoint = endPoint.clone().subtract(this._controlPointOffset);
            }
            for (let i = 0, index = element.dotUIStartIndex; i <= 1; i += this._dotInterval, index++) {
                const dot = this.lineDots[index];
                dot.uiObject.position = cubicBezierCurve(startPoint, startControlPoint, endPoint, endControlPoint, i);
                dot.uiObject.zOrder = mw.UILayerTop;
            }
            //改完设置下新的点
            element.startPoint = startPoint;
        });

    }

    /** 
     * @description: 更新终点，接收的点会让起始点更新，只更新连接的线就行
     * @return {*}
     */
    updateDrawedLineEndPoint(endPoint: mw.Vector2, uuid: string) {
        this.lines.forEach(element => {
            if (element.uuid === uuid) {
                const startPoint = element.startPoint;
                //通知画布加点
                //计算点的位置
                let startControlPoint = mw.Vector2.zero;
                let endControlPoint = mw.Vector2.zero;
                if (endPoint.x < startPoint.x) {
                    //起点控制点在起点左边
                    startControlPoint = startPoint.clone().subtract(this._controlPointOffset);
                    //终点控制点在终点右边
                    endControlPoint = endPoint.clone().add(this._controlPointOffset);
                } else {
                    //起点控制点在起点右边
                    startControlPoint = startPoint.clone().add(this._controlPointOffset);
                    //终点控制点在终点左边
                    endControlPoint = endPoint.clone().subtract(this._controlPointOffset);
                }
                for (let i = 0, index = element.dotUIStartIndex; i <= 1; i += this._dotInterval, index++) {
                    const dot = this.lineDots[index];
                    dot.uiObject.position = cubicBezierCurve(startPoint, startControlPoint, endPoint, endControlPoint, i);
                    dot.uiObject.zOrder = mw.UILayerTop;
                }

                //改完设置下新的点
                element.endPoint = endPoint;
            }

        });

    }

    public collapsedAllLinkedLine() {
        for (let i = 0; i < this._lineDotOffset; i++) {
            //可能有被清掉的点
            if (this.lineDots[i]) {
                this.lineDots[i].rootCanvas.visibility = mw.SlateVisibility.Collapsed;
            }
        }
    }

    public showAllLinkedLine() {
        for (let i = 0; i < this._lineDotOffset; i++) {
            if (this.lineDots[i]) {
                this.lineDots[i].rootCanvas.visibility = mw.SlateVisibility.Visible;
            }
        }
    }

    public collapsedLinkedLine(uuid: string) {
        const line = this.lines.get(uuid);
        for (let i = line.dotUIStartIndex; i <= line.dotUIEndIndex; i++) {
            this.lineDots[i].rootCanvas.visibility = mw.SlateVisibility.Collapsed;
        }

    }

    public showLinkedLine(uuid: string) {
        const line = this.lines.get(uuid);
        for (let i = line.dotUIStartIndex; i <= line.dotUIEndIndex; i++) {
            this.lineDots[i].rootCanvas.visibility = mw.SlateVisibility.Visible;
        }
    }

    public clearAllLinkedLine() {

        Event.dispatchToLocal(EventNotify.DeleteLine, [...this.lines.keys()]);
        this.lines.clear();
        this.lineDots.forEach(element => {
            element.destroy();
        });
        this.lineDots.length = 0;
        this._lineDotOffset = 0;
        this.hasLinedEndPoint = false;
        this.perGenerateLineUi();
    }

    public clearLinkedLine(uuid: string) {

        const line = this.lines.get(uuid);
        for (let i = line.dotUIStartIndex; i <= line.dotUIEndIndex; i++) {
            this.lineDots[i].destroy();
        }

        this._lineDotOffset -= this._dotCount;
        this.lines.delete(uuid);
        if (this._lineDotOffset === 0) {
            this.hasLinedEndPoint = false;

            this.lineDots.length = 0;
            this.perGenerateLineUi();
        }
        Event.dispatchToLocal(EventNotify.DeleteLine, [line.uuid]);
    }

    /** 
     * @description: 设置所有线的zOrder
     * @param zOrder ui层级
     * @return 
     */
    public setLineUIZOrder(zOrder: number, uuid?: string) {
        this.lines.forEach(element => {
            if (uuid && element.uuid === uuid) {
                //存在uuid就只改这条线
                for (let i = 0, index = element.dotUIStartIndex; i <= 1; i += this._dotInterval, index++) {
                    const dot = this.lineDots[index];
                    dot.uiObject.zOrder = zOrder;
                }
            } else {
                //改所有线
                for (let i = 0, index = element.dotUIStartIndex; i <= 1; i += this._dotInterval, index++) {
                    const dot = this.lineDots[index];
                    dot.uiObject.zOrder = zOrder;
                }
            }
        });
    }

    onDestroy() {
        Event.removeListener(this._mouseEnterLineListener);
        Event.removeListener(this._mouseLeaveLineListener);
    }
}