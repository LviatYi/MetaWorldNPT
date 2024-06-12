import { AcceptableParamType, GodModInferredParamType } from "../GodModParam";
import { GodModParamInputComponent } from "./param-base/IGodModParamInput";
import GodModStringParamInput from "./param-input/GodModStringParamInput";
import GodModNumberParamInput from "./param-input/GodModNumberParamInput";
import GodModIntegerParamInput from "./param-input/GodModIntegerParamInput";
import GodModVectorParamInput from "./param-input/GodModVectorParamInput";
import Gtk from "gtoolkit";
import { AutoComplete, Button, Component, Lui, Property } from "mw-lynx-ui";
import { GodCommandItem } from "../GodCommandItem";
import { GodModPanelSizeX } from "./base/GodModPanelConst";
import GodModEnumParamInput from "./param-input/GodModEnumParamInput";
import { ExpandIcon } from "./icon/ExpandIcon";
import { MoveIcon } from "./icon/MoveIcon";
import Color = Lui.Asset.Color;
import ColorUtil = Lui.Asset.ColorUtil;
import Interval = Lui.Asset.Interval;

export class GodModPanel extends Component {
//#region Constant
    private static readonly TipsShownTime = 2e3;

    private static readonly TipsFadeTime = 1e3;

    private static readonly BtnRunSizeY = 60;

    private static readonly TxtInfoSizeY = 30;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _cnvController: mw.Canvas;

    private _btnExpand: Button;

    private _btnMove: Button;

    private _btnClose: Button;

    private _acInput: AutoComplete<GodCommandItem<AcceptableParamType>>;

    private _cnvParamInputContainer: mw.Canvas;

    private _cnvParamInput: mw.Canvas;

    private _btnRun: Button;

    private _txtInfo: mw.TextBlock;

    private _imgDrag: mw.Image;

    private _godCommandItems: GodCommandItem<AcceptableParamType>[] = [];

    private _currentChoose: GodCommandItem<AcceptableParamType>;

    private _lastChoose: GodCommandItem<AcceptableParamType>;

    private _currentInputComponent: GodModParamInputComponent<GodModInferredParamType>;

    private _paramCache: Map<GodCommandItem<AcceptableParamType>, GodModInferredParamType> = new Map();

    private _paramInputComponentCache: Map<AcceptableParamType, GodModParamInputComponent<GodModInferredParamType>> = new Map();

    private _dragSensitive: number;

    private _dragStartTime: number;

    private _mouseStartMosPos: mw.Vector2;

    private _mouseStartCnvPos: mw.Vector2;

    private _lastShowTipsTime = 0;

