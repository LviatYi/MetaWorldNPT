import TestPanel_Generate from "../ui-generate/TestPanel_generate";
import FloatPanel from "../lab/ui/FloatPanel";
import UIManager = UI.UIManager;
import AccessorTween from "../accessorTween/AccessorTween";
import TweenTaskGroup from "../accessorTween/TweenTaskGroup";
import Easing from "../easing/Easing";

@UI.UICallOnly("")
export default class TestPanel extends TestPanel_Generate {
    private _floatPanel: FloatPanel;

    public animTask: TweenTaskGroup = new TweenTaskGroup();

    private _isPause = true;

    protected onAwake(): void {
        super.onAwake();

        this._floatPanel = UIManager.instance.getUI(FloatPanel);
        this.testButton.onClicked.add(this.onTestButtonClick);

        this.animTask
            .sequence(true)
            .add(AccessorTween.to(
                () => {
                    return {
                        scaleX: this.image.renderScale.x
                    };
                },
                (val) => {
                    this.image.renderScale = new Type.Vector2(val.scaleX, this.image.renderScale.y);
                },
                {scaleX: 3},
                1e3,
                {scaleX: 1},
                Easing.easeInOutSine
            ))
            .add(new TweenTaskGroup()
                .parallel(true)
                .add(
                    AccessorTween.to(
                        () => {
                            return {
                                scaleY: this.image.renderScale.y
                            };
                        },
                        (val) => {
                            this.image.renderScale = new Type.Vector2(this.image.renderScale.x, val.scaleY);
                        },
                        {scaleY: 3},
                        5e2,
                        undefined,
                        Easing.easeInOutSine
                    ))
                .add(AccessorTween.to(
                    () => {
                        return {
                            opacity: this.image.renderOpacity
                        };
                    },
                    (val) => {
                        this.image.renderOpacity = val.opacity;
                    },
                    {opacity: 0},
                    2e3,
                    {opacity: 0.8},
                    Easing.easeInOutSine
                )))
            .repeat()
            .restart(true);
    }

    private onTestButtonClick = () => {
        console.log(`Test Button Clicked at ${Date.now()}`);
        //
        // if (this._isPause) {
        //     this._isPause = false;
        //     this.animTask.continue();
        // } else {
        //     this._isPause = true;
        //     this.animTask.pause();
        // }

        if (this._isPause) {
            this.animTask.restart();
            this._isPause = false;
            console.log("anim start");
        } else {
            this.animTask.restart(true);
            this._isPause = true;
            console.log("anim stop");
        }
    };
}
