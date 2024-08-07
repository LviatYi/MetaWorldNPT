import Log4Ts from "mw-log4ts";
import Gtk, { Delegate } from "gtoolkit";
import { Property, PropertyUtil } from "../style/Property";
import { Component, ComponentOption, overrideOption } from "./Component";
import { Lui } from "../style/Asset";
import { ClickEvent } from "../event/ClickEvent";
import SlateVisibility = mw.SlateVisibility;
import SimpleDelegate = Delegate.SimpleDelegate;
import ColorUtil = Lui.Asset.ColorUtil;
import Color = Lui.Asset.Color;
import NormalThemeColor = Lui.Asset.NormalThemeColor;
import Interval = Lui.Asset.Interval;
import ThemeColor = Lui.Asset.ThemeColor;

/**
 * Avatar.
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
export class Avatar extends Component {
    private _circleMasks: mw.Canvas[];

    private get realRoot(): mw.Canvas {
        return this._circleMasks?.[(this._circleMasks?.length ?? 0) - 1] ?? this.root;
    }

    private _imgBgIcon: mw.Image;

    private _btnIcon: mw.Button;

    private _cnvClickAnim: mw.Canvas;

    private _imgClickAnim: mw.Image;

    private _imgHighlight: mw.Image;

    private _txtLabel: mw.TextBlock;

    private _option: Readonly<Required<AvatarOption>> = undefined;

    private _hovered: boolean = false;

//#region Lui Component
    public static create(option?: AvatarOption): Avatar {
        let avatar = new Avatar();

        avatar.root.name="LuiAvatar";

        avatar._option = Avatar.defaultOption(option);
        if (avatar._option.variant === "circle") {
            let precision = PropertyUtil.getMaskPrecisionByEffectLevel(avatar._option.effectLevel);
            avatar._circleMasks = [];
            let lastMask = avatar.root;
            let angle = 90 / precision;
            for (let i = 0; i < precision; ++i) {
                lastMask = mw.Canvas.newObject(lastMask, `mask${i}`);
                lastMask.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                lastMask.clipEnable = true;
                lastMask.renderTransformAngle = avatar._circleMasks.length === 0 ? angle - 90 : angle;

                avatar._circleMasks.push(lastMask);
            }
        }

        let realRoot = avatar.realRoot;
        avatar._imgBgIcon = mw.Image.newObject(realRoot, "imgBgIcon");
        Gtk.setUiPosition(avatar._imgBgIcon, 1, 1);
        avatar._imgBgIcon.imageGuid = avatar._option.variant === "circle" ?
            Lui.Asset.ImgCircle :
            Lui.Asset.ImgRectangle;

        avatar._btnIcon = mw.Button.newObject(realRoot, "btnIcon");
        Gtk.setUiPosition(avatar._btnIcon, 1, 1);
        avatar._btnIcon.visibility = mw.SlateVisibility.Visible;
        if (avatar._option.labelIcon) {
            avatar._btnIcon.normalImageGuid = avatar._option.labelIcon;
            avatar._btnIcon.normalImageDrawType = mw.SlateBrushDrawType.Image;
        } else {
            avatar._btnIcon.normalImageDrawType = mw.SlateBrushDrawType.NoDrawType;
        }
        avatar._btnIcon.transitionEnable = false;
        avatar._btnIcon.setNormalImageColorByHex(ColorUtil.colorHexWithAlpha(Color.White, 1));

        avatar._cnvClickAnim = mw.Canvas.newObject(realRoot, "cnvClickAnim");
        Gtk.setUiPosition(avatar._cnvClickAnim, 1, 1);
        avatar._cnvClickAnim.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        avatar._cnvClickAnim.clipEnable = true;

        avatar._imgClickAnim = mw.Image.newObject(avatar._cnvClickAnim, "imgClickAnim");
        avatar._imgClickAnim.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        Gtk.setUiScale(avatar._imgClickAnim, 0, 0);
        avatar._imgClickAnim.renderOpacity = 0;
        avatar._imgClickAnim.imageGuid = Lui.Asset.ImgCircle;
        avatar._imgClickAnim.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 0.25));

        avatar._imgHighlight = mw.Image.newObject(avatar.root, "imgHighlight");
        Gtk.setUiPosition(avatar._imgHighlight, 1, 1);
        avatar._imgHighlight.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        avatar._imgHighlight.imageGuid = Lui.Asset.ImgRectangle;
        avatar._imgHighlight.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.White, 0.2));
        avatar._imgHighlight.renderOpacity = 0;

        avatar._txtLabel = mw.TextBlock.newObject(avatar.root, "txtLabel");
        Gtk.setUiPosition(avatar._txtLabel, 1, 1);
        avatar._txtLabel.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        avatar._txtLabel.autoAdjust = false;
        PropertyUtil.applyFontSize(avatar._txtLabel, option.fontSize);
        avatar._txtLabel.glyph = option.fontStyle;
        avatar._txtLabel.textAlign = mw.TextJustify.Center;
        avatar._txtLabel.textVerticalAlign = mw.TextVerticalJustify.Center;

        avatar.setLayout(avatar._option);
        avatar.setColor();
        avatar.setAvatarLabel();

        avatar._btnIcon.onClicked.add(() => {
            const clickAt = mw.absoluteToLocal(
                avatar.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            avatar.playClickAnimAt(clickAt.x, clickAt.y);
            avatar._hovered = false;

            try {
                avatar.onClick.invoke({position: {x: clickAt.x, y: clickAt.y}});
            } catch (e) {
                Log4Ts.error(Avatar, `error occurs in onClick.`, e);
            }
        });

        avatar._btnIcon.onHovered.add(() => {
            if (avatar._imgClickAnim.renderOpacity <= 0) avatar._hovered = true;
        });
        avatar._btnIcon.onUnhovered.add(() => avatar._hovered = false);

        mw.TimeUtil.onEnterFrame.add(avatar.renderAnimHandler);
        return avatar;
    }

    public static defaultOption(option?: AvatarOption): Required<AvatarOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 40, y: 40};
        if (!option.labelText) option.labelText = "";
        if (!option.labelIcon || option.labelIcon === "") option.labelIcon = undefined;
        if (!option.color) option.color = NormalThemeColor;
        if (!option.fontSize) option.fontSize = 18;
        if (!option.fontStyle) option.fontStyle = mw.UIFontGlyph.Light;
        if (!option.variant) option.variant = "circle";
        if (!option.effectLevel) option.effectLevel = "medium";

        return option as Required<AvatarOption>;
    }

    protected renderAnimHandler = (dt: number) => {
        if (this._imgClickAnim.renderOpacity > 0) {
            let scale = Math.min(1, this._imgClickAnim.renderScale.x + dt / Interval.Fast);
            Gtk.setUiScale(this._imgClickAnim, scale, scale);
            this._imgClickAnim.renderOpacity = Math.max(0, this._imgClickAnim.renderOpacity - dt / Interval.Normal);
        }

        if (this._hovered && this._imgHighlight.renderOpacity < 1) {
            this._imgHighlight.renderOpacity = Math.min(1, this._imgHighlight.renderOpacity + dt / Interval.VeryFast);
        }

        if (!this._hovered && this._imgHighlight.renderOpacity > 0) {
            this._imgHighlight.renderOpacity = Math.max(0, this._imgHighlight.renderOpacity - dt / Interval.VeryFast);
        }
    };

    public setLayout(option: AvatarOption): this {
        overrideOption(this._option, option);
        super.setLayout(this._option);

        let size = Math.min(this._option.size.x, this._option.size.y);
        let spaceHoriz = (this._option.size.x - size) / 2;
        let spaceVert = (this._option.size.y - size) / 2;

        if (this._circleMasks) {
            for (let i = 0; i < this._circleMasks.length; i++) {
                const mask = this._circleMasks[i];
                Gtk.setUiSize(mask, size + 2, size + 2);
                if (i === 0) {
                    Gtk.setUiPosition(mask, spaceHoriz - 1, spaceVert - 1);
                } else {
                    Gtk.setUiPosition(mask, 0, 0);
                }
            }
        }

        Gtk.setUiSize(this._imgBgIcon, size, size);
        Gtk.setUiSize(this._cnvClickAnim, size, size);
        Gtk.setUiSize(this._btnIcon, size, size);
        Gtk.setUiSize(this._txtLabel, size, size);
        Gtk.setUiSize(this._imgHighlight, size, size);

        if (this.realRoot === this.root) {
            Gtk.setUiPosition(this._imgBgIcon, spaceHoriz, spaceVert);
            Gtk.setUiPosition(this._cnvClickAnim, spaceHoriz, spaceVert);
            Gtk.setUiPosition(this._btnIcon, spaceHoriz, spaceVert);
        }
        Gtk.setUiPosition(this._txtLabel, spaceHoriz, spaceVert);
        Gtk.setUiPosition(this._imgHighlight, spaceHoriz, spaceVert);

        const diameter = this._option.variant === "square" ?
            2 * Math.sqrt(size * size * 2) :
            2 * size;
        Gtk.setUiSize(this._imgClickAnim, diameter, diameter);

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Init
    private setColor(): this {
        this._imgBgIcon.setImageColorByHex(ColorUtil.colorHexWithAlpha(this._option.color.primary, 1));
        if (ColorUtil.isBrightness(this._imgBgIcon.imageColor.r,
            this._imgBgIcon.imageColor.g,
            this._imgBgIcon.imageColor.b)) {
            this._txtLabel.setFontColorByHex(ColorUtil.colorHexWithAlpha(Color.Black, 1));
        } else {
            this._txtLabel.setFontColorByHex(ColorUtil.colorHexWithAlpha(Color.White, 1));
        }

        return this;
    }

    private setAvatarLabel(): this {
        if (this._option.labelIcon) {
            this._txtLabel.visibility = SlateVisibility.Collapsed;
        } else {
            this._txtLabel.visibility = SlateVisibility.SelfHitTestInvisible;
            let text = this._option.labelText;
            let shown: string;
            if (!text || text.length === 0) {
                shown = "";
            } else if (/^[a-zA-Z0-9 ]+$/.test(text)) {
                let words = text.split(" ").filter(word => word.length > 0);
                if (words.length > 1) {
                    words.length = 2;
                    shown = words.map(word => word.slice(0, 1).toUpperCase()).join("");
                } else {
                    text = words[0];
                    shown = text.match(/[A-Z]/g)?.slice(0, 2).join("") ?? text.slice(0, 1).toUpperCase();
                }
            } else {
                shown = text.match(/\S/)[0];
            }
            Gtk.trySetText(this._txtLabel, shown);
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

    public preview(): this {
        Gtk.setUiScale(this._imgClickAnim, 0.5, 0.5);
        this._imgClickAnim.renderOpacity = 0.75;

        Gtk.setUiPosition(this._imgClickAnim,
            this._btnIcon.position.x + this._btnIcon.size.x - this._imgClickAnim.size.x / 2,
            this._btnIcon.position.y + this._btnIcon.size.y - this._imgClickAnim.size.y / 2);

        mw.TimeUtil.onEnterFrame.remove(this.renderAnimHandler);

        return this;
    }

//#region CallBack
    public onClick: SimpleDelegate<ClickEvent> = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export type AvatarVariant = "square" | "circle";

export interface AvatarOption extends ComponentOption {
    /**
     * 标签 文本.
     * @desc 与 labelIcon 互斥.
     * @desc labelIcon 优先生效.
     */
    labelText?: string;

    /**
     * 标签 图标.
     * @desc 与 labelText 互斥.
     * @desc labelIcon 优先生效.
     */
    labelIcon?: string;

    color?: ThemeColor;

    fontSize?: Property.FontSize;

    fontStyle?: Property.FontStyle;

    variant?: AvatarVariant;

    /**
     * 遮罩精度.
     * @desc 过高将带来性能问题.
     * @desc 过低将影响性能.
     * @desc 默认值为 6.
     */
    effectLevel?: Property.EffectLevel;
}
