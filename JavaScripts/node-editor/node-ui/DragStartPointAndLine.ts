/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-10 11:19:35
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2023-12-24 19:25:28
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\DragStartPointAndLine.ts
 * @Description  : 可以拖拽的画线出发点
 */




import { EventNotify } from "../EventNotify";
import { StartPointAndLine } from "./StartPointAndLine";


export class DragStartPointAndLine extends StartPointAndLine {

    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onDragDetected(InGeometry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.DragDropOperation {

        const payload = new mw.DragDropPayLoad();
        payload.name = "DragLine";
        //MainUI.ins.mainCanvas.currentDragPoint = this;
        Event.dispatchToLocal(EventNotify.SetCurrentDragPoint, this);
        return this.newDragDrop(null, "", payload, mw.DragPivot.CenterCenter, mw.Vector2.zero);
    }
}