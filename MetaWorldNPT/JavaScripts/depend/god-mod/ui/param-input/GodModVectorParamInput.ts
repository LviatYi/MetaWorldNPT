import { IGodModParamInputParametric, ParamInputSizeY } from "../param-base/IGodModParamInput";
import Gtk, { Delegate } from "gtoolkit";
import { Lui, Property, PropertyUtil, TextField } from "mw-lynx-ui";
import { GodModPanelSizeX } from "../base/GodModPanelConst";
import { GodModParamInputBase } from "../param-base/GodModParamInputBase";
import Log4Ts from "mw-log4ts";
import Color = Lui.Asset.Color;

/**
 * GodModVectorParamInput.
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
export default class GodModVectorParamInput
    extends GodModParamInputBase
    implements IGodModParamInputParametric<mw.Vector> {
    private _inputX: TextField;
    private _inputY: TextField;
    private _inputZ: TextField;

    private _validator: Property.DataValidators<mw.Vector>;

//#region Lui Component
    public static create(): GodModVectorParamInput {
        let input = new GodModVectorParamInput();

        input._inputX = TextField.create({
            label: "x",
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
            label: "y",
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
            label: "z",
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
    public getParam(): mw.Vector {
        return new mw.Vector(
            Number(this._inputX.text),
            Number(this._inputY.text),
            Number(this._inputZ.text));
    }

    public setParam(p: mw.Vector) {
        this._inputX.setContent(p?.x?.toString() ?? "");
        this._inputY.setContent(p?.y?.toString() ?? "");
        this._inputZ.setContent(p?.z?.toString() ?? "");
    }

    public setValidator(validator: Property.DataValidators<mw.Vector>): void {
        this._validator = validator;
    }

    public setCustomLabel(label?: string): void {
        if (!label) return;
        Log4Ts.warn(GodModVectorParamInput,
            `custom label not supported when Vector param.`);
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