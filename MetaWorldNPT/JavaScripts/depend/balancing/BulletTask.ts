import Log4Ts from "../log4ts/Log4Ts";
import { Delegate } from "../../util/GToolkit";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * 任务状态.
 */
export enum TaskStatus {
    /**
     * 󰄱未处理.
     */
    Unhandled,
    /**
     * 󰐊运行中.
     */
    Running,
    /**
     * 󰄲完成.
     */
    Finished,
}

/**
 * 完成结果.
 */
export enum DoneStatus {
    /**
     * 未知错误.
     */
    Null,
    /**
     * 完成.
     */
    Done,
    /**
     * 错误.
     */
    Error,
    /**
     * 超时未完成.
     */
    Timeout,
}

/**
 * BulletTask 子弹任务.
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
export class BulletTask {
//#region Constant
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _startTime: number = undefined;

    private _endTime: number = undefined;

    private _avgCost: number = undefined;

    private _avgSamplerCount: number = 0;

    /**
     * 是否 一次性的.
     * @type {boolean}
     */
    public isOneOff: boolean = true;

    /**
     * 是否 为异步子弹任务.
     * @return {boolean}
     */
    public get isAsync() {
        return !!this._asyncTask;
    }

    /**
     * 任务平均用时.
     * @return {number}
     */
    public get avgCost(): number {
        return this._avgCost;
    }

    /**
     * 获取当前状态.
     * @return {TaskStatus}
     */
    public getCurrentState(): TaskStatus {
        if (this._startTime === undefined) {
            return TaskStatus.Unhandled;
        } else if (this._endTime === undefined) {
            return TaskStatus.Running;
        } else {
            return TaskStatus.Finished;
        }
    }

    /**
     * 获取任务已运行时间.
     * @param {number} now
     * @return {number | null}
     */
    public getTakeTime(now?: number): number | null {
        if (now === undefined) now = Date.now();

        switch (this.getCurrentState()) {
            case TaskStatus.Unhandled:
                return null;
            case TaskStatus.Running:
                return now - this._startTime;
            case TaskStatus.Finished:
                return this._endTime - this._startTime;
            default:
                this.logCurrentStateNotSupported();
                return null;
        }
    }

    private _task: () => void;

    private _asyncTask: () => Promise<void>;

    private _errorCallback: () => void;

    private _timeoutPeriod: number;

    private _timeoutCallback: () => void;

    private _timeoutTimer: number;

//#region Event
    public onDone: SimpleDelegate<DoneStatus> = new Delegate.SimpleDelegate();
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config Builder

    /**
     * 设置任务.
     * @param {() => void} task
     * @return {this}
     */
    public setTask(task: () => void): this {
        this._task = task;
        this._asyncTask = undefined;
        return this;
    }

    /**
     * 清除任务.
     * @return {this}
     */
    public clearTask(): this {
        this._task = undefined;
        return this;
    }

    /**
     * 设置异步任务.
     * @param {() => Promise<void>} task
     * @return {this}
     */
    public setAsyncTask(task: () => Promise<void>): this {
        this._asyncTask = task;
        this._task = undefined;
        return this;
    }

    /**
     * 设置错误回调.
     * @param {() => void} onError
     * @return {this}
     */
    public setOnError(onError: () => void): this {
        this._errorCallback = onError;
        return this;
    }

    /**
     * 设置超时时间.
     * @param {number} timeout
     * @return {this}
     */
    public setTimeoutPeriod(timeout: number): this {
        this._timeoutPeriod = timeout;
        return this;
    }

    /**
     * 设置超时回调.
     * @param {() => void} callback
     * @return {this}
     */
    public setOnTimeout(callback: () => void): this {
        this._timeoutCallback = callback;
        return this;
    }

    /**
     * 设置为一次性任务.
     * @param {boolean} isOneOff
     * @returns {this}
     */
    public setOneOff(isOneOff: boolean): this {
        this.isOneOff = isOneOff;
        return this;
    }

    /**
     * 运行.
     */
    public run(): void {
        switch (this.getCurrentState()) {
            case TaskStatus.Unhandled:
            case TaskStatus.Finished:
                this.tryRunTaskHandler();
                break;
            case TaskStatus.Running:
                break;
            default:
                this.logCurrentStateNotSupported();
                return null;
        }
    }

    private tryRunTaskHandler() {
        if (!this._task && !this._asyncTask) return;
        const startTime = Date.now();
        if (this._task) {
            try {
                this.resetTimer(startTime, false);
                this._task();
                if (this._timeoutPeriod !== undefined &&
                    Date.now() - startTime > this._timeoutPeriod) {
                    try {
                        this._timeoutCallback?.();
                    } catch (e) {
                        this.logErrorInTimeoutCallback(e);
                    }
                }
                this.doneTimer(undefined, DoneStatus.Done);
            } catch (e) {
                this.handlerError(e);
            }
        } else {
            this.resetTimer(startTime, true);
            this._asyncTask()
                .then(
                    () => () => this.doneTimer(undefined, DoneStatus.Done),
                    e => {
                        this.handlerError(e);
                        this.doneTimer(undefined, DoneStatus.Error);
                    },
                )
                .catch(e => {
                    this.handlerError(e);
                    this.doneTimer(undefined, DoneStatus.Error);
                });
        }
    }

    private resetTimer(now?: number, setTimeout: boolean = false) {
        if (now === undefined) now = Date.now();
        this._startTime = now;
        this._endTime = undefined;
        if (setTimeout) this.setTimeoutTimer();
    }

    private doneTimer(now?: number, doneStatus: DoneStatus = DoneStatus.Done) {
        if (now === undefined) now = Date.now();
        this._endTime = now;
        this.recordTakeTime(now);
        this.clearTimeoutTimer();
        this.onDone.invoke(doneStatus);
    }

    private handlerError(e: unknown) {
        this.logErrorInTask(e);
        try {
            this._errorCallback?.();
        } catch (e) {
            this.logErrorInErrorCallback(e);
        }
    }

    private recordTakeTime(now: number) {
        const t = this.getTakeTime(now);
        this._avgCost = ((this._avgCost ?? 0) * this._avgSamplerCount + t) / (this._avgSamplerCount + 1);
        ++this._avgSamplerCount;
    }

    private setTimeoutTimer() {
        if (!this._timeoutPeriod) return undefined;
        this._timeoutTimer = mw.setTimeout(() => {
            try {
                this._timeoutCallback?.();
                this.doneTimer(undefined, DoneStatus.Timeout);
            } catch (e) {
                this.logErrorInTimeoutCallback(e);
            }
        }, this._timeoutPeriod);
    }

    private clearTimeoutTimer() {
        if (!this._timeoutTimer) return;
        mw.clearTimeout(this._timeoutTimer);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Logs
    public logCurrentStateNotSupported() {
        Log4Ts.error(BulletTask, `TaskState ${this.getCurrentState()} is not supported.`);
    }

    public logErrorInTask(e: unknown) {
        Log4Ts.error(BulletTask, `error occurs in task.`, e);
    }

    public logErrorInErrorCallback(e: unknown) {
        Log4Ts.error(BulletTask, `error occurs in error callback.`, e);
    }

    public logErrorInTimeoutCallback(e: unknown) {
        Log4Ts.error(BulletTask, `error occurs in timeout callback.`, e);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}