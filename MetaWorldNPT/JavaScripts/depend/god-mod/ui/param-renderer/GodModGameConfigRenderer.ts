import { Component, Lui } from "mw-lynx-ui";
import { IElementBase } from "../../GodModParam";
import Gtk from "gtoolkit";
import { GodModPanelSizeX } from "../base/GodModPanelConst";
import ColorUtil = Lui.Asset.ColorUtil;

/**
 * GodModGameConfigRenderer.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @internal
 */
export default class GodModGameConfigRenderer extends Component {
//#region Constant
    public static readonly GodModGameConfigItemSizeY = 30;

    public static readonly GodModGameConfigItemPaddingLeft = 10;

    public static readonly GodModGameConfigSubItemPaddingLeft = 30;

    public static readonly RegForName = /^name$/i;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _idRenderer: mw.TextBlock;

    private _nameRenderer: mw.TextBlock;

    private _descFields: mw.TextBlock[] = [];

    private _show: boolean = false;

    public get show() {
        return this._show;
    }

    public set show(val: boolean) {
        this._show = val;
    }

//#region Lui Component
    public static create(): GodModGameConfigRenderer {
        let renderer = new GodModGameConfigRenderer();

        renderer._idRenderer = mw.TextBlock.newObject(renderer.root, "txtId");
        renderer._idRenderer.glyph = mw.UIFontGlyph.Bold;
        renderer._idRenderer.fontSize = 16;
        renderer._idRenderer.setFontColorByHex(ColorUtil.colorHexWithAlpha(Lui.Asset.Color.Black, 0.8));
        Gtk.setUiPosition(renderer._idRenderer, this.GodModGameConfigItemPaddingLeft, 0);
        Gtk.setUiSize(renderer._idRenderer, GodModPanelSizeX / 2 - this.GodModGameConfigItemPaddingLeft, this.GodModGameConfigItemSizeY);

        renderer._nameRenderer = mw.TextBlock.newObject(renderer.root, "txtName");
        renderer._nameRenderer.glyph = mw.UIFontGlyph.Bold;
        renderer._nameRenderer.fontSize = 16;
        renderer._nameRenderer.setFontColorByHex(ColorUtil.colorHexWithAlpha(Lui.Asset.Color.Black, 0.8));
        Gtk.setUiPosition(renderer._nameRenderer, GodModPanelSizeX / 2, 0);
        Gtk.setUiSize(renderer._nameRenderer, GodModPanelSizeX / 2, this.GodModGameConfigItemSizeY);

        renderer.render();

        return renderer;
    };

    protected renderAnimHandler = (dt: number) => {
        if (this._show && this.root.renderOpacity < 1) {
            this.root.renderOpacity = Math.min(
                1,
                this.root.renderOpacity + dt / Lui.Asset.Interval.VeryFast);
        }
        if (!this._show && this.root.renderOpacity > 0) {
            this.root.renderOpacity = Math.max(
                0,
                this.root.renderOpacity - dt / Lui.Asset.Interval.Fast);
        }
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public render(config?: IElementBase): this {
        let lineCount = 0;
        let nameRendered: boolean = false;

        if (Gtk.isNullOrUndefined(config)) {
            Gtk.trySetText(this._idRenderer, "Not exist.");
        } else {
            Gtk.trySetText(this._idRenderer, `id: ${config.id}`);
            for (const key in config) {
                if (key === "id") continue;
                if (!nameRendered && GodModGameConfigRenderer.RegForName.test(key)) {
                    Gtk.trySetText(this._nameRenderer, `name: ${config[key]}`);
                    nameRendered = true;
                }
                this.renderItem(key, config[key], lineCount++);
            }
        }

        if (!nameRendered) Gtk.trySetText(this._nameRenderer, "");
        for (let i = lineCount; i < this._descFields.length; ++i) {
            Gtk.trySetVisibility(this._descFields[i], false);
        }

        return this;
    }

    private renderItem(name: string, value: string, index: number) {
        let line: mw.TextBlock;
        if (index >= this._descFields.length) {
            line = mw.TextBlock.newObject(this.root, "txtDesc" + index);
            this._descFields.push(line);
            Gtk.setUiSize(line,
                GodModPanelSizeX - GodModGameConfigRenderer.GodModGameConfigSubItemPaddingLeft,
                GodModGameConfigRenderer.GodModGameConfigItemSizeY);
            Gtk.setUiPosition(line,
                GodModGameConfigRenderer.GodModGameConfigSubItemPaddingLeft,
                GodModGameConfigRenderer.GodModGameConfigItemSizeY * (index + 1));
            line.fontSize = 14;
            line.glyph = mw.UIFontGlyph.Normal;
            line.setFontColorByHex(ColorUtil.colorHexWithAlpha(Lui.Asset.Color.Gray800, 0.8));
        } else {
            line = this._descFields[index];
        }

        line.text = `${name}: ${value}`;
        Gtk.trySetVisibility(line, true);
    }
}
