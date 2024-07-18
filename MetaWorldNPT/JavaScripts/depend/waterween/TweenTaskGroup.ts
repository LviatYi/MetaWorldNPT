// import { AdvancedTweenTask } from "./base/task/AdvancedTweenTask";
// import { Delegate } from "gtoolkit";
// import { ITweenTaskEvent } from "./base/interface/ITweenTaskEvent";
// import SimpleDelegate = Delegate.SimpleDelegate;
//
// /**
//  * TweenTaskGroup.
//  * 允许将 TweenTask 编组并进行统一管理.
//  * 允许顺序播放 TweenTask.
//  *
//  * Tips: Tween Task Group is sluggish when in parallel, it means that any new tasks for add will be pause.
//  *
//  * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
//  * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
//  * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
//  * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
//  * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//  * @author LviatYi
//  * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
//  * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
//  */
// export default class TweenTaskGroup implements ITweenTaskEvent {
//     //TODO_LviatYi TweenTaskGroup 将实现 ITweenTask.
//     public readonly tasks: (AdvancedTweenTask<unknown> | TweenTaskGroup)[] = [];
//
//     private readonly _sequenceCallbacks: ((isBackward: boolean, now: number) => void)[] = [];
//
//     private readonly _parallelCallbacks: ((isBackward: boolean, now: number) => void)[] = [];
//
//     private _currentSeqIndex?: number = null;
//
//     private _parallelDoneCount: number = 0;
//
//     private _repeat: boolean = false;
//
//     private _isPause: boolean = true;
//
//     /**
//      * 是否 任务已 󰏤暂停.
//      *      󰏤暂停 意味着 Task 可以继续播放
//      * @beta
//      */
//     public get isPause(): boolean {
//         return this._isPause;
//     }
//
//     /**
//      * 是否 重复 播放.
//      * @beta
//      */
//     public get isRepeat(): boolean {
//         return this._repeat;
//     }
//
//     /**
//      * 是否 󰒿顺序 播放.
//      * @return
//      *  - true      󰒿顺序 播放.
//      *  - false     平行 播放.
//      * @beta
//      */
//     public get isSeq(): boolean {
//         return this._currentSeqIndex !== null;
//     };
//
//     /**
//      * 添加 task.
//      * @param task
//      * @param now
//      * @beta
//      */
//     public add(task: AdvancedTweenTask<unknown> | TweenTaskGroup, now: number): TweenTaskGroup {
//         if ("autoDestroy" in task) task.autoDestroy(false);
//         task.repeat(false);
//         task.restart(true, now);
//         if (this.isSeq) {
//             const length = this.tasks.length;
//             if (length > 0) {
//                 const lastIndex = length - 1;
//                 const lastTask = this.tasks[lastIndex];
//                 lastTask.onDone.remove(this._sequenceCallbacks[lastIndex]);
//                 this._sequenceCallbacks[lastIndex] = this.createSeqDoneCallbackFunction(
//                     lastTask,
//                     task);
//                 lastTask.onDone.add(this._sequenceCallbacks[lastIndex]);
//             }
//             this._sequenceCallbacks.push(this.createSeqDoneCallbackFunction(task));
//             task.onDone.add(this._sequenceCallbacks[this.tasks.length]);
//         } else {
//             this._parallelCallbacks.push(this.createPllDoneCallbackFunction(task));
//             task.onDone.add(this._parallelCallbacks[this.tasks.length]);
//         }
//         this.tasks.push(task);
//
//         return this;
//     }
//
//     /**
//      * 移出 task.
//      * @param indexOrTask
//      * @beta
//      */
//     public remove(indexOrTask: number | AdvancedTweenTask<unknown> | TweenTaskGroup): TweenTaskGroup {
//         const index = typeof indexOrTask === "number" ? indexOrTask : this.tasks.indexOf(indexOrTask);
//         if (this.isSeq) {
//             this._sequenceCallbacks.splice(index, 1);
//         }
//
//         return this;
//     }
//
//     /**
//      * 调用 tasks.
//      * @beta
//      */
//     public call(now: number): TweenTaskGroup {
//         if (this.isSeq) {
//             this.tasks[this._currentSeqIndex].call(now);
//         } else {
//             for (const task of this.tasks) {
//                 task.call(now);
//             }
//         }
//
//         return this;
//     }
//
//     public destroy(): TweenTaskGroup {
//         for (const task of this.tasks) {
//             task.destroy();
//         }
//         this.tasks.length = 0;
//         this._sequenceCallbacks.length = 0;
//
//         return this;
//     }
//
//     /**
//      * 设置 󰩺自动销毁.
//      * @param auto
//      * @public
//      */
//     public autoDestroy(auto: boolean = true): TweenTaskGroup {
//         if (auto) this._innerOnDone.add(this.autoDestroyTask);
//         else this._innerOnDone.remove(this.autoDestroyTask);
//
//         return this;
//     }
//
// //#region Tween Sequence
//
//     /**
//      * 同时调用组内 task.
//      * @param pause
//      * @param now
//      */
//     public parallel(pause: boolean = false, now?: number): TweenTaskGroup {
//         if (!this.isSeq) {
//             return this;
//         }
//         this._currentSeqIndex = null;
//         const length = this.tasks.length;
//         const tasks = this.tasks.slice(0, length);
//         for (let i = 0; i < length; i++) {
//             tasks[i].onDone.remove(this._sequenceCallbacks[i]);
//         }
//         this._sequenceCallbacks.length = 0;
//         this.tasks.length = 0;
//         for (let i = 0; i < length; i++) {
//             this.add(tasks[i], now ?? Date.now());
//         }
//
//         this.restart(pause, now);
//
//         return this;
//     }
//
//     /**
//      * 顺序调用组内 task.
//      * 不允许 task 是 重复 播放的 否则可能造成非预期的行为.
//      * @param pause
//      * @param now
//      */
//     public sequence(pause: boolean = false, now?: number): TweenTaskGroup {
//         if (this.isSeq) {
//             return this;
//         }
//         this._currentSeqIndex = 0;
//         const length = this.tasks.length;
//         const tasks = this.tasks.slice(0, length - 1);
//         for (let i = 0; i < length; i++) {
//             tasks[i].onDone.remove(this._parallelCallbacks[i]);
//         }
//         this._parallelCallbacks.length = 0;
//         this.tasks.length = 0;
//         for (let i = 0; i < length; i++) {
//             this.add(tasks[i], now ?? Date.now());
//         }
//
//         this.restart(pause, now);
//
//         return this;
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
//     private _innerOnDone: SimpleDelegate<[boolean, number]> = new SimpleDelegate();
//
// //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//
// //#region Tween Action
//
//     public pause(now?: number): TweenTaskGroup {
//         now = now ?? Date.now();
//         if (this.isSeq) {
//             this.tasks[this._currentSeqIndex].pause(now);
//         } else {
//             for (const task of this.tasks) {
//                 task.pause();
//             }
//         }
//
//         this._isPause = true;
//
//         this.onPause.invoke(now);
//
//         return this;
//     }
//
//     public restart(pause: boolean = false, now?: number): TweenTaskGroup {
//         for (let i = this.tasks.length - 1; i >= 0; --i) {
//             this.tasks[i].restart(this.isSeq ? true : pause, now);
//         }
//
//         if (this.tasks.length > 0) {
//             if (this.isSeq) {
//                 this._currentSeqIndex = 0;
//                 if (!pause) {
//                     this.tasks[this._currentSeqIndex].continue(false, now);
//                 }
//             } else {
//                 this._currentSeqIndex = null;
//             }
//         }
//
//         this._parallelDoneCount = 0;
//         this._isPause = pause;
//
//         this.onRestart.invoke(now);
//
//         return this;
//     }
//
//     public continue(recurve: boolean = true, now?: number): TweenTaskGroup {
//         now = now ?? Date.now();
//         if (this.isSeq) {
//             this.tasks[this._currentSeqIndex].continue(recurve, now);
//         } else {
//             for (const task of this.tasks) {
//                 task.continue(recurve, now);
//             }
//         }
//
//         this._isPause = false;
//
//         this.onContinue.invoke(now);
//
//         return this;
//     }
//
//     public repeat(repeat: boolean = true): TweenTaskGroup {
//         if (this._repeat === repeat || this.tasks.length <= 0) {
//             return this;
//         }
//
//         this._repeat = repeat;
//
//         return this;
//     }
//
//     //TODO_LviatYi 挑战 Group 平行倒放
//     //TODO_LviatYi 挑战 Group 󰒿顺序倒放
//
// //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//
//     /**
//      * 构建 Seq onDone 回调.
//      * @param taskCurr
//      * @param taskNext
//      * @private
//      */
//     private createSeqDoneCallbackFunction(taskCurr: IAdvancedTweenTask | TweenTaskGroup,
//                                           taskNext?: IAdvancedTweenTask | TweenTaskGroup) {
//         return (isBackward: boolean, now: number) => {
//             if (taskCurr instanceof TweenTaskGroup ||
//                 !taskCurr.isPingPong ||
//                 isBackward) {
//                 ++this._currentSeqIndex;
//                 if (this._currentSeqIndex === this.tasks.length) {
//                     this.onDone.invoke(false, now);
//                     this._innerOnDone.invoke(false, now);
//                     if (this.isRepeat) {
//                         this.restart(false, now);
//                     }
//                 } else {
//                     if (taskNext) {
//                         taskNext.continue(false, now);
//                     } else {
//                         console.error("taskNext is needed when task is not the last.");
//                     }
//                 }
//             }
//             return;
//         };
//     }
//
//     /**
//      * 构建 Pll onDone 回调.
//      * @param taskCurr
//      * @private
//      */
//     private createPllDoneCallbackFunction(taskCurr: IAdvancedTweenTask | TweenTaskGroup) {
//         return (isBackward: boolean, now: number) => {
//             if (taskCurr instanceof TweenTaskGroup ||
//                 !taskCurr.isPingPong || isBackward) {
//                 ++this._parallelDoneCount;
//                 if (this._parallelDoneCount === this.tasks.length) {
//                     this.onDone.invoke(false, now);
//                     if (this.isRepeat) {
//                         this.restart(false, now);
//                     }
//                 }
//             }
//
//             return;
//         };
//     }
//
//     /**
//      * 自动析构任务.
//      */
//     private autoDestroyTask = () => {
//         this.destroy();
//     };
// }