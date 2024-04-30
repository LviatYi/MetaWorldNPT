import Rectangle, {getBoundingBox, getOuterBoundingBoxWeight} from "./Rectangle";

class RTreeNode {
    public parent: RTreeNode = undefined;

    public children: RTreeNode[] = undefined;

    public data: Rectangle[] = [];

    public nextLeaf: RTreeNode = undefined;

    public isLeaf(): boolean {
        return this.children === undefined;
    }

    public isRoot(): boolean {
        return this.parent === undefined;
    }

    public insert(data: Rectangle) {
        this.data.push(data);
    }

    public addChild(c: RTreeNode, boundingBox: Rectangle) {
        if (!this.children) this.children = [];
        this.children.push(c);
        this.data.push(boundingBox);
        c.parent = this;
    }

    public removeChild(c: RTreeNode): boolean {
        if (!this.children) return false;

        const index = this.children.findIndex(child => child === c);
        if (index < 0) return false;
        removeItemByIndex(this.children, index);
        removeItemByIndex(this.data, index);
        c.parent = undefined;

        return true;
    }

    public removeDataAt(index: number): boolean {
        if (index < 0 || index >= this.data.length) return false;
        if (!this.isLeaf()) return false;

        removeItemByIndex(this.data, index);
        return true;
    }
}

export class RTree {
    public maxChildrenCount: number = 4;

    private _root: RTreeNode;

    private _firstLeaf: RTreeNode;

    private _box: Rectangle;

    public insert(data: Rectangle) {
        if (this._root === undefined) {
            this._root = new RTreeNode();
            this._root.insert(data);
            this._firstLeaf = this._root;
            this._box = data.clone();
        } else {
            const node = this.chooseLeaf(data);
            node.insert(data);

            let current = node;
            while (current.data.length > this.maxChildrenCount) {
                this.split(current);
                current = current.parent;
            }
            if (this._root.parent) this._root = this._root.parent;
            getBoundingBox(this._box, data, this._box);
        }
    }

    public chooseLeaf(point: Rectangle): RTreeNode {
        let result: RTreeNode = this._root;
        while (!result.isLeaf()) {
            let minWeight = Number.MAX_VALUE;
            let minWeightIndex = 0;
            for (let i = 0; i < result.data.length; ++i) {
                const child = result.data[i];
                let weight = getOuterBoundingBoxWeight(child, point);
                if (minWeight > weight) {
                    minWeight = weight;
                    minWeightIndex = i;
                }
            }
            result = result.children[minWeightIndex];
        }

        return result;
    }

    public split(node: RTreeNode) {
        let dataNeedSpilt = [...node.data];
        let childrenNodeNeedSplit = node.children ? [...node.children] : undefined;
        node.data.length = 0;
        if (childrenNodeNeedSplit) {
            node.children.length = 0;
        }

        let maxWeight: number = 0;
        let farthestNodeIndex = undefined;
        for (let i = 0; i < dataNeedSpilt.length; ++i) {
            for (let j = i + 1; j < dataNeedSpilt.length; ++j) {
                let d1 = dataNeedSpilt[i];
                let d2 = dataNeedSpilt[j];
                let weight = getOuterBoundingBoxWeight(d1, d2);

                if (maxWeight < weight) {
                    maxWeight = weight;
                    farthestNodeIndex = [i, j];
                }
            }
        }

        let split = new RTreeNode();
        node.data.push(dataNeedSpilt[farthestNodeIndex[0]]);
        split.data.push(dataNeedSpilt[farthestNodeIndex[1]]);
        removeItemByIndex(dataNeedSpilt, ...farthestNodeIndex);
        if (childrenNodeNeedSplit) {
            node.children.push(childrenNodeNeedSplit[farthestNodeIndex[0]]);
            split.children.push(childrenNodeNeedSplit[farthestNodeIndex[1]]);
            removeItemByIndex(childrenNodeNeedSplit, ...farthestNodeIndex);
        }
        let boundingBoxL = node.data[0].clone();
        let boundingBoxR = split.data[0].clone();

        for (let i = 0; i < dataNeedSpilt.length; i++) {
            const d = dataNeedSpilt[i];
            let lWeight = getOuterBoundingBoxWeight(d, boundingBoxL);
            let rWeight = getOuterBoundingBoxWeight(d, boundingBoxR);
            if (lWeight < rWeight) {
                node.data.push(d);
                childrenNodeNeedSplit && node.children.push(childrenNodeNeedSplit[i]);
                getBoundingBox(boundingBoxL, d, boundingBoxL);
            } else {
                split.data.push(d);
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
            node.parent.data[index] = boundingBoxL;
            node.parent.addChild(split, boundingBoxR);
        }

        if (node.isLeaf()) {
            split.nextLeaf = node.nextLeaf;
            node.nextLeaf = split;
        }
    }

    public queryRect(rect: Rectangle, epsilon = 0.1e-3): [RTreeNode, number] | undefined {
        for (const leaf of this.traverseLeaf()) {
            for (let i = 0; i < leaf.data.length; i++) {
                const d = leaf.data[i];
                if (d.equal(rect, epsilon)) return [leaf, i];
                ++i;
            }
        }

        return undefined;
    }

    //#region Iterator
    public traverseLeaf() {
        return {
            [Symbol.iterator]() {
                let curr: RTreeNode = this._firstLeaf;
                return {
                    next: (): IteratorResult<RTreeNode> => {
                        if (curr) {
                            let result = {
                                value: curr,
                                done: false,
                            };
                            curr = curr.nextLeaf;
                            return result;
                        } else return {
                            value: undefined,
                            done: true,
                        };
                    },
                };

            },
        };
    }

    public [Symbol.iterator]() {
        let curr: RTreeNode = this._firstLeaf;
        let idx = 0;
        return {
            next: (): IteratorResult<Rectangle> => {
                if (curr) {
                    let result = {
                        value: curr.data[idx++],
                        done: false,
                    };
                    if (idx >= curr.data.length) {
                        curr = curr.nextLeaf;
                        idx = 0;
                    }
                    return result;
                } else return {
                    value: undefined,
                    done: true,
                };
            },
        };
    }

    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

function removeItemByIndex(arr: unknown[], ...indexes: number[]) {
    indexes.sort((a, b) => b - a);
    indexes.forEach(index => {
        if (index < 0 || index >= arr.length) {
            return;
        }

        arr[index] = arr[arr.length - 1];
        arr.pop();
    });
}