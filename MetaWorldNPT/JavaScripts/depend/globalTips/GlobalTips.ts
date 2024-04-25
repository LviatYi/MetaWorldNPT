import Gtk, {Constructor, GtkTypes, IRecyclable, ObjectPool, Singleton} from "../../util/GToolkit";
import Log4Ts from "../log4ts/Log4Ts";
import {FlowTweenTask} from "../waterween/tweenTask/FlowTweenTask";
import Waterween from "../waterween/Waterween";
import Easing from "../easing/Easing";
import {AdvancedTweenTask} from "../waterween/tweenTask/AdvancedTweenTask";

export interface IContentSetter<SA = void> {
    /**
     * Set content.
     * @param {string} content
     * @param option custom args.
     */
    setContent(content: string, option?: SA): void;

    /**
     * 开始显示时.
     */
    tipShow?(): void;

    /**
     * 开始隐藏时.
     */
    tipHidden?(): void;
}

export interface IGlobalTipsContainer {
    /**
     * 存放冒泡提示控件 容器.
     * @return {mw.Widget}
     */
    getBubbleContainer(): mw.Canvas;

    /**
     * 获取独有提示控件 容器.
     * @return {mw.Widget}
     */
    getOnlyContainer(): mw.Canvas;
}

export type BubbleTipWidget = mw.UIScript & IContentSetter;

export type GlobalTipsContainer = mw.UIScript & IGlobalTipsContainer & IContentSetter;

/**
 * 全局提示选项.
 */
export interface IGlobalTipsOption<SA = void> {
    /**
     * 独占的.
     * @desc 默认为 false.
     */
    only?: boolean;

    /**
     * 持续时间.
     */
    duration?: number;

    /**
     * 自定义参数.
     */
    option?: SA;
}

class RecyclableBubbleWidget implements IRecyclable {
    public disableCallback: () => void;

    public widget: BubbleTipWidget;

    public get w(): mw.Widget {
        return this.widget.uiObject;
    }

    private _bubbleTweenTask: FlowTweenTask<number>;

    private _showTweenTask: FlowTweenTask<number>;

    private _autoHideTimer: number;

    public moveToY(y: number) {
        this._bubbleTweenTask.to(y);
    }

    constructor(widget: BubbleTipWidget, disableCallback: () => void) {
        this.widget = widget;
        this.disableCallback = disableCallback;

        this._showTweenTask = Waterween.flow(
            () => widget.uiObject.renderOpacity,
            (val) => widget.uiObject.renderOpacity = val,
            GlobalTips.HIDE_BUBBLE_TWEEN_DURATION,
            Easing.linear,
            0,
            true
        );

        this._showTweenTask.onDone.add(() => {
            if (widget.uiObject.renderOpacity === 0) {
                this.disableCallback();
            }
        });

        this._bubbleTweenTask = Waterween.flow(
            () => widget.uiObject.position.y,
            (val) => Gtk.setUiPositionY(widget.uiObject, val),
            GlobalTips.BUBBLING_TWEEN_DURATION,
            Easing.easeOutQuint,
            0,
            true
        );
    }

    public hideInstantly(): this {
        if (this._autoHideTimer) mw.clearTimeout(this._autoHideTimer);
        this._showTweenTask.pause();
        return this;
    }

    /**
     * @param {string} content
     * @param {number} life 存活时间.
     * @param {boolean} custom 自定义动画.
     */
    makeEnable(content: string, life: number, custom: boolean = false): void {
        this.widget.setContent(content);
        Gtk.trySetVisibility(this.widget.uiObject, true);
        this.widget.uiObject.renderOpacity = 0;
        (!custom) && this._showTweenTask.to(1, GlobalTips.SHOW_BUBBLE_TWEEN_DURATION);
        this._autoHideTimer = mw.setTimeout(() => {
                (!custom) && this._showTweenTask.to(0, GlobalTips.HIDE_BUBBLE_TWEEN_DURATION);
                this._autoHideTimer = undefined;
            },
            life);
    }

