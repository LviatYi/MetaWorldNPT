import {Regulator} from "../../../util/GToolkit";
import Log4Ts from "../../../depend/log4ts/Log4Ts";
import OperationGuideControllerBase from "../base/OperationGuideControllerBase";
import {BrokenStatus} from "../base/BrokenStatus";

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
export default class CutsceneOperationGuideController extends OperationGuideControllerBase {
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

    constructor() {
        super();

        if (!SystemUtil.isClient()) return;
        TimeUtil.onEnterFrame.add(() => {
            if (this._testHandler
                && this._regulator.request()) {
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
     * @param {boolean} force=false 是否强制运行.
     * @param {boolean} broken=false 是否非法中断.
     * @param {BrokenStatus} brokenStatus=BrokenStatus.Null 损坏状态.
     * @param brokenStatus
     */
    public fade(force: boolean = false, broken: boolean = false, brokenStatus: BrokenStatus = BrokenStatus.Null) {
        if (!force && !this.isFocusing) return;
        this.isFocusing = false;

        if (force) return;
        if (broken) this.onBroken.invoke({status: brokenStatus, arg: undefined});
        else this.onFade.invoke();
    }

    private generateHandler(option: ICutsceneOperationGuideControllerOption) {
        this._testHandler = () => {
            let fade: boolean;
            let broken: boolean = false;
            let brokenStatus = BrokenStatus.Null;
            try {
                fade = option.predicate();
            } catch (e) {
                Log4Ts.log(CutsceneOperationGuideController, `error occurs in predicate.`, e);
                broken = true;
                brokenStatus = BrokenStatus.Error;
            }

            if (fade || broken) this.fade(false, broken, brokenStatus);
        };
    }
}