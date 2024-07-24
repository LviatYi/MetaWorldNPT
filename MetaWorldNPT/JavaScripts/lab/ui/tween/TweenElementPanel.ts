import TweenElement_Generate from "../../../ui-generate/UIAnimLab/tween/TweenElement_generate";
import Waterween from "../../../depend/waterween/Waterween";
import Gtk from "../../../util/GToolkit";
import { Easing } from "../../../depend/waterween/easing/Easing";

export default class TweenElementPanel extends TweenElement_Generate {

//#region Member
//     private _arrowTweenTask: TweenTaskGroup;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region MetaWorld UI Event

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;

//#region Member init
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
    public initTweenTask(now: number) {
        // this._arrowTweenTask = new TweenTaskGroup();
        // const posX = this.imgArrow.position.x;
        // this._arrowTweenTask = Waterween
        //     .group(
        //         () => ({
        //             arrowY: this.imgArrow.position.y,
        //             scaleX: this.imgArrow.renderScale.x,
        //             scaleY: this.imgArrow.renderScale.y,
        //         }),
        //         (val) => {
        //             Gtk.setUiPosition(this.imgArrow, posX, val.arrowY);
        //             Gtk.setUiScale(this.imgArrow, val.scaleX, val.scaleY);
        //             // this.imgArrow.position = Gtk.newWithY(this.imgArrow.position, val.arrowY);
        //             // this.imgArrow.renderScale = new mw.Vector2(val.scaleX, val.scaleY);
        //         },
        //         [
        //             {dist: {arrowY: 7}, duration: 167},
        //             {dist: {arrowY: -7}, duration: 167},
        //             {dist: {arrowY: 7, scaleY: 0.9}, duration: 300},
        //             {dist: {arrowY: -14, scaleX: 0.9, scaleY: 1.12}, duration: 167},
        //             {dist: {arrowY: -14, scaleX: 0.9, scaleY: 1.12}, duration: 167},
        //             {dist: {scaleX: 1, scaleY: 1}, duration: 167},
        //             {dist: {arrowY: 0}, duration: 167},
        //         ],
        //         {arrowY: 0, scaleX: 1, scaleY: 1},
        //         undefined,
        //         now,
        //     )
        //     .repeat()
        //     .restart(false, now);
    }

    public initSeqTweenTask(now: number) {
        // const currentPos = this.imgArrow.position;
        // let originY = currentPos.y;
        // Waterween.to(
        //     () => {
        //         return ({posX: this.imgArrow.position.x});
        //     },
        //     (val) => Gtk.setUiPosition(this.imgArrow, val.posX, originY),
        //     {posX: this.imgArrow.position.x + 20},
        //     500,
        //     {posX: this.imgArrow.position.x},
        //     Easing.easeInOutCirc,
        //     undefined,
        //     now,
        // )
        //     .repeat()
        //     .restart(false, now);
        // Waterween.to(
        //     () => this.imgArrow.position,
        //     (val) => Gtk.setUiPosition(this.imgArrow, val.x, originY),
        //     Gtk.newWithX(currentPos, currentPos.x + 20),
        //     500,
        //     undefined,
        //     Easing.easeInOutCirc,
        //     undefined,
        //     now,
        // )
        //     .repeat()
        //     .restart(false, now);

        const currentScale = this.imgArrow.renderScale;
        let originY = currentScale.y;
        Waterween.to(
            () => {
                return ({scaleX: this.imgArrow.renderScale.x});
            },
            (val) => Gtk.setUiScale(this.imgArrow, val.scaleX, originY),
            {scaleX: this.imgArrow.renderScale.x + 20},
            500,
            {scaleX: this.imgArrow.renderScale.x},
            Easing.easeInOutCirc,
            undefined,
        )
            .repeat()
            .restart(false);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region UI Behavior
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Callback
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}