import Component from "../../../lui/component/Component";
import AutoComplete from "../../../lui/component/AutoComplete";
import { GodCommandItem, GodModService } from "../GodModService";
import { AcceptableParamType, GodModInferredParamType } from "../GodModParam";
import { Color, Interval } from "../../../lui/Theme";
import Gtk from "../../../util/GToolkit";
import Button from "../../../lui/component/Button";
import { Property } from "../../../lui/Style";
import { GodModStringParamInput } from "./GodModStringParamInput";
import { GodModParamInputComponent } from "./IGodModParamInput";

export class GodModPanel extends Component {
    private _cnvController: mw.Canvas;

    private _btnExpand: Button;

    private _btnMove: Button;

    private _btnClose: Button;

    private _acInput: AutoComplete<GodCommandItem<AcceptableParamType>>;

    private _cnvParamInputContainer: mw.Canvas;

    private _cnvParamInput: mw.Canvas;

    private _btnRun: Button;

    private _godCommandItems: GodCommandItem<AcceptableParamType>[] = [];

    private _currentChoose: GodCommandItem<AcceptableParamType>;

    private _currentInputType: AcceptableParamType;

    private _currentInputComponent: GodModParamInputComponent<GodModInferredParamType>;

    private _paramInputCache: Map<AcceptableParamType, GodModParamInputComponent<GodModInferredParamType>> = new Map();

//#region Lui Component
    public static create(option?: GodModPanelOption): GodModPanel {
        let godModPanel = new GodModPanel();

        godModPanel._godCommandItems = option?.items ?? [];

        if (option.zOrder !== undefined)
            godModPanel.root.zOrder = option.zOrder;

        Gtk.setUiSize(godModPanel.root, 400, 180);

        godModPanel._cnvController = mw.Canvas.newObject(godModPanel.root, "cnvController");
        Gtk.setUiSize(godModPanel._cnvController, 400, 80);
        Gtk.trySetVisibility(godModPanel._cnvController, true);

        godModPanel._btnExpand = Button.create({
            label: "expand",
            size: {x: 220, y: 80},
            padding: {top: 10, right: 20, bottom: 10, left: 0},
            color: {
                primary: Color.Blue,
                secondary: Color.Blue200,
            },
            fontSize: 16,
            corner: Property.Corner.TopRight | Property.Corner.Bottom,
        }).attach(godModPanel._cnvController);
        Gtk.setUiPosition(godModPanel._btnExpand.root, 0, 0);

        godModPanel._btnMove = Button.create({
            label: "move",
            size: {x: 100, y: 80},
            padding: {top: 10, right: 20, bottom: 10, left: 0},
            color: {
                primary: Color.Blue,
                secondary: Color.Blue200,
            },
            fontSize: 16,
            corner: Property.Corner.All,
        }).attach(godModPanel._cnvController);
        Gtk.setUiPosition(godModPanel._btnMove.root, godModPanel._btnExpand.root.size.x, 0);

        godModPanel._btnClose = Button.create({
            label: "close",
            size: {x: 80, y: 80},
            padding: {top: 10, right: 0, bottom: 10, left: 0},
            color: {
                primary: Color.Red,
                secondary: Color.Red200,
            },
            fontSize: 16,
            icon: "287315",
            corner: Property.Corner.TopLeft | Property.Corner.Bottom,
        }).attach(godModPanel._cnvController);
        Gtk.setUiPosition(godModPanel._btnClose.root,
            godModPanel._btnExpand.root.size.x + godModPanel._btnMove.root.size.x, 0);

        godModPanel._acInput = AutoComplete
            .create({
                label: "search commands",
                items: godModPanel._godCommandItems,
                size: {x: 400, y: 60},
                color: {
                    primary: Color.Blue,
                    secondary: Color.Blue200,
                },
                itemHeight: 40,
                maxCount: 6,
                fontSize: 16,
                fontStyle: mw.UIFontGlyph.Light,
                variant: "filled",
                // renderOption: (item) => {},
                corner: Property.Corner.Top,
                zOrder: 5,
            })
            .attach(godModPanel);
        Gtk.setUiPosition(godModPanel._acInput.root, 0, godModPanel._cnvController.size.y);

        godModPanel._cnvParamInputContainer = mw.Canvas.newObject(godModPanel.root, "cnvParamInputContainer");
        Gtk.setUiPosition(godModPanel._cnvParamInputContainer, 0, 140);
        Gtk.setUiSize(godModPanel._cnvParamInputContainer, 400, 60);
        Gtk.trySetVisibility(godModPanel._cnvParamInputContainer, true);
        godModPanel._cnvParamInputContainer.clipEnable = true;

        godModPanel._cnvParamInput = mw.Canvas.newObject(godModPanel._cnvParamInputContainer,
            "cnvParamInputContainer");
        Gtk.setUiPosition(godModPanel._cnvParamInput, 0, 0);

        godModPanel._acInput.onClear.add(() => {
            godModPanel.hideCnvParamInput();
        });
        godModPanel._acInput.onChoose.add((event) => {
            godModPanel._currentChoose = event.item;
            godModPanel.showCnvParamInput();
        });

        godModPanel._btnRun = Button.create({
            label: "Run",
            size: {x: 400, y: 80},
            padding: {top: 20},
            color: {
                primary: Color.Green,
                secondary: Color.Green200,
            },
            fontSize: 24,
            corner: Property.Corner.Top,
        }).attach(godModPanel._cnvParamInput);

        godModPanel._btnRun.onClick.add(_ => godModPanel.commit());

        return godModPanel;
    }

