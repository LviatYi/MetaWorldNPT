/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-03 11:26:43
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-09 10:42:35
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\MainUI.ts
 * @Description  : 主界面ui
 */





import { screenPosToCanvasPos } from "./utils/Utils";
import DragNodeCanvas from "./canvas-ui/DragNodeCanvas";
import { BaseUINode } from "./node-ui/BaseUINode";

import { GameConfig } from "../config/GameConfig";
import i18n, { LanguageTypes } from "../depend/i18n/i18n";
import DialogueContentNodePanel from "./DialogueContentNodePanel";
import { NodeAndLineManager, NodeType } from "./node-ui/manager/NodeAndLineManager";
import GridCanvas from "./canvas-ui/GridCanvas";
import DialogueInteractNodePanel from "./DialogueInteractNodePanel";

import { IDialogueContentNodeElement } from "../config/DialogueContentNode";
import { IDialogueInteractNodeElement } from "../config/DialogueInteractNode";

/** MainUI节点 */
export class MainUI extends mw.UIScript {

    private static _instance: MainUI = undefined;

    //添加节点列表
    public uiNodeRoll: mw.ScrollBox = undefined;

    //节点画布视口
    public contentCanv: mw.Canvas = undefined;

    //节点画布
    public mainCanvas: GridCanvas = undefined;

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
        i18n.use(LanguageTypes.Chinese);
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

        this.downInput = mw.InputBox.newObject(this.rootCanvas);
        this.downInput.size = new mw.Vector2(size.x - 40, size.y / 30);
        this.downInput.fontSize = 14;
        this.downInput.textLengthLimit = 999999;

        this.rollBg = mw.Image.newObject(this.rootCanvas);
        this.rollBg.position = new mw.Vector2(20, size.y - (size.y / 20 + 20) - this.downInput.size.y - 10);
        this.rollBg.size = new mw.Vector2(size.x - 40, size.y / 20 + 20);
        this.rollBg.imageColor = new LinearColor(0, 0.2, 0.5);

        this.uiNodeRoll = mw.ScrollBox.newObject(this.rootCanvas);
        this.uiNodeRoll.size = new mw.Vector2(size.x - 40, size.y / 20 + 20);
        this.uiNodeRoll.alwaysShowScrollBar = true;
        this.uiNodeRoll.orientation = mw.Orientation.OrientHorizontal;
        this.uiNodeRoll.position = new mw.Vector2(20, size.y - this.uiNodeRoll.size.y - this.downInput.size.y - 10);
        this.uiNodeRoll.supportElastic = true;
        this.uiNodeRoll.elasticMultiplier = 10;
        this.uiNodeRoll.scrollbarThickness = 5;

        this.btnCanv = mw.Canvas.newObject(this.rootCanvas);
        this.btnCanv.size = new mw.Vector2(size.x, size.y / 20);
        this.btnCanv.position = new mw.Vector2(10, 5);

        this.downInput.position = new mw.Vector2(20, size.y - 1.1 * this.downInput.size.y);
        this.downInput.text = "";

        this.btnCanv.autoLayoutRule = new mw.UILayout(10, margin, mw.UILayoutType.Horizontal, mw.UILayoutPacket.LeftCenter, new mw.UIHugContent(0, 0), true, false);
        this.btnCanv.autoLayoutHugContent = new mw.UIHugContent(1, 0);

        this.uiNodeRoll.addChild(this.btnCanv);

        this.addSpecialBtn('添加可拖动缩放的画布', this.addDragAndScaleCanvas.bind(this));
        // this.addSpecialBtn('使用当前UI作为画布', this.addDragNodeCanvas.bind(this));
        this.addSpecialBtn('删除当前画布', this.removeCanvas.bind(this));
        // this.addUINodeBtn("连线节点", LinePanelNode);

        this.addSpecialBtn('配置对话', this.addDialogueNode.bind(this));
        this.addSpecialBtn('导出对话', this.generateDialogueConfig.bind(this));

