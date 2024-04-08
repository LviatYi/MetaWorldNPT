import UIOperationGuideController from "./ui/UIOperationGuideController";
import UIOperationGuideTask from "./ui/UIOperationGuideTask";
import {Singleton} from "../../util/GToolkit";
import OperationGuideTaskGroup, {TaskOptionalTypes} from "./base/OperationGuideTaskGroup";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import IOperationGuideTask from "./base/IOperationGuideTask";

/**
 * Operation Guide Manager.
 * 操作引导管理器.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 31.0.0F
 */
class OperationGuider extends Singleton<OperationGuider>() {
//#region Constant
//     public static readonly OPERATION_GUIDE_SCENE_TAG = "OperationGuide";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Controller
    public readonly uiController = new UIOperationGuideController();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member
    /**
     *
     * @type {OperationGuideTaskGroup[]}
     * @private
     */
    private _operationGuideTaskGroups: OperationGuideTaskGroup[] = [];

    /**
     *
     * @type {Map<number, boolean>} step -> done
     * @private
     */
    private _taskDoneMap: Map<number, boolean> = new Map();

    /**
     *
     * @type {Map<number, number>} step -> index of group in {@link _operationGuideTaskGroups}
     * @private
     */
    private _indexer: Map<number, number>;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Controller
    /**
     * 指定 stepId 的任务是否完成.
     * @param {number} stepId
     * @return {boolean}
     */
    public isComplete(stepId: number): boolean {
        if (!this.checkStepExist(stepId)) return false;
        return this._taskDoneMap.get(stepId);
    }

    /**
     * 标记完成.
     * @param {number} stepId
     * @private
     */
    public markComplete(stepId: number) {
        if (!this.checkStepExist(stepId)) return;
        if (this._taskDoneMap.get(stepId)) return;

        this._taskDoneMap.set(stepId, true);
        const groupIndex = this._indexer.get(stepId);
        if (groupIndex === null) return;

        const g = this._operationGuideTaskGroups[groupIndex];
        switch (g.optionalType) {
            case TaskOptionalTypes.Sequence:
            case TaskOptionalTypes.Disorder:
                if (g.list
                    .map(item => item.stepId)
                    .every((stepId) => this._taskDoneMap.get(stepId)))
                    this.markComplete(g.stepId);
                break;
            case TaskOptionalTypes.Optional:
                if (g.list
                    .map(item => item.stepId)
                    .some(stepId => this._taskDoneMap.get(stepId)))
                    this.markComplete(g.stepId);
                break;
        }
    }

    /**
     * 申请下一次引导.
     * @param {number} stepId 引导组 Id.
     */
    public requestNext(stepId: number) {
        if (!this.checkStepExist(stepId)) return;
        const g = this._operationGuideTaskGroups.find(item => item.stepId === stepId);
        if (!g) {
            Log4Ts.warn(OperationGuider, `step requested is not a group. stepId: ${stepId}`);
            return;
        }
        for (let nextElement of this.getNext(g)) {
            switch (nextElement.type) {
                case "Group":
                    this.requestNext(nextElement.stepId);
                    break;
                case "Ui":
                    this.runUiGuideTask(nextElement as UIOperationGuideTask);
                    break;
                case "Scene":
                    Log4Ts.log(OperationGuider, `not impl.`);
                    break;
            }
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Builder
    public addTaskGroup(stepId: number): this {
        if (!this.checkStepNotExist(stepId)) return this;

        const group = new OperationGuideTaskGroup(stepId);

        this._operationGuideTaskGroups.push(group);
        this._taskDoneMap.set(stepId, false);

        return this;
    }

    public insertUiTaskToGroup(groupStepId: number, task: UIOperationGuideTask): this {
        if (!this.checkStepNotExist(task.stepId)) return this;
        if (!this.checkStepExist(groupStepId)) return this;

        const index = this._operationGuideTaskGroups.findIndex(item => item.stepId === groupStepId);
        const group = this._operationGuideTaskGroups[index];
        group.list.push(task);
        this._taskDoneMap.set(task.stepId, false);
        this._indexer.set(task.stepId, this._operationGuideTaskGroups.indexOf(group));

        return this;
    }

    public insertGroupToGroup(groupStepId: number, targetGroupStepId: number): this {
        if (!this.checkStepExist(groupStepId) || !this.checkStepExist(groupStepId)) return this;

        const group = this._operationGuideTaskGroups.find(item => item.stepId === groupStepId);
        const targetIndex = this._operationGuideTaskGroups.findIndex(item => item.stepId === targetGroupStepId);
        const target = this._operationGuideTaskGroups[targetIndex];
        target.list.push(group);
        this._indexer.set(groupStepId, targetIndex);

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private runUiGuideTask(task: UIOperationGuideTask) {
        this.uiController.focusOn(
            task.widget,
            task.option,
            task.onInnerClick,
            task.onBackClick,
            true,
        );
        this.uiController.onFade.clear();
        this.uiController.onFade.add(() => {
            if (task.donePredicate ? true : task.donePredicate()) this.markComplete(task.stepId);
        });
    }

    private checkStepExist(id: number): boolean {
        if (this._taskDoneMap.has(id)) return true;
        Log4Ts.log(OperationGuider, `step not exist. id: ${id}`);
        return false;
    }

    private checkStepNotExist(id: number): boolean {
        if (!this._taskDoneMap.has(id)) return true;
        Log4Ts.log(OperationGuider, `step already exist. id: ${id}`);
        return false;
    }

    /**
     * 获取后续未完成任务.
     * @param group 任务组
     * @return {IOperationGuideTask[] | null}
     *      - null: 无后续任务.
     *      - 当 optionType 为 Sequence 时 返回下一个任务作为数组.
     *      - 否则返回所有未完成任务.
     * @private
     */
    private getNext(group: OperationGuideTaskGroup): IOperationGuideTask[] | null {
        if (this._taskDoneMap.get(group.stepId)) return null;

        switch (group.optionalType) {
            case TaskOptionalTypes.Sequence:
                return [group.list.find(item => this._taskDoneMap.get(item.stepId))];
            case TaskOptionalTypes.Disorder:
            case TaskOptionalTypes.Optional:
                return group.list.filter(item => this._taskDoneMap.get(item.stepId));
        }
    }
}