    public static defaultOption() {
        return undefined;
    }

    protected renderAnimHandler: (dt: number) => void =
        dt => {
            const currentY = this._cnvParamInput.position.y;
            const currentSize = this._cnvParamInput.size.y;
            if (this._currentInputType !== undefined && currentY < 0) {
                Gtk.setUiPositionY(
                    this._cnvParamInput,
                    Math.min(0, currentY + currentSize * dt / Interval.Fast));
            }

            if (this._currentInputType === undefined) {
                if (currentY > -currentSize) {
                    Gtk.setUiPositionY(
                        this._cnvParamInput,
                        Math.max(-currentSize, currentY - currentSize * dt / Interval.Fast));
                } else if (this._currentInputComponent !== undefined) {
                    this._currentInputComponent.detach();
                    this._currentInputComponent = undefined;
                }
            }
        };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private showCnvParamInput() {
        if (this._currentInputType === this._currentChoose.paramType) return;
        const type = this._currentChoose.paramType;

        this._currentInputComponent?.detach();
        this._btnRun.detach();
        this._currentInputType = type;
        let input: GodModParamInputComponent<GodModInferredParamType>;

        if (type !== "void") {
            input = this._paramInputCache.get(type);
            if (!input) {
                switch (type) {
                    case "number":
                        break;
                    case "boolean":
                        break;
                    case "string":
                    default:
                        input = GodModStringParamInput.create();
                        break;
                }
                this._paramInputCache.set(type, input);
            }
        }

        const paramSizeY = (input?.root?.size.y ?? 0);
        const paramAreaSizeY = paramSizeY + this._btnRun.root.size.y;

        Gtk.setUiSizeY(this._cnvParamInput,
            paramAreaSizeY);
        Gtk.setUiSizeY(this._cnvParamInputContainer,
            paramAreaSizeY);
        Gtk.setUiPositionY(this._btnRun.root, paramSizeY);

        this._currentInputComponent = input?.attach(this._cnvParamInput) ?? undefined;
        this._btnRun.attach(this._cnvParamInput);
    }

    private hideCnvParamInput() {
        this._currentInputType = undefined;
    }

    private commit() {
        const param = this._currentInputComponent?.getParam() ?? undefined;

        let command = this._currentChoose;
        GodModService.getInstance().runCommandInClient(command.label, param);
    }

//#region Init
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region CallBack
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export interface GodModPanelOption {
    items: GodCommandItem<AcceptableParamType>[];

    zOrder: number;
}