        let tips = mw.TextBlock.newObject(this.rootCanvas);
        tips.size = new mw.Vector2(size.x - 40, size.y / 30);
        tips.fontSize = 16;
        tips.position = this.rollBg.position.clone().subtract(new Vector(0, tips.size.y + 10));
        tips.text = "1.节点多了第一次拖动节点会卡顿，敬请谅解。2.如果遇到拖不动画布或下拉框的情况，请在游戏界面外点一下，再点回来，就能恢复，原因未知/(ㄒoㄒ)/~~。"

    }

    // public addPropertyNodeBtn() {
    //     this.addSpecialBtn("属性节点", this.addPropertyNode.bind(this));
    // }

    // public addNormalCanvasBtn(ui?): void {
    //     this.addSpecialBtn('使用当前UI作为画布', this.addDragNodeCanvas.bind(this, ui));
    // }

    public removeCanvas(): void {
        if (this.mainCanvas) {
            //把canvas里的东西全删了
            this.mainCanvas.removeAllUI();
            NodeAndLineManager.ins.deleteAllNode();
            //清空对话节点
            this.dialogueNodes = [];
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
            this.mainCanvas = mw.createUIOnlyClass(GridCanvas);
            this.contentCanv.addChild(this.mainCanvas.uiObject);
        }
    }

    // /** 
    //  * @description: 添加普通画布
    //  * @param panelClass 添加了@AddDragNodeCanvas 注解的ui
    //  * @return 
    //  */
    // public addDragNodeCanvas(panelClass?) {
    //     if (!this.mainCanvas) {
    //         if (panelClass) {
    //             this.mainCanvas = mw.UIService.getUI<DragNodeCanvas>(panelClass);
    //         } else {
    //             this.mainCanvas = mw.UIService.show(DragNodeCanvas);
    //         }
    //     }
    // }
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
            uiNode.setNodeInfo(MainUI.ins.mainCanvas, name, 1);

            //计算在窗口坐标系下的中心点在画布坐标系下的坐标
            const size = WindowUtil.getViewportSize();
            //还需要考虑缩放

            const canvas = uiNode.parentCanvas.rootCanvas;
            const oriPos = screenPosToCanvasPos(size.multiply(0.5), canvas.size, canvas.position, canvas.renderScale);
            uiNode.uiObject.position = oriPos.subtract(uiNode.rootCanvas.size.multiply(0.5));
            uiNode.uiObject.zOrder = mw.UILayerScene;
            this.mainCanvas.addNode(uiNode);

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

    //节点类型和configId、节点id的映射
    public dialogueNodes: { nodeType: NodeType, configId: number, nodeId: number }[] = [];

    public addDialogueNode() {
        if (!this.mainCanvas) {
            console.error("请先添加画布");
            return;
        }
        let id = 0;

        NodeAndLineManager.ins.perGenerateLineUi();
        //先找到没有上一句的节点
        let ids = GameConfig.DialogueContentNode.getAllElement().map((config) => {
            if (config.nextId != null && config.nextId !== 0) {
                return config.nextId;
            }
        });


        //预先生成连线
        GameConfig.DialogueContentNode.getAllElement().forEach((config) => {

            let startIndex = this.dialogueNodes.findIndex(value => value.configId === config.id && value.nodeType === NodeType.DialogueContentNode);

            if (startIndex === -1) {
                //没有上一句或者下一句的，就单独一行
                if ((config.nextId == null || config.nextId === 0) || ids.findIndex(value => value === config.id) === -1) {
                    this.addDialogueContentNode(config, id++, true);
                } else {
                    this.addDialogueContentNode(config, id++);
                }

                startIndex = this.dialogueNodes.length - 1;
            }
            let startNode = NodeAndLineManager.ins.getNodeById(this.dialogueNodes[startIndex].nodeId);

            if (config.nextId != null && config.nextId !== 0) {
                let endIndex = this.dialogueNodes.findIndex(value => value.configId === config.nextId && value.nodeType === NodeType.DialogueContentNode);
                //如果没有，就创建节点
                if (endIndex === -1) {
                    this.addDialogueContentNode(GameConfig.DialogueContentNode.getElement(config.nextId), id++);
                    endIndex = this.dialogueNodes.length - 1;
                }
                let endNode = NodeAndLineManager.ins.getNodeById(this.dialogueNodes[endIndex].nodeId);
                startNode.startLinePoint.setLineToEndPoint(endNode.endLinePoint, this.dialogueNodes[endIndex].nodeId);
            }
            if (config.interactNodeIds != null) {
                for (let i = 0; i < config.interactNodeIds.length; i++) {
                    let endIndex = this.dialogueNodes.findIndex(value => value.configId === config.interactNodeIds[i] && value.nodeType === NodeType.DialogueInteractNode);
                    if (endIndex === -1) {
                        this.addDialogueInteractNode(GameConfig.DialogueInteractNode.getElement(config.interactNodeIds[i]), id++);
                        endIndex = this.dialogueNodes.length - 1;
                    }
                    let endNode = NodeAndLineManager.ins.getNodeById(this.dialogueNodes[endIndex].nodeId);
                    startNode.startLinePoint.setLineToEndPoint(endNode.endLinePoint, this.dialogueNodes[endIndex].nodeId);
                }
            }
        });


        let interactionNode = GameConfig.DialogueInteractNode.getAllElement();
        interactionNode.forEach((config) => {
            if (this.dialogueNodes.findIndex(value => value.configId === config.id && value.nodeType === NodeType.DialogueInteractNode) === -1) {
                this.addDialogueInteractNode(config, id++);
            }
        });
    }

    public generateDialogueConfig() {
        //遍历所有node，生成顺序
        // let nodes = NodeAndLineManager.ins.getAllNode();

    }

    public addCharacterNode() {
    }

    public addDialogueContentNode(config: IDialogueContentNodeElement, id: number, isStartNode: boolean = false) {
        let content = i18n.lan(config.content);
        const uiNode = mw.UIService.create(DialogueContentNodePanel);
        uiNode.setNodeInfo(this.mainCanvas, '对话内容节点', id++);
        uiNode.setContent(content, config.id);
        uiNode.nodeType = NodeType.DialogueContentNode;
        uiNode.uiObject.zOrder = mw.UILayerMiddle;
        this.mainCanvas.addToGrid(uiNode, isStartNode);
        NodeAndLineManager.ins.addNode(uiNode);
        this.dialogueNodes.push({ nodeType: NodeType.DialogueContentNode, configId: config.id, nodeId: uiNode.nodeId });
    }

    public addDialogueInteractNode(config: IDialogueInteractNodeElement, id: number) {
        let content = i18n.lan(config.content);
        const uiNode = mw.UIService.create(DialogueInteractNodePanel);
        uiNode.setNodeInfo(this.mainCanvas, '对话交互节点', id++);
        uiNode.setContent(content, config.id);
        uiNode.nodeType = NodeType.DialogueInteractNode;
        uiNode.uiObject.zOrder = mw.UILayerMiddle;
        this.mainCanvas.addToGrid(uiNode);
        NodeAndLineManager.ins.addNode(uiNode);
        this.dialogueNodes.push({ nodeType: NodeType.DialogueInteractNode, configId: config.id, nodeId: uiNode.nodeId });
    }

    public hide() {
        this.removeCanvas();
        UIService.destroyUI(MainUI);
    }
}
