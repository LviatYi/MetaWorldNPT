import { Singleton } from "../../depend/singleton/Singleton";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import GToolkit from "../../util/GToolkit";
import EventListener = mw.EventListener;
import Keys = mw.Keys;
import TimeUtil = mw.TimeUtil;

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
 * @version 1.0.2a
 */
export default class KeyOperationManager extends Singleton<KeyOperationManager>() {
    private _transientMap: Map<string, TransientOperationGuard> = new Map();

    private _holdMap: Map<mw.Keys, HoldOperationGuard> = new Map();

    protected onConstruct(): void {
        super.onConstruct();
        TimeUtil.onEnterFrame.add(
            () => {
                const now = Date.now();
                for (let guard of this._holdMap.values()) {
                    if (guard.lastTriggerTime === null) continue;
                    guard.call(now - guard.lastTriggerTime);
                    guard.lastTriggerTime = now;
                }
            },
        );
    }

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
                     callback: NormalCallback,
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
                   callback: NormalCallback,
                   force: boolean = false,
                   isAfterEffect: boolean = false): boolean {
        return this.registerOperation(key, OperationTypes.OnKeyUp, ui, callback, force, isAfterEffect);
    }

    /**
     * register {@link InputUtil.OnKeyPress} for ui.
     * @param key
     * @param ui
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
            for (const guard of this._holdMap.values()) {
                guard.unregister(ui);
            }
        } else {
            this._holdMap.get(key)?.unregister(ui);
        }
    }

    private registerOperation(key: Keys,
                              opType: OperationTypes,
                              ui: KeyInteractiveUIScript,
                              callback: AnyCallback,
                              force: boolean = false,
                              isAfterEffect: boolean = false): boolean {
        let guard: AOperationGuard<unknown>;
        switch (opType) {
            case OperationTypes.OnKeyDown:
            case OperationTypes.OnKeyUp:
                guard = this._transientMap.get(getRegisterKey(key, opType));
                break;
            case OperationTypes.OnKeyPress:
                guard = this._holdMap.get(key);
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
                        Log4Ts.log(KeyOperationManager, `already has a callback on key ${key}-${opType} in ui ${ui.constructor.name}. it will be ignore.`);
                        return false;
                    }
                }
            }
        } else guard = this.addGuard(key, opType);

        const operation = new Operation(ui, callback, isAfterEffect);
        return guard.register(operation);
    }

    private addGuard(key: mw.Keys, opType: OperationTypes): AOperationGuard<unknown> {
        let result: AOperationGuard<unknown>;
        switch (opType) {
            case OperationTypes.OnKeyDown:
            case OperationTypes.OnKeyUp: {
                const regKey = getRegisterKey(key, opType);
                result = new TransientOperationGuard();
                result.eventListener = InputUtil.onKeyDown(key, () => {
                    const holdGuard = (this._holdMap.get(key));
                    if (holdGuard) holdGuard.lastTriggerTime = opType === OperationTypes.OnKeyDown ? Date.now() : null;
                    result.call();
                });
                this._transientMap.set(regKey, result);
                break;
            }
            case OperationTypes.OnKeyPress:
                result = new HoldOperationGuard();
                this._holdMap.set(key, result as HoldOperationGuard);
                break;
            default:
                Log4Ts.error(KeyOperationManager, `operation type not supported: ${opType}`);
                break;
        }

        return result;
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
class AOperationGuard<P> {
    public operations: Operation<P>[] = [];

    public eventListener: EventListener = null;

    public call(dt: P = null) {
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
}

/**
 * 持续式操作管理者.
 */
class HoldOperationGuard extends AOperationGuard<number> {
    public lastTriggerTime: number = null;
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

function uiKeyEnable(ui: KeyInteractiveUIScript) {
    return GToolkit.isNullOrUndefined(ui.keyEnable) ? true : ui.keyEnable();
}

function getRegisterKey(key: mw.Keys, opType: OperationTypes) {
    return `${key}-${opType}`;
}