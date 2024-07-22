import * as mwaction from "mwaction";
import { VectorExt } from "./declaration/vectorext";
import BoardPanel from "./lab/ui/BoardPanel";
import { TestPanel } from "./test/TestPanel";
import TweenElementPanelOld from "./lab/ui/tween/TweenElementPanelOld";
import TweenElementPanel from "./lab/ui/tween/TweenElementPanel";
import Waterween from "./depend/waterween/Waterween";
import Gtk, { GtkTypes, RandomGenerator, RevisedInterval } from "./util/GToolkit";
import Log4Ts from "./depend/log4ts/Log4Ts";
import TweenWaterween_Generate from "./ui-generate/UIAnimLab/tween/TweenWaterween_generate";
import KeyOperationManager from "./controller/key-operation-manager/KeyOperationManager";
import Balancing from "./depend/balancing/Balancing";
import GlobalTips from "./depend/global-tips/GlobalTips";
import { GlobalTipsPanel } from "./depend/global-tips/example/GlobalTipsPanel";
import { BubbleWidget } from "./depend/global-tips/example/BubbleWidget";
import PureGlobalTips from "./depend/pure-global-tips/GlobalTips";
import { GlobalTipsPanel as PureGlobalTipsPanel } from "./depend/pure-global-tips/example/GlobalTipsPanel";
import { BubbleWidget as PureBubbleWidget } from "./depend/pure-global-tips/example/BubbleWidget";
import PureColorBoard from "./lab/PureColorBoard";
import { NPTController } from "./test/NPTController";
import { DrainPipeModuleC } from "./depend/drain-pipe/DrainPipe";
import GodModService, { addGMCommand, RangeDataValidator } from "./depend/god-mod/GodModService";
import { MoveIcon } from "./depend/god-mod/ui/icon/MoveIcon";
import { GameConfig } from "./config/GameConfig";
import GodModGameConfigRenderer from "mw-god-mod/ui/param-renderer/GodModGameConfigRenderer";
import { AutoComplete, AutoCompleteItem } from "./depend/lui/component/AutoComplete";
import { Dialogue } from "./depend/lui/component/Dialogue";
import { TextField } from "./depend/lui/component/TextField";
import { Avatar } from "./depend/lui/component/Avatar";
import { Button } from "./depend/lui/component/Button";
import { Property } from "./depend/lui/style/Property";
import { Lui } from "./depend/lui/style/Asset";
import { RTree } from "./depend/area/r-tree/RTree";
import Rectangle from "./depend/area/shape/Rectangle";
import RTreeNode from "./depend/area/r-tree/RTreeNode";
import AreaController from "./depend/area/AreaController";
import AssetController from "./controller/asset/AssetController";
import { MediaService } from "./controller/media/MediaService";
import { EffectProxy } from "./controller/media/effect/EffectProxy";
import { SoundProxy } from "./controller/media/sound/SoundProxy";
import { FocusOnMe } from "./single-func/FocusOnMe";
import { regTest } from "./depend/gsc-test-package/module/GscTestModule";
import {
    DelayFuncPackage,
    InitFuncPackage,
    IntervalFuncPackage,
    TouchFuncPackage,
} from "./depend/gsc-test-package/base/TestPackageFunc";
import { PlatformFlag } from "./depend/gsc-test-package/base/PlatformFlag";
import BuryPointController from "./controller/bury-point/BuryPointController";
import { AdvancedTweenTask } from "./depend/waterween/base/task/AdvancedTweenTask";
import Easing from "./depend/waterween/easing/Easing";
import { FlowTweenTask } from "./depend/waterween/base/task/FlowTweenTask";
import { GroupMode, TweenTaskGroupBase } from "./depend/waterween/base/task/TweenTaskGroupBase";
import Color = Lui.Asset.Color;
import ColorUtil = Lui.Asset.ColorUtil;

const kom = KeyOperationManager.getInstance();

// let initClientDelegate: SimpleDelegate<void> = new SimpleDelegate();
//
// let initServerDelegate: SimpleDelegate<void> = new SimpleDelegate();
//
// let initAllEndDelegate: SimpleDelegate<void> = new SimpleDelegate();
//
// let delayExecuteClientDelegate: SimpleDelegate<void> = new SimpleDelegate();
//
// let delayExecuteServerDelegate: SimpleDelegate<void> = new SimpleDelegate();
//
// let delayExecuteAllEndDelegate: SimpleDelegate<void> = new SimpleDelegate();
//
// let updateClientDelegate: SimpleDelegate<number> = new SimpleDelegate();
//
// let updateServerDelegate: SimpleDelegate<number> = new SimpleDelegate();
//
// let updateAllEndDelegate: SimpleDelegate<number> = new SimpleDelegate();

@Component
export default class GameStart extends mw.Script {
//#region Member
    public static readonly CLIENT_DELAY_TIMEOUT = 2e3;

    public static readonly SERVER_DELAY_TIMEOUT = 2e3;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region MetaWorld Event
    protected onStart(): void {
        super.onStart();
        this.useUpdate = true;
        console.log("Game Launched");
        mwaction;
        VectorExt.initialize();

        this.initAllEnd();

//region Event subscribe
//endregion ------------------------------------------------------------------------------------------------------

        if (mw.SystemUtil.isServer()) {
            mw.DataStorage.setTemporaryStorage(false);
        }
        if (mw.SystemUtil.isClient()) {
        }

        // GodModService.getInstance()
        //     .showGm()
        //     .setPosition(300, 100);
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);

        if (mw.SystemUtil.isClient()) {
            // actions.AcitonMgr.update(dt * 1000);
            // updateClientDelegate.invoke(dt);
        } else if (mw.SystemUtil.isServer()) {
            // updateServerDelegate.invoke(dt);
        }
        // updateAllEndDelegate.invoke(dt);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

//endregion

//#region Opportunity
    public initAllEnd: () => void = () => {
        // ModuleService.registerModule(AuthModuleS, AuthModuleC, AuthModuleData);
        // ModuleService.registerModule(TestModuleS, TestModuleC, TestModuleData);
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Event Callback
//endregion
}

function compareWidgetStack(lhs: mw.Widget, rhs: mw.Widget): number {
    const root = mw.UIService.canvas;
    let rootLhs: mw.Widget;
    let rootRhs: mw.Widget;
    let pl = lhs;
    let pr = rhs;
    let lastPl: mw.Widget;
    let lastPr: mw.Widget;

    while (pl && pr) {
        if (pl === pr) {
            return compareSameParentWidgetStack(lastPl, lastPr) *
                (!rootLhs && !rootRhs ? 1 : -1);
        }

        lastPl = pl;
        lastPr = pr;
        if (pl.parent && pl.parent !== root) pl = pl.parent;
        else if (!rootLhs) {
            if (pl.parent !== root) return widgetAttachOnRoot(pr) ? -1 : 0;
            rootLhs = pl;
            pl = rhs;
        }

        if (pr.parent && pr.parent !== root) pr = pr.parent;
        else if (!rootRhs) {
            if (pr.parent !== root) return widgetAttachOnRoot(pl) ? -1 : 0;
            rootRhs = pr;
            pr = lhs;
        }

        if (rootLhs && rootRhs) {
            // mw.UIService layer manager needed.
            return rootLhs.zOrder - rootRhs.zOrder;
        }
    }
    return 0;
}

/**
 * Compare widget stack who has same parent.
 * @param {mw.Widget} lhs
 * @param {mw.Widget} rhs
 * @return {number}
 */
function compareSameParentWidgetStack(lhs: mw.Widget, rhs: mw.Widget): number {
    if (lhs.zOrder !== rhs.zOrder) return lhs.zOrder - rhs.zOrder;
    return getWidgetIndexInParent(lhs) - getWidgetIndexInParent(rhs);
}

/**
 * Check if widget is attached on root.
 * 检查是否 Widget 挂在在指定的 root 上
 * @param {mw.Widget} widget
 * @param {mw.Widget} root=undefined
 *      - undefined: 默认指向 {@link mw.UIService.canvas}
 * @return {boolean}
 */
function widgetAttachOnRoot(widget: mw.Widget, root: mw.Widget = undefined): boolean {
    if (!widget) return false;
    if (!root) root = mw.UIService.canvas;
    let p = widget;
    while (p) {
        if (p === root) return true;
        p = p.parent;
    }
    return false;
}

/**
 * Get widget index in parent.
 * @param {mw.Widget} widget
 * @return {number}
 *     - -1: widget is not attached on parent.
 */
function getWidgetIndexInParent(widget: mw.Widget): number {
    if (!widget.parent) {
        return -1;
    }
    return widget.parent["get"]()?.GetChildIndex(widget["get"]()) ?? -1;
}

function showClientLogInServer(content: string) {
    if (SystemUtil.isClient()) {
        mw.Event.dispatchToServer("ShowLogInServer");
    } else {
        Log4Ts.log(showClientLogInServer, `${content}`);
    }
}

mw.Event.addClientListener("ShowLogInServer", (player, content) => {
    Log4Ts.log(showClientLogInServer, `user: ${player.userId}`, `${content}`);
});

// (init.*?Delegate)|(delay.*?Delegate)|(init.*?Delegate)|(update.*?Delegate)
//#region Lui
//#region TDD

function showPureBoard(color?: string): PureColorBoard {
    if (!mw.SystemUtil.isClient()) return;
    const uis = mw.UIService.show(PureColorBoard);
    uis.setColor(color ?? "#000000").uiObject.zOrder = 0;

    return uis;
}

function showTestPanel(): TestPanel {
    if (!mw.SystemUtil.isClient()) return;
    return mw.UIService.show(TestPanel);
}

class BenchResult {
    count: number = 0;

    time: number = 0;

    constructor(public name: string) {
    }

