/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-09-07 10:30:56
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-02 14:58:46
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\EndPoint.ts
 * @Description  : 画线结束点，不需要拖拽
 */

import DragNodeCanvas from "../canvas-ui/DragNodeCanvas";
import { BaseUINode } from "./BaseUINode";

export class EndPoint extends mw.UIScript {
    public endPointImg: mw.Image;

    public size: mw.Vector2 = new mw.Vector2(30, 30);

    //画布Canvas
    public parentCanvas: DragNodeCanvas = undefined;

    //宿主node
    public hostNode: BaseUINode = undefined;


    public offsetPosInNode: mw.Vector2 = undefined;


    onStart(): void {

        //左上对齐
        this.rootCanvas.constraints = new mw.UIConstraintAnchors(mw.UIConstraintHorizontal.Left, mw.UIConstraintVertical.Top);
        this.endPointImg = mw.Image.newObject(this.rootCanvas);
        this.endPointImg.size = this.size;
        this.endPointImg.imageGuid = "37822";

        this.endPointImg.visibility = mw.SlateVisibility.Visible;
        this.endPointImg.zOrder = mw.UILayerDialog;
        this.endPointImg.setImageColorByHex("#EEC900");
        this.endPointImg.enable = true;
        this.canUpdate = true;
    }

    getCenterPosInScreen(): mw.Vector2 {
        let result = this.hostNode.uiObject.position.clone().add(this.offsetPosInNode);
        return result;
    }
}