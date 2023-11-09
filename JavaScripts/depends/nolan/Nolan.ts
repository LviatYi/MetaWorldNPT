import Character = mw.Character;
import CameraRotationMode = mw.CameraRotationMode;
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
 * @version 0.1.0a
 */
export default class Nolan {
//region Constant
    public static readonly NORMAL_ARM_LENGTH_VELOCITY = 0.25;

    public static get armMovementBezier() {
        return new CubicBezier(.3, 0, .7, 1);
    };

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _main: Camera;

    private _character: Character;

//region Config
//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _controllerRotateTask: AdvancedTweenTask<Quaternion>;

    private _armLengthTask: FlowTweenTask<number>;

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
    constructor() {
        Player.asyncGetLocalPlayer().then((value) => {
            this._character = value.character;
            this.init();
        });
    }

    private init() {
        this._main = Camera.currentCamera;

        this._armLengthTask = Waterween.flow(
            () => {
                return this._main.springArm.length;
            },
            (val) => {
                this._main.springArm.length = val;
            },
            0.5e3,
            new CubicBezier(.3, 0, .6, 1),
        );
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Getter
    public get armLength(): number {
        return this._main.springArm.length;
    }

//endregion

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
    public lookToward(direction: Vector, isHorizontal: boolean = true, smooth: boolean = false) {
        this.releaseTask();
        if (smooth) {
            this._controllerRotateTask = Waterween.to(
                () => Player.getControllerRotation().toQuaternion(),
                (val) => Player.setControllerRotation(val.toRotation()),
                Rotation.fromVector(direction).toQuaternion(),
                1e3,
                undefined,
                Easing.easeInOutSine,
                Quaternion.slerp,
            );
        } else {
            Player.setControllerRotation(
                isHorizontal ?
                    new Rotation(0, 0, Rotation.fromVector(direction).z) :
                    Rotation.fromVector(direction),
            );
        }

    }

    /**
     * 环绕拍摄.
     * @param axis 环绕轴.
     * @param angle 环绕角.
     * @param duration 运镜时长 ms.
     * @param easingFunction 补间函数. default {@link Easing.easeInOutSine}
     */
    public surroundShot(axis: Vector, angle: number, duration: number = 1e3, easingFunction: EasingFunction = Easing.easeInOutSine) {
        this.releaseTask();

        const dest = GToolkit.rotateVector(Player.getControllerRotation().rotateVector(Vector.forward), axis, angle).toRotation();

        this._controllerRotateTask = Waterween.to(
            () => Player.getControllerRotation().toQuaternion(),
            (val) => Player.setControllerRotation(val.toRotation()),
            dest.toQuaternion(),
            duration,
            undefined,
            easingFunction,
            Quaternion.slerp,
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
    public zoom(dest: number, duration: number = undefined, easingFunction: EasingFunction | CubicBezierBase = undefined) {
        this.releaseTask();

        this._armLengthTask.to(dest, duration, easingFunction);
    }

    /**
     * 交还 Camera
     * @private
     */
    public returnCamera() {
        this._main.rotationMode = CameraRotationMode.RotationControl;
    }

    /**
     * 释放任务.
     * @private
     */
    private releaseTask() {
        if (this._controllerRotateTask) {
            Waterween.destroyTweenTask(this._controllerRotateTask);
        }
        this._controllerRotateTask = null;
    }

    public test() {
        this.lookToward(
            new Vector(10, 5, 10),
            false,
            true);
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
}