    public get avgTime() {
        return this.time / this.count;
    }
}

const benchResultMap: Map<() => void, BenchResult> = new Map();
const benchHandlerMap: Map<() => void, () => void> = new Map();
const benchRunning: Map<() => void, boolean> = new Map();

function bench(func: () => void,
               maxTime: number = GtkTypes.Interval.Hz60,
               init?: () => void,
               extraFunc?: () => void) {
    if (benchRunning.get(func)) return;
    Log4Ts.log(rtreeBench, `bench start.`);
    benchRunning.set(func, true);
    init?.();

    let result = Gtk.tryGet(benchResultMap,
        func,
        () => new BenchResult(func.name));
    const handler = Gtk.tryGet(benchHandlerMap, func, () => {
        return function () {
            const now = Date.now();
            while (Date.now() - now < maxTime) {
                ++result.count;
                func();
            }
            result.time += Date.now() - now;
            extraFunc?.();
        };
    });

    benchHandlerMap.set(func, handler);
    mw.TimeUtil.onEnterFrame.add(handler);
}

function stopBench(func: () => void) {
    const handler = benchHandlerMap.get(func);
    if (!handler) return;
    mw.TimeUtil.onEnterFrame.remove(handler);
    benchRunning.set(func, false);
    const result = benchResultMap.get(func);
    Log4Ts.log(stopBench,
        `bench result: ${result.name}`,
        `count: ${result.count}`,
        `total time: ${result.time}`,
        `avg time: ${result.avgTime}ms`,
    );
}

//#region Tween
/**
 * Tween bench
 * @param {boolean} useOld
 * @param {number} testTime
 */
function benchTween(useOld: boolean = false, testTime: number) {
    Waterween.stopAutoBehavior();

    const updateHandler = useOld ?
        ((param) => {
            actions.AcitonMgr.update(param * 1000);
        }) :
        ((param) => {
            Waterween.update(param * 1000);
        });

    let sampleCount = 0;
    let avg = 0;

    const updateBenchHandler = (param: number) => {
        let now = Date.now();
        updateHandler(param);
        let cost = Date.now() - now;

        if (sampleCount > 100) {
            avg = (avg * (sampleCount - 100) + cost) / (sampleCount - 99);
        }
        ++sampleCount;
        Log4Ts.log({name: "TestTween"},
            `all actions task done.`,
            `now use ${(useOld ? "Actions" : "Waterween")}`,
            `cost time avg: ${avg}`,
            `sample count: ${sampleCount}`);
    };

    regTest("Tween-Update", true,
        {
            platform: PlatformFlag.Client,
            funcPak: new IntervalFuncPackage(updateBenchHandler),
        },
    );

    const tweenBenchPanel = mw.UIService.show(TweenWaterween_Generate);
    const now = Date.now();
    for (let i = 0; i < testTime; ++i) {
        const item = useOld ?
            mw.UIService.create(TweenElementPanelOld) :
            mw.UIService.create(TweenElementPanel);

        item.initSeqTweenTask(now);
        tweenBenchPanel.cnvContainer.addChild(item.uiObject);
    }
}

regTest("Tween", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(() => {
            // platform mwEditor 0.36.0.1
            // actions.tween avg **174.11ms**, test count 2400, sample count 572
            // Waterween avg **4.01ms**, test count 2400, sample count 706
            // platform mwEditor 0.36.0.3
            // actions.tween avg **16.98ms**, test count 8192, sample count 419
            // Waterween avg **11.98ms**, test count 8192, sample count 462
            benchTween(false, 8192);
        }),
    },
);
//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region GlobalTips
/**
 * Global Tips 测试.
 */
function globalTips() {
    GlobalTips.getInstance()
        .setBubbleWidget(BubbleWidget)
        .setGlobalTipsContainer(GlobalTipsPanel);

    KeyOperationManager.getInstance().onKeyDown(null, mw.Keys.T, () => {
        GlobalTips.getInstance().showGlobalTips(`Hello world! at ${Date.now()}`);
        // mw.Event.dispatchToLocal(GlobalTips.EVENT_NAME_GLOBAL_TIPS, {only: false} as IGlobalTipsOption);
    });

    KeyOperationManager.getInstance().onKeyDown(null, mw.Keys.G, () => {
        GlobalTips.getInstance().showGlobalTips(`Title at ${Date.now()}`, {only: true});
        // mw.Event.dispatchToLocal(GlobalTips.EVENT_NAME_GLOBAL_TIPS, {only: true, duration: 3e3} as IGlobalTipsOption);
    });
}

/**
 * Pure Global Tips 测试.
 */
function pureGlobalTips() {
    PureGlobalTips.getInstance()
        .setBubbleWidget(PureBubbleWidget)
        .setGlobalTipsContainer(PureGlobalTipsPanel);

    KeyOperationManager.getInstance().onKeyDown(null, mw.Keys.T, () => {
        PureGlobalTips.getInstance().showGlobalTips(`Hello world! at ${Date.now()}`);
        // mw.Event.dispatchToLocal(PureGlobalTips.EVENT_NAME_GLOBAL_TIPS, {only: false} as IGlobalTipsOption);
    });

    KeyOperationManager.getInstance().onKeyDown(null, mw.Keys.G, () => {
        PureGlobalTips.getInstance().showGlobalTips(`Title at ${Date.now()}`, {only: true});
        // mw.Event.dispatchToLocal(PureGlobalTips.EVENT_NAME_GLOBAL_TIPS, {only: true, duration: 3e3} as IGlobalTipsOption);
    });
}

regTest("GlobalTips", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new DelayFuncPackage(pureGlobalTips),
    });
//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region Balancing
function benchBalancing() {
    Balancing.getInstance()
        .registerUpdater((callback) => mw.TimeUtil.onEnterFrame.add(callback))
        .useDebug(true);
    let gun = Balancing.getInstance().getGun("Test");
    const count = 10000;
    for (let i = 0; i < count; ++i) {
        gun.press(lowPerformanceFunction);
    }
}

function benchEffectBalancing() {
    Balancing.getInstance()
        .registerUpdater((callback) => mw.TimeUtil.onEnterFrame.add(callback))
        .useDebug(true);
    let gun = Balancing.getInstance().getGun("Test");
    const count = 5000;
    for (let i = 0; i < count; ++i) {
        gun.press(lowPerformanceEffectFunction);
    }
}

function benchUnBalancing() {
    Log4Ts.log(benchUnBalancing, `do tasks.`);
    const now = Date.now();
    const count = 10000;
    for (let i = 0; i < count; ++i) {
        lowPerformanceFunction();
    }
    Log4Ts.log(benchUnBalancing, `all task done. cost: ${Date.now() - now}ms.`);
}

function benchEffectUnBalancing() {
    Log4Ts.log(benchUnBalancing, `do tasks.`);
    const now = Date.now();
    const count = 5000;
    for (let i = 0; i < count; ++i) {
        lowPerformanceEffectFunction();
    }
    Log4Ts.log(benchUnBalancing, `all task done. cost: ${Date.now() - now}ms.`);
}

function lowPerformanceFunction() {
    let param = "";
    const count = 5000;
    for (let i = 0; i < count; ++i) {
        param += Math.floor(Math.random() * 10);
    }

    param = param.split("").join("0");
    for (let i = param.length - 1; i >= 0; --i) {
        if (i % 2 === 0) {
            param = param.slice(0, i);
        } else {
            break;
        }
    }
    for (let i = param.length - 1; i >= 0; --i) {
        param += (param[i]);
    }
    for (let i = 0; i < param.length / 2; ++i) {
        param = param.slice(0, 1);
    }
}

function lowPerformanceEffectFunction() {
    const go = GameObject.spawn("197386", {
        transform: new Transform(
            new RandomGenerator().random([1000, 1000]).toVector3(0),
            mw.Rotation.zero,
            mw.Vector.one.divide(100)),
        replicates: false,
    });

    mw.EffectService.playOnGameObject("155590", go, {
        duration: 3e3,
        loopCount: 0,
        scale: mw.Vector.one.multiply(10),
    });
}

regTest("Balancing", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new DelayFuncPackage(benchBalancing),
    });
//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region KOM for Widget binding

/**
 * MW Key binding 测试.
 */
function testAddKeyBinding() {
    mw.UIService.getUI(TestPanel).testButton.addKey(mw.Keys.T);
}

/**
 * KOM Key binding 测试.
 */
function testKomWidgetBinding() {
    KeyOperationManager.getInstance().onKeyDown(null, mw.Keys.T, () => {
        mw.UIService.getUI(TestPanel).testButton.onClicked.broadcast();
    });
}

/**
 * KOM Button binding 测试.
 */
function testKomBindButton() {
    KeyOperationManager
        .getInstance()
        .bindButton(
            null,
            mw.Keys.T,
            mw.UIService.getUI(TestPanel).testButton);
}

/**
 * KOM Key Press binding 测试.
 */
function testKeyPress() {
    KeyOperationManager.getInstance()
        .onKeyPress(mw.UIService.getUI(TestPanel),
            mw.Keys.U,
            (dt) => Log4Ts.log(testKeyPress, `U pressed. dt: ${dt}`),
        );
}

regTest("Balancing", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(testKomWidgetBinding),
    });
//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region Function from String
function testFunctionFromString() {
    const func = new Function("console.log(\"Hello world\")");
    func();
}

regTest("Function from String", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new DelayFuncPackage(testFunctionFromString),
    });
//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region Asset Load
function loadAUiAsset() {
    const testPanel = mw.UIService.getUI(TestPanel);
    KeyOperationManager.getInstance().bindButton(
        testPanel,
        mw.Keys.T,
        testPanel.testButton,
    );

    testPanel.testButton.onClicked.add(() => {
        const img = mw.UIService.getUI(BoardPanel).imgStage;
        if (img.imageGuid === "37673") {
            img.imageGuid = "37684";
        } else {
            img.imageGuid = "37673";
        }
    });
    // mw.AssetUtil.asyncDownloadAsset("197386");
}

regTest("Asset Load", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(loadAUiAsset),
    });
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Complex Type

function testEventWithComplexType() {
    if (mw.SystemUtil.isServer()) {
        mw.Event.dispatchToClient(Player.getAllPlayers()[0], "Test", new Vector(1, 2, 3));
    }
    if (mw.SystemUtil.isClient()) {
        mw.Event.dispatchToServer("Test", new Vector(1, 2, 3));
    }
}

function testAddEventListener() {
    if (mw.SystemUtil.isServer()) {
        mw.Event.addClientListener("Test", (player, params) => {
            Log4Ts.log(testAddEventListener, `receive event from client.`, params);
        });
    }
    if (mw.SystemUtil.isClient()) {
        mw.Event.addServerListener("Test", (params) => {
            Log4Ts.log(testAddEventListener, `receive event from server.`, params);
        });
    }
}

// initClientDelegate.add(testAddEventListener);
// initServerDelegate.add(testAddEventListener);
//
// delayExecuteClientDelegate.add(testEventWithComplexType);
// delayExecuteServerDelegate.add(testEventWithComplexType);

regTest("Event Complex Type", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(testAddEventListener),
    }, {
        platform: PlatformFlag.Server,
        funcPak: new InitFuncPackage(testAddEventListener),
    }, {
        platform: PlatformFlag.Client,
        funcPak: new DelayFuncPackage(testEventWithComplexType),
    }, {
        platform: PlatformFlag.Server,
        funcPak: new DelayFuncPackage(testEventWithComplexType),
    });

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region GodMod
function godModIcon() {
    const icon = MoveIcon.create().attach(mw.UIService.canvas);
}

function testAddGmClient() {
    addGMCommand(
        "TestClient",
        "number",
        (params) => {
            Log4Ts.log(testAddGmClient, `Test command in Client.`, params);
        },
        undefined,
        {
            validator: [
                (param) => param >= 0 && param <= 10,
            ],
        },
    );
}

function testAddGmServer() {
    addGMCommand(
        "TestServer",
        "number",
        undefined,
        (player, params) => {
            Log4Ts.log(testAddGmClient,
                `Test command in Server.`,
                `player: ${player.playerId}`,
                params);
        },
        {validator: [RangeDataValidator(0, 1)]},
    );
}

function testUseGm() {
    GodModService.getInstance().runCommandInClient(
        "TestClient",
        0,
    );
    GodModService.getInstance().runCommandInClient(
        "TestServer",
        1,
    );
    GodModService.getInstance().runCommandInClient(
        "TestClient",
        2,
    );
}

function testGMCSRenderer() {
    let render = GodModGameConfigRenderer
        .create()
        .attach(mw.UIService.canvas);
    let all = [
        ...GameConfig.DialogueContentNode.getAllElement(),
        ...GameConfig.RelateEntity.getAllElement(),
        ...GameConfig.Sound.getAllElement(),
    ];

    KeyOperationManager
        .getInstance()
        .onKeyDown(undefined,
            mw.Keys.T,
            () => render.render(Gtk.randomArrayItem(all)));

    KeyOperationManager
        .getInstance()
        .onKeyDown(undefined,
            mw.Keys.H,
            () => render.show = !render.show);
}