    private _runCommandHandler: (label: string,
                                 p: any,
                                 autoDispatchToServer?: boolean) => void;

//#region Lui Component
    public static create(option?: GodModPanelOption): GodModPanel {
        let godModPanel = new GodModPanel();

        godModPanel._godCommandItems = option?.items ?? [];

        if (option.zOrder !== undefined)
            godModPanel.root.zOrder = option.zOrder;
        godModPanel._dragSensitive = option?.dragSensitive ?? 0.5e3;
        Gtk.setUiSize(godModPanel.root, GodModPanelSizeX, 140);

        godModPanel._cnvController = mw.Canvas.newObject(godModPanel.root, "cnvController");
        Gtk.setUiSize(godModPanel._cnvController, GodModPanelSizeX, 80);
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
            renderIcon: ExpandIcon.create(),
        }).attach(godModPanel._cnvController);
        Gtk.setUiPosition(godModPanel._btnExpand.root, 0, 0);
        godModPanel._btnExpand.onClick.add(
            () => godModPanel.showTips("打破常规的全新呼出方式. 敬请期待..."),
        );

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
            renderIcon: MoveIcon.create(),
        }).attach(godModPanel._cnvController);
        Gtk.setUiPosition(godModPanel._btnMove.root, godModPanel._btnExpand.root.size.x, 0);
        godModPanel._btnMove.onClick.add(() => godModPanel.showTips("长按拖动"));
        godModPanel._btnMove.onPress.add(() => {
            godModPanel._dragStartTime = Date.now();
        });
        godModPanel._btnMove.onRelease.add(() => {
            godModPanel.playStopDragEffect();
            godModPanel._dragStartTime = undefined;
            godModPanel._mouseStartMosPos = undefined;
            godModPanel._mouseStartCnvPos = undefined;
        });

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

        godModPanel._btnClose.onClick.add(godModPanel.detach,
            undefined,
            undefined,
            godModPanel);

        godModPanel._acInput = AutoComplete.create({
            label: "search commands",
            items: godModPanel._godCommandItems,
            size: {x: GodModPanelSizeX, y: 60},
            color: {
                primary: Color.Blue,
                secondary: Color.Blue200,
            },
            itemHeight: 40,
            maxCount: 6,
            fontSize: 16,
            fontStyle: mw.UIFontGlyph.Light,
            variant: "filled",
            additionKey: [
                {name: "pinyin", getFn: (item) => item.pinyin},
            ],
            // renderOption: (item) => {},
            corner: Property.Corner.Top,
            zOrder: 5,
        })
            .attach(godModPanel);
        Gtk.setUiPosition(godModPanel._acInput.root, 0, godModPanel._cnvController.size.y);
        godModPanel._acInput.onClear.add(() => {
            godModPanel.hideCnvParamInput();
        });
        godModPanel._acInput.onChoose.add(event => {
            godModPanel._currentChoose = event.item;
            godModPanel.showCnvParamInput();
        });

        godModPanel._cnvParamInputContainer = mw.Canvas.newObject(
            godModPanel.root,
            "cnvParamInputContainer");
        Gtk.setUiPosition(godModPanel._cnvParamInputContainer, 0, 140);
        Gtk.setUiSize(godModPanel._cnvParamInputContainer, GodModPanelSizeX, 1080);
        Gtk.trySetVisibility(godModPanel._cnvParamInputContainer, true);
        godModPanel._cnvParamInputContainer.clipEnable = true;

        godModPanel._cnvParamInput = mw.Canvas.newObject(godModPanel._cnvParamInputContainer,
            "cnvParamInput");
        Gtk.setUiSize(godModPanel._cnvParamInput, GodModPanelSizeX, this.BtnRunSizeY + this.TxtInfoSizeY);

        godModPanel._btnRun = Button.create({
            label: "Run",
            size: {x: GodModPanelSizeX, y: this.BtnRunSizeY},
            color: {
                primary: Color.Green,
                secondary: Color.Green200,
            },
            fontSize: 24,
            corner: Property.Corner.Top,
        }).attach(godModPanel._cnvParamInput);
        godModPanel._btnRun.onClick.add(_ => godModPanel.commit());

        godModPanel._txtInfo = mw.TextBlock.newObject(godModPanel._cnvParamInput, "txtInfo");
        Gtk.setUiSize(godModPanel._txtInfo, GodModPanelSizeX, this.TxtInfoSizeY);
        godModPanel._txtInfo.fontSize = 16;
        godModPanel._txtInfo.textAlign = mw.TextJustify.Left;
        godModPanel._txtInfo.textHorizontalLayout = mw.UITextHorizontalLayout.NoClipping;
        godModPanel._txtInfo.renderOpacity = 0;
        godModPanel._txtInfo.setOutlineColorByHex(ColorUtil.colorHexWithAlpha(Color.Gray800, 1));
        godModPanel._txtInfo.outlineSize = 2;
        Gtk.setUiPositionY(godModPanel._txtInfo, godModPanel._btnRun.root.size.y);

        godModPanel._imgDrag = mw.Image.newObject(godModPanel.root, "imgDrag");
        Gtk.setUiSize(godModPanel._imgDrag, GodModPanelSizeX, 150);
        godModPanel._imgDrag.imageGuid = Lui.Asset.ImgRoundedRectangle;
        godModPanel._imgDrag.imageDrawType = mw.SlateBrushDrawType.PixcelBox;
        godModPanel._imgDrag.margin = new mw.Margin(
            Lui.Asset.ImgRoundedRectangleBoxMargin.left,
            Lui.Asset.ImgRoundedRectangleBoxMargin.top,
            Lui.Asset.ImgRoundedRectangleBoxMargin.right,
            Lui.Asset.ImgRoundedRectangleBoxMargin.bottom,
        );
        godModPanel._imgDrag.setImageColorByHex(ColorUtil.colorHexWithAlpha(Color.White, 0.5));
        Gtk.trySetVisibility(godModPanel._imgDrag, false);

        godModPanel.onAttach.add(() => {
            mw.TimeUtil.onEnterFrame.add(godModPanel.handleDrag);
        });
        godModPanel.onDetach.add(() => {
            mw.TimeUtil.onEnterFrame.remove(godModPanel.handleDrag);
        });
        return godModPanel;
    }

    public static defaultOption() {
        return undefined;
    }

    protected renderAnimHandler: (dt: number) => void = dt => {
        if (this._txtInfo.renderOpacity > 0) {
            const d = Date.now() - this._lastShowTipsTime;
            if (d > GodModPanel.TipsShownTime) {
                this._txtInfo.renderOpacity = Math.max(0,
                    this._txtInfo.renderOpacity - dt / (GodModPanel.TipsFadeTime / 1000));
            }
        }

        const currentY = this._cnvParamInput.position.y;
        const shrinkSize = this._cnvParamInput.size.y - this._txtInfo.size.y;
        if (this._currentChoose !== undefined && currentY < 0) {
            Gtk.setUiPositionY(
                this._cnvParamInput,
                Math.min(0, currentY + shrinkSize * dt / Interval.Fast));
        }

        if (this._currentChoose === undefined) {
            if (currentY > -shrinkSize) {
                Gtk.setUiPositionY(
                    this._cnvParamInput,
                    Math.max(-shrinkSize, currentY - shrinkSize * dt / Interval.Fast));
            }
        }
    };

    protected destroy(): void {
        super.destroy();
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public registerCommandHandler(handler: (label: string,
                                            p: any,
                                            autoDispatchToServer?: boolean) => void): this {
        this._runCommandHandler = handler;
        return this;
    }

//#region Init
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private showCnvParamInput() {
        if (this._lastChoose === this._currentChoose) return;
        if (this._lastChoose) {
            this._paramCache.set(this._lastChoose, this._currentInputComponent?.getParam() ?? undefined);
        }
        if (!this._btnRun.enable) this._btnRun.enable = true;

        this._lastChoose = this._currentChoose;
        const type = this._currentChoose.paramType;

        this._currentInputComponent?.detach();
        this._btnRun.detach();
        this._txtInfo.removeObject();
        let input: GodModParamInputComponent<GodModInferredParamType>;

        if (type !== "void") {
            input = this._paramInputComponentCache.get(type);
            if (!input) {
                switch (type) {
                    case "integer":
                        input = GodModIntegerParamInput.create();
                        break;
                    case "number":
                        input = GodModNumberParamInput.create();
                        break;
                    case "vector":
                        input = GodModVectorParamInput.create();
                        break;
                    case "string":
                    default:
                        if (typeof type === "object") {
                            input = GodModEnumParamInput.create({enumObj: type});
                        } else {
                            input = GodModStringParamInput.create();
                        }
                        break;
                }
                input.onCommit.add(() => {
                    if (this._currentInputComponent === input) {
                        this._btnRun.enable = input.validated.result;
                    }
                });
                this._paramInputComponentCache.set(type, input);
            }

            if (input) {
                input.setValidator(this._currentChoose.paramOption?.validator);
                input.setParam(this._paramCache.get(this._currentChoose));
            }
            if (typeof type === "object") {
                (input as GodModEnumParamInput<any>).setEnumObj(type);
            }
        }

        const paramSizeY = (input?.root?.size.y ?? 0);
        const paramAreaSizeY = paramSizeY + GodModPanel.BtnRunSizeY + GodModPanel.TxtInfoSizeY;

        Gtk.setUiSizeY(this._cnvParamInput,
            paramAreaSizeY);
        Gtk.setUiPositionY(this._btnRun.root, paramSizeY);
        Gtk.setUiPositionY(this._txtInfo,
            paramSizeY +
            this._btnRun.root.size.y);

        this._currentInputComponent = input?.attach(this._cnvParamInput) ?? undefined;
        this._btnRun.attach(this._cnvParamInput);
        this._cnvParamInput.addChild(this._txtInfo);
    }

    private hideCnvParamInput() {
        if (this._lastChoose) {
            this._paramCache.set(this._lastChoose, this._currentInputComponent?.getParam() ?? undefined);
        }
        this._currentChoose = undefined;
    }

    private commit() {
        if (this._currentInputComponent && !this._currentInputComponent.validated.result) {
            this.showWarning(this._currentInputComponent.validated.reason);
            this._btnRun.enable = false;
            return;
        }

        const param = this._currentInputComponent?.getParam() ?? undefined;

        let command = this._currentChoose;
        this.showRunning();
        this._runCommandHandler?.(command.label, param);
    }

    private handleDrag = () => {
        if (this._dragStartTime === undefined) return;
        if (Date.now() - this._dragStartTime < this._dragSensitive) return;

        const viewPortCanvas = mw.UIService.canvas;
        if (this._mouseStartMosPos === undefined) {
            this._mouseStartMosPos = mw.absoluteToLocal(
                viewPortCanvas.cachedGeometry,
                mw.getMousePositionOnPlatform());
            this._mouseStartCnvPos = this.root.position;
            this.playStartDragEffect();
        } else {
            let currMouseRelativePos = mw.absoluteToLocal(
                viewPortCanvas.cachedGeometry,
                mw.getMousePositionOnPlatform());
            Gtk.setUiPosition(
                this.root,
                this._mouseStartCnvPos.x + currMouseRelativePos.x - this._mouseStartMosPos.x,
                this._mouseStartCnvPos.y + currMouseRelativePos.y - this._mouseStartMosPos.y);
        }
    };

    private playStartDragEffect() {
        Gtk.setUiScale(this.root, 1.1, 1.1);
        Gtk.trySetVisibility(this._imgDrag, true);
    }

    private playStopDragEffect() {
        Gtk.setUiScale(this.root, 1, 1);
        Gtk.trySetVisibility(this._imgDrag, false);

        if (this.root.position.x < 0) {
            Gtk.setUiPositionX(this.root, 0);
        }
        if (this.root.position.y < 0) {
            Gtk.setUiPositionY(this.root, 0);
        }
        if (this.root.position.x > mw.UIService.canvas.size.x - this.root.size.x) {
            Gtk.setUiPositionX(this.root, mw.UIService.canvas.size.x - this.root.size.x);
        }
        if (this.root.position.y > mw.UIService.canvas.size.y - this.root.size.y) {
            Gtk.setUiPositionY(this.root, mw.UIService.canvas.size.y - this.root.size.y);
        }
    }

    private showTips(text: string, color?: string) {
        this._txtInfo.setFontColorByHex(ColorUtil.colorHexWithAlpha(color ?? Color.Blue, 1));
        this._txtInfo.text = text;
        this._lastShowTipsTime = Date.now();
        this._txtInfo.renderOpacity = 1;
    }

    private showWarning(text: string) {
        this.showTips(text, Color.Red);
    }

    public showSuccess() {
        this.showTips("Worked!", Color.Green);
    }

    public showRunning() {
        this.showTips("Running...", Color.Blue);
    }

    public showError() {
        this.showTips("Error!", Color.Red);
    }

//#region CallBack
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export interface GodModPanelOption {
    items: GodCommandItem<AcceptableParamType>[];

    /**
     * 拖动敏度. ms
     * @desc 该时间后触发拖动.
     */
    dragSensitive?: number;

    zOrder?: number;
}