import TestModuleData, { TestModuleC, TestModuleS } from "./module/TestModule";
import AuthModuleData, { AuthModuleC, AuthModuleS } from "./module/AuthModule";
import * as mwaction from "mwaction";
import { VectorExt } from "./declaration/vectorext";
import BoardPanel from "./lab/ui/BoardPanel";
import { TestPanel } from "./test/TestPanel";
import TweenElementPanelOld from "./lab/ui/tween/TweenElementPanelOld";
import TweenElementPanel from "./lab/ui/tween/TweenElementPanel";
import Waterween from "./depend/waterween/Waterween";
import { Delegate, RandomGenerator } from "./util/GToolkit";
import Log4Ts from "./depend/log4ts/Log4Ts";
import TweenWaterween_Generate from "./ui-generate/UIAnimLab/tween/TweenWaterween_generate";
import GlobalTips from "./depend/global-tips/GlobalTips";
import KeyOperationManager from "./controller/key-operation-manager/KeyOperationManager";
import Balancing from "./depend/balancing/Balancing";
import BubbleWidget from "./depend/global-tips/example/BubbleWidget";
import GlobalTipsPanel from "./depend/global-tips/example/GlobalTipsPanel";
import { addGMCommand, GodModService } from "./depend/god-mod/GodModService";
import { RangeDataValidator } from "./depend/god-mod/GodModParam";
import { Button } from "./lui/Button";
import SystemUtil = mw.SystemUtil;
import UIService = mw.UIService;
import SimpleDelegate = Delegate.SimpleDelegate;
import EffectService = mw.EffectService;

let initClientDelegate: SimpleDelegate<void> = new SimpleDelegate();

let initServiceDelegate: SimpleDelegate<void> = new SimpleDelegate();

let initAllEndDelegate: SimpleDelegate<void> = new SimpleDelegate();

let delayExecuteClientDelegate: SimpleDelegate<void> = new SimpleDelegate();

let delayExecuteServerDelegate: SimpleDelegate<void> = new SimpleDelegate();

let delayExecuteAllEndDelegate: SimpleDelegate<void> = new SimpleDelegate();

let updateClientDelegate: SimpleDelegate<number> = new SimpleDelegate();

let updateServerDelegate: SimpleDelegate<number> = new SimpleDelegate();

let updateAllEndDelegate: SimpleDelegate<number> = new SimpleDelegate();

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

        if (SystemUtil.isClient()) {
            initClientDelegate.invoke();
        } else if (SystemUtil.isServer()) {
            initServiceDelegate.invoke();
        }
        initAllEndDelegate.invoke();

        if (SystemUtil.isClient()) {
            setTimeout(
                () => delayExecuteClientDelegate.invoke(),
                GameStart.CLIENT_DELAY_TIMEOUT);
        } else if (SystemUtil.isServer()) {
            setTimeout(
                () => delayExecuteServerDelegate.invoke(),
                GameStart.SERVER_DELAY_TIMEOUT);
        }
        setTimeout(
            () => delayExecuteAllEndDelegate.invoke(),
            GameStart.SERVER_DELAY_TIMEOUT,
        );
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);

        if (SystemUtil.isClient()) {
            updateClientDelegate.invoke(dt);
        } else if (SystemUtil.isServer()) {
            updateServerDelegate.invoke(dt);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

//endregion

//#region Opportunity
    public initAllEnd: () => void = () => {
        ModuleService.registerModule(AuthModuleS, AuthModuleC, AuthModuleData);
        ModuleService.registerModule(TestModuleS, TestModuleC, TestModuleData);
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Event Callback
//endregion
}

function compareWidgetStack(lhs: mw.Widget, rhs: mw.Widget): number {
    const root = UIService.canvas;
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
            // UIService layer manager needed.
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
 *      - undefined: 默认指向 {@link UIService.canvas}
 * @return {boolean}
 */
function widgetAttachOnRoot(widget: mw.Widget, root: mw.Widget = undefined): boolean {
    if (!widget) return false;
    if (!root) root = UIService.canvas;
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

//#region TDD
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
            Waterween.update();
        });

    let sampleCount = 0;
    let avg = 0;

    const updateBenchHandler = (param: number) => {
        const startTime = Date.now();
        const cost = Date.now() - startTime;

        updateHandler(param);

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

    updateClientDelegate.add(updateBenchHandler);

    const tweenBenchPanel = UIService.show(TweenWaterween_Generate);
    const now = Date.now();
    for (let i = 0; i < testTime; ++i) {
        const item = useOld ?
            UIService.create(TweenElementPanelOld) :
            UIService.create(TweenElementPanel);

        item.initSeqTweenTask(now);
        tweenBenchPanel.cnvContainer.addChild(item.uiObject);
    }
}

// initClientDelegate.add(() => benchTween(false, 2400));
//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region GlobalTips
/**
 * Global Tips 测试.
 */
function testGlobalTips() {
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

// delayExecuteClientDelegate.add(testGlobalTips);
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

    EffectService.playOnGameObject("155590", go, {
        duration: 3e3,
        loopCount: 0,
        scale: mw.Vector.one.multiply(10),
    });
}

// delayExecuteClientDelegate.add(benchBalancing);
// delayExecuteClientDelegate.add(benchUnBalancing);
// delayExecuteClientDelegate.add(benchEffectBalancing);
// delayExecuteClientDelegate.add(benchEffectUnBalancing);
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
        .onKeyPress(UIService.getUI(TestPanel),
            mw.Keys.U,
            (dt) => Log4Ts.log(testKeyPress, `U pressed. dt: ${dt}`),
        );
}

