/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-12 16:20:57
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2023-12-24 19:25:09
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

    constructor(dotUIStartIndex: number, dotUIEndIndex: number, startPoint: mw.Vector2, endPoint: mw.Vector2, uuid: string = undefined) {
        this.dotUIStartIndex = dotUIStartIndex;
        this.dotUIEndIndex = dotUIEndIndex;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        if (uuid === undefined) {
            this.uuid = generateUUID();
        }
        else {
            this.uuid = uuid;
        }
    }
}
