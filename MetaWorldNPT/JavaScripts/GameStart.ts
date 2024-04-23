import TestModuleData, {TestModuleC, TestModuleS} from "./module/TestModule";
import AuthModuleData, {AuthModuleC, AuthModuleS} from "./module/AuthModule";
import * as mwaction from "mwaction";
import {VectorExt} from "./declaration/vectorext";
import BoardPanel from "./lab/ui/BoardPanel";
import {TestPanel} from "./test/TestPanel";
import TweenElementPanelOld from "./lab/ui/tween/TweenElementPanelOld";
import TweenElementPanel from "./lab/ui/tween/TweenElementPanel";
import Waterween from "./depend/waterween/Waterween";
import {Delegate} from "./util/GToolkit";
import Log4Ts from "./depend/log4ts/Log4Ts";
import TweenWaterween_Generate from "./ui-generate/JavaScripts/ui-generateAnimLab/tween/TweenWaterween_generate";
import SystemUtil = mw.SystemUtil;
import UIService = mw.UIService;
import SimpleDelegate = Delegate.SimpleDelegate;

let initClientDelegate: SimpleDelegate<void> = new SimpleDelegate();

let initServiceDelegate: SimpleDelegate<void> = new SimpleDelegate();

let delayExecuteClientDelegate: SimpleDelegate<void> = new SimpleDelegate();

let delayExecuteServerDelegate: SimpleDelegate<void> = new SimpleDelegate();

let updateClientDelegate: SimpleDelegate<number> = new SimpleDelegate();

let updateServerDelegate: SimpleDelegate<number> = new SimpleDelegate();

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

        this.initModules();

//region Event subscribe
//endregion ------------------------------------------------------------------------------------------------------

        if (SystemUtil.isClient()) {
            this.initClient();
            initClientDelegate.invoke();
        } else if (SystemUtil.isServer()) {
            this.initService();
            initServiceDelegate.invoke();
        }

        if (SystemUtil.isClient()) {
            setTimeout(
                () => {
                    this.delayExecuteClient();
                    delayExecuteClientDelegate.invoke();
                },
                GameStart.CLIENT_DELAY_TIMEOUT);
        } else if (SystemUtil.isServer()) {
            setTimeout(
                () => {
                    this.delayExecuteServer();
                    delayExecuteServerDelegate.invoke();
                },
                GameStart.SERVER_DELAY_TIMEOUT);
        }
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);

        if (SystemUtil.isClient()) {
            this.updateClient(dt);
            updateClientDelegate.invoke(dt);
        } else if (SystemUtil.isServer()) {
            this.updateServer(dt);
            updateServerDelegate.invoke(dt);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

//endregion

//#region Opportunity
    public initModules: () => void = () => {
        ModuleService.registerModule(AuthModuleS, AuthModuleC, AuthModuleData);
        ModuleService.registerModule(TestModuleS, TestModuleC, TestModuleData);
    };

    public initClient: () => void = () => {
        UIService.show(BoardPanel);
        UIService.show(TestPanel);

        testTween(false, 2400);
    };

    public initService: () => void = () => {
    };

    public delayExecuteClient: () => void = () => {
    };

    public delayExecuteServer: () => void = () => {
    };

    public updateClient: (dt: number) => void = (dt) => {
        const btnMain = UIService.getUI(BoardPanel).btnMain;
        const cnvMain2 = UIService.getUI(BoardPanel).cnvMain2;
        const test = UIService.getUI(TestPanel).testButton;

        compareWidgetStack(btnMain, cnvMain2);
        compareWidgetStack(btnMain, test);
    };

    public updateServer: (dt: number) => void = (dt) => {
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

function testTween(useOld: boolean = false, testTime: number) {
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
