import Rectangle, { compareWeightByIncrease, getBoundingBox } from "../shape/Rectangle";
import RTreeNode from "./RTreeNode.js";
import { removeItemByIndex } from "./util/Util.js";

/**
 * RTree R-树 空间索引.
 * @desc 对 Rectangle 进行空间索引.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class RTree {
    public maxChildrenCount: number = 4;

    private _root: RTreeNode;

    private _box: Rectangle;

    public get box(): Rectangle {
        return this._box.clone();
    }

    private _size: number = 0;

    public get size(): number {
        return this._size;
    }

    /**
     * 插入一个元素.
     * @param {Rectangle} rect
     */
    public insert(rect: Rectangle) {
        if (this._root === undefined) {
            this._root = new RTreeNode();
            this._root.addBox(rect);
            this._box = rect.clone();
        } else {
            const node = this.chooseLeaf(rect);
            node.addBox(rect);

            let focus = node;
            while (true) {
                if (focus.boxes.length > this.maxChildrenCount) {
                    this.split(focus);
                    focus = focus.parent;
                } else {
                    this.readjust(focus);
                    break;
                }
            }

            if (!this._root.isRoot()) this._root = this._root.parent;
        }
        this._size += 1;
    }

    /**
     * 移除一个元素.
     * @param {Rectangle} rect
     * @returns {boolean}
     */
    public remove(rect: Rectangle): boolean {
        let focus: RTreeNode = this._root.findLeafHas(rect);
        if (!focus) return false;

        removeItemByIndex(focus.boxes, focus.boxes.indexOf(rect));

        let removedTree: Rectangle[] = [];
        let parent: RTreeNode = undefined;
        while (focus && !focus.isRoot()) {
            if (focus.boxes.length < Math.floor(this.maxChildrenCount / 2)) {
                parent = focus.parent;
                parent.removeChild(focus);
                let released = focus.getAllDataBox();
                this._size -= released.length;
                removedTree.push(...released);
                focus = parent;
            } else {
                break;
            }
        }
        this.readjust(focus);

        if (focus.isRoot() && focus.boxes.length === 0) this.clear();
        else --this._size;

        for (const rect of removedTree) {
            this.insert(rect);
        }
        return true;
    }

    public clear() {
        this._root = undefined;
        this._box = undefined;
        this._size = 0;
    }

    /**
     * 查询 将指定矩形 包含 的所有矩形.
     * @param {Rectangle} rect
     * @param {number} epsilon=0
     * @returns {Generator<Rectangle>}
     */
    public* queryIncludeRect(rect: Rectangle, epsilon: number = 0): Generator<Rectangle> {
        let candidate: RTreeNode[] = [this._root];

        while (candidate.length > 0) {
            let p = candidate.pop();

            for (let i = 0; i < p.boxes.length; i++) {
                const r = p.boxes[i];
                if (r.include(rect, epsilon)) {
                    if (p.isLeaf()) yield r;
                    else candidate.push(p.children[i]);
                }
            }
        }

        return;
    }

    /**
     * 查询 与指定矩形 相交 的所有矩形.
     * @param {Rectangle} rect
     * @param {number} epsilon=0
     * @returns {Generator<Rectangle>}
     */
    public* queryIntersectedRect(rect: Rectangle, epsilon: number = 0): Generator<Rectangle> {
        let candidate: RTreeNode[] = [this._root];

        while (candidate.length > 0) {
            let p = candidate.pop();

            for (let i = 0; i < p.boxes.length; i++) {
                const r = p.boxes[i];
                if (r.intersect(rect, epsilon)) {
                    if (p.isLeaf()) yield r;
                    else candidate.push(p.children[i]);
                }
            }
        }

        return;
    }

    /**
     * 查询 将指定点 包含 的所有矩形.
     * @param {number[]} point
     * @param {number} epsilon=0
     * @returns {Generator<Rectangle>}
     */
    public* queryIncludePoint(point: number[], epsilon: number = 0): Generator<Rectangle> {
        let candidate: RTreeNode[] = [this._root];

        while (candidate.length > 0) {
            let p = candidate.pop();

            for (let i = 0; i < p.boxes.length; i++) {
                const r = p.boxes[i];
                if (r.hit(point, epsilon)) {
                    if (p.isLeaf()) yield r;
                    else candidate.push(p.children[i]);
                }
            }
        }

        return;
    }

    /**
     * 查询 被指定矩形 包含 的所有矩形.
     * @param {Rectangle} rect
     * @param {number} epsilon=0
     * @returns {Generator<Rectangle>}
     */
    public* queryRectInclude(rect: Rectangle, epsilon: number = 0): Generator<Rectangle> {
        let candidate: RTreeNode[] = [this._root];

        while (candidate.length > 0) {
            let p = candidate.pop();

            for (let i = 0; i < p.boxes.length; i++) {
                const r = p.boxes[i];
                if (p.isLeaf()) {
                    if (rect.include(r, epsilon)) yield r;
                } else {
                    if (rect.intersect(r)) candidate.push(p.children[i]);
                }
            }
        }

        return;
    }

    /**
     * 查询 被指定矩形 相交 的所有矩形.
     * @param {Rectangle} rect
     * @param {number} epsilon=0
     * @returns {Generator<Rectangle>}
     */
    public* queryRectIntersect(rect: Rectangle, epsilon: number = 0): Generator<Rectangle> {
        let candidate: RTreeNode[] = [this._root];

        while (candidate.length > 0) {
            let p = candidate.pop();

            for (let i = 0; i < p.boxes.length; i++) {
                const r = p.boxes[i];
                if (rect.intersect(r, epsilon)) {
                    if (p.isLeaf()) yield r;
                    else candidate.push(p.children[i]);
                }
            }
        }

        return;
    }

    public toString(): string {
        return this._root?.toIndentString(0) ?? "";
    }

