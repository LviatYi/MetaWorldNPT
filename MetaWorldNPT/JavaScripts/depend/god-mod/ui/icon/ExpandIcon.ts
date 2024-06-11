import { Component, ComponentOption, extractLayoutFromOption, Lui, overrideOption } from "mw-lynx-ui";
import Gtk from "gtoolkit";

/**
 * Icon for Expand.
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
export class ExpandIcon extends Component {
//#region Constant
    public static readonly ImgRoundedRectangle60 = "163384";

    public static readonly ColorHex = "EAEAEBFF";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _imgSqrLeftTop: mw.Image;

    private _imgSqrLeftBottom: mw.Image;

    private _imgSqrRightTop: mw.Image;

    private _imgSqrRightBottom: mw.Image;

    private _option: Readonly<Required<ComponentOption>> = undefined;

//#region Lui Component
    public static create(option?: ComponentOption): ExpandIcon {
        let icon = new ExpandIcon();

        icon._option = ExpandIcon.defaultOption(option);

        icon._imgSqrLeftTop = mw.Image.newObject(icon.root, "imgSqrLeftTop");
        icon._imgSqrLeftTop.imageGuid = ExpandIcon.ImgRoundedRectangle60;
        icon._imgSqrLeftTop.setImageColorByHex(this.ColorHex);
        icon._imgSqrLeftBottom = mw.Image.newObject(icon.root, "imgSqrLeftBottom");
        icon._imgSqrLeftBottom.imageGuid = ExpandIcon.ImgRoundedRectangle60;
        icon._imgSqrLeftBottom.setImageColorByHex(this.ColorHex);
        icon._imgSqrRightTop = mw.Image.newObject(icon.root, "imgSqrRightTop");
        icon._imgSqrRightTop.imageGuid = ExpandIcon.ImgRoundedRectangle60;
        icon._imgSqrRightTop.setImageColorByHex(this.ColorHex);
        icon._imgSqrRightBottom = mw.Image.newObject(icon.root, "imgSqrRightBottom");
        icon._imgSqrRightBottom.imageGuid = ExpandIcon.ImgRoundedRectangle60;
        icon._imgSqrRightBottom.setImageColorByHex(this.ColorHex);

        icon.setLayout(icon._option);

        return icon;
    }

    public static defaultOption(option?: ComponentOption): Required<ComponentOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 50, y: 50};
        if (!option.padding) option.padding = {};

        return option as Required<ComponentOption>;
    }

    public setLayout(option: ComponentOption): this {
        overrideOption(this._option, option);
        super.setLayout(this._option);
        let [
            [x, y],
            [pt, pr, pb, pl],
            [contentX, contentY],
        ] =
            extractLayoutFromOption(this._option);

        const size = Math.min(contentX, contentY);
        const sqrSize = Math.floor(size * 0.42);
        const space = Math.floor(size * 0.16);
        const offset = size - sqrSize * 2 - space;

        Gtk.setUiSize(this._imgSqrLeftTop, sqrSize, sqrSize);
        Gtk.setUiSize(this._imgSqrLeftBottom, sqrSize, sqrSize);
        Gtk.setUiSize(this._imgSqrRightTop, sqrSize, sqrSize);
        Gtk.setUiSize(this._imgSqrRightBottom, sqrSize, sqrSize);

        Gtk.setUiPosition(this._imgSqrLeftTop,
            pl + offset,
            pt + offset);
        Gtk.setUiPosition(this._imgSqrLeftBottom,
            pl + offset,
            pt + offset + sqrSize + space);
        Gtk.setUiPosition(this._imgSqrRightTop,
            pl + offset + sqrSize + space,
            pt + offset);
        Gtk.setUiPosition(this._imgSqrRightBottom,
            pl + offset + sqrSize + space,
            pt + offset + sqrSize + space);

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}