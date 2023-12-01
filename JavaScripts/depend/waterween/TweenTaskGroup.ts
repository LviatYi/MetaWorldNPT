import IAdvancedTweenTask from "./tweenTask/IAdvancedTweenTask";
import AccessorTween from "./Waterween";
import ITweenTaskEvent from "./tweenTaskEvent/ITweenTaskEvent";
import { AdvancedTweenTask } from "./tweenTask/AdvancedTweenTask";
import { Delegate } from "../delegate/Delegate";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * TweenTaskGroup.
 * 允许将 TweenTask 编组并进行统一管理.
 * 允许顺序播放 TweenTask.
 *
 * Tips: Tween Task Group is sluggish when in parallel, it means that any new tasks for add will be pause.
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
export default class TweenTaskGroup implements ITweenTaskEvent {
    //TODO_LviatYi TweenTaskGroup 将实现 ITweenTask.
    public readonly tasks: (AdvancedTweenTask<unknown> | TweenTaskGroup)[] = [];

    private readonly _sequenceCallbacks: ((isBackward: boolean) => void)[] = [];

    private readonly _parallelCallbacks: ((isBackward: boolean) => void)[] = [];

    private _currentSeqIndex?: number = null;

    private _parallelDoneCount: number = 0;

    private _repeat: boolean = false;

    private _isPause: boolean = true;

    /**
     * 是否 任务已 󰏤暂停.
     *      󰏤暂停 意味着 Task 可以继续播放
     * @beta
     */
    public get isPause(): boolean {
        return this._isPause;
    }

    /**
     * 是否 重复 播放.
     * @beta
     */
    public get isRepeat(): boolean {
        return this._repeat;
    }

    /**
     * 是否 󰒿顺序 播放.
     * @return
     *  - true      󰒿顺序 播放.
     *  - false     平行 播放.
     * @beta
     */
    public get isSeq(): boolean {
        return this._currentSeqIndex !== null;
    };

    /**
     * 添加 task.
     * @param task
     * @beta
     */
    public add(task: AdvancedTweenTask<unknown> | TweenTaskGroup): TweenTaskGroup {
        if (this.isSeq) {
            if ("autoDestroy" in task) {
                task.autoDestroy(false);
            }
            task.repeat(false);
            task.restart();

            const length = this.tasks.length;

            if (length > 0) {
                const lastIndex = length - 1;
                const lastTask = this.tasks[lastIndex];
                lastTask.onDone.remove(this._sequenceCallbacks[lastIndex]);
                this._sequenceCallbacks[lastIndex] = this.createSeqDoneCallbackFunction(lastTask, task);
                lastTask.onDone.add(this._sequenceCallbacks[lastIndex]);
            }
            this._sequenceCallbacks.push(this.createSeqDoneCallbackFunction(task));
            task.onDone.add(this._sequenceCallbacks[this.tasks.length]);
        } else {
            if ("autoDestroy" in task) {
                task.autoDestroy(false);
            }
            task.repeat(false);
            task.restart(true);

            this._parallelCallbacks.push(this.createPllDoneCallbackFunction(task));
            task.onDone.add(this._parallelCallbacks[this.tasks.length]);
        }
        this.tasks.push(task);

        return this;
    }

    /**
     * 移出 task.
     * @param indexOrTask
     * @beta
     */
    public remove(indexOrTask: number | AdvancedTweenTask<unknown> | TweenTaskGroup): TweenTaskGroup {
        const index = typeof indexOrTask === "number" ? indexOrTask : this.tasks.indexOf(indexOrTask);
        if (this.isSeq) {
            this._sequenceCallbacks.splice(index, 1);
        }

        return this;
    }

    /**
     * 调用 tasks.
     * @beta
     */
    public call(): TweenTaskGroup {
        if (this.isSeq) {
            this.tasks[this._currentSeqIndex].call();
        } else {
            for (const task of this.tasks) {
                task.call();
            }
        }

        return this;
    }

    public destroy(): TweenTaskGroup {
        for (const task of this.tasks) {
            if (task instanceof TweenTaskGroup) {
                task.destroy();
            } else {
                AccessorTween.destroyTweenTask(task);
            }
        }
        this.tasks.length = 0;
        this._sequenceCallbacks.length = 0;

        return this;
    }

    /**
     * 设置 󰩺自动销毁.
     * @param auto
     * @public
     */
    public autoDestroy(auto: boolean = true) {
        if (auto) {
            this._innerOnDone.add(this.autoDestroyTask);
        } else {
            this._innerOnDone.remove(this.autoDestroyTask);
        }
    }

//#region Tween Sequence

