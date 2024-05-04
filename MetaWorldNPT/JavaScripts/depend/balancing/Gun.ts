import { BulletTask, DoneStatus, TaskStatus } from "./BulletTask";
import { Delegate, GtkTypes } from "../../util/GToolkit";
import Log4Ts from "../log4ts/Log4Ts";

/**
 * Gun.
 * @desc 子弹任务集合与处理器.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export default class Gun {
//#region Constant
    public static readonly DEFAULT_BULLET_NAME = "";

    public static readonly ASYNC_TASK_TIMEOUT_INFER = 10 * GtkTypes.Interval.PerSec;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 优先级.
     * @type {number}
     */
    public priority: number;

    /**
     * 弹匣.
     * @type {Array<BulletTask>}
     * @private
     */
    private _magazine: Array<BulletTask> = [];

    /**
     * 枪膛.
     * @type {BulletTask[]}
     * @private
     */
    private _bore: BulletTask[] = [];

    private _needFire: boolean = false;

    /**
     * 已完成任务计数.
     * @type {number}
     * @private
     */
    private _doneCounter: number = 0;

    private _fireCounter: number = 0;

    private _asyncCounter: number = 0;

    public get activeAsyncTaskCount(): number {
        return this._asyncCounter;
    }

//#region Event
    /**
     * 当 󰈸开火 时.
     * @type {Delegate.SimpleDelegate<void>}.
     */
    public onFire: Delegate.SimpleDelegate<void> = new Delegate.SimpleDelegate();

    /**
     * 当 󰄲空仓挂机 时.
     * @desc 开火后所有子弹发射完毕.
     * @type {Delegate.SimpleDelegate<void>}
     */
    public onHangUp: Delegate.SimpleDelegate<void> = new Delegate.SimpleDelegate();

    /**
     * 当 󰄲完成一个任务 时.
     * @desc 当一个异步任务完成时 但不是由于当前 󰈸开火 导致的 则不触发该事件.
     * @type {Delegate.SimpleDelegate<number>} 任务进度.
     */
    public onProgress: Delegate.SimpleDelegate<number> = new Delegate.SimpleDelegate();
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Controller
    /**
     * 󱘲填弹 一个 󰓦同步任务.
     * @desc 制作一颗子弹.
     * @desc 当 isOneOff 时 直接填入枪膛 立即执行 且不可复用.
     * @desc 否则压入弹匣 下次 󰈸fire 调用后将执行.
     * @desc 仅具有 tag 的子弹任务会被保存并进行代价分析.
     * @param {() => void} task
     * @param {boolean} isOneOff=true 是否 一次性任务.
     * @param {boolean} instant=false 立即上膛.
     *      - 将自动调用 collectFire.
     * @param {() => void} onError
     * @param {number} timeout
     * @param {() => void} onTimeout
     */
    public press(task: () => void,
                 isOneOff: boolean = true,
                 instant: boolean = false,
                 onError: () => void = undefined,
                 timeout: number = undefined,
                 onTimeout: () => void = undefined) {
        const bullet = this.generateSyncTask(
            task,
            isOneOff,
            onError,
            timeout,
            onTimeout,
        );

        if (instant) this.collectFire();
        this.sortOut(bullet);
    }

    /**
     * 󱘲填弹 一个 󰓨异步任务.
     * @desc 制作一颗子弹.
     * @desc 当 isOneOff 时 直接填入枪膛 立即执行 且不可复用.
     * @desc 否则压入弹匣 下次 󰈸fire 调用后将执行.
     * @desc 仅具有 tag 的子弹任务会被保存并进行代价分析.
     * @param {() => Promise<void>} task
     * @param {boolean} isOneOff=true 是否 一次性任务.
     *      - 当子弹任务没有标签时 被认为是一个单次任务.
     * @param {boolean} instant=false 立即上膛.
     *      - 将自动调用 collectFire.
     * @param {() => void} onError
     * @param {number} timeout=Gun.ASYNC_TASK_TIMEOUT_INFER 异步任务需要超时时间.
     *      - 不能超过 {@link Gun.ASYNC_TASK_TIMEOUT_INFER}.
     * @param {() => void} onTimeout
     */
    public pressAsync(task: () => Promise<void>,
                      isOneOff: boolean = true,
                      instant: boolean = false,
                      onError: () => void = undefined,
                      timeout: number = undefined,
                      onTimeout: () => void = undefined) {
        const bullet = this.generateAsyncTask(
            task,
            isOneOff,
            onError,
            timeout,
            onTimeout,
        );

        if (instant) this.collectFire();
        this.sortOut(bullet);
    }

    /**
     * 󰈸开火.
     * @desc 将负载均衡处理任务执行.
     * @desc 直到弹匣中没有子弹.
     */
    public fire() {
        if (this._bore.length === 0) {
            this._doneCounter = 0;
            ++this._fireCounter;
            this.onFire.invoke();
        }

        this._bore.push(...this._magazine);
        this._magazine.length = 0;
    }

    /**
     * 打开保险.
     * @desc 准备收集 load.
     * @desc 并在下一次 trigger 自动执行 fire.
     */
    public collectFire() {
        this._needFire = true;
    }

    /**
     * 󰈇退弹.
     * @desc 去除枪膛中所有未执行任务.
     */
    public surrender() {
        this._bore.length = 0;
    }

    /**
     * 进度.
     * @returns {number}
     */
    public progress(): number {
        return this._doneCounter / (this._doneCounter + this._bore.length);
    }

    /**
     * 击发.
     * @param {number} life
     * @param {number} asyncBulletMaxCount
     * @param {boolean} useDebug=false
     * @returns {number}
     */
    public run(life: number, asyncBulletMaxCount: number, useDebug: boolean = false): number {
        if (this._needFire) {
            this.fire();
            this._needFire = false;
        }
        if (this._bore.length === 0) return 0;

        let costTime = 0;
        let atLeastDid = false;
        let size = this._bore.length;
        let loggedSyncSkipped: boolean = undefined;
        let loggedASyncSkipped: boolean = undefined;

        for (let i = 0; i < size; ++i) {
            const bullet = this._bore.shift();
            if (bullet.getCurrentState() === TaskStatus.Running) {
                Log4Ts.log(Gun, `task is running, skip.`);
                continue;
            }

            if (bullet.isAsync) {
                if (this._asyncCounter < asyncBulletMaxCount) {
                    ++this._asyncCounter;
                    let currentFireIndex = this._fireCounter;
                    bullet.onDone.add((status) => {
                        if (currentFireIndex === this._fireCounter) {
                            ++this._doneCounter;
                            --this._asyncCounter;
                            this.handleDoneEvent();
                        }
                        if (useDebug) this.logTaskDoneStatus(status, bullet);
                        bullet.onDone.clear();
                    });
                    bullet.run();
                } else {
                    this._bore.push(bullet);
                    if (useDebug && !loggedASyncSkipped) {
                        loggedASyncSkipped = true;
                        Log4Ts.log(Gun, `async task is over max count.`,
                            `current count: ${this._asyncCounter}`,
                            `skip.`);
                    }
                }
            } else {
                if (atLeastDid && (costTime + (bullet?.avgCost ?? 0)) > life) {
                    this._bore.push(bullet);
                    if (useDebug && !loggedSyncSkipped) {
                        loggedSyncSkipped = true;
                        Log4Ts.log(Gun,
                            `task cost time is over threshold.`,
                            `current cost time: ${costTime}ms`,
                            `avg cost time: ${bullet?.avgCost ?? 0}ms`,
                            `skip.`);
                    }
                    continue;
                }
                atLeastDid = true;
                bullet.onDone.add((status) => {
                    ++this._doneCounter;
                    costTime += bullet.getTakeTime();
                    if (useDebug) this.logTaskDoneStatus(status, bullet);
                });
                bullet.run();
                bullet.onDone.clear();
                this.handleDoneEvent();
            }
        }

        return costTime;
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config
    public setPriority(value: number): this {
        this.priority = value;
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private generateSyncTask(task: () => void,
                             isOneOff: boolean,
                             onError: () => void = undefined,
                             timeout: number = undefined,
                             onTimeout: () => void = undefined) {
        return new BulletTask()
            .setTask(task)
            .setOneOff(isOneOff)
            .setOnError(onError)
            .setTimeoutPeriod(timeout ?? (8 * GtkTypes.Interval.PerSec))
            .setOnTimeout(onTimeout);
    }

    private generateAsyncTask(task: () => Promise<void>,
                              isOneOff: boolean,
                              onError: () => void = undefined,
                              timeout: number = undefined,
                              onTimeout: () => void = undefined) {
        return new BulletTask()
            .setAsyncTask(task)
            .setOneOff(isOneOff)
            .setOnError(onError)
            .setTimeoutPeriod(
                timeout === undefined || timeout === 0 ?
                    Gun.ASYNC_TASK_TIMEOUT_INFER :
                    Math.min(Gun.ASYNC_TASK_TIMEOUT_INFER, timeout))
            .setOnTimeout(onTimeout);
    }

    private handleDoneEvent() {
        this.onProgress.invoke(this.progress());
        this.progress() === 1 && this.onHangUp.invoke();
    }

    /**
     * 区分臭弹.
     * @private
     */
    private sortOut(bullet: BulletTask) {
        if (bullet.isOneOff) {
            this._bore.push(bullet);
        } else {
            this._magazine.push(bullet);
        }
    }

//#region Log
    private logTaskDoneStatus(status: DoneStatus, task: BulletTask) {
        Log4Ts.log(Gun,
            `[${DoneStatus[status]}] ${task.isAsync ? "async" : "sync"} task done.`,
            `take time: ${task.getTakeTime()}ms`,
            `current progress: ${this.progress() * 100}%`,
        );
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}