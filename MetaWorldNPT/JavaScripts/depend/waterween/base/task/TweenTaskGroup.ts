// import { EasingFunction } from "../../../easing/Easing";
// import { ITweenTaskGroup } from "../interface/ITweenTaskGroup";
// import { ITweenTask } from "../interface/ITweenTask";
// import { Delegate } from "gtoolkit";
// import SimpleDelegate = Delegate.SimpleDelegate;
//
// export class TweenTaskGroup implements ITweenTaskGroup {
//     mode: "sequence" | "parallel";
//
//     tasks: (TweenTaskGroup | ITweenTask)[];
//
//     private _durationCache: number | undefined;
//
//     private _durationDetermined: number | undefined;
//
//     get duration(): number {
//         if (this._durationDetermined !== undefined) return this._durationDetermined;
//
//         if (this._durationCache === undefined) {
//             this._durationCache = 0;
//             switch (this.mode) {
//                 case "sequence":
//                     for (let i = 0; i < this.tasks.length; i++) {
//                         const task = this.tasks[i];
//                         this._durationCache += task.duration;
//                     }
//                     break;
//                 case "parallel":
//                     for (let i = 0; i < this.tasks.length; i++) {
//                         const task = this.tasks[i];
//                         this._durationCache = Math.max(this._durationCache, task.duration);
//                     }
//                     break;
//             }
//         }
//         return this._durationCache;
//     }
//
//     public twoPhaseTweenBorder: number;
//
//     public get isPause(): boolean {
//         throw new Error("Method not implemented.");
//     }
//
//     public get elapsed(): number {
//         throw new Error("Method not implemented.");
//     }
//
//     public set elapsed(value: number) {
//         throw new Error("Method not implemented.");
//     }
//
//     public call(now?: number, isTimestamp?: boolean): this {
//         throw new Error("Method not implemented.");
//     }
//
//     public get isBackward(): boolean {
//         throw new Error("Method not implemented.");
//     }
//
// //#region Tween Action
//     public easing(easingFunc: EasingFunction): void {
//         throw new Error("Method not implemented.");
//     }
//
//     public pause(now?: number): this {
//         throw new Error("Method not implemented.");
//     }
//
//     public fastForwardToEnd(): this {
//         throw new Error("Method not implemented.");
//     }
//
//     public continue(recurve?: boolean, now?: number): this {
//         throw new Error("Method not implemented.");
//     }
//
//     public destroy(): this {
//         throw new Error("Method not implemented.");
//     }
//
//     public autoDestroy(auto?: boolean): this {
//         throw new Error("Method not implemented.");
//     }
//
//     public backward(recurve?: boolean, pause?: boolean, now?: number): this {
//         throw new Error("Method not implemented.");
//     }
//
//     public forward(recurve?: boolean, pause?: boolean, now?: number): this {
//         throw new Error("Method not implemented.");
//     }
//
// //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//
// //#region Event
//     public onDone: SimpleDelegate<[boolean, number]> = new SimpleDelegate();
//
//     public onDestroy: SimpleDelegate<number> = new SimpleDelegate();
//
//     public onPause: SimpleDelegate<number> = new SimpleDelegate();
//
//     public onContinue: SimpleDelegate<number> = new SimpleDelegate();
//
//     public onRestart: SimpleDelegate<number> = new SimpleDelegate();
//
// //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
// }