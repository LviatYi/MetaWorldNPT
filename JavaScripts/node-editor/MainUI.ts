/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-03 11:26:43
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2023-12-25 09:46:43
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\MainUI.ts
 * @Description  : 主界面ui
 */





import { screenPosToCanvasPos } from "./utils/Utils";
import { DragAndScaleCanvas } from "./canvas-ui/DragAndScaleCanvas";
import DragNodeCanvas from "./canvas-ui/DragNodeCanvas";
import { BaseUINode } from "./node-ui/BaseUINode";
import { LinePanelNode } from "./node-ui/LinePanelNode";

/** MainUI节点 */
export class MainUI extends mw.UIScript {

    private static _instance: MainUI = undefined;

    //添加节点列表
    public uiNodeRoll: mw.ScrollBox = undefined;

    //节点画布视口
    public contentCanv: mw.Canvas = undefined;

    //节点画布
    public mainCanvas: DragNodeCanvas = undefined;

    //添加节点列表子画布
    public btnCanv: mw.Canvas = undefined;

    //json输入框
    public downInput: mw.InputBox = undefined;

    //是否显影
    public isVisible = true;

    //滚动条背景
    public rollBg: mw.Image = undefined;

    //节点画布背景
    public contantBG: mw.Image = undefined;

    //节点画布滚动
    public contentCanvRoll: mw.ScrollBox = undefined;

    //添加节点列表
    public uiNodeBtnList: Array<mw.StaleButton> = [];


    public static getInstance(): MainUI {
        if (this._instance === undefined) {
            //console.log("MainUI");
            this._instance = mw.UIService.create(MainUI);
            mw.UIService.showUI(this._instance);
        } else if (!UIService.getUI(MainUI, false)) {
            this._instance = mw.UIService.create(MainUI);
            mw.UIService.showUI(this._instance);
        }
        return this._instance;
    }

    public static get ins(): MainUI {
        if (this._instance === undefined) {
            //console.log("MainUI");
            this._instance = mw.UIService.create(MainUI);
            mw.UIService.showUI(this._instance);
        } else if (!UIService.getUI(MainUI, false)) {
            this._instance = mw.UIService.create(MainUI);
            mw.UIService.showUI(this._instance);
        }
        return this._instance;
    }

    public onStart() {
        const size = WindowUtil.getViewportSize();
        const rollY = size.y / 20;
        const margin = new mw.Margin(0.1);

        //this.rootCanvas.renderOpacity = 1;
        this.rootCanvas.zOrder = mw.UILayerSystem;
        this.rootCanvas.constraints = new mw.UIConstraintAnchors(mw.UIConstraintHorizontal.Left, mw.UIConstraintVertical.Top);
        //this.rootCanvas.size = new mw.Vector2(size.x, size.y);

        this.contentCanv = mw.Canvas.newObject(this.rootCanvas);
        this.contentCanv.size = new mw.Vector2(size.x, size.y - size.y / 30 - size.y / 20 - 10);
        //this.contentCanv.position = new mw.Vector2(20, 20);
        this.contentCanv.constraints = new mw.UIConstraintAnchors(mw.UIConstraintHorizontal.Left, mw.UIConstraintVertical.Top);
        this.contentCanv.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.contentCanv.clipEnable = true;

        // this.downInput = mw.InputBox.newObject(this.rootCanvas);
        // this.downInput.size = new mw.Vector2(size.x - 40, size.y / 30);
        // this.downInput.fontSize = 14;
        // this.downInput.textLengthLimit = 999999;

        this.rollBg = mw.Image.newObject(this.rootCanvas);
        this.rollBg.position = new mw.Vector2(20, size.y - (size.y / 20 + 20));
        this.rollBg.size = new mw.Vector2(size.x - 40, size.y / 20 + 20);
        this.rollBg.imageColor = new LinearColor(0, 0.2, 0.5);




        this.uiNodeRoll = mw.ScrollBox.newObject(this.rootCanvas);
        this.uiNodeRoll.size = new mw.Vector2(size.x - 40, size.y / 20 + 20);
        this.uiNodeRoll.alwaysShowScrollBar = true;
        this.uiNodeRoll.orientation = mw.Orientation.OrientHorizontal;
        this.uiNodeRoll.position = new mw.Vector2(20, size.y - this.uiNodeRoll.size.y);
        this.uiNodeRoll.supportElastic = true;
        this.uiNodeRoll.elasticMultiplier = 10;
        this.uiNodeRoll.scrollbarThickness = 5;

        this.btnCanv = mw.Canvas.newObject(this.rootCanvas);
        this.btnCanv.size = new mw.Vector2(size.x, size.y / 20);
        this.btnCanv.position = new mw.Vector2(10, 5);
        // this.downInput.position = new mw.Vector2(20, size.y - 1.1 * this.downInput.size.y);
        // this.downInput.text = "";
        this.btnCanv.autoLayoutRule = new mw.UILayout(10, margin, mw.UILayoutType.Horizontal, mw.UILayoutPacket.LeftCenter, new mw.UIHugContent(0, 0), true, false);
        this.btnCanv.autoLayoutHugContent = new mw.UIHugContent(1, 0);

        this.uiNodeRoll.addChild(this.btnCanv);

        this.addSpecialBtn('添加可拖动缩放的画布', this.addDragAndScaleCanvas.bind(this));
        // this.addSpecialBtn('使用当前UI作为画布', this.addDragNodeCanvas.bind(this));
        this.addSpecialBtn('删除当前画布', this.removeCanvas.bind(this));
        // this.addUINodeBtn("连线节点", LinePanelNode);
    }

