import TestModuleData, {TestModuleC, TestModuleS} from "./module/TestModule";
import AuthModuleData, {AuthModuleC, AuthModuleS} from "./module/AuthModule";
import * as mwaction from "mwaction";
import {VectorExt} from "./declaration/vectorext";
import UIOperationGuideController from "./gameplay/guide/ui/UIOperationGuideController";
import BoardPanel from "./lab/ui/BoardPanel";
import {TestPanel} from "./test/TestPanel";
import SystemUtil = mw.SystemUtil;
import UIService = mw.UIService;

@Component
export default class GameStart extends mw.Script {
//#region Member
    private _guideController: UIOperationGuideController;

    private _targets: string[] = ["21A22702", "169D17B1", "3DA21199"];
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region MetaWorld Event
    protected onStart(): void {
        super.onStart();
        this.useUpdate = true;
        console.log("Game Launched");
        mwaction;
        VectorExt.initialize();
//region Member init

        ModuleService.registerModule(AuthModuleS, AuthModuleC, AuthModuleData);
        ModuleService.registerModule(TestModuleS, TestModuleC, TestModuleData);

//endregion ------------------------------------------------------------------------------------------------------

//region Widget bind

        if (SystemUtil.isClient()) {
            UIService.show(BoardPanel);
            UIService.show(TestPanel);
        }


//endregion ------------------------------------------------------------------------------------------------------

//region Event subscribe
//endregion ------------------------------------------------------------------------------------------------------r

        setTimeout(
            this.delayExecute,
            1e3);
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);

        if (SystemUtil.isClient()) {
            const btnMain = UIService.getUI(BoardPanel).btnMain;
            const cnvMain2 = UIService.getUI(BoardPanel).cnvMain2;
            const test = UIService.getUI(TestPanel).testButton;

            compareWidgetStack(btnMain, cnvMain2);
            compareWidgetStack(btnMain, test);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

//endregion

//region Init
//endregion

    public delayExecute: () => void = () => {
        if (SystemUtil.isClient()) {
        }
    };

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