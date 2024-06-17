import { IGodModParamInputParametric, ParamInputSizeY } from "../param-base/IGodModParamInput";
import Gtk, { Delegate } from "gtoolkit";
import { AutoComplete, AutoCompleteItem, Lui, Property } from "mw-lynx-ui";
import { InferParamType } from "../../GodModParam";
import { GodModPanelSizeX } from "../base/GodModPanelConst";
import { GodModParamInputBase } from "../param-base/GodModParamInputBase";
import Log4Ts from "mw-log4ts/Log4Ts";
import Color = Lui.Asset.Color;

class EnumVal implements AutoCompleteItem {
    public label: string;

    public value: unknown;
}

let shareInput: AutoComplete<EnumVal>;

const enumValConcreteMap: Map<object, EnumVal[]> = new Map();

const enumValConcreteIndexer: Map<object, Map<string, unknown>> = new Map();

function getEnumValConcrete(enumObj: object) {
    return Gtk.tryGet(enumValConcreteMap, enumObj, () => {
        const indexer = new Map<string, unknown>();
        const enumValList: EnumVal[] = [];
        Gtk.enumVals(enumObj)
            .forEach((item) => {
                let key = enumObj[item];
                indexer.set(key, item);
                enumValList.push({
                    label: key,
                    value: item,
                });
            });

        enumValConcreteIndexer.set(enumObj, indexer);
        return enumValList;
    });
}

/**
 * GodModEnumParamInput.
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
export default class GodModEnumParamInput<Enum extends object>
    extends GodModParamInputBase
    // @ts-ignore
    implements IGodModParamInputParametric<InferParamType<Enum>> {
    private _currentHoldObject: object;

//#region Lui Component
    public static create<Enum extends object>(): GodModEnumParamInput<Enum> {
        const input = new GodModEnumParamInput<Enum>();

        if (!shareInput) {
            shareInput = AutoComplete.create({
                label: "enum",
                items: [],
                size: {x: GodModPanelSizeX, y: ParamInputSizeY},
                color: {
                    primary: Color.Blue,
                    secondary: Color.Blue200,
                },
                itemHeight: 40,
                maxCount: 6,
                fontSize: 16,
                fontStyle: mw.UIFontGlyph.Light,
                corner: Property.Corner.Top,
            }).attach(input);
        } else {
            shareInput.attach(input);
        }

        Gtk.setUiSize(input.root, GodModPanelSizeX, ParamInputSizeY);

        return input;
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region IGodModParamInputParametric
    public getParam(): InferParamType<Enum> {
        return shareInput?.choose?.value as InferParamType<Enum>;
    }

    public setParam(p: InferParamType<Enum>) {
        const enumObj = this._currentHoldObject;
        const item = enumValConcreteMap
            .get(enumObj)
            ?.find(item => item.value === p);
        if (item !== undefined) {
            shareInput.choose = item;
        } else {
            shareInput.choose = undefined;
        }
    }

    public setEnumObj(enumObj: Enum) {
        this._currentHoldObject = enumObj;
        shareInput
            ?.attach(this)
            ?.reloadItems(getEnumValConcrete(enumObj));
    }

    public setValidator(validator: Property.DataValidators<object>): void {
        if (validator) {
            Log4Ts.log(GodModEnumParamInput, `Enum don't need any validator.`);
        }
    }

    public setCustomLabel(label?: string): void {
        if (!label) return;
        Log4Ts.warn(GodModEnumParamInput,
            `custom label not supported when Enum param.`);
    }

    public get validated(): Property.DataValidateResult {
        return {result: true};
    }

    private _onCommit: Delegate.SimpleDelegate;

    public get onCommit(): Delegate.SimpleDelegate {
        if (!this._onCommit) {
            this._onCommit = new Delegate.SimpleDelegate();
            shareInput.onChoose.add(() => this._onCommit.invoke());
        }

        return this._onCommit;
    }

//#endregion
}

interface GodModEnumParamInputOption {
    enumObj?: object;
}