import Component from "../../../../lui/component/Component";
import TextField from "../../../../lui/component/TextField";
import { Color } from "../../../../lui/Theme";
import { Property, PropertyUtil } from "../../../../lui/Property";
import Gtk, { Delegate } from "../../../../util/GToolkit";
import { KeyEvent } from "../../../../lui/event/KeyEvent";
import IGodModParamInputParametric, { ParamInputSizeY } from "../param-base/IGodModParamInput";
import { GodModParamInputOption } from "../param-base/IGodModParamValidatorOption";
import { InputChangeEvent } from "../../../../lui/event/InputEvent";

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
 */
export class GodModVectorParamInput extends Component implements IGodModParamInputParametric<mw.Vector> {
    private _inputX: TextField;
    private _inputY: TextField;
    private _inputZ: TextField;

    private _validator: Property.DataValidators<mw.Vector>;

//#region Lui Component
    public static create(option?: GodModParamInputOption): GodModVectorParamInput {
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

        Gtk.setUiSize(input.root, 400, ParamInputSizeY);

        input._inputZ.onKeyUp.add((e) => {
            input.onKeyUp.invoke(e);
        });

        return input;
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

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

        this._inputX.onCommit.add(e => this.onCommit.invoke(e));
        this._inputY.onCommit.add(e => this.onCommit.invoke(e));
        this._inputZ.onCommit.add(e => this.onCommit.invoke(e));
        this._inputX.onKeyUp.add(e => this.onKeyUp.invoke(e));
        this._inputY.onKeyUp.add(e => this.onKeyUp.invoke(e));
        this._inputZ.onKeyUp.add(e => this.onKeyUp.invoke(e));
    }

    public setValidator(validator: Property.DataValidators<mw.Vector>): void {
        this._validator = validator;
    }

    public get validated(): Property.DataValidateResult {
        if (Gtk.isNullOrEmpty(this._validator)) return {result: true};
        let param = this.getParam();

        return PropertyUtil.validate(this._validator, param);
    }

//#region Init
    public onCommit: Delegate.SimpleDelegate<InputChangeEvent> = new Delegate.SimpleDelegate<InputChangeEvent>();

    public onKeyUp: Delegate.SimpleDelegate<KeyEvent> = new Delegate.SimpleDelegate<KeyEvent>();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region CallBack
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}