import Gtk, {Delegate, IRecyclable, Method, ObjectPool} from "../../../util/GToolkit";
import Log4Ts from "../../../depend/log4ts/Log4Ts";
import GameObject = mw.GameObject;
import Trigger = mw.Trigger;
import Rotation = mw.Rotation;
import SimpleDelegate = Delegate.SimpleDelegate;

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

    constructor(obj: mw.GameObject) {
        this.obj = obj;
    }
}

//#region Options

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
     * 使用导航.
     * 需要寻路区支持.
     */
    navigation?: boolean;

    /**
     * 超时计时. ms
     * @desc 超时后自动结束根组引导.
     *      - undefined 不设置超时.
     */
    timeout?: number;
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
export default class SceneOperationGuideController {
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

    private _timeoutTimer: number = undefined;

    public checkInterval: number = 0.5e3;

    public get isFocusing(): boolean {
        return !this._checkTargetHandlerMap.keys().next().done;
    };

    private _guidelinePrefabGuid: string;

    public get guidelinePrefabGuid(): string {
        return this._guidelinePrefabGuid;
    }

    public set guidelinePrefabGuid(value: string) {
        if (this._guidelinePrefabGuid === value) return;
        this.guidelinePools?.clear();
        this.guidelinePools = new ObjectPool<GuidelineComponent>({
            generator: () => {
                if (!this._guidelinePrefabValid) {
                    this.tryInitPrefab();
                    return null;
                }

                return new GuidelineComponent(GameObject.spawn(
                    this._guidelinePrefabGuid,
                    {replicates: false})
                );
            }
        });
        this._guidelinePrefabGuid = value;
        this._guidelinePrefabValid = false;
    }

    private _guidelinePrefabValid: boolean = false;

    public singleGuidelinePointMaxCount: number = 40;

    /**
     * Guideline 预制体生成距离间隔.
     * @type {number}
     */
    public interval: number = 80;

    /**
     * Guideline 预制体生成最小距离间隔.
     * @type {number}
     */
    public minInterval: number = 10;

    public guidelinePools: ObjectPool<GuidelineComponent>;

    public usedGuidelineMap: Map<string, GuidelineComponent[]> = new Map();

    public searchSizeExtent: number = 20;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event
    public readonly onFocus: SimpleDelegate<string> = new SimpleDelegate();

    public readonly onFade: SimpleDelegate<{ guid: string, force: boolean }> = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    constructor() {
        if (!SystemUtil.isClient()) return;
        this.guidelinePrefabGuid = "1CD734AF477D0D32F630329B981F3D28";

        TimeUtil.onEnterFrame.add(() => {
            const now = Date.now();
            if (now - this._lastCheckTime < this.interval) return;
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
                if (this._triggerHandlerMap.has(target.gameObjectId)) {
                    return;
                }
                const handler = (enterObj: GameObject) => {
                    if (!Gtk.isSelfCharacter(enterObj)) return;

                    this.fade(target.gameObjectId);
                };
                this._triggerHandlerMap.set(target.gameObjectId, [trigger, handler]);
                trigger.onEnter.add(handler);
            }
        }

        this._checkTargetHandlerMap.set(
            target.gameObjectId,
            this.getCheckTargetHandler(
                target,
                {predicate, triggerGuid}
            )
        );

        this.onFocus.invoke(target.gameObjectId);
    }

    /**
     * 取消聚焦.
     * @param {string} guid=undefined 取消聚焦目标.
     *      - undefined: 取消所有聚焦.
     * @param {boolean} force=false 是否强制再运行.
     */
    public fade(guid: string = undefined, force: boolean = false): void {
        if (Gtk.isNullOrEmpty(guid)) {
            for (let key of this._checkTargetHandlerMap.keys()) {
                this.fade(key, force);
            }
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
            this.onFade.invoke({guid, force});
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
            let result: boolean;
            try {
                result = option.predicate && option.predicate();
            } catch (e) {
                Log4Ts.error(SceneOperationGuideController, e);
                result = true;
            }
            if (result) {
                this.fade(target.gameObjectId);
                return;
            }

            this.refreshTargetGuideline(target, option.navigation ?? false);
        };
    }

    private refreshTargetGuideline(target: GameObject, useNav: boolean) {
        const dist: Vector = target.worldTransform.position;
        const guid = target.gameObjectId;

        const path = useNav ?
            this.findNavPath(dist, Gtk.vectorAdd(target.getBoundingBoxExtent(), this.searchSizeExtent)) :
            this.findDirectPath(dist);

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
                            `prefab not found or not ready. guid: ${this._guidelinePrefabGuid}`
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

    private findNavPath(target: Vector, searchSize: Vector): [Vector[], Vector][] {
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
            let length = Gtk.euclideanDistance(current, next);
            const dir = next.clone().subtract(current).normalize();
            const cache = dir.clone();
            const points: Vector[] = [];

            while (true) {
                let position: Vector;
                if (length > this.interval) {
                    length -= this.interval;
                    position = lastPointCache.clone().add(cache.multiply(this.interval));
                } else if (length > this.minInterval) {
                    position = next.clone();
                    length = 0;
                } else {
                    break;
                }

                points.push(position);
                ++count;
                if (count >= this.singleGuidelinePointMaxCount) {
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

    private findDirectPath(target: Vector): [Vector[], Vector][] {
        const result: [Vector[], Vector][] = [];
        const char = Player.localPlayer.character;
        const start = Gtk.detectVerticalTerrain(
            char.worldTransform.position,
            undefined,
            char,
        )?.position ?? char.worldTransform.position;

        let count = 0;

        let length = Gtk.euclideanDistance(start, target);
        const dir = target.clone().subtract(start).normalize();

        const cache = dir.clone().multiply(this.interval);
        const points: Vector[] = [start];

        while (true) {
            let position: Vector;
            let last = points[points.length - 1];
            if (length > this.interval) {
                length -= this.interval;
                position = last.clone().add(cache);
            } else if (length > this.minInterval) {
                position = last.clone().add(cache.set(dir).multiply(length));
                length = 0;
            } else {
                break;
            }

            points.push(position);
            ++count;
            if (count >= this.singleGuidelinePointMaxCount) {
                break;
            }
        }

        result.push([points, dir]);
        return result;
    }

    private tryInitPrefab() {
        this._guidelinePrefabValid = false;
        GameObject
            .asyncSpawn(this._guidelinePrefabGuid, {replicates: false})
            .then(obj => {
                    if (!obj) {
                        Log4Ts.log(SceneOperationGuideController,
                            `prefab not found. guid: ${this._guidelinePrefabGuid}`
                        );
                        return;
                    }
                    obj.setVisibility(false);
                    this.guidelinePools.push(new GuidelineComponent(obj));
                    this._guidelinePrefabValid = true;
                }
            );
    }
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
        Log4Ts.warn(SceneOperationGuideController,
            `obj not found. guid: ${obj}`
        );
        return (): boolean => true;
    }

    return (): boolean => {
        return Gtk.squaredEuclideanDistance(
            Player.localPlayer.character.worldTransform.position,
            obj.worldTransform.position) <= dist * dist;
    };
}