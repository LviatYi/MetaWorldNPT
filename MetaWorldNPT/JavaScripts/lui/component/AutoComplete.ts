import Gtk, { Delegate, GtkTypes } from "gtoolkit";
import { Property } from "../style/Property";
import { Component, ComponentOption, extractLayoutFromOption, overrideOption } from "./Component";
import { ClickEvent } from "../event/ClickEvent";
import { InputFieldVariant, TextField } from "./TextField";
import { ChooseItemEvent } from "../event/ChooseItemEvent";
import { Lui } from "../style/Asset";
import Enumerable from "linq";
import Fuse, { FuseOptionKey, FuseSortFunctionArg } from "fuse.js";
import SimpleDelegate = Delegate.SimpleDelegate;
import ThemeColor = Lui.Asset.ThemeColor;
import ColorUtil = Lui.Asset.ColorUtil;
import Color = Lui.Asset.Color;
import NormalThemeColor = Lui.Asset.NormalThemeColor;

export interface AutoCompleteItem {
    label: string,
    group?: string
}

/**
 * AutoComplete.
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
export class AutoComplete<IT extends AutoCompleteItem> extends Component {
    public static readonly originIndex = Symbol("index");

    private _input: TextField;

    private _btnClear: mw.Button;

    private _scrContainer: mw.ScrollBox;

    private _cnvContainer: mw.Canvas;

    private _option: Required<AutoCompleteOption<IT>> = undefined;

    private _contentItems: AutoCompleteContentItem[] = [];

    private _contentItemsIndexer: Map<IT, number> = new Map();

    private _fuse: Fuse<IT>;

    private _standForIndex: number = -1;

    private _standForIndexInView: number = -1;

    private _hideScrTimer: number = undefined;

    private _currentInput: string = undefined;

    private _currentChoose: IT | undefined = undefined;

    public get label(): string {
        return this._option.label;
    }

    public get choose(): IT {
        return this._currentChoose;
    }

    public set choose(val: IT) {
        if (this._contentItems.some(item => item.label === val.label)) {
            this._input.setContent(val.label);
        }
    }

//#region Lui Component
    public static create<IT extends AutoCompleteItem>(option?: AutoCompleteOption<IT>): AutoComplete<IT> {
        let autoComplete = new AutoComplete<IT>();

        autoComplete.root.name="LuiAutoComplete";

        autoComplete._option = AutoComplete.defaultOption(option);

        autoComplete._input = TextField
            .create({
                ...autoComplete._option,
                zOrder: undefined,
            })
            .attach(autoComplete);

        autoComplete._btnClear = mw.Button.newObject(autoComplete.root, "btnClear");
        autoComplete._btnClear.normalImageGuid = Lui.Asset.ImgCross;
        Gtk.setUiSize(autoComplete._btnClear, 20, 20);
        autoComplete._btnClear.transitionEnable = false;
        autoComplete._btnClear.constraints = new mw.UIConstraintAnchors(
            mw.UIConstraintHorizontal.Right,
            mw.UIConstraintVertical.Center);
        autoComplete._btnClear.visibility = mw.SlateVisibility.Collapsed;
        autoComplete._btnClear.setNormalImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 0.5));

        autoComplete._scrContainer = mw.ScrollBox.newObject(autoComplete.root, "scrContainer");
        autoComplete._scrContainer.visibility = mw.SlateVisibility.Visible;
        autoComplete._scrContainer.alwaysShowScrollBar = true;
        autoComplete._scrContainer.scrollbarThickness = 5;
        autoComplete._scrContainer.scrollbarPadding = new mw.Margin(2, 8, 2, 0);
        autoComplete._scrContainer.supportElastic = true;
        autoComplete._scrContainer.animationType = mw.UIScrollBoxAnimationType.ElasticAnimation;
        Gtk.trySetVisibility(autoComplete._scrContainer, false);

        autoComplete._cnvContainer = mw.Canvas.newObject(autoComplete.root, "cnvContainer");
        autoComplete._scrContainer.addChild(autoComplete._cnvContainer);
        autoComplete._cnvContainer.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        autoComplete._cnvContainer.autoSizeVerticalEnable = true;
        autoComplete._cnvContainer.autoLayoutEnable = true;
        autoComplete._cnvContainer.autoLayoutContainerRule = mw.UILayoutType.Vertical;

        autoComplete.setItems();
        autoComplete.setLayout(autoComplete._option);
        autoComplete.setColor();

        autoComplete._btnClear.onClicked.add(() => {
            autoComplete._input.setContent("");
            autoComplete._currentChoose = undefined;
            autoComplete.onClear.invoke();
        });
        autoComplete._btnClear.onHovered.add(() => autoComplete._btnClear.setNormalImageColorByHex(
            ColorUtil.colorHexWithAlpha(Color.Black, 1)));
        autoComplete._btnClear.onUnhovered.add(() => autoComplete._btnClear.setNormalImageColorByHex(
            ColorUtil.colorHexWithAlpha(Color.Black, 0.5)));
        autoComplete._input.onFocus.add(() => {
            autoComplete.showScr();
        });
        autoComplete._input.onCommit.add((event) => {
            if (Gtk.isNullOrEmpty(autoComplete._input.text) || autoComplete._standForIndex === -1) {
                autoComplete._currentChoose = undefined;
                autoComplete.onClear.invoke();
            } else {
                autoComplete.chooseByIndex(autoComplete._standForIndex);
            }
            autoComplete.refreshScrHideTimer();
        });
        autoComplete._input.onChange.add((event) => {
            if (autoComplete._currentInput === event.text) return;
            autoComplete._currentInput = event.text;
            if (event.text === "") {
                Gtk.trySetVisibility(autoComplete._btnClear, false);
                autoComplete.resetItem();
            } else {
                Gtk.trySetVisibility(autoComplete._btnClear, true);
                autoComplete.filterItems(event.text);
            }
        });
        autoComplete._input.onKeyUp.add((event) => {
            switch (event.key) {
                case mw.Keys.Up:
                    autoComplete.listenToUp();
                    break;
                case mw.Keys.Down:
                    autoComplete.listenToDown();
                    break;
            }
        });

        return autoComplete;
    }

    public static defaultOption<T extends AutoCompleteItem>(option?: AutoCompleteOption<T>)
        : Required<AutoCompleteOption<T>> {
        if (!option) option = {};

        if (!option.label) option.label = "input";
        if (!option.size) option.size = {x: 240, y: 60};
        if (!option.padding) option.padding = {};
        if (!option.color) option.color = NormalThemeColor;
        if (!option.itemHeight) option.itemHeight = 40;
        if (!option.maxCount) option.maxCount = 6;
        if (!option.fontSize) option.fontSize = 14;
        if (!option.fontStyle) option.fontStyle = mw.UIFontGlyph.Light;
        if (!option.iconAlign) option.iconAlign = "left";
        if (!option.variant) option.variant = "filled";
        if (!option.corner) option.corner = Property.Corner.Bottom;

        return option as Required<AutoCompleteOption<T>>;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 重载列表.
     * @param items
     */
    public reloadItems(items?: IT[]): this {
        if (items) this._option.items = items;

        for (let contentItem of this._contentItems) {
            contentItem.root.destroyObject();
        }

        this._contentItems.length = 0;
        this._contentItemsIndexer.clear();
        this._standForIndex = -1;
        this._standForIndexInView = -1;

        this.setItems();

        let [[x, y],
            [pt, pr, pb, pl],
            [contentX, contentY],
        ] = extractLayoutFromOption(this._option);
        Gtk.setUiSize(this._scrContainer,
            contentX,
            this._option.itemHeight * Math.min(this._contentItems.length, this._option.maxCount));

        return this;
    }

