import Log4Ts from "../../../depend/log4ts/Log4Ts";

@Component
export default class CircleMask extends mw.Script {
//#region Member
    public static count: number = 0;

    private _eventListeners: mw.EventListener[] = [];

    private _controllerCanvas: mw.Canvas;

    private _itemImage: mw.Image;

    /**
     * item guid.
     */
    @mw.Property({
        displayName: "item guid",
        tooltip: "展台图片 guid",
    })
    public itemGuid: string = "266695";

    /**
     * 直径.
     */
    @mw.Property({
        displayName: "直径",
    })
    public diameter: number = 100;

    /**
     * 位置.
     */
    @mw.Property({
        displayName: "位置",
    })
    public position: Vector2 = Vector2.zero;

    /**
     * 精度.
     */
    @mw.Property({
        displayName: "精度",
        tooltip: "生成 mask 数量",
    })
    public precision: number = 12;

    private _masks: mw.Canvas[] = [];
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region MetaWorld Event
    protected onStart(): void {
        super.onStart();
        this.useUpdate = true;
//#region Member init

        if (SystemUtil.isClient()) {
            this._controllerCanvas = Canvas.newObject(UIService.canvas, "CircleMaskRoot");
            this._controllerCanvas.position = new Vector2(400 + CircleMask.count * 0.2, 200 + CircleMask.count * 0.1);
            let lastCnv = this._controllerCanvas;

            for (let i = 0; i < this.precision; ++i) {
                const cnvMask = Canvas.newObject(lastCnv);
                cnvMask.clipEnable = true;
                cnvMask.size = new Vector2(this.diameter, this.diameter);
                cnvMask.position = this.position;
                cnvMask.renderTransformAngle = 360 / 4 / this.precision * i;
                this._masks.push(cnvMask);
                lastCnv = cnvMask;
            }

            this._itemImage = Image.newObject(this._masks[this._masks.length - 1], "ImgItem");
            this._itemImage.imageGuid = this.itemGuid;
            AssetUtil.asyncDownloadAsset(this.itemGuid).then(
                (value) => {
                    if (value) {
                        this._itemImage.imageGuid = this.itemGuid;
                        // const size = this._itemImage.imageSize;
                        // this._itemImage.position = new mw.Vector2(size.x / 2, size.y / 2);
                    } else {
                        Log4Ts.error(CircleMask, `img item guid not found.`);
                    }
                },
            );

            ++CircleMask.count;
            mw.Event.dispatchToLocal("CircleMaskGenerateDone");
        }

//#endregion ------------------------------------------------------------------------------------------
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);
    }

    protected onDestroy(): void {
        super.onDestroy();
        --CircleMask.count;

        UIService.canvas.removeChild(this._controllerCanvas);

//#region Event Unsubscribe
        this._eventListeners.forEach(value => value.disconnect());
//#endregion ------------------------------------------------------------------------------------------
    }

//#endregion

//#region Init
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Callback
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}
