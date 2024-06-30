import { IGodModParamInputParametric, ParamInputSizeY } from "../param-base/IGodModParamInput";
import Gtk, { Delegate } from "gtoolkit";
import { Lui, Property, PropertyUtil, TextField } from "mw-lynx-ui";
import { GodModPanelSizeX } from "../base/GodModPanelConst";
import { GodModParamInputBase } from "../param-base/GodModParamInputBase";
import Log4Ts from "mw-log4ts";
import Color = Lui.Asset.Color;

/**
 * GodModRotationParamInput.
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
export default class GodModRotationParamInput
    extends GodModParamInputBase
    implements IGodModParamInputParametric<mw.Rotation> {
    private _inputX: TextField;
    private _inputY: TextField;
    private _inputZ: TextField;

    private _validator: Property.DataValidators<mw.Rotation>;

//#region Lui Component
    public static create(): GodModRotationParamInput {
        let input = new GodModRotationParamInput();

        input._inputX = TextField.create({
            label: "roll",
            size: {x: 135, y: ParamInputSizeY},
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
            label: "pitch",
            size: {x: 135, y: ParamInputSizeY},
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
        Gtk.setUiPositionX(input._inputY.root, 135);

        input._inputZ = TextField.create({
            label: "yaw",
            size: {x: 130, y: ParamInputSizeY},
            color: {
                primary: Color.Blue,
                secondary: Color.Blue200,
            },
            fontSize: 16,
            fontStyle: mw.UIFontGlyph.Light,
            corner: Property.Corner.Top,
            type: mw.InputTextLimit.LimitToFloat,
        }).attach(input);
        Gtk.setUiPositionX(input._inputZ.root, 270);

        Gtk.setUiSize(input.root, GodModPanelSizeX, ParamInputSizeY);

        return input;
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region IGodModParamInputParametric
    public getParam(): mw.Rotation {
        return new mw.Rotation(
            Number(this._inputX.text),
            Number(this._inputY.text),
            Number(this._inputZ.text));
    }

    public setParam(p: mw.Rotation) {
        this._inputX.setContent(p?.x?.toString() ?? "");
        this._inputY.setContent(p?.y?.toString() ?? "");
        this._inputZ.setContent(p?.z?.toString() ?? "");
    }

    public setValidator(validator: Property.DataValidators<mw.Rotation>): void {
        this._validator = validator;
    }

    public setCustomLabel(label?: string): void {
        if (!label) return;
        Log4Ts.warn(GodModRotationParamInput,
            `custom label not supported when Rotation param.`);
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
            this._inputZ.onCommit.add(() => this._onCommit.invoke());
        }

        return this._onCommit;
    }

//#endregion
}