    makeDisable(): void {
        this._bubbleTweenTask.pause();
        Gtk.trySetVisibility(this.widget.uiObject, false);
    }

    makeDestroy(): void {
        this.widget.destroy();
        this._showTweenTask.destroy();
        this._bubbleTweenTask.destroy();
    }
}

/**
 * Global Tips 全局提示.
 *
 * @desc 提供基于 UI 的全局提示功能.
 * @desc 提供 事件触发 与 单例调用方式.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @example
 * // in client. Bubble Global Tips.
 * GlobalTips.getInstance().showGlobalTips(`Hello world! at ${Date.now()}`);
 * mw.Event.dispatchToLocal(GlobalTips.EVENT_NAME_GLOBAL_TIPS, {only: false} as IGlobalTipsOption);
 *
 * // in server. Only Global Tips.
 * GlobalTips.getInstance().showGlobalTips(`Title at ${Date.now()}`, {only: true});
 * mw.Event.dispatchToClient(player, GlobalTips.EVENT_NAME_GLOBAL_TIPS, {only: true, duration: 3e3} as IGlobalTipsOption);
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 31.0.3
 */
export default class GlobalTips extends Singleton<GlobalTips>() {
//#region Constant
    /**
     * 全局提示事件名.
     * @desc 事件参数 [string, IGlobalTipsOption]
     * - {string} content 提示内容.
     * - {IGlobalTipsOption} option 提示选项.
     * @example //TODO_LviatYi 示例代码.
     * @type {string}
     */
    public static readonly EVENT_NAME_GLOBAL_TIPS = "EventNameGlobalTips";

    /**
     * 默认 layer.
     * @type {number}
     */
    public static readonly LAYER = mw.UILayerSystem;

    /**
     * 冒泡提示控件最低阈值.
     * @type {number}
     */
    public static readonly BUBBLE_WIDGET_FLOOR = 1;

    /**
     * 默认冒泡持续时间.
     * @type {number}
     */
    public static readonly DEFAULT_BUBBLING_DURATION = 3e3;

    /**
     * 默认独占持续时间.
     * @type {number}
     */
    public static readonly DEFAULT_ONLY_DURATION = 4e3;

    /**
     * 冒泡浮动动画持续时间.
     * @type {Interval.Fast}
     */
    public static readonly BUBBLING_TWEEN_DURATION = GtkTypes.Interval.Fast;

    /**
     * 冒泡动画显示持续时间.
     * @type {Interval.Fast}
     */
    public static readonly SHOW_BUBBLE_TWEEN_DURATION = GtkTypes.Interval.Fast;

    /**
     * 冒泡动画隐藏持续时间.
     * @type {Interval.PerSec}
     */
    public static readonly HIDE_BUBBLE_TWEEN_DURATION = GtkTypes.Interval.PerSec;

    /**
     * 独占动画隐藏持续时间.
     * @type {Interval.PerSec}
     */
    public static readonly HIDE_ONLY_TWEEN_DURATION = GtkTypes.Interval.PerSec;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member
    private _holder: GlobalTipsContainer;

    private _eventRegistered: boolean = false;

    private _bubbleWidgetCls: Constructor<BubbleTipWidget> = undefined;

    private _bubbleWidgetPool: ObjectPool<RecyclableBubbleWidget>;

    private _bubbleWidgets: RecyclableBubbleWidget[] = [];

    public bubbleWidgetValid(): boolean {
        return !!this._bubbleWidgetCls;
    }

    public containerValid(): boolean {
        return !!this._holder;
    }

    /**
     * 垂直排列规则. 决定冒泡提示控件的排列方式.
     * @desc 默认为 BottomToTop. 上浮.
     * @desc 跟随 ui 中的设置.
     * @type {mw.UIVerticalCollation}
     * @private
     */
    private _verticalRule: mw.UIVerticalCollation;

