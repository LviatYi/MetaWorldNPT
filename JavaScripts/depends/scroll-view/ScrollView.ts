import IUnique from "../yoact/IUnique";
import YoactArray from "../yoact/YoactArray";
import IScrollViewItem from "./IScrollViewItem";
import { Delegate } from "../delegate/Delegate";
import GToolkit from "../../util/GToolkit";
import { AdvancedTweenTask } from "../waterween/tweenTask/AdvancedTweenTask";
import Waterween from "../waterween/Waterween";
import Easing from "../easing/Easing";
import ButtonTouchMethod = mw.ButtonTouchMethod;
import SimpleDelegate = Delegate.SimpleDelegate;
import UIService = mw.UIService;
import UIScript = mw.UIScript;

// export class Margin {
//     public top: number;
//     public right: number;
//     public bottom: number;
//     public left: number;
//
//     public constructor(all: number);
//     public constructor(vertical: number, horizontal: number);
//     public constructor(top: number, horizontal: number, bottom: number);
//     public constructor(top: number, right: number, bottom: number, left: number);
//     public constructor(val1: number, val2: number = undefined, val3: number = undefined, val4: number = undefined) {
//         if (val2 === undefined) {
//             return new Margin(val1, val1, val1, val1);
//         }
//         if (val3 === undefined) {
//             return new Margin(val1, val2, val1, val2);
//         }
//         if (val4 === undefined) {
//             return new Margin(val1, val2, val3, val2);
//         }
//
//         this.top = val1;
//         this.right = val2;
//         this.bottom = val3;
//         this.left = val4;
//     }
//
//     public toString() {
//         return `top: ${this.top}, right: ${this.right}, bottom: ${this.bottom}, left: ${this.left}`;
//     }
// }

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
 * @version 0.9.8a
 */
export default class ScrollView<
    D extends IUnique,
    UItem extends UIScript & IScrollViewItem<D>
