import Camera = mw.Camera;
import InputUtil = mw.InputUtil;
import Vector2 = mw.Vector2;
import Rotation = mw.Rotation;
import StaleButton = mw.StaleButton;
import InputBox = mw.InputBox;
import InputTextLimit = mw.InputTextLimit;

/**
 * 展台.
 * 单脚本.
 * 仅客户端.
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.2.0
 */
@Component
export default class Exhibition extends mw.Script {
    //#region Member
    private _eventListeners: EventListener[] = [];

    /**
     * Prefab guid.
     */
    @mw.Property({
        displayName: "prefab guid",
        group: "综合配置 | 物体",
        tooltip: "务必是客户端单端的. Prefab GameObject Tag 仅一种生效",
    })
    public itemPrefabGuid: string = "";

    /**
     * prefab location.
     */
    @mw.Property({displayName: "prefab location", group: "综合配置 | 物体", tooltip: "Prefab 生成位置"})
    public prefabLocation: Vector = Vector.zero;

    /**
     * game object guid.
     */
    @mw.Property({
        displayName: "game object guid",
        group: "综合配置 | 物体",
        tooltip: "场景内物体 Guid. Prefab GameObject Tag 仅一种生效",
    })
    public itemGameObjectGuid: string = "";

    /**
     * game object tag.
     */
    @mw.Property({
        displayName: "game object tag",
        group: "综合配置 | 物体",
        tooltip: "场景内物体 Tag. Prefab GameObject Tag 仅一种生效",
    })
    public itemTag: string = "ExhibitionItem";

    /**
     * prefab location.
     */
    @mw.Property({displayName: "camera location offset", group: "综合配置 | 镜头", tooltip: "镜头相对 item 偏移量"})
    public cameraLocationOffset: Vector = new Vector(-500, 0, 100);

    /**
     * 最大自动旋转速度.
     */
    @mw.Property({displayName: "max auto rotation speed", group: "展台配置 | 旋转", tooltip: "最大自动旋转速度 °/s"})
    public itemMaxAutoRotateSpeed: number = 0.5;

    /**
     * 自动旋转加速度.
     */
    @mw.Property({displayName: "auto rotation accelerate", group: "展台配置 | 旋转", tooltip: "自动旋转加速度 °/s^2"})
    public itemRotationAccelerate: number = 0.25;

    /**
     * 是否 顺时针的.
     */
    @mw.Property({displayName: "clockwise", group: "展台配置 | 旋转", tooltip: "是否 顺时针的（沿从上向下轴）"})
    public isClockWise: boolean = true;

    /**
     * 旋转目标.
     */
    @mw.Property({
        displayName: "destination",
        group: "展台配置 | 旋转",
        tooltip: "旋转目标. Local Rotate Z. [-180,180)",
    })
    public destination: number = 0;

    /**
     * 是否 启用旋转目标.
     */
    @mw.Property({
        displayName: "use destination",
        group: "展台配置 | 旋转",
        tooltip: "是否启用 旋转目标",
    })
    public useDestination: boolean = true;

    /**
     * 是否 以自动旋转开始.
     */
    @mw.Property({displayName: "isAutoRotateBegin", group: "展台配置 | 旋转", tooltip: "是否 以自动旋转开始"})
    public isAutoRotate: boolean = false;

    /**
     * 是否 可手动的.
     */
    @mw.Property({displayName: "manualAble", group: "展台配置 | 手动", tooltip: "是否 可手动的"})
    public manualAble: boolean = true;

    /**
     * 手动旋转速度.
     */
    @mw.Property({displayName: "manualRotateSpeed", group: "展台配置 | 手动", tooltip: "手动旋转速度 °/s"})
    public manualRotateSpeed: number = 0.5;

    /**
     * 恢复自动时长.
     */
    @mw.Property({displayName: "returnAutoDuration", group: "展台配置 | 手动", tooltip: "恢复自动时长 s"})
    public returnAutoDuration: number = 3;

    private _currentVelocity: number = 0;

    private get isWatching() {
        return Camera.currentCamera === this._camera;
    }

    private _obj: GameObject = null;

    private _camera: Camera = null;

    private _lastTouchPosition: Vector2 = Vector2.zero;

    private _touched: boolean = false;

    private _lastEndTouchTime: number = 0;

