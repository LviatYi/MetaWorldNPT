import CameraSystem = Gameplay.CameraSystem;
import Character = Gameplay.Character;
import CameraRotationMode = Gameplay.CameraRotationMode;
import Easing, {EasingFunction} from "../easing/Easing";
import ITweenTask from "../waterween/ITweenTask";
import AccessorTween from "../waterween/Waterween";

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
 * @version 0.0.3
 */
export default class Nolan {
    private _main: CameraSystem;

    private _character: Character;

    private _originRotationMode: CameraRotationMode;

    private _currentTask: ITweenTask<unknown>;

    private _taskElapsed: number;

    private _taskLastUpdateElapsed: number;

    private get character(): Character {
        if (!this._character) {
            this._character = Gameplay.getCurrentPlayer().character;
        }
        return this._character;
    }

    /**
     * 摄像机当前朝向.
     *
     * 当无挂载摄像机时返回 null.
     */
    public get currentDirection(): Type.Vector {
        if (this._main) {
            return this._main.transform.getForwardVector();
        }
        return null;
    }

    constructor() {
        Gameplay.asyncGetCurrentPlayer().then((value) => {
            this._character = value.character;
            this._main = this._character.cameraSystem;
        });
    }

    public attach(camera: CameraSystem) {
        this._main = camera;
    }

    /**
     * Look at the position.
     * @param position
     */
    public lookAt(position: Type.Vector) {

    }

    /**
     * Look at the direction.
     * @param direction
     */
    public lookToward(direction: Type.Vector) {

    }

    /**
     * 环绕拍摄.
     * @param axis 环绕轴.
     * @param angle 环绕角.
     * @param duration 运镜时长 ms.
     * @param easingFunction 补间函数. default {@link Easing.easeInOutSine}
     */
    public surroundShot(axis: Type.Vector, angle: number, duration: number = 1e3, easingFunction: EasingFunction = Easing.easeInOutSine) {
        this.releaseTask();
        this.takeCamera();

        this._currentTask = AccessorTween.to(
            () => {
                return {
                    elapsed: 0
                };
            }, (val) => {
                const transform = this._main.cameraSystemRelativeTransform;
                transform.rotate(axis, angle * (val.elapsed - this._taskLastUpdateElapsed));
                this._main.cameraSystemRelativeTransform = transform;
                this._taskLastUpdateElapsed = val.elapsed;
            },
            {elapsed: 1},
            duration,
            {
                elapsed: 0
            },
            easingFunction
        );
    }

    /**
     * 推进 / 拉远.
     * @param dist 移动距离. 负值为推进.
     * @param duration 运镜时长 ms.
     * @param easingFunction 补间函数. default {@link Easing.easeInOutSine}
     */
    public zoom(dist: number, duration: number = 1e3, easingFunction: EasingFunction = Easing.easeInOutSine) {
        this.releaseTask();
        this.takeCamera();

        this._currentTask = AccessorTween.to(
            () => {
                return {
                    elapsed: 0
                };
            }, (val) => {
                this._main.targetArmLength += dist * (val.elapsed - this._taskLastUpdateElapsed);
                this._taskLastUpdateElapsed = val.elapsed;
            },
            {elapsed: 1},
            duration,
            {
                elapsed: 0
            },
            easingFunction
        );
    }

    /**
     * 接管 Camera.
     * @private
     */
    private takeCamera() {
        this._main.cameraRotationMode = CameraRotationMode.RotationFixed;
    }

    /**
     * 交还 Camera
     * @private
     */
    private returnCamera() {
        this._main.cameraRotationMode = CameraRotationMode.RotationControl;
    }

    /**
     * 释放任务.
     * @private
     */
    private releaseTask() {
        if (this._currentTask) {
            AccessorTween.destroyTweenTask(this._currentTask);
        }
        this._currentTask = null;
        this._taskLastUpdateElapsed = 0;
    }

    public test() {
        this.zoom(500, 2e3);
    }

    public logCameraState() {
        console.log(`⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄`);
        console.log(`current CameraMode: ${this._main.currentCameraMode}`);
        console.log(`current RotationMode: ${this._main.cameraRotationMode}`);
        console.log(`current LocationMode: ${this._main.cameraLocationMode}`);

        console.log(`camera world Transform location: ${this._main.cameraWorldTransform.location}`);
        console.log(`camera relative Transform location: ${this._main.cameraRelativeTransform.location}`);
        console.log(`camera world Transform rotation: ${this._main.cameraWorldTransform.rotation}`);
        console.log(`camera relative Transform rotation: ${this._main.cameraRelativeTransform.rotation}`);

        console.log(`camera system world Transform location: ${this._main.cameraSystemWorldTransform.location}`);
        console.log(`camera system relative Transform location: ${this._main.cameraSystemRelativeTransform.location}`);
        console.log(`camera system world Transform rotation: ${this._main.cameraSystemWorldTransform.rotation}`);
        console.log(`camera system relative Transform rotation: ${this._main.cameraSystemRelativeTransform.rotation}`);
    }
}