import Gtk, { Delegate } from "gtoolkit";
import { Property, PropertyUtil } from "../style/Property";
import { Component, ComponentOption, extractLayoutFromOption, overrideOption } from "./Component";
import { Lui } from "../style/Asset";
import { ClickEvent } from "../event/ClickEvent";
import { Button, ButtonVariant } from "./Button";
import Enumerable from "linq";
import ThemeColor = Lui.Asset.ThemeColor;
import Log4Ts from "mw-log4ts/Log4Ts";

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
//#region Constant
    public static readonly DialogueContentPaddingHorizontal = 50;

    public static readonly DialogueContentPaddingVertical = 30;

    public static readonly DialogueMessageLeftIndent = 30;

    public static readonly DialogueTitleSizeY = 80;

    public static readonly DialogueButtonPaddingTop = 20;

    public static readonly DialogueButtonSizeY = 60;

    public static readonly DialogueButtonMaxSizeX = 200;

    public static readonly DialogueButtonSpace = 10;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _btnModal: mw.Button;

    private _imgBack: mw.Image;

    private _txtTitle: mw.TextBlock;

    private _txtMessage: mw.TextBlock;

    private _btnList: Button[] = [];

    private _option: Required<DialogueOption>;

//#region Lui Component
    public static create(option?: DialogueOption): Dialogue {
        let dialogue = new Dialogue();

        dialogue.root.name = "LuiDialogue";
        dialogue.onAttach.add(() => {
            dialogue.root.zOrder = Enumerable
                .from(Gtk.getUiChildren(dialogue.root.parent))
                .select(widget => widget.zOrder)
                .where(zOrder => zOrder > 600000 && zOrder < 700000)
                .defaultIfEmpty(600000)
                .max() + 1;

            const viewPortSize = Gtk.getUiVirtualFullSize();
            const viewPortAbsPos = mw.UIService.canvas.cachedGeometry.getAbsolutePosition();
            const posParAbs = dialogue.root.parent.cachedGeometry.getAbsolutePosition();
            Gtk.setUiPosition(dialogue.root,
                (viewPortSize.x - dialogue.root.size.x) / 2
                + (viewPortAbsPos.x - posParAbs.x) / mw.getViewportScale(),
                (viewPortSize.y - dialogue.root.size.y) / 2
                + (viewPortAbsPos.y - posParAbs.y) / mw.getViewportScale());
        });

        dialogue._option = Dialogue.defaultOption(option);

        dialogue._btnModal = mw.Button.newObject(dialogue.root, "btnModal");
        Gtk.trySetVisibility(dialogue._btnModal, true);
        dialogue._btnModal.normalImageDrawType = mw.SlateBrushDrawType.NoDrawType;
        dialogue._btnModal.transitionEnable = false;
        if (!dialogue._option.modal) dialogue._btnModal.onClicked.add(() => dialogue.close());

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
        dialogue._txtTitle.textVerticalAlign = mw.TextVerticalJustify.Top;
        dialogue._txtTitle.textAlign = mw.TextJustify.Left;
        dialogue._txtTitle.setFontColorByHex(
            Lui.Asset.ColorUtil.colorHexWithAlpha(Lui.Asset.Color.Black, 1));

        dialogue._txtMessage = mw.TextBlock.newObject(dialogue.root, "txtMessage");
        PropertyUtil.applyFontSize(dialogue._txtMessage, dialogue._option.fontSize);
        dialogue._txtMessage.glyph = mw.UIFontGlyph.Light;
        dialogue._txtMessage.autoAdjust = false;
        dialogue._txtMessage.text = dialogue._option.message ?? "";
        dialogue._txtMessage.textVerticalAlign = mw.TextVerticalJustify.Top;
        dialogue._txtMessage.textAlign = mw.TextJustify.Left;
        dialogue._txtMessage.textHorizontalLayout = mw.UITextHorizontalLayout.AutoWarpText;
        dialogue._txtMessage.setFontColorByHex(
            Lui.Asset.ColorUtil.colorHexWithAlpha(Lui.Asset.Color.Gray900, 1));

        dialogue.renderFeedbacks();

        return dialogue;
    }

    public static defaultOption(option?: DialogueOption): Required<DialogueOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 800, y: 400};
        if (!option.title) option.title = "Title";
        if (!option.padding) option.padding = {
            left: Dialogue.DialogueContentPaddingHorizontal,
            right: Dialogue.DialogueContentPaddingHorizontal,
            top: Dialogue.DialogueContentPaddingVertical,
            bottom: Dialogue.DialogueContentPaddingVertical,
        };
        if (!option.fontSize) option.fontSize = 24;

        return option as Required<DialogueOption>;
    }

    public setLayout(option: DialogueOption): this {
        overrideOption(this._option, option);
        super.setLayout(this._option);
        let [[x, y],
            [pt, pr, pb, pl],
            [contentX, contentY],
        ] = extractLayoutFromOption(this._option);
        const viewPortSize = Gtk.getUiVirtualFullSize();

        Gtk.setUiPosition(this._btnModal, 0, 0);
        this._btnModal.size = viewPortSize;

        Gtk.setUiPosition(this._imgBack, 0, 0);
        Gtk.setUiSize(this._imgBack, x, y);

        Gtk.setUiPosition(this._txtTitle, pl, pt);
        Gtk.setUiSize(this._txtTitle,
            contentX,
            Dialogue.DialogueTitleSizeY);

        Gtk.setUiPosition(this._txtMessage,
            pl + Dialogue.DialogueMessageLeftIndent,
            pt + +Dialogue.DialogueTitleSizeY);
        Gtk.setUiSize(this._txtMessage,
            contentX - Dialogue.DialogueMessageLeftIndent,
            contentY
            - Dialogue.DialogueTitleSizeY
            - Dialogue.DialogueButtonPaddingTop
            - Dialogue.DialogueButtonSizeY,
        );

        let sizedSum = Enumerable
            .from(this._option.feedbacks)
            .sum(item => item?.size ?? 0);
        let lastPerWidth = Math.min(Math.max(0,
                contentX - sizedSum
                - Math.max(0, (this._option.feedbacks?.length ?? 0) - 1) * Dialogue.DialogueButtonSpace)
            / (this._option.feedbacks?.length ?? 1),
            Dialogue.DialogueButtonMaxSizeX);

        let offsetX = pl + contentX;
        for (let i = 0; i < this._btnList.length; ++i) {
            const feedback = this._option.feedbacks?.[i];
            const button = this._btnList[i];

            let sizeX = feedback?.size ?? lastPerWidth;
            button.setLayout({size: {x: sizeX, y: undefined}});
            offsetX -= sizeX + Dialogue.DialogueButtonSpace;
            Gtk.setUiPosition(button.root, offsetX, pt + contentY - Dialogue.DialogueButtonSizeY);
        }

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public renderText(title?: string, message?: string): this {
        this._option.title = title;
        this._option.message = message;

        this._txtTitle.text = this._option.title ?? "";
        this._txtMessage.text = this._option.message ?? "";

        return this;
    }

    public renderFeedbacks(feedbacks?: DialogueFeedback[]): this {
        if (feedbacks !== undefined &&
            this._option.feedbacks !== feedbacks) {
            this._option.feedbacks = feedbacks;
        }

        this._btnList.forEach((btn) => {
            btn.root.destroyObject();
        });
        this._btnList.length = 0;

        let i = 0;
        for (; i < this._option.feedbacks?.length; ++i) {
            const feedback = this._option.feedbacks[i];
            let theme: ThemeColor;
            let btnVariant: ButtonVariant;

            switch (feedback.variant) {
                case "warning":
                    theme = {
                        primary: Lui.Asset.Color.Red,
                        secondary: Lui.Asset.Color.Red200,
                    };
                    btnVariant = i === 0 ? "contained" : "outlined";
                    break;
                case "normal":
                default:
                    theme = {
                        primary: Lui.Asset.Color.Blue,
                        secondary: Lui.Asset.Color.Blue200,
                    };
                    btnVariant = i === 0 ? "contained" : "outlined";
                    break;
            }

            let btn = Button.create({
                size: {x: feedback.size ?? 0, y: Dialogue.DialogueButtonSizeY},
                label: feedback.label,
                fontSize: this._option.fontSize,
                color: theme,
                variant: btnVariant,
            }).attach(this.root);
            btn.onClick.add(() => {
                try {
                    feedback?.callback();
                } catch (e) {
                    Log4Ts.log(Dialogue, `error occurs in feedback callback.`, e);
                }

                this.close();
            });
            this._btnList.push(btn);
        }

        if (i === 0) {
            const btn = Button.create({
                size: {x: 20, y: Dialogue.DialogueButtonSizeY},
                label: "OK",
                fontSize: this._option.fontSize,
                color: {
                    primary: Lui.Asset.Color.Blue,
                    secondary: Lui.Asset.Color.Blue200,
                },
                variant: "contained",
            }).attach(this.root);
            btn.onClick.add(() => this.close());
            this._btnList.push(btn);
        }

        this.setLayout(this._option);
        return this;
    }

    public close() {
        this.root.destroyObject();
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

    /**
     * 模态的.
     * @desc 模态窗口 除非用户在界面本身提供的途径关闭对话框，否则用户无法与界面的其他部分进行交互.
     */
    modal?: boolean;

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