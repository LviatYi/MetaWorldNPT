import TweenElement_Generate from "../../../ui-generate/UIAnimLab/tween/TweenElement_generate";
import TweenTaskGroup from "../../../depend/waterween/TweenTaskGroup";
import Waterween from "../../../depend/waterween/Waterween";
import GToolkit from "../../../util/GToolkit";

export default class TweenElementPanel extends TweenElement_Generate {
//#region Member
    private _arrowTweenTask: TweenTaskGroup;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region MetaWorld UI Event

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;

//#region Member init
        this.initTweenTask2();
//#endregion ------------------------------------------------------------------------------------------

//#region Widget bind
//#endregion ------------------------------------------------------------------------------------------

//#region Event subscribe
//#endregion ------------------------------------------------------------------------------------------
    }

    protected onUpdate() {
    }

    protected onShow() {
    }

    protected onHide() {
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Init
    private initTweenTask() {
        this._arrowTweenTask = new TweenTaskGroup();
        this._arrowTweenTask = Waterween
            .group(
                () => ({
                    arrowY: this.imgArrow.position.y,
                    scaleX: this.imgArrow.renderScale.x,
                    scaleY: this.imgArrow.renderScale.y,
                }),
                (val) => {
                    this.imgArrow.position = GToolkit.newWithY(this.imgArrow.position, val.arrowY);
                    this.imgArrow.renderScale = new mw.Vector2(val.scaleX, val.scaleY);
                },
                [
                    {dist: {arrowY: 7}, duration: 167},
                    {dist: {arrowY: -7}, duration: 167},
                    {dist: {arrowY: 7, scaleY: 0.9}, duration: 300},
                    {dist: {arrowY: -14, scaleX: 0.9, scaleY: 1.12}, duration: 167},
                    {dist: {arrowY: -14, scaleX: 0.9, scaleY: 1.12}, duration: 167},
                    {dist: {scaleX: 1, scaleY: 1}, duration: 167},
                    {dist: {arrowY: 0}, duration: 167},
                ],
                {arrowY: 0, scaleX: 1, scaleY: 1,}
            )
            .repeat()
            .restart();
    }

    private initTweenTask2() {
        this._arrowTweenTask = new TweenTaskGroup();
        this._arrowTweenTask = Waterween
            .group(
                () => {
                    console.log("getter called.");
                    return {
                        arrowY: this.imgArrow.position.y,
                        scaleX: this.imgArrow.renderScale.x,
                        scaleY: this.imgArrow.renderScale.y,
                    };
                },
                (val) => {
                    console.log("setter called.");
                    this.imgArrow.position = GToolkit.newWithY(this.imgArrow.position, val.arrowY);
                    this.imgArrow.renderScale = new mw.Vector2(val.scaleX, val.scaleY);
                },
                [
                    // {dist: {arrowY: 7}, duration: 167},
                    // {dist: {arrowY: -7}, duration: 167},
                    // {dist: {arrowY: 7, scaleY: 0.9}, duration: 300},
                    // {dist: {arrowY: -14, scaleX: 0.9, scaleY: 1.12}, duration: 167},
                    // {dist: {arrowY: -14, scaleX: 0.9, scaleY: 1.12}, duration: 167},
                    // {dist: {scaleX: 1, scaleY: 1}, duration: 167},
                    // {dist: {arrowY: 0}, duration: 167},
                    {dist: {arrowY: -14, scaleX: 0.9, scaleY: 1.12}, duration: 1000},
                    {dist: {arrowY: 0, scaleX: 1, scaleY: 1}, duration: 1000},
                ],
                {arrowY: 0, scaleX: 1, scaleY: 1,}
            )
            .repeat()
            .restart();
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region UI Behavior
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Callback
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}