> {
    private readonly _scrollBox: mw.ScrollBox;

    private readonly _container: mw.Canvas;

    private readonly _childSize: Vector2;

    private _offsetTask: AdvancedTweenTask<number> = null;

    private _currentSelectKey: number = null;

    /**
     * 数据主键 与 uiItem 的映射.
     * @private
     */
    private _uiMap: Map<number, UItem> = new Map<number, UItem>();

    /**
     * {@link _container} 中 uiItem 列表.
     * @desc 与视图顺序一致.
     * @desc mw.Canvas 无法获取子元素列表.
     * @private
     */
    private _children: UItem[] = [];

    /**
     * 定义外部对 IScrollViewItem 点击后的响应行为.
     * @desc (key:number)=>void
     * @desc   - key 点击 Item 对应的数据主键.
     * @desc         可为空. 空时表示取消任何选中.
     */
    public onItemSelect: SimpleDelegate<number> = new SimpleDelegate<number>();

    private i: number = 0;

    constructor(
        yoactArray: YoactArray<D>,
        uiItemConstr: { new(): UItem },
        scrollBox: mw.ScrollBox,
        container: mw.Canvas,
        useSmartLayoutStrategy: boolean = true,
    ) {
        this._scrollBox = scrollBox;
        this._container = container;

        if (useSmartLayoutStrategy) {
            const currentLayoutRule = container.autoLayoutRule;
            const padding = container.autoLayoutPadding;
            switch (this.orientation) {
                case mw.Orientation.OrientHorizontal:
                    if (padding.bottom > 0) {
                        GToolkit.warn(ScrollView, `检测正使用 padding.bottom.`);
                        GToolkit.warn(ScrollView, `在水平滑动的控件中使用此属性可能导致布局计算问题.`);
                        GToolkit.warn(ScrollView, `此 Bug 可能来自 UE 内部.`);
                        GToolkit.warn(ScrollView, `已智能覆写为 0.`);
                        GToolkit.warn(ScrollView, `如不需要智能覆写 请关闭 useSmartLayoutStrategy 选项.`);
                        padding.bottom = 0;
                    }
                    container.size.y = scrollBox.size.y;
                    container.autoLayoutRule = new mw.UILayout(
                        currentLayoutRule.layoutSpace,
                        padding,
                        UILayoutType.Vertical,
                        currentLayoutRule.layoutPacket,
                        new UIHugContent(UIHugContentHorizontally.HugContent, UIHugContentVertically.FixHeight),
                        true,
                        true,
                    );
                    break;
                case mw.Orientation.OrientVertical:
                    if (padding.right > 0) {
                        GToolkit.warn(ScrollView, `检测正使用 padding.right.`);
                        GToolkit.warn(ScrollView, `在垂直滑动的控件中使用此属性可能导致布局计算问题.`);
                        GToolkit.warn(ScrollView, `此 Bug 可能来自 UE 内部.`);
                        GToolkit.warn(ScrollView, `已智能覆写为 0.`);
                        GToolkit.warn(ScrollView, `如不需要智能覆写 请关闭 useSmartLayoutStrategy 选项.`);
                        padding.right = 0;
                    }
                    container.size.x = scrollBox.size.x;
                    container.autoLayoutRule = new mw.UILayout(
                        currentLayoutRule.layoutSpace,
                        padding,
                        UILayoutType.Horizontal,
                        currentLayoutRule.layoutPacket,
                        new UIHugContent(UIHugContentHorizontally.FixWidth, UIHugContentVertically.HugContent),
                        true,
                        true,
                    );
                    break;
            }
        }

        this._scrollBox.onScrollEnd.add(() => {
            if (!this._scrollBox.supportElastic) {
                this._scrollBox.supportElastic = true;
            }
        });

        const simulateItem = UIService.create(uiItemConstr);
        this._childSize = new mw.Vector2(simulateItem.uiObject.size.x, simulateItem.uiObject.size.y);
        simulateItem.destroy();

        yoactArray.onItemAdd.add((item) => {
            const uiItem = UIService.create(uiItemConstr);
            uiItem.bindData(yoactArray.getItem(item.key));
            if (item.index === -1) {
                this._children.push(uiItem);
            } else {
                this._children.splice(item.index, 0, uiItem);
            }
            this._uiMap.set(item.key, uiItem);
            this.innerInsertUiItem(uiItem, item.key, item.index);
        });
        yoactArray.onItemRemove.add((key) => {
            const uiItem = this._uiMap.get(key);
            this._container.removeChild(uiItem.uiObject);
            this._children.splice(this._children.indexOf(uiItem), 1);
            this._uiMap.delete(key);
        });

        yoactArray.refresh();
    }

    /**
     * 滚动方向.
     * @private
     */
    private get orientation(): mw.Orientation {
        return this._scrollBox.orientation;
    }

    /**
     * 获取单 数据行 容量.
     * @desc 数据行 指滑动方向上的一行.
     * @desc - 当滑动方向为水平时 为一列.
     * @desc - 当滑动方向为垂直时 为一行.
     * @private
     */
    private get lineCapacity(): number {
        switch (this.orientation) {
            case mw.Orientation.OrientHorizontal:
                return Math.floor(this._scrollBox.size.y / this._childSize.y);
            case mw.Orientation.OrientVertical:
                return Math.floor(this._scrollBox.size.x / this._childSize.x);
        }
    }

    /**
     * 获取指定数据项的 Ui 元素.
     * @param key
     */
    public getUiItem(key: number): UItem {
        return this._uiMap.get(key);
    }

    /**
     * 滑动到指定主键的 数据项.
     * @param key
     */
    public scrollToKey(key: number) {
        const uiItem = this._uiMap.get(key);
        if (!uiItem) return;

        const index = this._children.indexOf(uiItem);
        const line = Math.ceil(index / this.lineCapacity) - 1;

        let targetOffset: number;
        switch (this.orientation) {
            case mw.Orientation.OrientHorizontal:
                targetOffset =
                    this._container.autoLayoutRule.padding.left +
                    line * (this._childSize.x + this._container.autoLayoutRule.layoutSpace);
                break;
            case mw.Orientation.OrientVertical:
                targetOffset =
                    this._container.autoLayoutRule.padding.top
                    + line * (this._childSize.y + this._container.autoLayoutRule.layoutSpace);
                break;
        }
        this.addOffsetTask(targetOffset);
    }

    private innerInsertUiItem(uiItem: UItem, key: number, index: number = -1) {
        const ueWidget = GToolkit.getUePanelWidget(this._container);
        const children = ueWidget.GetAllChildren();
        if (index === -1 || index > children.Num()) {
            index = children.Num();
        }

        const tempChildrenUi: Widget[] = [];
        for (let i = children.Num() - 1; i >= index; --i) {
            tempChildrenUi.push(this._container.getChildAt(i));
            ueWidget.RemoveChildAt(i);
        }
        this.initScrollViewItem(uiItem, key);
        this._container.addChild(uiItem.uiObject);
        for (let i = tempChildrenUi.length - 1; i >= 0; --i) {
            this._container.addChild(tempChildrenUi[i]);
        }
    }

    /**
     * uiItem 自身初始化.
     * @param uiItem
     * @param key
     * @private
     */
    private initScrollViewItem(uiItem: UItem, key: number) {
        if (uiItem.clickObj) {
            uiItem.clickObj.onClicked.clear();
            uiItem.clickObj.onClicked.add(() => {
                this.onItemSelect.invoke(key);
                this._uiMap.get(this._currentSelectKey)?.onSetSelect(false);
                this._uiMap.get(key).onSetSelect(true);
                this._currentSelectKey = key;
            });
            uiItem.clickObj.touchMethod = ButtonTouchMethod.PreciseTap;
        }
    }

    private addOffsetTask(dist: number) {
        this.removeOffsetTask();
        this._scrollBox.supportElastic = false;
        this._offsetTask = Waterween.to(
            () => this._scrollBox.scrollOffset,
            (val) => this._scrollBox.scrollOffset = val,
            dist,
            0.2e3,
            undefined,
            Easing.cubicBezier(0.1, 0, 0.9, 1),
        ).autoDestroy(true);
    }

    private removeOffsetTask() {
        if (!this._offsetTask) return;
        Waterween.destroyTweenTask(this._offsetTask);
        this._offsetTask = null;
    }
}