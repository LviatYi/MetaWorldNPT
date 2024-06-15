import Gtk, { Delegate, Switcher } from "gtoolkit";
import { InputChangeEvent, InputCommitEvent } from "../event/InputEvent";
import { Property, PropertyUtil } from "../style/Property";
import { Component, ComponentOption, extractLayoutFromOption, overrideOption } from "./Component";
import { fromKeyString, KeyEvent } from "../event/KeyEvent";
import { Box } from "./Box";
import { Lui } from "../style/Asset";
import hasCorner = PropertyUtil.hasCorner;
import ColorUtil = Lui.Asset.ColorUtil;
import ThemeColor = Lui.Asset.ThemeColor;
import Color = Lui.Asset.Color;
import Interval = Lui.Asset.Interval;

/**
 * TextField.
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
export class TextField extends Component {
//#region Constant
    public static readonly TextFieldHighlightLineWeight = 2;

    public static readonly TextFieldFocusEventName = "__LUI_TEXT_FIELD_FOCUS__";

    public static readonly TextFieldBlurEventName = "__LUI_TEXT_FIELD_BLUR__";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _option: Required<InputFieldOption> = undefined;

    private _box: Box;

    private _imgHighlight: mw.Image;

    private _txtInput: mw.InputBox;

    private _txtLabel: mw.TextBlock;

    private _imgLine: mw.Image;

    private _imgHighlightLine: mw.Image;

    private _hovered: boolean;

    private _focused: boolean;

    private _labelFloatElapsed: number = 0;

    private _labelStartRgb: ColorUtil.RGB;

    private _labelEndRgb: ColorUtil.RGB;

    private _validated: Property.DataValidateResult = {result: true};

    private _selfCommitted: boolean = false;

    public get text(): string {
        return this._txtInput.text;
    }

    public get validated(): Property.DataValidateResult {
        return this._validated;
    }

//#region Lui Component
    public static create(option?: InputFieldOption): TextField {
        let textField = new TextField();

        textField.root.name="LuiTextField";

        textField._option = TextField.defaultOption(option);

        textField._box = Box.create({
            ...option,
            zOrder: undefined,
            color: {
                primary: Color.Gray50,
                secondary: Color.White,
            },
        })
            .attach(textField);

        textField._imgHighlight = Image.newObject(textField.root, "imgHighlight");
        textField._imgHighlight.visibility = mw.SlateVisibility.SelfHitTestInvisible;
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
        textField._txtInput.visibility = mw.SlateVisibility.Visible;
        textField._txtInput.fontSize = textField._option.fontSize;
        textField._txtInput.glyph = textField._option.fontStyle;
        textField._txtInput.text = "";
        textField._txtInput.hintString = "";
        textField._txtInput.textLengthLimit = 9999;
        textField._txtInput.setContentColorByHex(ColorUtil.colorHexWithAlpha(Color.White, 0));
        textField._txtInput.newLineKeyBind = InsertNewLineType.AllCommit;
        textField._txtInput.textAlign = TextJustify.Left;
        textField._txtInput.textVerticalAlign = TextVerticalJustify.Center;
        textField._txtInput.inputTextLimit = textField._option.type;

        textField._txtLabel = TextBlock.newObject(textField.root, "txtLabel");
        textField._txtLabel.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        textField._txtLabel.text = textField._option.label;
        textField._txtLabel.textAlign = TextJustify.Left;
        textField._txtLabel.textVerticalAlign = TextVerticalJustify.Center;
        textField._txtLabel.fontSize = textField._option.fontSize;
        textField._txtLabel.renderTransformPivot = new Vector2(0, 0);
        textField._txtLabel.glyph = textField._option.fontStyle;
        textField._txtLabel.textHorizontalLayout = UITextHorizontalLayout.Clipping;

        textField._imgLine = Image.newObject(textField.root, "imgLine");
        textField._imgLine.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        textField._imgLine.imageGuid = Lui.Asset.ImgRectangle;
        textField._imgLine.imageDrawType = SlateBrushDrawType.Image;
        textField._imgLine.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 1));

        textField._imgHighlightLine = Image.newObject(textField.root, "imgHighlightLine");
        textField._imgHighlightLine.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        textField._imgHighlightLine.imageGuid = Lui.Asset.ImgRectangle;
        textField._imgHighlightLine.imageDrawType = SlateBrushDrawType.Image;
        Gtk.setUiScale(textField._imgHighlightLine, 0, 1);

        textField.setLayout(textField._option);
        textField.setColor();

        textField._txtInput.onTextCommitted.add((text, commitMethod) => {
            if (textField._selfCommitted) return;

            textField._focused = false;
            textField.validate();
            textField.onCommit.invoke({text, commitMethod, validate: textField.validated});
        });
        textField._txtInput.onTextChanged.add(text => {
            if (textField._selfCommitted) return;

            textField.onChange.invoke({text});
        });

        mw.TimeUtil.onEnterFrame.add(textField.renderAnimHandler);

        ((textField._txtInput as mw.Widget)["onFocusChange"] as mw.Delegate<(absolutionPosition: mw.Vector2) => boolean>)
            .bind((pos) => {
                if (!textField._focused) {
                    mw.Event.dispatchToLocal(TextField.TextFieldFocusEventName);

                    textField._focused = true;
                    textField.onFocus.invoke();
                } else {
                    mw.Event.dispatchToLocal(TextField.TextFieldBlurEventName);
                    textField._focused = false;
                }
                return true;
            });

        ((textField._txtInput as
            mw.Widget)["onKeyUpEvent"] as
            mw.Delegate<(absolutionPosition: mw.Vector2, keyEvent: mw.KeyEvent) => boolean>)
            .bind((pos, keyEvent) => {
                let key = fromKeyString(keyEvent.getKey());
                textField.onKeyUp.invoke({
                    key,
                    type: "up",
                } as KeyEvent);

                if (key === mw.Keys.Enter && Gtk.getEditorVersion().compare({main: 31}) <= 0) {
                    let textLine = textField.text.replace(/\r?\n$/, "");
                    if (textField.text !== textLine) {
                        textField.selfSetContent(textLine);
                    }
                    textField._txtInput.deFocus();
                }
                return false;
            });

        return textField;
    }

    public static defaultOption(option?: InputFieldOption): Required<InputFieldOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 240, y: 60};
        if (!option.padding) option.padding = {top: 0, right: 0, bottom: 0, left: 0};
        if (!option.label) option.label = "input";
        if (!option.color) option.color = {
            primary: Color.Blue,
            secondary: Color.Blue200,
        };
        if (!option.fontSize) option.fontSize = 18;
        if (!option.fontStyle) option.fontStyle = mw.UIFontGlyph.Light;
        if (!option.type) option.type = mw.InputTextLimit.NoLimit;
        if (!option.variant) option.variant = "filled";
        if (!option.corner) option.corner = Property.Corner.Bottom;

        return option as Required<InputFieldOption>;
    }

    protected renderAnimHandler = (dt: number) => {
        this._hovered = !this._focused && this._txtInput.isHovered;
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
            this._txtLabel.glyph = mw.UIFontGlyph.Normal;
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
            const scale = 1 - 0.4 * this._labelFloatElapsed;
            const posY = 10 - 10 * this._labelFloatElapsed;
            Gtk.setUiScale(this._txtLabel, scale, scale);
            Gtk.setUiPositionY(this._txtLabel, posY);
        }
        if ((!this._focused && Gtk.isNullOrEmpty(this._txtInput.text)) && this._labelFloatElapsed > 0) {
            this._txtLabel.glyph = this._option.fontStyle;
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
            const scale = 1 - 0.4 * this._labelFloatElapsed;
            const posY = 10 - 10 * this._labelFloatElapsed;
            Gtk.setUiScale(this._txtLabel, scale, scale);
            Gtk.setUiPositionY(this._txtLabel, posY);
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

    public setLayout(option: ComponentOption): this {
        overrideOption(this._option, option);
        super.setLayout(this._option);
        let [
            [x, y],
            [pt, pr, pb, pl],
            [contentX, contentY],
        ] =
            extractLayoutFromOption(this._option);

        Gtk.setUiPosition(this._imgHighlight, pl, pt);
        Gtk.setUiSize(this._imgHighlight, contentX, contentY);
        Gtk.setUiPosition(this._txtInput, pl + 10, pt + 10);
        Gtk.setUiSize(this._txtInput, contentX - 20, contentY - 10);
        Gtk.setUiPosition(this._txtLabel, pl + 15, pt + 10);
        Gtk.setUiSize(this._txtLabel, contentX - 30, contentY - 10);
        const weight = TextField.TextFieldHighlightLineWeight;
        new Switcher()
            .case(() => {
                    Gtk.setUiPosition(this._imgLine, pl, pt + contentY - weight);
                    Gtk.setUiSize(this._imgLine, contentX, weight);
                    Gtk.setUiPosition(this._imgHighlightLine, pl, pt + contentY - weight);
                    Gtk.setUiSize(this._imgHighlightLine, contentX, weight);
                },
                true,
                true)
            .case(() => {
                    Gtk.setUiPosition(this._imgLine, pl, pt);
                    Gtk.setUiSize(this._imgLine, contentX, weight);
                    Gtk.setUiPosition(this._imgHighlightLine, pl, pt);
                    Gtk.setUiSize(this._imgHighlightLine, contentX, weight);
                },
                undefined,
                undefined,
                true,
                true)
            .case(() => {
                    Gtk.setUiPosition(this._imgLine, pl, pt);
                    Gtk.setUiSize(this._imgLine, weight, contentY);
                    Gtk.setUiPosition(this._imgHighlightLine, pl, pt);
                    Gtk.setUiSize(this._imgHighlightLine, weight, contentY);
                },
                true,
                undefined,
                true,
                undefined)
            .case(() => {
                    Gtk.setUiPosition(this._imgLine, pl + contentY - weight, pt);
                    Gtk.setUiSize(this._imgLine, weight, contentY);
                    Gtk.setUiPosition(this._imgHighlightLine, pl + contentY - weight, pt);
                    Gtk.setUiSize(this._imgHighlightLine, weight, contentY);
                },
                undefined,
                true,
                undefined,
                true)
            .default(() => {
                Gtk.setUiPosition(this._imgLine,
                    pl
                    + (hasCorner(this._option.corner, Property.Corner.BottomLeft) ? 0 :
                        Lui.Asset.ImgRoundedRectangleBoxMargin.left),
                    pt + contentY - weight);
                Gtk.setUiSize(this._imgLine,
                    contentX
                    - (hasCorner(this._option.corner, Property.Corner.BottomLeft) ? 0 :
                        Lui.Asset.ImgRoundedRectangleBoxMargin.left)
                    - (hasCorner(this._option.corner, Property.Corner.BottomRight) ? 0 :
                        Lui.Asset.ImgRoundedRectangleBoxMargin.right),
                    weight);
                Gtk.setUiPosition(this._imgHighlightLine,
                    pl
                    + (hasCorner(this._option.corner, Property.Corner.BottomLeft) ? 0 :
                        Lui.Asset.ImgRoundedRectangleBoxMargin.left),
                    pt + contentY - weight);
                Gtk.setUiSize(this._imgHighlightLine,
                    contentX
                    - (hasCorner(this._option.corner, Property.Corner.BottomLeft) ? 0 :
                        Lui.Asset.ImgRoundedRectangleBoxMargin.left)
                    - (hasCorner(this._option.corner, Property.Corner.BottomRight) ? 0 :
                        Lui.Asset.ImgRoundedRectangleBoxMargin.right),
                    weight);
            })
            .judge(
                hasCorner(this._option.corner, Property.Corner.BottomLeft),
                hasCorner(this._option.corner, Property.Corner.BottomRight),
                hasCorner(this._option.corner, Property.Corner.TopLeft),
                hasCorner(this._option.corner, Property.Corner.TopRight),
            );

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Init
    private setColor() {
        this._txtLabel.setFontColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 1));
        this._labelStartRgb = ColorUtil.hexToRgb(Color.Black);
        this._labelStartRgb.r /= 255;
        this._labelStartRgb.g /= 255;
        this._labelStartRgb.b /= 255;
        this._labelEndRgb = ColorUtil.hexToRgb(this._option.color.primary);
        this._labelEndRgb.r /= 255;
        this._labelEndRgb.g /= 255;
        this._labelEndRgb.b /= 255;
        this._imgHighlightLine.setImageColorByHex(ColorUtil.colorHexWithAlpha(this._option.color.primary, 1));
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public setContent(text: string) {
        Gtk.trySetText(this._txtInput, text);
        this.validate();
    }

    private selfSetContent(text: string) {
        this._selfCommitted = true;
        this._txtInput.text = text;
        this._selfCommitted = false;
    }

    public setValidator(validator: Property.DataValidators<string>): void {
        if (Gtk.isNullOrEmpty(validator)) {
            this._option.validator = undefined;
        } else {
            this._option.validator = validator;
        }
    }

//#region Event
    public onCommit: Delegate.SimpleDelegate<InputCommitEvent> = new Delegate.SimpleDelegate();

    public onChange: Delegate.SimpleDelegate<InputChangeEvent> = new Delegate.SimpleDelegate();

    public onFocus: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

    public onKeyUp: Delegate.SimpleDelegate<KeyEvent> = new Delegate.SimpleDelegate<KeyEvent>().setProtected();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private validate() {
        if (!Gtk.isNullOrEmpty(this.text)) {
            this._validated = PropertyUtil.validate(this._option.validator, this.text);
        } else {
            this._validated = {result: true};
        }

        if (!this._validated.result) {
            this._txtLabel.text = this._validated.reason ?? "Error";
            this._txtLabel.setFontColorByHex(Color.Red);
        } else if (this._txtLabel.text !== this._option.label) {
            this._txtLabel.text = this._option.label;
            let color = this._txtLabel.fontColor;
            color.r = this._labelEndRgb.r;
            color.g = this._labelEndRgb.g;
            color.b = this._labelEndRgb.b;
            this._txtLabel.fontColor = color;
        }
    }
}

export type InputFieldVariant = "outlined" | "filled" | "standard";

export interface InputFieldOption extends ComponentOption {
    label?: string;

    color?: ThemeColor;

    fontSize?: number;

    fontStyle?: Property.FontStyle;

    type?: Property.InputType;

    validator?: Property.DataValidators<string>;

    variant?: InputFieldVariant;

    corner?: Property.Corner;
}