import OperationGuideTask from "../base/OperationGuideTask";
import {ISceneOperationGuideControllerOption} from "./SceneOperationGuideController";

export default class SceneOperationGuideTask extends OperationGuideTask {
    public stepId: number;

    public type: "Scene" = "Scene";

    public targetGuid: string;

    /**
     * 选项.
     * @type {ISceneOperationGuideControllerOption}
     */
    public option: ISceneOperationGuideControllerOption = {};

    /**
     * 场景引导任务.
     * @param {number} stepId 步骤.
     *      一种 Id. 具有唯一性 但不表达顺序性.
     * @param {string} targetGuid 引导目标 Guid.
     * @param {() => boolean} donePredicate 完成判定.
     *      当定义后 即便引导结束 仅当该判定为真时才标记完成.
     */
    constructor(stepId: number,
                targetGuid: string,
                donePredicate: () => boolean = undefined) {
        super();
        this.stepId = stepId;
        this.targetGuid = targetGuid;
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

    /**
     * 超时时间. ms
     * @desc 超时后自动结束根组引导.
     * @param {number} timeout
     *      - undefined 不设置超时.
     * @return {this}
     */
    public setTimeout(timeout: number): this {
        this.option.timeout = timeout;
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}