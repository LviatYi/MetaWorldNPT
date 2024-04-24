import Gtk, {IRecyclable, Method, ObjectPool} from "../../../util/GToolkit";
import Log4Ts from "../../../depend/log4ts/Log4Ts";
import OperationGuideControllerBase from "../base/OperationGuideControllerBase";
import {BrokenStatus} from "../base/BrokenStatus";
import GameObject = mw.GameObject;
import Trigger = mw.Trigger;
import Rotation = mw.Rotation;

class GuidelineComponent implements IRecyclable {
    public obj: GameObject;

    public makeDisable(): void {
        this.obj.setVisibility(false);
    }

    public makeEnable(position: Vector, rotation: Rotation): void {
        this.obj.setVisibility(true);
        this.obj.worldTransform.position = position;
        this.obj.worldTransform.rotation = rotation;
    }

    public makeDestroy(): void {
        this.obj.destroy();
    }

    constructor(obj: mw.GameObject) {
        this.obj = obj;
    }
}

export enum ValidGuidelineStyles {
    Custom,
    /**
     * 导航引导.
     * 需要寻路区支持.
     */
    Navigation,
    /**
     * 直线引导.
     */
    Direct,

    //TODO_LviatYi 使用 UI 标记引导.
}

//#region Options

export interface GuidelineComponentOption {
    /**
     * Guideline 组件 Guid.
     */
    guid: string;

    /**
     * 导航路径点间隔.
     */
    interval: number;

    /**
     * 导航路径点最小间隔.
     */
    minInterval: number;

    /**
     * 组件长度.
     */
    componentLength: number;

    /**
     * 最大路径点数. 0 为不限制.
     */
    maxCount: number;

    /**
     * 寻路区查询范围.
     */
    searchRadius: number;

    /**
     * 引导风格.
     */
    style: ValidGuidelineStyles;
}

export interface ISceneOperationGuideControllerOption {
    /**
     * 触发器 Guid.
     * 当触发器被该玩家触发时，结束引导.
     */
    triggerGuid?: string;

    /**
     * 完成谓词.
     * 当该谓词返回 true 时, 结束引导.
     * @return {boolean}
     */
    predicate?: () => boolean;

    /**
     * 超时计时. ms
     * @desc 超时后自动结束根组引导.
     *      - undefined 不设置超时.
     */
    timeout?: number;

    /**
     * 引导风格.
     */
    style?: ValidGuidelineStyles;
}

export type TargetParam = {
    /**
     * 目标.
     */
    target: GameObject
} & ISceneOperationGuideControllerOption

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

