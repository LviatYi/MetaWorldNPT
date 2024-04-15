import {Delegate, Regulator} from "../../../util/GToolkit";
import Log4Ts from "../../../depend/log4ts/Log4Ts";
import SimpleDelegate = Delegate.SimpleDelegate;

export interface ICutsceneOperationGuideControllerOption {
    /**
     * 自行谓词.
     * @desc true 时自动结束聚焦.
     * @return {boolean}
     */
    predicate: () => boolean;

    /**
     * 自行测试间隔.
     */
    testInterval: number;
}

/**
 * Operation Guide for Cutscene in Scene.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export default class CutsceneOperationGuideController {
//#region Member
    private _regulator: Regulator = new Regulator();

    private _testHandler: () => void = undefined;

    public get isFocusing() {
        return !!this._testHandler;
    }

    private set isFocusing(value: boolean) {
        if (!value) {
            this._testHandler = undefined;
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event
    public readonly onFocus: SimpleDelegate<never> = new SimpleDelegate();

    public readonly onFade: SimpleDelegate<boolean> = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    constructor() {
        if (!SystemUtil.isClient()) return;
        TimeUtil.onEnterFrame.add(() => {
            if (this._testHandler
                && this._regulator.ready()) {
                this._testHandler();
            }
        });
    }

    /**
     * 聚焦在过长动画上.
     * @param {ICutsceneOperationGuideControllerOption} option
     */
    public focusOn(option: ICutsceneOperationGuideControllerOption) {
        this.generateHandler(option);
        this._regulator.interval(option.testInterval);
        this.onFocus.invoke();
    }

    /**
     * 取消聚焦.
     */
    public fade(force: boolean = false) {
        this.onFade.invoke(force);
        this.isFocusing = false;
    }

    private generateHandler(option: ICutsceneOperationGuideControllerOption) {
        this._testHandler = () => {
            let result: boolean;
            try {
                result = option.predicate();
            } catch (e) {
                Log4Ts.log(CutsceneOperationGuideController, `error occurs in predicate: ${e}`);
                result = true;
            }

            if (result) this.fade();
        };
    }
}