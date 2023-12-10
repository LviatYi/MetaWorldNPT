import Character = mw.Character;
import Player = mw.Player;
import Camera = mw.Camera;
import Quaternion = mw.Quaternion;
import Rotation = mw.Rotation;
import Easing, { CubicBezier, CubicBezierBase, EasingFunction } from "../easing/Easing";
import Waterween from "../waterween/Waterween";
import { FlowTweenTask } from "../waterween/tweenTask/FlowTweenTask";
import GToolkit from "../../util/GToolkit";
import { AdvancedTweenTask } from "../waterween/tweenTask/AdvancedTweenTask";

/**
 * 相机配置参数.
 * @desc 是 Nolan 可能修改的相机参数的属性集合.
 * @desc 不稳定 长期更新的.
 */
class NolanCameraParams {
    public springArmLength: number;

    public cameraLocationPositionY: number;

    constructor(springArmLength: number, cameraLocationPositionY: number) {
        this.springArmLength = springArmLength;
        this.cameraLocationPositionY = cameraLocationPositionY;
    }
}

/**
 * Nolan Camera Control System.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @licence
 * @internal 仅供私人使用.
 * @version 0.4.0a
 */
export default class Nolan {
//region Constant
    public static readonly NORMAL_ARM_LENGTH_VELOCITY = 0.25;

    /**
     * 快速.
     */
    public static get fastSpeed(): number {
        return 0.3e3;
    };

    /**
     * 中速.
     */
    public static get mediumSpeed(): number {
        return 1e3;
    };

    /**
     * 慢速.
     */
    public static get slowSpeed(): number {
        return 2e3;
    };

    /**
     * 常规 缓入缓出 Bezier.
     */
    public static get normalBezier() {
        return new CubicBezier(.3, 0, .7, 1);
    };

