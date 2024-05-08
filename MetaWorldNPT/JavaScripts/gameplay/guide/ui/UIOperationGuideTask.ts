import { BackBtnTypes, InnerBtnTypes, IUIOperationGuideControllerOption } from "./UIOperationGuideController";
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
    public option: IUIOperationGuideControllerOption = {
        backBtnType: BackBtnTypes.Close,
        innerBtnType: InnerBtnTypes.BroadCast,
        renderOpacity: 0.8,
    };

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
     * UI 引导任务.
     * @param {number} stepId 步骤.
     *      一种 Id. 具有唯一性 但不表达顺序性.
     * @param {WidgetOrGetter} widget 引导目标 Ui.
     */
    constructor(stepId: number,
                widget: WidgetOrGetter) {
        super();
        this.stepId = stepId;
        this._widget = widget;
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
     * short for setBackBtnType
     */
    public sBBtn(type: BackBtnTypes): this {
        return this.setBackBtnType(type);
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
     * short for setInnerBtnType
     */
    public sIBtn(type: InnerBtnTypes): this {
        return this.setInnerBtnType(type);
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
     * short for setMaskOpacity
     */
    public sMO(value: number): this {
        return this.setMaskOpacity(value);
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
     * short for setInnerClickCallback
     */
    public sICCb(callback: () => void): this {
        return this.setInnerClickCallback(callback);
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
     * short for setBackClickCallback
     */
    public sBCCb(callback: () => void): this {
        return this.setBackClickCallback(callback);
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

    /**
     * short for setCustomCompletePredicate
     */
    public sCCptPred(predicate: () => boolean): this {
        return this.setCustomCompletePredicate(predicate);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Preset
    /**
     * 强引导.
     * @desc 仅允许用户点击指定按钮.
     */
    public setAsStrongUIOperationGuideControllerOption(): this {
        this.option.backBtnType = BackBtnTypes.Block;
        this.option.innerBtnType = InnerBtnTypes.BroadCast;
        return this;
    }

    /**
     * 无法拒绝引导.
     * @desc 无论点击什么地方 指定按钮都将触发.
     */
    public setAsIrresistibleUIOperationGuideControllerOption(): this {
        this.option.backBtnType = BackBtnTypes.Force;
        this.option.innerBtnType = InnerBtnTypes.Null;
        return this;
    }

    /**
     * 弱引导.
     * @desc 用户可以点击任何地方关闭引导.
     */
    public setAsWeakUIOperationGuideControllerOption(): this {
        this.option.backBtnType = BackBtnTypes.Close;
        this.option.innerBtnType = InnerBtnTypes.Null;
        return this;
    }

    /**
     * 自由引导.
     * @desc 用户可以点击控件内跟随引导.
     * @desc 用户可以点击控件外关闭引导.
     */
    public setAsFreedomUIOperationGuideControllerOption(): this {
        this.option.backBtnType = BackBtnTypes.Close;
        this.option.innerBtnType = InnerBtnTypes.BroadCast;
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}