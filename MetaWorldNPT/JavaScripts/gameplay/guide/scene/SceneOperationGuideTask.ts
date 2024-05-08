import OperationGuideTask from "../base/OperationGuideTask";
import { ISceneOperationGuideControllerOption, ValidGuidelineStyles } from "./SceneOperationGuideController";
import Log4Ts from "../../../depend/log4ts/Log4Ts";
import Gtk from "../../../util/GToolkit";

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
     */
    constructor(stepId: number,
                targetGuid: string) {
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
     * short for setTriggerGuid
     */
    public sTrg(triggerGuid: string): this {
        return this.setTriggerGuid(triggerGuid);
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
     * short for setPredicate
     */
    public sPred(predicate: () => boolean): this {
        return this.setPredicate(predicate);
    }

    /**
     * 设置使用直线引导.
     * @return {this}
     */
    public setDirect(): this {
        this.option.style = ValidGuidelineStyles.Direct;
        return this;
    }

    /**
     * short for setDirect
     */
    public sDrt(): this {
        return this.setDirect();
    }

    /**
     * 设置使用导航进行引导.
     * @desc 需要寻路区支持.
     * @return {this}
     */
    public setNavigate(): this {
        this.option.style = ValidGuidelineStyles.Navigation;
        return this;
    }

    /**
     * short for setNavigate
     */
    public sNav(): this {
        return this.setNavigate();
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

    /**
     * short for setTimeout
     */
    public sTout(timeout: number): this {
        return this.setTimeout(timeout);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

/**
 * 生成距离谓词.
 * @desc 距离谓词 用于判断玩家与目标之间的距离是否小于指定距离.
 * @param {number} dist
 * @param {GameObject} target
 * @return {() => boolean}
 */
export function GenerateDistancePredicate(target: GameObject | string, dist: number) {
    let obj = typeof target === "string" ? target = GameObject.findGameObjectById(target) : target;
    if (!obj) {
        Log4Ts.warn(SceneOperationGuideTask,
            `obj not found. guid: ${obj}`,
        );
        return (): boolean => true;
    }

    return (): boolean => {
        return Gtk.squaredEuclideanDistance(
            Player.localPlayer.character.worldTransform.position,
            obj.worldTransform.position) <= dist * dist;
    };
}