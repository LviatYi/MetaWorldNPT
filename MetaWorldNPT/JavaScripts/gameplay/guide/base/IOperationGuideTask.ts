export type OperationGuideType = "Group" | "Ui" | "Scene";

export default interface IOperationGuideTask {
    /**
     * 步骤.
     * @desc 一种 Id. 具有唯一性 但不表达顺序性.
     */
    stepId: number;

    /**
     * 类型.
     */
    type: OperationGuideType;
}