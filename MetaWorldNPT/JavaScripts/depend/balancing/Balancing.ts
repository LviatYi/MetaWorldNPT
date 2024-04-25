import {BulletTask, DoneStatus, TaskStatus} from "./BulletTask";
import Gtk, {Delegate, GtkTypes, Singleton} from "../../util/GToolkit";
import Log4Ts from "../log4ts/Log4Ts";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * Balancing 负载均衡管理.
 * @desc > 我赌你的枪里 没有子弹.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.0.0
 */
export default class Balancing extends Singleton<Balancing>() {
//#region Constant
    public static readonly ASYNC_TASK_TIMEOUT_INFER = 10 * GtkTypes.Interval.PerSec;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 弹药箱.
     * @type {Map<string, BulletTask[]>} taskTag -> task
     * @private
     */
    private _bulletMap: Map<string, BulletTask[]>;

    /**
     * 弹匣.
     * @type {Set<BulletTask>}
     * @private
     */
    private _magazine: Set<BulletTask>;

    /**
     * 枪膛.
     * @type {BulletTask[]}
     * @private
     */
    private _bore: BulletTask[];

    /**
     *
     * @type {boolean}
     * @private
     */
    private _needFire: boolean = false;

    /**
     * 已完成任务计数.
     * @type {number}
     * @private
     */
    private _doneCounter: number = 0;

    /**
     * 负载均衡阈值. ms
     * @desc 当前计时大于阈值时触发负载均衡.
     * @desc 剩余任务将等待下一次调用.
     * @type {number}
     */
    public threshold: number = GtkTypes.Interval.Hz60;

    /**
     * 异步任务最大容量.
     * @type {number}
     */
    public asyncBulletMaxCount: number = 10;

    private asyncCounter: number = 0;

    private _fireCounter: number = 0;

    private _useDebug: boolean = false;

//#region Event
    /**
     * 当 󰈸开火 时.
     * @type {Delegate.SimpleDelegate<void>}.
     */
    public onFire: SimpleDelegate<void> = new Delegate.SimpleDelegate();

    /**
     * 当 󰄲空仓挂机 时.
     * @desc 开火后所有子弹发射完毕.
     * @type {Delegate.SimpleDelegate<void>}
     */
    public onHangUp: SimpleDelegate<void> = new Delegate.SimpleDelegate();
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Controller
    /**
     * 填弹 一个同步任务.
     * @desc 制作一颗子弹
     * @desc 当带有 tag 时 存放在弹药箱.
     * @desc 否则直接压入弹匣 下次 fire 调用后将执行.
     * @param {() => void} task
     * @param {string} tag 任务标签.
     *      - 当子弹任务没有标签时 被认为是一个单次任务.
     * @param {() => void} onError
     * @param {number} timeout
     * @param {() => void} onTimeout
     */
    public press(task: () => void,
                 tag: string = undefined,
                 onError: () => void = undefined,
                 timeout: number = undefined,
                 onTimeout: () => void = undefined) {
        const bullet = new BulletTask(tag)
            .setTask(task)
            .setOnError(onError)
            .setTimeoutPeriod(timeout ?? (8 * GtkTypes.Interval.PerSec))
            .setOnTimeout(onTimeout);

        this.sortOut(tag, bullet);
    }

    /**
     * 填弹 一个异步任务.
     * @desc 制作一颗子弹
     * @desc 当带有 tag 时 存放在弹药箱.
     * @desc 否则直接压入弹匣 下次 fire 调用后将执行.
     * @param {() => Promise<void>} task
     * @param {string} tag 任务标签.
     *      - 当子弹任务没有标签时 被认为是一个单次任务.
     * @param {() => void} onError
     * @param {number} timeout=Balancing.ASYNC_TASK_TIMEOUT_INFER 异步任务需要超时时间.
     *      - 不能超过 {@link Balancing.ASYNC_TASK_TIMEOUT_INFER}.
     * @param {() => void} onTimeout
     */
    public pressAsync(task: () => Promise<void>,
                      tag: string = undefined,
                      onError: () => void = undefined,
                      timeout: number = undefined,
                      onTimeout: () => void = undefined) {
        const bullet = new BulletTask(tag)
            .setAsyncTask(task)
            .setOnError(onError)
            .setTimeoutPeriod(
                timeout === undefined || timeout === 0 ?
                    Balancing.ASYNC_TASK_TIMEOUT_INFER :
                    Math.min(Balancing.ASYNC_TASK_TIMEOUT_INFER, timeout))
            .setOnTimeout(onTimeout);

        this.sortOut(tag, bullet);
    }

