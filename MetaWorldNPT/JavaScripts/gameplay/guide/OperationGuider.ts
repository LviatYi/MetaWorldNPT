import UIOperationGuideController from "./ui/UIOperationGuideController";
import UIOperationGuideTask from "./ui/UIOperationGuideTask";
import Gtk, {Delegate, Singleton} from "../../util/GToolkit";
import OperationGuideTaskGroup, {TaskOptionalTypes} from "./base/OperationGuideTaskGroup";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import OperationGuideTask from "./base/OperationGuideTask";
import SceneOperationGuideController from "./scene/SceneOperationGuideController";
import SceneOperationGuideTask from "./scene/SceneOperationGuideTask";
import GameObject = mw.GameObject;
import SimpleDelegate = Delegate.SimpleDelegate;

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
 * @version 31.0.0
 */
export default class OperationGuider extends Singleton<OperationGuider>() {
//#region Constant
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Controller
    public readonly uiController = new UIOperationGuideController();

    public readonly sceneController = new SceneOperationGuideController();

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
    private _indexer: Map<number, number> = new Map();

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
        this.onComplete.invoke(stepId);
        const groupIndex = this._indexer.get(stepId);
        if (groupIndex === null) return;

        const g = this._operationGuideTaskGroups[groupIndex];
        switch (g.optionalType) {
            case TaskOptionalTypes.Sequence:
                if (g.list
                    .map(item => item.stepId)
                    .every((stepId) => this._taskDoneMap.get(stepId)))
                    this.markComplete(g.stepId);
                else this.requestNext(g.stepId);
                break;
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

        const tasks = this.getNext(g);
        if (Gtk.isNullOrEmpty(tasks)) {
            Log4Ts.error(OperationGuider, `tasks is empty. stepId: ${stepId}`);
            return;
        }

        if (g.optionalType !== TaskOptionalTypes.Sequence && this.isFixedTasks(tasks)) {
            Log4Ts.error(OperationGuider, `task group whose is not Sequence has fixed tasks. stepId: ${stepId}`);
            return;
        }

        const nextElement = tasks[0];
        switch (g.optionalType) {
            case TaskOptionalTypes.Sequence:
                switch (nextElement.type) {
                    case "Group":
                        this.requestNext(nextElement.stepId);
                        break;
                    case "Ui":
                        this.runUiGuideTask(nextElement as UIOperationGuideTask);
                        break;
                    case "Scene":
                        this.runSceneGuideTask([nextElement as unknown as SceneOperationGuideTask], undefined);
                        break;
                }
                break;
            case TaskOptionalTypes.Disorder:
            case TaskOptionalTypes.Optional:
                switch (nextElement.type) {
                    case "Group":
                        for (const t of tasks) this.requestNext(t.stepId);
                        break;
                    case "Scene":
                        this.runSceneGuideTask(tasks as unknown as SceneOperationGuideTask[], g.optionalType);
                        break;
                    case "Ui":
                        this.runUiGuideTask(nextElement as UIOperationGuideTask);
                        Log4Ts.warn(OperationGuider, `ui task is only supported in Sequence. stepId: ${stepId}`);
                        break;
                }
                break;
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Data
    /**
     * 获取已完成步骤.
     * @return {number[]}
     */
    public getDoneStepIds(): number[] {
        return Array
            .from(this._taskDoneMap.entries())
            .filter(item => item[1])
            .map(item => item[0]);
    }

    /**
     * 读取已完成步骤.
     * @param {number[]} data
     */
    public setDoneStepIds(data: number[]) {
        data.forEach(item => this._taskDoneMap.set(item, true));
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config
    /**
     * 添加任务组.
     * @param {number} stepId
     * @param {TaskOptionalTypes} optionalType
     * @return {this}
     */
    public addTaskGroup(stepId: number, optionalType: TaskOptionalTypes = TaskOptionalTypes.Sequence): this {
        if (!this.checkStepNotExist(stepId)) return this;

        const group = new OperationGuideTaskGroup(stepId, optionalType);

        this._operationGuideTaskGroups.push(group);
        this._taskDoneMap.set(stepId, false);

        return this;
    }

    /**
     * 向任务组添加任务.
     * @param {number} groupStepId
     * @param {OperationGuideTask} task
     * @return {this}
     */
    public insertTaskToGroup(groupStepId: number, task: OperationGuideTask): this {
        if (!this.checkStepNotExist(task.stepId)) return this;
        if (!this.checkStepExist(groupStepId)) return this;

        const index = this._operationGuideTaskGroups.findIndex(item => item.stepId === groupStepId);
        const group = this._operationGuideTaskGroups[index];
        group.list.push(task);
        this._taskDoneMap.set(task.stepId, false);
        this._indexer.set(task.stepId, this._operationGuideTaskGroups.indexOf(group));

        return this;
    }

    /**
     * 向任务组添加任务组.
     * @param {number} groupStepId
     * @param {number} targetGroupStepId
     * @return {this}
     */
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

//#region Event
    public onComplete: SimpleDelegate<number> = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private runUiGuideTask(task: UIOperationGuideTask) {
        if (!this.uiController.focusOn(
            task.widget,
            task.option,
            task.onInnerClick,
            task.onBackClick,
            true,
        )) return;
        try {
            task.onFocus && task.onFocus();
        } catch (e) {
            Log4Ts.error(OperationGuider, `error occurs in task onFocus. ${e}`);
        }
        this.uiController.onFade.clear();
        this.uiController.onFade.add(() => {
            const result = task.donePredicate ? true : task.donePredicate();
            if (result) this.markComplete(task.stepId);
            try {
                task.onFade && task.onFade(result);
            } catch (e) {
                Log4Ts.error(OperationGuider, `error occurs in task onFade. ${e}`);
            }
        });
    }

    private runSceneGuideTask(tasks: SceneOperationGuideTask[],
                              type: TaskOptionalTypes.Disorder | TaskOptionalTypes.Optional = undefined) {
        const targets: Array<{
            onFade: (completed: boolean) => void;
            onFocus: () => void;
            predicate: () => boolean;
            stepId: number;
            target: GameObject;
            triggerGuid: string
        }> = tasks
            .map(t => {
                const target = GameObject.findGameObjectById(t.targetGuid);
                return {
                    stepId: t.stepId,
                    target: target,
                    triggerGuid: t.option.triggerGuid,
                    predicate: t.option.predicate,
                    onFocus: t.onFocus,
                    onFade: t.onFade,
                };
            })
            .filter(item => !Gtk.isNullOrUndefined(item.target));
        const mapper: Map<string, {
            onFade: (completed: boolean) => void;
            onFocus: () => void;
            predicate: () => boolean;
            stepId: number;
            target: GameObject;
            triggerGuid: string
        }> = targets
            .map(t => ({guid: t.target.gameObjectId, task: t}))
            .reduce((previousValue, currentValue) => {
                return previousValue.set(currentValue.guid, currentValue.task);
            }, new Map());

        for (const target of targets) {
            this.sceneController.focusOn(target);
            try {
                target.onFocus && target.onFocus();
            } catch (e) {
                Log4Ts.error(OperationGuider, `error occurs in task onFocus. ${e}`);
            }
        }

        this.sceneController.onFade.clear();
        this.sceneController.onFade.add(result => {
            if (result.force) {
                try {
                    const task = mapper.get(result.guid);
                    task.onFade && task.onFade(false);
                } catch (e) {
                    Log4Ts.error(OperationGuider, `error occurs in task onFade. ${e}`);
                }
                return;
            }
            if (type === TaskOptionalTypes.Optional) {
                targets
                    .forEach(item => {
                        if (item.triggerGuid === result.guid) {
                            try {
                                const task = mapper.get(result.guid);
                                task.onFade && task.onFade(true);
                            } catch (e) {
                                Log4Ts.error(OperationGuider, `error occurs in task onFade. ${e}`);
                            }
                        } else {
                            this.sceneController.fade(item.target.gameObjectId, true);
                        }
                    });
            }
            this.markComplete(mapper.get(result.guid).stepId);
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
     * @return {OperationGuideTask[] | null}
     *      - null: 无后续任务.
     *      - 当 optionType 为 Sequence 时 返回下一个任务作为数组.
     *      - 否则返回所有未完成任务.
     * @private
     */
    private getNext(group: OperationGuideTaskGroup): OperationGuideTask[] | null {
        if (this._taskDoneMap.get(group.stepId)) return null;

        switch (group.optionalType) {
            case TaskOptionalTypes.Sequence:
                return [group.list.find(item => !this._taskDoneMap.get(item.stepId))];
            case TaskOptionalTypes.Disorder:
            case TaskOptionalTypes.Optional:
                return group.list.filter(item => !this._taskDoneMap.get(item.stepId));
        }
    }

    private isFixedTasks(tasks: OperationGuideTask[]) {
        if (Gtk.isNullOrEmpty(tasks)) return false;
        return !tasks.every(t => t.type === tasks[0].type);
    }
}