import { Singleton } from "../../depend/singleton/Singleton";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import GToolkit, { Expression } from "../../util/GToolkit";
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
 * @version 0.8.1a
 */
export default class KeyOperationManager extends Singleton<KeyOperationManager>() {
    private _registeredMap: Map<mw.Keys, UiBindInfo[]> = new Map();

    private _unregisterUiSet: Set<KeyInteractiveUIScript> = new Set();

    private _currentKey: Keys = null;

    private _currentOperationType: OperationTypes = OperationTypes.Null;

    private _count: number = 0;

    private _counter: number = 0;

    private _topUiCache: KeyInteractiveUIScript = null;

    /**
     * register {@link InputUtil.onKeyDown} for ui.
     * @param key
     * @param ui
     * @param callback
     * @param force
     *      false default. will ignore when same ui listen on the same key.
     */
    public onKeyDown(key: Keys,
                     ui: KeyInteractiveUIScript,
                     callback: Expression<void>,
                     force: boolean = false): boolean {
        return this.registerOperation(key, OperationTypes.OnKeyDown, ui, callback, force);
    }

    /**
     * register {@link InputUtil.OnKeyUp} for ui.
     * @param key
     * @param ui
     * @param callback
     * @param force
     *      false default. will ignore when same ui listen on the same key.
     */
    public OnKeyUp(key: Keys,
                   ui: KeyInteractiveUIScript,
                   callback: Expression<void>,
                   force: boolean = false): boolean {
        return this.registerOperation(key, OperationTypes.OnKeyUp, ui, callback, force);
    }

    /**
     * register {@link InputUtil.OnKeyPress} for ui.
     * @param key
     * @param ui
     * @param callback
     * @param force
     *      - false default. will ignore when same ui listen on the same key.
     */
    public OnKeyPress(key: Keys,
                      ui: KeyInteractiveUIScript,
                      callback: Expression<void>,
                      force: boolean = false): boolean {
        return this.registerOperation(key, OperationTypes.OnKeyPress, ui, callback, force);
    }

    /**
     * unregister specified key listener for ui.
     * @param key
     * @param ui
     */
    public unregisterKey(key: Keys,
                         ui: KeyInteractiveUIScript) {
        let list = this._registeredMap.get(key);
        if (!list) {
            return false;
        } else {
            const index = list.findIndex(item => item.ui === ui);
            if (index < 0) {
                return false;
            } else {
                return this.innerRemoveListener(list[index], list);
            }
        }
    }

    /**
     * unregister all key listener of ui.
     * @param ui
     * @param force.
     *      - false default. 使用懒卸载移除监听.
     *      - true remove listeners instantly.
     */
    public unregisterUi(ui: KeyInteractiveUIScript, force: boolean): boolean {
        if (force) {
            this.innerClearUiListener(ui);
            if (this._unregisterUiSet.has(ui)) this._unregisterUiSet.delete(ui);
            return true;
        }

        if (this._unregisterUiSet.has(ui)) return false;
        this._unregisterUiSet.add(ui);
        return true;
    }

