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
 */
export class TweenTask<T> {
    private readonly _startTime: number;
    private readonly _endTime: number;
    private readonly _startValue: T;
    private readonly _endValue: T;
    private readonly _setter: Setter<T>;
    //TODO_LviatYi 循环任务支持
    private _isStop: boolean;
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
    public get isStop(): boolean {
        return this._isStop;
    }

    /**
     * 󰏤暂停 补间.
     */
    public stop(): void {
        this._isStop = true;
    }

    /**
     * 󰐊继续 补间.
     */
    public continue(): void {
        this._isStop = false;
    }

    /**
     * 经过比率.
     */
    public get elapsed(): number {
        return (Date.now() - this._startTime) / (this._endTime - this._startTime);
    }

    /**
     * 调用任务.
     * 除非强制 当 󰄲完成(done) 或 󰏤暂停(stop) 时 不调用 setter.
     *
     * @param force 强制调用. default is false.
     */
    public call(force: boolean = false): void {
        if (!force && (this.isDone || this._isStop)) {
            return;
        }

        this._setter(dataTween(this._startValue, this._endValue, this.elapsed));
    }

    constructor(getter: Getter<T>, setter: Setter<T>, endValue: T, duration: number, startValue: T = undefined, isMove: boolean = false) {
        let startTime = Date.now();
        this._startTime = startTime;
        this._endTime = startTime + duration;
        this._startValue = startValue ? startValue : getter();
        this._endValue = endValue;
        this._setter = setter;
        this._isMove = isMove;
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
 * @version 0.1.0
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
     * @param origin
     * @private
     */
    private addTweenTask<T>(getter: Getter<T>, setter: Setter<T>, dist: T, duration: number, isMove: boolean = false, origin: T = undefined) {
        this.touchBehavior();
        let newTask = new TweenTask(getter, setter, dist, duration, origin, isMove);
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
 * @param endVal val end.
 * @param elapsed elapse time.
 * @param easingFunc easing function. default {@link Easing.linear}
 * @param isOffset the `endVal` is an offset, not an endValue.
 */
function dataTween<T>(startVal: T, endVal: T, elapsed: number, easingFunc: EasingFunction = Easing.linear, isOffset: boolean = false): T {
    //TODO_LviatYi 补间函数应按基本类型 参数化、客制化

    if (typeof startVal === "number" && typeof endVal === "number") {
        return ((endVal - (isOffset ? 0 : startVal)) * easingFunc(elapsed) + startVal) as T;
    }

    if (typeof startVal === "string" && typeof endVal === "string") {
        //TODO_LviatYi 待定更花式的 string 补间.
        return easingFunc(elapsed) < 0.5 ? startVal : endVal;
    }

    if (typeof startVal === "boolean" && typeof endVal === "boolean") {
        return easingFunc(elapsed) < 0.5 ? startVal : endVal;
    }

    if (Array.isArray(startVal) && Array.isArray(endVal)) {
        //TODO_LviatYi 待定更花式的 Array 补间.
        return easingFunc(elapsed) < 0.5 ? startVal : endVal;
    }

    if (typeof startVal == "object" && typeof endVal == "object") {
        let result = clone(startVal);
        for (const valKey in startVal) {
            result[valKey] = dataTween(startVal[valKey], endVal[valKey], elapsed, easingFunc);
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