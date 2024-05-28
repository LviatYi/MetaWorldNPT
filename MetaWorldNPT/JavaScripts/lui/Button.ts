import Gtk from "../util/GToolkit";
import ThemeColor, { Color, NormalThemeColor } from "./Theme";
import Log4Ts from "../depend/log4ts/Log4Ts";
import TextJustify = mw.TextJustify;
import TextVerticalJustify = mw.TextVerticalJustify;

export class Button {
//#region
    public static readonly IMG_BTN_GUID = "163429";

    public static readonly IMG_CLICK_SHADOW_GUID = "163437";

    public static readonly IMG_BTN_BOX_MARGIN = {left: 24, top: 24, right: 24, bottom: 24};

    public static readonly IMG_BTN_PRACTICAL_MARGIN = {left: 10, top: 10, right: 10, bottom: 10};
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _root: mw.Canvas;

    private _btn: mw.Button;

    private _cnvClickAnim: mw.Canvas;

    private _imgClickAnim: mw.Image;

    private _txtLabel: mw.TextBlock;

    private _animOpacity: number = 0;

    private _animScale: number = 0;

    public static create(option?: ButtonOption): Button {
        option = Button.defaultOption(option);

        let btn = new Button();
        btn._root = mw.Canvas.newObject(undefined, "root");
        btn._root.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        btn._btn = mw.Button.newObject(btn._root, "btn");
        btn._btn.visibility = mw.SlateVisibility.Visible;
        btn._btn.normalImageGuid = Button.IMG_BTN_GUID;
        btn._btn.transitionEnable = false;
        btn._btn.normalImageDrawType = mw.SlateBrushDrawType.PixcelBox;
        btn._btn.normalImageMargin = new mw.Margin(
            Button.IMG_BTN_BOX_MARGIN.left,
            Button.IMG_BTN_BOX_MARGIN.top,
            Button.IMG_BTN_BOX_MARGIN.right,
            Button.IMG_BTN_BOX_MARGIN.bottom,
        );
        btn._cnvClickAnim = mw.Canvas.newObject(btn._root, "cnvClickAnim");
        btn._cnvClickAnim.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        btn._cnvClickAnim.clipEnable = true;

        btn._imgClickAnim = mw.Image.newObject(btn._cnvClickAnim, "imgClickAnim");
        btn._imgClickAnim.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        let imgClickAnimColor = mw.LinearColor.colorHexToLinearColor(Color.Black);
        imgClickAnimColor.a = 0.25;
        Gtk.setUiScale(btn._imgClickAnim, 0, 0);
        btn._imgClickAnim.renderOpacity = 0;
        btn._imgClickAnim.imageGuid = Button.IMG_CLICK_SHADOW_GUID;
        btn._imgClickAnim.imageColor = imgClickAnimColor;

        btn._txtLabel = mw.TextBlock.newObject(btn._root, "txtLabel");
        btn._txtLabel.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        btn._txtLabel.autoAdjust = false;
        btn._txtLabel.fontSize = 24;
        btn._txtLabel.glyph = mw.UIFontGlyph.Light;
        btn._txtLabel.textAlign = TextJustify.Center;
        btn._txtLabel.textVerticalAlign = TextVerticalJustify.Center;

        btn.setSize(option.size.x, option.size.y);
        btn.setColor(option.color);

        btn._btn.onClicked.add(() => {
            const clickAt = mw.absoluteToLocal(btn._root.cachedGeometry, mw.getMousePositionOnPlatform());
            btn.playClickAnimAt(clickAt.x, clickAt.y);
            Log4Ts.log(Button, `clicked at ${clickAt}`);
        });

        mw.TimeUtil.onEnterFrame.add(btn.renderClickAnim);
        return btn;
    }

    public static defaultOption(option?: ButtonOption): ButtonOption {
        if (!option) option = {};

        if (!option.size) option.size = {x: 200, y: 80};
        if (!option.color) option.color = NormalThemeColor;

        return option;
    }

    private setSize(x: number, y: number): this {
        Gtk.setUiSize(this._root, x, y);
        Gtk.setUiSize(this._btn, x, y);
        Gtk.setUiSize(this._txtLabel, x, y);
        Gtk.setUiPosition(this._cnvClickAnim,
            Button.IMG_BTN_PRACTICAL_MARGIN.left,
            Button.IMG_BTN_PRACTICAL_MARGIN.top,
        );
        Gtk.setUiSize(this._cnvClickAnim,
            x - Button.IMG_BTN_PRACTICAL_MARGIN.left - Button.IMG_BTN_PRACTICAL_MARGIN.right,
            y - Button.IMG_BTN_PRACTICAL_MARGIN.top - Button.IMG_BTN_PRACTICAL_MARGIN.bottom);

        const radius = Math.sqrt(x * x + y * y);
        Gtk.setUiSize(this._imgClickAnim, radius, radius);

        return this;
    }

    private setColor(color: ThemeColor): this {
        let btnColor = mw.LinearColor.colorHexToLinearColor(color.primary);
        btnColor.a = 1;
        this._btn.normalImageColor = btnColor;

        return this;
    }

    public attach(canvas: mw.Canvas) {
        canvas.addChild(this._root);
    }

    public destroy() {
        if (this._root.parent) this._root.parent.removeChild(this._root);
        mw.TimeUtil.onEnterFrame.remove(this.renderClickAnim);
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

    private renderClickAnim = (dt: number) => {
        if (this._imgClickAnim.renderOpacity <= 0) return;

        Gtk.setUiScale(this._imgClickAnim, this._animScale, this._animScale);
        this._imgClickAnim.renderOpacity = this._animOpacity;

        this._animOpacity = Math.max(0, this._animOpacity - dt / 0.5);
        this._animScale = Math.max(0, this._animScale + dt / 0.25);
    };
}

export interface ButtonOption {
    size?: { x: number, y: number };
    color?: ThemeColor;
}

