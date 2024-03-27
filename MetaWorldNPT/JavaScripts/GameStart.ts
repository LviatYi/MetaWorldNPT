import FloatPanel from "./lab/ui/float/FloatPanel";
import TestModuleData, {TestModuleC, TestModuleS} from "./module/TestModule";
import AuthModuleData, {AuthModuleC, AuthModuleS} from "./module/AuthModule";
import Gtk from "./util/GToolkit";
import BoardPanel from "./lab/ui/BoardPanel";
import * as mwaction from "mwaction";
import TweenElementPanelOld from "./lab/ui/tween/TweenElementPanelOld";
import {VectorExt} from "./declaration/vectorext";
import Log4Ts from "./depend/log4ts/Log4Ts";
import TweenElementPanel from "./lab/ui/tween/TweenElementPanel";
import Waterween from "./depend/waterween/Waterween";
import SystemUtil = mw.SystemUtil;

@Component
export default class GameStart extends mw.Script {
    private _floatPanel: FloatPanel;

    private _useWaterween: boolean = true;

    private _avg: number = 0;
    private _sampleCount: number = 0;

//region MetaWorld Event
    protected onStart(): void {
        super.onStart();
        this.useUpdate = true;
        console.log("Game Launched");
        mwaction;
        VectorExt.initialize();
//region Member init
//         UIService.show(TestPanel);
        if (SystemUtil.isClient()) {
            const now = Date.now();
            const testCount = 1;
            for (let i = 0; i < testCount; ++i) {
                if (this._useWaterween) {
                    UIService.getUI(BoardPanel).addToMain(UIService.create(TweenElementPanel).uiObject);
                } else {
                    UIService.getUI(BoardPanel).addToMain(UIService.create(TweenElementPanelOld).uiObject);
                }
            }
            Log4Ts.log(GameStart, `create ${testCount} task done.`,
                `now use ${this._useWaterween ? "Waterween" : "Actions"}`,
                `cost time: ${Date.now() - now}`,
            );
        }

        ModuleService.registerModule(AuthModuleS, AuthModuleC, AuthModuleData);
        ModuleService.registerModule(TestModuleS, TestModuleC, TestModuleData);
//endregion ------------------------------------------------------------------------------------------------------

//region Widget bind
//endregion ------------------------------------------------------------------------------------------------------

//region Event subscribe
//endregion ------------------------------------------------------------------------------------------------------

        setTimeout(
            this.delayExecute,
            5e3);
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);
        let startTime = Date.now();
        if (this._useWaterween) {
            Waterween.update();
        } else {
            actions.AcitonMgr.update(dt * 1000);
        }
        const cost = Date.now() - startTime;
        this._avg = (this._avg * this._sampleCount + cost) / (this._sampleCount + 1);
        ++this._sampleCount;
        Log4Ts.log(GameStart, `all actions task done.`,
            `now use ${this._useWaterween ? "Waterween" : "Actions"}`,
            `cost time avg: ${this._avg}`,
            `sample count: ${this._sampleCount}`);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

//endregion

//region Init
//endregion

    public delayExecute: () => void = () => {
        if (SystemUtil.isClient()) {
            // Event.dispatchToServer("__mw_developer_O_Ask_repoleved_wm__", "TestModuleS.sayHello", "Hacker");
            // Event.addServerListener("__mw_developer_O_Reply_repoleved_wm__", (funcName, res) => {
            //     if (funcName === "TestModuleS.sayHello") {
            //         Log4Ts.log(GameStart, `get result: ${res}`);
            //     }
            // });
        }
    };

//region Event Callback
//endregion
}

Gtk.addRootScript(GameStart);