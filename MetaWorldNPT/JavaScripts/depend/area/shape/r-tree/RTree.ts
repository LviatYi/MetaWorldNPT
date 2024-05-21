import Rectangle, { compareWeightByIncrease, getBoundingBox } from "./Rectangle.js";
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

    private _firstLeaf: RTreeNode;

    private _box: Rectangle;

    private _size: number = 0;

    public get size(): number {
        return this._size;
    }

    public get box(): Rectangle {
        return this._box.clone();
    }

    /**
     * 插入一个元素.
     * @param {Rectangle} rect
     */
    public insert(rect: Rectangle) {
        if (this._root === undefined) {
            this._root = new RTreeNode();
            this._root.insert(rect);
            this._firstLeaf = this._root;
            this._box = rect.clone();
        } else {
            const node = this.chooseLeaf(rect);
            node.insert(rect);

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

            if (!this._root.isRoot()) {
                this._root = this._root.parent;
            }
        }
        this._size += 1;
    }

    /**
     * 移除一个元素.
     * @param {Rectangle} rect
     * @returns {boolean}
     */
    public remove(rect: Rectangle): boolean {
        let focus: RTreeNode = this._root;
        query: while (focus && !focus.isLeaf()) {
            for (let i = 0; i < focus.boxes.length; ++i) {
                let box = focus.boxes[i];
                if (box.include(rect)) {
                    focus = focus.children[i];
                    continue query;
                }
            }
            focus = undefined;
        }
        if (!focus) return false;
        let childIndex: number = focus.boxes.indexOf(rect);
        if (childIndex < 0) return false;

        focus.removeBoxesAt(childIndex);

        let removedTree: Rectangle[] = [];
        let parent: RTreeNode = undefined;
        while (!focus.isRoot()) {
            if (focus.boxes.length < Math.floor(this.maxChildrenCount / 2)) {
                parent = focus.parent;
                if (this._firstLeaf === focus) this._firstLeaf = focus.nextLeaf;
                parent.removeChild(focus);
                removedTree.push(...focus.getAllDataBox());
                focus = parent;
            } else {
                break;
            }
        }
        this.readjust(focus);

        for (const rect of removedTree) {
            this.insert(rect);
        }

        --this._size;
        return true;
    }

    /**
     * 查询 将指定矩形 包含 的所有矩形.
     * @param {Rectangle} rect
     * @param {number} epsilon=0
     * @returns {Rectangle[]}
     */
    public queryRectIncluded(rect: Rectangle, epsilon: number = 0): Rectangle[] {
        let result: Rectangle[] = [];
        let candidate: RTreeNode[] = [this._root];

        while (candidate.length > 0) {
            let p = candidate.pop();

            for (let i = 0; i < p.boxes.length; i++) {
                const d = p.boxes[i];
                if (d.include(rect, epsilon)) {
                    if (p.isLeaf()) result.push(d);
                    else candidate.push(p.children[i]);
                }
            }
        }

        return result;
    }

    /**
     * 查询 与指定矩形 相交 的所有矩形.
     * @param {Rectangle} rect
     * @param {number} epsilon=0
     * @returns {Rectangle[]}
     */
    public queryRectIntersected(rect: Rectangle, epsilon: number = 0): Rectangle[] {
        let result: Rectangle[] = [];
        let candidate: RTreeNode[] = [this._root];

        while (candidate.length > 0) {
            let p = candidate.pop();

            for (let i = 0; i < p.boxes.length; i++) {
                const d = p.boxes[i];
                if (d.intersect(rect, epsilon)) {
                    if (p.isLeaf()) result.push(d);
                    else candidate.push(p.children[i]);
                }
            }
        }

        return result;
    }

    /**
     * 查询 将指定点 包含 的所有矩形.
     * @param {number[]} point
     * @param {number} epsilon=0
     * @returns {Rectangle[]}
     */
    public queryPoint(point: number[], epsilon: number = 0): Rectangle[] {
        let result: Rectangle[] = [];
        let candidate: RTreeNode[] = [this._root];

        while (candidate.length > 0) {
            let p = candidate.pop();

            for (let i = 0; i < p.boxes.length; i++) {
                const d = p.boxes[i];
                if (d.hit(point, epsilon)) {
                    if (p.isLeaf()) result.push(d);
                    else candidate.push(p.children[i]);
                }
            }
        }

        return result;
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
        let boxesNeedSpilt = [...node.boxes];
        let childrenNodeNeedSplit = node.children ? [...node.children] : undefined;
        node.boxes.length = 0;
        if (childrenNodeNeedSplit) {
            node.children.length = 0;
        }

        let maxWeight: number = 0;
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
        node.boxes.push(boxesNeedSpilt[farthestNodeIndex[0]]);
        split.boxes.push(boxesNeedSpilt[farthestNodeIndex[1]]);
        removeItemByIndex(boxesNeedSpilt, ...farthestNodeIndex);
        if (childrenNodeNeedSplit) {
            node.children.push(childrenNodeNeedSplit[farthestNodeIndex[0]]);
            split.children.push(childrenNodeNeedSplit[farthestNodeIndex[1]]);
            removeItemByIndex(childrenNodeNeedSplit, ...farthestNodeIndex);
        }
        let boundingBoxL = node.boxes[0].clone();
        let boundingBoxR = split.boxes[0].clone();

        for (let i = 0; i < boxesNeedSpilt.length; i++) {
            const d = boxesNeedSpilt[i];
            if (compareWeightByIncrease(
                    getBoundingBox(boundingBoxL, d),
                    getBoundingBox(boundingBoxR, d))
                < 0) {
                node.boxes.push(d);
                childrenNodeNeedSplit && node.children.push(childrenNodeNeedSplit[i]);
                getBoundingBox(boundingBoxL, d, boundingBoxL);
            } else {
                split.boxes.push(d);
                childrenNodeNeedSplit && split.children.push(childrenNodeNeedSplit[i]);
                getBoundingBox(boundingBoxR, d, boundingBoxR);
            }

        }
        if (node.isRoot()) {
            let p = new RTreeNode();
            p.addChild(node, boundingBoxL);
            p.addChild(split, boundingBoxR);
        } else {
            let index = node.parent.children.findIndex(c => c === node);
            node.parent.boxes[index] = boundingBoxL;
            node.parent.addChild(split, boundingBoxR);
        }

        if (node.isLeaf()) {
            split.nextLeaf = node.nextLeaf;
            split.prevLeaf = node;
            node.nextLeaf = split;
            if (split.nextLeaf) split.nextLeaf.prevLeaf = split;
        }
    }

    /**
     * 调整父节点包围盒.
     * @param {RTreeNode} child
     * @param {number} childIndex
     * @private
     */
    private readjust(child: RTreeNode = undefined, childIndex: number = undefined) {
        const node = child?.parent ?? undefined;
        if (!node) {
            this._box = undefined;
            for (let i = 0; i < this._root.boxes.length; ++i) {
                this._box = getBoundingBox(this._box, child.boxes[i]);
            }
        } else {
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
        }
        return;
    }

    //#region Iterator
    /**
     * 遍历所有叶子节点.
     */
    public* traverseLeaf(): Generator<RTreeNode, void> {
        let curr: RTreeNode = this._firstLeaf;
        while (curr) {
            yield curr;
            curr = curr.nextLeaf;
        }
    }

    /**
     * 遍历所有矩形.
     */
    public* [Symbol.iterator](): Generator<Rectangle, void> {
        let curr: RTreeNode = this._firstLeaf;
        let idx = 0;
        while (curr) {
            yield curr.boxes[idx++];
            if (idx >= curr.boxes.length) {
                curr = curr.nextLeaf;
                idx = 0;
            }
        }
    }

    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}
