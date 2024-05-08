import OperationGuideTask, { OperationGuideType } from "../base/OperationGuideTask";
import { ICutsceneOperationGuideControllerOption } from "./CutsceneOperationGuideController";
import { Predicate } from "../../../util/GToolkit";

export default class CutsceneOperationGuideTask extends OperationGuideTask {
    public stepId: number;

    public type: OperationGuideType = "CutScene";

    public option: ICutsceneOperationGuideControllerOption;

    constructor(stepId: number, predicate: Predicate, testInterval: number = 0.5e3) {
        super();
        this.stepId = stepId;
        this.option = {
            predicate,
            testInterval,
        };
    }
}
