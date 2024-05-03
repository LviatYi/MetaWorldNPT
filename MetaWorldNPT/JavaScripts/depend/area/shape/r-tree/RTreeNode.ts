import Rectangle from "./Rectangle.js";
import { removeItemByIndex } from "./util/Util.js";

/**
 * RTree Node.
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
export default class RTreeNode {
    public parent: RTreeNode = undefined;

    public children: RTreeNode[] = undefined;

    public boxes: Rectangle[] = [];

    public nextLeaf: RTreeNode = undefined;

    public prevLeaf: RTreeNode = undefined;

    public isLeaf(): boolean {
        return this.children === undefined;
    }

    public isRoot(): boolean {
        return this.parent === undefined;
    }

    public insert(data: Rectangle) {
        this.boxes.push(data);
    }

    public addChild(c: RTreeNode, boundingBox: Rectangle) {
        if (!this.children) this.children = [];
        this.children.push(c);
        this.boxes.push(boundingBox);
        c.parent = this;
    }

    public removeChild(c: RTreeNode): boolean {
        if (!this.children) return false;

        const index = this.children.findIndex(child => child === c);
        if (index < 0) return false;
        removeItemByIndex(this.children, index);
        removeItemByIndex(this.boxes, index);
        c.parent = undefined;

        if (c.isLeaf()) {
            if (c.prevLeaf) c.prevLeaf.nextLeaf = c.nextLeaf;
            if (c.nextLeaf) c.nextLeaf.prevLeaf = c.prevLeaf;
            c.prevLeaf = undefined;
            c.nextLeaf = undefined;
        }

        return true;
    }

    public removeBoxesAt(index: number): boolean {
        if (index < 0 || index >= this.boxes.length) return false;
        if (!this.isLeaf()) return false;

        removeItemByIndex(this.boxes, index);
        return true;
    }

    public getAllDataBox(): Rectangle[] {
        let result: Rectangle [] = [];
        let focus: RTreeNode = this;

        while (!focus.isLeaf()) {
            focus = focus.children[0];
        }

        while (focus) {
            result.push(...focus.boxes);
            focus = focus.nextLeaf;
        }

        return result;
    }
}
