/**
 * 展台.
 * @desc 单脚本.
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 35.1.0
 */
@Component
export default class Exhibition extends mw.Script {
//#region Member
    private _eventListeners: mw.EventListener[];

    /**
     * Prefab guid.
     */
    @mw.Property({
        displayName: "prefab guid",
        group: "综合配置 | 物体",
        replicated: true,
    })
    public itemPrefabGuid: string = "";

    /**
     * prefab location.
     */
    @mw.Property({
        displayName: "prefab location",
        group: "综合配置 | 物体",
        tooltip: "Prefab 生成位置",
        replicated: true,
    })
    public prefabLocation: Vector = Vector.zero;

    /**
     * game object guid.
     */
    @mw.Property({
        displayName: "game object guid",
        group: "综合配置 | 物体",
        tooltip: "场景内物体 Guid. Prefab GameObject Tag 仅一种生效",
        replicated: true,
    })
    public itemGameObjectGuid: string = "";

    /**
     * game object tag.
     */
    @mw.Property({
        displayName: "game object tag",
        group: "综合配置 | 物体",
        tooltip: "场景内物体 Tag. Prefab GameObject Tag 仅一种生效",
        replicated: true,
    })
    public itemTag: string = "ExhibitionItem";

    /**
     * 最大自动旋转速度.
     */
    @mw.Property({
        displayName: "max auto rotation speed",
        group: "展台配置 | 旋转",
        tooltip: "最大自动旋转速度 °/s",
        replicated: true,
    })
    public itemMaxAutoRotateSpeed: number = 0.5;

    /**
     * 自动旋转加速度.
     */
    @mw.Property({
        displayName: "auto rotation accelerate",
        group: "展台配置 | 旋转",
        tooltip: "自动旋转加速度 °/s^2",
        replicated: true,
    })
    public itemRotationAccelerate: number = 0.25;

    /**
     * 是否 顺时针的.
     */
    @mw.Property({
        displayName: "clockwise",
        group: "展台配置 | 旋转",
        tooltip: "是否 顺时针的（沿从上向下轴）",
        replicated: true,
    })
    public isClockWise: boolean = true;

    /**
     * 旋转目标角度.
     */
    @mw.Property({
        displayName: "destination",
        group: "展台配置 | 旋转",
        tooltip: "旋转目标角度. World Rotate Z. [-180,180)",
        replicated: true,
    })
    public destination: number = 0;

    /**
     * 是否 启用旋转目标角度.
     */
    @mw.Property({
        displayName: "use destination",
        group: "展台配置 | 旋转",
        tooltip:
            "是否启用 旋转目标角度\n" +
            "启用后将在到达目标角度时停止旋转",
        replicated: true,
    })
    public useDestination: boolean = false;

    /**
     * 是否 以自动旋转开始.
     */
    @mw.Property({
        displayName: "isAutoRotateBegin",
        group: "展台配置 | 旋转",
        tooltip: "是否 以自动旋转开始",
        replicated: true,
    })
    public isAutoRotate: boolean = true;

    /**
     * 是否 可手动的.
     */
    @mw.Property({displayName: "manualAble", group: "展台配置 | 手动", tooltip: "是否 可手动的", replicated: true})
    public manualAble: boolean = false;

    /**
     * 手动旋转速度.
     */
    @mw.Property({
        displayName: "manualRotateSpeed",
        group: "展台配置 | 手动",
        tooltip: "手动旋转速度 °/s",
        replicated: true,
    })
    public manualRotateSpeed: number = 0.5;

    /**
     * 恢复自动时长.
     */
    @mw.Property({
        displayName: "returnAutoDuration",
        group: "展台配置 | 手动",
        tooltip: "恢复自动时长 s",
        replicated: true,
    })
    public returnAutoDuration: number = 3;

    @mw.Property({hideInEditor: true, replicated: true})
    private _currentVelocity: number = 0;

    @mw.Property({hideInEditor: true, replicated: true})
    private _obj: GameObject = null;

    @mw.Property({hideInEditor: true, replicated: true})
    private _lastTouchPosition: mw.Vector2 = mw.Vector2.zero;

    @mw.Property({hideInEditor: true, replicated: true})
    private _touched: boolean = false;

    @mw.Property({hideInEditor: true, replicated: true})
    private _validRunning: boolean = false;

    private _lastCylinderNum: number = 0;

    private _lastEndTouchTime: number = 0;

    private _controllerCanvas: Canvas;
    private _textFrom: mw.InputBox;
    private _textTo: mw.InputBox;
    private _btn: mw.StaleButton;
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
        this._textFrom = mw.InputBox.newObject();
        this._textTo = mw.InputBox.newObject();
        this._btn = mw.StaleButton.newObject();
        this._controllerCanvas.addChild(this._textFrom);
        this._controllerCanvas.addChild(this._textTo);
        this._controllerCanvas.addChild(this._btn);

