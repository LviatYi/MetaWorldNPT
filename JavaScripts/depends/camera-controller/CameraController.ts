import {bezierCurve} from "./CommonUtil";

export default class CameraController {
    static instance = new CameraController();

    private _originLoc: Type.Vector = null;

    private _originRot: Type.Rotation = null;

    private _originVec: Type.Vector = null;

    private _originFov: number = 45;

    private _isStartCameraMove: boolean = false;

    set startCameraMove(v) {
        this._isStartCameraMove = v;
    }

    get startCameraMove() {
        return this._isStartCameraMove;
    }

    get transform() {
        return this.getCameraSystem().cameraWorldTransform;
    }

    set transform(v) {
        this.getCameraSystem().cameraWorldTransform = v;
    }

    get location() {
        return this.transform.location;
    }

    set location(v) {
        const trans = this.transform;
        trans.location = v;
        this.transform = trans;
    }

    get rotation() {
        return this.transform.rotation;
    }

    set rotation(v) {
        const trans = this.transform;
        trans.rotation = v;
        this.transform = trans;
    }

    public get fov() {
        return this.getCameraSystem().cameraFOV;
    }

    public set fov(v) {
        this.getCameraSystem().cameraFOV = v;
    }


    initCamera() {
        // 摄像机初始化有延迟需要等待
        setTimeout(() => {
            const trans = this.getCameraSystem().cameraRelativeTransform;
            this._originLoc = trans.location;
            this._originRot = trans.rotation;
            this._originFov = this.getCameraSystem().cameraFOV;
            this._originVec = this.location.subtract(this.getCharacter().worldLocation);

            TimeUtil.onEnterFrame.add(this.updateCamera, this);
        }, 1000);
    }

    /**
     * 设置摄像机bezier移动
     * @param points
     * @param time
     * @param easingFunction
     * @param target
     * @returns
     */
    setCameraBezierTo(points: Type.Vector[], time: number, easingFunction?: TweenUtil.EasingFunction, target?: Type.Vector) {
        return new TweenUtil.Tween({t: 0})
            .to({t: 1}, time)
            .easing(easingFunction)
            .onUpdate(obj => {
                const p: Type.Vector = bezierCurve(points, obj.t);
                const transform = this.getCameraSystem().cameraWorldTransform;
                transform.location = p;
                if (target) transform.rotation = Type.Rotation.fromVector(target.clone().subtract(p));
                this.transform = transform;
            });
    }

    /**
     * 通过两点设置相机
     * @param start
     * @param end
     */
    setCameraByTwoPoint(start: Type.Vector, end: Type.Vector) {
        const trans = this.getCameraSystem().cameraWorldTransform;
        trans.location = start;
        trans.rotation = Type.Rotation.fromVector(end.clone().subtract(start));
        this.transform = trans;
    }

    /**
     * 摄像机移动
     * @param start
     * @param end
     * @param time
     * @param easingFunction
     * @returns tween
     */
    cameraMoveByTwoPoint(start: Type.Vector, end: Type.Vector, time: number, easingFunction?: TweenUtil.EasingFunction) {
        return new TweenUtil.Tween({position: start})
            .to({position: end}, time)
            .easing(easingFunction)
            .onUpdate(obj => {
                this.location = obj.position;
            });
    }

    getCameraSystem() {
        return Gameplay.getCurrentPlayer().character.cameraSystem;
    }

    resetCameraSystem() {
        this.getCameraSystem().cameraRelativeTransform =
            new Type.Transform(this._originLoc, this._originRot, new Type.Vector(1, 1, 1));
        this.getCameraSystem().cameraFOV = this._originFov;
    }

    private _vec = Type.Vector.zero;

    private _lerpVal = 0.018;

    private updateCamera() {
        if (this._isStartCameraMove) {
            if (!Type.Vector.equals(this.getCameraSystem().cameraRelativeTransform.location, this._originLoc, 1)) {
                const movePoint = this.getCharacter().worldLocation.add(this._originVec);
                Type.Vector.lerp(this.location, movePoint, this._lerpVal, this._vec);
                this.location = this._vec;
            } else {
                this._isStartCameraMove = false;
            }
        }
    }

    private getCharacter() {
        return Gameplay.getCurrentPlayer().character;
    }


    setCameraMode(mode: Gameplay.CameraProjectionMode) {
        this.getCameraSystem().cameraProjectionMode = Gameplay.CameraProjectionMode.Orthographic;
    }
}