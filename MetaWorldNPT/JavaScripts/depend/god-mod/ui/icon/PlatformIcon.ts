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
    public static readonly ImgCircle = "163437";

    public static readonly HexServer = "1ea89d";

    public static readonly HexClient = "e550b2";

    public static readonly HexDouble = "616972";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _imgFlag: mw.Image;

    private _txtFlag: mw.TextBlock;

    private _option: Readonly<Required<PlatformIconOption>> = undefined;

//#region Lui Component
    public static create(option?: PlatformIconOption): PlatformIcon {
        let icon = new PlatformIcon();

        icon._option = PlatformIcon.defaultOption(option);

        icon._imgFlag = mw.Image.newObject(icon.root, "imgFlag");
        icon._imgFlag.imageGuid = PlatformIcon.ImgCircle;

        icon._txtFlag = mw.TextBlock.newObject(icon.root, "txtFlag");
        icon._txtFlag.glyph = mw.UIFontGlyph.Bold;
        icon._txtFlag.fontSize = icon._option.fontSize;
        icon._txtFlag.textAlign = mw.TextJustify.Center;
        icon._txtFlag.textVerticalAlign = mw.TextVerticalJustify.Center;
        icon._txtFlag.setFontColorByHex("#FFFFFF");

        switch (icon._option.variant) {
            case "server":
                icon._imgFlag.setImageColorByHex(this.HexServer);
                icon._txtFlag.text = "S";
                break;
            case "client":
                icon._imgFlag.setImageColorByHex(this.HexClient);
                icon._txtFlag.text = "C";
                break;
            case "double":
                icon._imgFlag.setImageColorByHex(this.HexDouble);
                icon._txtFlag.text = "CS";
                break;
        }

        icon.setLayout(icon._option);

        return icon;
    }

    public static defaultOption(option?: PlatformIconOption): Required<PlatformIconOption> {
        if (!option) option = {};

        if (!option.size) option.size = {x: 50, y: 50};
        if (!option.padding) option.padding = {};
        if (!option.fontSize) option.fontSize = 16;
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
        ] = extractLayoutFromOption(this._option);

        Gtk.setUiSize(this._imgFlag, contentX, contentY);
        Gtk.setUiPosition(this._imgFlag, pl, pt);
        Gtk.setUiSize(this._txtFlag, contentX, contentY);
        Gtk.setUiPosition(this._txtFlag, pl, pr);

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export type PlatformIconVariant = "server" | "client" | "double";

export interface PlatformIconOption extends ComponentOption {
    fontSize?: number;

    variant?: PlatformIconVariant;
}