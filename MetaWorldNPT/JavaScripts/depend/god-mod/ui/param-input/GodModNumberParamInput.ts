import { IGodModParamInputParametric, ParamInputSizeY } from "../param-base/IGodModParamInput";
import Gtk, { Delegate } from "gtoolkit";
import { Lui, Property, TextField } from "mw-lynx-ui";
import { GodModPanelSizeX } from "../base/GodModPanelConst";
import { GodModParamInputBase } from "../param-base/GodModParamInputBase";
import Color = Lui.Asset.Color;

/**
 * GodModNumberParamInput.
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
export default class GodModNumberParamInput extends GodModParamInputBase implements IGodModParamInputParametric<number> {
    private _input: TextField;

//#region Lui Component
    public static create(): GodModNumberParamInput {
        let input = new GodModNumberParamInput();

        input._input = TextField.create({
            label: "number",
            size: {x: GodModPanelSizeX, y: ParamInputSizeY},
            color: {
                primary: Color.Blue,
                secondary: Color.Blue200,
            },
            fontSize: 16,
            fontStyle: mw.UIFontGlyph.Light,
            corner: Property.Corner.Top,
            type: mw.InputTextLimit.LimitToFloat,
        }).attach(input);

        Gtk.setUiSize(input.root, GodModPanelSizeX, ParamInputSizeY);

        return input;
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region IGodModParamInputParametric
    public getParam(): number {
        return Number(this._input.text);
    }

    public setParam(p: number): void {
        this._input.setContent(p?.toString() ?? "");
    }

    public setValidator(validator: Property.DataValidators<string>): void {
        this._input.setValidator(validator);
    }

    public get validated(): Property.DataValidateResult {
        return this._input.validated;
    }

    public setCustomLabel(label?: string): void {
        this._input.setLabel(label ?? "number");
    }

    private _onCommit: Delegate.SimpleDelegate;

    public get onCommit(): Delegate.SimpleDelegate {
        if (!this._onCommit) {
            this._onCommit = new Delegate.SimpleDelegate();
            this._input.onCommit.add(() => this._onCommit.invoke());
        }

        return this._onCommit;
    }

//#endregion
}