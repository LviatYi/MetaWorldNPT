import Log4Ts from "../../depend/log4ts/Log4Ts";
import GToolkit from "../../util/GToolkit";
import Gtk, {IRecyclable, Regulator, Singleton} from "../../util/GToolkit";
import {KOMUtil} from "./extends/AABB";
import {KeyOperationHoverController} from "./KeyOperationHoverController";
import EventListener = mw.EventListener;
import Keys = mw.Keys;
import getCurrentMousePosition = mw.getCurrentMousePosition;
import getLastMousePosition = mw.getLastMousePosition;

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
 * @version 31.4.0b
 */
export default class KeyOperationManager extends Singleton<KeyOperationManager>() {
    private _keyTransientMap: Map<string, TransientOperationGuard> = new Map();

    private _keyHoldMap: Map<mw.Keys, HoldOperationGuard> = new Map();

    private _hoverController: KeyOperationHoverController = new KeyOperationHoverController();

    private _mouseMap: Map<string, MouseOperation> = new Map();

    private _currentHoverWidgetGuid: string = null;

    /**
     * 默认所有鼠标移动速度阈值.
     * @desc 移动速度为每帧移动的距离.
     * @desc 超过阈值时将被忽略. 0 时不忽略.
     * @type {number}
     */
    public mouseMovementSpeedThreshold: number = 300;

    private _mouseTestRegulator: Regulator = new Regulator();

    public get mouseTestInterval(): number {
        return this._mouseTestRegulator.updateInterval;
    }

    /**
     * 鼠标测试间隔. ms
     * @type {number}
     */
    public set mouseTestInterval(value: number) {
        this._mouseTestRegulator.interval(value);
    }

    public get widgetTraceInterval(): number {
        return this._hoverController.widgetTraceInterval;
    }

    /**
     * 控件 AABB 盒刷新检查间隔.
     * @param {number} value
     */
    public setWidgetTraceInterval(value: number): this {
        this._hoverController.widgetTraceInterval = value;
        return this;
    }

