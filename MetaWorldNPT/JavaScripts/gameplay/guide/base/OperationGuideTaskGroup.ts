import IOperationGuideTask from "./IOperationGuideTask";

/**
 * 任务组可选性.
 */
export enum TaskOptionalTypes {
    /**
     * 󰒿顺序的.
     * @desc 1 √ --> 2 √ --> 3 √
     * @type {TaskOptionalTypes.Sequence}
     */
    Sequence,
    /**
     * 无序的.
     * @desc          /  2 √  \
     * @desc 1 √ --> <         > --> 4 √
     * @desc          \  3 √  /
     * @type {TaskOptionalTypes.Disorder}
     */
    Disorder,
    /**
     * 󰄲可选的.
     * @desc          /  2 √  \
     * @desc 1 √ --> <         > --> 3 √
     * @desc          \  2 ?  /
     * @type {TaskOptionalTypes.Optional}
     */
    Optional,
}

export default class OperationGuideTaskGroup implements IOperationGuideTask {
    public type: "Group" = "Group";

    public readonly stepId: number;

    /**
     * 任务组可选性.
     * @type {boolean}
     */
    public readonly optionalType: TaskOptionalTypes;

    /**
     * 任务列表.
     * @type {IOperationGuideTask[]}
     */
    public readonly list: IOperationGuideTask[] = [];

    constructor(stepId: number, optionalType = TaskOptionalTypes.Sequence) {
        this.stepId = stepId;
        this.optionalType = optionalType;
    }
}