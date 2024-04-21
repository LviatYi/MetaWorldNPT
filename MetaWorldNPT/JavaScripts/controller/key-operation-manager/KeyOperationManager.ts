import Log4Ts from "../../depend/log4ts/Log4Ts";
import GToolkit from "../../util/GToolkit";
import Gtk, {IRecyclable, ObjectPool, Singleton} from "../../util/GToolkit";
import {KOMUtil} from "./extends/AABB";
import EventListener = mw.EventListener;
import Keys = mw.Keys;

/**
 * KeyOperationManager.
 * 键盘操作管理器.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @author zewei.zhang
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 31.1.0b
 */
export default class KeyOperationManager extends Singleton<KeyOperationManager>() {
    private _transientMap: Map<string, TransientOperationGuard> = new Map();

    private _keyHoldMap: Map<mw.Keys, HoldOperationGuard> = new Map();

    protected onConstruct(): void {
        super.onConstruct();
        mw.TimeUtil.onEnterFrame.add(
            () => {
                const now = Date.now();
                for (let guard of this._keyHoldMap.values()) {
                    if (guard.lastTriggerTime === null) continue;
                    const dt = now - guard.lastTriggerTime;
                    if (dt < guard.threshold) continue;
                    guard.call(dt);
                    guard.lastTriggerTime = now;
                }
            },
        );
    }

    /**
     * register {@link InputUtil.onKeyDown} for ui.
     * @param key
     * @param ui
     *      - undefined or null. will unregister as a global key operation.
     * @param callback
     * @param force
     *      false default. will ignore when same ui listen on the same key.
     * @param isAfterEffect if is not trigger only on top ui.
     *      false default. 仅当 ui 为最上层时触发.
     *      true. 无论是否在最上层时都触发.
     */
    public onKeyDown(key: Keys,
                     ui: KeyInteractiveUIScript,
                     callback: NormalCallback,
                     force: boolean = false,
                     isAfterEffect: boolean = false): boolean {
        return this.registerOperation(
            key,
            OperationTypes.OnKeyDown,
            ui,
            callback,
            force,
            isAfterEffect);
    }

    /**
     * register {@link InputUtil.OnKeyUp} for ui.
     * @param key
     * @param ui
     *      - undefined or null. will unregister as a global key operation.
     * @param callback
     * @param force
     *      false default. will ignore when same ui listen on the same key.
     * @param isAfterEffect if is not trigger only on top ui.
     *      false default. 仅当 ui 为最上层时触发.
     *      true. 无论是否在最上层时都触发.
     */
    public onKeyUp(key: Keys,
                   ui: KeyInteractiveUIScript,
                   callback: NormalCallback,
                   force: boolean = false,
                   isAfterEffect: boolean = false): boolean {
        return this.registerOperation(
            key,
            OperationTypes.OnKeyUp,
            ui,
            callback,
            force,
            isAfterEffect);
    }

    /**
     * register {@link InputUtil.OnKeyPress} for ui.
     * @param key
     * @param ui
     *      - undefined or null. will unregister as a global key operation.
     * @param callback
     * @param threshold 持续触发阈值. 持续触发时触发间隔小于阈值时将被忽略.
     * @param force
     *      - false default. will ignore when same ui listen on the same key.
     * @param isAfterEffect if is not trigger only on top ui.
     *      false default. 仅当 ui 为最上层时触发.
     *      true. 无论是否在最上层时都触发.
     */
    public onKeyPress(key: Keys,
                      ui: KeyInteractiveUIScript,
                      callback: DeltaTimeCallback,
                      threshold: number = 0,
                      force: boolean = false,
                      isAfterEffect: boolean = false): boolean {
        return this.registerOperation(
            key,
            OperationTypes.OnKeyPress,
            ui,
            callback,
            force,
            isAfterEffect,
            {threshold: threshold});
    }

    /**
     * 当鼠标进入 widget 时触发.
     * @param {KeyInteractiveUIScript} ui
     * @param {mw.Widget} widget
     * @param {NormalCallback} callback
     */
    public onWidgetEntered(ui: KeyInteractiveUIScript, widget: mw.Widget, callback: NormalCallback) {

    }

    /**
     * 当鼠标退出 widget 时触发.
     * @param {KeyInteractiveUIScript} ui
     * @param {mw.Widget} widget
     * @param {NormalCallback} callback
     */
    public onWidgetLeave(ui: KeyInteractiveUIScript, widget: mw.Widget, callback: NormalCallback) {

    }

    /**
     * 当鼠标悬停在 widget 上时触发.
     * @param {KeyInteractiveUIScript} ui
     * @param {mw.Widget} widget
     * @param {DeltaTimeCallback} callback
     */
    public onWidgetHover(ui: KeyInteractiveUIScript, widget: mw.Widget, callback: DeltaTimeCallback) {

    }