enum DynamicEnum {
    A,
    B,
    C,
}

enum DynamicEnum2 {
    B,
    C,
    D,
}

function testGmPanel() {
    if (SystemUtil.isClient()) {
        // mw.UIService.show(PureColorBoard).setColor(Lui.Asset.Color.Gray300);
    }

    addGMCommand("say",
        "void",
        () => {
            Log4Ts.log(testGmPanel, `say something`);
        },
        undefined,
        undefined,
        "Say");
    addGMCommand("say to server",
        "void",
        undefined,
        () => Log4Ts.log(testGmPanel, `say something`),
        undefined,
        "Say");
    addGMCommand("say to all",
        "void",
        () => Log4Ts.log(testGmPanel, `say something`),
        () => Log4Ts.log(testGmPanel, `say something`),
        undefined,
        "Say");
    addGMCommand("say anything",
        "string",
        (params) => Log4Ts.log(testGmPanel, `say: ${params}`),
        undefined,
        undefined,
        "Say");
    addGMCommand("range",
        "integer",
        (params) => Log4Ts.log(testGmPanel, `value: ${params}`),
        undefined,
        {
            validator: [
                RangeDataValidator(0, 10),
            ],
        },
        "Validator");
    addGMCommand("float",
        "number",
        (params) => Log4Ts.log(testGmPanel, `value: ${params}`),
        undefined,
        undefined,
        "TypedParam");
    addGMCommand("integer",
        "integer",
        (params) => Log4Ts.log(testGmPanel, `value: ${params}`),
        undefined,
        undefined,
        "TypedParam");
    addGMCommand("vector",
        "vector",
        (params) => Log4Ts.log(testGmPanel, `value: ${params}`),
        undefined,
        undefined,
        "TypedParam");
    addGMCommand("vector2",
        "vector2",
        (params) => Log4Ts.log(testGmPanel, `value: ${params}`),
        undefined,
        undefined,
        "TypedParam");
    addGMCommand("rotation",
        "rotation",
        (params) => Log4Ts.log(testGmPanel, `value: ${params}`),
        undefined,
        undefined,
        "TypedParam");
    addGMCommand("enum A",
        DynamicEnum,
        (params) => {
            switch (params) {
                case DynamicEnum.A:
                    Log4Ts.log(testGmPanel, `enum value: ${DynamicEnum[params]}`);  // DynamicEnum.A
                    break;
                case DynamicEnum.B:
                    Log4Ts.log(testGmPanel, `enum value: ${DynamicEnum[params]}`);  // DynamicEnum.B
                    break;
                case DynamicEnum.C:
                    Log4Ts.log(testGmPanel, `enum value: ${DynamicEnum[params]}`);  // DynamicEnum.C
                    break;
            }
            Log4Ts.log(testGmPanel, `value: ${params}`);
        },
        undefined,
        undefined,
        "TypedParam");
    addGMCommand("enum B",
        DynamicEnum2,
        undefined,
        (player, params) => {
            switch (params) {
                case DynamicEnum2.B:
                    Log4Ts.log(testGmPanel, `StateB`);
                    break;
                case DynamicEnum2.C:
                    Log4Ts.log(testGmPanel, `StateC`);
                    break;
                case DynamicEnum2.D:
                    Log4Ts.log(testGmPanel, `StateD`);
                    break;
            }
            Log4Ts.log(testGmPanel, `value: ${params}`);
        },
        undefined,
        "TypedParam");
    addGMCommand("Client Error",
        "void",
        () => {
            throw Error("Client Error");
        },
        undefined,
        undefined,
        "Error");
    addGMCommand("use DialogueContentNode Config",
        GameConfig.DialogueContentNode,
        (params) => {
            Log4Ts.log(testGmPanel,
                `id: ${params.id}`,
                `content: ${params.content}`);
        },
        undefined,
        undefined,
        "TypedParam");
    addGMCommand("use Sound Config",
        GameConfig.Sound,
        undefined,
        (p, config) => {
            mw.SoundService.playSound(config.soundGuid);
        },
        undefined,
        "TypedParam");
    addGMCommand("Server Error",
        "void",
        undefined,
        () => {
            throw Error("Server Error");
        },
        undefined,
        "Error");
    addGMCommand("模糊搜索",
        "void",
        undefined,
        (p) => {
            Log4Ts.log(testGmPanel, `Hello!`);
        },
        undefined,
        "Search");
    addGMCommand("Empty",
        "void",
        undefined,
        undefined,
        undefined,
        "void");

    mw.setTimeout(() => {
            addGMCommand("TestDelay",
                "void",
                undefined,
                (player, params) => Log4Ts.log(testGmPanel, `say hello!`),
                {label: "delay"},
                "delay");
        },
        3e3);

    GodModService.getInstance()
        .addPreviewForGameConfig(GameConfig)
        .showGm()
        .setPosition(300, 100);
}

function testTouchEvents() {
    let btn = mw.Button.newObject(mw.UIService.canvas, "btnTest");
    // btn.onPressed.add(() => {
    //     Log4Ts.log(testTouchEvents, `btn pressed.`);
    // });
    // btn.onReleased.add(() => {
    //     Log4Ts.log(testTouchEvents, `btn released.`);
    // });

    (btn["onTouchStarted"] as mw.Delegate<(absolutionPosition: mw.Vector2, pointEvent: mw.PointerEvent) => boolean>)
        .bind((pos, evt) => {
            Log4Ts.log(testTouchEvents, `onTouchStarted, pos: ${pos}, evt: ${evt.screenSpacePosition}`);
            return true;
        });
    (btn["onTouchMoved"] as mw.Delegate<(absolutionPosition: mw.Vector2, pointEvent: mw.PointerEvent) => boolean>)
        .bind((pos, evt) => {
            Log4Ts.log(testTouchEvents, `onTouchMoved, pos: ${pos}, evt: ${evt.screenSpacePosition}`);
            return true;
        });
    (btn["onTouchEnded"] as mw.Delegate<(absolutionPosition: mw.Vector2, pointEvent: mw.PointerEvent) => boolean>)
        .bind((pos, evt) => {
            Log4Ts.log(testTouchEvents, `onTouchEnded, pos: ${pos}, evt: ${evt.screenSpacePosition}`);
            return true;
        });
}

function gameConfigsEnum() {
    Object.getOwnPropertyNames(GameConfig)?.forEach(property => {
        const descriptor = Object.getOwnPropertyDescriptor(
            GameConfig,
            property);
        if (descriptor && typeof descriptor.get === "function") {
            console.log(`${property}: ${GameConfig[property]}`);
        }
    });
}

regTest("GodMod", false,
    {
        platform: PlatformFlag.Client | PlatformFlag.Server,
        funcPak: new InitFuncPackage(testGmPanel),
    }, {
        platform: PlatformFlag.Server,
        funcPak: new InitFuncPackage(testAddGmServer),
    }, {
        platform: PlatformFlag.Client,
        funcPak: new DelayFuncPackage(gameConfigsEnum),
    });

