import { JModuleC, JModuleData, JModuleS } from "../../jibu-module/JModule";
import { ITestPackage, ITestPlatformPackage } from "../base/ITestPackage";
import { Delegate, GtkTypes } from "gtoolkit";
import Log4Ts from "mw-log4ts/Log4Ts";
import { PlatformFlag } from "../base/PlatformFlag";
import {
    BenchFuncPackage,
    DelayFuncPackage,
    InitFuncPackage,
    IntervalFuncPackage,
    TestHandler,
    TouchFuncPackage,
} from "../base/TestPackageFunc";
import KeyOperationManager from "../../../controller/key-operation-manager/KeyOperationManager";
import { DefaultDelay } from "../base/Config";

export default class GscTestModuleData extends JModuleData {
    //@Decorator.persistence()
    //public isSave: bool;
}

/**
 * GscTestModule Module.
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
export class GscTestModuleC extends JModuleC<GscTestModuleS, GscTestModuleData> {
//#region Member
    private _eventListeners: EventListener[] = [];
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region MetaWorld Event
    protected onAwake(): void {
        super.onAwake();

//#region Inner Member init
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
    }

    protected onJStart(): void {
//#region Member init
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

        initialized = true;
        initDelegate.invoke();

//#region Event Subscribe
        // this._eventListeners.push(Event.addLocalListener(EventDefine.EVENT_NAME, CALLBACK));
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);

        updateDelegate.invoke(dt);

        runBench();
    }

    protected onEnterScene(sceneType: number): void {
        super.onEnterScene(sceneType);
    }

    protected onDestroy(): void {
        super.onDestroy();
//#region Event Unsubscribe
        this._eventListeners.forEach(value => value.disconnect());
//#endregion ------------------------------------------------------------------------------------------
    }

    protected onExecute(type: number, ...params: any[]): void {
        super.onExecute(type, ...params);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Method
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Net Method
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export class GscTestModuleS extends JModuleS<GscTestModuleC, GscTestModuleData> {
//#region Member
    private _eventListeners: EventListener[] = [];
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region MetaWorld Event
    protected onAwake(): void {
        super.onAwake();
    }

    protected onJStart(): void {
//#region Member init
//#endregion ------------------------------------------------------------------------------------------ 

        initialized = true;
        initDelegate.invoke();

//#region Event Subscribe
        // this._eventListeners.push(Event.addLocalListener(EventDefine.EVENT_NAME, CALLBACK));
//#endregion ------------------------------------------------------------------------------------------
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);

        updateDelegate.invoke(dt);
    }

    protected onDestroy(): void {
        super.onDestroy();
//#region Event Unsubscribe
        this._eventListeners.forEach(value => value.disconnect());
//#endregion ------------------------------------------------------------------------------------------
    }

    protected onExecute(type: number, ...params: any[]): void {
        super.onExecute(type, ...params);
    }

    protected onPlayerJoined(player: Player): void {
        super.onPlayerJoined(player);
    }

    protected onPlayerEnterGame(player: Player): void {
        super.onPlayerEnterGame(player);
    }

    protected onPlayerLeft(player: Player): void {
        super.onPlayerLeft(player);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Method
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Net Method
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

const initDelegate: Delegate.SimpleDelegate = new Delegate.SimpleDelegate();

const updateDelegate: Delegate.SimpleDelegate<number> = new Delegate.SimpleDelegate();

let initialized: boolean = false;

let bench: (() => void) | undefined = undefined;

let benchTime: number;

let benchAllCount: number = 0;

let benchAllTime: number = 0;

export function regTest(title: string, ignore: boolean, ...platformedPackages: ITestPlatformPackage[]): ITestPackage {
    const pak: ITestPackage = {
        title,
        platformedPackages,
        ignore: ignore,
    };

    testPackageRegister(pak);
    return pak;
}

export function testPackageRegister(...testPackages: ITestPackage[]) {
    for (const pak of testPackages) {
        if (pak.ignore) {
            Log4Ts.log(testPackageRegister, `${pak.title} ignore. skip.`);
            continue;
        } else {
            Log4Ts.warn(testPackageRegister, `${pak.title} registered.`);
        }
        for (let pPak of pak.platformedPackages) {
            if (pPak.ignore === false) {
                continue;
            }
            const inC = (pPak.platform & PlatformFlag.Client) > 0;
            const inS = (pPak.platform & PlatformFlag.Server) > 0;
            if (pPak.funcPak instanceof InitFuncPackage) {
                if (!initialized) {
                    (isClient() && inC || isServer() && inS) &&
                    initDelegate.add(bindInitFunc(pak.title, pPak.funcPak.func));
                } else {
                    try {
                        (isClient() && inC || isServer() && inS) &&
                        bindInitFunc(pak.title, pPak.funcPak.func);
                    } catch (e) {
                        Log4Ts.error(testPackageRegister, e);
                    }
                }
            } else if (pPak.funcPak instanceof IntervalFuncPackage) {
                (isClient() && inC || isServer() && inS) &&
                updateDelegate.add(pPak.funcPak.func);
            } else if (pPak.funcPak instanceof DelayFuncPackage) {
                (isClient() && inC || isServer() && inS) &&
                mw.setTimeout(bindDelayFunc(pak.title, pPak.funcPak.func),
                    pPak.funcPak.delay ?? DefaultDelay);
            } else if (pPak.funcPak instanceof TouchFuncPackage) {
                const key = pPak.funcPak.key ?? mw.Keys.T;
                if (isClient()) {
                    KeyOperationManager.getInstance().onKeyDown(undefined,
                        key,
                        () => mw.Event.dispatchToServer(getEventName(pak.title, key)));
                }
                if (isServer()) {
                    mw.Event.addClientListener(getEventName(pak.title, key),
                        bindTouchFunc(pak.title, pPak.funcPak.func),
                    );
                }
            } else if (pPak.funcPak instanceof BenchFuncPackage) {
                if (isClient() && inC || isServer() && inS) {
                    if (bench) {
                        Log4Ts.warn(testPackageRegister,
                            `only one bench can run at the same time.`);
                    }

                    bench = pPak.funcPak.func;
                    benchTime = pPak.funcPak.maxTime ?? GtkTypes.Interval.Hz30;
                }
            }
        }
    }
}

let enableBench = true;

export function setEnableBench(enable: boolean) {
    if (enableBench === enable) return;
    Log4Ts.log({name: "GscTestModule"}, `set Use Bench: ${enable}`);
    enableBench = enable;
    if (enable) {
        benchAllCount = 0;
        benchAllTime = 0;
    } else {
        Log4Ts.log({name: "GscTestModule"},
            `all bench count: ${benchAllCount}`,
            `all avg time: ${benchAllTime / benchAllCount}ms.`);
    }
}

function runBench() {
    if (bench && enableBench) {
        let handledTime = 0;
        let counter = 0;
        while (handledTime < benchTime) {
            const start = Date.now();
            try {
                bench?.();
            } catch (e) {
                Log4Ts.error({name: "GscTestModule"}, `error occurs in bench.`, e);
                break;
            }
            handledTime += Date.now() - start;
            ++counter;
        }
        benchAllTime += handledTime;
        benchAllCount += counter;
        Log4Ts.log({name: "GscTestModule"},
            `repeat ${counter} times.`,
            `avg cost ${handledTime / counter}ms.`);
    }
}

function isClient() {
    return mw.SystemUtil.isClient();
}

function isServer() {
    return mw.SystemUtil.isServer();
}

function bindInitFunc(title: string, func: TestHandler): TestHandler {
    return () => {
        Log4Ts.log(bindInitFunc, `${title} called when init.`);
        func();
    };
}

function bindDelayFunc(title: string, func: TestHandler): TestHandler {
    return () => {
        Log4Ts.log(bindInitFunc, `${title} called after delay.`);
        func();
    };
}

function bindTouchFunc(title: string, func: TestHandler): TestHandler<mw.Player> {
    return (_) => {
        Log4Ts.log(bindInitFunc, `${title} touched.`);
        func();
    };
}

function getEventName(title: string, key: mw.Keys): string {
    return `__GSC_TEST_${title}${key ? `_` + key.toString() : ""}__`;
}

//#region Auto Register
/**
 * 初始化模块.
 */
export function initGscTestModule() {
    ModuleService.registerModule(GscTestModuleS, GscTestModuleC, GscTestModuleData);
}

try {
    Log4Ts.log({name: "GscTestModule"}, `auto init GscTestModule`);
    initGscTestModule();
} catch (e) {
    Log4Ts.error({name: "GscTestModule"}, e);
}
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
