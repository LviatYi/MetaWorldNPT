import Gtk from "../../util/GToolkit";
import ThemeColor, { ColorUtil, NormalThemeColor } from "../Theme";
import { Property, PropertyUtil } from "../Style";
import Component, { ComponentOption } from "./Component";
import { Lui } from "../Asset";

/**
 * Box.
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
export default class Box extends Component {
    private _imgMain: mw.Image;

    private _imgTopLeft: mw.Image;

    private _imgTopRight: mw.Image;

    private _imgBottomLeft: mw.Image;

    private _imgBottomRight: mw.Image;

    private _option: Readonly<Required<BoxOption>> = undefined;

//#region Lui Component
    public static create(option?: BoxOption): Box {
        let box = new Box();

        box._option = this.defaultOption(option);

        if (box._option.zOrder !== undefined)
            box.root.zOrder = box._option.zOrder;

        box._imgMain = mw.Image.newObject(box.root, "imgMain");
        box._imgMain.constraints = new mw.UIConstraintAnchors(
            mw.UIConstraintHorizontal.LeftRight,
            mw.UIConstraintVertical.TopBottom);
        box._imgMain.imageGuid = Lui.Asset.ImgRoundedRectangle;
        box._imgMain.imageDrawType = mw.SlateBrushDrawType.PixcelBox;
        box._imgMain.margin = new mw.Margin(
            Lui.Asset.ImgRoundedRectangleBoxMargin.left,
            Lui.Asset.ImgRoundedRectangleBoxMargin.top,
            Lui.Asset.ImgRoundedRectangleBoxMargin.right,
            Lui.Asset.ImgRoundedRectangleBoxMargin.bottom);

        if (PropertyUtil.hasCorner(box._option.corner, Property.Corner.TopLeft)) {
            box._imgTopLeft = mw.Image.newObject(box.root, "imgTopLeft");
            box._imgTopLeft.constraints = new mw.UIConstraintAnchors(
                mw.UIConstraintHorizontal.Left,
                mw.UIConstraintVertical.Top);
            box._imgTopLeft.imageGuid = Lui.Asset.ImgRectangle;
            box._imgTopLeft.imageDrawType = mw.SlateBrushDrawType.Image;
        }
        if (PropertyUtil.hasCorner(box._option.corner, Property.Corner.TopRight)) {
            box._imgTopRight = mw.Image.newObject(box.root, "imgTopRight");
            box._imgTopRight.constraints = new mw.UIConstraintAnchors(
                mw.UIConstraintHorizontal.Right,
                mw.UIConstraintVertical.Top);
            box._imgTopRight.imageGuid = Lui.Asset.ImgRectangle;
            box._imgTopRight.imageDrawType = mw.SlateBrushDrawType.Image;
        }
        if (PropertyUtil.hasCorner(box._option.corner, Property.Corner.BottomLeft)) {
            box._imgBottomLeft = mw.Image.newObject(box.root, "imgBottomLeft");
            box._imgBottomLeft.constraints = new mw.UIConstraintAnchors(
                mw.UIConstraintHorizontal.Left,
                mw.UIConstraintVertical.Bottom);
            box._imgBottomLeft.imageGuid = Lui.Asset.ImgRectangle;
            box._imgBottomLeft.imageDrawType = mw.SlateBrushDrawType.Image;
        }
        if (PropertyUtil.hasCorner(box._option.corner, Property.Corner.BottomRight)) {
            box._imgBottomRight = mw.Image.newObject(box.root, "imgBottomRight");
            box._imgBottomRight.constraints = new mw.UIConstraintAnchors(
                mw.UIConstraintHorizontal.Right,
                mw.UIConstraintVertical.Bottom);
            box._imgBottomRight.imageGuid = Lui.Asset.ImgRectangle;
            box._imgBottomRight.imageDrawType = mw.SlateBrushDrawType.Image;
        }

        box.setSize();
        box.setColor();

        return box;
    };

    public static defaultOption(option?: BoxOption): Required<BoxOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 240, y: 80};
        if (!option.padding) option.padding = {};
        if (!option.color) option.color = NormalThemeColor;
        if (!option.corner) option.corner = 0;

        return option as Required<BoxOption>;
    };

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

        Gtk.setUiSize(this._imgMain, contentX, contentY);
        Gtk.setUiPosition(this._imgMain, pl, pt);

        if (this._imgTopLeft) {
            Gtk.setUiSize(this._imgTopLeft,
                Lui.Asset.ImgRoundedRectangleBoxMargin.left,
                Lui.Asset.ImgRoundedRectangleBoxMargin.top);
            Gtk.setUiPosition(this._imgTopLeft, pl, pt);
        }
        if (this._imgTopRight) {
            Gtk.setUiSize(this._imgTopRight,
                Lui.Asset.ImgRoundedRectangleBoxMargin.right,
                Lui.Asset.ImgRoundedRectangleBoxMargin.top);
            Gtk.setUiPosition(this._imgTopRight,
                pl + contentX - Lui.Asset.ImgRoundedRectangleBoxMargin.right,
                pt);
        }
        if (this._imgBottomLeft) {
            Gtk.setUiSize(this._imgBottomLeft,
                Lui.Asset.ImgRoundedRectangleBoxMargin.left,
                Lui.Asset.ImgRoundedRectangleBoxMargin.bottom);
            Gtk.setUiPosition(this._imgBottomLeft,
                pl,
                pt + contentY - Lui.Asset.ImgRoundedRectangleBoxMargin.bottom);
        }
        if (this._imgBottomRight) {
            Gtk.setUiSize(this._imgBottomRight,
                Lui.Asset.ImgRoundedRectangleBoxMargin.right,
                Lui.Asset.ImgRoundedRectangleBoxMargin.bottom);
            Gtk.setUiPosition(this._imgBottomRight,
                pl + contentX - Lui.Asset.ImgRoundedRectangleBoxMargin.right,
                pt + contentY - Lui.Asset.ImgRoundedRectangleBoxMargin.bottom);
        }

        return this;
    }

    private setColor(): this {
        let colorHex = ColorUtil.colorHexWithAlpha(this._option.color.primary, 1);
        this._imgMain.setImageColorByHex(colorHex);
        this._imgTopLeft?.setImageColorByHex(colorHex);
        this._imgTopRight?.setImageColorByHex(colorHex);
        this._imgBottomLeft?.setImageColorByHex(colorHex);
        this._imgBottomRight?.setImageColorByHex(colorHex);

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region CallBack
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export interface BoxOption extends ComponentOption {
    color?: ThemeColor;

    corner?: Property.Corner;
}