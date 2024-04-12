import {
    BackBtnTypes,
    FreedomUIOperationGuideControllerOption,
    InnerBtnTypes,
    IUIOperationGuideControllerOption
} from "./UIOperationGuideController";
import OperationGuideTask from "../base/OperationGuideTask";

export type WidgetOrGetter = mw.Widget | (() => mw.Widget);

export default class UIOperationGuideTask extends OperationGuideTask {
    public stepId: number;

    public type: "Ui" = "Ui";

    /**
     * 绑定控件.
     * @type {mw.Widget}
     */
    private readonly _widget: WidgetOrGetter;

    public get widget(): mw.Widget {
        return typeof this._widget === "function" ? this._widget() : this._widget;
    }

    /**
     * 选项.
     * @type {IUIOperationGuideControllerOption}
     */
    public option: IUIOperationGuideControllerOption = FreedomUIOperationGuideControllerOption();

    /**
     * 叠加按钮点击回调.
     * @type {() => void}
     */
    public onInnerClick: () => void = undefined;

    /**
     * 幕后按钮点击回调.
     * @type {() => void}
     */
    public onBackClick: () => void = undefined;

    /**
     * 完成判定.
     * @desc 即便引导结束 仅当该判定为真时才标记完成.
     * @type {() => boolean}
     */
    public donePredicate: (() => boolean) = (() => true);

    constructor(stepId: number,
                widget: WidgetOrGetter,
                donePredicate: () => boolean = undefined) {
        super();
        this.stepId = stepId;
        this._widget = widget;
        if (donePredicate) this.donePredicate = donePredicate;
    }

//#region Option Builder

    /**
     * 设置幕后按钮类型.
     * @desc 幕后按钮是一个全屏按钮 在叠加按钮下.
     * @param {BackBtnTypes} type
     * @return {this}
     */
    public setBackBtnType(type: BackBtnTypes): this {
        this.option.backBtnType = type;
        return this;
    };

    /**
     * 设置叠加按钮类型.
     * @desc 叠加按钮以相同大小与位置叠加在 ui 控件之上 在幕后按钮上.
     * @param {InnerBtnTypes} type
     * @return {this}
     */
    public setInnerBtnType(type: InnerBtnTypes): this {
        this.option.innerBtnType = type;
        return this;
    };

    /**
     * 设置遮罩聚焦时的目标透明度.
     * @param {number} value
     */
    public setMaskOpacity(value: number): this {
        this.option.renderOpacity = Math.min(Math.max(value, 0), 1);
        return this;
    }

    /**
     * 设置叠加按钮点击回调.
     * @param {() => void} callback
     * @return {this}
     */
    public setInnerClickCallback(callback: () => void): this {
        this.onInnerClick = callback;
        return this;
    }

    /**
     * 设置幕后按钮点击回调.
     * @param {() => void} callback
     * @return {this}
     */
    public setBackClickCallback(callback: () => void): this {
        this.onBackClick = callback;
        return this;
    }

    /**
     * 设置自定义完成谓词.
     * @param {() => boolean} predicate
     * @return {this}
     */
    public setCustomCompletePredicate(predicate: () => boolean): this {
        this.option.customPredicate = predicate;
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}