    /**
     * unregister callback for ui.
     * @param ui
     * @param key unregister key.
     *      - undefined default. will unregister all key.
     * @param opType unregister operation type.
     *      - undefined default. will unregister all operation type.
     */
    public unregisterKey(ui: KeyInteractiveUIScript,
                         key: Keys = undefined,
                         opType: OperationTypes = undefined,
    ) {
        if (GToolkit.isNullOrUndefined(opType)) {
            this.unregisterTransientOperation(ui, key, opType);
            this.unregisterHoldOperation(ui, key);
        } else switch (opType) {
            case OperationTypes.OnKeyDown:
            case OperationTypes.OnKeyUp:
                this.unregisterHoldOperation(ui, key);
                break;
            case OperationTypes.OnKeyPress:
                this.unregisterTransientOperation(ui, key);
                break;
            case OperationTypes.Null:
            default:
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                break;
        }
    }

    private unregisterTransientOperation(
        ui: KeyInteractiveUIScript,
        key: Keys = undefined,
        opType: OperationTypes = undefined): boolean {
        if (opType === undefined) {
            this.unregisterTransientOperation(ui, key, OperationTypes.OnKeyDown);
            this.unregisterTransientOperation(ui, key, OperationTypes.OnKeyUp);
            return;
        }

        if (GToolkit.isNullOrUndefined(key)) {
            for (const guard of this._transientMap.values()) {
                guard.unregister(ui);
            }
        } else {
            this._transientMap.get(getRegisterKey(key, opType))?.unregister(ui);
        }
    }

    private unregisterHoldOperation(
        ui: KeyInteractiveUIScript,
        key: Keys = undefined) {
        if (GToolkit.isNullOrUndefined(key)) {
            for (const guard of this._keyHoldMap.values()) {
                guard.unregister(ui);
            }
        } else {
            this._keyHoldMap.get(key)?.unregister(ui);
        }
    }

    private registerOperation(key: Keys,
                              opType: OperationTypes,
                              ui: KeyInteractiveUIScript,
                              callback: AnyCallback,
                              force: boolean = false,
                              isAfterEffect: boolean = false,
                              options?: GuardOptions): boolean {
        let guard: AOperationGuard<unknown>;
        switch (opType) {
            case OperationTypes.OnKeyDown:
            case OperationTypes.OnKeyUp:
                guard = this._transientMap.get(getRegisterKey(key, opType));
                break;
            case OperationTypes.OnKeyPress:
                guard = this._keyHoldMap.get(key);
                if (!this._transientMap.has(getRegisterKey(key, OperationTypes.OnKeyDown))) {
                    this.addGuard(key, OperationTypes.OnKeyDown);
                }
                if (!this._transientMap.has(getRegisterKey(key, OperationTypes.OnKeyUp))) {
                    this.addGuard(key, OperationTypes.OnKeyUp);
                }
                break;
            case OperationTypes.Null:
            default:
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                break;
        }
        if (guard) {
            if (!force) {
                for (let item of guard.operations) {
                    if (item.ui === ui) {
                        Log4Ts.warn(KeyOperationManager, `already has a callback on key ${key}-${opType} in ui ${ui.constructor.name}. it will be ignore.`);
                        return false;
                    }
                }
            }
        } else guard = this.addGuard(key, opType, options);

        const operation = new Operation(ui, callback, isAfterEffect);
        return guard.register(operation);
    }

    private addGuard(key: mw.Keys, opType: OperationTypes, options?: GuardOptions): AOperationGuard<unknown> {
        let result: AOperationGuard<unknown>;
        switch (opType) {
            case OperationTypes.OnKeyDown:
            case OperationTypes.OnKeyUp: {
                const regKey = getRegisterKey(key, opType);
                const guardFunc = () => {
                    const holdGuard = (this._keyHoldMap.get(key));
                    if (holdGuard) {
                        holdGuard.lastTriggerTime = opType === OperationTypes.OnKeyDown ? Date.now() : null;
                    }
                    result.call();
                };
                result = new TransientOperationGuard();
                if (opType === OperationTypes.OnKeyDown) {
                    result.eventListener = InputUtil.onKeyDown(key, guardFunc);
                } else {
                    result.eventListener = InputUtil.onKeyUp(key, guardFunc);
                }
                this._transientMap.set(regKey, result);
                break;
            }
            case OperationTypes.OnKeyPress:
                result = new HoldOperationGuard().setThreshold(options!.threshold);
                this._keyHoldMap.set(key, result as HoldOperationGuard);
                break;
            case OperationTypes.Null:
            default:
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                break;
        }

        return result;
    }

    private _hoverDetectTimer: number = null;

