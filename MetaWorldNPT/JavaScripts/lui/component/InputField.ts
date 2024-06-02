import Log4Ts from "../../depend/log4ts/Log4Ts";
import Gtk from "../../util/GToolkit";
import { Lui } from "../Asset";
import { InputChangeEvent, InputCommitEvent } from "../event/InputEvent";
import { Property } from "../Style";
import ThemeColor, { NormalThemeColor } from "../Theme";
import { Component } from "./Component";

export default class InputField extends Component {
    private static readonly NORMAL_BACKGROUND_COLOR = LinearColor.colorHexToLinearColor("#f0f0f0");
    private static readonly FOCUS_BACKGROUND_COLOR = LinearColor.colorHexToLinearColor("#e8e8e8");
    private static readonly HINT_TEXT_COLOR = LinearColor.colorHexToLinearColor("#5d5d5d");
    private static readonly BOTTOM_LINE_NORMAL_COLOR = LinearColor.colorHexToLinearColor("#8c8c8c");
    private static readonly BOTTOM_LINE_FOCUS_COLOR = LinearColor.colorHexToLinearColor("#1e1e1e");

    private static readonly HOVER_ANI_TIME = 0.1;
    private static readonly FOCUS_ANI_TIME = 0.1;

    private _option: Readonly<Required<InputFieldOption>> = undefined;

    private _bgImage: mw.Image = undefined;
    private _bottomLine: mw.Image = undefined;
    private _labelText: mw.TextBlock = undefined;
    private _highlightLine: mw.Image = undefined;
    private _inputBox: mw.InputBox = undefined;
    private _activateBtn: mw.Button = undefined;

    private _focusedLabelPos: Vector2 = undefined;
    private _labelOriginPos: Vector2 = undefined;

    private _realWidth: number;
    private _realHeight: number;
    private _realPosX: number;
    private _realPosY: number;

    /**
     * 是否鼠标进入悬停,用于驱动hover动画
     */
    private _isEnterHover: boolean = false;

    /**
     * 是否鼠标离开悬停,用于驱动hover动画
     */
    private _isLeaveHover: boolean = false;
    /**
     * 是否点击，用于驱动聚焦动画
     */
    private _isFocus: boolean = false;
    /**
     * 是否失焦，用于驱动失焦动画
     */
    private _isUnFocus: boolean = false;

    protected destroy(): void {
        this._isEnterHover = false;
        this._isLeaveHover = false;
        TimeUtil.onEnterFrame.remove(this.onHoverAniHandler);
        TimeUtil.onEnterFrame.remove(this.unHoverAniHandler);
        TimeUtil.onEnterFrame.remove(this.focusAniHandler);
        TimeUtil.onEnterFrame.remove(this.unFocusAniHandler);
    }

    public static create(inputFieldOption?: InputFieldOption): InputField {
        let inputField = new InputField();
        inputField.initRoot();
        inputField._option = InputField.defaultOption(inputFieldOption);
        inputField._realPosX = inputField._option.padding.left;
        inputField._realPosY = inputField._option.padding.top;
        inputField._realWidth = inputField._option.size.x - inputField._option.padding.left - inputField._option.padding.right;
        inputField._realHeight = inputField._option.size.y - inputField._option.padding.top - inputField._option.padding.bottom;

        inputField.root.position = new Vector2(200, 200);
        inputField.initBackgroundImg(inputField.root);
        inputField.initInputBox(inputField.root);
        inputField.initLabelText(inputField.root);
        inputField.initActivateBtn(inputField.root);
        inputField.initBottomLine(inputField.root);
        inputField.initHighlightLine(inputField.root);

        TimeUtil.onEnterFrame.add(inputField.onHoverAniHandler);
        TimeUtil.onEnterFrame.add(inputField.unHoverAniHandler);
        TimeUtil.onEnterFrame.add(inputField.focusAniHandler);
        TimeUtil.onEnterFrame.add(inputField.unFocusAniHandler);

        return inputField;
    }

