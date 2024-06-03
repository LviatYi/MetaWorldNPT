import Gtk from "../../util/GToolkit";
import { Lui } from "../Asset";
import { InputChangeEvent, InputCommitEvent } from "../event/InputEvent";
import { Property } from "../Style";
import ThemeColor, { Color, ColorUtil, Interval, NormalThemeColor } from "../Theme";
import { Component } from "./Component";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import SlateVisibility = mw.SlateVisibility;

export default class TextField extends Component {
    private _option: Readonly<Required<InputFieldOption>> = undefined;

    private _imgBg: mw.Image = undefined;

    private _imgHighlight: mw.Image = undefined;

    private _txtInput: mw.InputBox = undefined;

    private _txtLabel: mw.TextBlock = undefined;

    private _btnActivate: mw.Button = undefined;

    private _imgLine: mw.Image = undefined;

    private _imgHighlightLine: mw.Image = undefined;

    private _hovered: boolean = false;

    private _focused: boolean = false;

    private _labelFloatElapsed: number = 0;

    private _labelStartRgb: ColorUtil.RGB;

    private _labelEndRgb: ColorUtil.RGB;

    public static create(option?: InputFieldOption): TextField {
        let textField = new TextField();

        textField._option = TextField.defaultOption(option);
        textField.initRoot();

        textField._imgBg = Image.newObject(textField.root, "imgBg");
        textField._imgBg.visibility = SlateVisibility.SelfHitTestInvisible;
        switch (textField._option.variant) {
            case "outlined":
                break;
            case "standard":
                break;
            default:
            case "filled":
                textField._imgBg.imageGuid = Lui.Asset.ImgHalfRoundRectangle;
                textField._imgBg.imageDrawType = SlateBrushDrawType.PixcelBox;
                textField._imgBg.margin = new mw.Margin(
                    Lui.Asset.ImgHalfRoundedRectangleBoxMargin.left,
                    Lui.Asset.ImgHalfRoundedRectangleBoxMargin.top,
                    Lui.Asset.ImgHalfRoundedRectangleBoxMargin.right,
                    Lui.Asset.ImgHalfRoundedRectangleBoxMargin.bottom,
                );
                break;
        }
        textField._imgBg.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Gray50, 1));

        textField._imgHighlight = Image.newObject(textField.root, "imgHighlight");
        textField._imgHighlight.visibility = SlateVisibility.SelfHitTestInvisible;
        switch (textField._option.variant) {
            case "outlined":
                break;
            case "standard":
                break;
            default:
            case "filled":
                textField._imgHighlight.imageGuid = Lui.Asset.ImgHalfRoundRectangle;
                textField._imgHighlight.imageDrawType = SlateBrushDrawType.PixcelBox;
                textField._imgHighlight.margin = new mw.Margin(
                    Lui.Asset.ImgHalfRoundedRectangleBoxMargin.left,
                    Lui.Asset.ImgHalfRoundedRectangleBoxMargin.top,
                    Lui.Asset.ImgHalfRoundedRectangleBoxMargin.right,
                    Lui.Asset.ImgHalfRoundedRectangleBoxMargin.bottom,
                );
                break;
        }
        textField._imgHighlight.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Gray500, 0.25));
        textField._imgHighlight.renderOpacity = 0;

        textField._txtInput = InputBox.newObject(textField.root, "txtInput");
        textField._txtInput.visibility = SlateVisibility.Visible;
        textField._txtInput.fontSize = textField._option.fontSize;
        textField._txtInput.glyph = textField._option.fontStyle;
        textField._txtInput.text = "";
        textField._txtInput.hintString = "";
        textField._txtInput.textLengthLimit = 9999;
        textField._txtInput.setContentColorByHex(ColorUtil.colorHexWithAlpha(Color.White, 0));
        textField._txtInput.newLineKeyBind = InsertNewLineType.AllCommit;
        textField._txtInput.textAlign = TextJustify.Left;
        textField._txtInput.textVerticalAlign = TextVerticalJustify.Center;

        textField._txtLabel = TextBlock.newObject(textField.root, "txtLabel");
        textField._txtLabel.visibility = SlateVisibility.SelfHitTestInvisible;
        textField._txtLabel.text = textField._option.label;
        textField._txtLabel.textAlign = TextJustify.Left;
        textField._txtLabel.textVerticalAlign = TextVerticalJustify.Center;
        textField._txtLabel.fontSize = textField._option.fontSize;
        textField._txtLabel.renderTransformPivot = new Vector2(0, 0);
        textField._txtLabel.glyph = textField._option.fontStyle;
        textField._txtLabel.textHorizontalLayout = UITextHorizontalLayout.Clipping;

        textField._btnActivate = Button.newObject(textField.root, "btnActivate");
        textField._btnActivate.visibility = SlateVisibility.Visible;
        textField._btnActivate.normalImageDrawType = SlateBrushDrawType.NoDrawType;
        textField._btnActivate.transitionEnable = false;

        textField._imgLine = Image.newObject(textField.root, "imgLine");
        textField._imgLine.visibility = SlateVisibility.SelfHitTestInvisible;
        textField._imgLine.imageGuid = Lui.Asset.ImgRectangle;
        textField._imgLine.imageDrawType = SlateBrushDrawType.Image;
        textField._imgLine.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 1));

        textField._imgHighlightLine = Image.newObject(textField.root, "imgHighlightLine");
        textField._imgHighlightLine.visibility = SlateVisibility.SelfHitTestInvisible;
        textField._imgHighlightLine.imageGuid = Lui.Asset.ImgRectangle;
        textField._imgHighlightLine.imageDrawType = SlateBrushDrawType.Image;
        Gtk.setUiScale(textField._imgHighlightLine, 0, 1);

        textField.setSize();
        textField.setColor();

        textField._txtInput.onTextCommitted.add((text, commitMethod) => {
            Log4Ts.log(TextField, `txt commit. ${mw.TextCommit[commitMethod]}`);
            if (commitMethod === mw.TextCommit.Default) {
                textField._txtInput.focus();
                Log4Ts.log(TextField, `focus force.`);
            }
            textField._focused = false;
            textField.onBlur && textField.onBlur();

            textField.onCommit && textField.onCommit({text});
        });
        textField._txtInput.onTextChanged.add(text => {
            Log4Ts.log(TextField, `txt changed.`);
            textField.onChange && textField.onChange({text});
        });
        textField._btnActivate.onClicked.add(() => {
            Log4Ts.log(TextField, `focus by btn.`);
            textField._focused = true;
            textField.onFocus && textField.onFocus();
            textField._txtInput.focus();
        });

        textField._btnActivate.onHovered.add(() => {
            if (!textField._focused) textField._hovered = true;
        });
        textField._btnActivate.onUnhovered.add(() => {
            textField._hovered = false;
        });

        mw.TimeUtil.onEnterFrame.add(textField.renderAnimHandler);
        return textField;
    }

    public static defaultOption(option?: InputFieldOption): Required<InputFieldOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 240, y: 60};
        if (!option.padding) option.padding = {top: 0, right: 0, bottom: 0, left: 0};
        if (!option.color) option.color = NormalThemeColor;
        if (!option.fontSize) option.fontSize = 18;
        if (!option.fontStyle) option.fontStyle = mw.UIFontGlyph.Light;
        if (!option.variant) option.variant = "filled";
        if (!option.label) option.label = "Filled";

        return option as Required<InputFieldOption>;
    }

    protected destroy(): void {
        mw.TimeUtil.onEnterFrame.remove(this.renderAnimHandler);
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

        Gtk.setUiSize(this._imgBg, contentX, contentY);
        Gtk.setUiPosition(this._imgBg, pl, pt);
        Gtk.setUiSize(this._imgHighlight, contentX, contentY);
        Gtk.setUiPosition(this._imgHighlight, pl, pt);
        Gtk.setUiPosition(this._txtInput, pl + 10, pt + 10);
        Gtk.setUiSize(this._txtInput, contentX - 20, contentY - 10);
        Gtk.setUiPosition(this._txtLabel, pl + 15, pt + 10);
        Gtk.setUiSize(this._txtLabel, contentX - 30, contentY - 10);
        Gtk.setUiSize(this._btnActivate, contentX, contentY);
        Gtk.setUiPosition(this._imgLine, 0, contentY - 1);
        Gtk.setUiSize(this._imgLine, contentX, 1);
        Gtk.setUiPosition(this._imgHighlightLine, 0, contentY - 2);
        Gtk.setUiSize(this._imgHighlightLine, contentX, 2);

        return this;
    }

    private setColor() {
        this._txtLabel.setFontColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 1));
        this._labelStartRgb = ColorUtil.hexToRgb(Color.Black);
        this._labelEndRgb = ColorUtil.hexToRgb(this._option.color.primary);
        this._imgHighlightLine.setImageColorByHex(ColorUtil.colorHexWithAlpha(this._option.color.primary, 1));
    }

    private renderAnimHandler = (dt: number) => {
        if (this._focused && this._imgHighlightLine.renderScale.x < 1) {
            let elapsed = Math.min(
                1,
                this._imgHighlightLine.renderScale.x + dt / Interval.VeryFast);
            Gtk.setUiScaleX(
                this._imgHighlightLine,
                elapsed,
            );
        }
        if (!this._focused && this._imgHighlightLine.renderScale.x > 0) {
            let elapsed = Math.max(
                0,
                this._imgHighlightLine.renderScale.x - dt / Interval.VeryFast);
            Gtk.setUiScaleX(
                this._imgHighlightLine,
                elapsed,
            );
        }
        if ((this._focused || !Gtk.isNullOrEmpty(this._txtInput.text)) && this._labelFloatElapsed < 1) {
            this._labelFloatElapsed = Math.min(
                1,
                this._labelFloatElapsed + dt / Interval.VeryFast);

            let rgb = ColorUtil.lerp(
                this._labelStartRgb.r,
                this._labelStartRgb.g,
                this._labelStartRgb.b,
                this._labelEndRgb.r,
                this._labelEndRgb.g,
                this._labelEndRgb.b,
                this._labelFloatElapsed,
            );
            let color = this._txtLabel.fontColor;
            color.r = rgb.r;
            color.g = rgb.g;
            color.b = rgb.b;

            this._txtLabel.fontColor = new mw.LinearColor(rgb.r, rgb.g, rgb.b, 1);
            const scale = 1 - 0.6 * this._labelFloatElapsed;
            const posY = 10 - 5 * this._labelFloatElapsed;
            Gtk.setUiScale(this._txtLabel, scale, scale);
            Gtk.setUiPositionY(this._txtLabel, posY);

            Log4Ts.log(TextField, `set txtLabel color r: ${this._txtLabel.fontColor.r}, g: ${this._txtLabel.fontColor.g}, b: ${this._txtLabel.fontColor.b}`);
        }
        if ((!this._focused && Gtk.isNullOrEmpty(this._txtInput.text)) && this._labelFloatElapsed > 0) {
            this._labelFloatElapsed = Math.max(
                0,
                this._labelFloatElapsed - dt / Interval.VeryFast);

            let rgb = ColorUtil.lerp(
                this._labelStartRgb.r,
                this._labelStartRgb.g,
                this._labelStartRgb.b,
                this._labelEndRgb.r,
                this._labelEndRgb.g,
                this._labelEndRgb.b,
                this._labelFloatElapsed,
            );
            let color = this._txtLabel.fontColor;
            color.r = rgb.r;
            color.g = rgb.g;
            color.b = rgb.b;

            this._txtLabel.fontColor = new mw.LinearColor(rgb.r, rgb.g, rgb.b, 1);
            const scale = 1 - 0.6 * this._labelFloatElapsed;
            const posY = 10 - 5 * this._labelFloatElapsed;
            Gtk.setUiScale(this._txtLabel, scale, scale);
            Gtk.setUiPositionY(this._txtLabel, posY);

            Log4Ts.log(TextField, `set txtLabel color r: ${this._txtLabel.fontColor.r}, g: ${this._txtLabel.fontColor.g}, b: ${this._txtLabel.fontColor.b}`);
        }

        if (this._hovered && this._imgHighlight.renderOpacity < 1) {
            this._imgHighlight.renderOpacity = Math.min(
                1,
                this._imgHighlight.renderOpacity + dt / Interval.VeryFast);
        }
        if (!this._hovered && this._imgHighlight.renderOpacity > 0) {
            this._imgHighlight.renderOpacity = Math.max(
                0,
                this._imgHighlight.renderOpacity - dt / Interval.VeryFast);
        }
    };

    public onCommit: (event: InputCommitEvent) => void;

    public onChange: (event: InputChangeEvent) => void;

    public onFocus: () => void;

    public onBlur: () => void;

}

export type InputFieldVariant = "outlined" | "filled" | "standard";

export interface InputFieldOption {
    label?: string;

    size?: { x: number, y: number };

    padding?: Property.Padding;

    color?: ThemeColor;

    fontSize?: number;

    fontStyle?: Property.FontStyle;

    variant?: InputFieldVariant;

}