/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-12-27 14:59:54
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-02 18:09:37
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\manager\NodeAndLineManager.ts
 * @Description  : 线和节点管理器
 */

import { EventNotify } from "../../EventNotify";
import { MainUI } from "../../MainUI";
import NodeConfig from "../../NodeConfig";
import DragNodeCanvas from "../../canvas-ui/DragNodeCanvas";
import { cubicBezierCurve } from "../../utils/Utils";
import { Line } from "../Line";
import { LinePanelNode } from "../LinePanelNode";
import { LineUI } from "../LineUI";

export class NodeAndLineManager {
    private static _instance: NodeAndLineManager = undefined;

    private _nodeMap: Map<number, LinePanelNode> = new Map<number, LinePanelNode>();

    //节点id和线的uuid列表的映射
    public nodeAndLines: Map<number, string[]> = new Map<number, string[]>();

    private lineDots: LineUI[] = [];
    // private _parentCanvas: DragNodeCanvas;
    //线的uuid和线的映射
    public lines: Map<string, Line> = new Map<string, Line>();

    private _freeIndex: number[] = [];

    private _mouseEnterLineListener: mw.EventListener = undefined;
    private _mouseLeaveLineListener: mw.EventListener = undefined;
    private _deleteAllUIListener: mw.EventListener = undefined;

    public static get ins(): NodeAndLineManager {
        if (!this._instance) {
            this._instance = new NodeAndLineManager();

        }
        return this._instance;
    }

    private constructor() {
        // this._parentCanvas = MainUI.ins.mainCanvas;
        this._mouseEnterLineListener = Event.addLocalListener(EventNotify.OnMouseEnterLine, this.onMouseEnterLine.bind(this));
        this._mouseLeaveLineListener = Event.addLocalListener(EventNotify.OnMouseLeaveLine, this.onMouseLeaveLine.bind(this));
        this._deleteAllUIListener = Event.addLocalListener(EventNotify.DeleteAllUI, this.deleteAllNode.bind(this));

        InputUtil.onKeyDown(Keys.Delete, () => {
            if (this._currentLine) {
                this.deleteLineByLineId(this._currentLine);
                this._currentLine = undefined;
            }
        });
    }

    private _currentLine: string = undefined;
    onMouseEnterLine(lineId: string) {
        // console.log("onMouseEnterLine", lineId);
        this._currentLine = lineId;
        let line = this.lines.get(lineId);
        for (let i = line.dotUIStartIndex; i <= line.dotUIEndIndex; i++) {
            this.lineDots[i].setDotColor("#AF2828");
        }
    }

    onMouseLeaveLine(lineId: string) {
        // console.log("onMouseLeaveLine", lineId);
        let line = this.lines.get(lineId);
        for (let i = line.dotUIStartIndex; i <= line.dotUIEndIndex; i++) {
            this.lineDots[i].setDotColor("#EEC900");
        }
        this._currentLine = undefined;
    }

    addNode(node: LinePanelNode): void {
        this._nodeMap.set(node.nodeId, node);
        this.nodeAndLines.set(node.nodeId, []);
    }

    getNodeStartPointPos(nodeId: number): Vector2 {
        return this._nodeMap.get(nodeId).startLinePointPosInScreen;
    }

    getNodeEndPointPos(nodeId: number): Vector2 {
        return this._nodeMap.get(nodeId).endLinePointPosInScreen;
    }

    deleteAllNode(): void {
        this._nodeMap.clear();
        this.nodeAndLines.clear();
        this.lines.clear();
        this.lineDots = [];
        this._freeIndex = [];
        this.lineDots.forEach(element => {
            element.destroy();
        });
        this.lineDots = [];

    }

    deleteNode(nodeId: number): void {
        this._nodeMap.delete(nodeId);
    }


    public collapseLineByNodeId(nodeId: number): void {
        this.nodeAndLines.get(nodeId).forEach(element => {
            let line = this.lines.get(element);
            this.hidePoints(line.dotUIStartIndex, line.dotUIEndIndex + 1);
        });
    }

    public showLineByNodeId(nodeId: number): void {
        this.nodeAndLines.get(nodeId).forEach(element => {
            this.showPoints(element);
        });
    }

    public deleteLineByNodeId(nodeId: number): void {
        this.nodeAndLines.get(nodeId).forEach(element => {
            this.deletePoints(element);
            //遍历所有的nodeAndLines，删除对应的line
            this.nodeAndLines.forEach((value, key) => {
                let index = value.indexOf(element);
                if (index !== -1) {
                    value.splice(index, 1);
                }
            });
            this.lines.delete(element);
        });
        this.nodeAndLines.delete(nodeId);

    }

    public deleteLineByLineId(lineId: string): void {
        //遍历所有的nodeAndLines，删除对应的line
        this.nodeAndLines.forEach((value, key) => {
            let index = value.indexOf(lineId);
            if (index !== -1) {
                value.splice(index, 1);
            }
        });

        this.deletePoints(lineId);
        //删除线
        this.lines.delete(lineId);

    }


    public setLineZOrderByNodeId(nodeId: number, zorder: number): void {
        this.nodeAndLines.get(nodeId).forEach(element => {
            let line = this.lines.get(element);
            for (let i = line.dotUIStartIndex; i <= line.dotUIEndIndex; i++) {
                this.lineDots[i].uiObject.zOrder = zorder;
            }
        });
    }

    public updateExistedLine(hostNodeId: number): void {
        this.nodeAndLines.get(hostNodeId).forEach(element => {
            const line = this.lines.get(element);
            if (line.startNodeId === hostNodeId) {
                //如果连的是出发的线，更新起点
                let startPoint = this.getNodeStartPointPos(hostNodeId);
                this.updatePoints(startPoint, line.endPoint, line.dotUIStartIndex);
                line.startPoint = startPoint;
            } else if (line.endNodeId === hostNodeId) {
                //如果连的是结束的线，更新终点
                let endPoint = this.getNodeEndPointPos(hostNodeId);
                this.updatePoints(line.startPoint, endPoint, line.dotUIStartIndex);
                line.endPoint = endPoint;
            }
        });
    }




