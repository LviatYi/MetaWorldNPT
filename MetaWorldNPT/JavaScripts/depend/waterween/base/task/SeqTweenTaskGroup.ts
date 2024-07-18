import { Delegate } from "gtoolkit";
import { GroupElement, GroupMode, TweenTaskGroupBase } from "./TweenTaskGroupBase";
import { TweenDataUtil } from "../../dateUtil/TweenDataUtil";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * Sequence Task Group.
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
export class SeqTweenTaskGroup extends TweenTaskGroupBase {
    public mode: GroupMode = "sequence";

    /**
     * undefined 时表示 isDone.
     */
    private _currentSeqIndex: number | undefined;

    public get elapsedTime(): number {
        if (this.empty) return 0;

        if (this.isDone) {
            return this.isForward ? this._durationCache : 0;
        } else {
            let sum = 0;
            for (let i = 0;
                 i < this._currentSeqIndex;
                 ++i) sum += this.tasks[i].elapsedTime;

            return sum;
        }
    }

    public set elapsedTime(value: number) {
        if (this.empty) return;

        let targetIndex = 0;
        for (; targetIndex < this.tasks.length; ++targetIndex) {
            if (value >= this.tasks[targetIndex].duration) {
                value -= this.tasks[targetIndex].duration;
            } else {
                break;
            }
        }

        this.locateTo(targetIndex, value);
    }

    public get elapsed(): number {
        if (this.empty) return 0;

        if (this.isDone) {
            return this.isForward ? 1 : 0;
        } else {
            return this.elapsedTime / this.duration;
        }
    }

    public set elapsed(value: number) {
        if (this.empty) return;

        this.elapsedTime = this.duration * value;
    }

    private _durationCache: number = 0;

    public get duration(): number {
        return this._durationCache;
    }

    public get isDone(): boolean {
        if (this._currentSeqIndex !== undefined) return false;
        if (this.empty) return true;

        if (this.isForward) return this.tasks[this.tasks.length - 1].isDone;
        else return this.tasks[0].isDone;
    }

    public get isPause(): boolean {
        return this.empty || this.isDone ? false :
            TweenDataUtil.isNullOrUndefined(this._currentSeqIndex) ?
                true :
                this.tasks[this._currentSeqIndex].isPause;
    }

    public get isForward(): boolean {
        if (this._currentSeqIndex !== undefined)
            return this.tasks[this._currentSeqIndex].isForward;
        if (this.empty) return true;

        return this.tasks[0].isForward;
    }

//#region Tween Action
    public continue(recurve?: boolean): this {
        if (this.empty || this.isDone) return this;
        if (!this.isPause && !recurve) return this;

        if (TweenDataUtil.isNullOrUndefined(this._currentSeqIndex))
            this._currentSeqIndex = this.isForward ? 0 :
                this.tasks.length - 1;
        this.tasks[this._currentSeqIndex].continue(recurve);

        this.onContinue.invoke();
    }

    public pause(): this {
        if (this.isDone || this.isPause) return this;
        if (this.empty) return this;

        this.tasks[this._currentSeqIndex].pause();

        this.onPause.invoke();
        return this;
    }

    public fastForwardToEnd(): this {
        this.continue(false);
        this.elapsedTime = this.duration;

        this.onDone.invoke(true);

        return this;
    }

    public forward(recurve: boolean = true, pause: boolean = false): this {
        if (this.empty) return this;
        let restarted = false;
        if (this.isDone) {
            if (!this.isForward) {
                this._currentSeqIndex = 0;
                restarted = true;
            } else return this;
        }

        const paused = this.tasks[this._currentSeqIndex];
        this.tasks[this._currentSeqIndex].forward(recurve, pause);

        if (paused && !pause) this.onContinue.invoke();
        else if (!paused && pause) this.onPause.invoke();

        restarted && this.onRestart.invoke();

        return this;
    }

    public backward(recurve: boolean = true, pause: boolean = false): this {
        if (this.empty) return this;
        let restarted = false;
        if (this.isDone) {
            if (this.isForward) {
                this._currentSeqIndex = this.tasks.length - 1;
                restarted = true;
            } else {
                return this;
            }
        }

        const paused = this.tasks[this._currentSeqIndex];
        this.tasks[this._currentSeqIndex].backward(recurve, pause);

        if (paused && !pause) this.onContinue.invoke();
        else if (!paused && pause) this.onPause.invoke();

        restarted && this.onRestart.invoke();

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event
    public onDone: SimpleDelegate<boolean> = new SimpleDelegate();

    public onDestroy: SimpleDelegate = new SimpleDelegate();

    public onPause: SimpleDelegate = new SimpleDelegate();

    public onContinue: SimpleDelegate = new SimpleDelegate();

    public onRestart: SimpleDelegate = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private locateTo(targetIndex: number,
                     innerElapsedTime: number) {
        if (this.isDone || this._currentSeqIndex < targetIndex) {
            for (let i = this._currentSeqIndex ?? 0; i < targetIndex; ++i) {
                this.tasks[i].fastForwardToEnd();
            }
        } else {
            for (let i = this._currentSeqIndex; i > targetIndex; --i) {
                this.tasks[i].restart(true);
            }
        }

        this.tasks[targetIndex].elapsedTime = innerElapsedTime;
        this._currentSeqIndex = targetIndex;
        return;
    }

    public addTask(task: GroupElement): void {
        super.addTask(task);

        this._durationCache += task.duration;
        if (this._currentSeqIndex === undefined) this._currentSeqIndex = 0;
    }

    public call(dtOrElapsed?: number, isDt: boolean = true): this {
        if (dtOrElapsed > 0 &&
            (this.isDone || this.isPause)) return this;

        if (isDt) {
            const currTask = this.tasks[this._currentSeqIndex];
            currTask.call(dtOrElapsed, isDt);

            if (currTask.isDone) {
                const currentIsForward = currTask.isForward;
                if (currentIsForward) ++this._currentSeqIndex;
                else --this._currentSeqIndex;

                if (this._currentSeqIndex >= this.tasks.length ||
                    this._currentSeqIndex < 0) {
                    this._currentSeqIndex = undefined;

                    this.onDone.invoke(currentIsForward);
                    if (this.isAutoDestroy) this.destroy();
                } else {
                    if (currentIsForward) {
                        // this.tasks[this._currentSeqIndex].forward().restart();
                        this.tasks[this._currentSeqIndex].restart();
                    } else {
                        this.tasks[this._currentSeqIndex]
                            .fastForwardToEnd()
                            .backward();
                    }
                }
            }
        } else this.elapsed = dtOrElapsed;

        return this;
    }
}