    public static defaultOption(option?: InputFieldOption): Required<InputFieldOption> {
        if (!option) option = {};

        if (!option.size) option.size = { x: 240, y: 60 };
        if (!option.padding) option.padding = { top: 0, right: 0, bottom: 0, left: 0 };
        if (!option.color) option.color = NormalThemeColor;
        if (!option.fontSize) option.fontSize = 18;
        if (!option.fontStyle) option.fontStyle = mw.UIFontGlyph.Light;
        if (!option.variant) option.variant = "filled";
        if (!option.label) option.label = "Filled";

        return option as Required<InputFieldOption>;
    }

    private initLabelText(rootCanvas: Canvas): void {
        let labelText = TextBlock.newObject(rootCanvas, 'labelText');
        Gtk.setUiPosition(labelText, this._realPosX + 10, this._realPosY + this._realHeight / 6);
        Gtk.setUiSize(labelText, this._realWidth - (this._realHeight / 6) * 2, this._realHeight * 2 / 3);

        labelText.text = this._option.label;
        labelText.visibility = SlateVisibility.Visible;
        labelText.textAlign = TextJustify.Left;
        labelText.textVerticalAlign = TextVerticalJustify.Center;
        labelText.fontColor = InputField.HINT_TEXT_COLOR;
        labelText.fontSize = this._option.fontSize;
        labelText.renderTransformPivot = new Vector2(0, 0);
        labelText.glyph = this._option.fontStyle;
        labelText.visibility = SlateVisibility.Visible;
        labelText.textHorizontalLayout = UITextHorizontalLayout.Clipping;

        this._labelOriginPos = new Vector2(this._realPosX + 10, this._realPosY + this._realHeight / 6);
        this._focusedLabelPos = new Vector2(this._realPosX + 10, this._realPosY);

        this._labelText = labelText;
    }

    private initActivateBtn(rootCanvas: Canvas): void {
        let btn = Button.newObject(rootCanvas, 'activateBtn');
        Gtk.setUiSize(btn, this._realWidth, this._realHeight);
        btn.normalImageDrawType = SlateBrushDrawType.NoDrawType;
        btn.transitionEnable = false;
        btn.onHovered.add(() => {
            Log4Ts.log(InputField, `onHovered`);
            this._isEnterHover = true;
        });
        btn.onUnhovered.add(() => {
            Log4Ts.log(InputField, `onUnhovered`);
            this._isLeaveHover = true;
        });
        btn.onClicked.add(() => {
            this.playFocusAni();
            this.onFocused && this.onFocused();
        });
        this._activateBtn = btn;
    }

    private initBackgroundImg(rootCanvas: Canvas) {
        switch (this._option.variant) {
            case "outlined":
                {

                }

                break;
            case "filled":
                {
                    let backGroundImg = Image.newObject(rootCanvas, 'backGroundImg');
                    backGroundImg.imageGuid = Lui.Asset.ImgTopRoundRectangle;
                    Gtk.setUiSize(backGroundImg, this._realWidth, this._realHeight);
                    backGroundImg.imageDrawType = SlateBrushDrawType.PixcelBox;
                    backGroundImg.margin = new Margin(12);
                    backGroundImg.imageColor = InputField.NORMAL_BACKGROUND_COLOR;
                    this._bgImage = backGroundImg;
                }
                break;
            case "standard":
                {

                }
                break;
            default:
                break;
        }


    }

    private initInputBox(rootCanvas: Canvas): void {
        let inputBox = InputBox.newObject(rootCanvas, 'inputBox');
        Gtk.setUiPosition(inputBox, this._realPosX + 6, this._realPosY + this._realHeight / 3);
        Gtk.setUiSize(inputBox, this._realWidth - 12, this._realHeight * 2 / 3 - 4);
        inputBox.fontSize = this._option.fontSize;
        inputBox.text = '';
        inputBox.hintString = '';
        inputBox.textLengthLimit = 9999;
        inputBox.contentColor = new LinearColor(0, 0, 0, 0);
        inputBox.visibility = SlateVisibility.Visible;
        inputBox.newLineKeyBind = InsertNewLineType.AllCommit;
        inputBox.glyph = this._option.fontStyle;
        inputBox.textAlign = TextJustify.Left;
        inputBox.textVerticalAlign = TextVerticalJustify.Center;
        inputBox.onTextCommitted.add((text: string, commitMethod: TextCommit) => {
            Log4Ts.log(InputField, `text:${text},commitMethod:${commitMethod}`);
            if (commitMethod === TextCommit.OnUserMovedFocus) {
                //失去焦点要播放失焦动画
                this.playUnFocusAni();
                this.onBlur && this.onBlur();
            }
            this.onCommitInput && this.onCommitInput({ text });
        });
        inputBox.onTextChanged.add((text: string) => {
            this.onInputChanged && this.onInputChanged({ text });
        });
        this._inputBox = inputBox;

    }

