import Gtk, {Delegate} from "../../../util/GToolkit";
import Waterween from "../../../depend/waterween/Waterween";
import {FlowTweenTask} from "../../../depend/waterween/tweenTask/FlowTweenTask";
import Easing from "../../../depend/easing/Easing";
import Log4Ts from "../../../depend/log4ts/Log4Ts";
import SlateVisibility = mw.SlateVisibility;
import SimpleDelegate = Delegate.SimpleDelegate;

interface IVector2 {
    x: number,
    y: number
}

const zero: IVector2 = {
    x: 0,
    y: 0
};

enum Directions {
    Left,
    Right,
    Top,
    Bottom,
}

interface IMaskLayout {
    lsx: number;

    rpx: number;
    rsx: number;

    tpx: number;
    tsx: number;
    tsy: number;

    bpx: number;
    bpy: number;
    bsx: number;
    bsy: number;
}

//#region Options
export enum BackBtnTypes {
    /**
     * 无.
     * @desc 幕后按钮不存在. 不接收不阻塞鼠标事件.
     * @type {BackBtnTypes.Null}
     */
    Null,
    /**
     * 关闭.
     * @desc 幕后按钮被点击后关闭引导.
     * @type {BackBtnTypes.Close}
     */
    Close,
    /**
     * 锁定.
     * @desc 幕后按钮点击后无任何后续操作.
     * @desc 幕后按钮是全屏的 这意味着下面的按钮将被阻塞.
     * @desc 但可以设定 {@link focusOn} <code>onBackClick</code> 参数来监听操作.
     * @type {BackBtnTypes.Block}
     */
    Block,
    /**
     * 强制.
     * @desc 幕后按钮点击后强制执行引导.
     * @desc 幕后按钮是全屏的 这意味着点击任何地方都将执行所绑定按钮的 onClick 方法.
     * @desc 要求锁定的 UI 控件是一个按钮 否则回退为关闭.
     * @type {BackBtnTypes.Force}
     */
    Force,
}

export enum InnerBtnTypes {
    /**
     * 无.
     * @type {InnerBtnTypes.Null}
     */
    Null,
    /**
     * 广播.
     * @desc 叠加按钮点击后强制执行引导.
     * @desc 叠加按钮是全屏的 这意味着点击任何地方都将执行所绑定按钮的 onClick 方法.
     * @desc 要求锁定的 UI 控件是一个按钮 否则回退为关闭.
     * @type {InnerBtnTypes.BroadCast}
     */
    BroadCast,
    /**
     * 锁定
     * @desc 叠加按钮点击后无任何后续操作.
     * @desc 叠加按钮与锁定控件等大小 这意味着下面的按钮将被阻塞.
     * @desc 但可以设定 {@link focusOn} <code>onInnerClick</code> 参数来监听操作.
     * @type {InnerBtnTypes.Block}
     */
    Block,
}

export interface IUIOperationGuideControllerOption {
    backBtnType: BackBtnTypes;
    innerBtnType: InnerBtnTypes;
    renderOpacity: number;
    customPredicate?: () => boolean;
}

/**
 * 强引导.
 * @desc 仅允许用户点击指定按钮.
 */
export function StrongUIOperationGuideControllerOption(): IUIOperationGuideControllerOption {
    return {backBtnType: BackBtnTypes.Block, innerBtnType: InnerBtnTypes.BroadCast, renderOpacity: 0.8};
}

/**
 * 无法拒绝引导.
 * @desc 无论点击什么地方 指定按钮都将触发.
 */
export function IrresistibleUIOperationGuideControllerOption(): IUIOperationGuideControllerOption {
    return {backBtnType: BackBtnTypes.Force, innerBtnType: InnerBtnTypes.Null, renderOpacity: 0.8};
}

/**
 * 弱引导.
 * @desc 用户可以点击任何地方关闭引导.
 */
export function WeakUIOperationGuideControllerOption(): IUIOperationGuideControllerOption {
    return {backBtnType: BackBtnTypes.Close, innerBtnType: InnerBtnTypes.Null, renderOpacity: 0.8};
}

/**
 * 自由引导.
 * @desc 用户可以点击控件内跟随引导.
 * @desc 用户可以点击控件外关闭引导.
 */