//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region Lui
function luiButton() {
    mw.UIService.show(PureColorBoard);
    Button.create({
        variant: "outlined",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);

    Button.create({
        variant: "contained",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
        corner: Property.Corner.Top,
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);

    Button.create({
        variant: "outlined",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer)
        .preview();

    Button.create({
        variant: "contained",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer)
        .preview();

    Button.create({
        variant: "outlined",
        color: {
            primary: Color.Red,
            secondary: Color.Red800,
        },
        textAlign: "left",
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);

    Button.create({
        variant: "contained",
        color: {
            primary: Color.Red,
            secondary: Color.Red800,
        },
        corner: Property.Corner.Top,
        textAlign: "left",
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);

    Button.create({
        variant: "outlined",
        color: {
            primary: Color.Green,
            secondary: Color.Green800,
        },
        padding: {top: 10, bottom: 10},
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer)
        .preview();

    Button.create({
        variant: "contained",
        color: {
            primary: Color.Green,
            secondary: Color.Green800,
        },
        padding: {top: 10, bottom: 10},
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer)
        .preview();
}

function luiAvatar() {
    mw.UIService.show(PureColorBoard);
    Avatar.create({
        variant: "circle",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
        labelText: "LviatYi",
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);

    Avatar.create({
        variant: "square",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
        labelText: "LviatYi",
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);

    Avatar.create({
        variant: "circle",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
        labelText: "易之",
        effectLevel: "high",
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer)
        .preview();

    Avatar.create({
        variant: "square",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
        labelText: "易之",
        effectLevel: "high",
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer)
        .preview();

    Avatar.create({
        variant: "circle",
        color: {
            primary: Color.Red,
            secondary: Color.Red800,
        },
        labelText: "lviat",
        effectLevel: "low",
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);

    Avatar.create({
        variant: "square",
        color: {
            primary: Color.Red,
            secondary: Color.Red800,
        },
        labelText: "lviat",
        effectLevel: "low",
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);

    Avatar.create({
        variant: "circle",
        color: {
            primary: Color.Green,
            secondary: Color.Green800,
        },
        labelText: "LviatYi",
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer)
        .preview();

    Avatar.create({
        variant: "square",
        color: {
            primary: Color.Green,
            secondary: Color.Green800,
        },
        labelText: "LviatYi",
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer)
        .preview();
}

function luiTextField() {
    mw.UIService.show(PureColorBoard);
    TextField.create({
        label: "common",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue200,
        },
        corner: Property.Corner.Bottom,
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);
    TextField.create({
        label: "integer",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue200,
        },
        corner: Property.Corner.Bottom,
        type: mw.InputTextLimit.LimitToInt,
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);
    TextField.create({
        label: "float",
        color: {
            primary: Color.Green,
            secondary: Color.Green200,
        },
        corner: Property.Corner.None,
        type: mw.InputTextLimit.LimitToFloat,
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);
    TextField.create({
        label: "password",
        color: {
            primary: Color.Green,
            secondary: Color.Green200,
        },
        corner: Property.Corner.None,
        type: mw.InputTextLimit.LimitToPassword,
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);
    TextField.create({
        label: "validate",
        validator: [(param) => param.length < 5],
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);
    TextField.create({
        label: "validate with reason",
        validator: [{
            validator: (param) => param === "Hello",
            reason: "You must say Hello",
        }],
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);
}

function luiTextFieldCommit() {
    mw.UIService.show(PureColorBoard);
    TextField.create({
        label: "validate with reason",
        validator: [{
            validator: (param) => param === "Hello",
            reason: "You must say Hello",
        }],
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);
}

function luiTextFieldWhenLockMouse() {
    mw.UIService.show(PureColorBoard);

    mw.InputUtil.isLockMouse = true;
    mw.InputUtil.mouseLockOptionEnabled = false;
    KeyOperationManager.getInstance().onKeyDown(undefined, Keys.LeftAlt, () => (InputUtil.isLockMouse = false));
    KeyOperationManager.getInstance().onKeyUp(undefined, Keys.LeftAlt, () => (InputUtil.isLockMouse = true));
    mw.Event.addLocalListener(TextField.TextFieldFocusEventName, (params) => {
        KeyOperationManager.getInstance().unregisterKey(undefined, Keys.LeftAlt);
        KeyOperationManager.getInstance().unregisterKey(undefined, Keys.LeftAlt);
    });
    mw.Event.addLocalListener(TextField.TextFieldBlurEventName, () => {
        KeyOperationManager.getInstance().onKeyDown(undefined, Keys.LeftAlt, () => (InputUtil.isLockMouse = false));
        KeyOperationManager.getInstance().onKeyUp(undefined, Keys.LeftAlt, () => (InputUtil.isLockMouse = true));
    });

    TextField.create({
        label: "common",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue200,
        },
        corner: Property.Corner.Bottom,
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);
}

function luiAutoComplete() {
    let items: AutoCompleteItem[] = [
        {label: "LviatYi", group: "group2"},
        {label: "zewei.zhang", group: "group1"},
        {label: "LviatWang", group: "group2"},
        {label: "minjia.zhang", group: "group1"},
        {label: "LviatQian", group: "group2"},
        {label: "peiyu.li", group: "group1"},
        // {label: "someoneZhao"},
        // {label: "someoneQian"},
        // {label: "someoneSun"},
    ];

    mw.UIService.show(PureColorBoard);
    AutoComplete.create({
        color: {
            primary: Color.Blue,
            secondary: Color.Blue200,
        },
        items,
    })
        .attach(mw.UIService.getUI(PureColorBoard).cnvContainer);
}

function luiDialogue() {
    // mw.UIService.show(PureColorBoard);
    Dialogue.create({
        title: "Title",
        message: "Here is some message. you should do step A ans do step B.",
        feedbacks: [
            {
                label: "Ok",
                callback: () => {
                    Log4Ts.log(luiDialogue, `Ok clicked.`);
                },
            },
            {
                label: "Cancel",
                callback: () => {
                    Log4Ts.log(luiDialogue, `Cancel clicked.`);
                },
            },
            {
                label: "Warning",
                callback: () => {
                    Log4Ts.log(luiDialogue, `Warning clicked.`);
                },
                variant: "warning",
            },
        ],
    })
        .attach(mw.UIService.canvas);
}

function originScrollBox() {
    let scrContainer = mw.ScrollBox.newObject(mw.UIService.canvas, "scrContainer");
    scrContainer.size = new Vector2(200, 100);
    scrContainer.position = new Vector2(100, 100);
    scrContainer.visibility = mw.SlateVisibility.Visible;
    scrContainer.alwaysShowScrollBar = true;
    scrContainer.scrollbarThickness = 5;
    scrContainer.scrollbarPadding = new mw.Margin(2, 8, 2, 0);
    scrContainer.supportElastic = true;
    scrContainer.animationType = mw.UIScrollBoxAnimationType.ElasticAnimation;

    let cnvContainer = mw.Canvas.newObject(mw.UIService.canvas, "cnvContainer");
    scrContainer.addChild(cnvContainer);
    cnvContainer.size = new Vector2(200, 400);
    cnvContainer.position = new Vector2(0, 0);
    cnvContainer.visibility = mw.SlateVisibility.SelfHitTestInvisible;
    cnvContainer.autoSizeVerticalEnable = true;
    cnvContainer.autoLayoutEnable = true;
    cnvContainer.autoLayoutContainerRule = mw.UILayoutType.Vertical;

    for (let i = 0; i < 5; ++i) {
        let btn = mw.Button.newObject(cnvContainer, `btn${i}`);
        btn.size = new Vector2(200, 50);
        btn.clickMethod = mw.ButtonClickMethod.PreciseClick;
        btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
        btn.normalImageGuid = "163390";
        btn.normalImageDrawType = mw.SlateBrushDrawType.Image;
    }
}

function originInputBoxFocus() {
    const input = mw.InputBox.newObject(mw.UIService.canvas, "test");
    KeyOperationManager.getInstance().onKeyDown(undefined, mw.Keys.F, () => {
        input.focus();
    });
    KeyOperationManager.getInstance().onKeyDown(undefined, mw.Keys.D, () => {
        input.deFocus();
    });
}

function originInputBoxCR() {
    const input = mw.InputBox.newObject(mw.UIService.canvas, "test");
    input.textLengthLimit = 100;
    input.onTextCommitted.add((arg) => {
        Log4Ts.log(originInputBoxCR, `text committed: ${arg}`);
    });
    input.text = "Hello world!\r\n";

    mw.setInterval(() => {
            input.text = Math.random().toString();
        },
        5e3);
}

function originSize() {
    const image = mw.Image.newObject(mw.UIService.canvas, "test");
    image.size = new Vector2(200, 200);
    image.size = new Vector2(100, 100);

    mw.setTimeout(() => {
            Log4Ts.log(originSize, `current size: ${image.size}`);
            Gtk.setUiSize(image, 300, 300);
            image.removeObject();
            Gtk.setUiSize(image, 400, 400);
            mw.UIService.canvas.addChild(image);
            mw.setTimeout(() => {
                    Log4Ts.log(originSize, `current size: ${image.size}`);
                },
                5e3,
            );
        },
        3e3,
    );
}

// initClientDelegate.add(luiAutoComplete);

regTest("Lui", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new DelayFuncPackage(luiAutoComplete),
    });
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region DrainPipe
function testDrainPipe() {
    const uis = mw.UIService.show(NPTController);
    KeyOperationManager.getInstance().bindButton(uis, mw.Keys.J, uis.btnJ);

    uis.btnJ.onClicked.add(() => {
        mwext.ModuleService.getModule(DrainPipeModuleC).requestTest();
    });
}

regTest("DrainPipe", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new DelayFuncPackage(testDrainPipe),
    });
//#endregion

//#region Drag Button
function testDragButton() {
    const cnvDrag = mw.Canvas.newObject(mw.UIService.canvas, "cnvDrag");
    Gtk.setUiPosition(cnvDrag, 300, 100);
    Gtk.trySetVisibility(cnvDrag, true);
    const btnDrag = mw.Button.newObject(cnvDrag, "btnDrag");
    btnDrag.normalImageGuid = Lui.Asset.ImgHalfRoundRectangle;
    Gtk.trySetVisibility(btnDrag, true);
    Gtk.setUiPosition(btnDrag, 50, 20);
    Gtk.setUiSize(btnDrag, 200, 60);

    let mouseStartMosPos: mw.Vector2 = undefined;
    let mouseStartCnvPos: mw.Vector2 = undefined;

    btnDrag.onPressed.add(() => {
        mouseStartMosPos = mw.absoluteToLocal(
            mw.UIService.canvas.cachedGeometry,
            mw.getMousePositionOnPlatform());
        mouseStartCnvPos = cnvDrag.position;
        Log4Ts.log(testDragButton, `btnDrag pressed.`);
    });

    let logged = true;
    btnDrag.onReleased.add(() => {
        Log4Ts.log(testDragButton, `btnDrag released.`);
        mouseStartMosPos = undefined;
        mouseStartCnvPos = undefined;
        logged = false;
    });

    mw.TimeUtil.onEnterFrame.add(() => {
        if (mouseStartMosPos) {
            let currMouseRelativePos = mw.absoluteToLocal(
                mw.UIService.canvas.cachedGeometry,
                mw.getMousePositionOnPlatform());
            Log4Ts.log(testDragButton, `start cnv pos: ${mouseStartCnvPos}`);
            Log4Ts.log(testDragButton, `start mouse pos: ${mouseStartMosPos}`);
            Log4Ts.log(testDragButton, `current mouse pos: ${currMouseRelativePos}`);
            Gtk.setUiPosition(
                cnvDrag,
                mouseStartCnvPos.x + currMouseRelativePos.x - mouseStartMosPos.x,
                mouseStartCnvPos.y + currMouseRelativePos.y - mouseStartMosPos.y);
        } else if (!logged) {
            Log4Ts.log(testDragButton, `current cnv pos: ${cnvDrag.position}`);
            logged = true;
        }
    });
}

// initClientDelegate.add(testDragButton);

regTest("Drag Button", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(testDragButton),
    });
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region RTree
const rtree = new RTree();
const set: Set<Rectangle> = new Set();
let perInsCount = 0;
let perDelCount = 0;
const expectCount: number = 100;
let strOpRec = "";

function rtreeBenchInit() {
    rtree.clear();
    set.clear();
    perInsCount = 0;
    perDelCount = 0;
    strOpRec = "";
}

function rtreeBenchExtra() {
    if (strOpRec.length > 30) {
        console.log(strOpRec);
        strOpRec = "";
    }
}

function rtreeBench() {
    let r = rtree.size <= 0 ? 0 : Gtk.random();
    let func: () => void;
    let targetRect: Rectangle;
    if (r < (expectCount - rtree.size) / (2 * expectCount) + 0.5) {
        ++perInsCount;
        let p1x = Gtk.random(0, 1920, true);
        let p1y = Gtk.random(0, 1080, true);
        let p2x = Gtk.random(0, 1920, true);
        let p2y = Gtk.random(0, 1080, true);
        targetRect = Rectangle.fromUnordered([p1x, p1y], [p2x, p2y]);
        set.add(targetRect);
        strOpRec += "+";
        func = () => rtree.insert(targetRect);
    } else {
        ++perDelCount;
        targetRect = Gtk.randomArrayItem([...set.keys()]);
        set.delete(targetRect);
        strOpRec += "-";
        func = () => rtree.remove(targetRect);
    }
    func();

    // Log4Ts.log(rtreeBench, `ist: ${perInsCount}, del: ${perDelCount}, all: ${perInsCount + perDelCount}`);
}

function startTreeBench() {
    KeyOperationManager.getInstance().onKeyDown(undefined,
        mw.Keys.T,
        () => bench(rtreeBench, undefined, rtreeBenchInit, rtreeBenchExtra));
    KeyOperationManager.getInstance().onKeyDown(undefined,
        mw.Keys.D,
        () => {
            stopBench(rtreeBench);
            Log4Ts.log(startTreeBench, `added: ${perInsCount}, deleted: ${perDelCount}`);
            Log4Ts.log(startTreeBench, `count in tree: ${rtree.size}`);
        });
}

const rects = [
    {op: "insert", p1: [1026, 532], p2: [-1706, 681]},
    {op: "insert", p1: [866, 987], p2: [-1290, 1040]},
    {op: "insert", p1: [111, 865], p2: [-1426, 1053]},
    {op: "delete", p1: [866, 987], p2: [-1290, 1040]},
    {op: "insert", p1: [985, 577], p2: [-1492, 1079]},
    {op: "delete", p1: [111, 865], p2: [-1426, 1053]},
    {op: "insert", p1: [1701, 402], p2: [-1774, 680]},
    {op: "delete", p1: [1026, 532], p2: [-1706, 681]},
    {op: "delete", p1: [1701, 402], p2: [-1774, 680]},
    {op: "insert", p1: [891, 488], p2: [-1257, 873]},
    {op: "delete", p1: [891, 488], p2: [-1257, 873]},
    {op: "delete", p1: [985, 577], p2: [-1492, 1079]},
    {op: "insert", p1: [945, 287], p2: [-1379, 647]},
    {op: "delete", p1: [945, 287], p2: [-1379, 647]},
    {op: "insert", p1: [1347, 253], p2: [-1746, 590]},
    {op: "insert", p1: [933, 437], p2: [-1485, 729]},
    {op: "insert", p1: [239, 488], p2: [-1693, 742]},
    {op: "insert", p1: [326, 300], p2: [-855, 765]},
    {op: "insert", p1: [148, 79], p2: [-1090, 139]},
    {op: "insert", p1: [688, 515], p2: [-1168, 625]},
    {op: "delete", p1: [326, 300], p2: [-855, 765]},
    {op: "insert", p1: [1286, 574], p2: [-1510, 918]},
    {op: "insert", p1: [1272, 22], p2: [-1675, 886]},
    {op: "insert", p1: [1532, 77], p2: [-1645, 903]},
    {op: "delete", p1: [1532, 77], p2: [-1645, 903]},
    {op: "delete", p1: [148, 79], p2: [-1090, 139]},
    {op: "delete", p1: [1286, 574], p2: [-1510, 918]},
    {op: "delete", p1: [1347, 253], p2: [-1746, 590]},
    {op: "delete", p1: [239, 488], p2: [-1693, 742]},
    {op: "delete", p1: [933, 437], p2: [-1485, 729]},
    {op: "insert", p1: [955, 382], p2: [-1861, 483]},
    {op: "insert", p1: [368, 521], p2: [-406, 530]},
    {op: "insert", p1: [27, 238], p2: [-466, 368]},
    {op: "delete", p1: [688, 515], p2: [-1168, 625]},
    {op: "insert", p1: [1055, 760], p2: [-1284, 900]},
    {op: "delete", p1: [368, 521], p2: [-406, 530]},
    {op: "delete", p1: [955, 382], p2: [-1861, 483]},
    {op: "delete", p1: [27, 238], p2: [-466, 368]},
    {op: "insert", p1: [196, 244], p2: [-1366, 721]},
    {op: "insert", p1: [387, 14], p2: [-975, 673]},
    {op: "delete", p1: [196, 244], p2: [-1366, 721]},
    {op: "insert", p1: [292, 150], p2: [-516, 728]},
    {op: "insert", p1: [628, 493], p2: [-1124, 954]},
    {op: "insert", p1: [1732, 13], p2: [-1775, 965]},
    {op: "insert", p1: [1046, 324], p2: [-1247, 833]},
    {op: "insert", p1: [1385, 11], p2: [-1776, 441]},
    {op: "insert", p1: [829, 543], p2: [-1054, 698]},
    {op: "insert", p1: [963, 830], p2: [-1744, 1046]},
    {op: "delete", p1: [387, 14], p2: [-975, 673]},
    {op: "insert", p1: [873, 556], p2: [-1820, 656]},
    {op: "insert", p1: [284, 302], p2: [-450, 977]},
    {op: "insert", p1: [1337, 809], p2: [-1604, 991]},
    {op: "insert", p1: [1070, 674], p2: [-1645, 843]},
    {op: "delete", p1: [829, 543], p2: [-1054, 698]},
    {op: "insert", p1: [377, 337], p2: [-384, 926]},
    {op: "delete", p1: [292, 150], p2: [-516, 728]},
    {op: "insert", p1: [67, 655], p2: [-886, 1036]},
    {op: "delete", p1: [1732, 13], p2: [-1775, 965]},
    {op: "delete", p1: [1272, 22], p2: [-1675, 886]},
    {op: "delete", p1: [67, 655], p2: [-886, 1036]},
    {op: "delete", p1: [1385, 11], p2: [-1776, 441]},
    {op: "insert", p1: [676, 194], p2: [-1888, 841]},
    {op: "delete", p1: [1046, 324], p2: [-1247, 833]},
    {op: "insert", p1: [1508, 698], p2: [-1913, 708]},
    {op: "delete", p1: [284, 302], p2: [-450, 977]},
    {op: "delete", p1: [628, 493], p2: [-1124, 954]},
    {op: "insert", p1: [20, 234], p2: [-1734, 667]},
    {op: "delete", p1: [20, 234], p2: [-1734, 667]},
    {op: "delete", p1: [1055, 760], p2: [-1284, 900]},
    {op: "delete", p1: [1508, 698], p2: [-1913, 708]},
    {op: "delete", p1: [963, 830], p2: [-1744, 1046]},
    {op: "delete", p1: [676, 194], p2: [-1888, 841]},
    {op: "insert", p1: [675, 119], p2: [-1196, 985]},
    {op: "delete", p1: [675, 119], p2: [-1196, 985]},
    {op: "insert", p1: [317, 102], p2: [-1829, 440]},
    {op: "delete", p1: [873, 556], p2: [-1820, 656]},
    {op: "insert", p1: [52, 361], p2: [-335, 1021]},
    {op: "delete", p1: [52, 361], p2: [-335, 1021]},
    {op: "insert", p1: [547, 8], p2: [-1376, 853]},
    {op: "insert", p1: [312, 146], p2: [-413, 692]},
    {op: "insert", p1: [1360, 691], p2: [-1910, 780]},
    {op: "delete", p1: [1360, 691], p2: [-1910, 780]},
    {op: "insert", p1: [71, 600], p2: [-1514, 929]},
    {op: "delete", p1: [312, 146], p2: [-413, 692]},
    {op: "delete", p1: [1070, 674], p2: [-1645, 843]},
    {op: "delete", p1: [377, 337], p2: [-384, 926]},
];

const rtree2 = new RTree();
let inserted: Set<Rectangle> = new Set();
let rtreeNodeIndex: number = 0;

function rtreeTestWithDraw() {
    let rect = rects[rtreeNodeIndex++];
    if (!rect) {
        Log4Ts.log(rtreeTestWithDraw, `Draw done. ${rtreeNodeIndex}`);
        return;
    }

    Log4Ts.log(rtreeTestWithDraw, `drew. ${rtreeNodeIndex}`);
    if (rect.op === "insert") {
        let r = Rectangle.fromUnordered(rect.p1, rect.p2);
        inserted.add(r);
        rtree2.insert(r);
    } else {
        let arr = Array.from(inserted.keys());
        let index = arr.findIndex((value, index) => {
            let r = Rectangle.fromUnordered(rect.p1, rect.p2);
            return value.p1[0] === r.p1[0]
                && value.p1[1] === r.p1[1]
                && value.p2[0] === r.p2[0]
                && value.p2[1] === r.p2[1];
        });
        let target = arr[index];
        inserted.delete(target);

        try {
            rtree2.remove(target);
        } catch (e) {
            console.log(e, `index: ${rects.indexOf(rect)}`);
        }
        arr.splice(index, 1);
    }

    drawTree(rtree2);
}

function drawTree(tree: RTree) {
    for (const btn of drewBtn) {
        btn.removeObject();
    }
    tree.size > 0 && drawRect(tree.box, true, 0);
    drawTreeNode(tree["_root"], 1);
}

function drawTreeNode(treeNode: RTreeNode, layer = 0) {
    if (treeNode.isLeaf()) {
        for (const box of treeNode.boxes) {
            drawRect(box);
        }
    } else {
        for (let i = 0; i < treeNode.boxes.length; ++i) {
            drawRect(treeNode.boxes[i], true, layer);
            drawTreeNode(treeNode.children[i], layer + 1);
        }
    }
}

let drewBtn: mw.Button[] = [];

function drawRect(rect: Rectangle, isBox: boolean = false, layer: number = 0) {
    let btn = mw.Button.newObject(mw.UIService.canvas, "img-rect");
    drewBtn.push(btn);
    btn.size = new Vector2(rect.getLength(0), rect.getLength(1));
    btn.position = new Vector2(rect.p1[0], rect.p1[1]);

    if (isBox) {
        Gtk.setButtonGuid(btn, "163418");
        btn.setNormalImageColorByHex(ColorUtil.colorHexWithAlpha("#f44747", 1 - 0.2 * layer));
        btn.normalImageDrawType = mw.SlateBrushDrawType.PixcelBox;
        btn.normalImageMargin = new mw.Margin(12, 12, 12, 12);
        btn.transitionEnable = false;
        btn.visibility = mw.SlateVisibility.HitTestInvisible;
    } else {
        Gtk.setButtonGuid(btn, Lui.Asset.ImgRectangle);
        btn.setNormalImageColorByHex(ColorUtil.colorHexWithAlpha("#000000", 0.2));
        btn.setPressedImageColorByHex(ColorUtil.colorHexWithAlpha("#000000", 0.8));
        btn.transitionEnable = true;
        btn.onClicked.add(() => Log4Ts.log(drawRect, `rect: ${rect.p1},${rect.p2}`));
        btn.visibility = mw.SlateVisibility.Visible;
    }

    return btn;
}

function startTraceRTree() {
    showPureBoard("#FFFFFF");
    let fastCount = 57;
    mw.setInterval(() => {
            if (fastCount > 0) {
                rtreeTestWithDraw();
                --fastCount;
            }
        },
        GtkTypes.Interval.Hz60 * 1);
    KeyOperationManager.getInstance().onKeyDown(undefined,
        mw.Keys.T,
        () => rtreeTestWithDraw());
}

// initClientDelegate.add(startTreeBench);
// updateClientDelegate.add(rtreeBench);
// initClientDelegate.add(startTraceRTree);

regTest("RTree", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(startTreeBench),
    }, {
        platform: PlatformFlag.Client,
        funcPak: new IntervalFuncPackage(rtreeBench),
    }, {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(startTraceRTree),
    });
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Area

const goToInfo: Map<mw.GameObject, RandomMoveRect> = new Map();

class RandomMoveRect {
    public static DEBUG_COUNT = 0;

    public go: mw.GameObject;

    // private _flowTween: FlowTweenTask<{ x: number, y: number }>;

    private _chosen: boolean;

    public get chosen(): boolean {
        return this._chosen;
    }

    constructor() {
        mw.GameObject.asyncSpawn("197386").then((value) => {
            this.go = value;
            this.go.worldTransform.scale = mw.Vector.one;
            this.go.worldTransform.position = new Vector(0, 0, 0);
            this.chosen = false;
            // this._flowTween = Waterween.flow(
            //     () => {
            //         let vec = this.go.worldTransform.position;
            //         return {
            //             x: vec.x,
            //             y: vec.y,
            //         };
            //     },
            //     (pos) => {
            //         this.go.worldTransform.position = new mw.Vector(pos.x, pos.y, 0);
            //         this.go[traceInjectKey] = true;
            //     },
            //     5e3,
            // );
            // AreaController.getInstance().registerGameObject(this.go, "player", undefined, 0.1e3);
            AreaController.getInstance().registerGameObject(this.go, "player", undefined, undefined);
            if (RandomMoveRect.DEBUG_COUNT-- > 0) {
                mw.TimeUtil.onEnterFrame.add(() =>
                    Log4Ts.log(RandomMoveRect, `go location: ${this.go.worldTransform.position}`));
            }

            goToInfo.set(this.go, this);
        });
    }

    public set chosen(value: boolean) {
        if (this._chosen === value) return;
        this._chosen = value;
        // if (value) (this.go as mw.Model).setMaterial("8E9EA1414DCF19516C4184AA4B9C3EC2");
        // else (this.go as mw.Model).setMaterial("CEDE9F6B4AE8A0B1A30B9B8A4B4564A0");
        (this.go as mw.Model).setVisibility(!value);
    }

    public randomMove() {
        if (!this.go) return;
        let target = Gtk.randomGenerator([5000, 5000]).handle(v => v - 2500).toVector2();
        // this._flowTween?.to({x: target.x, y: target.y});
    };

    public autoMove() {
        let handler = () => {
            this.randomMove();
            mw.setTimeout(handler, Gtk.random(5e3, 8e3));
        };

        handler();
    }
}

const areaTraceTestCount = 500;

let useAreaController = true;

function areaTraceBench() {
    const board = showPureBoard("#00000000");
    AreaController.getInstance().debug = true;

    let mouseStartPos: mw.Vector2;
    let selectImage: mw.Image = mw.Image.newObject(mw.UIService.canvas, "selectBox");
    selectImage.imageGuid = "163418";
    selectImage.setImageColorByHex(ColorUtil.colorHexWithAlpha("#3cbb1a", 1));
    selectImage.imageDrawType = mw.SlateBrushDrawType.PixcelBox;
    selectImage.margin = new mw.Margin(12, 12, 12, 12);

    let allInfo: RandomMoveRect[] = [];

    for (let i = 0; i < areaTraceTestCount; ++i) {
        let info = new RandomMoveRect();
        allInfo.push(info);
    }

    mw.setTimeout(() => {
            for (const info of allInfo.values()) {
                info.autoMove();
            }
        },
        3e3);

    board.onTouchBegin.add((location) => {
        mouseStartPos = absoluteToLocal(mw.UIService.canvas.cachedGeometry, location);
    });

    board.onTouchEnd.add(() => mouseStartPos = undefined);

    mw.Player.localPlayer.character.changeState(mw.CharacterStateType.Flying);
    mw.Player.localPlayer.character.setVisibility(false);

    regTest("Area-update", false,
        {
            platform: PlatformFlag.Client,
            funcPak: new IntervalFuncPackage((param) => {
                const mosPos = mw.getMousePositionOnViewport();
                if (mouseStartPos) {
                    Gtk.trySetVisibility(selectImage, true);
                    Gtk.setUiSize(selectImage, Math.abs(mosPos.x - mouseStartPos.x), Math.abs(mosPos.y - mouseStartPos.y));
                    const mouseLeftTop = new mw.Vector2(
                        Math.min(mouseStartPos.x, mosPos.x),
                        Math.min(mouseStartPos.y, mosPos.y));
                    const mouseRightBottom = new mw.Vector2(
                        Math.min(mouseStartPos.x, mosPos.x) + Math.abs(mosPos.x - mouseStartPos.x),
                        Math.min(mouseStartPos.y, mosPos.y) + Math.abs(mosPos.y - mouseStartPos.y),
                    );
                    Gtk.setUiPosition(selectImage, mouseLeftTop.x, mouseLeftTop.y);

                    let convertResult1 = mw.InputUtil.convertScreenLocationToWorldSpace(
                        mouseLeftTop.x * getViewportScale(),
                        mouseLeftTop.y * getViewportScale());
                    let convertResult2 = mw.InputUtil.convertScreenLocationToWorldSpace(
                        mouseRightBottom.x * getViewportScale(),
                        mouseRightBottom.y * getViewportScale());

                    if (convertResult1.result && convertResult2.result) {
                        let result1 = mw.QueryUtil.lineTrace(
                            convertResult1.worldPosition,
                            convertResult1.worldPosition
                                .clone()
                                .add(convertResult1.worldDirection.clone().multiply(10000)),
                            true,
                            true);
                        let result2 = mw.QueryUtil.lineTrace(
                            convertResult2.worldPosition,
                            convertResult2.worldPosition
                                .clone()
                                .add(convertResult2.worldDirection.clone().multiply(10000)),
                            true,
                            true);

                        for (const info of goToInfo.values()) info.chosen = false;

                        if (result1[0] && result2[0]) {
                            let startTime = Date.now();
                            // query by AC avg for <2ms count 5000 but trace all used 11ms with round=3
                            // query by AC avg for <2ms count 5000 but trace all used 5ms with round=6
                            // query by normal avg for 22ms count 5000
                            const gos: mw.GameObject[] = useAreaController ?
                                queryByAreaController(result1[0].position,
                                    result2[0].position) :
                                queryByNormal(result1[0].position,
                                    result2[0].position);
                            Log4Ts.log(areaTraceBench,
                                `query cost time ${Date.now() - startTime}ms. `,
                                `count: ${Array.from(goToInfo.keys()).length}`);

                            for (const go of gos) {
                                const info = goToInfo.get(go);
                                if (info) info.chosen = true;
                            }
                        }
                    }
                } else {
                    Gtk.trySetVisibility(selectImage, false);
                }
            }),
        });

    KeyOperationManager.getInstance().onKeyDown(undefined, mw.Keys.C, () => {
        useAreaController = !useAreaController;
        Log4Ts.log(areaTrace, `useAreaController: ${useAreaController}`);
    });
}

function areaTrace() {
    const board = showPureBoard("#00000000");

    let mouseStartPos: mw.Vector2;
    let selectImage: mw.Image = mw.Image.newObject(mw.UIService.canvas, "selectBox");
    selectImage.imageGuid = "163418";
    selectImage.setImageColorByHex(ColorUtil.colorHexWithAlpha("#3cbb1a", 1));
    selectImage.imageDrawType = mw.SlateBrushDrawType.PixcelBox;
    selectImage.margin = new mw.Margin(12, 12, 12, 12);

    let allInfo: RandomMoveRect[] = [];

    for (let i = 0; i < areaTraceTestCount; ++i) {
        let info = new RandomMoveRect();
        allInfo.push(info);
    }

    mw.setTimeout(() => {
            for (const info of allInfo.values()) {
                info.autoMove();
            }
        },
        3e3);

    board.onTouchBegin.add((location) => {
        mouseStartPos = absoluteToLocal(mw.UIService.canvas.cachedGeometry, location);
    });

    board.onTouchEnd.add(() => mouseStartPos = undefined);

    mw.Player.localPlayer.character.changeState(mw.CharacterStateType.Flying);
    mw.Player.localPlayer.character.setVisibility(false);

    regTest("Area-update", false,
        {
            platform: PlatformFlag.Client,
            funcPak: new IntervalFuncPackage((param) => {
                const mosPos = mw.getMousePositionOnViewport();
                if (mouseStartPos) {
                    Gtk.trySetVisibility(selectImage, true);
                    Gtk.setUiSize(selectImage, Math.abs(mosPos.x - mouseStartPos.x), Math.abs(mosPos.y - mouseStartPos.y));
                    const mouseLeftTop = new mw.Vector2(
                        Math.min(mouseStartPos.x, mosPos.x),
                        Math.min(mouseStartPos.y, mosPos.y));
                    const mouseRightBottom = new mw.Vector2(
                        Math.min(mouseStartPos.x, mosPos.x) + Math.abs(mosPos.x - mouseStartPos.x),
                        Math.min(mouseStartPos.y, mosPos.y) + Math.abs(mosPos.y - mouseStartPos.y),
                    );
                    Gtk.setUiPosition(selectImage, mouseLeftTop.x, mouseLeftTop.y);

                    let convertResult1 = mw.InputUtil.convertScreenLocationToWorldSpace(
                        mouseLeftTop.x * getViewportScale(),
                        mouseLeftTop.y * getViewportScale());
                    let convertResult2 = mw.InputUtil.convertScreenLocationToWorldSpace(
                        mouseRightBottom.x * getViewportScale(),
                        mouseRightBottom.y * getViewportScale());

                    if (convertResult1.result && convertResult2.result) {
                        let result1 = mw.QueryUtil.lineTrace(
                            convertResult1.worldPosition,
                            convertResult1.worldPosition
                                .clone()
                                .add(convertResult1.worldDirection.clone().multiply(10000)),
                            true,
                            true);
                        let result2 = mw.QueryUtil.lineTrace(
                            convertResult2.worldPosition,
                            convertResult2.worldPosition
                                .clone()
                                .add(convertResult2.worldDirection.clone().multiply(10000)),
                            true,
                            true);

                        for (const info of goToInfo.values()) info.chosen = false;

                        if (result1[0] && result2[0]) {
                            const gos: mw.GameObject[] = useAreaController ?
                                queryByAreaController(
                                    result1[0].position,
                                    result2[0].position) :
                                queryByNormal(
                                    result1[0].position,
                                    result2[0].position,
                                );

                            // Log4Ts.log(areaTraceBench,
                            //     `query cost time ${Date.now() - startTime}ms. `,
                            //     `count: ${Array.from(goToInfo.keys()).length}`);

                            for (const go of gos) {
                                const info = goToInfo.get(go);
                                if (info) info.chosen = true;
                            }
                        }
                    }
                } else {
                    Gtk.trySetVisibility(selectImage, false);
                }
            }),
        });
    KeyOperationManager.getInstance().onKeyDown(undefined, mw.Keys.C, () => {
        useAreaController = !useAreaController;
        Log4Ts.log(areaTrace, `useAreaController: ${useAreaController}`);
    });
}

function queryByAreaController(rectLeftTop: mw.Vector2, rectRightBottom: mw.Vector2) {
    const gos: mw.GameObject[] = [];
    for (let iTransform of AreaController.getInstance()
        .selectSource("player")
        .queryGoInRect<mw.GameObject>([
            {x: rectLeftTop.x, y: rectLeftTop.y},
            {x: rectRightBottom.x, y: rectRightBottom.y}])) {
        gos.push(iTransform);
    }

    return gos;
}

function queryByNormal(rectLeftTop: mw.Vector2, rectRightBottom: mw.Vector2) {
    const gos: mw.GameObject[] = [];
    for (const info of goToInfo.values()) {
        let pos = info.go.worldTransform.position;
        if (pos.x >= rectLeftTop.x && pos.x <= rectRightBottom.x
            && pos.y >= rectLeftTop.y && pos.y <= rectRightBottom.y) {
            gos.push(info.go);
        }
    }

    return gos;
}

regTest("Area", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(areaTraceBench),
    });

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region AssetLoad
const assetList: string[] = [
    "115876",
    "119034",
    "119915",
    "123123",
    "121949",
    "00000",// not exist
];

function loadSpawnAsset() {
    for (const assetId of assetList) {
        if (mw.GameObject.spawn(assetId, {replicates: true}) == null) Log4Ts.log(loadSpawnAsset, `obj create failed by spawn directly`);

        AssetController.getInstance()
            .load(assetId)
            .then((result) => {
                let obj: mw.GameObject;
                if (result) obj = mw.GameObject.spawn(assetId, {replicates: true});
                if (obj == null) {
                    Log4Ts.log(loadSpawnAsset, `obj create failed`);
                }
            });

        // mw.GameObject.asyncSpawn(assetId, {replicates: true}).then((value) => {
        //     if (value == null) Log4Ts.log(loadSpawnAsset, `obj create failed by asyncSpawn`);
        // });
    }
}

let soundObjCache: mw.Sound;

const soundAssetList: string[] = [
    "12525",
    "12561",
    "12582",
    "12586",
    "12603",
    "12606",
];

async function getInfoByAssetId() {
    let i = 0;
    mw.setInterval(async () => {
        if (i >= soundAssetList.length) return;
        if (!soundObjCache) soundObjCache = await mw.Sound.asyncSpawn<Sound>(soundAssetList[i++]);
        else {
            const assetId = soundAssetList[i++];
            let result = await AssetController.getInstance().load(assetId);
            if (result) {
                soundObjCache.setSoundAsset(assetId);
                soundObjCache.worldTransform.position = Gtk.newWithX(
                    soundObjCache.worldTransform.position,
                    soundObjCache.worldTransform.position.x - 100);
            } else {
                soundObjCache = undefined;
            }
        }
        if (!soundObjCache) return;
        soundObjCache.volume = 1;
        soundObjCache.isUISound = true;
        soundObjCache.isSpatialization = true;
        soundObjCache.play(0);
        Log4Ts.log(getInfoByAssetId, `sound info of ${soundObjCache.assetId}:`,
            `timeLength: ${soundObjCache.timeLength}`,
            `falloffDistance: ${soundObjCache.falloffDistance}`,
            `location: ${soundObjCache.worldTransform.position}`,
            `player location: ${
                mw.SystemUtil.isClient() ?
                    Player.localPlayer.character.worldTransform.position :
                    null}`);
    }, 6e3);
}

regTest("AssetLoad", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(getInfoByAssetId),
    });

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region OnChange
// function onBasePropertyChange() {
//     mw.Player.localPlayer.character.getPropertyChangeDelegate("worldTransform.position.x").add(() => {
//         Log4Ts.log(onBasePropertyChange, `position changed traced by worldTransform.position.x`);
//     });
//     mw.Player.localPlayer.character.getPropertyChangeDelegate("position.x").add(() => {
//         Log4Ts.log(onBasePropertyChange, `position changed traced by position.x`);
//     });
//     mw.Player.localPlayer.character.getPropertyChangeDelegate("x").add(() => {
//         Log4Ts.log(onBasePropertyChange, `position changed traced by x`);
//     });
//     mw.Player.localPlayer.character.getPropertyChangeDelegate("position").add(() => {
//         Log4Ts.log(onBasePropertyChange, `position changed traced by position`);
//     });
//
//     mw.Player.localPlayer.character.onPropertyChange.add((path, value, oldValue) => {
//         Log4Ts.log(onBasePropertyChange, `property changed traced by onPropertyChange. ${path} ${value} ${oldValue}`);
//     });
// }

// regTest("OnChange,truefalse{
//     platform: PlatformFlag.Client,
//     funcPak: new InitFuncPackage(onBasePropertyChange),
// });
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Sound

const shortSound = "13407";
const middleSound = "12525";
const longSound = "200435";

function soundLoop() {
    let timer: number = undefined;
    let go: mw.Sound = undefined;
    AssetController.getInstance().load(longSound);

    KeyOperationManager.getInstance().onKeyDown(undefined, mw.Keys.P, () => {
        mw.Sound.asyncSpawn<mw.Sound>("199625").then((g) => {
            if (timer !== undefined) {
                mw.clearInterval(timer);
                timer = undefined;
                go?.destroy();
                go = undefined;
            }
            go = g;
            // 必须先 load 后设置 isLoop. 否则会导致 isLoop 设置无效
            // 该逻辑在 mw 内部 无法绕开.
            g.isLoop = true;
            // play 内自带一次 load.
            g.worldTransform.position = new Vector(0, 0, 0);
            g.falloffDistance = 0;
            g.isSpatialization = true;
            g.attenuationDistanceModel = mw.AttenuationDistanceModel.Linear;
            g.attenuationShape = mw.AttenuationShape.Box;
            g.attenuationShapeExtents = new mw.Vector(300, 300, 300);
            g.volume = 1;
            g.play();
            Log4Ts.log(soundLoop, `playing`);

            timer = mw.setInterval(() => {
                // Log4Ts.log(soundLoop, `sound is loop? ${mw.SoundService["getInstance"]().get2DSound("199625").mGo.isLoop}`);
            }, 0.1e3);
        });
    });

    KeyOperationManager.getInstance().onKeyDown(undefined, mw.Keys.M, () => {
        mw.SoundService.playSound("199625", 0, 1);
        if (timer) {
            mw.clearInterval(timer);
            timer = undefined;
            mw.SoundService.stopSound("199625");
        }

        // timer = mw.setInterval(() => {
        //     Log4Ts.log(soundLoop, `sound is loop? ${mw.SoundService["getInstance"]().get2DSound("199625").mGo.isLoop}`);
        // }, 0.1e3);
    });
}

function soundInterfaces() {
    AssetController.getInstance().load(shortSound);
    let go: mw.Sound;
    mw.Sound.asyncSpawn<mw.Sound>(shortSound).then((g) => {
        go = g;
        g.isLoop = false;
        g.isSpatialization = false;
        g.volume = 1;
        g.setSoundAsset("200435");
        Log4Ts.log(soundInterfaces, `length of asset: ${go.timeLength}ms.`);
        g.onFinish.add(() => Log4Ts.log(soundInterfaces, `finish.`));
        g.onPause.add(() => Log4Ts.log(soundInterfaces, `pause.`));
        g.onPlay.add(() => Log4Ts.log(soundInterfaces, `play.`));

        Log4Ts.log(soundLoop, `loaded.`);
    });

    kom.onKeyDown(undefined, mw.Keys.J, () => {
        Log4Ts.log(soundInterfaces, `length of asset: ${go.timeLength}ms.`);
        go?.play(0, () => Log4Ts.log(soundInterfaces));
    });

    kom.onKeyDown(undefined, mw.Keys.N, () => go?.pause());
    kom.onKeyDown(undefined, mw.Keys.M, () => go?.pause(false));
    kom.onKeyDown(undefined, mw.Keys.L, () => go?.stop());
}

function soundController() {
    if (mw.SystemUtil.isClient()) {
        let sound: SoundProxy;
        kom.onKeyDown(undefined,
            mw.Keys.P,
            () => {
                Log4Ts.log(soundController, `play.`);
                if (!sound) {
                    sound = MediaService.getInstance().playSound({
                            assetId: middleSound,
                            loopCount: 3,
                            isSpatial: true,
                            falloffDistance: 100,
                            attenuationShapeExtents: [100],
                            attenuationShape: mw.AttenuationShape.Box,
                        },
                        new mw.Vector(0, 0, 0),
                        false,
                    );
                    sound.onFinish.add((lastLoop: number) => {
                        Log4Ts.log(soundController, `last loopCount: ${lastLoop}`);
                    });
                } else {
                    sound.play();
                }
            });
    }
}

function soundControllerInServer() {
    MediaService.getInstance().playSound({
            assetId: longSound,
            loopCount: 10,
        },
        Gtk.randomArrayItem(mw.Player.getAllPlayers())!.character,
        true,
    );
}

regTest("Sound", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new DelayFuncPackage(soundInterfaces),
    }, {
        platform: PlatformFlag.Client | PlatformFlag.Server,
        funcPak: new InitFuncPackage(soundController),
    }, {
        platform: PlatformFlag.Server,
        funcPak: new DelayFuncPackage(soundControllerInServer),
    });
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Effect
const loopEffect = "4336";
const nonLoopEffect = "13407";
const prefabGuid = "182690684F418D6F002AD5A16275A502";

async function effectInterfaces() {
    let go: mw.Effect;

    await AssetController.getInstance().load(loopEffect);
    mw.Effect.asyncSpawn<mw.Effect>(loopEffect).then((g) => {
        go = g;
        go.loopCount = 3;
        go.duration = 3;
        go.stop();
        go.worldTransform.position = mw.Vector.zero;
        go.onFinish.add(() => {
            Log4Ts.log(effectInterfaces, `finish at ${Date.now()}`);
        });
        Log4Ts.log(effectInterfaces, `loaded.`);
    });

    kom.onKeyDown(undefined, mw.Keys.J, () => {
        Log4Ts.log(effectInterfaces, `play at: ${Date.now()}`);
        Log4Ts.log(soundInterfaces, `length of asset: ${go.timeLength}ms.`);
        go.play();
    });

    kom.onKeyDown(undefined, mw.Keys.K, () => {
        go?.stop();
        Log4Ts.log(effectInterfaces, `stop.`);
    });

    kom.onKeyDown(undefined, mw.Keys.N, () => {
        go["effect"]["CascadeParticleSystemComponent"]["CustomTimeDilation"] = 0;
        Log4Ts.log(effectInterfaces, `pause.`);
    });

    kom.onKeyDown(undefined, mw.Keys.M, () => {
        go["effect"]["CascadeParticleSystemComponent"]["CustomTimeDilation"] = 1;
        Log4Ts.log(effectInterfaces, `continue.`);
    });
}

function effectController() {
    showTestPanel();
    MediaService.getInstance().debug = true;

    if (mw.SystemUtil.isClient()) {
        let effect: EffectProxy;
        kom.onKeyDown(undefined,
            mw.Keys.P,
            () => {
                Log4Ts.log(effectController, `play.`);
                if (!effect) {
                    effect = MediaService.getInstance().playEffect({
                            prefabGuid: prefabGuid,
                            loop: true,
                            // loopCountOrDuration: 3e3,
                            singleLength: 2e3,
                            slotType: mw.HumanoidSlotType.RightHand,
                        },
                        // mw.Vector.zero,
                        mw.Player.localPlayer.character,
                        false,
                    );
                    effect.onFinish.add((lastLoop: number) => {
                        mw.Event.dispatchToLocal(TestPanel.ShowInfoEventName, `last loopCount: ${lastLoop}`);
                        Log4Ts.log(effectController, `last loopCount: ${lastLoop}`);
                    });
                } else {
                    effect.play();
                }
            });
        kom.onKeyDown(undefined,
            mw.Keys.J,
            () => {
                Log4Ts.log(effectController, `pause.`);
                effect?.pause();
            });
        kom.onKeyDown(undefined,
            mw.Keys.K,
            () => {
                Log4Ts.log(effectController, `continue.`);
                effect?.continue();
            });
        kom.onKeyDown(undefined,
            mw.Keys.L,
            () => {
                Log4Ts.log(effectController, `stop.`);
                effect?.stop();
            });
    }
}

regTest("Effect", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(effectInterfaces),
    }, {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(effectController),
    });
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Revised Interval
function revisedInterval() {
    const now = Date.now();
    let start = now;
    let last = now;
    console.log(`start at ${now}`);
    const timer = new RevisedInterval(
        () => {
            const now = Date.now();
            console.log(`now: ${now}, step: ${now - last}, dist: ${(now - start) / 1e3}`);
            last = now;
        },
        1e3,
        3e3,
        false,
    );

    mw.setTimeout(() => timer.shutdown(), 20e3);
}

// initClientDelegate.add(revisedInterval);
regTest("Revised Interval", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(effectInterfaces),
    });
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Teleport
function teleport() {
    addGMCommand("teleport",
        "void",
        undefined,
        (player, params) => {
            const roomInfo = mw.TeleportService.asyncGetPlayerRoomInfo(player.userId)
                .then((value) => {
                    Log4Ts.log(teleport, `${JSON.stringify(value)}`);
                });
        });

    GodModService.getInstance().showGm();
}

regTest("Teleport", false,
    {
        platform: PlatformFlag.Client | PlatformFlag.Server,
        funcPak: new InitFuncPackage(effectInterfaces),
    });
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Focus On Me
function focusOnMe() {
    KeyOperationManager.getInstance().onKeyDown(undefined,
        mw.Keys.T,
        () => mw.Camera.switch(mw.GameObject.findGameObjectById("19C58FA9") as mw.Camera));
}

function useExampleCamera() {
}

regTest("Focus On Me", false,
    {
        platform: PlatformFlag.Client | PlatformFlag.Server,
        funcPak: new InitFuncPackage(() => {
            addGMCommand("change target",
                "string",
                (guid) => FocusOnMe.controller.setTargetGuid(guid));

            addGMCommand("change location",
                "vector",
                (location) => FocusOnMe.controller.setTargetLocation(location));

            addGMCommand("run",
                "void",
                () => FocusOnMe.controller.run());

            addGMCommand("change spring arm length",
                "number",
                (val) => (mw.GameObject.findGameObjectById("19C58FA9") as mw.Camera).springArm.length = val);

            GodModService.getInstance().showGm();
        }),
    }, {
        platform: PlatformFlag.Client,
        funcPak: new InitFuncPackage(focusOnMe),
    });
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region BuryPoint
function buryPoint() {
    BuryPointController.getInstance().report(
        "Ts_Page",
        {
            gameid: 0,
            ugc_type: 0,
            editor_parent_id: 0,
            ugc_parent_id: "",
            page_name: "",
            pre_page_name: "",
        });
}

regTest("Bury Point Controller", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new DelayFuncPackage(buryPoint),
    });

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Waterween

type TestTweenTaskObj = {
    intVal: number,
    intVal2: number,
}

let atts: AdvancedTweenTask<TestTweenTaskObj>[] = [];
let oatts: actions.tweens.Tween<Image>[] = [];
let ftts: FlowTweenTask<TestTweenTaskObj>[] = [];
let ttUis: mw.Image[] = [];
let ttCount: number = 1024;
let ttgSubCount: number = 8;
let ttTimeOffset = 1e3 / ttCount;
let gtt: TweenTaskGroupBase;

function generateAdvancedTweenTask() {
    if (ttUis.length < ttCount) {
        for (let i = ttUis.length; i < ttCount; ++i) {
            ttUis[i] = mw.Image.newObject(mw.UIService.canvas);
            ttUis[i].imageGuid = Lui.Asset.ImgRectangle;
            ttUis[i].position = new Vector2(10, 20);
            ttUis[i].size = new Vector2(10, 10);
            ttUis[i].renderOpacity = Math.max(Gtk.MIN_SAFE_UI_RENDER_OPACITY, 1 / ttCount);
        }
    }
    Log4Ts.warn(generateAdvancedTweenTask, `generated.`);
    let val: TestTweenTaskObj = {intVal: 10, intVal2: 20};

    if (atts.length > 0) {
        for (const att of atts) att.destroy();
        atts.length = 0;
    }

    for (let i = 0; i < ttCount; ++i) {
        atts[i] = Waterween.to(
            () => {
                let size = ttUis[i].size;
                return {
                    intVal: size.x,
                    intVal2: size.y,
                };
            },
            (v) => {
                if (i === 0) {
                    val.intVal = v.intVal;
                    val.intVal2 = v.intVal2;
                    Log4Ts.log(generateAdvancedTweenTask, `${JSON.stringify(v)}`);
                }

                Gtk.setUiSize(ttUis[i], v.intVal, v.intVal2);
            },
            {
                intVal: 300,
                intVal2: 600,
            },
            3e3,
            {
                intVal: 0,
                intVal2: 300,
            },
            Easing.easeInOutCirc,
        );

        // oatts[i] = actions.tween(ttUis[i])
        //     .to(3e3,
        //         {
        //             size: new mw.Vector2(
        //                 300,
        //                 600),
        //         },
        //         {
        //             easing: Easing.easeInOutCirc,
        //             onUpdate: (target, t) => {
        //                 if (i === 0) {
        //                     val.intVal = target.size.x;
        //                     val.intVal2 = target.size.y;
        //                     Log4Ts.log(generateAdvancedTweenTask, `${JSON.stringify(target.position)}`);
        //                 }
        //             },
        //         })
        //     .set({size: new mw.Vector2(0, 300)})
        //     .union();
        //
        // oatts[i].start();
    }
}

function pauseATT() {
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => atts[i]?.pause(), i * ttTimeOffset);
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => oatts[i]?.stop(), i * ttTimeOffset);
}

function continueATT() {
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => atts[i]?.continue(), i * ttTimeOffset);
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => oatts[i]?.start(), i * ttTimeOffset);
}

function restartATT() {
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => atts[i]?.restart(), i * ttTimeOffset);
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => oatts[i]?.start(), i * ttTimeOffset);
}

function forwardATT() {
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => atts[i]?.forward(), i * ttTimeOffset);
    if (atts.length === 0) Log4Ts.warn(forwardATT, `forward is not support in actions tween `);
}

function backwardATT() {
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => atts[i]?.backward(), i * ttTimeOffset);
    if (atts.length === 0) Log4Ts.warn(forwardATT, `backward is not support in actions tween `);
}

function fastForwardToEndATT() {
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => atts[i]?.fastForwardToEnd(), i * ttTimeOffset);
    if (atts.length === 0) Log4Ts.warn(forwardATT, `fastForwardToEnd is not support in actions tween `);
}

function generateFlowTweenTask() {
    if (ttUis.length < ttCount) {
        for (let i = ttUis.length; i < ttCount; ++i) {
            ttUis[i] = mw.Image.newObject(mw.UIService.canvas);
            ttUis[i].imageGuid = Lui.Asset.ImgRectangle;
            ttUis[i].position = new Vector2(10, 20);
            ttUis[i].size = new Vector2(10, 10);
        }

        mw.InputUtil.onTouch((index, location, touchType) => {
            if (touchType !== mw.TouchInputType.TouchBegin) return;

            const pos = Gtk.screenToUI(mw.getMousePositionOnPlatform());
            for (let i = 0; i < ttCount; ++i) {
                mw.setTimeout(() => {
                        ftts[i]?.to({
                            intVal: pos.x,
                            intVal2: pos.y,
                        });
                    },
                    i * ttTimeOffset);
            }
        });
    }

    Log4Ts.warn(generateFlowTweenTask, `generated.`);
    let val: TestTweenTaskObj = {intVal: 10, intVal2: 20};
    if (ftts.length > 0) {
        for (const ftt of ftts) ftt.destroy();
        ftts.length = 0;
    }

    for (let i = 0; i < ttCount; ++i) {
        ftts[i] = Waterween.flow(
            () => {
                const pos = ttUis[i].position;
                return ({intVal: pos.x, intVal2: pos.y});
            },
            (v) => {
                if (i === 0) {
                    val.intVal = v.intVal;
                    val.intVal2 = v.intVal2;
                }

                Gtk.setUiPosition(ttUis[i], v.intVal, v.intVal2);
            },
            1e3,
        );
    }
}

function pauseFTT() {
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => ftts[i]?.pause(), i * ttTimeOffset);
}

function continueFTT() {
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => ftts[i]?.continue(), i * ttTimeOffset);
}

