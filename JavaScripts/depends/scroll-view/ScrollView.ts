import IUnique from "../yoact/IUnique";
import YoactArray from "../yoact/YoactArray";

export interface IBindView<U extends UIScript> {
    bindView(ui: U): void;
}

export class Margin {
    public top: number;
    public right: number;
    public bottom: number;
    public left: number;

    public constructor(all: number);
    public constructor(vertical: number, horizontal: number);
    public constructor(top: number, horizontal: number, bottom: number);
    public constructor(top: number, right: number, bottom: number, left: number);
    public constructor(val1: number, val2: number = undefined, val3: number = undefined, val4: number = undefined) {
        if (val2 === undefined) {
            return new Margin(val1, val1, val1, val1);
        }
        if (val3 === undefined) {
            return new Margin(val1, val2, val1, val2);
        }
        if (val4 === undefined) {
            return new Margin(val1, val2, val3, val2);
        }

        this.top = val1;
        this.right = val2;
        this.bottom = val3;
        this.left = val4;
    }

    public toString() {
        return `top: ${this.top}, right: ${this.right}, bottom: ${this.bottom}, left: ${this.left}`;
    }
}

/**
 * 滚动列表.
 * 基于 YoactArray 的响应式视图.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 0.8.2a
 */
export default class ScrollView<T extends IUnique & IBindView<US>, US extends UIScript> {
    private readonly _container: mw.Canvas;

    private _uiMap: Map<number, US> = new Map<number, US>();

    constructor(
        yoactArray: YoactArray<T>,
        uiItem: { new(): US },
        container: mw.Canvas,
    ) {
        this._container = container;

        yoactArray.onItemAdd.add((item) => {
            const uis = UIService.create(uiItem);
            yoactArray.getItem(item.key).bindView(uis);
            this._uiMap.set(item.key, uis);
            this.innerInsertUiItem(uis, item.index);
        });
        yoactArray.onItemRemove.add((key) => {
            const uis = this._uiMap.get(key);
            this._container.removeChild(uis.uiObject);
        });

        yoactArray.refresh();
    }

    /**
     * 获取指定数据项的 Ui 元素.
     * @param key
     */
    public getUiItem(key: number): US {
        return this._uiMap.get(key);
    }

    private innerInsertUiItem(uis: US, index: number = -1) {
        const ueWidget = (this._container["get"]() as UE.PanelWidget);
        const children = ueWidget.GetAllChildren();
        if (index === -1 || index > children.Num()) {
            index = children.Num();
        }
        const tempChildrenUi: Widget[] = [];
        for (let i = children.Num() - 1; i >= index; --i) {
            tempChildrenUi.push(this._container.getChildAt(i));
            ueWidget.RemoveChildAt(i);
        }
        this._container.addChild(uis.uiObject);
        for (let i = tempChildrenUi.length - 1; i >= 0; --i) {
            this._container.addChild(tempChildrenUi[i]);
        }
    }
}