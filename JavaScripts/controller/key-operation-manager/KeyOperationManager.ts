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
 * @version 0.9.8a
 */
export default class KeyOperationManager extends Singleton<KeyOperationManager>() {
    private _operationGuardMap: Map<string, AOperationGuard<unknown>> = new Map();

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

    private addGuard(key: mw.Keys, opType: OperationTypes): AOperationGuard<unknown> {
        const regKey = getRegisterKey(key, opType);
        let result: AOperationGuard<unknown>;
        switch (opType) {
            case OperationTypes.OnKeyDown: {
                result = new TransientOperationGuard();
                const pressRegKey = getRegisterKey(key, OperationTypes.OnKeyPress);
                result.eventListener = InputUtil.onKeyDown(key, () => {
                    const pressGuard = (this._operationGuardMap.get(pressRegKey) as HoldOperationGuard);
                    if (pressGuard) pressGuard.lastTriggerTime = Date.now();
                    result.invoke();
                });
                break;
            }
            case OperationTypes.OnKeyUp: {
                result = new TransientOperationGuard();
                const pressRegKey = getRegisterKey(key, OperationTypes.OnKeyPress);
                result.eventListener = InputUtil.onKeyUp(key, () => {
                    const pressGuard = (this._operationGuardMap.get(pressRegKey) as HoldOperationGuard);
                    if (pressGuard) pressGuard.lastTriggerTime = null;
                    result.invoke();
                });
                break;
            }
            case OperationTypes.OnKeyPress:
                result = new HoldOperationGuard();
                result.eventListener = InputUtil.onKeyPress(key, () => {
                    result.invoke();
                });
                break;
            default:
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                break;
        }
        this._operationGuardMap.set(regKey, result);

        return result;
    }
}

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

/**
 * 操作管理者.
 */
abstract class AOperationGuard<P> {
    public operations: Operation<P>[] = [];

    public eventListener: EventListener = null;

    public abstract invoke(): void;

    protected handle(dt: P = null) {
        const candidates = this.operations.filter(item => uiKeyEnable(item.ui));
        const topOp = this.getTopOperation(candidates.filter(item => !item.isAfterEffect));
        try {
            topOp?.callBack(dt);
        } catch (e) {
            Log4Ts.log(AOperationGuard, `error throw in operation. ${e}`);
        }

        for (const op of candidates) {
            op.isAfterEffect && op.callBack(dt);
        }
    }

    private getTopOperation(ops: Operation<P>[]): Operation<P> | null {
        if (GToolkit.isNullOrEmpty(ops)) return null;
        let topOp: Operation<P> = ops[0]?.ui?.uiObject ? ops[0] : null;
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
 * 猝发式操作管理者.
 */
class TransientOperationGuard extends AOperationGuard<void> {
    public invoke(): void {
        this.handle();
    }
}

/**
 * 持续式操作管理者.
 */
class HoldOperationGuard extends AOperationGuard<number> {
    private _lastTriggerTime: number = null;

    public set lastTriggerTime(value: number) {
        this._lastTriggerTime = value;
    }

    public invoke(): void {
        const now = Date.now();
        if (this._lastTriggerTime === null) {
            this.handle(0);
        } else {
            this.handle(now - this._lastTriggerTime);
        }

        this._lastTriggerTime = now;
    }
}

function uiKeyEnable(ui: KeyInteractiveUIScript) {
    return GToolkit.isNullOrUndefined(ui.keyEnable) ? true : ui.keyEnable();
}

function getRegisterKey(key: mw.Keys, opType: OperationTypes) {
    return `${key}-${opType}`;
}