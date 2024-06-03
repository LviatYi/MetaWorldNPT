import Gtk, { Delegate, GtkTypes } from "../../util/GToolkit";
import ThemeColor, { Color, ColorUtil, NormalThemeColor } from "../Theme";
import { Property } from "../Style";
import { Component } from "./Component";
import { ClickEvent } from "../event/ClickEvent";
import TextField, { InputFieldVariant } from "./TextField";
import { ChooseItemEvent } from "../event/ChooseItemEvent";
import { Lui } from "../Asset";
import Enumerable from "linq";
import Fuse, { FuseOptionKey, FuseSortFunctionArg } from "fuse.js";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import SimpleDelegate = Delegate.SimpleDelegate;

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

    private _option: Readonly<Required<AutoCompleteOption<IT>>> = undefined;

    private _contentItems: AutoCompleteContentItem[] = [];

    private _contentItemsIndexer: Map<IT, number> = new Map();

    private _fuse: Fuse<IT>;

    private _standForIndex: number = -1;

    private _standForIndexInView: number = -1;

    private _hideScrTimer: number = undefined;

    private _currentInput: string = undefined;

    public get label(): string {
        return this._option.label;
    }

//#region Lui Component
    public static create<IT extends AutoCompleteItem>(option?: AutoCompleteOption<IT>): AutoComplete<IT> {
        let autoComplete = new AutoComplete<IT>();

        autoComplete._option = AutoComplete.defaultOption(option);
        autoComplete.initRoot();

        autoComplete._input = TextField
            .create(autoComplete._option)
            .attach(autoComplete.root);

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

        autoComplete.setSize();
        autoComplete.setColor();
        autoComplete.setItems();

        autoComplete._btnClear.onClicked.add(() => autoComplete._input.setContent(""));
        autoComplete._btnClear.onHovered.add(() => autoComplete._btnClear.setNormalImageColorByHex(
            ColorUtil.colorHexWithAlpha(Color.Black, 1)));
        autoComplete._btnClear.onUnhovered.add(() => autoComplete._btnClear.setNormalImageColorByHex(
            ColorUtil.colorHexWithAlpha(Color.Black, 0.5)));
        autoComplete._input.onFocus.add(() => {
            autoComplete.showScr();
        });
        autoComplete._input.onCommit.add((event) => {
            autoComplete.chooseByIndex();
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
    };

    public static defaultOption<T extends AutoCompleteItem>(option?: AutoCompleteOption<T>): Required<AutoCompleteOption<T>> {
        if (!option) option = {};

        if (!option.label) option.label = "input";
        if (!option.size) option.size = {x: 240, y: 60};
        if (!option.padding) option.padding = {};
        if (!option.color) option.color = NormalThemeColor;
        if (!option.itemHeight) option.itemHeight = 40;
        if (!option.maxCount) option.maxCount = 6;
        if (!option.fontSize) option.fontSize = 14;
        if (!option.fontStyle) option.fontStyle = mw.UIFontGlyph.Light;
        if (!option.variant) option.variant = "filled";

        return option as Required<AutoCompleteOption<T>>;
    };

    protected destroy(): void {
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Init
    private setSize(): this {
        let [x, y] = [this._option.size.x, this._option.size.y];
        let [pt, pr, pb, pl] = [
            this._option.padding.top ?? 0,
            this._option.padding.right ?? 0,
            this._option.padding.bottom ?? 0,
            this._option.padding.left ?? 0,
        ];

        Gtk.setUiSize(this.root, x, y);

        let [contentX, contentY] = [
            x - pl - pr,
            y - pt - pb];

        Gtk.setUiSize(this._scrContainer,
            contentX,
            this._option.itemHeight * Math.min(this._option.items.length, this._option.maxCount));
        Gtk.setUiPosition(this._scrContainer, pl, this._input.root.size.y);
        Gtk.setUiSizeX(this._cnvContainer, contentX);
        Gtk.setUiPosition(this._cnvContainer, 0, 0);
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
                                if (first === undefined) return -1;
                                if (second === undefined) return 1;
                                return first.localeCompare(second);
                            }),
                    };
                },
            )
            .orderBy(item => item.key, (first, second) => {
                if (first === undefined) return -1;
                if (second === undefined) return 1;
                return first.localeCompare(second);
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
                    variant: "item",
                } as AutoCompleteContentItemOption)
                    .attach(this._cnvContainer);
                let currentIndex = i;
                content.onHover.add(() => {
                    this.standForByIndex(currentIndex, content);
                });
                content.onClick.add((event) => {
                    this.hideScr();
                    this.chooseByIndex(currentIndex);
                });
                this._contentItemsIndexer.set(it, currentIndex);

                this._contentItems.push(content);
                ++i;
            }
        }

        this._fuse = new Fuse(this._option.items, {
            keys: this._option.fuseOption ?? [
                {name: "label", getFn: (item: IT) => item.label},
                {name: "group", getFn: (item: IT) => item.group},
            ],
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
        Log4Ts.log(AutoComplete, `get result.`);
        let results = Enumerable.from(this._fuse.search(content))
            .doAction(item => {
                Log4Ts.log(undefined,
                    `score: ${item.score}`,
                    `info: ${item.item.label}-${item.item.group}`);
            })
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

    private chooseByIndex(index?: number) {
        if (!index) index = this._standForIndex;
        if (index < 0) return;

        this._input.setContent(this._contentItems[index].label);
        if (this._hideScrTimer) {
            this.clearScrHideTimer();
            this.hideScr();
        }
        this.onChoose.invoke({
            item: this._option.items.find(item => this._contentItemsIndexer.get(item) === index),
        });
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
        Log4Ts.log(AutoComplete, `current index in view: ${indexInView}`);
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

    public onChoose: SimpleDelegate<ChooseItemEvent> = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export interface AutoCompleteOption<IT extends AutoCompleteItem> {
    label?: string;

    items?: IT[];

    size?: { x: number, y: number };

    padding?: Property.Padding;

    color?: ThemeColor;

    itemHeight?: number;

    maxCount?: number;

    fontSize?: number;

    fontStyle?: Property.FontStyle;

    variant?: InputFieldVariant;

    renderOption?: (item: IT) => mw.Widget;

    fuseOption?: FuseOptionKey<IT>[];

    fuseSortFunction?: (
        a: FuseSortFunctionArg,
        b: FuseSortFunctionArg,
    ) => number;
}

class AutoCompleteContentItem extends Component {
    private _imgItemBg: mw.Image;

    private _btnItem: mw.Button;

    private _imgHighlight: mw.Image;

    private _cnvItemLabel: mw.Canvas;

    private _txtItem: mw.TextBlock;

    private _option: Readonly<Required<AutoCompleteContentItemOption>> = undefined;

    public get label(): string {
        return this._option.label;
    }

    public get isTag(): boolean {
        return this._option.variant === "tag";
    }

    public static create(option?: AutoCompleteContentItemOption): AutoCompleteContentItem {
        let autoCompleteItem = new AutoCompleteContentItem();

        autoCompleteItem._option = option;
        autoCompleteItem.initRoot();

        autoCompleteItem._imgItemBg = mw.Image.newObject(autoCompleteItem.root);
        autoCompleteItem._imgItemBg.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        autoCompleteItem._imgItemBg.imageGuid = Lui.Asset.ImgRectangle;
        autoCompleteItem._imgItemBg.imageDrawType = mw.SlateBrushDrawType.Image;

        autoCompleteItem._btnItem = mw.Button.newObject(autoCompleteItem.root);
        autoCompleteItem._btnItem.visibility = autoCompleteItem._option.variant === "item" ?
            mw.SlateVisibility.Visible :
            mw.SlateVisibility.Collapsed;
        autoCompleteItem._btnItem.normalImageDrawType = mw.SlateBrushDrawType.NoDrawType;
        autoCompleteItem._btnItem.clickMethod = mw.ButtonClickMethod.PreciseClick;
        autoCompleteItem._btnItem.pressedMethod = mw.ButtonPressMethod.DownAndUp;
        autoCompleteItem._btnItem.touchMethod = mw.ButtonTouchMethod.PreciseTap;

        autoCompleteItem._imgHighlight = mw.Image.newObject(autoCompleteItem.root);
        autoCompleteItem._imgHighlight.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        autoCompleteItem._imgHighlight.imageGuid = Lui.Asset.ImgRectangle;
        autoCompleteItem._imgHighlight.imageDrawType = mw.SlateBrushDrawType.Image;
        autoCompleteItem._imgHighlight.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 0.25));
        autoCompleteItem._imgHighlight.renderOpacity = 0;

        autoCompleteItem._cnvItemLabel = mw.Canvas.newObject(autoCompleteItem.root);
        autoCompleteItem._cnvItemLabel.visibility = mw.SlateVisibility.SelfHitTestInvisible;

        autoCompleteItem._txtItem = mw.TextBlock.newObject(autoCompleteItem.root);
        autoCompleteItem._txtItem.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        autoCompleteItem._txtItem.autoAdjust = false;
        autoCompleteItem._txtItem.fontSize = autoCompleteItem._option.fontSize;
        autoCompleteItem._txtItem.glyph = autoCompleteItem._option.fontStyle;
        autoCompleteItem._txtItem.textHorizontalLayout = mw.UITextHorizontalLayout.Clipping;
        autoCompleteItem._txtItem.textAlign = mw.TextJustify.Left;
        autoCompleteItem._txtItem.textVerticalAlign = mw.TextVerticalJustify.Center;
        Gtk.trySetText(autoCompleteItem._txtItem, autoCompleteItem._option.label);

        autoCompleteItem.setSize();
        autoCompleteItem.setColor();
        autoCompleteItem.setItems();

        autoCompleteItem._btnItem.onHovered.add(() => autoCompleteItem.onHover.invoke());
        autoCompleteItem._btnItem.onUnhovered.add(() => autoCompleteItem.onMouseLeft.invoke());
        autoCompleteItem._btnItem.onClicked.add(() => {
            const clickAt = mw.absoluteToLocal(
                autoCompleteItem.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            autoCompleteItem.onClick.invoke({position: clickAt});
        });

        return autoCompleteItem;
    };

    protected destroy(): void {
    }

    private setSize(): this {
        let [x, y] = [this._option.size.x, this._option.size.y];
        let [pt, pr, pb, pl] = [
            this._option.padding.top ?? 0,
            this._option.padding.right ?? 0,
            this._option.padding.bottom ?? 0,
            this._option.padding.left ?? 0,
        ];

        Gtk.setUiSize(this.root, x, y);

        let [contentX, contentY] = [
            x - pl - pr,
            y - pt - pb];

        Gtk.setUiPosition(this._imgItemBg, pl, pt);
        Gtk.setUiSize(this._imgItemBg, contentX, contentY);
        Gtk.setUiPosition(this._btnItem, pl, pt);
        Gtk.setUiSize(this._btnItem, contentX, contentY);
        Gtk.setUiPosition(this._imgHighlight, pl, pt);
        Gtk.setUiSize(this._imgHighlight, contentX, contentY);
        Gtk.setUiPosition(this._cnvItemLabel, pl, pt);
        Gtk.setUiSize(this._cnvItemLabel, contentX, contentY);
        const labelPadding = this._option.variant === "item" ? 30 : 10;
        Gtk.setUiPosition(this._txtItem, pl + labelPadding, pt);
        Gtk.setUiSize(this._txtItem, contentX - labelPadding, contentY);

        return this;
    }

    private setColor(): this {
        if (this._option.variant === "item") {
            this._txtItem.setFontColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 1));
            this._imgItemBg.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.White, 1));
        } else {
            this._txtItem.setFontColorByHex(ColorUtil.colorHexWithAlpha(this._option.color.primary, 1));
            this._imgItemBg.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Gray300, 1));
        }

        return this;
    }

    private setItems(): this {
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

interface AutoCompleteContentItemOption {
    label: string;

    size: { x: number, y: number };

    padding: Property.Padding;

    color: ThemeColor;

    fontSize: number;

    fontStyle: Property.FontStyle;

    variant: AutoCompleteContentItemVariant;
}
