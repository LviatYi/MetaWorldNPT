import TestModuleData, {TestModuleC, TestModuleS} from "./module/TestModule";
import AuthModuleData, {AuthModuleC, AuthModuleS} from "./module/AuthModule";
import * as mwaction from "mwaction";
import {VectorExt} from "./declaration/vectorext";
import UIOperationGuideController from "./gameplay/guide/UIOperationGuideController";
import BoardPanel from "./lab/ui/BoardPanel";
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
            1e3);
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
            const board = UIService.getUI(BoardPanel);
            const uic = new UIOperationGuideController();
            setInterval(() => {
                    uic.focusOn(board.btnMain);
                },
                1e3);
        }
    };

//region Event Callback
//endregion
}