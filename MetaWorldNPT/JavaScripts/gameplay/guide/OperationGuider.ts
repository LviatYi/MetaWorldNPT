import UIOperationGuideController, {uiValid} from "./ui/UIOperationGuideController";
import UIOperationGuideTask from "./ui/UIOperationGuideTask";
import Gtk, {Delegate, Predicate, Singleton} from "../../util/GToolkit";
import OperationGuideTaskGroup, {TaskOptionalTypes} from "./base/OperationGuideTaskGroup";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import OperationGuideTask from "./base/OperationGuideTask";
import SceneOperationGuideController from "./scene/SceneOperationGuideController";
import SceneOperationGuideTask from "./scene/SceneOperationGuideTask";
import CutsceneOperationGuideTask from "./cutscene/CutsceneOperationGuideTask";
import CutsceneOperationGuideController from "./cutscene/CutsceneOperationGuideController";
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
 * @version 31.12.4
 */
export default class OperationGuider extends Singleton<OperationGuider>() {
//#region Member
    public readonly uiController = new UIOperationGuideController();

    public uiPending: boolean = false;

    public readonly sceneController = new SceneOperationGuideController();

    public readonly cutsceneController = new CutsceneOperationGuideController();


    public get isFocusing() {
        return this.uiController.isFocusing
            || this.uiPending
            || this.sceneController.isFocusing
            || this.cutsceneController.isFocusing;
    }

    private _autoStop: boolean = true;

    /**
     * 是否 自动终止根引导组检测.
     * @return {boolean}
     */
    public get autoStop(): boolean {
        return this._autoStop;
    }

    public set autoStop(value: boolean) {
        this._autoStop = value;
    }

    /**
     * 是否 根引导组检测 正运行中.
     * @return {boolean}
     */
    public autoTestWorking(): boolean {
        return !!this._testTimeId;
    }

    private _testInterval: number;

    private _testTimeId: number;

    public get testInterval(): number {
        return this._testInterval;
    }

    /**
     * 根引导组检测 间隔. ms
     * @param {number} value
     */
    public set testInterval(value: number) {
        if (this._testInterval === value) return;

        if (value <= 0) this._testInterval = null;
        else this._testInterval = value;

        this.refreshTestHandler(true);
    }

    /**
     * 默认场景任务超时时间. ms
     *      - undefined 不设置超时.
     * @type {number}
     * @private
     */
    private _sceneTaskTimeout: number = undefined;

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
     * 存活检查计时器.
     * @type {Map<number, number>} step -> timerId
     * @private
     */
    private _aliveTimerMap: Map<number, number> = new Map();

    /**
     *
     * @type {Map<number, number>} step -> index of group in {@link _operationGuideTaskGroups}
     * @private
     */
    private _indexer: Map<number, number> = new Map();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Controller