//#region Init
    public setLayout(option: AutoCompleteOption<IT>): this {
        overrideOption(this._option, option);
        super.setLayout(this._option);
        let [
            [x, y],
            [pt, pr, pb, pl],
            [contentX, contentY],
        ] = extractLayoutFromOption(this._option);

        Gtk.setUiSize(this._scrContainer,
            contentX,
            this._option.itemHeight * Math.min(this._contentItems.length, this._option.maxCount));
        Gtk.setUiPosition(this._scrContainer, pl, this._input.root.size.y);
        Gtk.setUiSizeX(this._cnvContainer, contentX);
        Gtk.setUiPosition(this._btnClear, x - pr - 30, pt + (contentY - 20) / 2);

        return this;
    }

    private setColor(): this {
        this._scrContainer.scrollAxisColor = mw.LinearColor.colorHexToLinearColor(this._option.color.primary);

        return this;
    }

    private setItems(): this {
        const itemsByGroup = Enumerable.from(this._option.items)
            .groupBy(
                item => item.group,
                (item) => item,
                (key, element) => {
                    return {
                        key,
                        items: element.orderBy(
                            item => item.label,
                            (first, second) => {
                                if (first == undefined) return -1;
                                if (second == undefined) return 1;
                                return first?.localeCompare(second) ?? -1;
                            }),
                    };
                },
            )
            .orderBy(item => item.key, (first, second) => {
                if (first == undefined) return -1;
                if (second == undefined) return 1;
                return first?.localeCompare(second) ?? -1;
            });

        const width = this._option.size.x - (this._option.padding.left ?? 0) - (this._option.padding.right ?? 0);
        let i = 0;
        for (const item of itemsByGroup) {
            let groupName = item.key;
            if (!Gtk.isNullOrEmpty(groupName)) {
                this._contentItems.push(AutoCompleteContentItem.create({
                    label: item.key,
                    size: {x: width, y: this._option.itemHeight},
                    padding: {top: 0, right: 0, bottom: 0, left: 0},
                    color: this._option.color,
                    fontSize: this._option.fontSize,
                    fontStyle: this._option.fontStyle,
                    variant: "tag",
                } as AutoCompleteContentItemOption)
                    .attach(this._cnvContainer));
                ++i;
            }

            for (const it of item.items) {
                const content = AutoCompleteContentItem.create({
                    label: it.label,
                    size: {x: width, y: this._option.itemHeight},
                    padding: {top: 0, right: 0, bottom: 0, left: 0},
                    color: this._option.color,
                    fontSize: this._option.fontSize,
                    fontStyle: this._option.fontStyle,
                    icon: this._option.iconRenderer ? this._option.iconRenderer(it) : undefined,
                    iconAlign: this._option.iconAlign,
                    variant: "item",
                } as AutoCompleteContentItemOption)
                    .attach(this._cnvContainer);
                let currentIndex = i;
                content.onHover.add(() => {
                    this.standForByIndex(currentIndex, content);
                });
                content.onClick.add(() => {
                    this.hideScr();
                    this.chooseByIndex(currentIndex);
                });
                this._contentItemsIndexer.set(it, currentIndex);

                this._contentItems.push(content);
                ++i;
            }
        }

        let fuseKeys: FuseOptionKey<IT>[] = [
            {name: "label", getFn: (item: IT) => item.label},
            {name: "group", getFn: (item: IT) => item.group},
        ];
        if (this._option.additionKey) {
            fuseKeys.push(...this._option.additionKey);
        }
        this._fuse = new Fuse(this._option.items, {
            keys: fuseKeys,
            includeScore: true,
            threshold: 0.4,
            ignoreLocation: true,
            findAllMatches: true,
            shouldSort: true,
            sortFn: this._option.fuseSortFunction ?? undefined,
        });
        if (this._option.items.length > 0) {
            this.standForByViewIndex(0);
        }

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private filterItems(content: string) {
        let results = Enumerable.from(this._fuse.search(content))
            .select(result => this._contentItems[this._contentItemsIndexer.get(result.item)])
            .toArray();

        Gtk.getUiChildren(this._cnvContainer).forEach(child => child.removeObject());
        this._standForIndexInView = -1;
        for (let result of results) {
            this._cnvContainer.addChild(result.root);
        }

        if (results.length > 0) {
            this.standForByViewIndex(0);
        }
    }

    private resetItem() {
        Gtk.getUiChildren(this._cnvContainer).forEach(child => child.removeObject());
        this._standForIndexInView = -1;
        for (const content of this._contentItems) {
            this._cnvContainer.addChild(content.root);
        }

        if (this._contentItems.length > 0) {
            this.standForByViewIndex(0);
        }

        this._scrContainer.scrollOffset = 0;
    }

    private clearScrHideTimer() {
        if (this._hideScrTimer) {
            mw.clearTimeout(this._hideScrTimer);
            this._hideScrTimer = undefined;
        }
    }

    private refreshScrHideTimer() {
        if (this._hideScrTimer) {
            mw.clearTimeout(this._hideScrTimer);
        }

        this._hideScrTimer = mw.setTimeout(() => {
                this.hideScr();
            },
            GtkTypes.Interval.Hz30 * 3);
    }

    private standForByViewIndex(index: number) {
        const viewItem = this._cnvContainer.getChildAt(index);
        if (this._standForIndex !== -1) {
            // 存在 stand-for
            if (this._standForIndexInView === -1) {
                // 视图刷新而InView 失效.
                if (viewItem === this._contentItems[this._standForIndex].root) {
                    // 新选与原有一致.
                    this._standForIndexInView = index;
                    return;
                }
            } else if (this._standForIndexInView === index) {
                // InView 有效.
                // 新选与原有一致.
                return;
            }
        }

        this._standForIndexInView = index;
        if (this._standForIndex !== -1) this._contentItems[this._standForIndex].unsetHighlight();
        this._standForIndex = this._contentItems.findIndex(item => item.root === viewItem);
        this._contentItems[this._standForIndex].setHighlight();
    }

    private standForByIndex(index: number, content?: AutoCompleteContentItem) {
        if (this._standForIndex === index) return;
        if (this._standForIndex !== -1) this._contentItems[this._standForIndex].unsetHighlight();

        this._standForIndex = index;
        content = content ?? this._contentItems[index];
        this._standForIndexInView = Gtk.getUiChildren(this._cnvContainer).indexOf(content.root);
        content.setHighlight();
    }

    private chooseByIndex(index: number) {
        this._input.setContent(this._contentItems[index].label);
        if (this._hideScrTimer) {
            this.clearScrHideTimer();
            this.hideScr();
        }

        this._currentChoose = this._option.items
                .find(item => this._contentItemsIndexer.get(item) === index)
            ?? undefined;

        this.onChoose.invoke({item: this._currentChoose});
    }

    private showScr() {
        this.clearScrHideTimer();
        Gtk.trySetVisibility(this._scrContainer, true);
    }

    private hideScr() {
        Gtk.trySetVisibility(this._scrContainer, false);
    }

    private listenToUp = () => {
        let index = this._standForIndexInView - 1;
        while (index >= 0) {
            const ui = this._cnvContainer.getChildAt(index);
            if (!this._contentItems.find(item => item.root === ui).isTag) {
                break;
            }
            index--;
        }

        if (index < 0) return;
        this.standForByViewIndex(index);
        this.checkScrContain(index);
    };

    private listenToDown = () => {
        let index = this._standForIndexInView + 1;
        const maxCount = this._cnvContainer.getChildrenCount();
        while (index < maxCount) {
            const ui = this._cnvContainer.getChildAt(index);
            if (!this._contentItems.find(item => item.root === ui).isTag) {
                break;
            }
            index++;
        }

        if (index >= maxCount) return;

        this.standForByViewIndex(index);
        this.checkScrContain(index);
    };

    private checkScrContain(indexInView: number) {
        let before = Math.ceil(this._scrContainer.scrollOffset / this._option.itemHeight);
        let after = before + this._option.maxCount;

        if (indexInView < before) {
            this._scrContainer.scrollOffset = (indexInView - Math.min(this._option.maxCount, 1)) * this._option.itemHeight;
        } else if (indexInView >= after) {
            this._scrContainer.scrollOffset = (indexInView - Math.max(this._option.maxCount - 2, 0)) * this._option.itemHeight;
        }
    }

//#region CallBack
    public onClick: SimpleDelegate<ClickEvent> = new SimpleDelegate();

    public onChoose: SimpleDelegate<ChooseItemEvent<IT>> = new SimpleDelegate();

    public onClear: SimpleDelegate = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export interface AutoCompleteOption<IT extends AutoCompleteItem> extends ComponentOption {
    label?: string;

    items?: IT[];

    color?: ThemeColor;

    itemHeight?: number;

    maxCount?: number;

    fontSize?: number;

    fontStyle?: Property.FontStyle;

    iconRenderer?: (item: IT) => Component;

    iconAlign?: "left" | "right";

    additionKey?: FuseOptionKey<IT>[];

    fuseSortFunction?: (
        a: FuseSortFunctionArg,
        b: FuseSortFunctionArg,
    ) => number;

    variant?: InputFieldVariant;

    corner?: Property.Corner;
}

class AutoCompleteContentItem extends Component {
    private _imgItemBg: mw.Image;

    private _btnItem: mw.Button;

    private _imgHighlight: mw.Image;

    private _cnvItemLabel: mw.Canvas;

    private _txtItem: mw.TextBlock;

    private _icon: Component;

    private _option: Readonly<Required<AutoCompleteContentItemOption>> = undefined;

    public get label(): string {
        return this._option.label;
    }

    public get isTag(): boolean {
        return this._option.variant === "tag";
    }

    public static create(option?: AutoCompleteContentItemOption): AutoCompleteContentItem {
        let autoCompleteItem = new AutoCompleteContentItem();

        autoCompleteItem.root.name="LuiAutoCompleteContentItem";

        autoCompleteItem._option = option as Required<AutoCompleteContentItemOption>;

        autoCompleteItem._imgItemBg = mw.Image.newObject(autoCompleteItem.root);
        Gtk.trySetVisibility(autoCompleteItem._imgItemBg, true);
        autoCompleteItem._imgItemBg.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        autoCompleteItem._imgItemBg.imageGuid = Lui.Asset.ImgRectangle;
        autoCompleteItem._imgItemBg.imageDrawType = mw.SlateBrushDrawType.Image;

        autoCompleteItem._btnItem = mw.Button.newObject(autoCompleteItem.root);
        Gtk.trySetVisibility(autoCompleteItem._btnItem, true);
        autoCompleteItem._btnItem.normalImageDrawType = mw.SlateBrushDrawType.NoDrawType;
        autoCompleteItem._btnItem.clickMethod = mw.ButtonClickMethod.PreciseClick;
        autoCompleteItem._btnItem.pressedMethod = mw.ButtonPressMethod.DownAndUp;
        autoCompleteItem._btnItem.touchMethod = mw.ButtonTouchMethod.PreciseTap;

        autoCompleteItem._imgHighlight = mw.Image.newObject(autoCompleteItem.root);
        Gtk.trySetVisibility(autoCompleteItem._imgHighlight, true);
        autoCompleteItem._imgHighlight.imageGuid = Lui.Asset.ImgRectangle;
        autoCompleteItem._imgHighlight.imageDrawType = mw.SlateBrushDrawType.Image;
        autoCompleteItem._imgHighlight.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 0.25));
        autoCompleteItem._imgHighlight.renderOpacity = 0;

        autoCompleteItem._cnvItemLabel = mw.Canvas.newObject(autoCompleteItem.root);
        Gtk.trySetVisibility(autoCompleteItem._cnvItemLabel, true);

        autoCompleteItem._txtItem = mw.TextBlock.newObject(autoCompleteItem._cnvItemLabel);
        Gtk.trySetVisibility(autoCompleteItem._txtItem, true);
        autoCompleteItem._txtItem.autoAdjust = false;
        autoCompleteItem._txtItem.fontSize = autoCompleteItem._option.fontSize;
        autoCompleteItem._txtItem.glyph = autoCompleteItem._option.fontStyle;
        autoCompleteItem._txtItem.textHorizontalLayout = mw.UITextHorizontalLayout.Clipping;
        autoCompleteItem._txtItem.textAlign = mw.TextJustify.Left;
        autoCompleteItem._txtItem.textVerticalAlign = mw.TextVerticalJustify.Center;
        Gtk.trySetText(autoCompleteItem._txtItem, autoCompleteItem._option.label);

        if (autoCompleteItem._option.icon) {
            autoCompleteItem._icon = autoCompleteItem._option.icon;
            autoCompleteItem._icon.attach(autoCompleteItem._cnvItemLabel);
        }

        autoCompleteItem.setLayout(autoCompleteItem._option);
        autoCompleteItem.setColor();

        autoCompleteItem._btnItem.onHovered.add(() => autoCompleteItem.onHover.invoke());
        autoCompleteItem._btnItem.onUnhovered.add(() => autoCompleteItem.onMouseLeft.invoke());
        autoCompleteItem._btnItem.onClicked.add(() => {
            const clickAt = mw.absoluteToLocal(
                autoCompleteItem.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            autoCompleteItem.onClick.invoke({position: clickAt});
        });

        return autoCompleteItem;
    }

    protected destroy(): void {
    }

    public setLayout(option: AutoCompleteContentItemOption): this {
        overrideOption(this._option, option);
        super.setLayout(this._option);
        let [[x, y],
            [pt, pr, pb, pl],
            [contentX, contentY],
        ] = extractLayoutFromOption(this._option);

        Gtk.setUiPosition(this._imgItemBg, pl, pt);
        Gtk.setUiSize(this._imgItemBg, contentX, contentY);
        Gtk.setUiPosition(this._btnItem, pl, pt);
        Gtk.setUiSize(this._btnItem, contentX, contentY);
        Gtk.setUiPosition(this._imgHighlight, pl, pt);
        Gtk.setUiSize(this._imgHighlight, contentX, contentY);
        Gtk.setUiPosition(this._cnvItemLabel, pl, pt);
        Gtk.setUiSize(this._cnvItemLabel, contentX, contentY);
        if (!this._icon || this._option.iconAlign === "right") {
            const labelPadding = this._option.variant === "item" ? 30 : 10;
            Gtk.setUiPosition(this._txtItem, pl + labelPadding, pt);
            Gtk.setUiSize(this._txtItem, contentX - labelPadding, contentY);
        } else {
            Gtk.setUiPosition(this._txtItem,
                pl + this._icon.root.size.x + 5,
                pt);
            Gtk.setUiSize(this._txtItem,
                contentX - pl - pr - this._icon.root.size.x,
                contentY);
        }

        if (this._icon) {
            if (this._option.iconAlign === "left") {
                Gtk.setUiPosition(this._icon.root,
                    pl + 30,
                    pt + (contentY - this._icon.root.size.y) / 2);
            } else {
                Gtk.setUiPosition(this._icon.root,
                    pl + contentX - this._icon.root.size.x - 30,
                    pt + (contentY - this._icon.root.size.y) / 2);
            }
        }

        return this;
    }

    private setColor(): this {
        if (this._option.variant === "item") {
            this._txtItem.setFontColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 1));
            this._imgItemBg.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Gray100, 1));
        } else {
            this._txtItem.setFontColorByHex(ColorUtil.colorHexWithAlpha(this._option.color.primary, 1));
            this._imgItemBg.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Gray300, 1));
        }

        return this;
    }

    public setHighlight() {
        if (this._imgHighlight.renderOpacity !== 1) {
            this._imgHighlight.renderOpacity = 1;
        }
    }

    public unsetHighlight() {
        if (this._imgHighlight.renderOpacity !== 0) {
            this._imgHighlight.renderOpacity = 0;
        }
    }

//#region CallBack
    public onClick: Delegate.SimpleDelegate<ClickEvent> = new Delegate.SimpleDelegate();

    public onHover: Delegate.SimpleDelegate<void> = new Delegate.SimpleDelegate();

    public onMouseLeft: Delegate.SimpleDelegate<void> = new Delegate.SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

type AutoCompleteContentItemVariant = "tag" | "item"

interface AutoCompleteContentItemOption extends ComponentOption {
    label: string;

    color: ThemeColor;

    fontSize: number;

    fontStyle: Property.FontStyle;

    icon?: Component;

    iconAlign?: "left" | "right";

    variant: AutoCompleteContentItemVariant;
}
