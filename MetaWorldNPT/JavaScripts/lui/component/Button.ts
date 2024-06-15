import Gtk, { Delegate } from "gtoolkit";
import { Property, PropertyUtil } from "../style/Property";
import { Component, ComponentOption, extractLayoutFromOption, overrideOption } from "./Component";
import { Lui } from "../style/Asset";
import { ClickEvent } from "../event/ClickEvent";
import { Box } from "./Box";
import hasCorner = PropertyUtil.hasCorner;
import ColorUtil = Lui.Asset.ColorUtil;
import Color = Lui.Asset.Color;
import NormalThemeColor = Lui.Asset.NormalThemeColor;
import Interval = Lui.Asset.Interval;
import ThemeColor = Lui.Asset.ThemeColor;

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

    private _icon?: Component;

    private _imgIcon?: mw.Image;

    private _imgHighlight: mw.Image;

    private _option: Readonly<Required<ButtonOption>> = undefined;

    private _hovered: boolean = false;

    private _pressed: boolean = false;

    public get enable() {
        return this._btn?.enable ?? false;
    }

    public set enable(value: boolean) {
        if (this._btn) this._btn.enable = value;
    }

//#region Lui Component
    public static create(option?: ButtonOption): Button {
        let btn = new Button();

        btn.root.name = "LuiButton";

        btn._option = Button.defaultOption(option);

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

        if (btn._option.icon) {
            btn._icon = btn._option.icon.attach(btn);
        } else if (!Gtk.isNullOrEmpty(btn._option.iconImage)) {
            btn._imgIcon = mw.Image.newObject(btn.root, "imgIcon");
            btn._imgIcon.imageGuid = btn._option.iconImage;
            btn._imgIcon.imageDrawType = mw.SlateBrushDrawType.Image;
        } else {
            btn._txtLabel = mw.TextBlock.newObject(btn.root, "txtLabel");
            btn._txtLabel.autoAdjust = false;
            PropertyUtil.applyFontSize(btn._txtLabel, btn._option.fontSize);
            btn._txtLabel.glyph = btn._option.fontStyle;
            PropertyUtil.applyTextAlign(btn._txtLabel, btn._option.textAlign);
            btn._txtLabel.textVerticalAlign = mw.TextVerticalJustify.Center;
            Gtk.trySetText(btn._txtLabel, btn._option.label);
        }

        btn._imgHighlight = mw.Image.newObject(btn.root, "imgHighlight");
        btn._imgHighlight.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        if (hasCorner(btn._option.corner, Property.Corner.All)) {
            btn._imgHighlight.imageGuid = Lui.Asset.ImgRectangle;
            btn._imgHighlight.imageDrawType = mw.SlateBrushDrawType.Image;
        } else {
            btn._imgHighlight.imageGuid = Lui.Asset.ImgRoundedRectangle;
            btn._imgHighlight.imageDrawType = mw.SlateBrushDrawType.PixcelBox;
            btn._imgHighlight.margin = new mw.Margin(
                Lui.Asset.ImgRoundedRectangleBoxMargin.left,
                Lui.Asset.ImgRoundedRectangleBoxMargin.top,
                Lui.Asset.ImgRoundedRectangleBoxMargin.right,
                Lui.Asset.ImgRoundedRectangleBoxMargin.bottom,
            );
        }
        btn._imgHighlight.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 0.25));
        btn._imgHighlight.renderOpacity = 0;

        btn.setLayout(btn._option);
        btn.setColor();

        btn._btn.onClicked.add(() => {
            const clickAt = mw.absoluteToLocal(
                btn.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            btn.onClick.invoke({position: {x: clickAt.x, y: clickAt.y}});
        });
        btn._btn.onPressed.add(() => {
            const clickAt = mw.absoluteToLocal(
                btn.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            btn.playClickAnimAt(clickAt.x, clickAt.y);
            btn._hovered = false;
            btn._imgHighlight.renderOpacity = 0;
            btn._pressed = true;

            btn.onPress.invoke({position: {x: clickAt.x, y: clickAt.y}});
        });

        btn._btn.onReleased.add(() => {
            const clickAt = mw.absoluteToLocal(
                btn.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            btn._pressed = false;

            btn.onRelease.invoke({position: {x: clickAt.x, y: clickAt.y}});
        });

        btn._btn.onHovered.add(() => {
            if (btn._imgClickAnim.renderOpacity <= 0) btn._hovered = true;
        });
        btn._btn.onUnhovered.add(() => btn._hovered = false);

        return btn;
    }

    public static defaultOption(option?: ButtonOption): Required<ButtonOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 240, y: 80};
        if (!option.padding) option.padding = {};
        if (!option.label) option.label = "Button";
        if (!option.color) option.color = NormalThemeColor;
        if (!option.fontSize) option.fontSize = 28;
        if (!option.fontStyle) option.fontStyle = mw.UIFontGlyph.Light;
        if (!option.textAlign) option.textAlign = "center";
        if (!option.variant) option.variant = "contained";
        if (!option.corner) option.corner = 0;

        return option as Required<ButtonOption>;
    }

    protected renderAnimHandler = (dt: number) => {
        if (!this._btn.enable && this._imgClickAnim.renderOpacity < 1) {
            Gtk.setUiPosition(this._imgClickAnim,
                (this._option.padding.left ?? 0) - this._imgClickAnim.size.x / 2,
                (this._option.padding.top ?? 0) - this._imgClickAnim.size.y / 2);
            Gtk.setUiScale(this._imgClickAnim, 1, 1);
            this._imgClickAnim.renderOpacity = 1;
            return;
        }

        if (this._pressed) {
            if (this._imgClickAnim.renderScale.x < 1) {
                let scale = Math.min(1, this._imgClickAnim.renderScale.x + dt / Interval.Fast);
                Gtk.setUiScale(this._imgClickAnim, scale, scale);
            }
        } else if (this._imgClickAnim.renderOpacity > 0) {
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

    public setLayout(option: ButtonOption): this {
        overrideOption(this._option, option);
        super.setLayout(this._option);
        let [[x, y],
            [pt, pr, pb, pl],
            [contentX, contentY],
        ] = extractLayoutFromOption(this._option);

        this._box?.setLayout(option);

        Gtk.setUiPosition(this._btn, pl, pt);
        Gtk.setUiSize(this._btn, contentX, contentY);

        const txtSize = {
            x: contentX - 2 * (
                Lui.Asset.ImgRoundedRectangleBoxMargin.left +
                Lui.Asset.ImgRoundedRectangleBoxMargin.right),
            y: contentY,
        };
        Gtk.setUiPosition(this._cnvClickAnim,
            pl,
            pt,
        );
        Gtk.setUiSize(this._cnvClickAnim,
            contentX,
            contentY);
        let minContent = Math.min(contentX, contentY);
        if (this._icon) {
            const iconSize = Math.floor(minContent * 0.618);
            this._icon.setLayout({size: {x: iconSize, y: iconSize}});
            Gtk.setUiPosition(this._option.icon.root,
                pl + (contentX - iconSize) / 2,
                pt + (contentY - iconSize) / 2);
        } else if (this._imgIcon) {
            Gtk.setUiSize(this._imgIcon, minContent, minContent);
            Gtk.setUiPosition(this._imgIcon,
                pl + (contentX - minContent) / 2,
                pt + (contentY - minContent) / 2);
        } else {
            Gtk.setUiPosition(this._txtLabel, pl, pt);
            Gtk.setUiSize(this._txtLabel, contentX, contentY);
            Gtk.setUiPosition(this._txtLabel,
                pl + 2 * Lui.Asset.ImgRoundedRectangleBoxMargin.left,
                pt);
            Gtk.setUiSize(this._txtLabel,
                txtSize.x,
                txtSize.y);
        }

        Gtk.setUiPosition(this._imgHighlight,
            pl,
            pt,
        );
        Gtk.setUiSize(this._imgHighlight,
            contentX,
            contentY);

        const diameter = 2 * Math.sqrt(contentX * contentX + contentY * contentY);
        Gtk.setUiSize(this._imgClickAnim, diameter, diameter);

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public preview(): this {
        Gtk.setUiScale(this._imgClickAnim, 0.5, 0.5);
        this._imgClickAnim.renderOpacity = 0.75;

        Gtk.setUiPosition(this._imgClickAnim,
            this._cnvClickAnim.size.x - this._imgClickAnim.size.x / 2,
            this._cnvClickAnim.size.y - this._imgClickAnim.size.y / 2);

        mw.TimeUtil.onEnterFrame.remove(this["renderAnim"]);

        return this;
    }

//#region Init

    private setColor(): this {
        this._btn.setNormalImageColorByHex(ColorUtil.colorHexWithAlpha(this._option.color.primary, 1));
        switch (this._option.variant) {
            case "outlined":
                this._txtLabel?.setFontColorByHex(ColorUtil.colorHexWithAlpha(this._option.color.primary, 1));
                break;
            case "contained":
            default:
                this._txtLabel?.setFontColorByHex(Color.White);
                break;
        }

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private playClickAnimAt(x: number, y: number) {
        Gtk.setUiScale(this._imgClickAnim, 0, 0);
        this._imgClickAnim.renderOpacity = 1;

        Gtk.setUiPosition(this._imgClickAnim,
            x - this._imgClickAnim.size.x / 2,
            y - this._imgClickAnim.size.y / 2);
    }

//#region CallBack
    public onClick: Delegate.SimpleDelegate<ClickEvent> = new Delegate.SimpleDelegate();

    public onPress: Delegate.SimpleDelegate<ClickEvent> = new Delegate.SimpleDelegate();

    public onRelease: Delegate.SimpleDelegate<ClickEvent> = new Delegate.SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export type ButtonVariant = "contained" | "outlined";

export interface ButtonOption extends ComponentOption {
    label?: string;

    color?: ThemeColor;

    fontSize?: Property.FontSize;

    fontStyle?: Property.FontStyle;

    textAlign?: Property.TextAlign;

    iconImage?: string;

    icon?: Component;

    variant?: ButtonVariant;

    corner?: Property.Corner;
}