import Rectangle from "../shape/Rectangle";
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

    public isLeaf(): boolean {
        return this.children === undefined;
    }

    public isRoot(): boolean {
        return this.parent === undefined;
    }

    public addBox(data: Rectangle) {
        this.boxes.push(data);
    }

    public addChild(c: RTreeNode, boundingBox: Rectangle) {
        if (!this.children) {
            this.children = [c];
        } else {
            this.children.push(c);
        }

        this.boxes.push(boundingBox);
        c.parent = this;
    }

    public findLeafHas(rect: Rectangle): RTreeNode | undefined {
        if (this.isLeaf()) {
            return this.boxes.includes(rect) ? this : undefined;
        } else {
            for (let i = 0; i < this.boxes.length; ++i) {
                let box = this.boxes[i];
                if (box.include(rect)) {
                    const result = this.children[i].findLeafHas(rect);
                    if (result) return result;
                }
            }
        }

        return undefined;
    }

    public removeChild(c: RTreeNode): boolean {
        const index = this.children?.indexOf(c) ?? -1;
        if (index < 0) return false;

        removeItemByIndex(this.children, index);
        removeItemByIndex(this.boxes, index);
        c.parent = undefined;

        if (this.children.length === 0) this.children = undefined;

        return true;
    }

    public mostLeftLeaf(): RTreeNode {
        let focus: RTreeNode = this;
        while (!focus.isLeaf()) {
            focus = focus.children[0];
        }
        return focus;
    }

    public mostRightLeaf(): RTreeNode {
        let focus: RTreeNode = this;
        while (!focus.isLeaf()) {
            focus = focus.children[focus.children.length];
        }
        return focus;
    }

    public getAllDataBox(): Rectangle[] {
        let result: Rectangle [] = [];
        let focus: RTreeNode [] = [this];

        while (focus.length > 0) {
            let current = focus.pop();
            if (current.isLeaf()) {
                result.push(...current.boxes);
            } else {
                focus.push(...current.children);
            }
        }

        return result;
    }

    public toIndentString(indent: number = 0): string {
        const indentStr = " ".repeat(2 * indent);
        let str = `${indentStr}${this.isLeaf() ? "leaf" : "children"}:\n`;
        str += this.boxes.map((rect, index) => {
            return `${indentStr + "  "}${rect.toString()}\n` +
                (this.children?.[index]?.toIndentString(indent + 1) ?? "");
        }).join("");

        return str;
    }
}