    /**
     * 测试根引导组.
     * @return {boolean} 是否全部完成.
     */
    public testGuideGroup(): boolean {
        let allDone = true;
        for (const group of this._operationGuideTaskGroups) {
            if (group.startPredicate && !this.isComplete(group.stepId)) {
                allDone = false;
                try {
                    if (group.startPredicate()) {
                        this.requestNext(group.stepId);
                        break;
                    }
                } catch (e) {
                    Log4Ts.error(OperationGuider, `startPredicate error. stepId: ${group.stepId}`);
                }
            }
        }
        return allDone;
    }

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
     * @param {boolean} requestNext 自动请求下一步.
     * @private
     */
    public markComplete(stepId: number, requestNext: boolean = true) {
        if (!this.checkStepExist(stepId)) return;
        if (this._taskDoneMap.get(stepId)) return;

        this._taskDoneMap.set(stepId, true);
        this.onComplete.invoke(stepId);

        if (!requestNext) return;

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
     * 感染性标记完成.
     * @desc 将向上传播完成状态.
     * @param {number} stepId
     */
    public infectiousMarkComplete(stepId: number) {

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

        this.trySetTaskAliveHandler(g);

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
                    case "Scene":
                        this.runSceneGuideTask([nextElement as unknown as SceneOperationGuideTask], undefined);
                        break;
                    case "Ui":
                        this.runUiGuideTask(nextElement as UIOperationGuideTask);
                        break;
                    case "CutScene":
                        this.runCutSceneGuideTask(nextElement as CutsceneOperationGuideTask);
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
                    case "CutScene":
                        this.runCutSceneGuideTask(nextElement as CutsceneOperationGuideTask);
                        Log4Ts.warn(OperationGuider, `cut scene task is only supported in Sequence. stepId: ${stepId}`);
                        break;
                }
                break;
        }
    }

    /**
     * 重置引导.
     * @param {number} stepId
     * @param {boolean} isDownward @profession 是否仅向下传播. 请勿轻易使用.
     */
    public resetComplete(stepId: number, isDownward: boolean = false) {
        if (!this.checkStepExist(stepId)) return;
        this._taskDoneMap.set(stepId, false);


        const g = this._operationGuideTaskGroups.find(item => item.stepId === stepId);
        if (g) for (const t of g.list) {
            this.resetComplete(t.stepId, true);
        }

        if (!isDownward) this.upwardPropagateCompleted(stepId, false);
    }

    /**
     * 向上传播 引导状态.
     * @param {number} stepId
     * @param {boolean} status 完成状态.
     * @private
     */
    private upwardPropagateCompleted(stepId: number, status: boolean) {
        for (const g of this._operationGuideTaskGroups) {
            if (this.isComplete(g.stepId) === status) continue;
            if (g.list.some(item => item.stepId === stepId)) {
                this._taskDoneMap.set(g.stepId, false);
                this.upwardPropagateCompleted(g.stepId, status);
                return;
            }
        }
    }

    /**
     * 立即执行一次引导测试.
     */
    public doTestRootGroup() {
        this.testGuideGroup();
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
     * 设置 根引导组检测 间隔. ms
     * @desc 为 0 时关闭自动测试.
     * @param {number} testInterval
     * @return {this}
     */
    public setTestInterval(testInterval: number): this {
        this.testInterval = testInterval;
        return this;
    }

    /**
     * 设置 是否自动终止 根引导组检测.
     * @param {boolean} autoStop
     * @return {this}
     */
    public setAutoStopTest(autoStop: boolean): this {
        this.autoStop = autoStop;
        return this;
    }

    /**
     * 设置引导线组件 预制体 guid.
     * @param {string} guid
     * @return {this}
     */
    public setGuidelinePrefabGuid(guid: string): this {
        if (Gtk.isNullOrEmpty(guid) || this.sceneController) return this;
        this.sceneController.guidelinePrefabGuid = guid;
        return this;
    }

    /**
     * Guideline 预制体生成距离间隔.
     * @param {number} dist
     * @return {this}
     */
    public setGuidelineInterval(dist: number): this {
        if (dist <= 0) return this;
        this.sceneController.interval = Math.max(dist, this.sceneController.minInterval);
        return this;
    }

    /**
     * Guideline 预制体生成最小距离间隔.
     * @param {number} dist
     * @return {this}
     */
    public setMinGuidelineInterval(dist: number): this {
        if (dist <= 0) return this;
        this.sceneController.minInterval = Math.max(dist, this.sceneController.interval);
        return this;
    }

    /**
     * 设置默认场景任务超时时间. ms
     * @param {number} timeout
     *      - undefined 不设置超时.
     * @return {this}
     */
    public setDefaultSceneTaskTimeout(timeout: number): this {
        this._sceneTaskTimeout = timeout;
        return this;
    }

    /**
     * 添加任务组.
     * @param {number} stepId
     * @param {TaskOptionalTypes} optionalType
     * @param {Predicate} startPredicate 根组开始判定.
     *      当定义后 该组被视为「根组」.
     *      当根组开始判定为真时 该组引导将被自动激活.
     * @return {this}
     */
    public addTaskGroup(stepId: number,
                        optionalType: TaskOptionalTypes = TaskOptionalTypes.Sequence,
                        startPredicate: Predicate = undefined
    ): this {
        if (!this.checkStepNotExist(stepId)) return this;

        const group = new OperationGuideTaskGroup(
            stepId,
            optionalType,
            startPredicate);

        this._operationGuideTaskGroups.push(group);
        this._taskDoneMap.set(stepId, false);

        this.refreshTestHandler(false);
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
        if (index === -1) {
            Log4Ts.log(OperationGuider, `try insert task ${task.stepId} to group ${groupStepId} failed. group not found.`);
            return this;
        }

        const group = this._operationGuideTaskGroups[index];
        group.list.push(task);
        this._taskDoneMap.set(task.stepId, false);
        this._indexer.set(task.stepId, this._operationGuideTaskGroups.indexOf(group));

        this.refreshTestHandler(false);
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
        if (!group) {
            Log4Ts.log(OperationGuider, `try insert group ${groupStepId} to group failed. group not found.`);
            return this;
        }
        const targetIndex = this._operationGuideTaskGroups.findIndex(item => item.stepId === targetGroupStepId);
        if (targetIndex === -1) {
            Log4Ts.log(OperationGuider, `try insert group to group ${targetGroupStepId} failed. group not found.`);
            return this;
        }
        const target = this._operationGuideTaskGroups[targetIndex];
        target.list.push(group);
        this._indexer.set(groupStepId, targetIndex);

        this.refreshTestHandler(false);
        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event
    public onComplete: SimpleDelegate<number> = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private runUiGuideTask(task: UIOperationGuideTask) {
        this.uiPending = true;

        let widget: mw.Widget;
        Gtk.doWhenTrue(
            () => {
                widget = task.widget;
                return uiValid(widget);
            },
            () => {
                this.uiPending = false;
                if (!this.uiController.focusOn(
                    task.widget,
                    task.option,
                    task.onInnerClick,
                    task.onBackClick,
                    true,
                )) return;
                this.trySetTaskAliveHandler(task);
                try {
                    task.onFocus && task.onFocus();
                } catch (e) {
                    Log4Ts.error(OperationGuider, `error occurs in task onFocus. ${e}`);
                }
                this.uiController.onFade.clear();
                this.uiController.onFade.add(() => {
                    this.tryClearTaskAliveHandler(task.stepId);
                    const result = task.donePredicate ? true : task.donePredicate();
                    if (result) this.markComplete(task.stepId);
                    try {
                        task.onFade && task.onFade(result);
                    } catch (e) {
                        Log4Ts.error(OperationGuider, `error occurs in task onFade. ${e}`);
                    }
                });
            },
            60,
            true,
            10e3,
        );
    }

    private runSceneGuideTask(tasks: SceneOperationGuideTask[],
                              type: TaskOptionalTypes.Disorder | TaskOptionalTypes.Optional = undefined) {
        type Param = {
            onFade: (completed: boolean) => void;
            onFocus: () => void;
            onAlive: (counter: number) => void;
            aliveCheckInterval: number;
            predicate: () => boolean;
            stepId: number;
            target: GameObject;
            triggerGuid: string;
            timeout: number;
            timer: number
        }
        const targets: Array<Param> = tasks
            .map(t => {
                const target = GameObject.findGameObjectById(t.targetGuid);
                return {
                    stepId: t.stepId,
                    target: target,
                    triggerGuid: t.option.triggerGuid,
                    predicate: t.option.predicate,
                    onFocus: t.onFocus,
                    onFade: t.onFade,
                    onAlive: t.onAlive,
                    aliveCheckInterval: t.aliveCheckInterval,
                    timeout: t.option.timeout,
                    timer: undefined,
                };
            })
            .filter(item => !Gtk.isNullOrUndefined(item.target));
        const mapper: Map<string, Param> = targets
            .map(t => ({guid: t.target.gameObjectId, task: t}))
            .reduce((previousValue, currentValue) => {
                return previousValue.set(currentValue.guid, currentValue.task);
            }, new Map());

        for (const target of targets) {
            this.sceneController.focusOn(target);
            this.trySetTaskAliveHandler(target);
            if (target.timeout || this._sceneTaskTimeout) target.timer = mw.setTimeout(() => {
                target.timer = undefined;
                this.markComplete(target.stepId, false);
                this.sceneController.fade(target.target.gameObjectId, true);
                this.upwardPropagateCompleted(target.stepId, true);
            }, target.timeout ?? this._sceneTaskTimeout);
            try {
                target.onFocus && target.onFocus();
            } catch (e) {
                Log4Ts.error(OperationGuider, `error occurs in task onFocus. ${e}`);
            }
        }

        this.sceneController.onFade.clear();
        this.sceneController.onFade.add(result => {
            const task = mapper.get(result.guid);
            this.tryClearTaskAliveHandler(task.stepId);
            if (result.force) {
                try {
                    task.timer && mw.clearTimeout(task.timer);
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
            } else {
                try {
                    const target = mapper.get(result.guid);
                    target.onFade && target.onFade(true);
                } catch (e) {
                    Log4Ts.error(OperationGuider, `error occurs in task onFade. ${e}`);
                }
            }
            this.markComplete(mapper.get(result.guid).stepId);
        });
    }

    private runCutSceneGuideTask(task: CutsceneOperationGuideTask) {
        this.cutsceneController.focusOn(task.option);
        this.trySetTaskAliveHandler(task);
        try {
            task.onFocus && task.onFocus();
        } catch (e) {
            Log4Ts.error(OperationGuider, `error occurs in task onFocus. ${e}`);
        }
        this.cutsceneController.onFade.clear();
        this.cutsceneController.onFade.add((force) => {
            this.tryClearTaskAliveHandler(task.stepId);
            if (!force) this.markComplete(task.stepId);
            try {
                task.onFade && task.onFade(force);
            } catch (e) {
                Log4Ts.error(OperationGuider, `error occurs in task onFade. ${e}`);
            }
        });
    }

    private checkStepExist(id: number): boolean {
        if (this._taskDoneMap.has(id)) return true;
        Log4Ts.log(OperationGuider, `step not exist. id: ${id}`);
        return false;
    }

    private checkStepNotExist(id: number): boolean {
        if (!this._taskDoneMap.has(id)) return true;
        Log4Ts.log(OperationGuider, `step already exist. id: ${id}.`);
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

    private testHandler = () => {
        if (this.isFocusing) return;
        const result = this.testGuideGroup();
        if (this._autoStop && result) {
            mw.clearInterval(this._testTimeId);
            this._testTimeId = null;
        }
    };

    private refreshTestHandler(force: boolean) {
        if (this._testTimeId) {
            if (!force) return;
            this._testTimeId = null;
            mw.clearInterval(this._testTimeId);
        }

        if (this._testInterval === null) return;
        this._testTimeId = mw.setInterval(
            this.testHandler,
            this._testInterval);
    }

    private trySetTaskAliveHandler(task: {
        stepId: number,
        onAlive?: (counter: number) => void,
        aliveCheckInterval?: number
    }) {
        if (!task.onAlive) return;

        let timer: number;
        let alive: number = 0;
        const checkAlive = () => {
            try {
                task.onAlive(++alive);
            } catch (e) {
                Log4Ts.error(OperationGuider, `error occurs in onAlive. stepId: ${task.stepId}`);
                this._aliveTimerMap.delete(task.stepId);
                mw.clearInterval(timer);
            }
        };
        timer = mw.setInterval(checkAlive, task.aliveCheckInterval);
        checkAlive();
        this._aliveTimerMap.set(task.stepId, timer);
    }

    private tryClearTaskAliveHandler(stepId: number) {
        const timer = this._aliveTimerMap.get(stepId);
        if (!timer) return;
        mw.clearInterval(timer);
        this._aliveTimerMap.delete(stepId);
    }
}