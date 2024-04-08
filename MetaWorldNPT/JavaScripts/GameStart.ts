import TestModuleData, {TestModuleC, TestModuleS} from "./module/TestModule";
import AuthModuleData, {AuthModuleC, AuthModuleS} from "./module/AuthModule";
import * as mwaction from "mwaction";
import {VectorExt} from "./declaration/vectorext";
import UIOperationGuideController, {BackBtnTypes, InnerBtnTypes} from "./gameplay/guide/ui/UIOperationGuideController";
import BoardPanel from "./lab/ui/BoardPanel";
import KeyOperationManager from "./controller/key-operation-manager/KeyOperationManager";
import SystemUtil = mw.SystemUtil;

@Component
export default class GameStart extends mw.Script {
//#region Member
    private _guideController: UIOperationGuideController;
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
        KeyOperationManager
            .getInstance()
            .onKeyDown(
                mw.Keys.T,
                UIService.getUI(BoardPanel),
                () => {
                    const board = UIService.getUI(BoardPanel);
                    if (!this._guideController) {
                        this._guideController = new UIOperationGuideController();
                    }
                    this._guideController.focusOn(
                        board.btnMain,
                        {
                            backBtnType: BackBtnTypes.Close,
                            innerBtnType: InnerBtnTypes.BroadCast,
                            renderOpacity: 0.8
                        }
                    );
                });
        KeyOperationManager
            .getInstance()
            .onKeyDown(
                mw.Keys.R,
                UIService.getUI(BoardPanel),
                () => this._guideController?.fade());
//endregion ------------------------------------------------------------------------------------------------------

//region Event subscribe
//endregion ------------------------------------------------------------------------------------------------------r

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
        }
    };

//region Event Callback
//endregion
}