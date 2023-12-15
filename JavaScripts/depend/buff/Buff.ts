/**
 * Buff 类型.
 * 应保证唯一性.
 */
declare type BuffType = number;

/**
 * Buff 基类.
 * @desc Buff 是一种具有挂载者 {@link BuffBase.target} 与施加者 {@link BuffBase.caster} 的一组行为承诺.
 * @desc Buff 为管理一组行为承诺 提供便利.
 * @desc 其由施加者或不指定施加者发起 由挂载者接受 并具有在承诺的时机调用的行为.
 * @desc Buff 存在端依赖于 RoleCtrl.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @author maopan.liao
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.3.0b
 */
export default abstract class BuffBase<RoleCtrl> {
//#region Constant
    public static readonly NORMAL_INTERVAL = 1000 / 15;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member

    private _startTime: number = Date.now();

    /**
     * Buff 开始时间.
     */
    public get startTime(): number {
        return this._startTime;
    }

    private set startTime(value: number) {
        this._startTime = value;
    }

    private _times: number = 0;

    /**
     * 间隔刷新时 刷新总次数.
     */
    public get times(): number {
        return this._times;
    }

    private _enable: boolean = true;

    /**
     * enable.
     * @desc 为 false 时 不会触发 {@link BuffBase.onInterval}.
     */
    public get enable(): boolean {
        return this._enable;
    }

    public set enable(value: boolean) {
        this._enable = value;
    }

    protected readonly _suppressBuffs: BuffType[] = [];

    /**
     * 抑制 Buff.
     * @desc 当此 Buff 存在时 将使受抑制 Buff {@link BuffBase.enable} 无效化.
     * @protected
     */
    public get suppressBuffs() {
        return [...this._suppressBuffs];
    }

    /**
     * 是否 为抑制者.
     */
    public get isSuppresser(): boolean {
        return this._suppressBuffs.length > 0;
    }

    protected readonly _killBuffs: BuffType[] = [];

    /**
     * 扼杀 Buff.
     * @desc 当此 Buff 存在时 将使受扼杀 Buff 移除或无法加入.
     * @protected
     */
    public get killBuffs() {
        return [...this._killBuffs];
    }

    /**
     * 是否 为扼杀者.
     */
    public get isKiller(): boolean {
        return this._killBuffs.length > 0;
    }


//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config
    /**
     * Buff 类型.
     */
    public abstract type: BuffType;

    /**
     * 施加者.
     */
    public caster: RoleCtrl = null;

    /**
     * 挂载者.
     */
    public target: RoleCtrl = null;

    /**
     * Buff 存活策略.
     - 小于0  一次性.
     - 等于0  永久.
     - 大于0  持续时间 in ms.
     */
    public survivalStrategy: number = 0;

    /**
     * buff 刷新时间间隔 in ms.
     *  - <=0 不间隔刷新.
     *  - >0 间隔刷新.
     * */
    public intervalTime: number = 0;

//TODO_LviatYi 可叠加性.
    /**
     * 可叠加性.
     * @desc 未实装.
     */
    public stackable: boolean = false;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    protected constructor(
        caster: RoleCtrl,
        parent: RoleCtrl,
        survivalStrategy: number = 0,
        intervalTime: number = 0,
        stackable: boolean = false,
    ) {
        this.caster = caster;
        this.target = parent;
        this.survivalStrategy = survivalStrategy;
        this.intervalTime = intervalTime;
        this.stackable = stackable;
    }

//#region Controller

    public start() {
        this.onStart && this.onStart();
    }

    public intervalThink() {
        if (this.onInterval && this._enable) {
            ++this._times;
            this.onInterval && this.onInterval();
        }
    }

    public refresh() {
        this._startTime = Date.now();
        this._times = 0;
        this.onRefresh && this.onRefresh();
    }

    public remove() {
        this.onRemove && this.onRemove();
        this.caster = null;
        this.target = null;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Callback
    /**
     * Buff 添加时 调用.
     */
    public onStart: () => void = null;

    /**
     * Buff 满足间隔刷新条件时 调用.
     */
    public onInterval: () => void = null;

    /**
     * Buff 刷新时 调用.
     *  当试图添加 **同型** Buff 时 进行刷新.
     *  同型 指具有相同的 {@link BuffBase.type} 与 {@link BuffBase.caster}.
     */
    public onRefresh: () => void = null;

    /**
     * Buff 移除时 调用.
     */
    public onRemove: () => void = null;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}