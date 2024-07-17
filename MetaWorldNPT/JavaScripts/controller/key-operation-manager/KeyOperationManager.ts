import Log4Ts from "../../depend/log4ts/Log4Ts";
import Gtk, { GtkTypes, IRecyclable, Regulator, Singleton } from "gtoolkit";
import { KOMUtil } from "./extends/AABB";
import { KeyOperationHoverController } from "./KeyOperationHoverController";

/**
 * KeyOperationManager 键盘操作管理器.
 * @desc 监听 __BUTTON_CLICKED__ 事件. 其在任一按钮被点击时触发.
 * @desc 用于清除由 KOM 控制的 bindButton 的 press 效果.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @author zewei.zhang
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 31.7.7b
 */
export default class KeyOperationManager extends Singleton<KeyOperationManager>() {
    private _keyTransientMap: Map<string, TransientOperationGuard> = new Map();

    private _keyHoldMap: Map<mw.Keys, HoldOperationGuard> = new Map();

    private _promiseNeedMap: Map<mw.Keys, KeyOperation<unknown>[]> = new Map();

    private _pressedByKomButtonMap: Map<
        mw.Button | mw.StaleButton,
        MwButtonInteractTransitionOption> = new Map();

    private _hoverController: KeyOperationHoverController = new KeyOperationHoverController();

    private _mouseMap: Map<mw.Widget, MouseOperation> = new Map();

    private _currentHoverWidget: mw.Widget | undefined;

    public mouseMovementSpeedThreshold: number = 300;

    private _mouseTestRegulator: Regulator = new Regulator(GtkTypes.Interval.Sensitive);

    private _defaultAnyButtonClickedSubscriber: mw.EventListener | undefined;

//#region Builder Config

    public get mouseTestInterval(): number {
        return this._mouseTestRegulator.updateInterval;
    }

    public get widgetTraceInterval(): number {
        return this._hoverController.widgetTraceInterval;
    }

    /**
     * 鼠标测试间隔. ms
     * @type {number}
     */
    public setMouseTestInterval(value: number): this {
        this._mouseTestRegulator.interval(value);
        return this;
    }

    /**
     * 控件 AABB 盒刷新检查间隔.
     * @param {number} value
     */
    public setWidgetTraceInterval(value: number): this {
        this._hoverController.widgetTraceInterval = value;
        return this;
    }

    /**
     * 默认所有鼠标移动速度阈值.
     * @desc 移动速度为每帧移动的距离.
     * @desc 超过阈值时将被忽略. 0 时不忽略.
     * @param {number} value
     * @return {this}
     */
    public setMouseMovementSpeedThreshold(value: number): this {
        this.mouseMovementSpeedThreshold = value;
        return this;
    }