    /**
     * 使用自定义冒泡效果.
     * @type {boolean}
     * @private
     */
    private _useCustomBubbleEffect: boolean = false;

    /**
     * 使用自定义独占效果.
     * @type {boolean}
     * @private
     */
    private _useCustomOnlyEffect: boolean = false;

    /**
     * 自动隐藏独占提示控件 定时器.
     * @type {number}
     * @private
     */
    private _onlyTipsHiddenTimer: number = undefined;

    /**
     * 独占提示控件 隐藏任务.
     * @type {AdvancedTweenTask<number>}
     * @private
     */
    private _onlyHiddenTask: AdvancedTweenTask<number>;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config
    /**
     * 设置全局提示容器 Panel.
     * @param {Constructor<GlobalTipsContainer>} container
     * @return {this}
     */
    public setGlobalTipsContainer(container: Constructor<GlobalTipsContainer>): this {
        if (!this.needInClient()) return this;
        if (this.containerValid()) {
            Log4Ts.log(GlobalTips,
                `Global Tips Container has been set.`,
                "Recalling the Settings function overrides it");
            UIService.hideUI(this._holder);
            this._onlyHiddenTask.destroy();
        }

        this._holder = UIService.create(container);
        if (!this._holder ||
            !this._holder.getBubbleContainer() ||
            !this._holder.getOnlyContainer()) {
            Log4Ts.error(GlobalTips, `holder is invalid.`);
            return this;
        }

        if (!this._eventRegistered) this.registerEvent();
        this._holder.layer = GlobalTips.LAYER;
        this._holder = UIService.show(container);
        this._holder.setContent("");

        this._onlyHiddenTask = Waterween.to(
            () => this._holder.getOnlyContainer().renderOpacity,
            (val) => this._holder.getOnlyContainer().renderOpacity = val,
            0,
            GlobalTips.HIDE_ONLY_TWEEN_DURATION,
            1,
            Easing.linear)
            .fastForwardToEnd();

        const cnvHolder = this._holder.getBubbleContainer();
        this._verticalRule = cnvHolder
                .autoLayoutRule
                ?.childCollation
                ?.verticalCollation
            ?? mw.UIVerticalCollation.BottomToTop;
        cnvHolder.autoLayoutEnable = false;

        return this;
    }

    /**
     * 设置冒泡提示控件 构造器.
     * @param {Constructor<BubbleTipWidget>} widget
     * @return {this}
     */
    public setBubbleWidget(widget: Constructor<BubbleTipWidget>): this {
        if (!this.needInClient()) return this;

        this._bubbleWidgetCls = widget;
        if (this._bubbleWidgets.length > 0) {
            this._bubbleWidgets.forEach(item => item.widget.destroy());
        }

        this._bubbleWidgetPool?.clear();
        this._bubbleWidgetPool = new ObjectPool<RecyclableBubbleWidget>(
            {
                generator: () => {
                    const widget = UIService.create(this._bubbleWidgetCls);
                    if (!widget) return null;
                    this._holder.getBubbleContainer().addChild(widget.uiObject);
                    const rWidget = new RecyclableBubbleWidget(widget,
                        () => {
                            Gtk.remove(this._bubbleWidgets, rWidget);
                            this._bubbleWidgetPool.push(rWidget);
                        });
                    return rWidget;
                },
                floor: GlobalTips.BUBBLE_WIDGET_FLOOR,
                autoHalvingInterval: 10 * GtkTypes.Interval.PerSec,
            }
        );

        return this;
    }

    /**
     * 使用自定义冒泡效果.
     * 原动画作用于 `UIScript.uiObject.renderOpacity`.
     * @param {boolean} [enable=true]
     */
    public useCustomBubbleEffect(enable = true) {
        this._useCustomBubbleEffect = enable;
        return this;
    }

