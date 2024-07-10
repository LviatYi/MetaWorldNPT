import Log4Ts from "mw-log4ts";

@Component
export class FocusOnMe extends mw.Script {
//#region Property
    /**
     * GameObject guid.
     */
    @mw.Property({
        displayName: "target guid",
        group: "目标",
        replicated: true,
        tooltip:
            "目标 GameObject Guid\n" +
            "与 target location 二选一",
    })
    public targetGuid: string = "";

    /**
     * Target location.
     */
    @mw.Property({
        displayName: "target location",
        group: "目标",
        replicated: true,
        tooltip:
            "目标位置\n" +
            "与 target guid 二选一",
    })
    public targetLocation: mw.Vector = new mw.Vector();

    /**
     * 最大自动旋转速度.
     */
    @mw.Property({
        displayName: "max auto rotation speed",
        group: "旋转",
        tooltip: "最大自动旋转速度 °/s",
        replicated: true,
    })
    public maxAutoRotateSpeed: number = 0.5;

    /**
     * 自动旋转加速度.
     */
    @mw.Property({
        displayName: "rotation accelerate",
        group: "旋转",
        tooltip: "自动旋转加速度 °/s^2",
        replicated: true,
    })
    public rotationAccelerate: number = 0.25;

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
//#endregion

    private _camera: mw.Camera;

    private get camera(): mw.Camera {
        if (!this._camera) {
            this._camera = mw.Camera.spawn<mw.Camera>("Camera");
            Log4Ts.log(FocusOnMe, `spawn camera: ${this._camera.gameObjectId}`);
        }

        return this._camera;
    }

    private _targetGameObject: mw.GameObject | undefined;

    private get target(): mw.GameObject | undefined {
        if (!this.targetGuid || this.targetGuid.length === 0) return undefined;
        if (!this._targetGameObject) {
            this._targetGameObject = mw.GameObject.findGameObjectById(this.targetGuid);
        }

        return this._targetGameObject;
    }

    public constructor() {
        super();
        FocusOnMe._instance = this;
    }

    public static _instance: FocusOnMe;

    public static get controller(): FocusOnMe | undefined {
        return this._instance;
    }

    public run() {
        this.focusHandler();
        mw.Camera.switch(this.camera);
    }

    private focusHandler() {
        if (this.target) {
            this.camera.positionMode = mw.CameraPositionMode.PositionFollow;
            this.camera.parent = this.target;
            this.camera.springArm.localTransform.position = mw.Vector.zero;
        } else {
            this.camera.positionMode = mw.CameraPositionMode.PositionFixed;
            this.camera.parent = undefined;
            this.camera.springArm.localTransform.position = this.targetLocation;
        }
    }

//#region Controller
    public setTargetGuid(guid: string): this {
        this._targetGameObject = undefined;
        this.targetGuid = guid;
        this.focusHandler();

        return this;
    }

    public setTargetLocation(location: mw.Vector): this {
        this._targetGameObject = undefined;
        this.targetGuid = "";
        this.targetLocation.set(location);
        this.focusHandler();

        return this;
    }

    public setSpringArmLength(length: number): this {
        this.camera.springArm.length = length;

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}