    /**
     * 同时调用组内 task.
     * @param pause
     */
    public parallel(pause: boolean = false): TweenTaskGroup {
        if (!this.isSeq) {
            return this;
        }
        this._currentSeqIndex = null;
        const length = this.tasks.length;
        const tasks = this.tasks.slice(0, length);
        for (let i = 0; i < length; i++) {
            tasks[i].onDone.remove(this._sequenceCallbacks[i]);
        }
        this._sequenceCallbacks.length = 0;
        this.tasks.length = 0;
        for (let i = 0; i < length; i++) {
            this.add(tasks[i]);
        }

        this.restart(pause);

        return this;
    }

    /**
     * 顺序调用组内 task.
     * 不允许 task 是 重复 播放的 否则可能造成非预期的行为.
     * @param pause
     */
    public sequence(pause: boolean = false): TweenTaskGroup {
        if (this.isSeq) {
            return this;
        }
        this._currentSeqIndex = 0;
        const length = this.tasks.length;
        const tasks = this.tasks.slice(0, length - 1);
        for (let i = 0; i < length; i++) {
            tasks[i].onDone.remove(this._parallelCallbacks[i]);
        }
        this._parallelCallbacks.length = 0;
        this.tasks.length = 0;
        for (let i = 0; i < length; i++) {
            this.add(tasks[i]);
        }

        this.restart(pause);

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event
    public onContinue: SimpleDelegate<void> = new SimpleDelegate<void>();

    public onDestroy: SimpleDelegate<void> = new SimpleDelegate<void>();

    public onDone: SimpleDelegate<boolean> = new SimpleDelegate<boolean>();

    public onPause: SimpleDelegate<void> = new SimpleDelegate<void>();

    public onRestart: SimpleDelegate<void> = new SimpleDelegate<void>();

    private _innerOnDone: SimpleDelegate<boolean> = new SimpleDelegate<boolean>();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Tween Action

    public pause(): TweenTaskGroup {
        if (this.isSeq) {
            this.tasks[this._currentSeqIndex].pause();
        } else {
            for (const task of this.tasks) {
                task.pause();
            }
        }

        this._isPause = true;

        this.onPause.invoke();

        return this;
    }

    public restart(pause: boolean = false): TweenTaskGroup {
        for (let i = this.tasks.length - 1; i >= 0; --i) {
            this.tasks[i].restart(this.isSeq ? true : pause);
        }

        if (this.tasks.length > 0) {
            if (this.isSeq) {
                this._currentSeqIndex = 0;
                if (!pause) {
                    this.tasks[this._currentSeqIndex].continue();
                }
            } else {
                this._currentSeqIndex = null;
            }
        }

        this._parallelDoneCount = 0;

        this._isPause = pause;

        this.onRestart.invoke();

        return this;
    }

    public continue(recurve: boolean = true): TweenTaskGroup {
        if (this.isSeq) {
            this.tasks[this._currentSeqIndex].continue(recurve);
        } else {
            for (const task of this.tasks) {
                task.continue(recurve);
            }
        }

        this._isPause = false;

        this.onContinue.invoke();

        return this;
    }

    public repeat(repeat: boolean = true): TweenTaskGroup {
        if (this._repeat === repeat || this.tasks.length <= 0) {
            return this;
        }

        this._repeat = repeat;

        return this;
    }

    //TODO_LviatYi 挑战 Group 平行倒放
    //TODO_LviatYi 挑战 Group 󰒿顺序倒放

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 构建 Seq onDone 回调.
     * @param taskCurr
     * @param taskNext
     * @private
     */
    private createSeqDoneCallbackFunction(taskCurr: IAdvancedTweenTask<unknown> | TweenTaskGroup, taskNext?: IAdvancedTweenTask<unknown> | TweenTaskGroup): (isBackward: boolean) => void {
        return (isBackward: boolean) => {
            if (taskCurr instanceof TweenTaskGroup || !taskCurr.isPingPong || isBackward) {
                ++this._currentSeqIndex;
                if (this._currentSeqIndex === this.tasks.length) {
                    this.onDone.invoke(false);
                    this._innerOnDone.invoke(false);
                    if (this.isRepeat) {
                        this.restart();
                    }
                } else {
                    if (taskNext) {
                        taskNext.continue();
                    } else {
                        console.error("taskNext is needed when task is not the last.");
                    }
                }
            }
            return;
        };
    }

    /**
     * 构建 Pll onDone 回调.
     * @param taskCurr
     * @private
     */
    private createPllDoneCallbackFunction(taskCurr: IAdvancedTweenTask<unknown> | TweenTaskGroup) {
        return (isBackward: boolean) => {
            if (taskCurr instanceof TweenTaskGroup || !taskCurr.isPingPong || isBackward) {
                ++this._parallelDoneCount;
                if (this._parallelDoneCount === this.tasks.length) {
                    this.onDone.invoke(false);
                    if (this.isRepeat) {
                        this.restart();
                    }
                }
            }

            return;
        };
    }

    /**
     * 自动析构任务.
     */
    private autoDestroyTask = () => {
        this.destroy();
    };
}