//#region Iterator

    /**
     * 遍历所有叶子节点.
     */
    public* traverseLeaf(): Generator<RTreeNode, void> {
        if (!this._root) return;
        let pool: RTreeNode [] = [this._root];

        while (pool.length > 0) {
            let focus = pool.pop();
            if (focus.isLeaf()) {
                yield focus;
            } else {
                pool.push(...focus.children);
            }
        }
    }

    /**
     * 遍历所有矩形.
     */
    public* [Symbol.iterator](): Generator<Rectangle, void> {
        if (!this._root) return;
        let pool: RTreeNode [] = [this._root];

        while (pool.length > 0) {
            let focus = pool.pop();
            if (focus.isLeaf()) {
                for (const rect of focus.boxes) yield rect;
            } else {
                pool.push(...focus.children);
            }
        }
    }

    private chooseLeaf(rect: Rectangle): RTreeNode {
        let result: RTreeNode = this._root;
        while (!result.isLeaf()) {
            let chooseIndex = 0;
            let chosenRect = getBoundingBox(result.boxes[chooseIndex], rect);
            for (let i = 1; i < result.boxes.length; ++i) {
                let newBox = getBoundingBox(result.boxes[i], rect);
                if (compareWeightByIncrease(chosenRect, newBox) > 0) {
                    chooseIndex = i;
                    chosenRect = newBox;
                }
            }
            result = result.children[chooseIndex];
        }

        return result;
    }

    private split(node: RTreeNode) {
        let outL: RTreeNode, outR: RTreeNode, nl: RTreeNode, sr: RTreeNode;
        let boxesNeedSpilt = [...node.boxes];
        let childrenNodeNeedSplit = node.children ? [...node.children] : undefined;
        node.boxes.length = 0;
        if (childrenNodeNeedSplit) {
            node.children.length = 0;
        }

        let farthestNodeIndex: [number, number] = undefined;
        let farthestBoundingBox: Rectangle;
        for (let i = 0; i < boxesNeedSpilt.length; ++i) {
            for (let j = i + 1; j < boxesNeedSpilt.length; ++j) {
                let d1 = boxesNeedSpilt[i];
                let d2 = boxesNeedSpilt[j];
                let newBox = getBoundingBox(d1, d2);
                if (farthestNodeIndex === undefined ||
                    compareWeightByIncrease(farthestBoundingBox, newBox) < 0) {
                    farthestBoundingBox = newBox;
                    farthestNodeIndex = [i, j];
                }
            }
        }

        let split = new RTreeNode();
        if (childrenNodeNeedSplit) {
            const nodeMain = childrenNodeNeedSplit[farthestNodeIndex[0]];
            node.addChild(nodeMain, boxesNeedSpilt[farthestNodeIndex[0]]);
            const splitMain = childrenNodeNeedSplit[farthestNodeIndex[1]];
            split.addChild(splitMain, boxesNeedSpilt[farthestNodeIndex[1]]);

            removeItemByIndex(childrenNodeNeedSplit, ...farthestNodeIndex);
        } else {
            node.addBox(boxesNeedSpilt[farthestNodeIndex[0]]);
            split.addBox(boxesNeedSpilt[farthestNodeIndex[1]]);
        }
        removeItemByIndex(boxesNeedSpilt, ...farthestNodeIndex);
        let boundingBoxL = node.boxes[0].clone();
        let boundingBoxR = split.boxes[0].clone();

        for (let i = 0; i < boxesNeedSpilt.length; i++) {
            const d = boxesNeedSpilt[i];
            if (compareWeightByIncrease(
                    getBoundingBox(boundingBoxL, d),
                    getBoundingBox(boundingBoxR, d))
                < 0) {
                if (childrenNodeNeedSplit) {
                    const c = childrenNodeNeedSplit[i];
                    node.addChild(c, d);
                } else {
                    node.boxes.push(d);
                }
                getBoundingBox(boundingBoxL, d, boundingBoxL);
            } else {
                if (childrenNodeNeedSplit) {
                    split.addChild(childrenNodeNeedSplit[i], d);
                } else {
                    split.boxes.push(d);
                }
                getBoundingBox(boundingBoxR, d, boundingBoxR);
            }
        }

        if (node.isRoot()) {
            let p = new RTreeNode();
            p.addChild(node, boundingBoxL);
            p.addChild(split, boundingBoxR);
        } else {
            let index = node.parent.children.indexOf(node);
            node.parent.boxes[index] = boundingBoxL;
            node.parent.addChild(split, boundingBoxR);
        }
    }

    /**
     * 调整父节点包围盒.
     * @param {RTreeNode} child
     * @param {number} childIndex
     * @private
     */
    private readjust(child: RTreeNode, childIndex: number = undefined) {
        const node = child.parent ?? undefined;
        if (node) {
            childIndex = childIndex ?? node.children.indexOf(child);
            let bounding: Rectangle = undefined;
            for (let i = 0; i < child.boxes.length; ++i) {
                if (bounding) {
                    getBoundingBox(bounding, child.boxes[i], bounding);
                } else {
                    bounding = getBoundingBox(bounding, child.boxes[i]);
                }
            }

            if (!node.boxes[childIndex].equal(bounding)) {
                node.boxes[childIndex] = bounding;
                this.readjust(node);
            }
        } else {
            this._box = undefined;
            if (!this._root.boxes) return;
            for (let i = 0; i < this._root.boxes.length; ++i) {
                this._box = getBoundingBox(this._box, child.boxes[i]);
            }
        }
        return;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}