        this._textFrom.inputTextLimit = mw.InputTextLimit.LimitToInt;
        this._textTo.inputTextLimit = mw.InputTextLimit.LimitToInt;
        this._textFrom.hintString = "from";
        this._textTo.hintString = "to";
        this._textFrom.size = new mw.Vector2(200, 60);
        this._textFrom.position = new mw.Vector2(0, 20);
        this._textTo.size = new mw.Vector2(200, 60);
        this._textTo.position = new mw.Vector2(0, 100);
        this._btn.text = "Rotate!";
        this._btn.size = new mw.Vector2(200, 60);
        this._btn.position = new mw.Vector2(0, 180);
        this._btn.onClicked.add(this.onBtnClicked);

        UIService.canvas.addChild(this._controllerCanvas);

        if (this.manualAble) {
            console.log("展台脚本已启用手动控制.");
            console.log("将对 InputUtil 注入监听. 新增监听将使手动控制失效.");

            mw.InputUtil.onTouchBegin(this.touchBegin);
            mw.InputUtil.onTouchEnd(this.touchEnd);
            mw.InputUtil.onTouchMove(this.touchMove);
        }

        console.log("M 键 切换 自动旋转.");

        mw.InputUtil.onKeyDown(Keys.M, () => {
            this.isAutoRotate = !this.isAutoRotate;
            this.useDestination = false;
            console.log(`切换 自动旋转: ${this.isAutoRotate}.`);
        });

        if (this.itemPrefabGuid && this.itemPrefabGuid !== "") {
            mw.GameObject.asyncSpawn(
                this.itemPrefabGuid,
                {
                    replicates: false,
                    transform: new Transform(
                        this.prefabLocation,
                        new mw.Rotation(0, 0, 0),
                        Vector.one),
                },
            ).then(
                value => {
                    if (value) {
                        this._obj = value;
                    } else {
                        console.error("物体生成失败.\nprefab guid 指向一个无效的 prefab.");
                    }
                },
            );
        } else if (this.itemGameObjectGuid && this.itemGameObjectGuid !== "") {
            this._obj = GameObject.findGameObjectById(this.itemGameObjectGuid);
            if (!this._obj) {
                console.warn(`场景内不存在任何 guid 为 ${this.itemGameObjectGuid} 的物体.`);
            }
        } else {
            this._obj = GameObject.findGameObjectsByTag(this.itemTag)[0];
            if (!this._obj) {
                console.warn("场景内不存在任何带有 ExhibitionItem 标签的物品.");
                console.warn("且配置了一个空的 prefab guid 与 game object guid.");
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

        if (SystemUtil.isServer) this.autoRotateItem(this._obj, dt);
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

        const currRotation = item.worldTransform.rotation;

        if (this.useDestination && this.willArrive(currRotation.z)) {
            if (this._lastCylinderNum <= 0) {
                if (this._validRunning) {
                    item.worldTransform.rotation = new mw.Rotation(
                        currRotation.x,
                        currRotation.y,
                        this.destination);
                    this.isAutoRotate = false;
                    return;
                }
            } else {
                --this._lastCylinderNum;
            }
        }
        this._validRunning = this._currentVelocity > 0;
        item.worldTransform.rotation = new mw.Rotation(
            currRotation.x,
            currRotation.y,
            currRotation.z + (this.isClockWise ? 1 : -1) * this._currentVelocity);
    };

    private get autoRotateEnable() {
        return !this._touched && Date.now() - this._lastEndTouchTime > this.returnAutoDuration * 1e3;
    }

    private clampValidDestinationAngle(origin: number) {
        return ((origin + 180) % 360 | 0) - 180;
    }

    private willArrive(currZ: number): boolean {
        const dist = this.isClockWise ?
            this.destination + (this.destination < currZ ? 360 : 0) - currZ :
            currZ - this.destination + (this.destination > currZ ? 360 : 0);
        return this._currentVelocity > dist;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Init
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Callback

    private touchBegin = (index: number, location: mw.Vector2) => {
        this._touched = true;
        this._currentVelocity = 0;
        this._lastTouchPosition.set(location.x, location.y);
    };

    private touchEnd = (index: number, location: mw.Vector2) => {
        this._touched = false;
        this._lastEndTouchTime = Date.now();
    };

    private touchMove = (index: number, location: mw.Vector2) => {
        if (!this._obj) return;
        if (this._lastTouchPosition.equals(location, 1e-3)) return;

        let flag = this._lastTouchPosition.x - location.x > 0;
        const delta = this._lastTouchPosition.subtract(location).length;
        let rotation = this._obj.worldTransform.rotation;
        rotation.z += (flag ? delta : -delta) * this.manualRotateSpeed;
        this._obj.worldTransform.rotation = rotation;
        this._lastTouchPosition.set(location.x, location.y);
    };

    private onBtnClicked = () => {
        const from = Number(this._textFrom.text) ?? 0;
        const to = Number(this._textTo.text) ?? 0;

        console.log("Rotate!");
        console.log(`from: ${from}, to: ${to}`);

        this.isClockWise = to > from;

        this._lastCylinderNum = Math.abs(to - from) / 360 | 0;

        const currentRotation = this._obj.worldTransform.rotation;
        this._obj.worldTransform.rotation = new mw.Rotation(currentRotation.x, currentRotation.y, from);
        this.destination = this.clampValidDestinationAngle(to);
        this.useDestination = true;
        this.isAutoRotate = true;
        this._validRunning = false;
    };
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}
