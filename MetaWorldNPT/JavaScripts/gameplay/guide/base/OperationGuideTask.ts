export type OperationGuideType = "Group" | "Ui" | "Scene" | "CutScene";

export default abstract class OperationGuideTask {
    /**
     * 步骤.
     * @desc 一种 Id. 具有唯一性 但不表达顺序性.
     */
    abstract stepId: number;

    /**
     * 类型.
     */
    abstract type: OperationGuideType;

    /**
     * 存活回调间隔. ms
     * @type {number}
     */
    public aliveCheckInterval: number = undefined;

    /**
     * 开始引导回调.
     */
    public onFocus: () => void = undefined;

    /**
     * 结束引导回调.
     */
    public onFade: (completed: boolean) => void = undefined;

    /**
     * 引导存活回调.
     * @desc 由 aliveCheckInterval 控制间隔.
     * @desc 当 aliveCheckInterval 为 undefined 时不执行.
     * @type {(counter: number) => void}
     */
    public onAlive: (counter: number) => void = undefined;

    /**
     * 设置开始引导回调.
     * @param {() => void} onFocus
     * @return {this}
     */
    public setOnFocus(onFocus: () => void): this {
        this.onFocus = onFocus;
        return this;
    }

    /**
     * 设置结束引导回调.
     * @param {(completed: boolean) => void} onFade 是否完成.
     * @return {this}
     */
    public setOnFade(onFade: (completed: boolean) => void): this {
        this.onFade = onFade;
        return this;
    }

    /**
     * 设置引导存活回调.
     * @desc 由 aliveCheckInterval 控制间隔.
     * @param {(counter: number) => void} onAlive 存活回调. counter 为存活次数. 从 1 计数.
     * @param {number} interval 执行间隔. ms
     * @return {this}
     */
    public setOnAlive(onAlive: (counter: number) => void, interval: number = 5e3): this {
        this.aliveCheckInterval = interval > 0 ? interval : undefined;
        this.onAlive = interval > 0 ? onAlive : undefined;
        return this;
    }
}