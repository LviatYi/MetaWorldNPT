import { Singleton } from "../../depend/singleton/Singleton";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import GToolkit, { Expression } from "../../util/GToolkit";
import EventListener = mw.EventListener;
import Keys = mw.Keys;

/**
 * 可选 key 按键可交互性接口.
 */
interface IKeyInteractive {
    keyEnable?(): boolean;
}

type KeyInteractiveUIScript = UIScript & IKeyInteractive;

enum OperationTypes {
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

class Operation {
    public ui: KeyInteractiveUIScript;

    public callBack: (dt?: number) => void;

    public isAfterEffect: boolean;

    constructor(ui: KeyInteractiveUIScript,
                callBack: (dt?: number) => void,
                isAfterEffect: boolean = false) {
        this.ui = ui;
        this.callBack = callBack;
        this.isAfterEffect = isAfterEffect;
    }
}

class OperationGuard {
    public operations: Operation[] = [];

    public eventListener: EventListener = null;

    public invoke(dt: number = null) {
        const candidates = this.operations.filter(item => uiKeyEnable(item.ui));
        const topOp = this.getTopOperation(candidates.filter(item => !item.isAfterEffect));
        topOp?.callBack(dt);

        for (const op of candidates) {
            op.isAfterEffect && op.callBack(dt);
        }
    }

    private getTopOperation(ops: Operation[]): Operation | null {
        if (GToolkit.isNullOrEmpty(ops)) return null;
        let topOp: Operation = ops[0]?.ui?.uiObject ? ops[0] : null;
        for (let i = 1; i < ops.length; ++i) {
            const op = ops[i];
            if (!(op?.ui?.uiObject ?? null)) continue;
            else if (
                !topOp ||
                op.ui.layer > topOp.ui.layer ||
                (op.ui.uiObject["slot"]?.zOrder ?? -1) > (topOp.ui.uiObject["slot"]?.zOrder ?? -1)
            ) topOp = op;
        }

        return topOp;
    }
}

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
 * @version 0.9.4a
 */
export class KeyOperationManager extends Singleton<KeyOperationManager>() {
    private _operationGuardMap: Map<string, OperationGuard> = new Map();

    /**
     * register {@link InputUtil.onKeyDown} for ui.
     * @param key
     * @param ui
     * @param callback
     * @param force
     *      false default. will ignore when same ui listen on the same key.
     * @param isAfterEffect if is not trigger only on top ui.
     *      false default. 仅当 ui 为最上层时触发.
     *      true. 无论是否在最上层时都触发.
     */
    public onKeyDown(key: Keys,
                     ui: KeyInteractiveUIScript,
                     callback: Expression<void>,
                     force: boolean = false,
                     isAfterEffect: boolean = false): boolean {
        return this.registerOperation(key, OperationTypes.OnKeyDown, ui, callback, force, isAfterEffect);
    }

    /**
     * register {@link InputUtil.OnKeyUp} for ui.
     * @param key
     * @param ui
     * @param callback
     * @param force
     *      false default. will ignore when same ui listen on the same key.
     * @param isAfterEffect if is not trigger only on top ui.
     *      false default. 仅当 ui 为最上层时触发.
     *      true. 无论是否在最上层时都触发.
     */
    public onKeyUp(key: Keys,
                   ui: KeyInteractiveUIScript,
                   callback: Expression<void>,
                   force: boolean = false,
                   isAfterEffect: boolean = false): boolean {
        return this.registerOperation(key, OperationTypes.OnKeyUp, ui, callback, force, isAfterEffect);
    }

    /**
     * register {@link InputUtil.OnKeyPress} for ui.
     * @param key
     * @param ui
     * @param callback
     * @param force
     *      - false default. will ignore when same ui listen on the same key.
     * @param isAfterEffect if is not trigger only on top ui.
     *      false default. 仅当 ui 为最上层时触发.
     *      true. 无论是否在最上层时都触发.
     */
    public onKeyPress(key: Keys,
                      ui: KeyInteractiveUIScript,
                      callback: Expression<void>,
                      force: boolean = false,
                      isAfterEffect: boolean = false): boolean {
        return this.registerOperation(key, OperationTypes.OnKeyPress, ui, callback, force, isAfterEffect);
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
        if (!GToolkit.isNullOrUndefined(key)) {
            if (!GToolkit.isNullOrUndefined(opType)) {
                this.unregisterSpecifyUi(getRegisterKey(key, opType), ui);
            } else {
                for (const [key, guard] of this._operationGuardMap) {
                    if (!key.startsWith(`${key}-`)) continue;

                    for (let i = guard.operations.length - 1; i >= 0; --i) {
                        if (guard.operations[i].ui === ui) guard.operations.splice(i, 1);
                    }
                }
            }
            return;
        }

        for (const guard of this._operationGuardMap.values()) {
            for (let i = guard.operations.length - 1; i >= 0; --i) {
                if (guard.operations[i].ui === ui) guard.operations.splice(i, 1);
            }
        }
    }

    private unregisterSpecifyUi(regKey: string, ui: KeyInteractiveUIScript): boolean {
        const op = this._operationGuardMap.get(regKey);
        if (!op) return false;
        for (let i = op.operations.length - 1; i >= 0; --i) {
            if (op.operations[i].ui === ui) op.operations.splice(i, 1);
        }
    }

    private registerOperation(key: Keys,
                              opType: OperationTypes,
                              ui: KeyInteractiveUIScript,
                              callback: Expression<void>,
                              force: boolean = false,
                              isAfterEffect: boolean = false): boolean {
        const regKey = getRegisterKey(key, opType);
        let guard = this._operationGuardMap.get(regKey);
        if (guard) {
            if (!force) {
                for (let item of guard.operations) {
                    if (item.ui === ui) {
                        Log4Ts.log(KeyOperationManager, `already has a callback on key ${regKey} in ui ${ui.constructor.name}. it will be ignore.`);
                        return false;
                    }
                }
            }
        } else guard = this.addGuard(key, opType);

        const operation = new Operation(ui, callback, isAfterEffect);
        const oriCount = guard.operations.length;
        return guard.operations.push(operation) - oriCount > 0;
    }

    private addGuard(key: mw.Keys, opType: OperationTypes): OperationGuard {
        const result = new OperationGuard();
        const regKey = getRegisterKey(key, opType);
        this._operationGuardMap.set(regKey, result);
        let keyBindFunc: (key: Keys, operation: Expression<void>) => EventListener;
        switch (opType) {
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
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                break;
        }

        result.eventListener = keyBindFunc(key, () => {
            result.invoke();
        });

        return result;
    }
}

function uiKeyEnable(ui: KeyInteractiveUIScript) {
    return GToolkit.isNullOrUndefined(ui.keyEnable) ? true : ui.keyEnable();
}

function getRegisterKey(key: mw.Keys, opType: OperationTypes) {
    return `${key}-${opType}`;
}