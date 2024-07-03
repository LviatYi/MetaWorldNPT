import { ITransform } from "../area/AreaController";
import { IPoint2 } from "gtoolkit";

interface MiniMapOption {
    /**
     * 比例尺.
     */
    plottingScale: number;

    /**
     * 尺寸.
     */
    mapSize: IPoint2;

    /**
     * 自身锚点.
     * @desc [x,y] x,y∈[0,1].
     */
    selfAnchor: IPoint2;
}

export class MiniMap {
    public parent: mw.Widget;

    public queryAroundObjects(): ITransform[] {

    }
}

function queryAroundTransform(filterData: object): ITransform[] {

}

function renderTransform() {

}

function getDataByTransform() {

}