    // public addPropertyNodeBtn() {
    //     this.addSpecialBtn("属性节点", this.addPropertyNode.bind(this));
    // }

    public addNormalCanvasBtn(ui?): void {
        this.addSpecialBtn('使用当前UI作为画布', this.addDragNodeCanvas.bind(this, ui));
    }

    public removeCanvas(): void {
        if (this.mainCanvas) {
            //把canvas里的东西全删了
            this.mainCanvas.removeAllUI();
            if (this.mainCanvas instanceof DragNodeCanvas) {
                this.mainCanvas.destroy();
            }
            this.mainCanvas = undefined;
        }
    }
    /** 
     * @description: 添加可拖动缩放的画布
     */
    public addDragAndScaleCanvas() {
        if (!this.mainCanvas) {
            this.mainCanvas = mw.createUIOnlyClass(DragAndScaleCanvas);
            this.contentCanv.addChild(this.mainCanvas.uiObject);
        }
    }

    /** 
     * @description: 添加普通画布
     * @param panelClass 添加了@AddDragNodeCanvas 注解的ui
     * @return 
     */
    public addDragNodeCanvas(panelClass?) {
        if (!this.mainCanvas) {
            if (panelClass) {
                this.mainCanvas = mw.UIService.getUI<DragNodeCanvas>(panelClass);
            } else {
                this.mainCanvas = mw.UIService.show(DragNodeCanvas);
            }
        }
    }
    /** 
     * @description: 添加按钮功能为添加ui节点的按钮
     * @return {*}
     */
    public addUINodeBtn(name: string, uiNodeType: { new(): BaseUINode; }) {

        const btn = mw.StaleButton.newObject();
        btn.text = "添加" + name;
        btn.fontSize = 20;
        btn.autoSizeEnable = true;
        btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
        //设置按压颜色
        btn.transitionEnable = true;
        btn.setPressedImageColorDecimal(200, 200, 200, 255);
        btn.pressedImagColor = LinearColor.gray;
        btn.pressedImageDrawType = mw.SlateBrushDrawType.Box;
        btn.enable = true;
        btn.onClicked.add(() => {
            if (!this.mainCanvas) {
                console.error("请先添加画布");
                return;
            }
            const uiNode = mw.UIService.create(uiNodeType);
            uiNode.setParentCanvasAndTitle(MainUI.ins.mainCanvas, name);

            //计算在窗口坐标系下的中心点在画布坐标系下的坐标
            const size = WindowUtil.getViewportSize();
            //还需要考虑缩放

            const canvas = uiNode.parentCanvas.rootCanvas;
            const oriPos = screenPosToCanvasPos(size.multiply(0.5), canvas.size, canvas.position, canvas.renderScale);
            uiNode.uiObject.position = oriPos.subtract(uiNode.rootCanvas.size.multiply(0.5));
            uiNode.uiObject.zOrder = mw.UILayerScene;
            this.mainCanvas.addUI(uiNode.uiObject)

        });
        this.uiNodeBtnList.push(btn);
        this.btnCanv.addChild(btn);
    }

    /** 
     * @description: 添加特殊需求按钮
     * @return {*}
     */
    public addSpecialBtn(name: string, onClicked: (...arg: unknown[]) => unknown) {
        const btn = mw.StaleButton.newObject();
        btn.text = name;
        btn.fontSize = 20;
        btn.autoSizeEnable = true;
        btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
        //设置按压颜色
        btn.transitionEnable = true;
        btn.setPressedImageColorDecimal(200, 200, 200, 255);
        btn.pressedImagColor = LinearColor.gray;
        btn.pressedImageDrawType = mw.SlateBrushDrawType.Box;
        btn.enable = true;
        btn.onClicked.add(onClicked);
        this.uiNodeBtnList.push(btn);
        this.btnCanv.addChild(btn);
    }

    // public addPropertyNode() {
    //     if (!this.mainCanvas) {
    //         console.error("请先添加画布");
    //         return;
    //     }
    //     let xoffset = 0;
    //     let currentYPos = 0;
    //     //计算在窗口坐标系下的中心点在画布坐标系下的坐标
    //     const size = WindowUtil.getViewportSize();
    //     RecordClasses.forEach((value, key) => {
    //         const uiNode = mw.UIService.create(InspectorNode);

    //         uiNode.setParentCanvasAndTitle(this.mainCanvas, key);
    //         //还需要考虑缩放
    //         const canvas = uiNode.parentCanvas.rootCanvas;
    //         const oriPos = screenPosToCanvasPos(mw.Vector.zero, canvas.size, canvas.position, canvas.renderScale);
    //         if (!key.includes(":")) {
    //             uiNode.uiObject.position = oriPos.add(new mw.Vector2(uiNode.rootCanvas.size.x * xoffset, currentYPos));
    //             currentYPos += uiNode.rootCanvas.size.y;
    //         } else {
    //             //是子节点，会默认折叠，只占用折叠后的大小
    //             uiNode.uiObject.position = oriPos.add(new mw.Vector2(uiNode.titleCanvas.size.x * xoffset, currentYPos));
    //             currentYPos += uiNode.titleCanvas.size.y;
    //         }

    //         if (currentYPos > size.y - 100) {
    //             xoffset += 2;
    //             currentYPos = 0;
    //         }
    //         uiNode.uiObject.zOrder = mw.UILayerScene;
    //         this.mainCanvas.addUI(uiNode.uiObject)
    //         inspectorNodes.set(key, uiNode);
    //     });
    // }

    public hide() {
        this.removeCanvas();
        UIService.destroyUI(MainUI);

    }
}
