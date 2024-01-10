/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-10 11:19:35
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-08 15:43:16
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\line-node\DragStartPointAndLine.ts
 * @Description  : 可以拖拽的画线出发点
 */

import { StartPointAndLine } from "./StartPointAndLine";
import Event = mw.Event;
import { EventNotify } from "../../EventNotify";

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