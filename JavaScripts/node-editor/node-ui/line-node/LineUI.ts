/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-12 16:31:28
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-08 15:43:07
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\line-node\LineUI.ts
 * @Description  : 构成线的点UI
 */


import { EventNotify } from "../../EventNotify";
import Event = mw.Event;

export class LineUI extends mw.UIScript {

    private _dotImg: mw.Image;

    public oriSize: mw.Vector2 = new mw.Vector2(25, 25);
    //所属的线

    public lineID: string = undefined;

    onStart(): void {
        //左上对齐
        this.rootCanvas.constraints = new mw.UIConstraintAnchors(mw.UIConstraintHorizontal.Left, mw.UIConstraintVertical.Top);
        this.rootCanvas.size = this.oriSize.clone();
        this.rootCanvas.renderTransformPivot = new mw.Vector2(0, 0.5);
        this._dotImg = mw.Image.newObject();
        this._dotImg.imageGuid = "114028";
        this._dotImg.size = this.oriSize.clone();
        this._dotImg.constraints = new mw.UIConstraintAnchors(mw.UIConstraintHorizontal.LeftRight, mw.UIConstraintVertical.TopBottom);
        this._dotImg.setImageColorByHex("#EEC900");
        this._dotImg.position = mw.Vector2.zero;
        this._dotImg.visibility = mw.SlateVisibility.Visible;
        this.rootCanvas.visibility = mw.SlateVisibility.Collapsed;
        this.rootCanvas.addChild(this._dotImg);
    }

    public setDotColor(color: string): void {
        this._dotImg.setImageColorByHex(color);
    }

    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onMouseEnter(InGemotry: mw.Geometry, InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.error("UI Has onMouseEnter===")
        if (this.lineID) {
            Event.dispatchToLocal(EventNotify.OnMouseEnterLine, this.lineID);
        }

        return mw.EventReply.handled; //mw.EventReply.unhandled
    }

    /**
     * 当鼠标离开此UI 的范围时会触发此函数
     */
    // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
    protected onMouseLeave(InPointerEvent: mw.PointerEvent): mw.EventReply {
        //console.error("UI Has onMouseLeave===")
        if (this.lineID) {
            Event.dispatchToLocal(EventNotify.OnMouseLeaveLine, this.lineID);
        }
        return mw.EventReply.handled; //mw.EventReply.unhandled
    }
}