    private registerOperation(key: Keys,
                              operationType: OperationTypes,
                              ui: KeyInteractiveUIScript,
                              callback: Expression<void>,
                              force: boolean = false): boolean {
        if (this._unregisterUiSet.has(ui)) {
            this.innerClearUiListener(ui);
            this._unregisterUiSet.delete(ui);
        }

        let keyBindFunc: (key: Keys, operation: Expression<void>) => EventListener;
        switch (operationType) {
            case OperationTypes.OnKeyDown:
                keyBindFunc = InputUtil.onKeyDown;
                break;
            case OperationTypes.OnKeyUp:
                keyBindFunc = InputUtil.onKeyUp;
                break;
            case OperationTypes.OnKeyPress:
                keyBindFunc = InputUtil.onKeyPress;
                break;
            default:
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${operationType}`);
                break;
        }

        let list = this._registeredMap.get(key);
        if (list) {
            if (!force) {
                for (let item of list) {
                    if (item.ui === ui) {
                        Log4Ts.log(KeyOperationManager, `already has a callback on key ${key} in ui ${ui.constructor.name}. it will be ignore.`);
                        return false;
                    }
                }
            }
        } else {
            list = [];
            this._registeredMap.set(key, list);
        }

        const uiBindInfo = new UiBindInfo(ui);
        list.push(uiBindInfo);

        const operation = this.createOperation(key, operationType, ui, callback, uiBindInfo, list);

        uiBindInfo.holdListener = keyBindFunc(key, operation);
        return !!uiBindInfo.holdListener;
    };

    /**
     * create Operation.
     * @param key
     * @param operationType
     * @param ui
     * @param callback
     * @param uiBindInfo
     * @param list
     * @private
     */
    private createOperation(key: Keys, operationType: OperationTypes, ui: KeyInteractiveUIScript, callback: Expression<void>, uiBindInfo: UiBindInfo, list: UiBindInfo[]) {
        return () => {
            if (this._currentKey === null) {
                this.trace(key, operationType);
            } else if (this._currentKey !== key) {
                Log4Ts.error(KeyOperationManager,
                    `counter error with different key.`,
                    `current key: ${this._currentKey}`,
                    `current operation type: ${this._currentOperationType}`,
                    `trigger key: ${key}`,
                    `trigger operation type: ${operationType}`,
                    `current count: ${this._count}`,
                    `current counter: ${this._counter}`,
                );
                this.trace(key, operationType);
            }

            try {
                let remove = false;
                const triggerResult = this.keyTriggerGuard(key, ui);
                if (triggerResult === GuardResults.Success) {
                    try {
                        callback();
                    } catch (e) {
                        Log4Ts.log(KeyOperationManager, `error: ${e}`);
                        remove = true;
                    }
                } else {
                    switch (triggerResult) {
                        case GuardResults.Competed:
                        case GuardResults.Disable:
                            break;
                        case GuardResults.Invalid:
                        case GuardResults.Null:
                        default:
                            remove = true;
                            break;
                    }
                }

                if (remove) this.innerRemoveListener(uiBindInfo, list);
            } finally {
                ++this._counter;
                if (this._counter >= this._count) this.cancelTrace();
            }
        };
    }

    /**
     * 按键触发守卫.
     * @param key
     * @param ui
     * @private
     */
    private keyTriggerGuard(key: Keys, ui: KeyInteractiveUIScript): GuardResults {
        if (!this.isUiValid(ui)) return GuardResults.Invalid;
        if (!this.isUiInteractive(ui)) return GuardResults.Disable;

        const allBinds = this._registeredMap.get(key);
        if (GToolkit.isNullOrEmpty(allBinds)) return GuardResults.Invalid;
        if (allBinds.length === 1) {
            if (allBinds[0].ui === ui) {
                if (!this._unregisterUiSet.has(ui)) return GuardResults.Success;
                this.innerRemoveListener(allBinds[0], allBinds);
                return GuardResults.Invalid;
            } else return GuardResults.Invalid;
        }

        this.updateTopUiCache(allBinds);

        if (ui === this._topUiCache) {
            if (this._unregisterUiSet.has(ui)) {
                this.innerRemoveListener(
                    allBinds[allBinds.findIndex(item => item.ui === ui)],
                    allBinds);
                return GuardResults.Invalid;
            } else return GuardResults.Success;
        } else return GuardResults.Competed;
    }

    /**
     * 是否 ui 可交互.
     * @param ui
     * @private
     */
    private isUiInteractive(ui: KeyInteractiveUIScript): boolean {
        return !(ui.keyEnable && !ui.keyEnable());
    }

    /**
     * 是否 ui 仍存活.
     * @param ui
     * @private
     */
    private isUiValid(ui: KeyInteractiveUIScript): boolean {
        return !!(ui?.uiObject ?? null);
    }

    /**
     * 清除 ui 的所有监听.
     * @param ui
     * @private
     */
    private innerClearUiListener(ui: KeyInteractiveUIScript) {
        for (let list of this._registeredMap.values()) {
            for (let i = list.length; i >= 0; --i) {
                const uiBindInfo = list[i];
                if (uiBindInfo.ui === ui) this.innerRemoveListener(uiBindInfo, list);
            }
        }
    }

    /**
     * 移除监听.
     * @param uiBindInfo
     * @param list
     * @private
     */
    private innerRemoveListener(uiBindInfo: UiBindInfo, list: UiBindInfo[]): boolean {
        if (GToolkit.isNullOrUndefined(uiBindInfo)) return false;
        uiBindInfo.disconnect();
        return GToolkit.remove(list, uiBindInfo);
    }

    private trace(key: Keys, operationType: OperationTypes) {
        this._currentKey = key;
        this._currentOperationType = operationType;
        this._count = this._registeredMap.get(key).length;
        this._counter = 0;
        this._topUiCache = null;
    }

    private cancelTrace() {
        this._currentKey = null;
        this._currentOperationType = OperationTypes.Null;
        this._count = 0;
        this._counter = 0;
        this._topUiCache = null;
    }

    private updateTopUiCache(uiBindInfos: UiBindInfo[]) {
        if (this._topUiCache === null) this._topUiCache = GToolkit.getTopUi(
            uiBindInfos
                .filter(item => item.ui.keyEnable())
                .map((item) => item.ui));
    }
}

/**
 * 可选 key 按键可交互性接口.
 */
interface IKeyInteractive {
    keyEnable?(): boolean;
}

type KeyInteractiveUIScript = UIScript & IKeyInteractive;

enum GuardResults {
    /**
     * 空置.
     */
    Null,
    /**
     * 成功.
     */
    Success,
    /**
     * 受竞争.
     */
    Competed,
    /**
     * 禁用.
     */
    Disable,
    /**
     * 失效.
     */
    Invalid,
}

enum OperationTypes {
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
}

class UiBindInfo {
    /**
     * 绑定键位的 ui 实例.
     */
    public ui: KeyInteractiveUIScript;

    /**
     * 持有事件.
     */
    public holdListener: EventListener;

    /**
     * 断开事件.
     */
    public disconnect() {
        this.holdListener?.disconnect();
    }

    constructor(ui: KeyInteractiveUIScript) {
        this.ui = ui;
    }
}