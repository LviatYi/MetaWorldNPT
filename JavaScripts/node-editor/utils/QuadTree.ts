/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-11-01 15:07:13
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2023-12-27 18:51:29
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\utils\QuadTree.ts
 * @Description  : 空间划分，用于检测玩家是否在交互范围内
 */

export class Point {
    x: number;
    y: number;
    index: number;
    constructor(x: number, y: number, index: number) {
        this.x = x;
        this.y = y;
        this.index = index;
    }
}

export class Rectangle {
    //中心点坐标
    x: number;
    y: number;
    //宽度一半
    halfWidth: number;
    //高度一半
    halfHeight: number;
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.halfWidth = w;
        this.halfHeight = h;
    }

    /** 
     * @description: 点是否在区域内
     * @param {Point} point
     * @return {*}
     */
    contains(point: Point) {
        return (point.x >= this.x - this.halfWidth &&
            point.x < this.x + this.halfWidth &&
            point.y >= this.y - this.halfHeight &&
            point.y < this.y + this.halfHeight);
    }

    /** 
     * @description: 两个区域是否相交
     * @param {Rectangle} range
     * @return {*}
     */
    intersects(range: Rectangle) {
        return !(range.x - range.halfWidth > this.x + this.halfWidth ||
            range.x + range.halfWidth < this.x - this.halfWidth ||
            range.y - range.halfHeight > this.y + this.halfHeight ||
            range.y + range.halfHeight < this.y - this.halfHeight);
    }
}

export class QuadTree {
    boundary: Rectangle;
    capacity: number;
    //包含的点
    points: Point[];
    // 细分标记
    divided: boolean;

    northeast: QuadTree;
    northwest: QuadTree;
    southeast: QuadTree;
    southwest: QuadTree;

    constructor(boundary: Rectangle, n: number) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.divided = false;
    }

    /** 
     * @description: 划分四个区域
     * @return {*}
     */
    subdivide(): void {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.halfWidth;
        let h = this.boundary.halfHeight;
        let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.capacity);
        this.divided = true;
    }

    /** 
     * @description: 根据区域插入点
     * @param {Point} point
     * @return {*}
     */
    insert(point: Point): boolean {

        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northeast.insert(point)) {
                return true;
            } else if (this.northwest.insert(point)) {
                return true;
            } else if (this.southeast.insert(point)) {
                return true;
            } else if (this.southwest.insert(point)) {
                return true;
            }
        }
    }

    /** 
     * @description: 根据区域查找点
     * @param {Rectangle} range 矩形范围
     * @param {Point} found 找到的点数组
     * @return {*}
     */
    query(range: Rectangle, found: Point[]) {
        if (!found) {
            found = [];
        }
        if (!this.boundary.intersects(range)) {
            return;
        } else {
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            if (this.divided) {
                this.northwest.query(range, found);
                this.northeast.query(range, found);
                this.southwest.query(range, found);
                this.southeast.query(range, found);
            }
        }
        return found;
    }
}