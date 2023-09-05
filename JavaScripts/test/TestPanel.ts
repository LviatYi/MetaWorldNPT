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

        this.animTask = AccessorTween.group(
            () => {
                return {
                    scaleX: this.image.renderScale.x,
                    scaleY: this.image.renderScale.y,
                    opacity: this.image.renderOpacity,
                    rotate: this.image.renderTransformAngle,
                    taskVal: Number(this.text.text)
                };
            },
            (val) => {
                this.image.renderScale = new Type.Vector2(val.scaleX, val.scaleY);
                this.image.renderOpacity = val.opacity;
                this.image.renderTransformAngle = val.rotate;
                this.text.text = (Math.ceil(val.taskVal)).toString();
            },
            [
                {
                    dist: {scaleX: 3, taskVal: 1}, duration: 1e3
                },
                {
                    dist: {opacity: 0.2, taskVal: 2}, duration: 1e3, isParallel: true,
                    subNodes: [
                        {dist: {rotate: 10, taskVal: 3}, duration: 5e2},
                        {dist: {rotate: 0, taskVal: 4}, duration: 5e2, isParallel: true, isFocus: true},
                        {dist: {opacity: 1, taskVal: 4}, duration: 5e2, isParallel: true}
                    ]
                },
                {
                    dist: {scaleY: 3, taskVal: 2}, duration: 5e2, isParallel: true
                },
                {
                    dist: {scaleX: 10, taskVal: 5}, duration: 1e3
                }
            ],
            {opacity: 0.8, taskVal: 0},
            Easing.easeInOutSine
        ).repeat();
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