function fastForwardToEndFTT() {
    for (let i = 0; i < ttCount; ++i) mw.setTimeout(() => ftts[i]?.fastForwardToEnd(), i * ttTimeOffset);
}

let lastMode: GroupMode = "sequence";

function generateGroupTweenTask() {
    if (ttUis.length < ttgSubCount) {
        for (let i = ttUis.length; i < ttgSubCount; ++i) {
            ttUis[i] = mw.Image.newObject(mw.UIService.canvas);
            ttUis[i].imageGuid = Lui.Asset.ImgRectangle;
            ttUis[i].position = new Vector2(10, 20 + i * 1040 / ttgSubCount);
            ttUis[i].size = new Vector2(10, Math.max(1, 1040 / ttgSubCount));
            ttUis[i].renderOpacity = 0.8;
        }
    }
    Log4Ts.warn(generateGroupTweenTask, `generated. current mode: ${lastMode}`);

    let val: TestTweenTaskObj = {intVal: 10, intVal2: 10};

    if (gtt !== undefined) gtt.destroy();

    const atts: AdvancedTweenTask<TestTweenTaskObj>[] = [];

    for (let i = 0; i < ttgSubCount; ++i) {
        atts[i] = Waterween.to(
            () => {
                let size = ttUis[i].size;
                return {
                    intVal: size.x,
                    intVal2: size.y,
                };
            },
            (v) => {
                if (i === 0) {
                    val.intVal = v.intVal;
                    val.intVal2 = v.intVal2;
                    Log4Ts.log(generateGroupTweenTask, `intVal: ${v.intVal}`);
                }

                Gtk.setUiSizeX(ttUis[i], v.intVal);
            },
            {
                intVal: 800,
                intVal2: 0,
            },
            1e3,
            {
                intVal: 10,
                intVal2: 0,
            },
            Easing.easeInOutCirc,
        );
    }

    gtt = Waterween.group(lastMode, ...atts);
    lastMode = lastMode === "sequence" ? "parallel" : "sequence";
}