    public updateNewLine(startPoint: Vector2, endPoint: Vector2): void {
        this.updatePoints(startPoint, endPoint, this.getFreeIndex());
    }

    public cancelNewLine(): void {
        let startIndex = this.getFreeIndex();
        this.hidePoints(startIndex, startIndex + NodeConfig.lineDotCount);
    }

    public isLineExisted(startPoint: Vector2, endPoint: Vector2): boolean {
        for (let [key, value] of this.lines) {
            if (value.startPoint.equals(startPoint) && value.endPoint.equals(endPoint)) {
                return true;
            }
        }
        return false;
    }

    public addLine(startPoint: Vector2, endPoint: Vector2, startNodeId: number, endNodeId: number): void {
        let startIndex = this.getFreeIndex();
        const line = new Line(startIndex, startIndex + NodeConfig.lineDotCount - 1, startPoint, endPoint, startNodeId, endNodeId);
        this.lines.set(line.uuid, line);
        //更新点的归属
        for (let i = startIndex; i <= startIndex + NodeConfig.lineDotCount - 1; i++) {
            this.lineDots[i].lineID = line.uuid;
        }
        this.nodeAndLines.get(startNodeId).push(line.uuid);
        this.nodeAndLines.get(endNodeId).push(line.uuid);
        this.useFreeIndex();
    }

    /** 
    * @description: 预先创建点
    * @param dotCount
    * @return 
    */
    public perGenerateLineUi() {
        //有空闲的点就不创建
        if (this._freeIndex.length > 0) return;
        this._freeIndex.push(this.lineDots.length);
        for (let i = 0; i < NodeConfig.lineDotCount; i++) {
            const dot = mw.createUIOnlyClass(LineUI);
            this.lineDots.push(dot);
            //zOrder最低防止挡住拖拽点
            dot.uiObject.zOrder = mw.UILayerBottom;

            MainUI.ins.mainCanvas.addPoint(dot.uiObject);
        }
    }



    public hidePoints(startIndex: number, endIndex: number) {
        for (let i = startIndex; i < endIndex; i++) {
            this.lineDots[i].rootCanvas.visibility = mw.SlateVisibility.Collapsed;
        }
    }

    public showPoints(lineId: string) {
        let line = this.lines.get(lineId);
        for (let i = line.dotUIStartIndex; i <= line.dotUIEndIndex; i++) {
            this.lineDots[i].rootCanvas.visibility = mw.SlateVisibility.Visible;
        }
    }

    public deletePoints(lineId: string) {
        let line = this.lines.get(lineId);
        for (let i = line.dotUIStartIndex; i <= line.dotUIEndIndex; i++) {
            // this.lineDots[i].rootCanvas.destroyObject();
            //只隐藏
            this.lineDots[i].rootCanvas.visibility = mw.SlateVisibility.Collapsed;
            this.lineDots[i].lineID = undefined;
            this.lineDots[i].setDotColor("#EEC900");
        }
        this._freeIndex.push(line.dotUIStartIndex);

        //如果空闲点位多于3个，就删除第一个
        if (this._freeIndex.length >= 3) {
            //销毁空闲区域
            for (let i = this._freeIndex[0]; i < this._freeIndex[0] + NodeConfig.lineDotCount; i++) {
                this.lineDots[i].destroy();
            }
            //后面的点往前移动
            this.lineDots.splice(this._freeIndex[0], NodeConfig.lineDotCount);
            //更新line的起点和终点
            for (let [key, value] of this.lines) {
                if (value.dotUIStartIndex > this._freeIndex[0]) {
                    value.dotUIStartIndex -= NodeConfig.lineDotCount;
                    value.dotUIEndIndex -= NodeConfig.lineDotCount;
                }
            }
            //删除第一个空闲点位
            this._freeIndex.splice(0, 1);
        }
    }

    public deleteAllPoints() {
        this.lineDots = [];
    }




    public getFreeIndex(): number {
        return this._freeIndex[this._freeIndex.length - 1];
    }

    public useFreeIndex() {
        this._freeIndex.pop();
        this.perGenerateLineUi();
    }

    private _dotInterval: number = 1 / NodeConfig.lineDotCount;
    public updatePoints(startPoint: Vector2, endPoint: Vector2, startIndex: number) {

        let startControlPoint = mw.Vector2.zero;
        let endControlPoint = mw.Vector2.zero;
        if (endPoint.x < startPoint.x) {
            //起点控制点在起点左边
            startControlPoint = startPoint.clone().subtract(NodeConfig.controlPointOffset);
            //终点控制点在终点右边
            endControlPoint = endPoint.clone().add(NodeConfig.controlPointOffset);
        } else {
            //起点控制点在起点右边
            startControlPoint = startPoint.clone().add(NodeConfig.controlPointOffset);
            //终点控制点在终点左边
            endControlPoint = endPoint.clone().subtract(NodeConfig.controlPointOffset);
        }
        // console.log("startPoint:" + startPoint + "startControlPoint:" + startControlPoint + "endPoint:" + endPoint + "endControlPoint:" + endControlPoint)
        for (let i = 0, index = startIndex; i <= 1; i += this._dotInterval, index++) {
            const dot = this.lineDots[index];
            dot.uiObject.position = cubicBezierCurve(startPoint, startControlPoint, endPoint, endControlPoint, i);
            dot.rootCanvas.visibility = mw.SlateVisibility.Visible;
        }
    }

}