import Gtk from "../../util/GToolkit";
import ThemeColor, { NormalThemeColor } from "../Theme";
import { Property } from "../Style";
import { Component } from "./Component";
import { ClickEvent } from "../event/ClickEvent";
import InputField, { InputFieldVariant } from "./InputField";
import { ChooseItemEvent } from "../event/ChooseItemEvent";
import SlateVisibility = mw.SlateVisibility;

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
export class AutoComplete extends Component {
    private _input: InputField;

    private _scrContainer: mw.ScrollBox;

    private _cnvContainer: mw.Canvas;

    private _option: Readonly<Required<AutoCompleteOption>> = undefined;

    public static create(option?: AutoCompleteOption): AutoComplete {
        let autoComplete = new AutoComplete();

        autoComplete._option = AutoComplete.defaultOption(option);
        autoComplete.initRoot();

        autoComplete._input = InputField.create(autoComplete._option);

        autoComplete._scrContainer = mw.ScrollBox.newObject(autoComplete.root);
        autoComplete._scrContainer.visibility = SlateVisibility.Visible;
        autoComplete._scrContainer.alwaysShowScrollBar = false;
        autoComplete._scrContainer.scrollbarThickness = 5;
        autoComplete._scrContainer.scrollbarPadding = {top: 2, right: 8, bottom: 2, left: 0};

        autoComplete._cnvContainer = mw.Canvas.newObject();
        autoComplete._scrContainer.addChild(autoComplete._cnvContainer);
        autoComplete._cnvContainer.visibility = SlateVisibility.SelfHitTestInvisible;
        autoComplete._cnvContainer.autoSizeVerticalEnable = true;
        autoComplete._cnvContainer.autoLayoutEnable = true;
        autoComplete._cnvContainer.autoLayoutContainerRule = mw.UILayoutType.Vertical;

        autoComplete.setSize();
        autoComplete.setColor();
        autoComplete.setItems();

        return autoComplete;
    };

    public static defaultOption(option?: AutoCompleteOption): Required<AutoCompleteOption> {
        if (!option) option = {};

        if (!option.label) option.label = "input";
        if (!option.size) option.size = {x: 240, y: 60};
        if (!option.padding) option.padding = {};
        if (!option.color) option.color = NormalThemeColor;
        if (!option.itemHeight) option.itemHeight = 40;
        if (!option.fontSize) option.fontSize = 14;
        if (!option.fontStyle) option.fontStyle = mw.UIFontGlyph.Light;
        if (!option.variant) option.variant = "filled";

        return option as Required<AutoCompleteOption>;
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

        Gtk.setUiSize(this._scrContainer, contentX, contentY);
        Gtk.setUiPosition(this._scrContainer, pl, this._input.root.size.y);
        Gtk.setUiSizeX(this._cnvContainer, contentX);
        Gtk.setUiPosition(this._cnvContainer, 0, 0);

        return this;
    }

    private setColor(): this {
        this._scrContainer.scrollAxisColor = mw.LinearColor.colorHexToLinearColor(this._option.color.primary);

        return this;
    }

    private setItems(): this {
        return this;
    }

//#region CallBack
    public onClick: (event: ClickEvent) => void;

    public onChoose: (event: ChooseItemEvent) => void;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export type AutoCompleteVariant = "square" | "circle";

export interface AutoCompleteOption {
    label?: string;

    items?: { label: string }[];

    size?: { x: number, y: number };

    padding?: Property.Padding;

    color?: ThemeColor;

    maxHeight?: number;

    itemHeight?: number;

    fontSize?: number;

    fontStyle?: Property.FontStyle;

    variant?: InputFieldVariant;
}
