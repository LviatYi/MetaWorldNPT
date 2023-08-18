import FloatCanvas_Generate from "../../ui-generate/UIAnimLab/float/FloatCanvas_generate";
import TWEEN = Util.TweenUtil.TWEEN;
import AccessorTween, {TweenTask} from "../../AccessorTween/AccessorTween";
import Easing, {EasingFunction} from "../easing/Easing";

class FloatOption {
    public transparency?: boolean;
    public concealTransparency?: number;
    public showTransparency?: number;
}

/**
 * 浮动 Panel.
 * 以浮动的方式进入或退出.
 */
@UI.UICallOnly("")
export default class FloatPanel extends FloatCanvas_Generate {
    public shown: boolean = true;
    public mainEasing: EasingFunction = Easing.easeOutSine;

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;
        console.log("Awake");
    }

    protected onUpdate() {
        TWEEN.update();
    }

    /**
     * 隐藏浮动幕布.
     */
    public concealCurtain: (opt?: FloatOption) => void = (opt) => {
        if (!this.shown) {
            return;
        }
        this.shown = false;

        AccessorTween.move(
            () => {
                return {topY: this.top.position.y, bottomY: this.bottom.position.y};
            },
            ({topY, bottomY}) => {
                this.top.position = new Vector2(this.top.position.x, topY);
                this.bottom.position = new Vector2(this.bottom.position.x, bottomY);
            },
            {topY: -180, bottomY: 180},
            1e3, this.mainEasing);

        // new Util.TweenUtil.Tween(
        //     {topY: this.top.position.y, bottomY: this.bottom.position.y})
        //     .to(
        //         {topY: this.top.position.y - 180, bottomY: this.bottom.position.y + 180},
        //         1e3)
        //     .onUpdate(
        //         val => {
        //             this.top.position = new Vector2(this.top.position.x, val.topY);
        //             this.bottom.position = new Vector2(this.bottom.position.x, val.bottomY);
        //         })
        //     .start();

        if (opt?.transparency) {
            AccessorTween.to(() => {
                return this.curtain.renderOpacity;
            }, (val: number) => {
                this.curtain.renderOpacity = val;
            }, 0, 1e3, this.mainEasing);
        }
    };

    /**
     * 显示浮动幕布.
     */
    public showCurtain: (opt?: FloatOption) => void = (opt) => {
        if (this.shown) {
            return;
        }
        this.shown = true;
        // AccessorTween.move(() => {
        //     return {topY: this.top.position.y, bottomY: this.bottom.position.y};
        // }, ({topY, bottomY}) => {
        //     this.top.position = new Vector2(this.top.position.x, topY);
        //     this.bottom.position = new Vector2(this.bottom.position.x, bottomY);
        // }, {topY: 180, bottomY: -180}, 1e3, this.mainEasing);
        //
        // if (opt?.transparency) {
        //     AccessorTween.to(() => {
        //         return this.curtain.renderOpacity;
        //     }, (val: number) => {
        //         this.curtain.renderOpacity = val;
        //     }, 1, 1e3, this.mainEasing);
        // }

        new Util.TweenUtil.Tween({topY: this.top.position.y, bottomY: this.bottom.position.y})
            .to({topY: this.top.position.y + 180, bottomY: this.bottom.position.y - 180}, 500).onUpdate(val => {
            this.top.position = new Vector2(this.top.position.x, val.topY);
            this.bottom.position = new Vector2(this.bottom.position.x, val.bottomY);
        })
            .start();
    };
}