function pauseGTT() {
    gtt?.pause();
}

function continueGTT() {
    gtt?.continue();
}

function restartGTT() {
    gtt?.restart();
}

function forwardGTT() {
    gtt?.forward();
}

function backwardGTT() {
    gtt?.backward();
}

function fastForwardToEndGTT() {
    gtt?.fastForwardToEnd();
}

function generateGroupTweenTaskByPipe() {
    if (ttUis.length < 1) {
        for (let i = ttUis.length; i < ttgSubCount; ++i) {
            ttUis.push(mw.Image.newObject(mw.UIService.canvas));
            ttUis[0].imageGuid = Lui.Asset.ImgRectangle;
            ttUis[0].position = new Vector2(400, 400);
            ttUis[0].size = new Vector2(10, 10);
            ttUis[0].renderOpacity = 0.8;
        }
    }
    Log4Ts.warn(generateGroupTweenTaskByPipe, `generated.`);

    let val: TestTweenTaskObj = {intVal: 10, intVal2: 10};
    gtt = Waterween.pipe(
        () => {
            let size = ttUis[0].size;
            return {
                intVal: size.x,
                intVal2: size.y,
            };
        },
        (v) => {
            if (rtreeNodeIndex === 0) {
                val.intVal = v.intVal;
                val.intVal2 = v.intVal2;
                Log4Ts.log(generateGroupTweenTaskByPipe, `intVal: ${v.intVal}`);
            }

            Gtk.setUiSize(ttUis[0], v.intVal, v.intVal2);
        },
        [
            {dist: {intVal: 200}, duration: 1e3},
            {dist: {intVal2: 200}, duration: 1e3},
            {dist: {intVal: 400}, duration: 1e3},
            {dist: {intVal: 10, intVal2: 10}, duration: 0.5e3},
        ],
        undefined,
        Easing.easeInOutCirc,
    );
}

