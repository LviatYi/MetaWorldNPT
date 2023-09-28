import {Getter} from "../../accessor/Getter";
import {Setter} from "../../accessor/Setter";

/**
 * TweenTask Base.
 */
export default abstract class TweenTaskBase<T> {
    public static readonly DEFAULT_TWO_PHASE_TWEEN_BORDER = 0.5;

    protected readonly _getter: Getter<T>;

    protected readonly _setter: Setter<T>;

    /**
     * 是否 任务已 󰄲完成.
     * 当任务 是 重复 播放的 isDone 永远不会为 true. 但仍能调用 {@link onDone}.
     */
    public isDone: boolean = false;

    /**
     * 是否 任务已 󰏤暂停.
     */
    public abstract get isPause(): boolean;

    /**
     * 两相值 Tween 变化边界.
     * @protected
     */
    protected _twoPhaseTweenBorder: number;

    /**
     * 创建时间戳.
     * @private
     */
    protected readonly _createTime: number;

    protected constructor(
        getter: Getter<T>,
        setter: Setter<T>,
        createTime: number,
        twoPhaseTweenBorder: number) {
        this._getter = getter;
        this._setter = setter;
        this._createTime = createTime;
        this._twoPhaseTweenBorder = twoPhaseTweenBorder;
    }
}