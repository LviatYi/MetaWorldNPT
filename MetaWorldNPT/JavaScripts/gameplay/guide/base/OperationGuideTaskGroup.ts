import OperationGuideTask from "./OperationGuideTask";
import {Predicate} from "../../../util/GToolkit";

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

export default class OperationGuideTaskGroup extends OperationGuideTask {
    public type: "Group" = "Group";

    public readonly stepId: number;

    /**
     * 任务组可选性.
     * @type {boolean}
     */
    public readonly optionalType: TaskOptionalTypes;

    /**
     * 任务列表.
     * @type {OperationGuideTask[]}
     */
    public readonly list: OperationGuideTask[] = [];

    /**
     * 根组开始判定.
     * @desc 当定义后 该组被视为「根组」.
     * @desc 当根组开始判定为真时 该组引导将被自动激活.
     * @type {Predicate}
     */
    public startPredicate: Predicate;

    constructor(stepId: number,
                optionalType = TaskOptionalTypes.Sequence,
                startPredicate: Predicate = undefined) {
        super();
        this.stepId = stepId;
        this.optionalType = optionalType;
        this.startPredicate = startPredicate;
    }
}