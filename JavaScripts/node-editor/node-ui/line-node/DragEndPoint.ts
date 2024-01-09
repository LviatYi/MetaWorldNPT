/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-11 15:00:40
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2023-12-27 18:03:25
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\DragEndPoint.ts
 * @Description  : 拖拽画线结束点
 */


import { EndPoint } from "./EndPoint";

export class DragEndPoint extends EndPoint {


    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    onDrop(InGeometry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InOperation: mw.DragDropOperation) {

        //console.log("onDropInEndPoint");
        //接收到线
        if (this.parentCanvas.currentDragPoint) {
            //console.log("接收到线");
            if (this.parentCanvas.currentDragPoint.hostNode != this.hostNode) {
                //设置结束点
                const endPoint = this.getCenterPosInScreen();
                this.parentCanvas.currentDragPoint.finishDrawLine(endPoint, this.hostNode.nodeId);
                // const uuid = 
                // if (uuid) {
                //     //console.log("接收到线"+uuid);
                //     this.linkedStartPoints.set(uuid, this.parentCanvas.currentDragPoint);
                // }
                this.parentCanvas.currentDragPoint = undefined;
            }

        }
    }

    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onDragEnter(InGeometry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation) {
        //console.log("onDragEnterInEndPoint");
    }

    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    onDragLeave(InGemotry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation) {
        //console.log("onDragLeaveInEndPoint");
    }
}