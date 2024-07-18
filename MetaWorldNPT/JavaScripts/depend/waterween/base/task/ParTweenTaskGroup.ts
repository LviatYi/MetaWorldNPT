import { Delegate } from "gtoolkit";
import { GroupElement, GroupMode, TweenTaskGroupBase } from "./TweenTaskGroupBase";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * Parallel Task Group.
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
export class ParTweenTaskGroup extends TweenTaskGroupBase {
    public mode: GroupMode = "parallel";

    /**
     * tasks 不为空时 不为 undefined.
     */
    private _maxLengthIndex: number | undefined;

    public get elapsedTime(): number {
        if (this.empty) return 0;

        return this.tasks[this._maxLengthIndex].elapsedTime;
    }

    public set elapsedTime(value: number) {
        if (this.empty) return;
        for (const task of this.tasks) task.elapsedTime = value;
    }

    public get elapsed(): number {
        if (this.empty) return 0;

        return this.tasks[this._maxLengthIndex].elapsed;
    }

    public set elapsed(value: number) {
        if (this.empty) return;
        for (const task of this.tasks) task.elapsed = value;
    }

    public get duration(): number {
        return this.empty ? 0 : this.tasks[this._maxLengthIndex].duration;
    }

    public get isDone(): boolean {
        return this.empty || this.tasks.every(task => task.isDone);
    }

    public get isPause(): boolean {
        return this.empty || this.tasks[this._maxLengthIndex].isPause;
    }

    public get isForward(): boolean {
        return this.empty || this.tasks[this._maxLengthIndex].isForward;
    }

//#region Tween Action
    public continue(recurve?: boolean): this {
        if (this.empty || this.isDone) return this;
        if (!this.isPause && !recurve) return this;

        for (const task of this.tasks) {
            task.continue(recurve);
        }

        this.onContinue.invoke();
    }

    public pause(): this {
        if (this.isDone || this.isPause) return this;
        if (this.empty) return this;

        for (const task of this.tasks) {
            task.pause();
        }

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
        if (this.empty) return;
        if (this.isDone && this.isForward) return;

        const restarted = this.isDone;
        const paused = this.isPause;

        for (let task of this.tasks) {
            task.forward(recurve, pause);
        }

        if (paused && !pause) this.onContinue.invoke();
        else if (!paused && pause) this.onPause.invoke();

        restarted && this.onRestart.invoke();
        return this;
    }

    public backward(recurve: boolean = true, pause: boolean = false): this {
        if (this.empty) return;
        if (this.isDone && !this.isForward) return;

        const restarted = this.isDone;
        const paused = this.isPause;

        for (let task of this.tasks) {
            task.backward(recurve, pause);
        }

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

    private handleSubTaskDone = () => {

    };

    public addTask(task: GroupElement): void {
        super.addTask(task);
        
        if (this._maxLengthIndex === undefined) {
            this._maxLengthIndex = 0;
        } else if (this.tasks[this._maxLengthIndex].duration < task.duration) {
            this._maxLengthIndex = this.tasks.length - 1;
        }
    }

    public call(dtOrElapsed?: number, isDt?: boolean): this {
        if (dtOrElapsed > 0 &&
            (this.isDone || this.isPause)) return this;

        if (isDt) {
            for (const task of this.tasks) {
                task.call(dtOrElapsed, isDt);
            }

            const maxLengthTask = this.tasks[this._maxLengthIndex];
            if (maxLengthTask.isDone) {
                this.onDone.invoke(maxLengthTask.isForward);
                if (this.isAutoDestroy) this.destroy();
            }
        } else this.elapsed = dtOrElapsed;

        return this;
    }
}