    private _hoverBvhTree = new KOMUtil.AABBTree();

    private _widgetNodes: Map<string, KOMUtil.Node> = new Map();

    private _debugImages: BVHTreeNodeDebugImage[] = [];

    private _debugImagesPool = new ObjectPool({
        generator: () => {
            let image = mw.Image.newObject(UIService.canvas);
            image.imageGuid = Gtk.IMAGE_WHITE_SQUARE_GUID;
            image.imageDrawType = SlateBrushDrawType.Box;
            image.renderOpacity = 0.1;
            return new BVHTreeNodeDebugImage(image);
        },
        destructor: (img) => {
            img.image.destroyObject();
        }
    });

    /**
     * 开始检测 Widgets onHover 事件.
     * @param maskWidget 父级 widgets. 超出父级的 widget 范围的将不会被检测到
     * @param needDetectWidgets 需要检测的 widgets 数组
     * @param callback  回调函数. 返回检测到的 widget 数组
     * @param debug 是否可视化 BVH.
     * @return
     */
    public startDetectWidgetOnHover(needDetectWidgets: mw.Widget[],
                                    callback: (widget: mw.Widget[]) => void,
                                    maskWidget: mw.Widget,
                                    debug: boolean = false) {
        this._hoverBvhTree.reset();
        this._hoverDetectTimer = TimeUtil.setInterval(() => {
            //遍历需要检测的widget
            for (let widget of needDetectWidgets) {
                //检测widget是否在父级widget范围内
                if (maskWidget && !this.isWidgetRangeOverlap(maskWidget, widget)) {
                    //如果不在了，检查有没插入到tree里，有的话删掉
                    if (this._widgetNodes.has(widget.guid)) {
                        this._hoverBvhTree.destroyNode(this._widgetNodes.get(widget.guid));
                        this._widgetNodes.delete(widget.guid);
                    }
                    continue;
                }

                if (!this._widgetNodes.has(widget.guid)) {
                    let node = this._hoverBvhTree.createNode(widget.guid, this.getWidgetAABBInViewPort(widget));
                    this._widgetNodes.set(widget.guid, node);
                } else {
                    //检测widget移动
                    let aabb = this.getWidgetAABBInViewPort(widget);
                    let node = this._widgetNodes.get(widget.guid);

                    if (!node.aabb.equals(aabb)) {
                        // console.log(widget.name, pos, size);
                        this._hoverBvhTree.moveNode(node, aabb);
                    }
                }
            }
            if (debug) {
                this._debugImagesPool.push(...this._debugImages);
                this._debugImages.length = 0;
                this._hoverBvhTree.traverse((node) => {
                    this._debugImages.push(this._debugImagesPool.pop(node));
                });
            }

            //获取鼠标位置
            let mousePos = getMousePositionOnViewport();

            // console.log(mousePos);
            let widgets = this._hoverBvhTree.queryPoint(mousePos);
            if (widgets.length > 0) {
                callback(widgets.map(node => needDetectWidgets.find(widget => widget.guid === node.data)));
            }
        }, 0.1);
    }

    /**
     * 控件 A 和控件 B 的是否有重叠.
     * @param widgetA
     * @param widgetB
     * @return
     */
    private isWidgetRangeOverlap(widgetA: mw.Widget, widgetB: mw.Widget): boolean {
        let widgetA_AABB = this.getWidgetAABBInViewPort(widgetA);
        let widgetB_AABB = this.getWidgetAABBInViewPort(widgetB);
        return widgetA_AABB.testOverlap(widgetB_AABB);
    }

    /**
     * 获取控件在视口空间下的 AABB.
     * @param widget UI 控件
     * @return 包围盒
     */
    private getWidgetAABBInViewPort(widget: mw.Widget): KOMUtil.AABB {
        let pos = new Vector2();
        let outPixelPosition = new Vector2();
        localToViewport(widget.cachedGeometry, Vector2.zero, outPixelPosition, pos);
        let maxPos = new Vector2();
        let outMaxPixelPosition = new Vector2();
        localToViewport(widget.cachedGeometry, widget.size, outMaxPixelPosition, maxPos);
        let size = maxPos.clone().subtract(pos);

        return new KOMUtil.AABB(pos.clone(), pos.add(size.clone()));
    }

    /**
     * 停止检测控件悬停
     */
    public stopDetectWidgetOnHover() {
        this._hoverBvhTree.reset();
        this._widgetNodes.clear();
        this._debugImagesPool.doRecycle();
        TimeUtil.clearInterval(this._hoverDetectTimer);
    }
}

//#region Callback type

/**
 * 猝发回调.
 */
export type NormalCallback = () => void;

/**
 * 持续回调.
 * dt {number} 持续时间. 距上一次触发或起始记录的时间段.
 */
