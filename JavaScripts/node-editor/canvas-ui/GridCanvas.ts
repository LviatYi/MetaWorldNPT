/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-12-27 18:16:25
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-08 16:39:58
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\canvas-ui\GridCanvas.ts
 * @Description  : 修改描述
 */

import { EventNotify } from "../EventNotify";
import { BaseUINode } from "../node-ui/BaseUINode";
import { NodeAndLineManager } from "../node-ui/manager/NodeAndLineManager";
import { Point, QuadTree, Rectangle } from "../utils/QuadTree";
import { DragAndScaleCanvas } from "./DragAndScaleCanvas";
import Event = mw.Event;

class Grid {
    public centerX: number;
    public centerY: number;
    public width: number;
    public height: number;
    public hasNode: boolean = false;
    constructor(x: number, y: number, width: number, height: number) {
        this.centerX = x;
        this.centerY = y;
        this.width = width;
        this.height = height;
    }

    get leftTopPos(): mw.Vector2 {
        return new mw.Vector2(this.centerX - this.width * 0.5, this.centerY - this.height * 0.5);
    }
}
export default class GridCanvas extends DragAndScaleCanvas {

    private _gridContrainer: Grid[] = [];
    //nodeid和girdindex的映射
    private _nodeContrainerMap: Map<number, number> = new Map<number, number>();

    private _boundary: Rectangle;
    private _quadTree: QuadTree;
    protected canvasSize: mw.Vector2 = new mw.Vector2(16000, 16000);

    private _deleteNodeListener: mw.EventListener = undefined;

    private _rowCount: number = 0;
    private _columnCount: number = 0;
    //当前节点显示的行，从1开始
    private _currentRow: number = 0;

    public onStart(): void {
        super.onStart();
        this.canUpdate = true;

        this._boundary = new Rectangle(8000, 8000, 8000, 8000);
        this._quadTree = new QuadTree(this._boundary, 4);



        //划分网格
        for (let j = 500; j < this.canvasSize.y - 500; j += 600) {
            this._columnCount = 0;
            for (let i = 500; i < this.canvasSize.x - 500; i += 500) {
                this._gridContrainer.push(new Grid(i + 200, j + 250, 400, 500));
                let point = new Point(i + 200, j + 250, this._gridContrainer.length - 1);
                // let img = Image.newObject();
                // img.position = new mw.Vector2(i, j);
                // img.size = new mw.Vector2(400, 500);
                // img.imageColor = LinearColor.colorHexToLinearColor("#363636");
                // this.addPoint(img);
                this._quadTree.insert(point);
                // this.addUI()
                this._columnCount++;
            }
            this._rowCount++;
        }

        //算第2/3行的位置
        this._currentRow = Math.floor(this._rowCount / 3);

        this._deleteNodeListener = Event.addLocalListener(EventNotify.DeleteNode, this.onDeleteNode.bind(this));
    }

    private _oriNodePos: mw.Vector2 = new mw.Vector2(0, 0);
    private _nodeSize: mw.Vector2 = null;
    private _lastDragNode: BaseUINode = null;
    protected setCurrentDragNode(ui: BaseUINode): void {
        if (ui) {
            this._oriNodePos = ui.uiObject.position.clone();
            this._nodeSize = ui.uiObject.size.clone();
            this._lastDragNode = ui;
            this._gridContrainer[this._nodeContrainerMap.get(ui.nodeId)].hasNode = false;
            this._lastDragNodePos = this._oriNodePos;
        } else {
            let detectingRect = new Rectangle(this._lastDragNodePos.x + this._nodeSize.x * 0.5, this._lastDragNodePos.y + this._nodeSize.y * 0.5, this._nodeSize.x * 2.5, this._nodeSize.y * 2.5);
            let points = [];
            let finalPoints = this._quadTree.query(detectingRect, points);
            let index = -1;
            let minDistance = 0;
            for (let i = 0; i < finalPoints.length; i++) {
                if (!this._gridContrainer[finalPoints[i].index].hasNode) {
                    let pointX = this._lastDragNodePos.x + this._nodeSize.x * 0.5;
                    let pointY = this._lastDragNodePos.y + this._nodeSize.y * 0.5;
                    let distance = Math.abs(pointX - this._gridContrainer[finalPoints[i].index].centerX) + Math.abs(pointY - this._gridContrainer[finalPoints[i].index].centerY);

                    if (minDistance == 0 || distance < minDistance) {
                        minDistance = distance;
                        index = finalPoints[i].index;
                    }
                }
            }
            if (index != -1) {
                this._gridContrainer[index].hasNode = true;
                this._lastDragNode.uiObject.position = this._gridContrainer[index].leftTopPos;
                this._nodeContrainerMap.set(this._lastDragNode.nodeId, index);
            } else {
                //如果没有找到，就放回原来的位置
                this._lastDragNode.uiObject.position = this._oriNodePos;
                this._gridContrainer[this._nodeContrainerMap.get(this._lastDragNode.nodeId)].hasNode = true;
                //还是老位置不用存index
            }
            NodeAndLineManager.ins.updateExistedLine(this._lastDragNode.nodeId);
            this._lastDragNode = null;
        }
        super.setCurrentDragNode(ui);

    }

    private _lastDragNodePos: mw.Vector2 = new mw.Vector2(0, 0);

    onUpdate() {
        if (this.currentDragNode) {
            this._lastDragNodePos = this.currentDragNode.uiObject.position.clone();
        }
    }

    // public addNode(node: BaseUINode): void {

    //     for (let i = this._gridContrainer.length / 6; i < this._gridContrainer.length; i++) {
    //         if (!this._gridContrainer[i].hasNode) {
    //             node.uiObject.position = this._gridContrainer[i].leftTopPos;
    //             this._gridContrainer[i].hasNode = true;

    //             this._nodeContrainerMap.set(node.nodeId, i);
    //             break;
    //         }
    //     }

    //     super.addNode(node);
    // }

    public addToGrid(node: BaseUINode, newRow: boolean = false): void {
        if (newRow) this._currentRow++;
        let index = this._currentRow * this._columnCount;
        if (index >= this._gridContrainer.length) {
            //超出了，就从头节点往前放
            index = 0;
        }
        for (let i = index; i < this._gridContrainer.length; i++) {
            if (!this._gridContrainer[i].hasNode) {
                node.uiObject.position = this._gridContrainer[i].leftTopPos;
                this._gridContrainer[i].hasNode = true;
                this._nodeContrainerMap.set(node.nodeId, i);
                //算一下插入位置的行，从1开始加1
                this._currentRow = Math.floor(i / this._columnCount);
                break;
            }
        }
        this.addNode(node);
    }

    onDestroy(): void {
        super.onDestroy();
        Event.removeListener(this._deleteNodeListener);
    }

    onDeleteNode(nodeId: number): void {
        this._gridContrainer[this._nodeContrainerMap.get(nodeId)].hasNode = false;
        this._nodeContrainerMap.delete(nodeId);
    }
}