import TestPanel_Generate from "../ui-generate/TestPanel_generate";
import FloatPanel from "../lab/ui/FloatPanel";
import UIManager = UI.UIManager;
import AccessorTween from "../accessorTween/AccessorTween";
import {TweenTaskGroup} from "../accessorTween/TweenTaskGroup";

@UI.UICallOnly("")
export default class TestPanel extends TestPanel_Generate {
    private _floatPanel: FloatPanel;

    public animTask: TweenTaskGroup = new TweenTaskGroup();

    private _isPause = false;

    protected onAwake(): void {
        super.onAwake();

        this._floatPanel = UIManager.instance.getUI(FloatPanel);
        this.testButton.onClicked.add(this.onTestButtonClick);

        this.animTask
            .add(AccessorTween.to(
                () => {
                    return {
                        scaleX: this.image.renderScale.x
                    };
                },
                (val) => {
                    this.image.renderScale = new Type.Vector2(val.scaleX, this.image.renderScale.y);
                    console.log(this.image.renderScale.x);
                },
                {scaleX: 3},
                1e3,
                {scaleX: 1}))
            .add(AccessorTween.to(
                () => {
                    return {
                        scaleY: this.image.renderScale.y
                    };
                },
                (val) => {
                    this.image.renderScale = new Type.Vector2(this.image.renderScale.x, val.scaleY);
                    console.log(this.image.renderScale.y);
                },
                {scaleY: 3},
                5e2,
                {scaleY: 1}))
            .add(AccessorTween.to(
                () => {
                    return {
                        scaleX: this.image.renderScale.x
                    };
                },
                (val) => {
                    this.image.renderScale = new Type.Vector2(val.scaleX, this.image.renderScale.y);
                    console.log(this.image.renderScale.x);
                },
                {scaleX: 1},
                1e3,
                {scaleX: 3}
            ))
            .sequence()
            .repeat();

        // this.animTask.add(AccessorTween.to(
        //     () => {
        //         return {
        //             scaleX: this.image.renderScale.x
        //         };
        //     },
        //     (val) => {
        //         this.image.renderScale = new Type.Vector2(val.scaleX, this.image.renderScale.y);
        //         console.log(this.image.renderScale.x);
        //     },
        //     {scaleX: 3},
        //     1e3,
        //     {scaleX: 1}
        // )).add(AccessorTween.to(
        //     () => {
        //         return {
        //             scaleY: this.image.renderScale.y
        //         };
        //     },
        //     (val) => {
        //         this.image.renderScale = new Type.Vector2(this.image.renderScale.x, val.scaleY);
        //         console.log(this.image.renderScale.y);
        //     },
        //     {scaleY: 3},
        //     5e2,
        //     {scaleY: 1}
        // )).add(AccessorTween.to(
        //     () => {
        //         return {
        //             scaleX: this.image.renderScale.x
        //         };
        //     },
        //     (val) => {
        //         this.image.renderScale = new Type.Vector2(val.scaleX, this.image.renderScale.y);
        //         console.log(this.image.renderScale.x);
        //     },
        //     {scaleX: 1},
        //     1e3,
        //     {scaleX: 3}
        // ))
        //     .sequence()
        //     .repeat();
    }

    private onTestButtonClick = () => {
        console.log(`Test Button Clicked at ${Date.now()}`);

        if (this._isPause) {
            this._isPause = false;
            this.animTask.continue();
        } else {
            this._isPause = true;
            this.animTask.pause();
        }
    };
}