export type DeltaTimeCallback = (dt: number) => void;

type AnyCallback = (p: unknown) => void;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

/**
 * 可选 key 按键可交互性接口.
 */
interface IKeyInteractive {
    keyEnable?(): boolean;
}

/**
 * key 按键可交互性 UI 脚本.
 */
type KeyInteractiveUIScript = UIScript & IKeyInteractive;

/**
 * 操作类型.
 */
export enum OperationTypes {
    /**
     * 空置.
     */
    Null = "null",
    /**
     * 按下.
     */
    OnKeyDown = "onKeyDown",
    /**
     * 松开.
     */
    OnKeyUp = "onKeyUp",
    /**
     * 按压.
     */
    OnKeyPress = "onKeyPress",
}

//#region Operation

/**
 * 操作.
 */
class Operation<P> {
    public ui: KeyInteractiveUIScript;

    public callBack: (p?: P) => void;

    public isAfterEffect: boolean;

    constructor(ui: KeyInteractiveUIScript,
                callBack: (p?: P) => void,
                isAfterEffect: boolean = false) {
        this.ui = ui;
        this.callBack = callBack;
        this.isAfterEffect = isAfterEffect;
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Operation Guard

/**
 * 操作管理者.
 */
abstract class AOperationGuard<P> {
    public operations: Operation<P>[] = [];

    public eventListener: EventListener = null;

    public call(p: P = null) {
        let candidates: Operation<P>[] = this.operations.filter(item => GToolkit.isNullOrUndefined(item.ui)) ?? [];
        const keyEnableUis = this.operations.filter(item => uiKeyEnable(item.ui));
        if (GToolkit.isNullOrEmpty(candidates)) {
            candidates.push(this.getTopOperation(keyEnableUis.filter(item => !item.isAfterEffect)));
        }

        try {
            candidates.forEach(item => item?.callBack(p));
        } catch (e) {
            Log4Ts.error(AOperationGuard, `error throw in operation. ${e}`);
        }

        for (const op of keyEnableUis) {
            op.isAfterEffect && op.callBack(p);
        }
    }

    public register(operation: Operation<P>): boolean {
        const count = this.operations.length;
        return this.operations.push(operation) > count;
    }

    public unregister(ui: KeyInteractiveUIScript) {
        for (let i = this.operations.length - 1; i >= 0; i--) {
            if (this.operations[i].ui === ui) this.operations.splice(i, 1);
        }
    }

    private getTopOperation(ops: Operation<P>[]): Operation<P> | null {
        if (GToolkit.isNullOrEmpty(ops)) return null;
        let topOp: Operation<P> = ops[0];
        for (let i = 1; i < ops.length; ++i) {
            const op = ops[i];
            if (GToolkit.isNullOrUndefined(op?.ui?.uiObject)) continue;
            else if (
                (GToolkit.isNullOrUndefined(topOp?.ui?.uiObject)) ||
                op.ui.layer > topOp.ui.layer ||
                (op.ui.uiObject["slot"]?.zOrder ?? -1) > (topOp.ui.uiObject["slot"]?.zOrder ?? -1)
            ) topOp = op;
        }

        return topOp;
    }
}

/**
 * 猝发式操作管理者.
 */
class TransientOperationGuard extends AOperationGuard<void> {
}

/**
 * 持续式操作管理者.
 */
class HoldOperationGuard extends AOperationGuard<number> {
    private _threshold: number = 0;

    public get threshold(): number {
        return this._threshold;
    }

    public setThreshold(val: number): this {
        this._threshold = val;
        return this;
    }

    public lastTriggerTime: number = null;
}

interface GuardOptions {
    /**
     * 持续触发阈值. 持续触发时触发间隔小于阈值时将被忽略.
     */
    threshold?: number;
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Debug
class BVHTreeNodeDebugImage implements IRecyclable {
    public image: mw.Image;

    makeEnable(node: KOMUtil.Node): void {
        Gtk.setUiSize(this.image, node.aabb.max.x - node.aabb.min.x, node.aabb.max.y - node.aabb.min.y);
        Gtk.setUiPosition(this.image, node.aabb.min.x, node.aabb.min.y);
        Gtk.trySetVisibility(this.image, true);
    }

    makeDisable(): void {
        Gtk.trySetVisibility(this.image, false);
    }

    constructor(image: mw.Image) {
        this.image = image;
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

function uiKeyEnable(ui: KeyInteractiveUIScript) {
    if (GToolkit.isNullOrUndefined(ui)) return false;
    return GToolkit.isNullOrUndefined(ui.keyEnable) ? true : ui.keyEnable();
}

function getRegisterKey(key: mw.Keys, opType: OperationTypes) {
    return `${key}-${opType}`;
}