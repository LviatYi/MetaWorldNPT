/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-12 16:20:57
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2023-12-27 17:11:49
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\Line.ts
 * @Description  : line
 */

import { generateUUID } from "../utils/Utils";



export class Line {
    public dotUIStartIndex: number;

    public dotUIEndIndex: number;

    public uuid: string;

    public startPoint: mw.Vector2;

    public endPoint: mw.Vector2;

    public startNodeId: number;

    public endNodeId: number;

    constructor(dotUIStartIndex: number, dotUIEndIndex: number, startPoint: mw.Vector2, endPoint: mw.Vector2, startNodeId: number, endNodeId: number, uuid: string = undefined) {
        this.dotUIStartIndex = dotUIStartIndex;
        this.dotUIEndIndex = dotUIEndIndex;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.startNodeId = startNodeId;
        this.endNodeId = endNodeId;
        if (uuid === undefined) {
            this.uuid = generateUUID();
        }
        else {
            this.uuid = uuid;
        }
    }
}