    /**
     * 设置自定义的 任意按钮点击事件回调.
     */
    public setCustomAnyButtonClickedCallback(subscriber: (cb: () => void) => void): this {
        this._defaultAnyButtonClickedSubscriber?.disconnect();
        this._defaultAnyButtonClickedSubscriber = undefined;

        subscriber?.(this.clearButtonPressedByKom);

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public onConstruct(): void {
        super.onConstruct();
        mw.TimeUtil.onEnterFrame.add(() => {
                const now = Date.now();
                for (let guard of this._keyHoldMap.values()) {
                    if (guard.lastTriggerTime === undefined) continue;
                    const dt = now - guard.lastTriggerTime;
                    if (dt < guard.threshold) continue;
                    guard.call(dt);
                    guard.lastTriggerTime = now;
                }
            },
        );

        mw.TimeUtil.onEnterFrame.add((dt) => {
            let curr: mw.Widget | undefined;
            let mouseMovementSpeedSqr: number | undefined = undefined;
            if (!this._hoverController.empty()) {
                const currentMouse: mw.Vector2 = mw.getCurrentMousePosition();
                const lastMouse: mw.Vector2 = mw.getLastMousePosition();
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

        Gtk.getOnWindowsBlurDelegate().add(() =>
            this._promiseNeedMap.forEach((value, key) => {
                this._promiseNeedMap.delete(key);

                const activeUiSet = new Set<KeyInteractiveUIScript>();
                value.map(op => op.ui).forEach(ui => activeUiSet.add(ui!));

                const regKey = getRegisterKey(key, OperationTypes.OnKeyUp);
                const guard = this._keyTransientMap.get(regKey);
                guard?.operations
                    .filter(op => activeUiSet.has(op.ui!))
                    .forEach(op => op.safeInvoke(true));

                const holdGuard = this._keyHoldMap.get(key);
                if (holdGuard) holdGuard.lastTriggerTime = undefined;
            }),
        );

        this._defaultAnyButtonClickedSubscriber =
            mw.Event.addLocalListener(
                "__BUTTON_CLICKED__",
                this.clearButtonPressedByKom);
    }

//#region Key Mouse Controller
    /**
     * register {@link InputUtil.onKeyDown} for ui.
     * @param ui
     *      - undefined or null.
     *        will register as a global key operation.
     *        will blocks other non-global key operations.
     * @param key
     * @param callback
     * @param force
     *      false default. will ignore when same ui listen on the same key.
     * @param isAfterEffect if is not trigger only on top ui.
     *      false default. 仅当 ui 为最上层时触发.
     *      true. 无论是否在最上层时都允许触发.
     */
    public onKeyDown(ui: KeyInteractiveUIScript | undefined,
                     key: mw.Keys,
                     callback: NormalCallback,
                     force: boolean = false,
                     isAfterEffect: boolean = false): boolean {
        return this.registerKeyOperation(
            ui,
            key,
            OperationTypes.OnKeyDown,
            callback,
            force,
            isAfterEffect);
    }

    /**
     * register {@link InputUtil.OnKeyUp} for ui.
     * @param ui
     *      - undefined or null.
     *        will register as a global key operation.
     *        will blocks other non-global key operations.
     * @param key
     * @param callback
     * @param force
     *      false default. will ignore when same ui listen on the same key.
     * @param isAfterEffect if is not trigger only on top ui.
     *      false default. 仅当 ui 为最上层时触发.
     *      true. 无论是否在最上层时都允许触发.
     * @param usePromise promise 模式. 默认使用. 当窗口失焦时 自动回弹.
     */
    public onKeyUp(ui: KeyInteractiveUIScript | undefined,
                   key: mw.Keys,
                   callback: NormalCallback,
                   force: boolean = false,
                   isAfterEffect: boolean = false,
                   usePromise?: boolean): boolean {
        return this.registerKeyOperation(
            ui,
            key,
            OperationTypes.OnKeyUp,
            callback,
            force,
            isAfterEffect,
            {usePromise});
    }

    /**
     * register {@link InputUtil.OnKeyPress} for ui.
     * @param ui
     *      - undefined or null.
     *        will register as a global key operation.
     *        will blocks other non-global key operations.
     * @param key
     * @param callback
     * @param threshold 持续触发阈值. 持续触发时触发间隔小于阈值时将被忽略.
     * @param force
     *      - false default. will ignore when same ui listen on the same key.
     * @param isAfterEffect if is not trigger only on top ui.
     *      false default. 仅当 ui 为最上层时触发.
     *      true. 无论是否在最上层时都允许触发.
     * @param usePromise promise 模式. 默认使用. 当窗口失焦时 自动回弹.
     */
    public onKeyPress(ui: KeyInteractiveUIScript | undefined,
                      key: mw.Keys,
                      callback: DeltaTimeCallback,
                      threshold: number = 0,
                      force: boolean = false,
                      isAfterEffect: boolean = false,
                      usePromise?: boolean): boolean {
        return this.registerKeyOperation(
            ui,
            key,
            OperationTypes.OnKeyPress,
            callback,
            force,
            isAfterEffect,
            {threshold: threshold, usePromise});
    }

    /**
     * 将按键绑定至按钮
     * @desc 按键按下时允许启用过渡.
     * @desc 需要监听任意按钮点击事件 以避免任何按钮被按下后过渡态无法恢复.
     * @desc 默认注册了 {@link "__BUTTON_CLICKED__"} 事件.
     * @desc 使用 {@link setCustomAnyButtonClickedCallback} 自定义任意按钮点击事件.
     * @param {KeyInteractiveUIScript} ui
     * @param {mw.Keys} key
     * @param {mw.Button | mw.StaleButton} button
     * @param {boolean} isAfterEffect
     * @returns {boolean}
     */
    public bindButton(ui: KeyInteractiveUIScript,
                      key: mw.Keys,
                      button: mw.Button | mw.StaleButton,
                      isAfterEffect: boolean = false): boolean {
        let stage = this.onKeyDown(ui,
            key,
            () => {
                if (button.transitionEnable && !this._pressedByKomButtonMap.has(button)) {
                    this._pressedByKomButtonMap.set(button, extractNormalTransitionOption(button));
                    applyNormalTransitionOption(button, extractPressedTransitionOption(button));
                }

                try {
                    Log4Ts.log(KeyOperationManager, `button on pressed.`);
                    button?.onPressed?.broadcast();
                } catch (e) {
                    Log4Ts.error(KeyOperationManager,
                        `error occurs when button ${button.name} pressed.`,
                        e);
                }
            },
            true,
            isAfterEffect);
        if (!stage) return false;
        stage = this.onKeyUp(ui,
            key,
            () => {
                if (this._pressedByKomButtonMap.has(button)) {
                    applyNormalTransitionOption(button, this._pressedByKomButtonMap.get(button)!);
                    this._pressedByKomButtonMap.delete(button);
                }

                if (this._promiseNeedMap.has(key)) {
                    try {
                        Log4Ts.log(KeyOperationManager, `button on clicked.`);
                        button?.onClicked?.broadcast();
                    } catch (e) {
                        Log4Ts.error(KeyOperationManager,
                            `error occurs when button ${button.name} clicked.`,
                            e);
                    }
                }

                try {
                    Log4Ts.log(KeyOperationManager, `button on released.`);
                    button?.onReleased?.broadcast();
                } catch (e) {
                    Log4Ts.error(KeyOperationManager,
                        `error occurs when button ${button.name} released.`,
                        e);
                }
            });
        if (stage) return true;

        this.unregisterKey(ui, key, OperationTypes.OnKeyDown);
        return false;
    }

    /**
     * 当鼠标进入 widget 时触发.
     * @param {mw.Widget} widget
     * @param {NormalCallback} callback
     * @param {number} mouseMovementSpeedThreshold 鼠标移动速度阈值. 鼠标移动速度大于阈值时将被忽略.
     * @param {number} mouseTestInterval 鼠标测试间隔. ms
     */
    public onWidgetEnter(widget: mw.Widget,
                         callback: NormalCallback,
                         mouseMovementSpeedThreshold?: number,
                         mouseTestInterval?: number) {
        this.registerMouseOperation(OperationTypes.OnMouseEnter,
            widget,
            callback,
            {
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
        this.registerMouseOperation(OperationTypes.OnMouseLeave, widget, callback);
    }

    /**
     * 当鼠标悬停在 widget 上时触发.
     * @param {mw.Widget} widget
     * @param {DeltaTimeCallback} callback
     * @param {number} mouseMovementSpeedThreshold 鼠标移动速度阈值. 鼠标移动速度大于阈值时将被忽略.
     * @param {number} mouseTestInterval 鼠标测试间隔. ms
     */
    public onWidgetHover(widget: mw.Widget,
                         callback: DeltaTimeCallback,
                         mouseMovementSpeedThreshold?: number,
                         mouseTestInterval?: number) {
        this.registerMouseOperation(OperationTypes.OnMouseHover,
            widget,
            callback,
            {
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
                         key?: mw.Keys,
                         opType?: OperationTypes) {
        if (Gtk.isNullOrUndefined(opType)) {
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
    public unregisterMouse(widget: mw.Widget, opType?: OperationTypes) {
        const operation = this._mouseMap.get(widget);
        if (Gtk.isNullOrUndefined(operation)) {
            Log4Ts.log(KeyOperationManager, `mouse operation of widget ${widget.guid} not found.`);
            return;
        }

        if (Gtk.isNullOrUndefined(opType)) {
            if (this._currentHoverWidget === widget) {
                operation?.leaveCallBack?.();
                this._currentHoverWidget = undefined;
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

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Debug

    private _debugTimerId: number | undefined = undefined;

    public get isDebugRunning(): boolean {
        return !!this._debugTimerId;
    }

    /**
     * 绘制树结构.
     * @param {boolean} enable
     */
    public debug(enable: boolean = true) {
        if (enable) {
            if (this.isDebugRunning) return;
            this._debugTimerId = mw.setInterval(() => {
                    this._hoverController.drawTree();
                },
                GtkTypes.Interval.Fast);
        } else {
            if (!this.isDebugRunning) return;
            clearInterval(this._debugTimerId);
            this._debugTimerId = undefined;
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Handler

    private registerKeyOperation(ui: KeyInteractiveUIScript | undefined,
                                 key: mw.Keys,
                                 opType: OperationTypes,
                                 callback: AnyCallback,
                                 force: boolean = false,
                                 isAfterEffect: boolean = false,
                                 options?: GuardOptions): boolean {
        let guard: AOperationGuard<unknown> | undefined;
        switch (opType) {
            case OperationTypes.OnKeyDown:
            case OperationTypes.OnKeyUp:
                guard = this._keyTransientMap.get(getRegisterKey(key, opType));
                break;
            case OperationTypes.OnKeyPress:
                guard = this._keyHoldMap.get(key);
                if (!this._keyTransientMap.has(getRegisterKey(key, OperationTypes.OnKeyDown))) {
                    this.addGuard(key, OperationTypes.OnKeyDown, options);
                }
                if (!this._keyTransientMap.has(getRegisterKey(key, OperationTypes.OnKeyUp))) {
                    this.addGuard(key, OperationTypes.OnKeyUp, options);
                }
                break;
            default:
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                return false;
        }
        if (guard) {
            if (!force && guard.operations.some(op => op.ui === ui)) {
                Log4Ts.warn(
                    KeyOperationManager,
                    `already has a callback on key ${key}-${OperationTypes[opType]} in ui ${ui!.constructor.name}.`,
                    `it will be ignore.`);
                return false;
            }
        } else guard = this.addGuard(key, opType, options);

        const operation = new KeyOperation(ui, callback, isAfterEffect);
        return guard?.register(operation) ?? false;
    }

    private registerMouseOperation(opType: OperationTypes,
                                   widget: mw.Widget,
                                   callback: AnyCallback,
                                   options?: MouseGuardOptions) {
        let operation = this._mouseMap.get(widget);

        if (Gtk.isNullOrUndefined(operation)) {
            if (this._hoverController.insertWidget(widget)) {
                operation = new MouseOperation(widget, options);
                this._mouseMap.set(widget, operation);
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
        ui?: KeyInteractiveUIScript,
        key?: mw.Keys,
        opType?: OperationTypes): boolean {
        if (opType === undefined) {
            this.unregisterKeyTransientOperation(ui, key, OperationTypes.OnKeyDown);
            this.unregisterKeyTransientOperation(ui, key, OperationTypes.OnKeyUp);
            return false;
        }

        if (Gtk.isNullOrUndefined(key)) {
            for (const guard of this._keyTransientMap.values()) {
                guard.unregister(ui);
            }
        } else {
            this._keyTransientMap.get(getRegisterKey(key, opType))?.unregister(ui);
        }
        return true;
    }

    private unregisterKeyHoldOperation(
        ui?: KeyInteractiveUIScript,
        key?: mw.Keys) {
        if (Gtk.isNullOrUndefined(key)) {
            for (const guard of this._keyHoldMap.values()) {
                guard.unregister(ui);
            }
        } else {
            this._keyHoldMap.get(key)?.unregister(ui);
        }
    }

    private unregisterMouseOperation(widget: mw.Widget) {
        this._mouseMap.delete(widget);
        this._hoverController.removeWidget(widget);
    }

    private addGuard(key: mw.Keys, opType: OperationTypes, options?: GuardOptions): AOperationGuard<unknown> | undefined {
        let result: AOperationGuard<unknown> | undefined = undefined;
        let regKey: string;
        switch (opType) {
            case OperationTypes.OnKeyDown:
            case OperationTypes.OnKeyUp: {
                regKey = getRegisterKey(key, opType);
                result = new TransientOperationGuard();
                let guardFunc: () => void;
                if (opType === OperationTypes.OnKeyDown) {
                    let onKeyUpKey = getRegisterKey(key, OperationTypes.OnKeyUp);
                    guardFunc = () => {
                        const holdGuard = (this._keyHoldMap.get(key));
                        if (holdGuard) holdGuard.lastTriggerTime = Date.now();

                        let choose = result!.call();

                        if (this._keyTransientMap.has(onKeyUpKey) && (options?.usePromise ?? undefined) !== false) {
                            this._promiseNeedMap.set(key, choose);
                        }
                    };
                    result.eventListener = InputUtil.onKeyDown(key, guardFunc);
                } else {
                    guardFunc = () => {
                        const holdGuard = (this._keyHoldMap.get(key));
                        if (holdGuard) holdGuard.lastTriggerTime = undefined;

                        result!.call();
                        this._promiseNeedMap.delete(key);
                    };
                    result.eventListener = InputUtil.onKeyUp(key, guardFunc);
                }

                this._keyTransientMap.set(regKey, result);
                break;
            }
            case OperationTypes.OnKeyPress:
                result = new HoldOperationGuard().setThreshold(options?.threshold ?? 0);
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

    private updateHoverWidget(widget: mw.Widget | undefined, now: number, mouseMovementSpeedSqr?: number) {
        if (this._currentHoverWidget === widget) {
            if (Gtk.isNullOrUndefined(this._currentHoverWidget)) return;

            const curr = this._mouseMap.get(this._currentHoverWidget);
            if (!curr) Log4Ts.log(KeyOperationManager, `curr widget not found ${widget}`);
            else {
                curr.hoverCallBack?.(now - this._lastUpdatedTime);
                this._lastUpdatedTime = now;
            }
            return;
        }

        if (this._currentHoverWidget) {
            const last = this._mouseMap.get(this._currentHoverWidget);
            if (!last) Log4Ts.log(KeyOperationManager, `last widget not found ${widget}`);
            else {
                last.leaveCallBack?.();
            }
            this._currentHoverWidget = undefined;
            this._lastUpdatedTime = now;
        }

        if (widget) {
            const curr = this._mouseMap.get(widget);
            if (!curr) Log4Ts.log(KeyOperationManager, `curr widget not found ${widget}`);
            else {
                if ((curr.mouseMovementSpeedThreshold !== undefined &&
                        now - this._lastUpdatedTime < curr.mouseMovementSpeedThreshold) ||
                    (curr.mouseMovementSpeedThreshold !== undefined &&
                        (mouseMovementSpeedSqr ?? 0) > curr.mouseMovementSpeedThreshold)) {
                    return;
                }

                this._currentHoverWidget = widget;
                curr.enterCallBack?.();
            }
        }
    }

    /**
     * 清除由 KOM 触发的按钮状态.
     * 因外部导致的按钮点击 因此清除.
     * @private
     */
    private clearButtonPressedByKom = () => {
        for (const [btn, normalTrans]
            of this._pressedByKomButtonMap) {
            applyNormalTransitionOption(btn, normalTrans);
            this._pressedByKomButtonMap.delete(btn);
        }
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
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

//#region Mw Button Interact Transition
interface MwButtonInteractTransitionOption {
    imageGuid: string;
    imageSize: mw.Vector2;
    imageColor: mw.LinearColor;
    imageDrawType: mw.SlateBrushDrawType;
    imageMargin: mw.Margin;
}

function extractNormalTransitionOption(button: mw.Button | mw.StaleButton): MwButtonInteractTransitionOption {
    return {
        imageGuid: button.normalImageGuid,
        imageSize: button.normalImageSize,
        imageColor: button.normalImageColor,
        imageDrawType: button.normalImageDrawType,
        imageMargin: button.normalImageMargin,
    };
}

function extractPressedTransitionOption(button: mw.Button | mw.StaleButton): MwButtonInteractTransitionOption {
    return {
        imageGuid: button.pressedImageGuid,
        imageSize: button.pressedImageSize,
        imageColor: button["pressedImageColor"] ?? button["pressedImagColor"], // O.o
        imageDrawType: button.pressedImageDrawType,
        imageMargin: button.pressedImageMargin,
    };
}

function applyNormalTransitionOption(button: mw.Button | mw.StaleButton, option: MwButtonInteractTransitionOption) {
    button.normalImageGuid = option.imageGuid;
    button.normalImageSize = option.imageSize;
    button.normalImageColor = option.imageColor;
    button.normalImageDrawType = option.imageDrawType;
    button.normalImageMargin = option.imageMargin;
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

/**
 * 可选 key 按键可交互性接口.
 */
export interface IKeyInteractive {
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
    Null,
    /**
     * 按下.
     */
    OnKeyDown,
    /**
     * 松开.
     */
    OnKeyUp,
    /**
     * 按压.
     */
    OnKeyPress,
    /**
     * 鼠标进入.
     */
    OnMouseEnter,
    /**
     * 鼠标离开.
     */
    OnMouseLeave,
    /**
     * 鼠标悬停.
     */
    OnMouseHover,
}

//#region Operation

/**
 * 键盘操作.
 */
class KeyOperation<P> {
    public ui: KeyInteractiveUIScript | undefined;

    public callBack: (p?: P) => void;

    public safeInvoke(useDebug: boolean = false, p?: P) {
        try {
            this.callBack?.(p);
        } catch (e) {
            useDebug && Log4Ts.error(AOperationGuard, `error throw in operation.`, e);
        }
    }

    public isAfterEffect: boolean;

    constructor(ui: KeyInteractiveUIScript | undefined,
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

    public mouseMovementSpeedThreshold: number | undefined;

    public mouseTestInterval: number | undefined;

    /**
     * 鼠标进入回调.
     */
    enterCallBack: (() => void) | undefined;
    /**
     * 鼠标离开回调.
     */
    leaveCallBack: (() => void) | undefined;
    /**
     * 鼠标悬停回调.
     */
    hoverCallBack: ((p: number) => void) | undefined;

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

    public eventListener: EventListener | undefined = undefined;

    public call(p?: P): KeyOperation<unknown>[] {
        let candidates: KeyOperation<P>[] = this.operations
            .filter(item => Gtk.isNullOrUndefined(item.ui));

        if (candidates.length === 0) {
            const keyEnableUis = this.operations
                .filter(item => uiKeyEnable(item.ui));
            if (keyEnableUis.length === 0) return [];
            candidates = keyEnableUis.filter(item => item.isAfterEffect);
            const topOperation = this.getTopOperation(keyEnableUis.filter(item => !item.isAfterEffect));
            if (topOperation) candidates.push(topOperation);
        }

        candidates.forEach(item => item?.safeInvoke(true, p));

        return candidates;
    }

    public register(operation: KeyOperation<P>): boolean {
        const count = this.operations.length;
        return this.operations.push(operation) > count;
    }

    public unregister(ui: KeyInteractiveUIScript | undefined) {
        for (let i = this.operations.length - 1; i >= 0; i--) {
            if (this.operations[i].ui === ui) this.operations.splice(i, 1);
        }
    }

    private getTopOperation(ops: KeyOperation<P>[]): KeyOperation<P> | undefined {
        if (Gtk.isNullOrEmpty(ops)) return undefined;

        let topOp: KeyOperation<P> = ops[0];
        for (let i = 1; i < ops.length; ++i) {
            const op = ops[i];
            if (Gtk.isNullOrUndefined(op?.ui?.uiObject)) continue;
            else if (
                (Gtk.isNullOrUndefined(topOp?.ui?.uiObject)) ||
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

    public lastTriggerTime?: number;
}

interface GuardOptions {
    /**
     * 持续触发阈值.
     * @desc 持续触发时触发间隔小于阈值时将被忽略.
     */
    threshold?: number;

    /**
     * 按动失焦承诺.
     * @desc 窗口失焦时 自动调用 onKeyUp.
     */
    usePromise?: boolean;
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

function uiKeyEnable(ui: KeyInteractiveUIScript | undefined) {
    if (Gtk.isNullOrUndefined(ui)) return false;
    return Gtk.isNullOrUndefined(ui.keyEnable) ? true : ui.keyEnable();
}

function getRegisterKey(key: mw.Keys, opType: OperationTypes) {
    return `${key}-${opType}`;
}