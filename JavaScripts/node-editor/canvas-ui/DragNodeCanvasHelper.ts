/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-09-08 14:10:10
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-08 15:44:47
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\canvas-ui\DragNodeCanvasHelper.ts
 * @Description  : 调试面板帮助类
 */

import { EventNotify } from "../EventNotify";
import { MainUI } from "../MainUI";
import { BaseUINode } from "../node-ui/BaseUINode";

import { mousePosToCanvasPos } from "../utils/Utils";
import Event = mw.Event;
import { DragStartPointAndLine } from "../node-ui/line-node/DragStartPointAndLine";
import { LinePanelNode } from "../node-ui/line-node/LinePanelNode";


/** 
 * @description: 添加拖动画布的类装饰器，界面内最好不要有其他的拖动事件(onDrop、onDragEnter、onDragOver、onDragLeave)，会被覆盖掉
 */
export function AddDragNodeCanvas<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        //当前拖动的节点
        public currentDragNode: BaseUINode = undefined;

        //记录拖动节点的鼠标位置和节点坐标的偏移
        protected dragOffset: mw.Vector2 = undefined;

        //当前拖动的节点
        public currentDragPoint: DragStartPointAndLine = undefined;

        //记录加入Canvas的节点UI、线UI的index
        public uiRecord: string[] = [];

        private _rootCanvas: mw.Canvas = Reflect.get(this, "rootCanvas") as mw.Canvas;

        private excutedOnce = false;
        private _setDragPointListener: mw.EventListener = undefined;
        private _setDragNodeListener: mw.EventListener = undefined;


        protected onInnerStart(): void {
            console.log("DragNodeCanvasHelper onInnerStart");
            if (SystemUtil.isClient()) {
                MainUI.ins;
            }
        }


        /**
         * 添加UI
         */
        public addUI(ui: mw.Widget) {
            this._rootCanvas.addChild(ui);
            this.uiRecord.push(ui.name);

            if (!this.excutedOnce) {
                this._rootCanvas.visibility = mw.SlateVisibility.Visible;

                this._setDragPointListener = Event.addLocalListener(EventNotify.SetCurrentDragPoint, (ui: DragStartPointAndLine) => {

                    this.currentDragPoint = ui;
                });
                this._setDragNodeListener = Event.addLocalListener(EventNotify.SetCurrentDragNode, (ui: BaseUINode) => {

                    this.currentDragNode = ui;
                });
                this.excutedOnce = true;
            }
        }

        public removeAllUI(): void {
            //删除所有的inspectorNode
            // inspectorNodes.forEach((value, key) => {
            //     value.onDeleteBtnClick();
            // });
            // inspectorNodes.clear();
            this.uiRecord.forEach(element => {
                //有的点可能已经销毁了
                const item = this._rootCanvas.getChildByName(element);
                if (item) {
                    item.destroyObject();
                }

            });
            this.uiRecord = [];
        }


        onDestroy() {
            Event.removeListener(this._setDragPointListener);
            Event.removeListener(this._setDragNodeListener);
        }
        /**
         * 拖拽事件完成,node的drop事件也会穿透下来
         */
        // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
        onDrop(InGemotry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InOperation: mw.DragDropOperation) {
            const payLoad = InOperation.tryGetDragDropPayLoad();
            if (payLoad.name === "DragNode" && this.currentDragNode) {
                //在node中处理过了
            } else if (payLoad.name === "DragLine" && this.currentDragPoint) {
                this.currentDragPoint.cancelDrawLine();
                this.currentDragPoint = undefined;
            }
        }

        /**
        * 拖拽操作生成事件触发后进入这个UI时触发
        */
        // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
        protected onDragEnter(InGeometry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation) {
            const payLoad = InDragDropOperation.tryGetDragDropPayLoad();
            if (this.currentDragNode && payLoad.name === "DragNode") {
                const dragOriPos = mousePosToCanvasPos(InGeometry, InDragDropEvent, this._rootCanvas.size, this._rootCanvas.position, this._rootCanvas.renderScale);

                this.dragOffset = dragOriPos.subtract(this.currentDragNode.uiObject.position);
            } else if (payLoad.name === "DragLine" && this.currentDragPoint) {
                //console.log("DragLineEnters");
                //计算起点
                //起点是左上角0，0的屏幕坐标系
                const startPoint = this.currentDragPoint.getCenterPosInScreen();
                this.currentDragPoint.currentStartPoint = startPoint;
            }
        }

        /**
         * 必须在外部处理拖拽enter,over事件，如果在BaseUINode内部处理的话，得到的ingeometry是错误的
         */
        // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
        protected onDragOver(InGeometry: mw.Geometry, InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation): boolean {

            const realPos = mousePosToCanvasPos(InGeometry, InDragDropEvent, this._rootCanvas.size, this._rootCanvas.position, this._rootCanvas.renderScale);
            const payLoad = InDragDropOperation.tryGetDragDropPayLoad();
            if (payLoad.name === "DragNode" && this.currentDragNode) {
                //节点根据点击的位置移动
                this.currentDragNode.uiObject.position = realPos.subtract(this.dragOffset);
                if (this.currentDragNode instanceof LinePanelNode) {
                    const node = this.currentDragNode as LinePanelNode;
                    node.updateAllLine();
                }
                // if (this.currentDragNode instanceof InspectorNode) {
                //     const node = this.currentDragNode as InspectorNode;
                //     node.updateAllLine();
                // }

            } else if (payLoad.name === "DragLine" && this.currentDragPoint) {
                this.currentDragPoint.dragAndDrawLine(this.currentDragPoint.currentStartPoint, realPos);
            }
            return true;
        }

        /**
         * 拖拽操作生成事件触发后离开这个UI时触发
         */
        // eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
        protected onDragLeave(InDragDropEvent: mw.PointerEvent, InDragDropOperation: mw.DragDropOperation) {
            const payLoad = InDragDropOperation.tryGetDragDropPayLoad();
            if (payLoad.name === "DragLine") {
                this.currentDragPoint.cancelDrawLine();
                this.currentDragPoint = undefined;
            }
        }
    }
}

export function initDragNodeCanvas(ui: mw.UIScript) {
    if (ui["onInnerStart"]) {
        Reflect.apply(ui["onInnerStart"], ui, []);
    }
}