    private _controllerCanvas: Canvas;
    private _textFrom: InputBox;
    private _textTo: InputBox;
    private _btn: StaleButton;
    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    //#region MetaWorld Event
    protected onStart(): void {
        super.onStart();
        if (SystemUtil.isServer()) {
            console.warn("展台脚本不应该在服务端运行.");
            return;
        }

        this.useUpdate = true;
        //#region Member init

        this._controllerCanvas = Canvas.newObject();
        this._textFrom = InputBox.newObject();
        this._textTo = InputBox.newObject();
        this._btn = StaleButton.newObject();
        this._controllerCanvas.addChild(this._textFrom);
        this._controllerCanvas.addChild(this._textTo);
        this._controllerCanvas.addChild(this._btn);

        this._textFrom.inputTextLimit = InputTextLimit.LimitToInt;
        this._textTo.inputTextLimit = InputTextLimit.LimitToInt;
        this._textFrom.size = new Vector2(200, 60);
        this._textFrom.position = new Vector2(0, 20);
        this._textTo.size = new Vector2(200, 60);
        this._textTo.position = new Vector2(0, 100);
        this._btn.text = "Rotate!";
        this._btn.size = new Vector2(200, 60);
        this._btn.position = new Vector2(0, 180);
        this._btn.onClicked.add(this.onBtnClicked);

        UIService.canvas.addChild(this._controllerCanvas);

        if (this.manualAble) {
            console.log("展台脚本已启用手动控制.");
            console.log("将对 InputUtil 注入监听. 新增监听将使手动控制失效.");

            InputUtil.onTouchBegin(this.touchBegin);
            InputUtil.onTouchEnd(this.touchEnd);
            InputUtil.onTouchMove(this.touchMove);
        }

        console.log("M 键 切换 自动旋转.");
        console.log("D 键 切换 使用旋转目标.");

        InputUtil.onKeyDown(Keys.M, () => {
            this.isAutoRotate = !this.isAutoRotate;
            console.log(`切换 自动旋转: ${this.isAutoRotate}.`);
        });
        InputUtil.onKeyDown(Keys.D, () => {
            this.useDestination = !this.useDestination;
            console.log(`切换 使用旋转目标: ${this.useDestination}.`);
        });

        if (this.itemPrefabGuid && this.itemPrefabGuid !== "") {
            GameObject.asyncSpawn(
                this.itemPrefabGuid,
                {
                    replicates: false,
                    transform: new Transform(
                        this.prefabLocation,
                        new Rotation(0, 0, 0),
                        Vector.one),
                },
            ).then(
                value => {
                    if (value) {
                        this._obj = value;
                        this.attachCamera();
                    } else {
                        console.error("物体生成失败.\nprefab guid 指向一个无效的 prefab.");
                    }
                },
            );
        } else if (this.itemGameObjectGuid && this.itemGameObjectGuid !== "") {
            this._obj = GameObject.findGameObjectById(this.itemGameObjectGuid);
            if (!this._obj) {
                console.warn(`场景内不存在任何 guid 为 ${this.itemGameObjectGuid} 的物体.`);
            } else {
                this.attachCamera();
            }
        } else {
            this._obj = GameObject.findGameObjectsByTag(this.itemTag)[0];
            if (!this._obj) {
                console.warn("场景内不存在任何带有 ExhibitionItem 标签的物品.");
                console.warn("且配置了一个空的 prefab guid 与 game object guid.");
            } else {
                this.attachCamera();
            }
        }
        //#endregion ------------------------------------------------------------------------------------------

        //#region Widget bind
        //#endregion ------------------------------------------------------------------------------------------

        //#region Event Subscribe
        // this._eventListeners.push(Event.addLocalListener(EventDefine.EVENT_NAME, CALLBACK));
        //#endregion ------------------------------------------------------------------------------------------
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);
        if (SystemUtil.isServer()) return;

        this.autoRotateItem(this._obj, dt);
    }

    protected onDestroy(): void {
        super.onDestroy();

        //#region Event Unsubscribe
        this._eventListeners.forEach(value => value.disconnect());
        //#endregion ------------------------------------------------------------------------------------------
    }

    //#endregion

    //#region Method
    private autoRotateItem(item: GameObject, dt: number) {
        if (!item) return;
        if (!this.autoRotateEnable) return;

        if (this.isAutoRotate) {
            this._currentVelocity = Math.min(this.itemMaxAutoRotateSpeed, this._currentVelocity + this.itemRotationAccelerate * dt);
        } else {
            this._currentVelocity = 0;
        }

        const currRotation = item.localTransform.rotation;
        if (this.useDestination && Math.abs(currRotation.z - this.destination) < this.itemMaxAutoRotateSpeed * 1.1) {
            item.worldTransform.rotation = new Rotation(
                currRotation.x,
                currRotation.y,
                this.destination);
            return;
        }
        item.worldTransform.rotation = new Rotation(
            currRotation.x,
            currRotation.y,
            currRotation.z + (this.isClockWise ? 1 : -1) * this._currentVelocity);
    };

    private get autoRotateEnable() {
        return !this._touched && Date.now() - this._lastEndTouchTime > this.returnAutoDuration * 1e3;
    }

    private attachCamera() {
        if (!this._obj) return;
        GameObject.asyncSpawn("Camera",
            {
                replicates: false,
                transform: new Transform(
                    this._obj
                        .worldTransform
                        .position
                        .clone()
                        .add(this.cameraLocationOffset),
                    new Rotation(0, 0, 0),
                    Vector.one),
            },
        ).then(
            (value) => {
                const camera = value as Camera;
                camera.lock(this._obj);
                this._camera = camera;
                Camera.switch(value as Camera);
            },
        );
    }

    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    //#region Init
    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    //#region Event Callback

    private touchBegin = (index: number, location: Vector2) => {
        if (!this.isWatching) return;

        this._touched = true;
        this._currentVelocity = 0;
        this._lastTouchPosition.set(location.x, location.y);
    };

    private touchEnd = (index: number, location: Vector2) => {
        if (!this.isWatching) return;

        this._touched = false;
        this._lastEndTouchTime = Date.now();
    };

    private touchMove = (index: number, location: Vector2) => {
        if (!this.isWatching) return;

        if (!this._obj) return;
        if (this._lastTouchPosition.equals(location, 1e-3)) return;

        let flag = this._lastTouchPosition.x - location.x > 0;
        const delta = this._lastTouchPosition.subtract(location).length;
        let rotation = this._obj.localTransform.rotation;
        rotation.z += (flag ? delta : -delta) * this.manualRotateSpeed;
        this._obj.localTransform.rotation = rotation;
        this._lastTouchPosition.set(location.x, location.y);
    };

    private onBtnClicked = () => {
        const from = Number(this._textFrom.text) ?? 0;
        const to = Number(this._textTo.text) ?? 0;

        console.log("Rotate!");
        console.log(`from: ${from}, to: ${to}`);

        const currentRotation = this._obj.localTransform.rotation;
        this._obj.localTransform.rotation = new mw.Rotation(currentRotation.x, currentRotation.y, from);
        this.destination = to;
        this.useDestination = true;
        this.isAutoRotate = true;
    };
    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}
