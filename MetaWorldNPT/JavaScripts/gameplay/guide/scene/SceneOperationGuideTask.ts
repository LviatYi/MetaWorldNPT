import IOperationGuideTask from "../base/IOperationGuideTask";
import {ISceneOperationGuideControllerOption} from "./SceneOperationGuideController";

export default class SceneOperationGuideTask implements IOperationGuideTask {
    public stepId: number;

    public type: "Scene" = "Scene";

    public targetGuid: string;

    public option: ISceneOperationGuideControllerOption = {};

    constructor(stepId: number,
                targetGuid: string,
                donePredicate: () => boolean = undefined) {
        this.stepId = stepId;
        this.targetGuid = targetGuid;
        if (donePredicate) this.option.predicate = donePredicate;
    }

//#region Option Builder

    /**
     * 设置引发引导结束的触发器.
     * @desc 内部将自行绑定触碰事件.
     * @param {string} triggerGuid
     */
    public setTriggerGuid(triggerGuid: string): this {
        this.option.triggerGuid = triggerGuid;
        return this;
    }

    /**
     * 设置引导结束谓词.
     * @param {() => boolean} predicate
     * @return {this}
     */
    public setPredicate(predicate: () => boolean): this {
        this.option.predicate = predicate;
        return this;
    }

    /**
     * 设置是否使用导航进行引导.
     * @desc 需要寻路区支持.
     * @param {boolean} use
     * @return {this}
     */
    public setNavigation(use: boolean): this {
        this.option.navigation = use;
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}