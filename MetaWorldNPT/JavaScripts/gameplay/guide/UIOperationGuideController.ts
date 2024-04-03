import Gtk from "../../util/GToolkit";

enum Directions {
    Left,
    Right,
    Top,
    Bottom,
}

function getDirectionName(direction: Directions): string {
    switch (direction) {
        case Directions.Left:
            return "Left";
        case Directions.Right:
            return "Right";
        case Directions.Top:
            return "Top";
        case Directions.Bottom:
            return "Bottom";
        default:
            return "";
    }
}

interface MaskLayout {
    lsx: number;

    rsx: number;
    rpx: number;

    tpx: number;
    tsx: number;
    tsy: number;

    bpx: number;
    bpy: number;
    bsx: number;
    bsy: number;
}

interface IVector2 {
    x: number,
    y: number
}

const FullHdSize: IVector2 = {
    x: 1920,
    y: 1080
};

/**
 * Operation Guide for UI.
 * NO OTHER MODULE DEPENDED.
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
export default class UIOperationGuideController {
    public static readonly DEFAULT_PADDING_IMAGE_GUID = "114028";

    public static readonly DEFAULT_PADDING_COLOR_HEX = "000000FF";

    constructor() {
        this.generateMask();
    }


    private _dist: MaskLayout = {
        bpx: 0,
        bpy: 0,
        bsx: 0,
        bsy: 0,
        lsx: 0,
        rpx: 0,
        rsx: 0,
        tpx: 0,
        tsx: 0,
        tsy: 0,
    };


    private _masks: mw.Image[] = [];

    private _innerBtn: mw.Button;

    private _maskOpacity: number = 0.8;

    public get maskOpacity(): number {
        return this._maskOpacity;
    }

    public set maskOpacity(value: number) {
        this._maskOpacity = Math.min(Math.max(value, 0), 1);
    }

    /**
     * 请求引导.
     */
    public request() {

    }

    public focusOn(widget: mw.Widget) {
        this.calDist(
            Gtk.getUiResolvedPosition(widget),
            Gtk.getUiResolvedSize(widget)
        );
        this.applyDist();
        this._masks.forEach((item) => item.renderOpacity = this._maskOpacity);
    }

    private fade() {

    }

    private generateMask() {
        for (let i = 0; i < 4; ++i) {
            const mask = Image.newObject(
                UIService.canvas,
                `UIOperationGuideControllerMask_${getDirectionName(i as Directions)}_generate`
            );
            mask.imageGuid = UIOperationGuideController.DEFAULT_PADDING_IMAGE_GUID;
            mask.imageColor = LinearColor.colorHexToLinearColor(UIOperationGuideController.DEFAULT_PADDING_COLOR_HEX);
            mask.renderOpacity = 0;
            this._masks.push(mask);
            UIService.canvas.addChild(mask);
        }
    }

    private transitionHandler(dt: number) {

    }

    private calDist(tp: IVector2,
                    ts: IVector2) {
        this._dist.lsx = tp.x;
        this._dist.rpx = tp.x + ts.x;
        this._dist.rsx = FullHdSize.x - this._dist.rpx;
        this._dist.tpx = tp.x;
        this._dist.tsx = ts.x;
        this._dist.tsy = tp.y;
        this._dist.bpx = tp.x;
        this._dist.bpy = tp.y + ts.y;
        this._dist.bsx = ts.x;
        this._dist.bsy = FullHdSize.y - this._dist.bpy;
    }

    private applyDist() {
        Gtk.setUiPosition(this._masks[Directions.Left], 0, 0);
        Gtk.setUiSize(this._masks[Directions.Left], this._dist.lsx, FullHdSize.y);

        Gtk.setUiPosition(this._masks[Directions.Right], this._dist.rpx, 0);
        Gtk.setUiSize(this._masks[Directions.Right], this._dist.rsx, FullHdSize.y);

        Gtk.setUiPosition(this._masks[Directions.Top], this._dist.tpx, 0);
        Gtk.setUiSize(this._masks[Directions.Top], this._dist.tsx, this._dist.tsy);

        Gtk.setUiPosition(this._masks[Directions.Bottom], this._dist.bpx, this._dist.bpy);
        Gtk.setUiSize(this._masks[Directions.Bottom], this._dist.bsx, this._dist.bsy);
    }
}