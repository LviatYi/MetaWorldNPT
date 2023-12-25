/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-07-10 14:54:12
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2023-12-24 19:24:40
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\utils\Utils.ts
 * @Description  : 位置帮助类
 */

/** 
 * @description: 鼠标位置转换到缩放后的画布坐标系下的位置
 * @param {UI} InGeometry
 * @param {UI} InDragDropEvent
 * @return {*}
 */
// eslint-disable-next-line @typescript-eslint/type-annotation-spacing, @typescript-eslint/naming-convention
export function mousePosToCanvasPos(InGeometry: mw.Geometry, InDragDropEvent: mw.PointerEvent,
    containerSize: mw.Vector2, containerPos: mw.Vector2, containerScale: mw.Vector2): mw.Vector2 {
    //InDragDropEvent.screenSpacePosition是电脑屏幕坐标，不是窗口坐标
    //转换到窗口内的坐标，ui是左上对齐的，所以要减掉一半，位置就对齐在中间
    const pos = mw.absoluteToLocal(InGeometry, InDragDropEvent.screenSpacePosition);
    //位置是在窗口坐标下的，要转换到画布坐标系下
    //缩放时实际节点坐标是不会变的，因为缩放是变得摄像头的视野
    //拖动时的鼠标位置要转换到缩放完的画布坐标系
    const cansScaleOffect = new mw.Vector2(containerSize.x * containerScale.x,
        containerSize.y * containerScale.y).subtract(containerSize).multiply(0.5);
    //this.rollCanvas.rootCanvas.position是视口下坐标
    //加上缩放偏移量，减去画布移动的位置得到原始坐标
    return pos.clone().add(cansScaleOffect).subtract(containerPos).divide(containerScale);
}

/** 
 * @description: 屏幕坐标转画布坐标
 * @param {Type} posInScreen 屏幕下的坐标
 * @param {Type} containerSize 画布大小
 * @param {Type} containerPos 画布位置
 * @param {Type} containerScale 画布缩放
 * @return {*}
 */
export function screenPosToCanvasPos(posInScreen: mw.Vector2, containerSize: mw.Vector2, containerPos: mw.Vector2, containerScale: mw.Vector2): mw.Vector2 {
    //InDragDropEvent.screenSpacePosition是电脑屏幕坐标，不是窗口坐标
    //转换到窗口内的坐标，ui是左上对齐的，所以要减掉一半，位置就对齐在中间
    //let pos = mw.absoluteToLocal(InGeometry,InDragDropEvent.screenSpacePosition);
    //位置是在窗口坐标下的，要转换到画布坐标系下
    //缩放时实际节点坐标是不会变的，因为缩放是变得摄像头的视野
    //拖动时的鼠标位置要转换到缩放完的画布坐标系
    const cansScaleOffect = new mw.Vector2(containerSize.x * containerScale.x,
        containerSize.y * containerScale.y).subtract(containerSize).multiply(0.5);
    //this.rollCanvas.rootCanvas.position是视口下坐标
    //加上缩放偏移量，减去画布移动的位置得到原始坐标
    return posInScreen.clone().add(cansScaleOffect).subtract(containerPos).divide(containerScale);
}

/** 
 * @description: 三阶贝塞尔曲线
 * @param {Type} startPoint
 * @param {Type} startControlPoint
 * @param {Type} endPoint
 * @param {Type} endControlPoint
 * @param {number} t t[0,1]
 * @return {*}
 */
export function cubicBezierCurve(startPoint: mw.Vector2, startControlPoint: mw.Vector2, endPoint: mw.Vector2, endControlPoint: mw.Vector2, t: number): mw.Vector2 {
    const x0 = Math.pow(1 - t, 3);
    const x1 = 3 * t * Math.pow(1 - t, 2);
    const x2 = 3 * (1 - t) * Math.pow(t, 2);
    const x3 = Math.pow(t, 3);
    return new mw.Vector2(x0, x0).multiply(startPoint)
        .add(new mw.Vector2(x1, x1).multiply(startControlPoint))
        .add(new mw.Vector2(x2, x2).multiply(endControlPoint))
        .add(new mw.Vector2(x3, x3).multiply(endPoint));
}

/**
     * 生成uuid
     * @returns 
     */
export function generateUUID(): string {
    let d = new Date().getTime() + Math.random() * 1000;
    const uuid = "xyx-xxy".replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}