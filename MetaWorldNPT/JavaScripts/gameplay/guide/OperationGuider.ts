import UIOperationGuideController, { uiValid } from "./ui/UIOperationGuideController";
import UIOperationGuideTask from "./ui/UIOperationGuideTask";
import Gtk, { Delegate, Predicate, Singleton } from "../../util/GToolkit";
import OperationGuideTaskGroup, { TaskOptionalTypes } from "./base/OperationGuideTaskGroup";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import OperationGuideTask from "./base/OperationGuideTask";
import SceneOperationGuideController from "./scene/SceneOperationGuideController";
import SceneOperationGuideTask from "./scene/SceneOperationGuideTask";
import CutsceneOperationGuideTask from "./cutscene/CutsceneOperationGuideTask";
import CutsceneOperationGuideController from "./cutscene/CutsceneOperationGuideController";
import { BrokenStatus } from "./base/BrokenStatus";
import GameObject = mw.GameObject;
import SimpleDelegate = Delegate.SimpleDelegate;

type StepTargetParam = { target: GameObject, task: SceneOperationGuideTask, timer?: number };

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
 * @version 31.18.2
 */
export default class OperationGuider extends Singleton<OperationGuider>() {
//#region Member
    public readonly uiController = new UIOperationGuideController();

    private _uiPending: boolean = false;

    public readonly sceneController = new SceneOperationGuideController();

    public readonly cutsceneController = new CutsceneOperationGuideController();

    public get isFocusing() {
        return this.uiController.isFocusing
            || this._uiPending
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
     * 立即执行一次引导测试.
     */
    public doTestRootGroup() {
        this.testGuideGroup();
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
     * 立即完成当前任务.
     */
    public finishCurrent() {
        if (!this.isFocusing) return;

        this.uiController.fade(true, false, true, BrokenStatus.ForceExit);
        this.sceneController.fade(undefined, false, true, BrokenStatus.ForceExit);
        this.cutsceneController.fade(false, true, BrokenStatus.ForceExit);
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
        if (Gtk.isNullOrUndefined(groupIndex)) return;

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
                this._taskDoneMap.set(g.stepId, status);
                this.upwardPropagateCompleted(g.stepId, status);
                return;
            }
        }
    }

    /**
     * 是否启用引导.
     * @type {boolean}
     */
    public useGuide(enable: boolean) {
        if (this.autoTestWorking() === enable) return;
        if (enable) {
            this.refreshTestHandler(true);
        } else {
            this.stopTestHandler();
        }
    }

    /**
     * 是否 是根引导组.
     */
    public isRootTaskGroup(stepId: number): boolean {
        return this._operationGuideTaskGroups
            .some(item => item.stepId === stepId && item.startPredicate);
    }

    /**
     * 获取 引导任务 所属的 根引导组.
     * @param {number} stepId
     * @return {number | undefined}
     *      - undefined: 不存在.
     */
    public getRootStepId(stepId: number): number | undefined {
        if (!this.checkStepExist(stepId)) return undefined;

        let r: number;
        let p = stepId;

        while (p !== undefined) {
            if (this.isRootTaskGroup(p)) return p;
            r = p;
            p = this.getParentStepId(p);
        }

        return undefined;
    }