regTest("Advanced Tween Task", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(generateAdvancedTweenTask, mw.Keys.G),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(pauseATT, mw.Keys.P),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(continueATT, mw.Keys.C),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(restartATT, mw.Keys.R),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(forwardATT, mw.Keys.F),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(backwardATT, mw.Keys.B),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(fastForwardToEndATT, mw.Keys.E),
    },
);

regTest("Flow Tween Task", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(generateFlowTweenTask, mw.Keys.G),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(pauseFTT, mw.Keys.P),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(continueFTT, mw.Keys.C),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(fastForwardToEndFTT, mw.Keys.E),
    },
);

regTest("Group Tween Task", false,
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(generateGroupTweenTask, mw.Keys.G),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(pauseGTT, mw.Keys.P),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(continueGTT, mw.Keys.C),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(restartGTT, mw.Keys.R),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(forwardGTT, mw.Keys.F),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(backwardGTT, mw.Keys.B),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(fastForwardToEndGTT, mw.Keys.E),
    },
);

regTest("Group Tween Task By Pipe", true,
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(generateGroupTweenTaskByPipe, mw.Keys.G),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(pauseGTT, mw.Keys.P),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(continueGTT, mw.Keys.C),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(restartGTT, mw.Keys.R),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(forwardGTT, mw.Keys.F),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(backwardGTT, mw.Keys.B),
    },
    {
        platform: PlatformFlag.Client,
        funcPak: new TouchFuncPackage(fastForwardToEndGTT, mw.Keys.E),
    },
);

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