    /**
     * 使用自定义独占效果.
     * 原动画作用于 `getOnlyContainer().renderOpacity`.
     * @param {boolean} [enable=true]
     */
    public useCustomOnlyEffect(enable = true) {
        this._useCustomOnlyEffect = enable;
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 注册事件.
     * @return {this}
     */
    public registerEvent(): this {
        if (mw.SystemUtil.isClient()) {
            mw.Event.addLocalListener(
                GlobalTips.EVENT_NAME_GLOBAL_TIPS,
                this.showGlobalTips
            );
            mw.Event.addServerListener(
                GlobalTips.EVENT_NAME_GLOBAL_TIPS,
                this.showGlobalTips
            );
        }

        return this;
    }

    /**
     * 显示全局提示.
     * @desc 双端的. 服务端调用将为所有玩家广播.
     * @desc 使用事件为指定玩家广播.
     * @param {string} content
     * @param {IGlobalTipsOption} option
     */
    public showGlobalTips = (content: string, option?: IGlobalTipsOption) => {
        if (mw.SystemUtil.isClient()) {
            if (!this.containerValid()) return;

            if (option?.only ?? false) {
                if (!this.bubbleWidgetValid()) return;
                this.showBubbleTipsHandler(content, option);
            } else {
                this._holder.setContent(content);
                (!this._useCustomOnlyEffect) && this._onlyHiddenTask.restart(true);
                try {
                    this._holder?.tipShow?.();
                } catch (e) {
                    Log4Ts.error(GlobalTips, `error occurs in tipShow`, e);
                }
                this.refreshOnlyTipsHiddenTimer(option?.duration);
            }
        } else if (mw.SystemUtil.isServer()) {
            mw.Event.dispatchToAllClient(GlobalTips.EVENT_NAME_GLOBAL_TIPS, content, option);
        }
    };

    private showBubbleTipsHandler(content: string, option?: IGlobalTipsOption) {
        const holder = this._holder.getBubbleContainer();
        const widget = this._bubbleWidgetPool.pop(
            content,
            option?.duration ?? GlobalTips.DEFAULT_BUBBLING_DURATION,
            this._useCustomBubbleEffect);
        if (!widget) {
            Log4Ts.error(GlobalTips, `widget is invalid.`);
            return;
        }

        this._bubbleWidgets.push(widget);

        let dist: number;
        let p: number = this._bubbleWidgets.length - 2;
        if (this._verticalRule === mw.UIVerticalCollation.BottomToTop) {
            dist = holder.size.y - widget.w.size.y;
        } else {
            dist = 0;
        }
        Gtk.setUiPositionY(widget.w, dist);

        for (; p >= 0; --p) {
            const widget = this._bubbleWidgets[p];
            if (this._verticalRule === mw.UIVerticalCollation.BottomToTop) {
                if (widget.w.position.y + widget.w.size.y < 0) break;
                dist -= widget.w.size.y;
            } else {
                if (widget.w.position.y > holder.size.y) break;
                dist += widget.w.size.y;
            }

            widget.moveToY(dist);
        }

        while (p-- >= 0) {
            this._bubbleWidgetPool.push(this._bubbleWidgets
                .shift()
                .hideInstantly());
        }
    }

    private needInClient(): boolean {
        if (!mw.SystemUtil.isClient()) {
            Log4Ts.log(GlobalTips, `setting valid only in client.`);
            return false;
        }

        return true;
    }

    private refreshOnlyTipsHiddenTimer(duration?: number) {
        if (this._onlyTipsHiddenTimer) mw.clearTimeout(this._onlyTipsHiddenTimer);

        mw.setTimeout(() => {
                try {
                    this._holder?.tipHidden?.();
                } catch (e) {
                    Log4Ts.error(GlobalTips, `error occurs in tipHidden`, e);
                }
                (!this._useCustomOnlyEffect) && this._onlyHiddenTask.forward();
            },
            duration ?? GlobalTips.DEFAULT_ONLY_DURATION);
    }
}