import TestModuleData, {TestModuleC, TestModuleS} from "./module/TestModule";
import AuthModuleData, {AuthModuleC, AuthModuleS} from "./module/AuthModule";
import * as mwaction from "mwaction";
import {VectorExt} from "./declaration/vectorext";
import SystemUtil = mw.SystemUtil;

@Component
export default class GameStart extends mw.Script {

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
//endregion ------------------------------------------------------------------------------------------------------

//region Event subscribe
//endregion ------------------------------------------------------------------------------------------------------

        setTimeout(
            this.delayExecute,
            5e3);
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);
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