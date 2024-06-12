import { Component, ComponentOption, extractLayoutFromOption, overrideOption } from "mw-lynx-ui";
import Gtk from "gtoolkit";

/**
 * Icon for Platform.
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
export class PlatformIcon extends Component {
//#region Constant
    public static readonly ImgRoundedRectangle60 = "34422";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _cnvRotate: mw.Canvas;

    private _imgArrLeftTop: mw.Image;

    private _imgArrLeftBottom: mw.Image;

    private _imgArrRightTop: mw.Image;

    private _imgArrRightBottom: mw.Image;

    private _option: Readonly<Required<PlatformIconOption>> = undefined;

//#region Lui Component
    public static create(option?: PlatformIconOption): PlatformIcon {
        let icon = new PlatformIcon();

        icon._option = PlatformIcon.defaultOption(option);

        icon._cnvRotate = mw.Canvas.newObject(icon.root, "cnvRotate");
        icon._cnvRotate.renderTransformAngle = 45;

        icon._imgArrLeftTop = mw.Image.newObject(icon._cnvRotate, "imgArrLeftTop");
        icon._imgArrLeftTop.imageGuid = PlatformIcon.ImgRoundedRectangle60;
        icon._imgArrLeftTop.renderTransformAngle = 0;
        icon._imgArrLeftBottom = mw.Image.newObject(icon._cnvRotate, "imgArrLeftBottom");
        icon._imgArrLeftBottom.imageGuid = PlatformIcon.ImgRoundedRectangle60;
        icon._imgArrLeftBottom.renderTransformAngle = 270;
        icon._imgArrRightTop = mw.Image.newObject(icon._cnvRotate, "imgArrRightTop");
        icon._imgArrRightTop.imageGuid = PlatformIcon.ImgRoundedRectangle60;
        icon._imgArrRightTop.renderTransformAngle = 90;
        icon._imgArrRightBottom = mw.Image.newObject(icon._cnvRotate, "imgArrRightBottom");
        icon._imgArrRightBottom.imageGuid = PlatformIcon.ImgRoundedRectangle60;
        icon._imgArrRightBottom.renderTransformAngle = 180;

        icon.setLayout(icon._option);

        return icon;
    }

    public static defaultOption(option?: PlatformIconOption): Required<PlatformIconOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 50, y: 50};
        if (!option.padding) option.padding = {};
        if (!option.variant) option.variant = "double";

        return option as Required<PlatformIconOption>;
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

        Gtk.setUiSize(this._cnvRotate, x, y);

        const size = Math.min(contentX, contentY);
        const arrSize = Math.floor(0.42 * size);
        const offset = (size - arrSize * 3) / 2;

        Gtk.setUiSize(this._imgArrLeftTop, arrSize, arrSize);
        Gtk.setUiSize(this._imgArrLeftBottom, arrSize, arrSize);
        Gtk.setUiSize(this._imgArrRightTop, arrSize, arrSize);
        Gtk.setUiSize(this._imgArrRightBottom, arrSize, arrSize);

        Gtk.setUiPosition(this._imgArrLeftTop,
            pl + offset + arrSize,
            pt + offset);
        Gtk.setUiPosition(this._imgArrLeftBottom,
            pl + offset,
            pt + offset + arrSize);
        Gtk.setUiPosition(this._imgArrRightTop,
            pl + offset + 2 * arrSize,
            pt + offset + arrSize);
        Gtk.setUiPosition(this._imgArrRightBottom,
            pl + offset + arrSize,
            pt + offset + 2 * arrSize);

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export type PlatformIconVariant = "server" | "client" | "double";

export interface PlatformIconOption extends ComponentOption {
    variant?: PlatformIconVariant;
}