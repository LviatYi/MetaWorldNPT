import FloatCanvas_Generate from "../../ui-generate/UIAnimLab/float/FloatCanvas_generate";
import TWEEN = Util.TweenUtil.TWEEN;
import AccessorTween from "../../AccessorTween/AccessorTween";

@UI.UICallOnly("")
export default class FloatPanel extends FloatCanvas_Generate {
    private isShown: boolean = false;

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;
        console.log("Awake");
    }

    protected onUpdate() {
        if (!this.isShown) {
            this.showCurtain();
            this.isShown = true;
        }

        TweenUtil.TWEEN.update();
    }

    public showCurtain: () => void = () => {
        // new TweenUtil.Tween<Vector2>(this.top.position)
        //     .to(new Vector2(this.top.position.x, this.top.position.y - 180), 1e3)
        //     .onUpdate((val) => {
        //         this.top.position = val;
        //     })
        //     .start();
        // new TweenUtil.Tween<Vector2>(this.bottom.position)
        //     .to(new Vector2(this.bottom.position.x, this.bottom.position.y + 180), 1e3)
        //     .onUpdate((val) => {
        //         this.bottom.position = val;
        //     })
        //     .start();

        AccessorTween.move(() => {
            return this.top.position.y;
        }, (val: number) => {
            this.top.position = new Vector2(this.top.position.x, val);
        }, -180, 1e3);

        AccessorTween.move(() => {
            return this.bottom.position.y;
        }, (val: number) => {
            this.bottom.position = new Vector2(this.bottom.position.x, val);
        }, 180, 1e3);
    }
}