    /**
     * 装填 一组任务.
     * @desc 将弹药箱中被指定 tag 引用的子弹装入弹匣.
     * @param {string} tag
     */
    public load(tag: string) {
        const bullets = this._bulletMap.get(tag);
        if (Gtk.isNullOrEmpty(bullets)) {
            return;
        }

        bullets.forEach(bullet => this._magazine.add(bullet));
    }

    /**
     * 󰈸开火.
     * @desc 将负载均衡处理任务执行.
     * @desc 直到弹匣中没有子弹.
     */
    public fire() {
        if (this._bore.length > 0) Log4Ts.log(Balancing, `add tasks to bore when bore is not empty.`);
        else {
            ++this._fireCounter;
            this._doneCounter = 0;
            this.onFire.invoke();
        }

        this._bore.push(...this._magazine);
        this._magazine.clear();
    }

    /**
     * 打开保险.
     * @desc 准备收集 load.
     * @desc 并在下一次 trigger 自动执行 fire.
     */
    public collectFire() {
        this._needFire = true;
    }

    public progress() {
        return this._doneCounter / (this._doneCounter + this._bore.length);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config

    /**
     * 设置 Update 函数.
     * @desc 用于定时调用负载均衡处理器.
     * @param {(callback: () => void) => unknown} updater
     * @return {this}
     */
    public registerUpdater(updater: (callback: () => void) => unknown): this {
        updater?.(this.trigger);
        return this;
    }

    /**
     * 设置负载均衡阈值. ms
     * 默认为 60Hz.
     * @param {number} duration
     * @return {this}
     */
    public setThreshold(duration: number): this {
        this.threshold = duration;
        return this;
    }

    /**
     * 开启调试.
     * @param {boolean} enable
     * @return {this}
     */
    public useDebug(enable: boolean = true): this {
        this._useDebug = enable;
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private trigger = () => {
        if (this._needFire) {
            this.fire();
            this._needFire = false;
        }
        if (this._bore.length === 0) return;

        let costTime = 0;
        let atLeastDid = false;
        let size = this._bore.length;

        for (let i = 0; i < size; ++i) {
            const bullet = this._bore.shift();
            if (bullet.getCurrentState() === TaskStatus.Running) {
                Log4Ts.log(Balancing, `task is running, skip.`);
                continue;
            }

            if (bullet.isAsync) {
                if (this.asyncCounter < this.asyncBulletMaxCount) {
                    const currentFireIndex = this._fireCounter;
                    ++this.asyncCounter;
                    bullet.onDone.add((status) => {
                        if (currentFireIndex === this._fireCounter) --this.asyncCounter;
                        if (this._useDebug) Log4Ts.log(Balancing, `[${DoneStatus[status]}] async task done.`);
                        bullet.onDone.clear();
                    });
                    bullet.run();
                }
            } else {
                if (atLeastDid && (costTime + bullet?.avgCost ?? 0) > this.threshold) {
                    continue;
                }
                atLeastDid = true;
                bullet.onDone.add((status) => {
                    costTime += bullet.getTakeTime();
                    if (this._useDebug) Log4Ts.log(Balancing, `[${DoneStatus[status]}] async task done.`);
                });
                bullet.run();
                bullet.onDone.clear();
            }
        }
    };

    /**
     * 区分臭弹.
     * @private
     */
    private sortOut(tag: string, bullet: BulletTask) {
        if (Gtk.isNullOrEmpty(tag)) {
            this._magazine.add(bullet);
        } else {
            let magazine = this._bulletMap.get(tag);
            if (Gtk.isNullOrUndefined(magazine)) {
                magazine = [];
                this._bulletMap.set(tag, magazine);
            }

            magazine.push(bullet);
        }
    }
}