    private initBottomLine(rootCanvas: Canvas): void {
        let bottomLine = Image.newObject(rootCanvas, 'bottomLine');
        bottomLine.imageGuid = Lui.Asset.ImgRectangle;
        Gtk.setUiSize(bottomLine, this._realWidth, 1);
        Gtk.setUiPosition(bottomLine, this._realPosX, this._realPosY + this._realHeight - 1);
        bottomLine.imageDrawType = SlateBrushDrawType.Image;
        bottomLine.imageColor = InputField.BOTTOM_LINE_NORMAL_COLOR;
        bottomLine.visibility = SlateVisibility.Visible;
        this._bottomLine = bottomLine;
    }

    private initHighlightLine(rootCanvas: Canvas): void {
        let _highlightLine = Image.newObject(rootCanvas, 'highlightLine');
        _highlightLine.imageGuid = Lui.Asset.ImgRectangle;
        Gtk.setUiSize(_highlightLine, 1, 2);
        Gtk.setUiPosition(_highlightLine, this._realPosX + this._realWidth / 2, this._realPosY + this._realHeight - 2);
        _highlightLine.imageDrawType = SlateBrushDrawType.Image;
        _highlightLine.imageColor = LinearColor.colorHexToLinearColor(this._option.color.primary);
        _highlightLine.visibility = SlateVisibility.Collapsed;
        this._highlightLine = _highlightLine;
    }

    private _startOnHoverAniTime: number = 0;
    private onHoverAniHandler = (dt: number): void => {
        if (this._isEnterHover) {
            this._startOnHoverAniTime += dt;

            this._bgImage.imageColor = this.lerpColor(
                InputField.NORMAL_BACKGROUND_COLOR,
                InputField.FOCUS_BACKGROUND_COLOR,
                this._startOnHoverAniTime / InputField.HOVER_ANI_TIME);
            this._bottomLine.imageColor = this.lerpColor(
                InputField.BOTTOM_LINE_NORMAL_COLOR,
                InputField.BOTTOM_LINE_FOCUS_COLOR,
                this._startOnHoverAniTime / InputField.HOVER_ANI_TIME);

            if (this._startOnHoverAniTime >= InputField.HOVER_ANI_TIME) {
                this._isEnterHover = false;
                this._startOnHoverAniTime = 0;
            }
        }
    }
    private _startUnHoverAniTime: number = 0;
    private unHoverAniHandler = (dt: number): void => {
        if (this._isLeaveHover) {
            this._startUnHoverAniTime += dt;

            this._bgImage.imageColor = this.lerpColor(
                InputField.FOCUS_BACKGROUND_COLOR,
                InputField.NORMAL_BACKGROUND_COLOR,
                this._startUnHoverAniTime / InputField.HOVER_ANI_TIME);
            this._bottomLine.imageColor = this.lerpColor(
                InputField.BOTTOM_LINE_FOCUS_COLOR,
                InputField.BOTTOM_LINE_NORMAL_COLOR,
                this._startUnHoverAniTime / InputField.HOVER_ANI_TIME);

            if (this._startUnHoverAniTime >= InputField.HOVER_ANI_TIME) {
                this._isLeaveHover = false;
                this._startUnHoverAniTime = 0;
            }
        }
    }

