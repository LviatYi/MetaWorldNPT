import Gtk from "../../util/GToolkit";
import ThemeColor, { Color, ColorHexWithAlpha, NormalThemeColor } from "../Theme";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import { Property, PropertyUtil } from "../Style";
import { Component } from "./Component";
import { Lui } from "../Asset";

/**
 * Button.
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
export class Button extends Component {
//#region
    public static readonly IMG_BTN_BOX_MARGIN = {left: 12, top: 12, right: 12, bottom: 12};

    public static readonly IMG_BTN_PRACTICAL_MARGIN = {left: 0, top: 0, right: 0, bottom: 0};
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _btn: mw.Button;

    private _cnvClickAnim: mw.Canvas;

    private _imgClickAnim: mw.Image;

    private _txtLabel: mw.TextBlock;

    private _imgHighlight: mw.Image;

    private _animOpacity: number = 0;

    private _animScale: number = 0;

    private _animHighlight: number = 0;

    private _option: Readonly<Required<ButtonOption>> = undefined;

    private _hovered: boolean = false;

    public static create(option?: ButtonOption): Button {
        let btn = new Button();

        btn._option = Button.defaultOption(option);
        btn.initRoot();
        btn._btn = mw.Button.newObject(btn.root, "btn");
        btn._btn.visibility = mw.SlateVisibility.Visible;
        btn._btn.normalImageGuid = btn._option.variant === "contained" ?
            Lui.Asset.ImgRoundedRectangle :
            Lui.Asset.ImgRoundedRectangleOutline;
        btn._btn.transitionEnable = false;
        btn._btn.normalImageDrawType = mw.SlateBrushDrawType.PixcelBox;
        btn._btn.normalImageMargin = new mw.Margin(
            Button.IMG_BTN_BOX_MARGIN.left,
            Button.IMG_BTN_BOX_MARGIN.top,
            Button.IMG_BTN_BOX_MARGIN.right,
            Button.IMG_BTN_BOX_MARGIN.bottom,
        );
        btn._cnvClickAnim = mw.Canvas.newObject(btn.root, "cnvClickAnim");
        btn._cnvClickAnim.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        btn._cnvClickAnim.clipEnable = true;

        btn._imgClickAnim = mw.Image.newObject(btn._cnvClickAnim, "imgClickAnim");
        btn._imgClickAnim.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        Gtk.setUiScale(btn._imgClickAnim, 0, 0);
        btn._imgClickAnim.renderOpacity = 0;
        btn._imgClickAnim.imageGuid = Lui.Asset.ImgCircle;
        btn._imgClickAnim.setImageColorByHex(ColorHexWithAlpha(Color.Black, 0.25));

        btn._txtLabel = mw.TextBlock.newObject(btn.root, "txtLabel");
        btn._txtLabel.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        btn._txtLabel.autoAdjust = false;
        PropertyUtil.applyFontSize(btn._txtLabel, option.fontSize);
        btn._txtLabel.glyph = option.fontStyle;
        PropertyUtil.applyTextAlign(btn._txtLabel, option.textAlign);

        btn._txtLabel.textVerticalAlign = mw.TextVerticalJustify.Center;

        btn._imgHighlight = mw.Image.newObject(btn.root, "imgHighlight");
        btn._imgHighlight.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        btn._imgHighlight.imageGuid = Lui.Asset.ImgRectangle;
        btn._imgHighlight.setImageColorByHex(ColorHexWithAlpha(Color.White,
            btn._option.variant === "outlined" ?
                0.3 :
                0.2));
        btn._imgHighlight.renderOpacity = 0;

        btn.setSize();
        btn.setColor();

        btn._btn.onClicked.add(() => {
            const clickAt = mw.absoluteToLocal(
                btn.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            btn.playClickAnimAt(clickAt.x, clickAt.y);
            Log4Ts.log(Button, `clicked at ${clickAt}`);
        });

        btn._btn.onHovered.add(() => btn._hovered = true);
        btn._btn.onUnhovered.add(() => btn._hovered = false);

        mw.TimeUtil.onEnterFrame.add(btn.renderAnimHandler);
        return btn;
    };

    public static defaultOption(option?: ButtonOption): Required<ButtonOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 240, y: 80};
        if (!option.color) option.color = NormalThemeColor;
        if (!option.fontSize) option.fontSize = 36;
        if (!option.fontStyle) option.fontStyle = mw.UIFontGlyph.Light;
        if (!option.textAlign) option.textAlign = "center";
        if (!option.variant) option.variant = "contained";

        return option as Required<ButtonOption>;
    };

    protected destroy() {
        mw.TimeUtil.onEnterFrame.remove(this.renderAnimHandler);
    }

    private setSize(): this {
        let [x, y] = [this._option.size.x, this._option.size.y];
        Gtk.setUiSize(this.root, x, y);
        Gtk.setUiSize(this._btn, x, y);
        Gtk.setUiSize(this._txtLabel, x, y);

        const realBtnSize = {
            x: x - Button.IMG_BTN_PRACTICAL_MARGIN.left - Button.IMG_BTN_PRACTICAL_MARGIN.right,
            y: y - Button.IMG_BTN_PRACTICAL_MARGIN.top - Button.IMG_BTN_PRACTICAL_MARGIN.bottom,
        };

        const txtSize = {
            x: realBtnSize.x - 2 * (Button.IMG_BTN_BOX_MARGIN.left + Button.IMG_BTN_BOX_MARGIN.right),
            y: y,
        };

        Gtk.setUiPosition(this._txtLabel,
            2 * Button.IMG_BTN_BOX_MARGIN.left,
            0);
        Gtk.setUiSize(this._txtLabel,
            txtSize.x,
            txtSize.y);
        Gtk.setUiPosition(this._cnvClickAnim,
            Button.IMG_BTN_PRACTICAL_MARGIN.left,
            Button.IMG_BTN_PRACTICAL_MARGIN.top,
        );
        Gtk.setUiSize(this._cnvClickAnim,
            realBtnSize.x,
            realBtnSize.y);
        Gtk.setUiPosition(this._imgHighlight,
            Button.IMG_BTN_PRACTICAL_MARGIN.left,
            Button.IMG_BTN_PRACTICAL_MARGIN.top,
        );
        Gtk.setUiSize(this._imgHighlight,
            realBtnSize.x,
            realBtnSize.y);

        const diameter = 2 * Math.sqrt(x * x + y * y);
        Gtk.setUiSize(this._imgClickAnim, diameter, diameter);

        return this;
    }

    private setColor(): this {
        this._btn.setNormalImageColorByHex(ColorHexWithAlpha(this._option.color.primary, 1));
        switch (this._option.variant) {
            case "outlined":
                this._txtLabel.setFontColorByHex(ColorHexWithAlpha(this._option.color.primary, 1));
                break;
            case "contained":
            default:
                this._txtLabel.setFontColorByHex(Color.White);
                break;
        }

        return this;
    }

    private playClickAnimAt(x: number, y: number) {
        this._animScale = 0;
        this._animOpacity = 1;
        Gtk.setUiScale(this._imgClickAnim, 0, 0);
        this._imgClickAnim.renderOpacity = 1;

        Gtk.setUiPosition(this._imgClickAnim,
            x - this._imgClickAnim.size.x / 2,
            y - this._imgClickAnim.size.y / 2);
    }

    private renderAnimHandler = (dt: number) => {
        if (this._imgClickAnim.renderOpacity > 0) {
            Gtk.setUiScale(this._imgClickAnim, this._animScale, this._animScale);
            this._imgClickAnim.renderOpacity = this._animOpacity;

            this._animOpacity = Math.max(0, this._animOpacity - dt / 0.5);
            this._animScale = Math.min(1, this._animScale + dt / 0.25);
        }

        if (this._hovered && this._imgHighlight.renderOpacity < 1) {
            this._imgHighlight.renderOpacity = this._animHighlight;
            this._animHighlight = Math.min(1, this._animHighlight + dt / 0.1);
        }

        if (!this._hovered && this._imgHighlight.renderOpacity > 0) {
            this._imgHighlight.renderOpacity = this._animHighlight;
            this._animHighlight = Math.max(0, this._animHighlight - dt / 0.1);
        }
    };

    public preview(): this {
        Gtk.setUiScale(this._imgClickAnim, 0.5, 0.5);
        this._imgClickAnim.renderOpacity = 0.75;

        Gtk.setUiPosition(this._imgClickAnim,
            this._cnvClickAnim.size.x - this._imgClickAnim.size.x / 2,
            this._cnvClickAnim.size.y - this._imgClickAnim.size.y / 2);

        mw.TimeUtil.onEnterFrame.remove(this.renderAnimHandler);

        return this;
    }
}

export type ButtonVariant = "contained" | "outlined";

export interface ButtonOption {
    size?: { x: number, y: number };

    color?: ThemeColor;

    fontSize?: Property.FontSize;

    fontStyle?: Property.FontStyle;

    textAlign?: Property.TextAlign;

    variant?: ButtonVariant;
}