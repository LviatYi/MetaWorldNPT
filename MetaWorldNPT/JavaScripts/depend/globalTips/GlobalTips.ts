import Gtk, {Constructor, GtkTypes, IRecyclable, ObjectPool, Singleton} from "../../util/GToolkit";
import Log4Ts from "../log4ts/Log4Ts";
import {FlowTweenTask} from "../waterween/tweenTask/FlowTweenTask";
import Waterween from "../waterween/Waterween";
import Easing from "../easing/Easing";

export interface IContentSetter {
    /**
     * Set content.
     * @param {string} content
     */
    setContent(content: string): void;
}

export type GlobalTipsWidget = mw.UIScript & IContentSetter;

interface IGlobalTipsOption {
    /**
     * 独占的.
     * @desc 默认为 false.
     */
    only?: boolean;

    /**
     * 持续时间.
     */
    duration?: number;
}

class RecyclableBubbleWidget implements IRecyclable {
    private _pool: ObjectPool<RecyclableBubbleWidget>;

    public widget: GlobalTipsWidget;

    public get w(): mw.Widget {
        return this.widget.uiObject;
    }

    private _bubbleTweenTask: FlowTweenTask<number>;

    private _showTweenTask: FlowTweenTask<number>;

    private _autoHideTimer: number;

    public moveToY(y: number) {
        this._bubbleTweenTask.to(y);
    }

    constructor(pool: ObjectPool<RecyclableBubbleWidget>, widget: GlobalTipsWidget) {
        this._pool = pool;
        this.widget = widget;

        this._showTweenTask = Waterween.flow(
            () => widget.uiObject.renderOpacity,
            (val) => widget.uiObject.renderOpacity = val,
            GtkTypes.Interval.PerSec,
            Easing.linear,
            0.2,
            true
        );
        this._bubbleTweenTask = Waterween.flow(
            () => widget.uiObject.position.y,
            (val) => Gtk.setUiPositionY(widget.uiObject, val),
            GtkTypes.Interval.Fast,
            Easing.easeOutQuint,
            0.1,
            true
        );

        this._bubbleTweenTask.onDone.add((param) => {
            if (widget.uiObject.renderOpacity === 0) {
                this._pool.push(this);
            }
        });
    }

    public hideInstantly() {
        if (this._autoHideTimer) mw.clearTimeout(this._autoHideTimer);
        this._pool.push(this);
    }

    /**
     * @param {string} content
     * @param {number} life 存活时间.
     */
    makeEnable(content: string, life: number): void {
        this.widget.setContent(content);
        Gtk.trySetVisibility(this.widget.uiObject, true);
        this.widget.uiObject.renderOpacity = 0;
        this._showTweenTask.to(1, GtkTypes.Interval.Fast);
        this._autoHideTimer = mw.setTimeout(() => {
                this._showTweenTask.to(0, GtkTypes.Interval.PerSec);
                this._autoHideTimer = undefined;
            },
            life);
    }

    makeDisable(): void {
        Gtk.trySetVisibility(this.widget.uiObject, false);
    }
}

export default class GlobalTips extends Singleton<GlobalTips>() {
//#region Event
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
     * Bubbling Widget 持有者名称.
     * @type {string}
     */
    public static readonly CNV_BUBBLING_HOLDER_NAME = "cnvHolderName";

    /**
     * 默认 ZOrder.
     * @type {number}
     */
    public static readonly Z_ORDER = 55000;

    /**
     * 冒泡提示控件最低阈值.
     * @type {number}
     */
    public static readonly BUBBLING_WIDGET_FLOOR = 1;

    /**
     * 默认冒泡持续时间.
     * @type {number}
     */
    public static readonly DEFAULT_BUBBLING_DURATION = 1e3;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member
    private _cnvHolder: mw.Canvas;

    private _cnvPosition: mw.Vector2 = undefined;

    private _cnvSize: mw.Vector2 = undefined;

    private _bubblingWidgetCls: Constructor<GlobalTipsWidget> = undefined;

    private _onlyWidgetCls: Constructor<GlobalTipsWidget> = undefined;

    private _bubblingWidgetPool: ObjectPool<RecyclableBubbleWidget>;

    private _bubblingWidgets: RecyclableBubbleWidget[] = [];

    private _onlyWidget: GlobalTipsWidget = undefined;

    private _maxCount: number = 5;

    public bubblingWidgetValid(): boolean {
        return !!this._bubblingWidgetCls;
    }

