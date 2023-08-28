import ITweenTask from "./ITweenTask";
import AccessorTween from "./AccessorTween";

/**
 * TweenTaskGroup.
 * 允许将 TweenTask 编组并进行统一管理.
 * 允许顺序播放 TweenTask.
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
export class TweenTaskGroup {
    public readonly tasks: ITweenTask<unknown>[] = [];

    private readonly _loopCallbacks: ((isBackward: boolean) => void)[] = [];

    private _currentSeqIndex?: number = undefined;

    private _repeat: boolean = false;

    /**
     * 是否 重复 播放.
     * @beta
     */
    public get isRepeat(): boolean {
        return this._repeat;
    }

    /**
     * 是否 󰒿顺序 播放.
     * @beta
     */
    public get isSeq(): boolean {
        return this._currentSeqIndex !== undefined;
    };

    /**
     * 添加 task.
     * @param task
     * @beta
     */
    public add(task: ITweenTask<unknown>): TweenTaskGroup {
        if (this.isSeq) {
            task.repeat(false);
            task.autoDestroy(false);
            task.pause();
            const length = this.tasks.length;

            if (length > 0) {
                const lastIndex = length - 1;
                this.tasks[lastIndex].onDone.remove(this._loopCallbacks[lastIndex]);
                this._loopCallbacks[lastIndex] = (isBackward: boolean) => {
                    if (task.isPingPong && !isBackward) {
                        return;
                    }
                    ++this._currentSeqIndex;
                    task.continue();
                };
            }
            this._loopCallbacks.push((isBackward: boolean) => {
                if (task.isPingPong && !isBackward) {
                    return;
                }
                this.restart();
            });
            if (this.isRepeat) {
                task.onDone.add(this._loopCallbacks[this.tasks.length]);
            }
        }
        this.tasks.push(task);

        return this;
    }

    /**
     * 移出 task.
     * @param indexOrTask
     * @beta
     */
    public remove(indexOrTask: number | ITweenTask<unknown>): TweenTaskGroup {
        const index = typeof indexOrTask === "number" ? indexOrTask : this.tasks.indexOf(indexOrTask);
        if (this.isSeq) {
            this._loopCallbacks.splice(index, 1);
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
            AccessorTween.destroyTweenTask(task);
        }
        this.tasks.length = 0;
        this._loopCallbacks.length = 0;

        return this;
    }

//region Tween Sequence

    /**
     * 顺序调用组内 task.
     * 不允许 task 是 重复 播放的 否则可能造成非预期的行为.
     * @param pause
     */
    public sequence(pause: boolean = false): TweenTaskGroup {
        if (this.isSeq) {
            return;
        }
        this._currentSeqIndex = 0;

        const length = this.tasks.length;
        this._loopCallbacks.length = 0;

        for (let i = 0; i < length - 1; i++) {
            const task = this.tasks[i];
            const taskNext = this.tasks[i + 1];
            task.repeat(false);
            task.autoDestroy(false);

            this._loopCallbacks.push((isBackward: boolean) => {
                if (task.isPingPong && !isBackward) {
                    return;
                }
                ++this._currentSeqIndex;
                taskNext.continue();
            });

            this.tasks[i].onDone.add(this._loopCallbacks[i]);
        }

        if (length > 0) {
            this._loopCallbacks.push((isBackward: boolean) => {
                if (this.tasks[length - 1].isPingPong && !isBackward) {
                    return;
                }
                this.restart();
            });
            if (this.isRepeat) {
                this.tasks[length - 1].onDone.add(this._loopCallbacks[length - 1]);
            }
        }

        this.restart(pause);

        return this;
    }

    /**
     * 同时调用组内 task.
     * @param pause
     */
    public parallel(pause: boolean = false): TweenTaskGroup {
        if (!this.isSeq) {
            return;
        }
        this._currentSeqIndex = undefined;

        const length = this.tasks.length;
        for (let i = 0; i < length; i++) {
            this.tasks[i].onDone.remove(this._loopCallbacks[i]);
        }

        this._loopCallbacks.length = 0;

        this.restart(pause);

        return this;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Tween Action

    public pause(): TweenTaskGroup {
        if (this.isSeq) {
            this.tasks[this._currentSeqIndex].pause();
        } else {
            for (const task of this.tasks) {
                task.pause();
            }
        }

        return this;
    }

    public restart(pause: boolean = false): TweenTaskGroup {
        for (let i = this.tasks.length - 1; i >= 0; --i) {
            this.tasks[i].restart(this.isSeq ? true : pause);
        }

        if (this.isSeq && this.tasks.length > 0 && !pause) {
            this._currentSeqIndex = 0;
            this.tasks[this._currentSeqIndex].continue();
        }

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

        return this;
    }

    public repeat(repeat: boolean = true): TweenTaskGroup {
        if (this._repeat === repeat || this.tasks.length <= 0) {
            return this;
        }
        if (this.isSeq) {
            const lastIndex = this.tasks.length - 1;
            if (repeat) {
                this.tasks[lastIndex].onDone.add(this._loopCallbacks[lastIndex]);
            } else {
                this.tasks[lastIndex].onDone.remove(this._loopCallbacks[lastIndex]);
            }
        } else {

            for (const task of this.tasks) {
                task.repeat();
            }
        }

        this._repeat = repeat;

        return this;
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}