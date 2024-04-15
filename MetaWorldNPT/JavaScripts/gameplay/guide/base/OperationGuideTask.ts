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
     * 开始引导回调.
     */
    onFocus: () => void = undefined;

    /**
     * 结束引导回调.
     */
    onFade: (completed: boolean) => void = undefined;

    /**
     * 设置开始引导回调.
     * @param {() => void} onFocus
     * @return {this}
     */
    setOnFocus(onFocus: () => void): this {
        this.onFocus = onFocus;
        return this;
    }

    /**
     * 设置结束引导回调.
     * @param {(completed: boolean) => void} onFade 是否完成.
     * @return {this}
     */
    setOnFade(onFade: (completed: boolean) => void): this {
        this.onFade = onFade;
        return this;
    }
}