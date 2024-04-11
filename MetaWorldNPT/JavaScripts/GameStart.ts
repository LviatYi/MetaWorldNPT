import TestModuleData, {TestModuleC, TestModuleS} from "./module/TestModule";
import AuthModuleData, {AuthModuleC, AuthModuleS} from "./module/AuthModule";
import * as mwaction from "mwaction";
import {VectorExt} from "./declaration/vectorext";
import SceneOperationGuideController, {
    GenerateDistancePredicate,
    TargetParam
} from "./gameplay/guide/scene/SceneOperationGuideController";
import {TaskOptionalTypes} from "./gameplay/guide/base/OperationGuideTaskGroup";
import Gtk from "./util/GToolkit";
import SystemUtil = mw.SystemUtil;
import GameObject = mw.GameObject;

@Component
export default class GameStart extends mw.Script {
//#region Member
    private _guideController: SceneOperationGuideController;

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
        InputUtil.onKeyDown(
            mw.Keys.T,
            () => {
                if (!this._guideController) {
                    this._guideController = new SceneOperationGuideController();
                }
                // const guid = Gtk.randomArrayItem(this._targets);
                // const guid = this._targets[0];

                this._guideController.focusOn(
                    this._targets
                        .map(item => {
                            const target = GameObject.findGameObjectById(item);
                            return {
                                target,
                                predicate: target ? GenerateDistancePredicate(target, 500) : null,
                                navigation: false
                            } as TargetParam;
                        })
                        .filter(item => !Gtk.isNullOrUndefined(item.target)),
                    TaskOptionalTypes.Disorder,
                );
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