// initClientDelegate.add(testKomWidgetBinding);
// initClientDelegate.add(testAddKeyBinding);
// initClientDelegate.add(testKomBindButton);
// initClientDelegate.add(testKeyPress);
//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region Function from String
function testFunctionFromString() {
    const func = new Function("console.log(\"Hello world\")");
    func();
}

// delayExecuteClientDelegate.add(testFunctionFromString);
//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region Asset Load
function loadAUiAsset() {
    const testPanel = UIService.getUI(TestPanel);
    KeyOperationManager.getInstance().bindButton(
        testPanel,
        mw.Keys.T,
        testPanel.testButton,
    );

    testPanel.testButton.onClicked.add(() => {
        const img = UIService.getUI(BoardPanel).imgStage;
        if (img.imageGuid === "37673") {
            img.imageGuid = "37684";
        } else {
            img.imageGuid = "37673";
        }
    });
    // mw.AssetUtil.asyncDownloadAsset("197386");
}

// initClientDelegate.add(loadAUiAsset);
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Complex Type

function testEventWithComplexType() {
    if (SystemUtil.isServer()) {
        Event.dispatchToClient(Player.getAllPlayers()[0], "Test", new Vector(1, 2, 3));
    }
    if (SystemUtil.isClient()) {
        Event.dispatchToServer("Test", new Vector(1, 2, 3));
    }
}

function testAddEventListener() {
    if (SystemUtil.isServer()) {
        Event.addClientListener("Test", (player, params) => {
            Log4Ts.log(testAddEventListener, `receive event from client.`, params);
        });
    }
    if (SystemUtil.isClient()) {
        Event.addServerListener("Test", (params) => {
            Log4Ts.log(testAddEventListener, `receive event from server.`, params);
        });
    }
}

// initClientDelegate.add(testAddEventListener);
// initServiceDelegate.add(testAddEventListener);
//
// delayExecuteClientDelegate.add(testEventWithComplexType);
// delayExecuteServerDelegate.add(testEventWithComplexType);

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region God Mod
function testAddGmClient() {
    addGMCommand(
        "TestClient",
        "number",
        (params) => {
            Log4Ts.log(testAddGmClient, `Test command in Client.`, params);
        },
        undefined,
        {dataValidate: [RangeDataValidator(0, 1)]},
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
        {dataValidate: [RangeDataValidator(0, 1)]},
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

// initClientDelegate.add(testAddGmClient);
// initServiceDelegate.add(testAddGmClient);
// initClientDelegate.add(testAddGmServer);
// initServiceDelegate.add(testAddGmServer);
// delayExecuteClientDelegate.add(testUseGm);
//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region Lui
function testLuiButton() {
    Button.create(Button.defaultOption()).attach(mw.UIService.canvas);
}

initClientDelegate.add(testLuiButton);

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