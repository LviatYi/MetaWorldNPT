import Gtk, {Delegate} from "../../../util/GToolkit";
import SimpleDelegate = Delegate.SimpleDelegate;

interface IVector2 {
    x: number,
    y: number
}

//#region Options

export interface ISceneOperationGuideControllerOption {
    triggerGuid?: boolean;

    predicate: () => boolean;
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

/**
 * Operation Guide for GameObject in Scene.
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
export default class SceneOperationGuideController {
//#region Member
    private _viewportRatioCache: number = null;

    private _fullSizeCache: IVector2 = {x: 0, y: 0};

    private _checkRatioHandler: () => void = null;

    private _isFocusing: boolean = false;

    public get isFocusing(): boolean {
        return this._isFocusing;
    };

    private set isFocusing(value: boolean) {
        this._isFocusing = value;
        if (!value) {
            this._checkRatioHandler = null;
        }
    }

    public guidelineGuid: string = null;

    public interval: number = null;

    public guidelinePools: GameObject[] = [];

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event
    public readonly onFocus: SimpleDelegate<never> = new SimpleDelegate<never>();

    public readonly onFade: SimpleDelegate<never> = new SimpleDelegate<never>();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    constructor() {
        this._viewportRatioCache = Gtk.getViewportRatio();
        this._fullSizeCache = Gtk.getUiVirtualFullSize();


        this.fade(false, true);

        TimeUtil.onEnterFrame.add(() => this._checkRatioHandler?.());
    }

    /**
     * 聚焦在指定 GameObject 上.
     * @param target
     * @param force=false 是否强制再运行.
     */
    public focusOn(
        target: GameObject,
        force: boolean = false
    ) {
        if (!force && this.isFocusing) return;
        this.isFocusing = true;
        this._checkRatioHandler = this.getCheckRatioHandler(
            target,
            force
        );

        this.onFocus.invoke();
    }

    /**
     * 取消聚焦.
     * @param {boolean} transition
     * @param force=false 是否强制再运行.
     */
    public fade(transition: boolean = true, force: boolean = false) {
        if (!force && !this.isFocusing) return;
        this.isFocusing = false;

        this.onFade.invoke();
    }

    /**
     * 生成 视口比例检查器.
     * @private
     */
    private getCheckRatioHandler(
        target: GameObject,
        force: boolean = false) {
        return () => {
            const ratio = Gtk.getViewportRatio();
            if (this._viewportRatioCache !== ratio) {
                this._viewportRatioCache = ratio;
                this._fullSizeCache = Gtk.getUiVirtualFullSize();
                if (this.isFocusing) {
                    this.focusOn(
                        target,
                        force);
                }
            }
        };
    }
}

/**
 * 生成距离谓词.
 * @desc 距离谓词 用于判断玩家与目标之间的距离是否小于指定距离.
 * @param {number} dist
 * @param {GameObject} target
 * @return {() => boolean}
 */
export function GenerateDistancePredicate(dist: number, target: GameObject) {
    return (): boolean => {
        return Gtk.squaredEuclideanDistance(
            Player.localPlayer.character.worldTransform.position,
            target.worldTransform.position) <= dist * dist;
    };
}