import Gtk, { Delegate } from "gtoolkit";
import { Property, PropertyUtil } from "../style/Property";
import { Component, ComponentOption, extractLayoutFromOption, overrideOption } from "./Component";
import { Lui } from "../style/Asset";
import { ClickEvent } from "../event/ClickEvent";
import Interval = Lui.Asset.Interval;

/**
 * Dialogue.
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
export class Dialogue extends Component {
    private _btnModal: mw.Button;

    private _imgBack: mw.Image;

    private _txtTitle: mw.TextBlock;

    private _txtMessage: mw.TextBlock;

    private _btnList: Button[];

    private _option: Required<DialogueOption>;

//#region Lui Component
    public static create(option?: DialogueOption): Dialogue {
        let dialogue = new Dialogue();

        dialogue._option = Dialogue.defaultOption(option);

        dialogue._btnModal = mw.Button.newObject(dialogue.root, "btnModal");
        Gtk.trySetVisibility(dialogue._btnModal, true);
        dialogue._btnModal.normalImageDrawType = mw.SlateBrushDrawType.NoDrawType;
        dialogue._btnModal.transitionEnable = false;

        dialogue._imgBack = mw.Image.newObject(dialogue.root, "imgBack");
        Gtk.trySetVisibility(dialogue._imgBack, true);
        dialogue._imgBack.imageGuid = Lui.Asset.ImgRoundedRectangle;
        dialogue._imgBack.imageDrawType = mw.SlateBrushDrawType.PixcelBox;
        dialogue._imgBack.margin = new mw.Margin(
            Lui.Asset.ImgRoundedRectangleBoxMargin.left,
            Lui.Asset.ImgRoundedRectangleBoxMargin.top,
            Lui.Asset.ImgRoundedRectangleBoxMargin.right,
            Lui.Asset.ImgRoundedRectangleBoxMargin.bottom,
        );

        dialogue._txtTitle = mw.TextBlock.newObject(dialogue.root, "txtTitle");
        PropertyUtil.applyFontSize(dialogue._txtTitle,
            typeof dialogue._option.fontSize === "number" ?
                Math.ceil(dialogue._option.fontSize * 1.5) :
                dialogue._option.fontSize);
        dialogue._txtTitle.glyph = mw.UIFontGlyph.Bold;
        dialogue._txtTitle.autoAdjust = false;
        dialogue._txtTitle.text = dialogue._option.title ?? "";
        dialogue._txtMessage = mw.TextBlock.newObject(dialogue.root, "txtMessage");
        PropertyUtil.applyFontSize(dialogue._txtMessage, dialogue._option.fontSize);
        dialogue._txtMessage.glyph = mw.UIFontGlyph.Light;
        dialogue._txtMessage.autoAdjust = false;
        dialogue._txtMessage.text = dialogue._option.message ?? "";

        dialogue.setLayout(dialogue._option);
        dialogue.setColor();

        dialogue._btn.onClicked.add(() => {
            const clickAt = mw.absoluteToLocal(
                dialogue.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            dialogue.onClick.invoke({position: {x: clickAt.x, y: clickAt.y}});
        });
        dialogue._btn.onPressed.add(() => {
            const clickAt = mw.absoluteToLocal(
                dialogue.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            dialogue.playClickAnimAt(clickAt.x, clickAt.y);
            dialogue._hovered = false;
            dialogue._imgHighlight.renderOpacity = 0;
            dialogue._pressed = true;

            dialogue.onPress.invoke({position: {x: clickAt.x, y: clickAt.y}});
        });

        dialogue._btn.onReleased.add(() => {
            const clickAt = mw.absoluteToLocal(
                dialogue.root.cachedGeometry,
                mw.getMousePositionOnPlatform());
            dialogue._pressed = false;

            dialogue.onRelease.invoke({position: {x: clickAt.x, y: clickAt.y}});
        });

        dialogue._btn.onHovered.add(() => {
            if (dialogue._imgClickAnim.renderOpacity <= 0) dialogue._hovered = true;
        });
        dialogue._btn.onUnhovered.add(() => dialogue._hovered = false);

        return dialogue;
    }

    public static defaultOption(option?: DialogueOption): Required<DialogueOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 800, y: 400};
        if (!option.padding) option.padding = {};
        if (!option.fontSize) option.fontSize = 24;

        return option as Required<DialogueOption>;
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

    public setLayout(option: DialogueOption): this {
        overrideOption(this._option, option);
        super.setLayout(this._option);
        let [
            [x, y],
            [pt, pr, pb, pl],
            [contentX, contentY],
        ] =
            extractLayoutFromOption(this._option);

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

    public renderText(title?: string, message?: string): this {
        this._option.title = title;
        this._option.message = message;

        this._txtTitle.text = this._option.title ?? "";
        this._txtMessage.text = this._option.message ?? "";

        return this;
    }

    public renderFeedbacks(): this {

    }

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

export interface DialogueOption extends ComponentOption {
    title?: string;

    message?: string;

    fontSize?: Property.FontSize;

    feedbacks?: DialogueFeedback[];
}

export type DialogueFeedbackVariant = "normal" | "warning";

export interface DialogueFeedback {
    size?: number;

    label?: string;

    callback?: () => void;

    variant?: DialogueFeedbackVariant;
}