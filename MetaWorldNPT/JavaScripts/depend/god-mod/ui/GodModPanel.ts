import { AcceptableParamType, ConfigBase, GodModInferParamForTransmit, IElementBase } from "../GodModParam";
import { GodModParamInputComponent } from "./param-base/IGodModParamInput";
import GodModStringParamInput from "./param-input/GodModStringParamInput";
import GodModNumberParamInput from "./param-input/GodModNumberParamInput";
import GodModIntegerParamInput from "./param-input/GodModIntegerParamInput";
import GodModVectorParamInput from "./param-input/GodModVectorParamInput";
import Gtk from "gtoolkit";
import { AutoComplete, Button, Component, Dialogue, Lui, Property } from "mw-lynx-ui";
import { GodCommandItem } from "../GodCommandItem";
import { GodModPanelSizeX } from "./base/GodModPanelConst";
import GodModEnumParamInput from "./param-input/GodModEnumParamInput";
import { ExpandIcon } from "./icon/ExpandIcon";
import { MoveIcon } from "./icon/MoveIcon";
import { PlatformIcon, PlatformIconVariant } from "./icon/PlatformIcon";
import GodModGameConfigRenderer from "./param-renderer/GodModGameConfigRenderer";
import GodModGameConfigParamInput from "./param-input/GodModGameConfigParamInput";
import GodModRotationParamInput from "./param-input/GodModRotationParamInput";
import GodModVector2ParamInput from "./param-input/GodModVector2ParamInput";
import Color = Lui.Asset.Color;
import ColorUtil = Lui.Asset.ColorUtil;
import Interval = Lui.Asset.Interval;

export class GodModPanel extends Component {
//#region Constant
    private static readonly TipsShownTime = 2e3;

    private static readonly TipsFadeTime = 1e3;

    private static readonly BtnRunSizeY = 60;

    private static readonly TxtInfoSizeY = 30;

    private static readonly AutoShrinkFloatTime = 3e3;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _cnvMain: mw.Canvas;

    private _cnvController: mw.Canvas;

    private _btnExpand: Button;

    private _btnMove: Button;

    private _btnClose: Button;

    private _acInput: AutoComplete<GodCommandItem<AcceptableParamType>>;

    private _cnvParamInputContainer: mw.Canvas;

    private _cnvParamInput: mw.Canvas;

    private _btnRun: Button;

    private _txtInfo: mw.TextBlock;

    private _gameConfigRenderer: GodModGameConfigRenderer;

    private _imgDrag: mw.Image;

    private _cnvFloatWindow: mw.Canvas;

    private _btnFloat: mw.Button;

    private _imgExpandFloatBar: mw.Image;

    private _imgShrinkFloatBar: mw.Image;

    private _btnShow: Button;

    private _godCommandItems: GodCommandItem<AcceptableParamType>[] = [];

    private _currentChoose: GodCommandItem<AcceptableParamType>;

    private _lastChoose: GodCommandItem<AcceptableParamType>;

    private _currentInputComponent: GodModParamInputComponent<GodModInferParamForTransmit>;

    private _paramCache: Map<GodCommandItem<AcceptableParamType>, GodModInferParamForTransmit> = new Map();

    private _paramInputComponentCache: Map<AcceptableParamType, GodModParamInputComponent<GodModInferParamForTransmit>> = new Map();

    private _dragSensitive: number;

    private _dragStartTime: number;

    private _mouseStartMosPos: mw.Vector2;

    private _mouseStartCnvPos: mw.Vector2;

    private _lastShowTipsTime = 0;

    private _currentChooseConfigBase: ConfigBase<IElementBase> = undefined;

    private _currentTouchBtnMoveLocation: mw.Vector2 = undefined;

    private _floating: boolean = false;

    private _expandFloat: boolean = false;

    private _autoShrinkFloatTimer: number;

    private _enterFloatDist: number;

    private _currentTipShowTime: number;