    /**
     * 获取 引导任务 的 父引导组.
     * @param {number} stepId
     * @return {number | undefined}
     *      - undefined: 不存在.
     */
    public getParentStepId(stepId: number): number | undefined {
        if (!this.checkStepExist(stepId)) return undefined;

        return this.getParentStepIdHandler(stepId);
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
            .map(item => item[0])
            .sort();
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
     * short for setTestInterval
     * @param {number} testInterval
     * @return {this}
     */
    public sTstItv(testInterval: number): this {
        return this.setTestInterval(testInterval);
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
     * short for setAutoStopTest
     * @param {boolean} autoStop
     * @return {this}
     */
    public sASTst(autoStop: boolean): this {
        return this.setAutoStopTest(autoStop);
    }

    /**
     * 自定义聚焦时表现.
     * @param {(focusObj: mw.GameObject) => void} callback
     * @return {this}
     */
    public setCustomOnFocus(callback: (focusObj: mw.GameObject) => void): this {
        this.sceneController.customOnFocus = callback;
        return this;
    }

    /**
     * short for setCustomOnFocus
     * @param {(focusObj: mw.GameObject) => void} callback
     * @return {this}
     */
    public sCstF(callback: (focusObj: mw.GameObject) => void): this {
        return this.setCustomOnFocus(callback);
    }

    /**
     * 自定义刷新时表现.
     * @desc 由 {@link refreshInterval} 控制刷新频率.
     * @param {(refreshObj: mw.GameObject) => void} callback
     * @return {this}
     */
    public setCustomOnRefresh(callback: (refreshObj: mw.GameObject) => void): this {
        this.sceneController.customOnRefresh = callback;
        return this;
    }

    /**
     * short for setCustomOnRefresh
     * @param {(refreshObj: mw.GameObject) => void} callback
     * @return {this}
     */
    public sCstR(callback: (refreshObj: mw.GameObject) => void): this {
        return this.setCustomOnRefresh(callback);
    }

    /**
     * 自定义消失时表现.
     * @param {(fadeObj: mw.GameObject) => void} callback
     * @return {this}
     */
    public setCustomOnFade(callback: (fadeObj: mw.GameObject) => void): this {
        this.sceneController.customOnFade = callback;
        return this;
    }

    /**
     * short for setCustomOnFade
     * @param {(fadeObj: mw.GameObject) => void} callback
     * @return {this}
     */
    public sCstFd(callback: (fadeObj: mw.GameObject) => void): this {
        return this.setCustomOnFade(callback);
    }

    /**
     * 设置 场景引导 表现刷新间隔. ms
     * @param {number} refreshInterval
     * @return {this}
     */
    public setGuidelineRefreshInterval(refreshInterval: number): this {
        this.sceneController.refreshInterval = refreshInterval;
        return this;
    }

    /**
     * short for setGuidelineRefreshInterval
     * @param {number} refreshInterval
     * @return {this}
     */
    public sGlRItv(refreshInterval: number): this {
        return this.setGuidelineRefreshInterval(refreshInterval);
    }

    /**
     * 设置 引导线组件 预制体 guid.
     * @desc 当启用引导线时 此项是必需的.
     * @param {string} guid
     * @return {this}
     */
    public setGuidelinePrefabGuid(guid: string): this {
        if (Gtk.isNullOrEmpty(guid) || !this.sceneController) return this;
        this.sceneController.guidelineComponentOption.guid = guid;
        return this;
    }

    /**
     * short for setGuidelinePrefabGuid
     * @param {string} guid
     * @return {this}
     */
    public sGl(guid: string): this {
        return this.setGuidelinePrefabGuid(guid);
    }

    /**
     * 设置 引导线组件 生成距离间隔.
     * Default 100.
     * @param {number} dist
     * @return {this}
     */
    public setGuidelineInterval(dist: number): this {
        if (dist <= 0) return this;
        this.sceneController.guidelineComponentOption.interval = Math.max(dist, this.sceneController.guidelineComponentOption.minInterval);
        return this;
    }

    /**
     * short for setGuidelineInterval
     * @param {number} dist
     * @return {this}
     */
    public sGlItv(dist: number): this {
        return this.setGuidelineInterval(dist);
    }

    /**
     * 设置 引导线组件 最小生成距离间隔.
     * Default 0.
     * @param {number} dist
     * @return {this}
     */
    public setMinGuidelineInterval(dist: number): this {
        if (dist <= 0) return this;
        this.sceneController.guidelineComponentOption.minInterval = Math.max(dist, this.sceneController.guidelineComponentOption.interval);
        return this;
    }

    /**
     * short for setMinGuidelineInterval
     * @param {number} dist
     * @return {this}
     */
    public sMinGlItv(dist: number): this {
        return this.setMinGuidelineInterval(dist);
    }

    /**
     * 设置 引导线组件 长度.
     * Default 0.
     * @param {number} length
     * @return {this}
     */
    public setGuidelineLength(length: number): this {
        this.sceneController.guidelineComponentOption.componentLength = Math.max(0, length);
        return this;
    }

    /**
     * short for setGuidelineLength
     * @param {number} length
     * @return {this}
     */
    public sGlLen(length: number): this {
        return this.setGuidelineLength(length);
    }

    /**
     * 设置 引导线组件 单条最大路径点数. 0 为不限制.
     * Default 0.
     * @param {number} maxCount
     * @return {this}
     */
    public setGuidelineMaxCount(maxCount: number): this {
        this.sceneController.guidelineComponentOption.maxCount = maxCount;
        return this;
    }

    /**
     * short for setGuidelineMaxCount
     * @param {number} maxCount
     * @return {this}
     */
    public sGlMaxC(maxCount: number): this {
        return this.setGuidelineMaxCount(maxCount);
    }

    /**
     * 设置 引导线组件 寻路区查询范围.
     * Default 0.
     * @param {number} searchRadius
     * @return {this}
     */
    public setGuidelineSearchRadius(searchRadius: number): this {
        this.sceneController.guidelineComponentOption.searchRadius = searchRadius;
        return this;
    }

    /**
     * short for setGuidelineSearchRadius
     * @param {number} searchRadius
     * @return {this}
     */
    public sGlSchR(searchRadius: number): this {
        return this.setGuidelineSearchRadius(searchRadius);
    }

    /**
     * 设置 默认场景任务超时时间. ms
     * @param {number} timeout
     *      - undefined 不设置超时.
     * @return {this}
     */
    public setDefaultSceneTaskTimeout(timeout: number): this {
        this._sceneTaskTimeout = timeout;
        return this;
    }

    /**
     * short for setDefaultSceneTaskTimeout
     * @param {number} timeout
     * @return {this}
     */
    public sDfSeTout(timeout: number): this {
        return this.setDefaultSceneTaskTimeout(timeout);
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
                        startPredicate: Predicate = undefined,
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
     * short for addTaskGroup
     * @param {number} stepId
     * @param {TaskOptionalTypes} optionalType
     * @param {Predicate} startPredicate
     * @return {this}
     */
    public aTG(stepId: number,
               optionalType: TaskOptionalTypes = TaskOptionalTypes.Sequence,
               startPredicate: Predicate = undefined,
    ): this {
        return this.addTaskGroup(stepId,
            optionalType,
            startPredicate,
        );
    }

    /**
     * 添加 任务 至 任务组.
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
     * short for insertTaskToGroup
     * @param {number} groupStepId
     * @param {OperationGuideTask} task
     * @return {this}
     */
    public iTG(groupStepId: number, task: OperationGuideTask): this {
        return this.insertTaskToGroup(groupStepId, task);
    }

    /**
     * 添加 任务组 至 任务组.
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

    /**
     * short for insertGroupToGroup
     * @param {number} groupStepId
     * @param {number} targetGroupStepId
     * @return {this}
     */
    public iGG(groupStepId: number, targetGroupStepId: number): this {
        return this.insertGroupToGroup(groupStepId, targetGroupStepId);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event
    /**
     * 进入引导 委托.
     * @type {Delegate.SimpleDelegate<number>}
     */
    public onGuide: SimpleDelegate<number> = new SimpleDelegate();

    /**
     * 完成引导 委托.
     * @type {Delegate.SimpleDelegate<number>}
     */
    public onComplete: SimpleDelegate<number> = new SimpleDelegate();

    /**
     * 引导中断 委托.
     * @type {Delegate.SimpleDelegate<{ stepId: number, status: BrokenStatus }>}
     */
    public onBroken: SimpleDelegate<{ stepId: number, status: BrokenStatus }> = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private runUiGuideTask(task: UIOperationGuideTask) {
        this._uiPending = true;

        let widget: mw.Widget;
        const uiNotFoundCallback = () => {
            this._uiPending = false;
            Log4Ts.error(OperationGuider, `ui widget not found. stepId: ${task.stepId}`);
            this._taskDoneMap.set(task.stepId, true);
            this.upwardPropagateCompleted(task.stepId, true);
            this.onBroken.invoke({stepId: task.stepId, status: BrokenStatus.UiNotFound});
        };
        Gtk.doWhenTrue(() => {
                widget = task.widget;
                return uiValid(widget);
            },
            () => {
                this._uiPending = false;
                if (!this.uiController.focusOn(
                    task.widget,
                    task.option,
                    task.onInnerClick,
                    task.onBackClick,
                    true,
                )) return;
                this.onGuide.invoke(task.stepId);
                this.trySetTaskAliveHandler(task);
                try {
                    task.onFocus && task.onFocus();
                } catch (e) {
                    Log4Ts.error(OperationGuider, `error occurs in task onFocus. ${e}`);
                }

                const getHandleComplete = (broken: boolean = false, status: BrokenStatus = BrokenStatus.Null) => {
                    this.tryClearTaskAliveHandler(task.stepId);
                    if (broken) {
                        this._taskDoneMap.set(task.stepId, true);
                        this.upwardPropagateCompleted(task.stepId, true);
                        this.onBroken.invoke({stepId: task.stepId, status: status});
                    } else {
                        this.markComplete(task.stepId);
                    }
                    try {
                        task.onFade && task.onFade(!broken);
                    } catch (e) {
                        Log4Ts.error(OperationGuider, `error occurs in task onFade. ${e}`);
                    }
                };

                this.uiController.onFade.clear();
                this.uiController.onFade.add(() => getHandleComplete(false));
                this.uiController.onBroken.clear();
                this.uiController.onBroken.add(({status}) => getHandleComplete(true, status));
            },
            60,
            true,
            10e3,
            uiNotFoundCallback,
            uiNotFoundCallback);
    }

    private runSceneGuideTask(tasks: SceneOperationGuideTask[],
                              type: TaskOptionalTypes.Disorder | TaskOptionalTypes.Optional = undefined) {
        const stepTargets: Array<StepTargetParam> = tasks
            .map(t => {
                return {
                    target: GameObject.findGameObjectById(t.targetGuid),
                    task: t,
                } as StepTargetParam;
            })
            .filter(item => !Gtk.isNullOrUndefined(item.target));

        const mapper: Map<string, StepTargetParam> = stepTargets
            .map(t => ({guid: t.target.gameObjectId, task: t}))
            .reduce((previousValue, currentValue) => {
                return previousValue.set(currentValue.guid, currentValue.task);
            }, new Map());

        const getHandleComplete = (guid: string, broken: boolean = false, status: BrokenStatus = BrokenStatus.Null) => {
            const stepTarget = mapper.get(guid);

            this.fadeSceneStep(stepTarget, broken);

            if (type === TaskOptionalTypes.Optional) {
                stepTargets.forEach(item => {
                    if (item.task.targetGuid !== guid) {
                        this.fadeSceneStep(item, broken);
                        this.sceneController.fade(item.target.gameObjectId, true);
                    }
                });
            }

            if (broken) {
                this._taskDoneMap.set(stepTarget.task.stepId, true);
                this.upwardPropagateCompleted(stepTarget.task.stepId, true);
                this.onBroken.invoke({stepId: stepTarget.task.stepId, status: status});
            } else {
                this.markComplete(stepTarget.task.stepId);
            }
        };

        for (const stepTarget of stepTargets) {
            this.sceneController.focusOn({target: stepTarget.target, ...stepTarget.task.option});
            this.onGuide.invoke(stepTarget.task.stepId);
            this.trySetTaskAliveHandler({
                stepId: stepTarget.task.stepId,
                onAlive: stepTarget.task.onAlive,
                aliveCheckInterval: stepTarget.task.aliveCheckInterval,
            });
            if (stepTarget.task.option.timeout || this._sceneTaskTimeout)
                stepTarget.timer =
                    mw.setTimeout(() => {
                        this.sceneController.fade(
                            stepTarget.target.gameObjectId,
                            false,
                            true,
                            BrokenStatus.Timeout);
                    }, stepTarget.task.option.timeout ?? this._sceneTaskTimeout);
            try {
                stepTarget.task.onFocus && stepTarget.task.onFocus();
            } catch (e) {
                Log4Ts.error(OperationGuider, `error occurs in task onFocus. ${e}`);
            }
        }

        this.sceneController.onFade.clear();
        this.sceneController.onFade.add(({guid}) => getHandleComplete(guid, false));
        this.sceneController.onBroken.clear();
        this.sceneController.onBroken.add(({arg, status}) => getHandleComplete(arg.guid, true, status));
    }

    private runCutSceneGuideTask(task: CutsceneOperationGuideTask) {
        this.cutsceneController.focusOn(task.option);
        this.onGuide.invoke(task.stepId);
        this.trySetTaskAliveHandler(task);
        try {
            task.onFocus && task.onFocus();
        } catch (e) {
            Log4Ts.error(OperationGuider, `error occurs in task onFocus. ${e}`);
        }

        const getHandleComplete = (broken: boolean = false, status: BrokenStatus = BrokenStatus.Null) => {
            this.tryClearTaskAliveHandler(task.stepId);
            try {
                task.onFade && task.onFade(true);
            } catch (e) {
                Log4Ts.error(OperationGuider, `error occurs in task onFade. ${e}`);
            }
            if (broken) {
                this._taskDoneMap.set(task.stepId, true);
                this.upwardPropagateCompleted(task.stepId, true);
                this.onBroken.invoke({stepId: task.stepId, status: status});
            } else {
                this.markComplete(task.stepId);
            }
        };

        this.cutsceneController.onFade.clear();
        this.cutsceneController.onFade.add(() => getHandleComplete(false));
        this.cutsceneController.onBroken.clear();
        this.cutsceneController.onBroken.add(({status}) => getHandleComplete(true, status));
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

    private getParentStepIdHandler(stepId: number): number | null {
        return this._indexer.get(stepId);
    }

    private fadeSceneStep(target: StepTargetParam, broken: boolean) {
        this.tryClearTaskAliveHandler(target.task.stepId);
        target.timer && mw.clearTimeout(target.timer);
        try {
            target.task.onFade && target.task.onFade(!broken);
        } catch (e) {
            Log4Ts.error(OperationGuider, `error occurs in task onFade. ${e}`);
        }
    };

    private isFixedTasks(tasks: OperationGuideTask[]) {
        if (Gtk.isNullOrEmpty(tasks)) return false;
        return !tasks.every(t => t.type === tasks[0].type);
    }

    private testHandler = () => {
        if (this.isFocusing) return;
        const result = this.testGuideGroup();
        if (this._autoStop && result) {
            this.stopTestHandler();
        }
    };

    private refreshTestHandler(force: boolean) {
        if (this._testTimeId) {
            if (!force) return;
            this.stopTestHandler();
        }

        if (this._testInterval === null) return;
        this._testTimeId = mw.setInterval(
            this.testHandler,
            this._testInterval);
    }

    private stopTestHandler() {
        mw.clearInterval(this._testTimeId);
        this._testTimeId = null;
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