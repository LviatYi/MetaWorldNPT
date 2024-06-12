import * as mwaction from "mwaction";
import { VectorExt } from "./declaration/vectorext";
import BoardPanel from "./lab/ui/BoardPanel";
import { TestPanel } from "./test/TestPanel";
import TweenElementPanelOld from "./lab/ui/tween/TweenElementPanelOld";
import TweenElementPanel from "./lab/ui/tween/TweenElementPanel";
import Waterween from "./depend/waterween/Waterween";
import Gtk, { Delegate, RandomGenerator, Regulator } from "./util/GToolkit";
import Log4Ts from "./depend/log4ts/Log4Ts";
import TweenWaterween_Generate from "./ui-generate/UIAnimLab/tween/TweenWaterween_generate";
import GlobalTips from "./depend/global-tips/GlobalTips";
import KeyOperationManager from "./controller/key-operation-manager/KeyOperationManager";
import Balancing from "./depend/balancing/Balancing";
import BubbleWidget from "./depend/global-tips/example/BubbleWidget";
import GlobalTipsPanel from "./depend/global-tips/example/GlobalTipsPanel";
import LuiBoard from "./lab/LuiBoardPanel";
import { NPTController } from "./test/NPTController";
import { DrainPipeModuleC } from "./depend/drain-pipe/DrainPipe";
import { AutoComplete, AutoCompleteItem, Avatar, Button, Lui, Property, TextField } from "mw-lynx-ui";
import GodModService, { addGMCommand, MoveIcon, RangeDataValidator } from "mw-god-mod";
import SimpleDelegate = Delegate.SimpleDelegate;
import Color = Lui.Asset.Color;

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

        if (mw.SystemUtil.isClient()) {
            initClientDelegate.invoke();
        } else if (mw.SystemUtil.isServer()) {
            mw.DataStorage.setTemporaryStorage(false);
            initServiceDelegate.invoke();
        }
        initAllEndDelegate.invoke();

        if (mw.SystemUtil.isClient()) {
            setTimeout(
                () => delayExecuteClientDelegate.invoke(),
                GameStart.CLIENT_DELAY_TIMEOUT);
        } else if (mw.SystemUtil.isServer()) {
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

        if (mw.SystemUtil.isClient()) {
            updateClientDelegate.invoke(dt);
        } else if (mw.SystemUtil.isServer()) {
            updateServerDelegate.invoke(dt);
        }
        updateAllEndDelegate.invoke(dt);
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

//#region TDD
// (init.*?Delegate)|(delay.*?Delegate)|(init.*?Delegate)|(update.*?Delegate)

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

    mw.EffectService.playOnGameObject("155590", go, {
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
        .onKeyPress(mw.UIService.getUI(TestPanel),
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

// initClientDelegate.add(loadAUiAsset);
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Complex Type

function testEventWithComplexType() {
    if (mw.SystemUtil.isServer()) {
        Event.dispatchToClient(Player.getAllPlayers()[0], "Test", new Vector(1, 2, 3));
    }
    if (mw.SystemUtil.isClient()) {
        Event.dispatchToServer("Test", new Vector(1, 2, 3));
    }
}

function testAddEventListener() {
    if (mw.SystemUtil.isServer()) {
        Event.addClientListener("Test", (player, params) => {
            Log4Ts.log(testAddEventListener, `receive event from client.`, params);
        });
    }
    if (mw.SystemUtil.isClient()) {
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
        {validator: [RangeDataValidator(0, 1)]},
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
        () => {
            Log4Ts.log(testGmPanel, `say something`);
        },
        undefined,
        "Say");
    addGMCommand("say anything",
        "string",
        (params) => {
            Log4Ts.log(testGmPanel, `say: ${params}`);
        },
        undefined,
        undefined,
        "Say");
    addGMCommand("say float",
        "number",
        (params) => {
            Log4Ts.log(testGmPanel, `value: ${params}`);
        },
        undefined,
        undefined,
        "Validator");
    addGMCommand("say integer",
        "integer",
        (params) => {
            Log4Ts.log(testGmPanel, `value: ${params}`);
        },
        undefined,
        undefined,
        "Validator");
    addGMCommand("range",
        "integer",
        (params) => {
            Log4Ts.log(testGmPanel, `value: ${params}`);
        },
        undefined,
        {
            validator: [
                RangeDataValidator(0, 10),
            ],
        },
        "Validator");
    addGMCommand("vector",
        "vector",
        (params) => {
            Log4Ts.log(testGmPanel, `value: ${params}`);
        },
        undefined,
        undefined,
        "Vector");
    addGMCommand("enum A",
        DynamicEnum,
        (params) => {
            switch (params) {
                case DynamicEnum.A:
                    Log4Ts.log(testGmPanel, `StateA`);
                    break;
                case DynamicEnum.B:
                    Log4Ts.log(testGmPanel, `StateB`);
                    break;
                case DynamicEnum.C:
                    Log4Ts.log(testGmPanel, `StateC`);
                    break;
            }
            Log4Ts.log(testGmPanel, `value: ${params}`);
        },
        undefined,
        undefined,
        "Enum");
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
        "Enum");
    addGMCommand("Client Error",
        "void",
        () => {
            throw Error("Client Error");
        },
        undefined,
        undefined,
        "Error");
    addGMCommand("Server Error",
        "void",
        undefined,
        () => {
            throw Error("Server Error");
        },
        undefined,
        "Error");
    // let t: InferParamType<DynamicEnum> = DynamicEnum.A;
    // console.log(t);
    // let t2: InferParamType<DynamicEnum2> = DynamicEnum2.B;
    // console.log(t2);
    GodModService.getInstance().showGm();
}

// initClientDelegate.add(testAddGmClient);
// initServiceDelegate.add(testAddGmClient);
// initClientDelegate.add(testAddGmServer);
// initServiceDelegate.add(testAddGmServer);
// delayExecuteClientDelegate.add(testUseGm);
initAllEndDelegate.add(testGmPanel);
// initClientDelegate.add(godModIcon);
//#endregion ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//#region Lui
function testLuiButton() {
    mw.UIService.show(LuiBoard);
    Button.create({
        variant: "outlined",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);

    Button.create({
        variant: "contained",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
        corner: Property.Corner.Top,
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);

    Button.create({
        variant: "outlined",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer)
        .preview();

    Button.create({
        variant: "contained",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer)
        .preview();

    Button.create({
        variant: "outlined",
        color: {
            primary: Color.Red,
            secondary: Color.Red800,
        },
        textAlign: "left",
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);

    Button.create({
        variant: "contained",
        color: {
            primary: Color.Red,
            secondary: Color.Red800,
        },
        corner: Property.Corner.Top,
        textAlign: "left",
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);

    Button.create({
        variant: "outlined",
        color: {
            primary: Color.Green,
            secondary: Color.Green800,
        },
        padding: {top: 10, bottom: 10},
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer)
        .preview();

    Button.create({
        variant: "contained",
        color: {
            primary: Color.Green,
            secondary: Color.Green800,
        },
        padding: {top: 10, bottom: 10},
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer)
        .preview();
}

function testLuiAvatar() {
    mw.UIService.show(LuiBoard);
    Avatar.create({
        variant: "circle",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
        labelText: "LviatYi",
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);

    Avatar.create({
        variant: "square",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
        labelText: "LviatYi",
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);

    Avatar.create({
        variant: "circle",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue800,
        },
        labelText: "易之",
        effectLevel: "high",
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer)
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
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer)
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
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);

    Avatar.create({
        variant: "square",
        color: {
            primary: Color.Red,
            secondary: Color.Red800,
        },
        labelText: "lviat",
        effectLevel: "low",
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);

    Avatar.create({
        variant: "circle",
        color: {
            primary: Color.Green,
            secondary: Color.Green800,
        },
        labelText: "LviatYi",
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer)
        .preview();

    Avatar.create({
        variant: "square",
        color: {
            primary: Color.Green,
            secondary: Color.Green800,
        },
        labelText: "LviatYi",
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer)
        .preview();
}

function testLuiTextField() {
    mw.UIService.show(LuiBoard);
    TextField.create({
        label: "common",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue200,
        },
        corner: Property.Corner.Bottom,
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);
    TextField.create({
        label: "integer",
        color: {
            primary: Color.Blue,
            secondary: Color.Blue200,
        },
        corner: Property.Corner.Bottom,
        type: mw.InputTextLimit.LimitToInt,
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);
    TextField.create({
        label: "float",
        color: {
            primary: Color.Green,
            secondary: Color.Green200,
        },
        corner: Property.Corner.None,
        type: mw.InputTextLimit.LimitToFloat,
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);
    TextField.create({
        label: "password",
        color: {
            primary: Color.Green,
            secondary: Color.Green200,
        },
        corner: Property.Corner.None,
        type: mw.InputTextLimit.LimitToPassword,
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);
    TextField.create({
        label: "validate",
        validator: [(param) => param.length < 5],
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);
    TextField.create({
        label: "validate with reason",
        validator: [{
            validator: (param) => param === "Hello",
            reason: "You must say Hello",
        }],
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);
}

function testLuiTextFieldWhenLockMouse() {
    mw.UIService.show(LuiBoard);

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
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);
}

function testLuiAutoComplete() {
    let items: AutoCompleteItem[] = [
        {label: "LviatYi", group: "group2"},
        {label: "zewei.zhang", group: "group1"},
        {label: "LviatWang", group: "group2"},
        {label: "minjia.zhang", group: "group1"},
        {label: "LviatQian", group: "group2"},
        {label: "peiyu.li", group: "group1"},
        {label: "someoneZhao"},
        {label: "someoneQian"},
        {label: "someoneSun"},
    ];

    mw.UIService.show(LuiBoard);
    AutoComplete.create({
        color: {
            primary: Color.Blue,
            secondary: Color.Blue200,
        },
        items,
    })
        .attach(mw.UIService.getUI(LuiBoard).cnvContainer);
}

// initClientDelegate.add(testLuiTextField);

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region DrainPipe
function testDrainPipe() {
    const uis = mw.UIService.show(NPTController);
    KeyOperationManager.getInstance().bindButton(uis, mw.Keys.J, uis.btnJ);

    uis.btnJ.onClicked.add(() => {
        mwext.ModuleService.getModule(DrainPipeModuleC).requestTest();
    });
}

// initClientDelegate.add(testDrainPipe);
//#endregion

//#region Teleport

let regulator = new Regulator(5e3);

function testTeleportGetGameInfoInClient() {
    if (regulator.request()) {
        mw.TeleportService
            .asyncGetPlayerRoomInfo(mw.Player.localPlayer.userId)
            .then(
                result => {
                    Log4Ts.log(testTeleportGetGameInfoInClient,
                        `query room info of me.`,
                        `game id: ${result.gameId}`,
                        `scene name: ${result.sceneName}`,
                        `scene id: ${result.sceneId}`,
                        `room id: ${result.roomId}`,
                    );
                },
            );
    }
}

function testTeleportGetGameInfoInServer() {
    if (regulator.request()) {
        for (const player of mw.Player.getAllPlayers()) {
            mw.TeleportService
                .asyncGetPlayerRoomInfo(player.userId)
                .then(
                    result => {
                        Log4Ts.log(testTeleportGetGameInfoInServer,
                            `query room info of me.`,
                            `game id: ${result.gameId}`,
                            `scene name: ${result.sceneName}`,
                            `scene id: ${result.sceneId}`,
                            `room id: ${result.roomId}`,
                        );
                    },
                );
        }
    }
}

// updateClientDelegate.add(testTeleportGetGameInfoInClient);
// updateServerDelegate.add(testTeleportGetGameInfoInServer);

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

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
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