export function FreedomUIOperationGuideControllerOption(): IUIOperationGuideControllerOption {
    return {backBtnType: BackBtnTypes.Close, innerBtnType: InnerBtnTypes.BroadCast, renderOpacity: 0.8};
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

/**
 * Operation Guide for Widget in UI.
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
export default class UIOperationGuideController {
//#region Constant
    public static readonly DEFAULT_PADDING_IMAGE_GUID = "114028";

    public static readonly DEFAULT_PADDING_COLOR_HEX = "000000FF";

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member
    private _masks: mw.Image[] = [];

    private _innerBtn: mw.Button;

    private _backBtn: mw.Button;

    private _maskFocusTask: FlowTweenTask<{ layout: IMaskLayout, opa: number }>;

    private _viewportRatioCache: number = null;

    private _fullSizeCache: IVector2 = {x: 0, y: 0};

    private _distLayout: IMaskLayout = {
        bpx: 0,
        bpy: 0,
        bsx: 0,
        bsy: 0,
        lsx: 0,
        rpx: 0,
        rsx: 0,
        tpx: 0,
        tsx: 0,
        tsy: 0,
    };

    private _checkRatioHandler: () => void = null;

    private _checkCustomPredicateHandler: () => void = null;

    private _isFocusing: boolean = false;

    public get isFocusing(): boolean {
        return this._isFocusing;
    };

    private set isFocusing(value: boolean) {
        this._isFocusing = value;
        if (!value) {
            this._checkRatioHandler = null;
            this._checkCustomPredicateHandler = null;
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event
    public readonly onFocus: SimpleDelegate<never> = new SimpleDelegate<never>();

    public readonly onFade: SimpleDelegate<never> = new SimpleDelegate<never>();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    constructor() {
        this._viewportRatioCache = Gtk.getViewportRatio();
        this._fullSizeCache = Gtk.getUiVirtualFullSize();

        this.generateMask();
        this.generateButton();

        this.fade(false, true);

        TimeUtil.onEnterFrame.add(() => {
            this._checkRatioHandler?.();
            this._checkCustomPredicateHandler?.();
        });

        this._maskFocusTask = Waterween.flow(
            () => ({
                layout: {
                    lsx: this._masks[Directions.Left].size.x,
                    rsx: this._masks[Directions.Right].size.x,
                    rpx: this._masks[Directions.Right].position.x,
                    tpx: this._masks[Directions.Top].position.x,
                    tsx: this._masks[Directions.Top].size.x,
                    tsy: this._masks[Directions.Top].size.y,
                    bpx: this._masks[Directions.Bottom].position.x,
                    bpy: this._masks[Directions.Bottom].position.y,
                    bsx: this._masks[Directions.Bottom].size.x,
                    bsy: this._masks[Directions.Bottom].size.y,
                } as IMaskLayout,
                opa: this._masks[Directions.Right].renderOpacity,
            }),
            (val) => {
                applyDist(this._masks, val.layout, this._fullSizeCache);
                this._masks.forEach((item) => item.renderOpacity = val.opa);
            },
            0.5e3,
            Easing.easeOutQuad,
        );
    }

    /**
     * 聚焦在指定 UI 上.
     * @param {mw.Widget} widget
     * @param option
     * @param onInnerClick 叠加按钮点击回调.
     * @param onBackClick 幕后按钮点击回调.
     * @param transition=true 使用过渡.
     * @param force=false 是否强制再运行.
     */
    public focusOn(widget: mw.Widget,
                   option: IUIOperationGuideControllerOption,
                   onInnerClick: () => void = undefined,
                   onBackClick: () => void = undefined,
                   transition: boolean = true,
                   force: boolean = false): boolean {
        if (!force && this.isFocusing) return false;
        if (!widget) return false;
        this.reorderSelfWidgets();
        this.isFocusing = true;
        this._checkRatioHandler = this.getCheckRatioHandler(
            widget,
            option,
            onInnerClick,
            onBackClick,
            transition,
            force
        );
        if (option.customPredicate) this.generateCustomPredicateHandler(option.customPredicate);

        this.refreshUi(
            widget,
            option,
            onInnerClick,
            onBackClick,
            transition
        );

        this.onFocus.invoke();
        return true;
    }

    /**
     * 取消聚焦.
     * @param {boolean} transition
     * @param force=false 是否强制再运行.
     */
    public fade(transition: boolean = true, force: boolean = false) {
        if (!force && !this.isFocusing) return;
        this.isFocusing = false;
        this.calZero();
        if (transition) {
            this._maskFocusTask.to({layout: this._distLayout, opa: 0});
        } else {
            this.renderMask(0);
        }
        Gtk.trySetVisibility(this._backBtn, SlateVisibility.Collapsed);
        Gtk.trySetVisibility(this._innerBtn, SlateVisibility.Collapsed);
        !force && this.onFade.invoke();
    }

    private refreshUi(widget: mw.Widget,
                      option: IUIOperationGuideControllerOption,
                      onInnerClick: () => void = undefined,
                      onBackClick: () => void = undefined,
                      transition: boolean = true) {
        const targetPosition = Gtk.getUiResolvedPosition(widget);
        const targetSize = Gtk.getUiResolvedSize(widget);
        this.calDist(
            targetPosition,
            targetSize
        );
        if (transition)
            this._maskFocusTask.to({
                layout: this._distLayout,
                opa: option.renderOpacity
            });
        else
            this.renderMask(option.renderOpacity);

        this.renderButton(widget,
            targetPosition,
            targetSize,
            option.backBtnType,
            option.innerBtnType,
            onBackClick,
            onInnerClick);
    }

    private generateMask() {
        for (let i = 0; i < 4; ++i) {
            const mask = Image.newObject(
                UIService.canvas,
                `UIOperationGuideControllerMask_${getDirectionName(i as Directions)}_generate`
            );
            mask.imageGuid = UIOperationGuideController.DEFAULT_PADDING_IMAGE_GUID;
            mask.imageColor = LinearColor.colorHexToLinearColor(UIOperationGuideController.DEFAULT_PADDING_COLOR_HEX);
            this._masks.push(mask);
        }
    }

    private generateButton() {
        this._backBtn = Button.newObject(UIService.canvas, `UIOperationGuideControllerButton_Back_generate`);
        this._innerBtn = Button.newObject(UIService.canvas, `UIOperationGuideControllerButton_Inner_generate`);
        Gtk.setButtonGuid(this._backBtn, Gtk.IMAGE_FULLY_TRANSPARENT_GUID);
        Gtk.setButtonGuid(this._innerBtn, Gtk.IMAGE_FULLY_TRANSPARENT_GUID);
    }

    private reorderSelfWidgets() {
        this._backBtn.removeObject();
        this._innerBtn.removeObject();

        this._masks.forEach(item => item.removeObject());

        this._masks.forEach(item => UIService.canvas.addChild(item));
        UIService.canvas.addChild(this._backBtn);
        UIService.canvas.addChild(this._innerBtn);
    }

    /**
     * 使用指定 UI 控件计算终值.
     * @param {IVector2} tp
     * @param {IVector2} ts
     * @private
     */
    private calDist(tp: IVector2,
                    ts: IVector2) {
        this._distLayout.lsx = tp.x;
        this._distLayout.rpx = tp.x + ts.x;
        this._distLayout.rsx = this._fullSizeCache.x - this._distLayout.rpx;
        this._distLayout.tpx = tp.x;
        this._distLayout.tsx = ts.x;
        this._distLayout.tsy = tp.y;
        this._distLayout.bpx = tp.x;
        this._distLayout.bpy = tp.y + ts.y;
        this._distLayout.bsx = ts.x;
        this._distLayout.bsy = this._fullSizeCache.y - this._distLayout.bpy;
    }

    /**
     * 计算空值.
     * @private
     */
    private calZero() {
        this.calDist(
            zero,
            this._fullSizeCache);
    }

    /**
     * 使用本地 _distLayout 与给定 opacity 渲染.
     * @param {number} opacity
     * @private
     */
    private renderMask(opacity: number) {
        applyDist(this._masks, this._distLayout, this._fullSizeCache);
        this._masks.forEach((item) => item.renderOpacity = opacity);
    }

    private renderButton(target: Widget,
                         targetPosition: IVector2,
                         targetSize: IVector2,
                         backBtnType: BackBtnTypes,
                         innerBtnType: InnerBtnTypes,
                         onBackClick?: () => void,
                         onInnerClick?: () => void) {
        this._backBtn.onClicked.clear();
        this._innerBtn.onClicked.clear();

        switch (backBtnType) {
            case BackBtnTypes.Block:
            case BackBtnTypes.Close:
            case BackBtnTypes.Force:
                Gtk.trySetVisibility(this._backBtn, true);
                Gtk.setUiSize(this._backBtn, this._fullSizeCache.x, this._fullSizeCache.y);
                this._backBtn.onClicked.add(this.getBackClickHandler(target, backBtnType, onBackClick));
                break;
            case BackBtnTypes.Null:
            default:
                Gtk.trySetVisibility(this._backBtn, SlateVisibility.Collapsed);
                break;
        }

        switch (innerBtnType) {
            case InnerBtnTypes.Block:
            case InnerBtnTypes.BroadCast:
                Gtk.trySetVisibility(this._innerBtn, true);
                Gtk.setUiPosition(this._innerBtn, targetPosition.x, targetPosition.y);
                Gtk.setUiSize(this._innerBtn, targetSize.x, targetSize.y);
                this._innerBtn.onClicked.add(this.getInnerClickHandler(target, innerBtnType, onInnerClick));
                break;
            case InnerBtnTypes.Null:
            default:
                Gtk.trySetVisibility(this._innerBtn, SlateVisibility.Collapsed);
                break;
        }
    }

    /**
     * 生成 视口比例检查器.
     * @private
     */
    private getCheckRatioHandler(target: Widget,
                                 option: IUIOperationGuideControllerOption,
                                 onInnerClick?: () => void,
                                 onBackClick?: () => void,
                                 transition: boolean = true,
                                 force: boolean = false) {
        return () => {
            const ratio = Gtk.getViewportRatio();
            if (this._viewportRatioCache !== ratio) {
                this._viewportRatioCache = ratio;
                this._fullSizeCache = Gtk.getUiVirtualFullSize();
                if (this.isFocusing) {
                    if (!this._maskFocusTask.isDone) {
                        this._maskFocusTask.fastForwardToEnd();
                    }
                    this.refreshUi(
                        target,
                        option,
                        onInnerClick,
                        onBackClick,
                        false,
                    );
                }
            }
        };
    }

    private getBackClickHandler(target: Widget, backBtnType: BackBtnTypes, onBackClick?: () => void) {
        return () => {
            try {
                switch (backBtnType) {
                    case BackBtnTypes.Force:
                    case BackBtnTypes.Close:
                        (backBtnType === BackBtnTypes.Force) && (target as mw.Button)?.onClicked?.broadcast();
                        this.fade();
                        break;
                    case BackBtnTypes.Block:
                    case BackBtnTypes.Null:
                    default:
                        break;
                }
                onBackClick?.();
            } catch (e) {
                Log4Ts.error(UIOperationGuideController, e);
            }
        };
    }

    private getInnerClickHandler(target: Widget, innerBtnType: InnerBtnTypes, onInnerClick?: () => void) {
        return () => {
            try {
                switch (innerBtnType) {
                    case InnerBtnTypes.BroadCast:
                        (target as mw.Button)?.onClicked?.broadcast();
                        this.fade();
                        break;
                    case InnerBtnTypes.Block:
                    case InnerBtnTypes.Null:
                    default:
                        break;
                }
                onInnerClick?.();
            } catch (e) {
                Log4Ts.error(UIOperationGuideController, e);
            }
        };
    }

    private generateCustomPredicateHandler(predicate: () => boolean) {
        this._checkCustomPredicateHandler = () => {
            let result = false;
            try {
                result = predicate();
            } catch (e) {
                Log4Ts.log(UIOperationGuideController, `error occurs in custom predicate handler: ${e}`);
                this.fade(false, true);
                return;
            }

            if (result) this.fade(true);
        };
    }
}

function applyDist(masks: mw.Widget[], dist: IMaskLayout, fullSize: IVector2): void {
    Gtk.setUiPosition(masks[Directions.Left], 0, 0);
    Gtk.setUiSize(masks[Directions.Left], dist.lsx, fullSize.y);

    Gtk.setUiPosition(masks[Directions.Right], dist.rpx, 0);
    Gtk.setUiSize(masks[Directions.Right], dist.rsx, fullSize.y);

    Gtk.setUiPosition(masks[Directions.Top], dist.tpx, 0);
    Gtk.setUiSize(masks[Directions.Top], dist.tsx, dist.tsy);

    Gtk.setUiPosition(masks[Directions.Bottom], dist.bpx, dist.bpy);
    Gtk.setUiSize(masks[Directions.Bottom], dist.bsx, dist.bsy);
}

function getDirectionName(direction: Directions): string {
    switch (direction) {
        case Directions.Left:
            return "Left";
        case Directions.Right:
            return "Right";
        case Directions.Top:
            return "Top";
        case Directions.Bottom:
            return "Bottom";
        default:
            return "";
    }
}