/**
 * Operation Guide for GameObject in Scene.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export default class SceneOperationGuideController extends OperationGuideControllerBase<{ guid: string }> {
//#region Member
    /**
     * @type {Map<string, () => void>} guid -> handler
     * @private
     */
    private _checkTargetHandlerMap: Map<string, () => void> = new Map();

    /**
     * @type {Map<string, () => void>} trigger guid -> handler
     * @private
     */
    private _triggerHandlerMap: Map<string, [Trigger, Method]> = new Map();

    private _lastCheckTime: number = 0;

    /**
     * 表现刷新频率. ms
     * @type {number}
     */
    public refreshInterval: number = 0.5e3;

    public get isFocusing(): boolean {
        return !this._checkTargetHandlerMap.keys().next().done;
    };

    /**
     * 引导线选项.
     * @type {GuidelineComponentOption}
     */
    public guidelineComponentOption: GuidelineComponentOption = {
        guid: "",
        interval: 100,
        minInterval: 0,
        componentLength: 0,
        maxCount: 0,
        searchRadius: 0,
        style: ValidGuidelineStyles.Custom,
    };

    public guidelinePools: ObjectPool<GuidelineComponent>;

    public usedGuidelineMap: Map<string, GuidelineComponent[]> = new Map();

    private guidelinePrefabValid: boolean = undefined;

    /**
     * 更新 Guideline 组件 预制体 Guid.
     */
    public updatePrefabGuid() {
        this.guidelinePools?.clear();
        this.guidelinePools = new ObjectPool<GuidelineComponent>({
            generator: () => {
                if (Gtk.isNullOrEmpty(this.guidelineComponentOption.guid)) {
                    Log4Ts.error(SceneOperationGuideController,
                        `guideline component guid is empty.`,
                        `who is necessary for guideline.`
                    );
                    return null;
                } else if (this.guidelinePrefabValid === undefined) {
                    this.guidelinePrefabValid = false;
                    const generatingGuid = this.guidelineComponentOption.guid;
                    GameObject
                        .asyncSpawn(this.guidelineComponentOption.guid, {replicates: false})
                        .then(newObj => {
                            if (this.guidelineComponentOption.guid !== generatingGuid) {
                                newObj.destroy();
                                return;
                            } else if (!newObj) {
                                Log4Ts.error(SceneOperationGuideController,
                                    `prefab not found. guid: ${generatingGuid}`
                                );
                                this.guidelineComponentOption.guid = undefined;
                                this.guidelinePrefabValid = false;
                                return;
                            } else {
                                this.guidelinePrefabValid = true;
                                this.guidelinePools.push(new GuidelineComponent(newObj));
                            }
                        });
                    return null;
                } else if (!this.guidelinePrefabValid) {
                    Log4Ts.log(SceneOperationGuideController, `prefab is not ready. guid: ${this.guidelineComponentOption.guid}`);
                    return null;
                }

                return new GuidelineComponent(GameObject.spawn(
                    this.guidelineComponentOption.guid,
                    {replicates: false})
                );
            }
        });
        if (!Gtk.isNullOrEmpty(this.guidelineComponentOption.guid) && this.guidelineComponentOption.style === ValidGuidelineStyles.Custom) {
            this.guidelineComponentOption.style = ValidGuidelineStyles.Direct;
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Behavior Event

    /**
     * 自定义聚焦时表现.
     * @type {(focusObj: mw.GameObject) => void}
     */
    public customOnFocus: (focusObj: GameObject) => void;

    /**
     * 自定义刷新时表现.
     * @desc 由 {@link refreshInterval} 控制刷新频率.
     * @type {(refreshObj: mw.GameObject) => void}
     */
    public customOnRefresh: (refreshObj: GameObject) => void;

    /**
     * 自定义消失时表现.
     * @type {(fadeObj: mw.GameObject) => void}
     */
    public customOnFade: (fadeObj: GameObject) => void;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    constructor() {
        super();

        if (!SystemUtil.isClient()) return;

        let cache = this.guidelineComponentOption.guid;

        TimeUtil.onEnterFrame.add(() => {
            if (cache !== this.guidelineComponentOption.guid) {
                cache = this.guidelineComponentOption.guid;
                this.guidelinePrefabValid = undefined;
                this.updatePrefabGuid();
            }
            const now = Date.now();
            if (now - this._lastCheckTime < this.refreshInterval) return;
            this._lastCheckTime = now;
            for (const handler of this._checkTargetHandlerMap.values()) handler();
        });
    }

    /**
     * 聚焦在指定 GameObject 上.
     * @param {{param: GameObject, option: ISceneOperationGuideControllerOption}[]} param
     */
    public focusOn(param: TargetParam): void {
        const {target, predicate, triggerGuid} = param;
        if (this._checkTargetHandlerMap.has(target.gameObjectId)) {
            Log4Ts.warn(SceneOperationGuideController, `already focusing on target. guid: ${target.gameObjectId}`);
            return;
        }

        if (!Gtk.isNullOrEmpty(triggerGuid)) {
            const trigger = GameObject.findGameObjectById(triggerGuid) as mw.Trigger;
            if (!trigger.onEnter) {
                Log4Ts.log(SceneOperationGuideController, `guid not point to a Trigger. guid: ${triggerGuid}`);
            } else {
                const handler = (enterObj: GameObject) => {
                    if (!Gtk.isSelfCharacter(enterObj)) return;

                    this.fade(target.gameObjectId, false, false);
                };
                this._triggerHandlerMap.set(target.gameObjectId, [trigger, handler]);
                trigger.onEnter.add(handler);
            }
        }

        try {
            this.customOnFocus?.(target);
        } catch (e) {
            Log4Ts.error(SceneOperationGuideController,
                `customOnFocus error.`,
                e);
        }
        this._checkTargetHandlerMap.set(
            target.gameObjectId,
            this.getCheckTargetHandler(
                target,
                {predicate, triggerGuid}
            )
        );

        this.onFocus.invoke({guid: target.gameObjectId});
    }

    /**
     * 取消聚焦.
     * @param {string} guid=undefined 取消聚焦目标.
     *      - undefined: 取消所有聚焦.
     * @param {boolean} force=false 是否强制运行.
     * @param {boolean} broken=false 是否非法中断.
     * @param {BrokenStatus} brokenStatus=BrokenStatus.Null 损坏状态.
     */
    public fade(guid: string = undefined,
                force: boolean = false,
                broken: boolean = false,
                brokenStatus: BrokenStatus = BrokenStatus.Null): void {
        if (Gtk.isNullOrEmpty(guid)) {
            for (let key of this._checkTargetHandlerMap.keys()) this.fade(key, force, broken, brokenStatus);
        } else {
            if (!this._checkTargetHandlerMap.has(guid)) return;
            this._checkTargetHandlerMap.delete(guid);
            const triggerWithHandler = this._triggerHandlerMap.get(guid);
            if (triggerWithHandler) {
                const [trigger, method] = triggerWithHandler;
                trigger.onEnter.remove(method);
                this._triggerHandlerMap.delete(guid);
            }
            this.guidelinePools.push(...this.usedGuidelineMap.get(guid) ?? []);
            this.usedGuidelineMap.delete(guid);

            try {
                this.customOnFade?.(GameObject.findGameObjectById(guid));
            } catch (e) {
                Log4Ts.error(SceneOperationGuideController,
                    `customOnFade error.`,
                    e);
            }

            if (force) return;
            if (broken) this.onBroken.invoke({arg: {guid}, status: brokenStatus});
            else this.onFade.invoke({guid});
        }
    }

    /**
     * 生成 目标检查器.
     * @private
     */
    private getCheckTargetHandler(
        target: GameObject,
        option: ISceneOperationGuideControllerOption) {
        return () => {
            let fade: boolean = false;
            let broken: boolean = false;
            let brokenStatus = BrokenStatus.Null;
            try {
                fade = option.predicate && option.predicate();
            } catch (e) {
                Log4Ts.error(SceneOperationGuideController, "error occurs in predicate.", e);
                broken = true;
                brokenStatus = BrokenStatus.Error;
            }

            if (fade || broken) {
                this.fade(target.gameObjectId, false, broken, brokenStatus);
                return;
            }

            try {
                this.customOnRefresh?.(target);
            } catch (e) {
                Log4Ts.error(SceneOperationGuideController,
                    `customOnRefresh error.`,
                    e);
            }
            if ((this.guidelineComponentOption.style !== ValidGuidelineStyles.Custom) && this.guidelinePrefabValid !== false) {
                this.refreshTargetGuideline(target, option.style ?? this.guidelineComponentOption.style);
            }
        };
    }

    private refreshTargetGuideline(target: GameObject, style: ValidGuidelineStyles) {
        const dist: Vector = target.worldTransform.position;
        const guid = target.gameObjectId;

        let path: [Vector[], Vector][];
        switch (style) {
            case ValidGuidelineStyles.Navigation:
                path =
                    findNavPath(dist,
                        Gtk.vectorAdd(target.getBoundingBoxExtent(), this.guidelineComponentOption.searchRadius),
                        this.guidelineComponentOption.interval,
                        this.guidelineComponentOption.minInterval,
                        this.guidelineComponentOption.componentLength,
                        this.guidelineComponentOption.maxCount);
                break;
            case ValidGuidelineStyles.Direct:
                path =
                    findDirectPath(dist,
                        this.guidelineComponentOption.interval,
                        this.guidelineComponentOption.minInterval,
                        this.guidelineComponentOption.componentLength,
                        this.guidelineComponentOption.maxCount);
                break;
            case ValidGuidelineStyles.Custom:
            default:
                return;
        }

        let usedPool = this.usedGuidelineMap.get(guid);
        if (!usedPool) {
            usedPool = [];
            this.usedGuidelineMap.set(guid, usedPool);
        }
        let p = 0;
        for (const [points, dir] of path) {
            for (const point of points) {
                let guideline = usedPool[p];
                if (!guideline) {
                    guideline = this.guidelinePools.pop(point, Rotation.fromVector(dir));
                    if (!guideline) {
                        Log4Ts.warn(
                            SceneOperationGuideController,
                            `prefab not found or not ready. guid: ${this.guidelineComponentOption.guid}`
                        );
                        return;
                    }
                    usedPool.push(guideline);
                } else {
                    guideline.obj.worldTransform.position = point;
                    guideline.obj.worldTransform.rotation = Rotation.fromVector(dir);
                }
                ++p;
            }
        }
        if (p < usedPool.length) {
            this.guidelinePools.push(...usedPool.splice(p));
        }
    }
}

/**
 * 查询固定间隔的导航路径点集.
 * @param {Vector} target 目标点.
 * @param {Vector} searchSize 寻路区查询范围.
 *      - 用于寻找最近可达点.
 * @param {number} interval 导航路径点间隔.
 * @param {number} minInterval 导航路径点最小间隔.
 * @param {number} toleration=0 容差.
 *      - 每段路径的容差 距离该段路径的终点的容差范围内不再生成导航路径点.
 * @param {number} maxCount=0 最大路径点数. 0 为不限制.
 * @return {[Vector[], Vector][]}
 */
function findNavPath(target: Vector,
                     searchSize: Vector,
                     interval: number,
                     minInterval: number,
                     toleration: number = 0,
                     maxCount: number = 0): [Vector[], Vector][] {
    const result: [Vector[], Vector][] = [];
    const char = Player.localPlayer.character;
    const startPoint = Gtk.detectVerticalTerrain(
        char.worldTransform.position,
        undefined,
        char,
    )?.position ?? char.worldTransform.position;

    const endPoint = Navigation.getClosestReachablePoint(target, searchSize);
    if (!endPoint) {
        Log4Ts.warn(SceneOperationGuideController,
            `path not exist. please check 寻路区.`
        );
        return result;
    }

    const waypoint = Navigation.findPath(
        startPoint,
        endPoint,
    );
    let lastPointCache = waypoint[0];
    let count = 0;
    walker: for (let i = 0; i < waypoint.length - 1; ++i) {
        const current = waypoint[i];
        const next = waypoint[i + 1];
        let length = Gtk.euclideanDistance(current, next) - toleration;
        const dir = next.clone().subtract(current).normalize();
        const cache = dir.clone();
        const points: Vector[] = [];

        while (true) {
            let position: Vector;
            if (length > interval) {
                length -= interval;
                position = lastPointCache.clone().add(cache.multiply(interval));
            } else if (length > minInterval) {
                position = next.clone();
                length = 0;
            } else {
                break;
            }

            points.push(position);
            ++count;
            if (maxCount !== 0 &&
                count >= maxCount) {
                result.push([points, dir]);
                break walker;
            }
            lastPointCache = points[points.length - 1];
            cache.set(dir.x, dir.y, dir.z);
        }

        result.push([points, dir]);
    }

    return result;
}

/**
 * 查询固定间隔的直线路径点集.
 * @param {Vector} target 目标点.
 *      - 用于寻找最近可达点.
 * @param {number} interval 导航路径点间隔.
 * @param {number} minInterval 导航路径点最小间隔.
 * @param {number} toleration=0 容差.
 *      - 每段路径的容差 距离该段路径的终点的容差范围内不再生成导航路径点.
 * @param {number} maxCount=0 最大路径点数. 0 为不限制.
 * @return {[Vector[], Vector][]}
 */
function findDirectPath(target: Vector,
                        interval: number,
                        minInterval: number,
                        toleration: number = 0,
                        maxCount: number = 0): [Vector[], Vector][] {
    const result: [Vector[], Vector][] = [];
    const char = Player.localPlayer.character;
    const start = Gtk.detectVerticalTerrain(
        char.worldTransform.position,
        undefined,
        char,
    )?.position ?? char.worldTransform.position;

    let count = 0;

    let length = Gtk.euclideanDistance(start, target) - toleration;
    const dir = target.clone().subtract(start).normalize();

    const cache = dir.clone().multiply(interval);
    const points: Vector[] = [start];

    while (true) {
        let position: Vector;
        let last = points[points.length - 1];
        if (length > interval) {
            length -= interval;
            position = last.clone().add(cache);
        } else if (length > minInterval) {
            position = last.clone().add(cache.set(dir).multiply(length));
            length = 0;
        } else {
            break;
        }

        points.push(position);
        ++count;
        if (maxCount !== 0 &&
            count >= maxCount) {
            break;
        }
    }

    result.push([points, dir]);
    return result;
}