    public onlyWidgetValid(): boolean {
        return !!this._onlyWidgetCls;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config
    /**
     * 设置 Bubble 容器位置.
     * @param {mw.Vector2} val
     * @return {this}
     */
    public setCnvPosition(val: mw.Vector2): this {
        this._cnvPosition = val;
        if (this._cnvHolder) this._cnvHolder.position = this._cnvPosition;
        return this;
    }

    /**
     * 设置 Bubble 容器大小.
     * @param {mw.Vector2} val
     * @return {this}
     */
    public setCnvSize(val: mw.Vector2): this {
        this._cnvSize = val;
        if (this._cnvHolder) this._cnvHolder.size = this._cnvSize;
        return this;
    }


    public setBubblingWidget(widget: Constructor<GlobalTipsWidget>): this {
        if (!this.needInClient()) return this;

        this._bubblingWidgetCls = widget;
        if (this._bubblingWidgets.length > 0) {
            this._bubblingWidgets.forEach(item => item.widget.destroy());
        }

        this._bubblingWidgetPool = new ObjectPool<RecyclableBubbleWidget>(
            {
                generator: () => {
                    const widget = UIService.create(this._bubblingWidgetCls);
                    if (!widget) return null;
                    return new RecyclableBubbleWidget(this._bubblingWidgetPool, widget);
                },
                destructor: (item) => item.widget.destroy(),
                floor: GlobalTips.BUBBLING_WIDGET_FLOOR,
                instantly: true
            }
        );

        return this;
    }

    public setOnlyWidget(widget: Constructor<GlobalTipsWidget>): this {
        if (!this.needInClient()) return this;

        this._onlyWidgetCls = widget;
        if (!!this._onlyWidget) {
            this._onlyWidget.destroy();
        }

        this._onlyWidget = UIService.create(widget);

        return this;
    }

    public setMaxCount(count: number): this {
        if (!this.needInClient()) return this;

        this._maxCount = count;
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    // public registerEvent() {
    //     if (SystemUtil.isClient()) {
    //         mw.Event.addLocalListener(
    //             GlobalTips.EVENT_NAME_GLOBAL_TIPS,
    //             (content: string) => {
    //                 if (this.bubblingWidgetValid()) {
    //                     const bubblingWidget = new this._bubblingWidgetCls();
    //                     bubblingWidget.setContent(content);
    //                     bubblingWidget.show();
    //                 }
    //             }
    //         );
    //
    //         mw.Event.addLocalListener(
    //             GlobalTips.EVENT_NAME_GLOBAL_TIPS,
    //             (content: string) => {
    //                 if (this.onlyWidgetValid()) {
    //                     const onlyWidget = new this._onlyWidgetCls();
    //                     onlyWidget.setContent(content);
    //                     onlyWidget.show();
    //                 }
    //             }
    //         );
    //     }
    // }

    private showBubbleTips(content: string, option?: IGlobalTipsOption) {
        const widget = this._bubblingWidgetPool.pop(content, option.duration ?? GlobalTips.DEFAULT_BUBBLING_DURATION);
        this._bubblingWidgets.push(widget);

        let dist = this._cnvHolder.size.y - widget.w.size.y;
        Gtk.setUiPositionY(widget.w, dist);

        let p = this._bubblingWidgets.length - 2;
        for (; p >= 0; --p) {
            if (dist < 0) break;
            const widget = this._bubblingWidgets[p];
            dist -= widget.w.size.y;
            widget.moveToY(dist);
        }

        while (--p) this._bubblingWidgets.shift().hideInstantly();
    }

    public generatorHolder(): this {
        this._cnvHolder = mw.Canvas.newObject(UIService.canvas, GlobalTips.CNV_BUBBLING_HOLDER_NAME);
        this._cnvHolder.zOrder = GlobalTips.Z_ORDER;
        this._cnvHolder.autoLayoutEnable = false;
        const uiVirtualFullSize = Gtk.getUiVirtualFullSize();
        if (this._cnvSize) this._cnvHolder.size = this._cnvSize;
        else Gtk.setUiSize(this._cnvHolder, uiVirtualFullSize.x, uiVirtualFullSize.y / 3);
        if (this._cnvPosition) this._cnvHolder.position = this._cnvPosition;
        else Gtk.setUiPosition(this._cnvHolder, (uiVirtualFullSize.x - this._cnvHolder.size.x) / 2, this._cnvHolder.size.y);

        this._cnvHolder.constraints = new mw.UIConstraintAnchors(
            mw.UIConstraintHorizontal.LeftRight,
            mw.UIConstraintVertical.TopBottom);

        return this;
    }

    private needInClient(): boolean {
        if (!SystemUtil.isClient()) {
            Log4Ts.log(GlobalTips, `setting valid only in client.`);
            return false;
        }

        return true;
    }
}