    /**
     * 敏捷 Bezier.
     */
    public static get agilityBezier() {
        return new CubicBezier(.15, 0, 0, 1);
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _main: Camera;

    private _character: Character;

//region Config
    public defaultParams: NolanCameraParams;

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _controllerRotateTask: AdvancedTweenTask<Quaternion>;

    private _armLengthFlow: FlowTweenTask<number>;

    private _cameraLocationPositionYFlow: FlowTweenTask<number>;

    private _ready: boolean = false;

    /**
     * 摄像机当前朝向.
     *
     * 当无挂载摄像机时返回 null.
     */
    public get forward(): Vector {
        if (this._main) {
            return this._main.springArm.localTransform.clone().getForwardVector();
        }
        return null;
    }

//region Init
    constructor(defaultParams: NolanCameraParams = undefined) {
        Player.asyncGetLocalPlayer().then((value) => {
            this._character = value.character;
            this.attach(Camera.currentCamera);
            this.defaultParams = defaultParams === undefined ?
                new NolanCameraParams(
                    this._main.springArm.length,
                    this._main.springArm.localTransform.position.y,
                ) :
                defaultParams;
            this.init();
            this._ready = true;
        });
    }

    private init() {
        this._armLengthFlow = Waterween.flow(
            () => {
                return this._main.springArm.length;
            },
            (val) => {
                this._main.springArm.length = val;
            },
            Nolan.mediumSpeed,
            Nolan.normalBezier,
        );

        this._cameraLocationPositionYFlow = Waterween.flow(
            () => this._main.localTransform.position.y,
            (val) =>
                this._main.localTransform.position =
                    GToolkit.newWithY(
                        this._main.localTransform.position.clone(),
                        val,
                    ),
            Nolan.mediumSpeed,
            Nolan.normalBezier,
        );
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Getter
    public get ready() {
        return this._ready;
    }

    public get armLength(): number {
        return this._main.springArm.length;
    }

//endregion

    /**
     * 挂载 操作摄像机.
     * @param camera
     */
    public attach(camera: Camera) {
        this._main = camera;
    }

    /**
     * Look at the position.
     * @param position
     * @param isHorizontal 是否 仅在水平面上旋转.
     *      - default false.
     * @param smooth 是否 平滑旋转.
     *      - default false.
     */
    public lookAt(position: Vector, isHorizontal: boolean = false, smooth: boolean = false) {
        this.lookToward(
            position.clone().subtract(this._main.worldTransform.position),
            isHorizontal,
            smooth);
    }

    /**
     * Look at the direction.
     * @param direction
     * @param isHorizontal 是否 仅在水平面上旋转.
     *      - default true.
     * @param smooth 是否 平滑旋转.
     *      - default false.
     */
    public lookToward(direction: Vector, isHorizontal: boolean = false, smooth: boolean = false) {
        this.trySetControllerRotate(
            isHorizontal ? GToolkit.newWithZ(direction, 0) : direction,
            smooth,
            1e3,
            Easing.easeInOutSine,
        );
    }

    /**
     * 环绕拍摄.
     * @param axis 环绕轴.
     * @param angle 环绕角.
     * @param duration 运镜时长 ms.
     * @param easingFunction 补间函数. default {@link Easing.easeInOutSine}
     */
    public surroundShot(axis: Vector,
                        angle: number,
                        duration: number = Nolan.mediumSpeed,
                        easingFunction: EasingFunction | CubicBezierBase = Nolan.normalBezier) {
        const dest = GToolkit.rotateVector(
            Player.getControllerRotation().rotateVector(Vector.forward),
            axis,
            angle);

        this.trySetControllerRotate(
            dest,
            true,
            duration,
            easingFunction,
        );
    }

    /**
     * 推进 / 拉远.
     * @remarks 补间调整 ArmLength.
     * @param dest 移动目标距离.
     * @param duration 运镜时长 ms.
     *      - default 500ms.
     * @param easingFunction 补间函数. default {@link Easing.easeInOutSine}
     */
    public zoom(dest: number, smooth: boolean, duration: number = undefined, easingFunction: EasingFunction | CubicBezierBase = undefined) {
        this.trySetArmLength(dest, smooth, duration, easingFunction);
    }

    /**
     * 第三人称扮演 侧面旁观.
     */
    public lookOnBySide() {
        this._armLengthFlow.to(
            120,
            Nolan.fastSpeed,
            Nolan.agilityBezier);
        this._cameraLocationPositionYFlow.to(
            50,
            Nolan.fastSpeed,
            Nolan.agilityBezier,
        );
    }

    public reset(
        smooth: boolean = true,
        duration: number = Nolan.mediumSpeed,
        easingFunction: EasingFunction | CubicBezierBase = Nolan.normalBezier,
    ) {
        this.trySetArmLength(this.defaultParams.springArmLength,
            smooth,
            duration,
            easingFunction);
        this.trySetArmPositionY(this.defaultParams.cameraLocationPositionY,
            smooth,
            duration,
            easingFunction);
        this.trySetControllerRotate(
            this._character.worldTransform.getForwardVector(),
            smooth,
            duration,
            easingFunction);
    }

    public test() {
        this.lookOnBySide();
    }

    public logCameraState() {
        console.log(`⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄ NOLAN SYSTEM ⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄`);
        console.log(`current CharacterPosition: ${this._character.worldTransform.position}`);
        console.log(`current RotationMode: ${this._main.rotationMode}`);
        console.log(`current LocationMode: ${this._main.positionMode}`);
        console.log();
        console.log(`camera world Transform position: ${this._main.worldTransform.position}`);
        console.log(`camera world Transform rotation: ${this._main.worldTransform.rotation}`);
        console.log(`camera relative Transform position: ${this._main.localTransform.position}`);
        console.log(`camera relative Transform rotation: ${this._main.localTransform.rotation}`);
        console.log();
        console.log(`player controller: ${Player.getControllerRotation()}`);
        console.log();
        console.log(`current ArmLength: ${this._main.springArm.length}`);
        console.log(`spring arm world Transform position: ${this._main.springArm.worldTransform.position}`);
        console.log(`spring arm world Transform rotation: ${this._main.springArm.worldTransform.rotation}`);
        console.log(`spring arm relative Transform position: ${this._main.springArm.localTransform.position}`);
        console.log(`spring arm relative Transform rotation: ${this._main.springArm.localTransform.rotation}`);
    }

    private trySetArmLength(length: number,
                            smooth: boolean = true,
                            duration: number = Nolan.mediumSpeed,
                            easingFunction: EasingFunction | CubicBezierBase = Nolan.normalBezier) {
        if (!smooth) {
            this.releaseArmLengthFlow();
            this._main.springArm.length = length;
            return;
        }
        this._armLengthFlow.to(
            length,
            duration,
            easingFunction);
    }

    private trySetArmPositionY(positionY: number,
                               smooth: boolean = true,
                               duration: number = Nolan.mediumSpeed,
                               easingFunction: EasingFunction | CubicBezierBase = Nolan.normalBezier) {
        if (!smooth) {
            this.releaseCameraLocationPositionY();
            this._main.springArm.localTransform.position =
                GToolkit.newWithY(
                    this._main.springArm.localTransform.position,
                    positionY);
            return;
        }
        this._cameraLocationPositionYFlow.to(
            positionY,
            duration,
            easingFunction);
    }

    private trySetControllerRotate(direction: Vector,
                                   smooth: boolean = true,
                                   duration: number = Nolan.mediumSpeed,
                                   easingFunction: EasingFunction | CubicBezierBase = Nolan.normalBezier) {
        this.releaseControllerRotateTask();
        if (!smooth) {
            this._controllerRotateTask = null;
            Player.setControllerRotation(
                Rotation.fromVector(direction),
            );
            return;
        }

        this._controllerRotateTask = Waterween.to(
            () => Player.getControllerRotation().toQuaternion(),
            (val) => Player.setControllerRotation(GToolkit.newWithX(val.toRotation(), 0)),
            direction,
            duration,
            undefined,
            easingFunction instanceof CubicBezierBase ? easingFunction.bezier : easingFunction,
            Quaternion.slerp,
        );
    }

    /**
     * 释放 ArmLength 任务.
     */
    public releaseArmLengthFlow() {
        this._armLengthFlow.pause();
    }

    /**
     * 释放 ArmLocationPositionY 任务.
     */
    public releaseCameraLocationPositionY() {
        this._cameraLocationPositionYFlow.pause();
    }

    /**
     * 释放 ControllerRotate 任务.
     */
    public releaseControllerRotateTask() {
        if (this._controllerRotateTask) {
            this._controllerRotateTask.destroy();
        }
        this._controllerRotateTask = null;
    }
}