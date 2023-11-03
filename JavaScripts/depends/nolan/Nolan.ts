import Character = mw.Character;
import CameraRotationMode = mw.CameraRotationMode;
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

    private _currRotation: mw.Rotation = mw.Rotation.zero;

//region Config
    private _armLengthVelocity: number = Nolan.NORMAL_ARM_LENGTH_VELOCITY;
//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _originRotationMode: CameraRotationMode;

    private _currentTask: AdvancedTweenTask<unknown>;

    private _armLengthTask: FlowTweenTask<number>;

    private _taskElapsed: number;

    private _taskLastUpdateElapsed: number;

    /**
     * 摄像机当前朝向.
     *
     * 当无挂载摄像机时返回 null.
     */
    public get forward(): mw.Vector {
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
            new CubicBezier(.5, 0, .8, 1),
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
     */
    public lookAt(position: mw.Vector) {
        this.lookToward(position.clone().subtract(this._main.springArm.worldTransform.position));
    }

    /**
     * Look at the direction.
     * @param direction
     */
    public lookToward(direction: mw.Vector) {
        // this.takeCamera();
        // const q = GToolkit.quaternionBetweenVector(mw.Vector.forward, direction, mw.Vector.up);
        // const transform = this._main.springArm.localTransform.clone();
        // transform.rotation = GToolkit.newWithX(q.toRotation(), 0);
        // this._main.springArm.localTransform = transform;


        const transform = this._main.worldTransform.clone();
        transform.rotation = GToolkit.newWithX(mw.Rotation.fromVector(direction.normalized), 0);
        this._main.worldTransform = transform;
        this.logCameraState();
    }

    /**
     * 环绕拍摄.
     * @param axis 环绕轴.
     * @param angle 环绕角.
     * @param duration 运镜时长 ms.
     * @param easingFunction 补间函数. default {@link Easing.easeInOutSine}
     */
    public surroundShot(axis: mw.Vector, angle: number, duration: number = 1e3, easingFunction: EasingFunction = Easing.easeInOutSine) {
        this.releaseTask();
        this.takeCamera();

        this._currentTask = Waterween.to(
            () => {
                return {
                    elapsed: 0,
                };
            }, (val) => {
                const transform = this._main.springArm.localTransform.clone();
                transform.rotate(axis, angle * (val.elapsed - this._taskLastUpdateElapsed));
                this._main.springArm.localTransform = transform;
                this._taskLastUpdateElapsed = val.elapsed;
            },
            {elapsed: 1},
            duration,
            {
                elapsed: 0,
            },
            easingFunction,
        );
    }

    /**
     * 推进 / 拉远.
     * @param dist 移动距离. 负值为推进.
     * @param avgVelocity 运镜时长 ms.
     * @param easingFunction 补间函数. default {@link Easing.easeInOutSine}
     */
    public zoom(dist: number, avgVelocity: number = undefined, easingFunction: EasingFunction | CubicBezierBase = undefined) {
        this.releaseTask();
        this.takeCamera();

        this._armLengthTask.to(dist, avgVelocity, easingFunction);
    }

    /**
     * 接管 Camera.
     * @private
     */
    public takeCamera() {
        this._main.rotationMode = CameraRotationMode.RotationFixed;
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
        if (this._currentTask) {
            Waterween.destroyTweenTask(this._currentTask);
        }
        this._currentTask = null;
        this._taskLastUpdateElapsed = 0;
    }

    private _rotateX: number = 0;

    public test() {
    }

    public logCameraState() {
        console.log(`⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄ NOLAN SYSTEM ⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄`);
        console.log(`current CharacterPosition: ${this._character.worldTransform.position}`);
        console.log(`current CameraMode: ${this._main.preset}`);
        console.log(`current RotationMode: ${this._main.rotationMode}`);
        console.log(`current LocationMode: ${this._main.positionMode}`);
        console.log(`current ArmLength: ${this._main.springArm.length}`);

        console.log(`camera world Transform position: ${this._main.worldTransform.clone().position}`);
        console.log(`camera relative Transform position: ${this._main.localTransform.clone().position}`);
        console.log(`camera world Transform rotation: ${this._main.worldTransform.clone().rotation}`);
        console.log(`camera relative Transform rotation: ${this._main.localTransform.clone().rotation}`);

        console.log(`camera system world Transform position: ${this._main.springArm.worldTransform.position}`);
        console.log(`camera system relative Transform position: ${this._main.springArm.localTransform.clone().position}`);
        console.log(`camera system world Transform rotation: ${this._main.springArm.worldTransform.rotation}`);
        console.log(`camera system relative Transform rotation: ${this._main.springArm.localTransform.clone().rotation}`);
    }
}