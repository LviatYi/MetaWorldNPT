import TestModuleData, {TestModuleC, TestModuleS} from "./module/TestModule";
import AuthModuleData, {AuthModuleC, AuthModuleS} from "./module/AuthModule";
import * as mwaction from "mwaction";
import {VectorExt} from "./declaration/vectorext";
import UIOperationGuideController from "./gameplay/guide/ui/UIOperationGuideController";
import SystemUtil = mw.SystemUtil;
import InputUtil = mw.InputUtil;

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
        InputUtil.onKeyDown(mw.Keys.T,
            () => {
                if (!this._guideController) {
                    this._guideController = new UIOperationGuideController();
                }
                // const guid = Gtk.randomArrayItem(this._targets);
                // const guid = this._targets[0];

                // this._guideController.focusOn(
                //     UIService.getUI(BoardPanel).btnMain,
                //     StrongUIOperationGuideControllerOption(),
                // );
            }
        );

        InputUtil.onKeyDown(mw.Keys.R,
            () => {
                this._guideController?.fade();
            });

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