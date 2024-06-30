import { IGodModParamInputParametric, ParamInputSizeY } from "../param-base/IGodModParamInput";
import Gtk, { Delegate } from "gtoolkit";
import { Lui, Property, PropertyUtil, TextField } from "mw-lynx-ui";
import { GodModPanelSizeX } from "../base/GodModPanelConst";
import { GodModParamInputBase } from "../param-base/GodModParamInputBase";
import Log4Ts from "mw-log4ts";
import Color = Lui.Asset.Color;

/**
 * GodModVector2ParamInput.
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
export default class GodModVector2ParamInput
    extends GodModParamInputBase
    implements IGodModParamInputParametric<mw.Vector2> {
    private _inputX: TextField;
    private _inputY: TextField;

    private _validator: Property.DataValidators<mw.Vector2>;

//#region Lui Component
    public static create(): GodModVector2ParamInput {
        let input = new GodModVector2ParamInput();

        input._inputX = TextField.create({
            label: "x",
            size: {x: (GodModPanelSizeX - 5) / 2 + 5, y: ParamInputSizeY},
            padding: {right: 5},
            color: {
                primary: Color.Blue,
                secondary: Color.Blue200,
            },
            fontSize: 16,
            fontStyle: mw.UIFontGlyph.Light,
            corner: Property.Corner.Top,
            type: mw.InputTextLimit.LimitToFloat,
        }).attach(input);

        input._inputY = TextField.create({
            label: "y",
            size: {x: (GodModPanelSizeX - 5) / 2, y: ParamInputSizeY},
            color: {
                primary: Color.Blue,
                secondary: Color.Blue200,
            },
            fontSize: 16,
            fontStyle: mw.UIFontGlyph.Light,
            corner: Property.Corner.Top,
            type: mw.InputTextLimit.LimitToFloat,
        }).attach(input);
        Gtk.setUiPositionX(input._inputY.root, 202.5);

        Gtk.setUiSize(input.root, GodModPanelSizeX, ParamInputSizeY);

        return input;
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region IGodModParamInputParametric
    public getParam(): mw.Vector2 {
        return new mw.Vector2(
            Number(this._inputX.text),
            Number(this._inputY.text));
    }

    public setParam(p: mw.Vector2) {
        this._inputX.setContent(p?.x?.toString() ?? "");
        this._inputY.setContent(p?.y?.toString() ?? "");
    }

    public setValidator(validator: Property.DataValidators<mw.Vector2>): void {
        this._validator = validator;
    }

    public setCustomLabel(label?: string): void {
        if (!label) return;
        Log4Ts.warn(GodModVector2ParamInput,
            `custom label not supported when Vector2 param.`);
    }

    public get validated(): Property.DataValidateResult {
        if (Gtk.isNullOrEmpty(this._validator)) return {result: true};
        let param = this.getParam();

        return PropertyUtil.validate(this._validator, param);
    }

    private _onCommit: Delegate.SimpleDelegate;

    public get onCommit(): Delegate.SimpleDelegate {
        if (!this._onCommit) {
            this._onCommit = new Delegate.SimpleDelegate();
            this._inputX.onCommit.add(() => this._onCommit.invoke());
            this._inputY.onCommit.add(() => this._onCommit.invoke());
        }

        return this._onCommit;
    }

//#endregion
}