    protected onConstruct(): void {
        super.onConstruct();
        mw.TimeUtil.onEnterFrame.add(() => {
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

        mw.TimeUtil.onEnterFrame.add((dt) => {
            let curr: mw.Widget = null;
            let mouseMovementSpeedSqr: number;
            if (!this._hoverController.empty()) {
                const currentMouse: mw.Vector2 = getCurrentMousePosition();
                const lastMouse: mw.Vector2 = getLastMousePosition();
                mouseMovementSpeedSqr = lastMouse.subtract(currentMouse).sqrMagnitude;
                if (this.mouseMovementSpeedThreshold !== 0 &&
                    mouseMovementSpeedSqr > this.mouseMovementSpeedThreshold * this.mouseMovementSpeedThreshold) {
                    return;
                }
                if (!this._mouseTestRegulator.request()) return;

                curr = this._hoverController.testPoint(currentMouse);
            }

            this.updateHoverWidget(curr, Date.now(), mouseMovementSpeedSqr);
        });
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
        return this.registerKeyOperation(
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
        return this.registerKeyOperation(
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
        return this.registerKeyOperation(
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
     * @param {mw.Widget} widget
     * @param {NormalCallback} callback
     * @param {number} mouseMovementSpeedThreshold 鼠标移动速度阈值. 鼠标移动速度大于阈值时将被忽略.
     * @param {number} mouseTestInterval 鼠标测试间隔. ms
     */
    public onWidgetEntered(widget: mw.Widget, callback: NormalCallback, mouseMovementSpeedThreshold?: number, mouseTestInterval?: number) {
        this.registerMouseOperation(OperationTypes.OnMouseEnter, widget, callback, {
            mouseMovementSpeedThreshold,
            mouseTestInterval,
        });
    }

    /**
     * 当鼠标退出 widget 时触发.
     * @param {mw.Widget} widget
     * @param {NormalCallback} callback
     */
    public onWidgetLeave(widget: mw.Widget, callback: NormalCallback) {
        this.registerMouseOperation(OperationTypes.OnMouseEnter, widget, callback);
    }

    /**
     * 当鼠标悬停在 widget 上时触发.
     * @param {mw.Widget} widget
     * @param {DeltaTimeCallback} callback
     * @param {number} mouseMovementSpeedThreshold 鼠标移动速度阈值. 鼠标移动速度大于阈值时将被忽略.
     * @param {number} mouseTestInterval 鼠标测试间隔. ms
     */
    public onWidgetHover(widget: mw.Widget, callback: DeltaTimeCallback, mouseMovementSpeedThreshold?: number, mouseTestInterval?: number) {
        this.registerMouseOperation(OperationTypes.OnMouseEnter, widget, callback, {
            mouseMovementSpeedThreshold,
            mouseTestInterval,
        });
    }

    /**
     * unregister key callback for ui.
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
            this.unregisterKeyTransientOperation(ui, key, opType);
            this.unregisterKeyHoldOperation(ui, key);
        } else switch (opType) {
            case OperationTypes.OnKeyDown:
            case OperationTypes.OnKeyUp:
                this.unregisterKeyHoldOperation(ui, key);
                break;
            case OperationTypes.OnKeyPress:
                this.unregisterKeyTransientOperation(ui, key);
                break;
            default:
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                break;
        }
    }

    /**
     * unregister mouse callback for ui.
     * @param widget unregister widget.
     * @param opType unregister operation type.
     *      - undefined default. will unregister all operation type.
     */
    public unregisterMouse(widget: mw.Widget, opType: OperationTypes = undefined) {
        const operation = this._mouseMap.get(widget.guid);
        if (Gtk.isNullOrUndefined(operation)) {
            Log4Ts.log(KeyOperationManager, `mouse operation of widget ${widget.guid} not found.`);
            return;
        }

        if (Gtk.isNullOrEmpty(opType)) {
            if (this._currentHoverWidgetGuid === widget.guid) {
                operation?.leaveCallBack?.();
                this._currentHoverWidgetGuid = null;
            }
            this.unregisterMouseOperation(widget);
        } else {
            switch (opType) {
                case OperationTypes.OnMouseEnter:
                    operation.enterCallBack = undefined;
                    break;
                case OperationTypes.OnMouseLeave:
                    operation.leaveCallBack = undefined;
                    break;
                case OperationTypes.OnMouseHover:
                    operation.hoverCallBack = undefined;
                    break;
                default:
                    Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                    return;
            }

            if (!operation.leaveCallBack && !operation.hoverCallBack && !operation.enterCallBack) {
                this.unregisterMouseOperation(widget);
            }
        }
    }

    private registerKeyOperation(key: Keys,
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
                guard = this._keyTransientMap.get(getRegisterKey(key, opType));
                break;
            case OperationTypes.OnKeyPress:
                guard = this._keyHoldMap.get(key);
                if (!this._keyTransientMap.has(getRegisterKey(key, OperationTypes.OnKeyDown))) {
                    this.addGuard(key, OperationTypes.OnKeyDown);
                }
                if (!this._keyTransientMap.has(getRegisterKey(key, OperationTypes.OnKeyUp))) {
                    this.addGuard(key, OperationTypes.OnKeyUp);
                }
                break;
            default:
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                return;
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

        const operation = new KeyOperation(ui, callback, isAfterEffect);
        return guard.register(operation);
    }

    private registerMouseOperation(opType: OperationTypes,
                                   widget: mw.Widget,
                                   callback: AnyCallback,
                                   options?: MouseGuardOptions) {
        let operation = this._mouseMap.get(widget.guid);

        if (Gtk.isNullOrUndefined(operation)) {
            if (this._hoverController.insertWidget(widget)) {
                operation = new MouseOperation(widget, options);
                this._mouseMap.set(widget.guid, operation);
            } else {
                return;
            }
        }

        switch (opType) {
            case OperationTypes.OnMouseEnter:
                operation.enterCallBack = callback as () => void;
                break;
            case OperationTypes.OnMouseLeave:
                operation.leaveCallBack = callback as () => void;
                break;
            case OperationTypes.OnMouseHover:
                operation.hoverCallBack = callback;
                break;
            default:
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                break;
        }
    }

    private unregisterKeyTransientOperation(
        ui: KeyInteractiveUIScript,
        key: Keys = undefined,
        opType: OperationTypes = undefined): boolean {
        if (opType === undefined) {
            this.unregisterKeyTransientOperation(ui, key, OperationTypes.OnKeyDown);
            this.unregisterKeyTransientOperation(ui, key, OperationTypes.OnKeyUp);
            return;
        }

        if (GToolkit.isNullOrUndefined(key)) {
            for (const guard of this._keyTransientMap.values()) {
                guard.unregister(ui);
            }
        } else {
            this._keyTransientMap.get(getRegisterKey(key, opType))?.unregister(ui);
        }
    }

    private unregisterKeyHoldOperation(
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

    private unregisterMouseOperation(widget: mw.Widget) {
        this._mouseMap.delete(widget.guid);
        this._hoverController.removeWidget(widget);
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
                this._keyTransientMap.set(regKey, result);
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

    private _lastUpdatedTime: number = 0;

    private updateHoverWidget(widget: mw.Widget, now: number, mouseMovementSpeedSqr: number) {
        if (this._currentHoverWidgetGuid === (widget === null ? null : widget.guid)) {
            if (Gtk.isNullOrEmpty(this._currentHoverWidgetGuid)) return;

            const curr = this._mouseMap.get(this._currentHoverWidgetGuid);
            if (!curr) Log4Ts.log(KeyOperationManager, `curr widget not found ${widget.guid}`);
            else {
                curr.hoverCallBack?.(now - this._lastUpdatedTime);
                this._lastUpdatedTime = now;
            }
            return;
        }

        if (this._currentHoverWidgetGuid) {
            const last = this._mouseMap.get(this._currentHoverWidgetGuid);
            if (!last) Log4Ts.log(KeyOperationManager, `last widget not found ${widget.guid}`);
            else {
                last.leaveCallBack?.();
            }
            this._currentHoverWidgetGuid = null;
            this._lastUpdatedTime = now;
        }

        if (widget) {
            const curr = this._mouseMap.get(widget.guid);
            if (!curr) Log4Ts.log(KeyOperationManager, `curr widget not found ${widget.guid}`);
            else {
                if ((curr.mouseMovementSpeedThreshold !== undefined &&
                        now - this._lastUpdatedTime < curr.mouseMovementSpeedThreshold) ||
                    (curr.mouseMovementSpeedThreshold !== undefined &&
                        mouseMovementSpeedSqr > curr.mouseMovementSpeedThreshold)) {
                    return;
                }

                this._currentHoverWidgetGuid = widget.guid;
                curr.enterCallBack?.();
            }
        }
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
    /**
     * 鼠标进入.
     */
    OnMouseEnter = "onMouseEnter",
    /**
     * 鼠标离开.
     */
    OnMouseLeave = "onMouseLeave",
    /**
     * 鼠标悬停.
     */
    OnMouseHover = "onMouseHover",
}

//#region Operation

/**
 * 键盘操作.
 */
class KeyOperation<P> {
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

/**
 * 鼠标操作.
 */
class MouseOperation {
    public ui: KeyInteractiveUIScript;

    public widget: mw.Widget;

    public mouseMovementSpeedThreshold: number = undefined;

    public mouseTestInterval: number = undefined;

    /**
     * 鼠标进入回调.
     */
    enterCallBack: () => void = undefined;
    /**
     * 鼠标离开回调.
     */
    leaveCallBack: () => void = undefined;
    /**
     * 鼠标悬停回调.
     */
    hoverCallBack: (p: number) => void = undefined;

    constructor(widget: mw.Widget,
                options?: MouseGuardOptions) {
        this.widget = widget;
        this.mouseMovementSpeedThreshold = options?.mouseMovementSpeedThreshold;
        this.mouseTestInterval = options?.mouseTestInterval;
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Operation Guard

/**
 * 操作管理者.
 */
abstract class AOperationGuard<P> {
    public operations: KeyOperation<P>[] = [];

    public eventListener: EventListener = null;

    public call(p: P = null) {
        let candidates: KeyOperation<P>[] = this.operations.filter(item => GToolkit.isNullOrUndefined(item.ui)) ?? [];
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

    public register(operation: KeyOperation<P>): boolean {
        const count = this.operations.length;
        return this.operations.push(operation) > count;
    }

    public unregister(ui: KeyInteractiveUIScript) {
        for (let i = this.operations.length - 1; i >= 0; i--) {
            if (this.operations[i].ui === ui) this.operations.splice(i, 1);
        }
    }

    private getTopOperation(ops: KeyOperation<P>[]): KeyOperation<P> | null {
        if (GToolkit.isNullOrEmpty(ops)) return null;
        let topOp: KeyOperation<P> = ops[0];
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

interface MouseGuardOptions extends GuardOptions {
    /**
     * 鼠标移动速度阈值. 鼠标移动速度大于阈值时将被忽略.
     */
    mouseMovementSpeedThreshold?: number;

    /**
     * 鼠标测试间隔. ms
     */
    mouseTestInterval?: number;
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