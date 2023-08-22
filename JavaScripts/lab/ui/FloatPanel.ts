import FloatCanvas_Generate from "../../ui-generate/UIAnimLab/float/FloatCanvas_generate";
import TWEEN = Util.TweenUtil.TWEEN;
import AccessorTween, {TweenTask} from "../../accessorTween/AccessorTween";
import Easing, {EasingFunction} from "../../easing/Easing";

class FloatOption {
    public transparency?: boolean;

    public concealTransparency?: number;

    public showTransparency?: number;

    public animDuration?: number;
}

const defaultFloatOption: FloatOption = {
    transparency: true,
    concealTransparency: 0.1,
    showTransparency: 1,
    animDuration: 1e3
};

/**
 * 浮动 Panel.
 * 以浮动的方式进入或退出.
 */
@UI.UICallOnly("")
export default class FloatPanel extends FloatCanvas_Generate {
    public shown: boolean = true;

    public opt: FloatOption;

    public mainEasing: EasingFunction = Easing.easeOutSine;

    private _task: TweenTask<unknown>;

    private _num: number = 0;

    constructor(opt: Partial<FloatOption> = {}) {
        super();
        this.opt = {...defaultFloatOption, ...opt};
    }

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;

        this._task = AccessorTween
            .to(
                () => {
                    return {
                        topY: this.top.position.y,
                        bottomY: this.bottom.position.y,
                        topAlpha: this.top.renderOpacity,
                        bottomAlpha: this.bottom.renderOpacity
                    };
                },
                ({topY, bottomY, topAlpha, bottomAlpha}) => {
                    this.top.position = new Vector2(this.top.position.x, topY);
                    this.bottom.position = new Vector2(this.bottom.position.x, bottomY);
                    if (this.opt.transparency) {
                        this.top.renderOpacity = topAlpha;
                        this.bottom.renderOpacity = bottomAlpha;
                    }
                },
                {
                    topY: -180,
                    bottomY: 1260,
                    topAlpha: this.opt.concealTransparency,
                    bottomAlpha: this.opt.concealTransparency
                },
                this.opt.animDuration,
                {
                    topAlpha: this.opt.showTransparency,
                    bottomAlpha: this.opt.showTransparency
                },
                this.mainEasing)
            .pause()
            .autoDestroy(false);
    }

    protected onUpdate() {
        TWEEN.update();
    }

    /**
     * 隐藏浮动幕布.
     */
    public concealCurtain: () => void = () => {
        if (!this.shown) {
            return;
        }
        this.shown = false;
        this._task.forward(true, false);
    };

    /**
     * 显示浮动幕布.
     */
    public showCurtain: () => void = () => {
        if (this.shown) {
            return;
        }
        this.shown = true;
        this._task.backward(true, false);
    };
}
