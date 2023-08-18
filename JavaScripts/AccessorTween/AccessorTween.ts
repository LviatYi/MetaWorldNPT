import AccessorTweenBehavior from "./AccessorTweenBehavior";
import IAccessorTween, {Getter, Setter} from "./IAccessorTween";
import Easing, {EasingFunction} from "../lab/easing/Easing";

/**
 * Tween Task.
 * A task that describes how a tween works.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @beta
 */
export class TweenTask<T> {
    /**
     * 创建时间戳.
     * @private
     */
    private readonly _createTime: number;
    /**
     * 虚拟开始时间戳.
     * @private
     */
    private _virtualStartTime: number;
    /**
     * 上次暂停时间戳.
     * @private
     */
    private _lastStopTime?: number = undefined;
    private readonly _endTime: number;
    private _startValue: T;
    private readonly _dist: T;
    private readonly _getter: Getter<T>;
    private readonly _setter: Setter<T>;
    private readonly _easingFunc: EasingFunction;
    //TODO_LviatYi 循环任务支持.
    private _isPause: boolean;
    /**
     * 是否 位移性补间.
     *      - true 位移补间. 应将 `_dist` 作为位移处理.
     *      - false 终点补间. 应将 `_dist` 作为终值处理.
     * @private
     */
    private _isMove: boolean;

    /**
     * 是否 任务已 󰄲完成.
     */
    public get isDone(): boolean {
        return this.elapsed >= 1;
    }

    /**
     * 是否 任务已 󰏤暂停.
     */
    public get isPause(): boolean {
        return this._isPause;
    }

    /**
     * 󰏤暂停 补间.
     */
    public pause(): void {
        this._lastStopTime = Date.now();
        this._isPause = true;
    }

    /**
     * 󰐊继续 补间.
     * @param recurve 是否重置动画曲线.
     */
    public continue(recurve: boolean = false): void {
        if (recurve) {
            this._virtualStartTime = Date.now();
            this._startValue = this._getter();
        } else if (this._isPause) {
            this._virtualStartTime += Date.now() - this._lastStopTime;
        }

        this._lastStopTime = undefined;
        this._isPause = false;
    }

    /**
     * 经过比率.
     */
    public get elapsed(): number {
        return (Date.now() - this._virtualStartTime) / (this._endTime - this._virtualStartTime);
    }

    /**
     * 调用任务.
     * 除非强制 当 󰄲完成(done) 或 󰏤暂停(stop) 时 不调用 setter.
     *
     * @param force 强制调用. default is false.
     */
    public call(force: boolean = false): void {
        if (!force && (this.isDone || this._isPause)) {
            return;
        }

        this._setter(dataTween(this._startValue, this._dist, this.elapsed, this._isMove));
    }

    constructor(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, startValue: T = undefined, isMove: boolean = false, easing: EasingFunction = Easing.linear) {
        let startTime = Date.now();
        this._createTime = startTime;
        this._endTime = startTime + duration;
        this._startValue = startValue ? startValue : getter();
        this._dist = dist;
        this._getter = getter;
        this._setter = setter;
        this._isMove = isMove;
        this._easingFunc = easing;
    }
}

/**
 * Accessor Tween.
 * A Tween utility driven by Getter & Setter.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 0.2.0b
 * @beta
 */
class AccessorTween implements IAccessorTween {
    private _tasks: TweenTask<any>[] = new Array<TweenTask<any>>();
    private _behavior: AccessorTweenBehavior;
    private _isReady: boolean = false;

    get behavior() {
        if (!this._isReady) {
            Core.Script.spawnScript(AccessorTweenBehavior).then(script => {
                this._behavior = script;
                this._isReady = true;
            });
        }

        return this._behavior;
    }

    public to<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number): TweenTask<T> {
        if (duration < 0) {
            return;
        }
        return this.addTweenTask(getter, setter, dist, duration);
    }

    public move<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number): TweenTask<T> {
        if (duration < 0) {
            return;
        }
        return this.addTweenTask(getter, setter, dist, duration, true, undefined);
    }

    /**
     * add tween task.
     *
     * @param getter
     * @param setter
     * @param dist
     * @param duration
     * @param isMove
     * @param startVal
     * @private
     */
    private addTweenTask<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, isMove: boolean = false, startVal: T = undefined) {
        this.touchBehavior();
        let newTask = new TweenTask(getter, setter, dist, duration, startVal, isMove);
        this._tasks.push(newTask);
        return newTask;
    }

    /**
     * 移除任务.
     * @param task
     */
    public removeTweenTask<T>(task: TweenTask<T>): boolean {
        let index = this._tasks.indexOf(task);
        if (index > -1) {
            this._tasks.splice(index, 1);
            return true;
        }
        return false;
    }

    private touchBehavior() {
        this.behavior;
    }

    /**
     * 强制刷新.
     */
    public update() {
        for (let i = 0; i < this._tasks.length; i++) {
            this._tasks[i].call();
        }
    }
}

export default new AccessorTween();

/**
 * Calculate tween data according to elapse time.
 *
 * @param startVal val start.
 * @param distVal val end.
 * @param elapsed elapse time.
 * @param isOffset the `distVal` is an offset, not an endValue.
 * @param easingFunc easing function. default {@link Easing.linear}
 */
function dataTween<T>(startVal: T, distVal: T, elapsed: number, isOffset: boolean = false, easingFunc: EasingFunction = Easing.linear): T {
    //TODO_LviatYi 补间函数应按基本类型 参数化、客制化

    if (typeof startVal === "number" && typeof distVal === "number") {
        return ((distVal - (isOffset ? 0 : startVal)) * easingFunc(elapsed) + startVal) as T;
    }

    if (typeof startVal === "string" && typeof distVal === "string") {
        //TODO_LviatYi 待定更花式的 string 补间.
        return easingFunc(elapsed) < 0.5 ? startVal : distVal;
    }

    if (typeof startVal === "boolean" && typeof distVal === "boolean") {
        return easingFunc(elapsed) < 0.5 ? startVal : distVal;
    }

    if (Array.isArray(startVal) && Array.isArray(distVal)) {
        //TODO_LviatYi 待定更花式的 Array 补间.
        return easingFunc(elapsed) < 0.5 ? startVal : distVal;
    }

    if (typeof startVal == "object" && typeof distVal == "object") {
        let result = clone(startVal);
        for (const valKey in startVal) {
            result[valKey] = dataTween(startVal[valKey], distVal[valKey], elapsed, isOffset, easingFunc);
        }
        return result;
    }

    return null;
}

/**
 * Clone enumerable properties.
 * @param data
 */
function clone<T>(data: T): T {
    return Object.assign({}, data);
}