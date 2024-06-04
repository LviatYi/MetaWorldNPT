import Gtk, { Delegate } from "../../util/GToolkit";
import ThemeColor, { Color, ColorUtil, Interval, NormalThemeColor } from "../Theme";
import { Property, PropertyUtil } from "../Style";
import { Component } from "./Component";
import { Lui } from "../Asset";
import { ClickEvent } from "../event/ClickEvent";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import { Box } from "./Box";

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
    private _btn: mw.Button;

    private _box: Box;

    private _cnvClickAnim: mw.Canvas;

    private _imgClickAnim: mw.Image;

    private _txtLabel: mw.TextBlock;

    private _cnvIcon: mw.Canvas;

    private _imgIcon: mw.Image;

    private _imgHighlight: mw.Image;

    private _option: Readonly<Required<ButtonOption>> = undefined;

    private _hovered: boolean = false;

//#region Lui Component
    public static create(option?: ButtonOption): Button {
        let btn = new Button();

        btn._option = Button.defaultOption(option);
        btn.initRoot();

        if (btn._option.variant === "contained") {
            btn._box = Box
                .create(btn._option)
                .attach(btn);
        }

        btn._btn = mw.Button.newObject(btn.root, "btn");
        btn._btn.visibility = mw.SlateVisibility.Visible;
        btn._btn.normalImageGuid = Lui.Asset.ImgRoundedRectangleOutline;
        if (btn._option.variant === "contained") {
            btn._btn.normalImageDrawType = mw.SlateBrushDrawType.NoDrawType;
        } else {
            btn._btn.normalImageDrawType = mw.SlateBrushDrawType.PixcelBox;
            btn._btn.normalImageMargin = new mw.Margin(
                Lui.Asset.ImgRoundedRectangleBoxMargin.left,
                Lui.Asset.ImgRoundedRectangleBoxMargin.top,
                Lui.Asset.ImgRoundedRectangleBoxMargin.right,
                Lui.Asset.ImgRoundedRectangleBoxMargin.bottom,
            );
        }
        btn._btn.transitionEnable = false;

        btn._cnvClickAnim = mw.Canvas.newObject(btn.root, "cnvClickAnim");
        btn._cnvClickAnim.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        btn._cnvClickAnim.clipEnable = true;

        btn._imgClickAnim = mw.Image.newObject(btn._cnvClickAnim, "imgClickAnim");
        btn._imgClickAnim.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        Gtk.setUiScale(btn._imgClickAnim, 0, 0);
        btn._imgClickAnim.renderOpacity = 0;
        btn._imgClickAnim.imageGuid = Lui.Asset.ImgCircle;
        btn._imgClickAnim.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 0.25));

        btn._txtLabel = mw.TextBlock.newObject(btn.root, "txtLabel");
        Gtk.trySetVisibility(
            btn._txtLabel,
            Gtk.isNullOrEmpty(btn._option.iconGuid) && !btn._option.renderIcon);
        btn._txtLabel.autoAdjust = false;
        PropertyUtil.applyFontSize(btn._txtLabel, btn._option.fontSize);
        btn._txtLabel.glyph = btn._option.fontStyle;
        PropertyUtil.applyTextAlign(btn._txtLabel, btn._option.textAlign);
        btn._txtLabel.textVerticalAlign = mw.TextVerticalJustify.Center;
        if (!Gtk.isNullOrEmpty(btn._option.label)) Gtk.trySetText(btn._txtLabel, btn._option.label);

        btn._cnvIcon = mw.Canvas.newObject(btn.root, "cnvIcon");
        Gtk.trySetVisibility(
            btn._cnvIcon,
            !Gtk.isNullOrEmpty(btn._option.iconGuid) || !!btn._option.renderIcon);
        btn._cnvIcon.autoLayoutEnable = false;
        btn._cnvIcon.clipEnable = true;
        if (btn._option.renderIcon) {
            btn._cnvIcon.addChild(btn._option.renderIcon);
        }

        btn._imgIcon = mw.Image.newObject(btn._cnvIcon, "imgIcon");
        if (btn._option.iconGuid) {
            Gtk.trySetVisibility(btn._cnvIcon, true);
            btn._imgIcon.imageGuid = btn._option.iconGuid;
            btn._imgIcon.imageDrawType = mw.SlateBrushDrawType.Image;
        } else {
            Gtk.trySetVisibility(btn._cnvIcon, false);
            btn._imgIcon.imageDrawType = mw.SlateBrushDrawType.NoDrawType;
        }

        btn._imgHighlight = mw.Image.newObject(btn.root, "imgHighlight");
        btn._imgHighlight.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        btn._imgHighlight.imageGuid = Lui.Asset.ImgRoundedRectangle;
        btn._imgHighlight.imageDrawType = mw.SlateBrushDrawType.PixcelBox;
        btn._imgHighlight.margin = new mw.Margin(
            Lui.Asset.ImgRoundedRectangleBoxMargin.left,
            Lui.Asset.ImgRoundedRectangleBoxMargin.top,
            Lui.Asset.ImgRoundedRectangleBoxMargin.right,
            Lui.Asset.ImgRoundedRectangleBoxMargin.bottom,
        );
        btn._imgHighlight.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 0.25));
        btn._imgHighlight.renderOpacity = 0;

        btn.setSize();
        btn.setColor();

        btn._btn.onClicked.add(() => {
            const clickAt = mw.absoluteToLocal(
                btn.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            btn.playClickAnimAt(clickAt.x, clickAt.y);
            btn._hovered = false;
            btn._imgHighlight.renderOpacity = 0;

            try {
                btn.onClick.invoke({position: {x: clickAt.x, y: clickAt.y}});
            } catch (e) {
                Log4Ts.error(Button, `error occurs in onClick.`, e);
            }
        });

        btn._btn.onHovered.add(() => {
            if (btn._imgClickAnim.renderOpacity <= 0) btn._hovered = true;
        });
        btn._btn.onUnhovered.add(() => btn._hovered = false);

        mw.TimeUtil.onEnterFrame.add(btn.renderAnimHandler);
        return btn;
    };

    public static defaultOption(option?: ButtonOption): Required<ButtonOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 240, y: 80};
        if (!option.padding) option.padding = {};
        if (!option.color) option.color = NormalThemeColor;
        if (!option.fontSize) option.fontSize = 36;
        if (!option.fontStyle) option.fontStyle = mw.UIFontGlyph.Light;
        if (!option.textAlign) option.textAlign = "center";
        if (!option.variant) option.variant = "contained";
        if (!option.corner) option.corner = 0;

        return option as Required<ButtonOption>;
    };

    protected destroy() {
        mw.TimeUtil.onEnterFrame.remove(this.renderAnimHandler);
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
        Gtk.setUiPosition(this._btn, pl, pt);
        Gtk.setUiSize(this._btn, contentX, contentY);
        Gtk.setUiPosition(this._txtLabel, pl, pt);
        Gtk.setUiSize(this._txtLabel, contentX, contentY);

        const realBtnSize = {
            x: contentX,
            y: contentY,
        };

        const txtSize = {
            x: realBtnSize.x - 2 * (Lui.Asset.ImgRoundedRectangleBoxMargin.left + Lui.Asset.ImgRoundedRectangleBoxMargin.right),
            y: contentY,
        };

        Gtk.setUiPosition(this._txtLabel,
            pl + 2 * Lui.Asset.ImgRoundedRectangleBoxMargin.left,
            pt);
        Gtk.setUiSize(this._txtLabel,
            txtSize.x,
            txtSize.y);
        Gtk.setUiPosition(this._cnvClickAnim,
            pl,
            pt,
        );
        Gtk.setUiSize(this._cnvClickAnim,
            realBtnSize.x,
            realBtnSize.y);
        let minContent = Math.min(contentX, contentY);
        Gtk.setUiPosition(this._cnvIcon,
            pl + (contentX - minContent) / 2,
            pt + (contentY - minContent) / 2);
        Gtk.setUiSize(this._cnvIcon, minContent, minContent);
        Gtk.setUiPosition(this._imgIcon,
            pl + (contentX - minContent) / 2,
            pt + (contentY - minContent) / 2);
        Gtk.setUiSize(this._imgIcon, minContent, minContent);
        if (this._option.renderIcon) {
            Gtk.setUiPosition(this._option.renderIcon,
                pl + (contentX - minContent) / 2,
                pt + (contentY - minContent) / 2);
            Gtk.setUiSize(this._option.renderIcon, minContent, minContent);
        }
        Gtk.setUiPosition(this._imgHighlight,
            pl,
            pt,
        );
        Gtk.setUiSize(this._imgHighlight,
            realBtnSize.x,
            realBtnSize.y);

        const diameter = 2 * Math.sqrt(contentX * contentX + contentY * contentY);
        Gtk.setUiSize(this._imgClickAnim, diameter, diameter);

        return this;
    }

    private setColor(): this {
        this._btn.setNormalImageColorByHex(ColorUtil.colorHexWithAlpha(this._option.color.primary, 1));
        switch (this._option.variant) {
            case "outlined":
                this._txtLabel.setFontColorByHex(ColorUtil.colorHexWithAlpha(this._option.color.primary, 1));
                break;
            case "contained":
            default:
                this._txtLabel.setFontColorByHex(Color.White);
                break;
        }

        return this;
    }

    private renderAnimHandler = (dt: number) => {
        if (this._imgClickAnim.renderOpacity > 0) {
            let scale = Math.min(1, this._imgClickAnim.renderScale.x + dt / Interval.Fast);
            Gtk.setUiScale(this._imgClickAnim, scale, scale);
            this._imgClickAnim.renderOpacity = Math.max(0, this._imgClickAnim.renderOpacity - dt / Interval.Normal);
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

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private playClickAnimAt(x: number, y: number) {
        Gtk.setUiScale(this._imgClickAnim, 0, 0);
        this._imgClickAnim.renderOpacity = 1;

        Gtk.setUiPosition(this._imgClickAnim,
            x - this._imgClickAnim.size.x / 2,
            y - this._imgClickAnim.size.y / 2);
    }

    public preview(): this {
        Gtk.setUiScale(this._imgClickAnim, 0.5, 0.5);
        this._imgClickAnim.renderOpacity = 0.75;

        Gtk.setUiPosition(this._imgClickAnim,
            this._cnvClickAnim.size.x - this._imgClickAnim.size.x / 2,
            this._cnvClickAnim.size.y - this._imgClickAnim.size.y / 2);

        mw.TimeUtil.onEnterFrame.remove(this.renderAnimHandler);

        return this;
    }

//#region CallBack
    public onClick: Delegate.SimpleDelegate<ClickEvent> = new Delegate.SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export type ButtonVariant = "contained" | "outlined";

export interface ButtonOption {
    label?: string;

    size?: { x: number, y: number };

    padding?: Property.Padding;

    color?: ThemeColor;

    fontSize?: Property.FontSize;

    fontStyle?: Property.FontStyle;

    textAlign?: Property.TextAlign;

    iconGuid?: string;

    renderIcon?: mw.Widget;

    variant?: ButtonVariant;

    corner?: Property.Corner;
}