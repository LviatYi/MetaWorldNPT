// import { IGodModParamInputParametric, ParamInputSizeY } from "../param-base/IGodModParamInput";
// import { GodModParamInputOption } from "../param-base/IGodModParamValidatorOption";
// import Gtk, { Delegate } from "gtoolkit";
// import {
//     AutoComplete,
//     AutoCompleteItem,
//     Component,
//     InputChangeEvent,
//     KeyEvent,
//     Lui,
//     Property,
//     TextField,
// } from "mw-lynx-ui";
// import Log4Ts from "mw-log4ts";
// import Color = Lui.Asset.Color;
//
// class EnumVal implements AutoCompleteItem {
//     public label: string;
// }
//
// /**
//  * GodModEnumParamInput.
//  *
//  * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
//  * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
//  * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
//  * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
//  * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//  * @author LviatYi
//  * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
//  * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
//  * @internal
//  */
// export default class GodModEnumParamInput extends Component implements IGodModParamInputParametric<object> {
//     private _input: AutoComplete<EnumVal>;
//
// //#region Lui Component
//     public static create(option?: GodModParamInputOption): GodModEnumParamInput {
//         let input = new GodModEnumParamInput();
//
//         input._inputX = TextField.create({
//             label: "x",
//             size: {x: 135, y: ParamInputSizeY},
//             padding: {right: 5},
//             color: {
//                 primary: Color.Blue,
//                 secondary: Color.Blue200,
//             },
//             fontSize: 16,
//             fontStyle: mw.UIFontGlyph.Light,
//             corner: Property.Corner.Top,
//             type: mw.InputTextLimit.LimitToFloat,
//         }).attach(input);
//
//         input._inputY = TextField.create({
//             label: "y",
//             size: {x: 135, y: ParamInputSizeY},
//             padding: {right: 5},
//             color: {
//                 primary: Color.Blue,
//                 secondary: Color.Blue200,
//             },
//             fontSize: 16,
//             fontStyle: mw.UIFontGlyph.Light,
//             corner: Property.Corner.Top,
//             type: mw.InputTextLimit.LimitToFloat,
//         }).attach(input);
//         Gtk.setUiPositionX(input._inputY.root, 135);
//
//         input._inputZ = TextField.create({
//             label: "z",
//             size: {x: 130, y: ParamInputSizeY},
//             color: {
//                 primary: Color.Blue,
//                 secondary: Color.Blue200,
//             },
//             fontSize: 16,
//             fontStyle: mw.UIFontGlyph.Light,
//             corner: Property.Corner.Top,
//             type: mw.InputTextLimit.LimitToFloat,
//         }).attach(input);
//         Gtk.setUiPositionX(input._inputZ.root, 270);
//
//         Gtk.setUiSize(input.root, 400, ParamInputSizeY);
//
//         input._inputZ.onKeyUp.add((e) => {
//             input.onKeyUp.invoke(e);
//         });
//
//         return input;
//     };
//
// //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//
//     public getParam(): object {
//         return this._input.text;
//     }
//
//     public setParam(p: object) {
//         this._inputX.setContent(p?.x?.toString() ?? "");
//         this._inputY.setContent(p?.y?.toString() ?? "");
//         this._inputZ.setContent(p?.z?.toString() ?? "");
//
//         this._inputX.onCommit.add(e => this.onCommit.invoke(e));
//         this._inputY.onCommit.add(e => this.onCommit.invoke(e));
//         this._inputZ.onCommit.add(e => this.onCommit.invoke(e));
//         this._inputX.onKeyUp.add(e => this.onKeyUp.invoke(e));
//         this._inputY.onKeyUp.add(e => this.onKeyUp.invoke(e));
//         this._inputZ.onKeyUp.add(e => this.onKeyUp.invoke(e));
//     }
//
//     public setValidator(validator: Property.DataValidators<object>): void {
//         Log4Ts.log(GodModEnumParamInput, `Enum don't need any validator.`);
//     }
//
//     public get validated(): Property.DataValidateResult {
//         return {result: true};
//     }
//
// //#region Init
//     public onCommit: Delegate.SimpleDelegate<InputChangeEvent> = new Delegate.SimpleDelegate<InputChangeEvent>();
//
//     public onKeyUp: Delegate.SimpleDelegate<KeyEvent> = new Delegate.SimpleDelegate<KeyEvent>();
//
// //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//
// //#region CallBack
// //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
// }