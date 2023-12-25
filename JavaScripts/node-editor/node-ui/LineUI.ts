/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-12 16:31:28
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2023-12-24 19:25:41
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\LineUI.ts
 * @Description  : 构成线的点UI
 */

import { EventNotify } from "../EventNotify";


export class LineUI extends mw.UIScript {

    private _dotImg: mw.Image;

    public size: mw.Vector2 = new mw.Vector2(10, 10);
    //所属的线

    public lineID: number = undefined;

    onStart(): void {
        //左上对齐
        this.rootCanvas.constraints = new mw.UIConstraintAnchors(mw.UIConstraintHorizontal.Left, mw.UIConstraintVertical.Top);
        this.rootCanvas.size = this.size;
        this._dotImg = mw.Image.newObject();
        this._dotImg.imageGuid = "37822";
        this._dotImg.size = this.size;
        this._dotImg.setImageColorByHex("#EEC900");
        this._dotImg.position = mw.Vector2.zero;
        this._dotImg.visibility = mw.SlateVisibility.Visible;
        this.rootCanvas.visibility = mw.SlateVisibility.Collapsed;
        this.rootCanvas.addChild(this._dotImg);
    }

    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onMouseEnter(InGemotry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.error("UI Has onMouseEnter===")
        Event.dispatchToLocal(EventNotify.OnMouseEnterLine, this.lineID);
        return mw.EventReply.handled; //mw.EventReply.unhandled
    }

    /**
     * 当鼠标离开此UI 的范围时会触发此函数
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onMouseLeave(InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.error("UI Has onMouseLeave===")
        Event.dispatchToLocal(EventNotify.OnMouseLeaveLine, this.lineID);
        return mw.EventReply.handled; //mw.EventReply.unhandled
    }
}