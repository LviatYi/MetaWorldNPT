// import Widget = mw.Widget;
// import {
//     BackBtnTypes,
//     FreedomUIOperationGuideControllerOption,
//     InnerBtnTypes,
//     IUIOperationGuideControllerOption
// } from "./SceneOperationGuideController";
// import IOperationGuideTask from "../base/IOperationGuideTask";
//
//
// export default class SceneOperationGuideTask implements IOperationGuideTask {
//     public stepId: number;
//
//     public type: "Ui" = "Ui";
//
//     /**
//      * 绑定控件.
//      * @type {mw.Widget}
//      */
//     public widget: Widget;
//
//     /**
//      * 选项.
//      * @type {IUIOperationGuideControllerOption}
//      */
//     public option: IUIOperationGuideControllerOption = FreedomUIOperationGuideControllerOption();
//
//     /**
//      * 叠加按钮点击回调.
//      * @type {() => void}
//      */
//     public onInnerClick: () => void = undefined;
//
//     /**
//      * 幕后按钮点击回调.
//      * @type {() => void}
//      */
//     public onBackClick: () => void = undefined;
//
//     /**
//      * 完成判定.
//      * @type {() => boolean}
//      */
//     public donePredicate: (() => boolean) = (() => true);
//
//     constructor(stepId: number,
//                 widget: mw.Widget,
//                 donePredicate: () => boolean = undefined) {
//         this.stepId = stepId;
//         this.widget = widget;
//         if (donePredicate) this.donePredicate = donePredicate;
//     }
//
// //#region Option Builder
//
//     /**
//      * 设置幕后按钮类型.
//      * @desc 幕后按钮是一个全屏按钮 在叠加按钮下.
//      * @param {BackBtnTypes} type
//      * @return {this}
//      */
//     public setBackBtnType(type: BackBtnTypes): this {
//         this.option.backBtnType = type;
//         return this;
//     };
//
//     /**
//      * 设置叠加按钮类型.
//      * @desc 叠加按钮以相同大小与位置叠加在 ui 控件之上 在幕后按钮上.
//      * @param {InnerBtnTypes} type
//      * @return {this}
//      */
//     public setInnerBtnType(type: InnerBtnTypes): this {
//         this.option.innerBtnType = type;
//         return this;
//     };
//
//     /**
//      * 设置遮罩聚焦时的目标透明度.
//      * @param {number} value
//      */
//     public setMaskOpacity(value: number): this {
//         this.option.renderOpacity = Math.min(Math.max(value, 0), 1);
//         return this;
//     }
//
//     /**
//      * 设置叠加按钮点击回调.
//      * @param {() => void} callback
//      * @return {this}
//      */
//     public setInnerClickCallback(callback: () => void): this {
//         this.onInnerClick = callback;
//         return this;
//     }
//
//     /**
//      * 设置幕后按钮点击回调.
//      * @param {() => void} callback
//      * @return {this}
//      */
//     public setBackClickCallback(callback: () => void): this {
//         this.onBackClick = callback;
//         return this;
//     }
//
// //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
// }