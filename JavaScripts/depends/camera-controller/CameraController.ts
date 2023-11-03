import { bezierCurve } from "./CommonUtil";

export default class CameraController {
    static instance = new CameraController();

    private _originLoc: mw.Vector = null;

    private _originRot: mw.Rotation = null;

    private _originVec: mw.Vector = null;

    private _originFov: number = 45;

    private _isStartCameraMove: boolean = false;

    set startCameraMove(v) {
        this._isStartCameraMove = v;
    }

    get startCameraMove() {
        return this._isStartCameraMove;
    }

    get transform() {
        return this.getCameraSystem().worldTransform.clone();
    }

    set transform(v) {
        this.getCameraSystem().worldTransform = v;
    }

    get location() {
        return this.transform.position;
    }

    set location(v) {
        const trans = this.transform;
        trans.position = v;
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
        return this.getCameraSystem().fov;
    }

    public set fov(v) {
        this.getCameraSystem().fov = v;
    }


    initCamera() {
        // 摄像机初始化有延迟需要等待
        setTimeout(() => {
            const trans = this.getCameraSystem().localTransform.clone();
            this._originLoc = trans.position;
            this._originRot = trans.rotation;
            this._originFov = this.getCameraSystem().fov;
            this._originVec = this.location.subtract(this.getCharacter().worldTransform.position);

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
    setCameraBezierTo(points: mw.Vector[], time: number, easingFunction?: mw.TweenEasingFunction, target?: mw.Vector) {
        return new mw.Tween({t: 0})
            .to({t: 1}, time)
            .easing(easingFunction)
            .onUpdate(obj => {
                const p: mw.Vector = bezierCurve(points, obj.t);
                const transform = this.getCameraSystem().worldTransform.clone();
                transform.position = p;
                if (target) transform.rotation = mw.Rotation.fromVector(target.clone().subtract(p));
                this.transform = transform;
            });
    }

    /**
     * 通过两点设置相机
     * @param start
     * @param end
     */
    setCameraByTwoPoint(start: mw.Vector, end: mw.Vector) {
        const trans = this.getCameraSystem().worldTransform.clone();
        trans.position = start;
        trans.rotation = mw.Rotation.fromVector(end.clone().subtract(start));
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
    cameraMoveByTwoPoint(start: mw.Vector, end: mw.Vector, time: number, easingFunction?: mw.TweenEasingFunction) {
        return new mw.Tween({position: start})
            .to({position: end}, time)
            .easing(easingFunction)
            .onUpdate(obj => {
                this.location = obj.position;
            });
    }

    getCameraSystem() {
        return Camera.currentCamera;
    }

    resetCameraSystem() {
        this.getCameraSystem().localTransform =
            new mw.Transform(this._originLoc, this._originRot, new mw.Vector(1, 1, 1));
        this.getCameraSystem().fov = this._originFov;
    }

    private _vec = mw.Vector.zero;

    private _lerpVal = 0.018;

    private updateCamera() {
        if (this._isStartCameraMove) {
            if (!mw.Vector.equals(this.getCameraSystem().localTransform.clone().position, this._originLoc, 1)) {
                const movePoint = this.getCharacter().worldTransform.position.add(this._originVec);
                mw.Vector.lerp(this.location, movePoint, this._lerpVal, this._vec);
                this.location = this._vec;
            } else {
                this._isStartCameraMove = false;
            }
        }
    }

    private getCharacter() {
        return Player.localPlayer.character;
    }
}