    private _startFocusAniTime: number = 0;
    private focusAniHandler = (dt: number): void => {
        if (this._isFocus) {
            this._startFocusAniTime += dt;
            if (this._inputBox.text.length === 0) {
                let pos = this.lerpVector(this._labelOriginPos,
                    this._focusedLabelPos,
                    this._startFocusAniTime / InputField.FOCUS_ANI_TIME)
                Gtk.setUiPosition(this._labelText, pos.x, pos.y);
                let scale = this.lerp(1, 0.6, this._startFocusAniTime / InputField.FOCUS_ANI_TIME);
                Gtk.setUiScale(this._labelText, scale, scale);
                Gtk.setUiSizeY(this._labelText, this.lerp(this._realHeight * 2 / 3, this._realHeight * 0.5, this._startFocusAniTime / InputField.FOCUS_ANI_TIME));
            }
            Gtk.setUiScaleX(this._highlightLine, this.lerp(1, this._realWidth, this._startFocusAniTime / InputField.FOCUS_ANI_TIME));

            if (this._startFocusAniTime >= InputField.FOCUS_ANI_TIME) {
                this._startFocusAniTime = 0;
                this.endFocusAni();
            }
        }
    }

    private _startUnFocusAniTime: number = 0;
    private unFocusAniHandler = (dt: number): void => {
        if (this._isUnFocus) {
            this._startUnFocusAniTime += dt;

            Gtk.setUiScaleX(this._highlightLine, this.lerp(this._realWidth, 1, this._startUnFocusAniTime / InputField.FOCUS_ANI_TIME));

            if (this._inputBox.text.length === 0) {
                let pos = this.lerpVector(this._focusedLabelPos,
                    this._labelOriginPos,
                    this._startUnFocusAniTime / InputField.FOCUS_ANI_TIME)
                Gtk.setUiPosition(this._labelText, pos.x, pos.y);
                let scale = this.lerp(0.6, 1, this._startUnFocusAniTime / InputField.FOCUS_ANI_TIME);
                Gtk.setUiScale(this._labelText, scale, scale);
                Gtk.setUiSizeY(this._labelText, this.lerp(this._realHeight * 0.5, this._realHeight * 2 / 3, this._startUnFocusAniTime / InputField.FOCUS_ANI_TIME));
            }

            if (this._startUnFocusAniTime >= InputField.FOCUS_ANI_TIME) {

                this._startUnFocusAniTime = 0;
                this.endUnFocusAni();
            }
        }
    }

    private _tempVector: Vector2 = Vector2.zero;
    private lerpVector(start: Vector2, end: Vector2, t: number): Vector2 {
        this._tempVector.x = start.x + (end.x - start.x) * t;
        this._tempVector.y = start.y + (end.y - start.y) * t;
        return this._tempVector;
    }

    private _tempColor: LinearColor = new LinearColor(0, 0, 0, 0);
    private lerpColor(start: LinearColor, end: LinearColor, t: number): LinearColor {
        this._tempColor.r = start.r + (end.r - start.r) * t;
        this._tempColor.g = start.g + (end.g - start.g) * t;
        this._tempColor.b = start.b + (end.b - start.b) * t;
        this._tempColor.a = start.a + (end.a - start.a) * t;
        return this._tempColor;
    }

    private lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }


    private playFocusAni(): void {
        this._labelText.fontColor = LinearColor.colorHexToLinearColor(this._option.color.primary);
        this._highlightLine.visibility = SlateVisibility.SelfHitTestInvisible;
        this._isFocus = true;
        //执行一下停止悬浮动画
        this._isLeaveHover = true;
        this._activateBtn.visibility = SlateVisibility.Collapsed;
    }

    private endFocusAni(): void {
        this._isFocus = false;
        this._inputBox.focus();
    }

    private playUnFocusAni(): void {
        this._isUnFocus = true;
        this._labelText.fontColor = InputField.HINT_TEXT_COLOR;
    }
    private endUnFocusAni(): void {
        this._isUnFocus = false;
        this._highlightLine.visibility = SlateVisibility.Collapsed;
        this._activateBtn.visibility = SlateVisibility.Visible;
    }

    public onCommitInput: (event: InputCommitEvent) => void;

    public onInputChanged: (event: InputChangeEvent) => void;

    public onFocused: () => void;

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