import { GtkTypes, Singleton } from "../../util/GToolkit";
import Gun from "./Gun";

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
 * @version 1.1.0
 */
export default class Balancing extends Singleton<Balancing>() {
    /**
     * 弹药库.
     * @type {Map<string, Gun>} gunTag -> Gun
     * @private
     */
    private _arsenal: Map<string, Gun> = new Map();

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

    private _useDebug: boolean = false;

//#region Controller
    /**
     * 获取指定标签的 Gun.
     * @param {string} tag
     * @returns {Gun | undefined}
     */
    public getGun(tag: string): Gun | undefined {
        return this._arsenal.get(tag);
    }

    /**
     * 新增 Gun.
     * @param {string} tag
     * @returns {Gun}
     */
    public setGun(tag: string): Gun {
        let gun = new Gun();
        this._arsenal.set(tag, gun);
        return gun;
    }

    /**
     * 尝试获取指定标签的 Gun. 若不存在则新增.
     * @param {string} tag
     * @returns {Gun}
     */
    public tryGetGun(tag: string): Gun {
        let gun = this.getGun(tag);
        if (!gun) gun = this.setGun(tag);

        return gun;
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
        let costTime = 0;

        let guns = Array
            .from(this._arsenal.values())
            .sort((a, b) => b.priority - a.priority);

        let activatedAsyncTasks = 0;
        for (const gun of guns) activatedAsyncTasks += gun.activeAsyncTaskCount;
        for (const gun of guns) {
            let currAsyncCount = gun.activeAsyncTaskCount;
            costTime += gun.run(
                this.threshold - costTime,
                this.asyncBulletMaxCount - activatedAsyncTasks,
                this._useDebug);
            activatedAsyncTasks -= gun.activeAsyncTaskCount - currAsyncCount;
        }
    };
}