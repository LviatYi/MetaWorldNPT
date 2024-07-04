// import { ITransform } from "../area/AreaController";
// import { IPoint2 } from "gtoolkit";
// import Rectangle from "../area/shape/Rectangle";
//
// interface MiniMapOption {
//     /**
//      * 比例尺.
//      * 地理距离与每 UI 坐标系单位的比值.
//      */
//     plottingScale: number;
//
//     /**
//      * 尺寸.
//      */
//     mapSize: IPoint2;
//
//     /**
//      * 自身锚点.
//      * @desc [x,y] x,y∈[0,1].
//      * @desc 决定自身在小地图中的位置.
//      */
//     selfAnchor: IPoint2;
// }
//
// export type RectQuery = (range: Rectangle) => ITransform[]
//
// export class MiniMap {
//     public parent: mw.Widget;
//
//     public get char(): mw.Character {
//         return mw.Player?.localPlayer?.character ?? undefined;
//     }
//
//     public get currentPos(): mw.Vector {
//         return this.char.worldTransform.position;
//     }
//
//     public get ready(): boolean {
//         return !!this.char;
//     }
//
//     constructor(public option: MiniMapOption,
//                 public queryHandler: RectQuery) {
//     }
//
//     public queryAroundObjects(): ITransform[] {
//         const geographySize = {
//             x: this.option.mapSize.x * this.option.plottingScale,
//             y: this.option.mapSize.y * this.option.plottingScale,
//         } as IPoint2;
//
//         let geographyPosition = {
//             x: -this.option.mapSize.x * this.option.selfAnchor.x * this.option.plottingScale,
//             y: -this.option.mapSize.y * this.option.selfAnchor.y * this.option.plottingScale,
//         } as IPoint2;
//
//         return this.queryHandler(new Rectangle(
//             [geographyPosition.x, geographyPosition.y],
//             [geographyPosition.x + geographySize.x, geographyPosition.y + geographySize.y],
//         ));
//     }
// }
//
// function queryAroundTransform(filterData: object): ITransform[] {
//
// }
//
// function renderTransform() {
//
// }
//
// function getDataByTransform() {
//
// }