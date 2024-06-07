import { IGodModParamInputParametric, ParamInputSizeY } from "../param-base/IGodModParamInput";
import { GodModParamInputOption } from "../param-base/IGodModParamValidatorOption";
import Gtk, { Delegate } from "gtoolkit";
import { AutoComplete, AutoCompleteItem, InputChangeEvent, KeyEvent, Lui, Property } from "mw-lynx-ui";
import Log4Ts from "mw-log4ts";
import { InferParamType } from "../../GodModParam";
import { GodModPanelSizeX } from "../base/GodModPanelConst";
import { GodModParamInputBase } from "../param-base/GodModParamInputBase";
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
    public static create<Enum extends object>(option?: GodModEnumParamInputOption): GodModEnumParamInput<Enum> {
        const input = new GodModEnumParamInput<Enum>();
        input._currentHoldObject = option.enumObj;
        const enumVals = getEnumValConcrete(option.enumObj);

        if (!shareInput) {
            shareInput = AutoComplete.create({
                label: "enum",
                items: enumVals,
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
            })
                .attach(input);
        } else {
            shareInput.reloadItems(enumVals);
        }

        Gtk.setUiSize(input.root, GodModPanelSizeX, ParamInputSizeY);

        return input;
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public getParam(): InferParamType<Enum> {
        return shareInput?.choose?.value as InferParamType<Enum>;
    }

    public setParam(p: InferParamType<Enum>) {
        const enumObj = this._currentHoldObject;
        const item = enumValConcreteMap.get(enumObj).find(item => item.value === p);
        if (item !== undefined) {
            shareInput.choose = item;
        }
    }

    public setEnumObj(enumObj: Enum) {
        this._currentHoldObject = enumObj;
        shareInput?.reloadItems(getEnumValConcrete(enumObj));
    }

    public setValidator(validator: Property.DataValidators<object>): void {
        Log4Ts.log(GodModEnumParamInput, `Enum don't need any validator.`);
    }

    public get validated(): Property.DataValidateResult {
        return {result: true};
    }

//#region Init
    public onCommit: Delegate.SimpleDelegate<InputChangeEvent> = new Delegate.SimpleDelegate<InputChangeEvent>();

    public onKeyUp: Delegate.SimpleDelegate<KeyEvent> = new Delegate.SimpleDelegate<KeyEvent>();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region CallBack
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

interface GodModEnumParamInputOption extends GodModParamInputOption {
    validator?: Property.DataValidators<string>;

    enumObj?: object;
}