    private get btnMovePointerLocation(): mw.Vector2 {
        if (Gtk.useMouse) return mw.getMousePositionOnPlatform();
        else return this._currentTouchBtnMoveLocation;
    }

    private _runCommandHandler: (label: string,
                                 p: any,
                                 autoDispatchToServer?: boolean) => void;

//#region Lui Component
    public static create(option?: GodModPanelOption): GodModPanel {
        let godModPanel = new GodModPanel();

        godModPanel._godCommandItems = option?.items ?? [];

        if (option.zOrder !== undefined)
            godModPanel.root.zOrder = option.zOrder;
        godModPanel._dragSensitive = option?.dragSensitive ?? 0.25e3;
        Gtk.setUiSize(godModPanel.root, GodModPanelSizeX, 140);

        godModPanel._cnvMain = mw.Canvas.newObject(godModPanel.root, "cnvMain");
        Gtk.setUiSize(godModPanel._cnvMain, GodModPanelSizeX, 140);

        godModPanel._cnvController = mw.Canvas.newObject(godModPanel._cnvMain, "cnvController");
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
            icon: ExpandIcon.create(),
        }).attach(godModPanel._cnvController);
        Gtk.setUiPosition(godModPanel._btnExpand.root, 0, 0);
        godModPanel._btnExpand.onClick.add(
            () => godModPanel.innerShowTips("打破常规的全新呼出方式. 敬请期待..."),
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
            icon: MoveIcon.create(),
        }).attach(godModPanel._cnvController);
        Gtk.setUiPosition(godModPanel._btnMove.root, godModPanel._btnExpand.root.size.x, 0);
        godModPanel._btnMove.onClick.add(() => godModPanel.innerShowTips("长按拖动"));
        godModPanel._btnMove.onPress.add(() => {
            godModPanel._dragStartTime = Date.now();
        });
        godModPanel._btnMove.onRelease.add(() => {
            godModPanel.playStopDragEffect();
            godModPanel._dragStartTime = undefined;
            godModPanel._mouseStartMosPos = undefined;
            godModPanel._mouseStartCnvPos = undefined;
        });
        (godModPanel._btnMove["_btn"]["onTouchMoved"] as
            mw.Delegate<(absolutionPosition: mw.Vector2, pointEvent: mw.PointerEvent) => boolean>)
            .bind((pos, evt) => {
                if (godModPanel._dragStartTime === undefined ||
                    Date.now() - godModPanel._dragStartTime < godModPanel._dragSensitive) {
                    godModPanel._currentTouchBtnMoveLocation = undefined;
                    return true;
                }

                godModPanel._currentTouchBtnMoveLocation = evt.screenSpacePosition;

                return true;
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
            iconImage: "287315",
            corner: Property.Corner.TopLeft | Property.Corner.Bottom,
        }).attach(godModPanel._cnvController);
        Gtk.setUiPosition(godModPanel._btnClose.root,
            godModPanel._btnExpand.root.size.x + godModPanel._btnMove.root.size.x, 0);
        godModPanel._btnClose.onClick.add((param) => {
                Dialogue.create({
                    title: "确定要关闭吗？",
                    message: "关闭意味着无法再次打开。\n折叠可以点按悬浮窗再次打开。",
                    modal: true,
                    feedbacks: [{
                        label: "关闭",
                        callback: () => godModPanel.destroy(),
                        variant: "warning",
                    }, {
                        label: "折叠",
                        callback: () => godModPanel._floating = true,
                    }, {
                        label: "取消",
                    }],
                })
                    .attach(godModPanel.root);
            },
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
            iconRenderer: (item) => {
                let variant: PlatformIconVariant;
                if (!item.clientCmd && !item.serverCmd) {
                    return undefined;
                } else if (item.clientCmd && !item.serverCmd) {
                    variant = "client";
                } else if (!item.clientCmd && item.serverCmd) {
                    variant = "server";
                } else {
                    variant = "double";
                }

                return PlatformIcon.create({
                    size: {x: 24, y: 24},
                    fontSize: 12,
                    variant,
                });
            },
            iconAlign: "right",
            corner: Property.Corner.Top,
            zOrder: 5,
        }).attach(godModPanel._cnvMain);
        Gtk.setUiPosition(godModPanel._acInput.root, 0, godModPanel._cnvController.size.y);
        godModPanel._acInput.onClear.add(() => {
            godModPanel.hideCnvParamInput();
        });
        godModPanel._acInput.onChoose.add(event => {
            godModPanel._currentChoose = event.item;
            godModPanel.showCnvParamInput();
        });

        godModPanel._cnvParamInputContainer = mw.Canvas.newObject(
            godModPanel._cnvMain,
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
        Gtk.setUiPositionY(godModPanel._txtInfo, this.BtnRunSizeY);
        Gtk.setUiSize(godModPanel._txtInfo, GodModPanelSizeX, this.TxtInfoSizeY);
        godModPanel._txtInfo.fontSize = 16;
        godModPanel._txtInfo.textAlign = mw.TextJustify.Left;
        godModPanel._txtInfo.textHorizontalLayout = mw.UITextHorizontalLayout.NoClipping;
        godModPanel._txtInfo.renderOpacity = 0;
        godModPanel._txtInfo.setOutlineColorByHex(ColorUtil.colorHexWithAlpha(Color.Gray800, 1));
        godModPanel._txtInfo.outlineSize = 2;

        godModPanel._gameConfigRenderer = GodModGameConfigRenderer.create()
            .attach(godModPanel._cnvParamInput);
        Gtk.setUiPositionY(godModPanel._gameConfigRenderer.root,
            this.BtnRunSizeY +
            this.TxtInfoSizeY);

        godModPanel._imgDrag = mw.Image.newObject(godModPanel._cnvMain, "imgDrag");
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

        godModPanel._cnvFloatWindow = mw.Canvas.newObject(godModPanel.root, "cnvFloatWindow");
        Gtk.setUiPosition(godModPanel._cnvFloatWindow, GodModPanelSizeX - 200, 0);
        Gtk.setUiSize(godModPanel._cnvFloatWindow, 220, 80);
        Gtk.trySetVisibility(godModPanel._cnvFloatWindow, false);

        godModPanel._btnFloat = mw.Button.newObject(godModPanel._cnvFloatWindow, "btnFloat");
        Gtk.setUiPosition(godModPanel._btnFloat, 200, 0);
        Gtk.setUiSize(godModPanel._btnFloat, 20, 80);
        godModPanel._btnFloat.normalImageDrawType = mw.SlateBrushDrawType.NoDrawType;
        godModPanel._btnFloat.transitionEnable = false;
        godModPanel._btnFloat.onClicked.add(() => {
            godModPanel._expandFloat = !godModPanel._expandFloat;
            if (godModPanel._expandFloat) {
                godModPanel._autoShrinkFloatTimer = mw.setTimeout(() => {
                        godModPanel._expandFloat = false;
                        godModPanel._autoShrinkFloatTimer = undefined;
                    },
                    this.AutoShrinkFloatTime);
            } else if (godModPanel._autoShrinkFloatTimer !== undefined) {
                mw.clearTimeout(godModPanel._autoShrinkFloatTimer);
                godModPanel._autoShrinkFloatTimer = undefined;
            }
        });

        godModPanel._imgExpandFloatBar = mw.Image.newObject(godModPanel._cnvFloatWindow,
            "imgExpandFloatBar");
        Gtk.setUiPosition(godModPanel._imgExpandFloatBar, 165, 36);
        Gtk.setUiSize(godModPanel._imgExpandFloatBar, 80, 8);
        godModPanel._imgExpandFloatBar.imageGuid = "318668";
        godModPanel._imgExpandFloatBar.setImageColorByHex(
            Lui.Asset.ColorUtil.colorHexWithAlpha(Lui.Asset.Color.Blue, 1));
        godModPanel._imgExpandFloatBar.imageDrawType = mw.SlateBrushDrawType.Image;
        godModPanel._imgExpandFloatBar.renderTransformAngle = 90;

        godModPanel._imgShrinkFloatBar = mw.Image.newObject(godModPanel._cnvFloatWindow,
            "imgShrinkFloatBar");
        Gtk.setUiPosition(godModPanel._imgShrinkFloatBar, 200, 20);
        Gtk.setUiSize(godModPanel._imgShrinkFloatBar, 20, 40);
        godModPanel._imgShrinkFloatBar.imageGuid = "120780";
        godModPanel._imgShrinkFloatBar.setImageColorByHex(
            Lui.Asset.ColorUtil.colorHexWithAlpha(Lui.Asset.Color.Blue, 1));
        godModPanel._imgShrinkFloatBar.imageDrawType = mw.SlateBrushDrawType.Image;
        godModPanel._imgShrinkFloatBar.renderTransformPivot = new Vector2(0.25, 0.5);
        Gtk.setUiScaleX(godModPanel._imgShrinkFloatBar, 0);

        godModPanel._btnShow = Button.create({
            size: {x: 200, y: 80},
            label: "ShowGodMod",
            color: {
                primary: Color.Blue,
                secondary: Color.Blue200,
            },
            fontSize: 18,
            variant: "contained",
        }).attach(godModPanel._cnvFloatWindow);
        godModPanel._btnShow.onClick.add(() => {
            godModPanel._floating = false;
            if (godModPanel._autoShrinkFloatTimer !== undefined) {
                mw.clearTimeout(godModPanel._autoShrinkFloatTimer);
                godModPanel._autoShrinkFloatTimer = undefined;
            }
        });

        godModPanel.onAttach.add(() => {
            mw.TimeUtil.onEnterFrame.add(godModPanel.dragHandler);
        });
        godModPanel.onDetach.add(() => {
            mw.TimeUtil.onEnterFrame.remove(godModPanel.dragHandler);
        });
        return godModPanel;
    }

    public static defaultOption() {
        return undefined;
    }

    protected renderAnimHandler: (dt: number) => void = dt => {
        if (this._txtInfo.renderOpacity > 0) {
            const d = Date.now() - this._lastShowTipsTime;
            if (d > this._currentTipShowTime) {
                this._txtInfo.renderOpacity = Math.max(0,
                    this._txtInfo.renderOpacity - dt / (GodModPanel.TipsFadeTime / 1000));
            }
        }

        const currentY = this._cnvParamInput.position.y;
        const shrinkSize = this._cnvParamInput.size.y - GodModPanel.TxtInfoSizeY;
        if (this._currentChoose !== undefined && currentY < 0) {
            Gtk.setUiPositionY(this._cnvParamInput,
                Math.min(0, currentY + shrinkSize * dt / Interval.Fast));
        }

        if (this._currentChoose === undefined) {
            if (currentY > -shrinkSize) {
                Gtk.setUiPositionY(
                    this._cnvParamInput,
                    Math.max(-shrinkSize, currentY - shrinkSize * dt / Interval.Fast));
            }
        }

        if (this._floating) {
            if (this._cnvMain.renderOpacity > 0) {
                this._cnvMain.renderOpacity = Math.max(0,
                    this._cnvMain.renderOpacity - dt / Interval.Fast);
            }
            if (this.root.position.x > -GodModPanelSizeX) {
                if (this._enterFloatDist === undefined) {
                    this._enterFloatDist = this.root.position.x + GodModPanelSizeX;
                }
                Gtk.setUiPositionX(this.root,
                    Math.max(-GodModPanelSizeX,
                        this.root.position.x - this._enterFloatDist * dt / Interval.Fast));
            } else if (!this._cnvFloatWindow.visible) {
                Gtk.setUiPositionX(this._cnvFloatWindow, GodModPanelSizeX);
                Gtk.trySetVisibility(this._cnvFloatWindow, true);

                this._enterFloatDist = undefined;
                this._expandFloat = true;
                Gtk.setUiScaleX(this._imgShrinkFloatBar, 1);
                this._imgExpandFloatBar.renderOpacity = 0;

                this._autoShrinkFloatTimer = mw.setTimeout(() => {
                    this._expandFloat = false;
                    this._autoShrinkFloatTimer = undefined;
                }, 1e3);
            }
        } else {
            if (this._cnvFloatWindow.visible) {
                Gtk.trySetVisibility(this._cnvFloatWindow, false);
            }
            if (this._cnvMain.renderOpacity < 1) {
                this._cnvMain.renderOpacity = Math.min(1,
                    this._cnvMain.renderOpacity + dt / Interval.Fast);
            }
            if (this.root.position.x < 0) {
                Gtk.setUiPositionX(this.root,
                    Math.min(0,
                        this.root.position.x + GodModPanelSizeX * dt / Interval.Fast));
            }
        }

        if (this._expandFloat) {
            if (this._cnvFloatWindow.position.x < GodModPanelSizeX) {
                Gtk.setUiPositionX(this._cnvFloatWindow,
                    Math.min(GodModPanelSizeX,
                        this._cnvFloatWindow.position.x + GodModPanelSizeX * dt / Interval.Fast));
            }
            if (this._imgShrinkFloatBar.renderScale.x < 1) {
                Gtk.setUiScaleX(this._imgShrinkFloatBar,
                    Math.min(1, this._imgShrinkFloatBar.renderScale.x + dt / Interval.Fast));
                this._imgExpandFloatBar.renderOpacity = Math.max(0,
                    this._imgExpandFloatBar.renderOpacity - dt / Interval.Fast);
            }
        } else {
            if (this._cnvFloatWindow.position.x > GodModPanelSizeX - 200) {
                Gtk.setUiPositionX(this._cnvFloatWindow,
                    Math.max(GodModPanelSizeX - 200,
                        this._cnvFloatWindow.position.x - GodModPanelSizeX * dt / Interval.Fast));
            }
            if (this._imgShrinkFloatBar.renderScale.x > 0) {
                Gtk.setUiScaleX(this._imgShrinkFloatBar,
                    Math.max(0, this._imgShrinkFloatBar.renderScale.x - dt / Interval.Fast));
                this._imgExpandFloatBar.renderOpacity = Math.min(1,
                    this._imgExpandFloatBar.renderOpacity + dt / Interval.Fast);
            }
        }
    };

    protected destruct(): void {
        super.destroy();
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public refreshCmdItems(items: GodCommandItem<AcceptableParamType>[]) {
        this._godCommandItems = items;
        this._acInput.reloadItems(items);
    }

    public registerCommandHandler(handler: (label: string,
                                            p: any,
                                            autoDispatchToServer?: boolean) => void): this {
        this._runCommandHandler = handler;
        return this;
    }

    private showCnvParamInput() {
        const type = this._currentChoose.paramType;
        this._gameConfigRenderer.show = !!(typeof type === "object" &&
            typeIsConfig(type));
        if (this._lastChoose === this._currentChoose) return;
        if (this._lastChoose) {
            this._paramCache.set(this._lastChoose, this._currentInputComponent?.getParam() ?? undefined);
        }
        if (!this._btnRun.enable) this._btnRun.enable = true;

        this._lastChoose = this._currentChoose;

        this._currentInputComponent?.detach();
        this._btnRun.detach();
        this._txtInfo.removeObject();
        this._gameConfigRenderer.detach();
        let input: GodModParamInputComponent<GodModInferParamForTransmit>;

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
                    case "vector2":
                        input = GodModVector2ParamInput.create();
                        break;
                    case "rotation":
                        input = GodModRotationParamInput.create();
                        break;
                    case "string":
                    default:
                        if (typeof type === "object") {
                            if (typeIsConfig(type)) {
                                input = GodModGameConfigParamInput.create();
                                input.onCommit.add(() => {
                                    const id = input.getParam() as number;
                                    const config = this._currentChooseConfigBase?.getElement(id);
                                    this._gameConfigRenderer.render(config);
                                });
                            } else {
                                input = GodModEnumParamInput.create();
                            }
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

            input?.setCustomLabel(this._currentChoose.paramOption?.label);
            input?.setValidator(this._currentChoose.paramOption?.validator);

            if (typeof type === "object") {
                if (typeIsConfig(type)) {
                    this._currentChooseConfigBase = type;
                } else {
                    (input as GodModEnumParamInput<any>)?.setEnumObj(type);
                }
            }

            input?.setParam(this._paramCache.get(this._currentChoose));
        }

        const paramSizeY = (input?.root?.size.y ?? 0);
        const paramAreaSizeY = paramSizeY + GodModPanel.BtnRunSizeY + GodModPanel.TxtInfoSizeY;

        Gtk.setUiSizeY(this._cnvParamInput,
            paramAreaSizeY);
        Gtk.setUiPositionY(this._btnRun.root, paramSizeY);
        Gtk.setUiPositionY(this._txtInfo,
            paramSizeY +
            GodModPanel.BtnRunSizeY);
        Gtk.setUiPositionY(this._gameConfigRenderer.root,
            paramSizeY +
            GodModPanel.BtnRunSizeY +
            GodModPanel.TxtInfoSizeY);

        this._currentInputComponent = input?.attach(this._cnvParamInput) ?? undefined;
        if (!this._currentChoose.isReadonlyCmd) this._btnRun.attach(this._cnvParamInput);
        this._cnvParamInput.addChild(this._txtInfo);
        this._gameConfigRenderer.attach(this._cnvParamInput);
    }

    private hideCnvParamInput() {
        if (this._lastChoose) {
            this._paramCache.set(this._lastChoose, this._currentInputComponent?.getParam() ?? undefined);
        }
        this._currentChoose = undefined;
        this._gameConfigRenderer.render();
        this._gameConfigRenderer.show = false;
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

    private dragHandler = () => {
        if (this._dragStartTime === undefined ||
            Date.now() - this._dragStartTime < this._dragSensitive) return;

        const viewPortCanvas = mw.UIService.canvas;

        let currMouseAbsolutePos = this.btnMovePointerLocation;
        if (!currMouseAbsolutePos) return;
        if (this._mouseStartMosPos === undefined) {
            this._mouseStartMosPos = mw.absoluteToLocal(
                viewPortCanvas.cachedGeometry,
                this.btnMovePointerLocation);
            this._mouseStartCnvPos = this.root.position.clone();
            this.playStartDragEffect();
        } else {
            let currMouseRelativePos = mw.absoluteToLocal(
                viewPortCanvas.cachedGeometry,
                currMouseAbsolutePos);
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

    private innerShowTips(text: string, color?: string, showTime?: number) {
        this._txtInfo.setFontColorByHex(ColorUtil.colorHexWithAlpha(color ?? Color.Blue, 1));
        this._txtInfo.text = text;
        this._lastShowTipsTime = Date.now();
        this._txtInfo.renderOpacity = 1;
        this._currentTipShowTime = showTime ?? GodModPanel.TipsShownTime;
    }

    public showTips(text: string, showTime?: number) {
        this.innerShowTips(text, Color.Green, showTime);
    }

    private showWarning(text: string) {
        this.innerShowTips(text, Color.Red);
    }

    public showSuccess() {
        this.innerShowTips("Worked!", Color.Green);
    }

    public showRunning() {
        this.innerShowTips("Running...", Color.Blue);
    }

    public showError() {
        this.innerShowTips("Error!", Color.Red);
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

function typeIsConfig(type: object): type is ConfigBase<IElementBase> {
    return Gtk.is<ConfigBase<IElementBase>>(type, "getElement");
}