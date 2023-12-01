import { Delegate } from "../delegate/Delegate.js";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * A function taking one argument and returning a boolean result.
 * TArg void default.
 */
type Predicate<TArg = void> = (arg: TArg) => boolean;

/**
 * A function taking one argument and returning void.
 * TArg void default.
 */
type Action<TArg = void> = (arg: TArg) => void;

interface ConditionCheck<TEvent> {
    /**
     * 条件检查.
     * @param condition
     */
    when(condition: Predicate<TEvent>): Transaction<TEvent>;
}

/**
 * 状态.
 */
export class State<TEvent> implements ConditionCheck<TEvent> {
    /**
     * 进入 委托.
     */
    public onEnter: SimpleDelegate<void> = new SimpleDelegate<void>();

    /**
     * 退出 委托.
     */
    public onExit: SimpleDelegate<void> = new SimpleDelegate<void>();

    /**
     * 存活 委托.
     */
    public onUpdate: SimpleDelegate<number> = new SimpleDelegate<number>();

    /**
     * State name.
     */
    public readonly name: string;

    /**
     * State outgoing transactions.
     */
    public readonly outgoing: Array<Transaction<TEvent>> = [];

    /**
     * State 所属的 Region 集合.
     */
    public readonly regions: Set<Region<TEvent>> = new Set<Region<TEvent>>();

    public constructor(name: string) {
        this.name = name;
    }

    /**
     * 添加 进入 委托.
     * @param action
     */
    public addEnter(action: Action): this {
        this.onEnter.add(action);
        return this;
    }

    /**
     * 添加 进入 委托.
     * @desc short for {@link addEnter}
     * @param action
     */
    public aE(action: Action): this {
        return this.addEnter(action);
    }

    /**
     * 移除 进入 委托.
     * @param action
     */
    public removeEnter(action: Action): this {
        this.onEnter.remove(action);
        return this;
    }

    /**
     * 移除 进入 委托.
     * @desc short for {@link removeEnter}
     * @param action
     */
    public rE(action: Action): this {
        return this.removeEnter(action);
    }

    /**
     * 添加 退出 委托.
     * @param action
     */
    public addExit(action: Action): this {
        this.onExit.add(action);
        return this;
    }

    /**
     * 添加 退出 委托.
     * @desc short for {@link addExit}
     * @param action
     */
    public aEx(action: Action): this {
        return this.addExit(action);
    }

    /**
     * 移除 退出 委托.
     * @param action
     */
    public removeExit(action: Action): this {
        this.onExit.remove(action);
        return this;
    }

    /**
     * 移除 退出 委托.
     * @desc short for {@link removeExit}
     * @param action
     */
    public rEx(action: Action): this {
        return this.removeExit(action);
    }

    /**
     * 添加 存活 委托.
     * @param action
     */
    public addUpdate(action: Action<number>): this {
        this.onUpdate.add(action);
        return this;
    }

    /**
     * 添加 存活 委托.
     * @desc short for {@link addUpdate}
     * @param action
     */
    public aU(action: Action<number>): this {
        return this.addUpdate(action);
    }

    /**
     * 移除 存活 委托.
     * @param action
     */
    public removeUpdate(action: Action<number>): this {
        this.onUpdate.remove(action);
        return this;
    }

    /**
     * 移除 存活 委托.
     * @desc short for {@link removeUpdate}
     * @param action
     */
    public rU(action: Action<number>): this {
        return this.removeUpdate(action);
    }

    public when(condition: Predicate<TEvent>): Transaction<TEvent> {
        return new Transaction<TEvent>(this).when(condition);
    }

    /**
     * 评估状态.
     * @param event
     */
    public evaluate(event: TEvent): State<TEvent> | Region<TEvent> | undefined {
        const transition = this.getTransaction(event);

        return transition?.destination;
    }

    /**
     * 进入 State.
     * @friend {@link FiniteStateMachine}
     * @friend {@link Region}
     */
    public enter() {
        this.onEnter.invoke();
    }

    /**
     * 退出 State.
     * @friend {@link FiniteStateMachine}
     */
    public exit() {
        this.onExit.invoke();
        this.regions.forEach(region => region.exit(this));
    }

    /**
     * 调用 onUpdate.
     * @param deltaTime
     * @friend {@link FiniteStateMachine}
     */
    public update(deltaTime: number) {
        this.onUpdate.invoke(deltaTime);
    }

    private getTransaction(event: TEvent): Transaction<TEvent> | undefined {
        let regionTransaction: Transaction<TEvent> = undefined;

        for (const region of this.regions) {
            if (region.outgoing.find(transaction => {
                if (transaction.evaluate(event)) {
                    regionTransaction = transaction;
                    return true;
                }
            }) !== undefined) break;
        }

        return regionTransaction ?? this.outgoing.find(transaction => transaction.evaluate(event));
    }
}

/**
 * 区域.
 */
export class Region<TEvent> implements ConditionCheck<TEvent> {
    /**
     * Region name.
     */
    public readonly name: string;

    /**
     * Region outgoing transactions.
     */
    public readonly outgoing: Array<Transaction<TEvent>> = [];

    /**
     * 下属 State 集合.
     */
    public readonly subStates: Set<State<TEvent>> = new Set<State<TEvent>>();

    public constructor(name: string) {
        this.name = name;
    }

    private _history: State<TEvent> = null;

    /**
     * 上次退出 Region 的历史 State.
     */
    public get history(): State<TEvent> {
        return this._history;
    }

    public when(condition: Predicate<TEvent>): Transaction<TEvent> {
        return new Transaction<TEvent>(this).when(condition);
    }

    /**
     * 包含 State.
     * @param states
     */
    public include(...states: State<TEvent>[]): this {
        states.forEach(state => {
            if (!this._history) {
                this._history = state;
            }
            state.regions.add(this);
            this.subStates.add(state);
        });

        return this;
    }

    /**
     * 进入 Region.
     * @friend {@link FiniteStateMachine}
     */
    public enter() {
        this._history.enter();
    }

    /**
     * 退出 Region.
     * @param from 退出前状态.
     * @friend {@link State}
     */
    public exit(from: State<TEvent>) {
        this._history = from;
    }
}

/**
 * 转换.
 */
export class Transaction<TEvent> {
    public source: State<TEvent> | Region<TEvent>;

    public destination: State<TEvent> | Region<TEvent> = null;

    constructor(source: State<TEvent> | Region<TEvent>) {
        this.source = source;

        this.source.outgoing.push(this);
    }

    when(condition: Predicate<TEvent>): this {
        this.condition = condition;

        return this;
    }

    to(destination: State<TEvent> | Region<TEvent>) {
        this.destination = destination;

        return this;
    }

    evaluate(trigger: TEvent): boolean {
        return this.destination && this.condition(trigger);
    }

    private condition: Predicate<TEvent> = () => true;
}

/**
 * Finite State Machine.
 * 有限自动状态机 (FSM).
 * @desc 一种基于状态的行为设计模式.
 * @desc 针对状态定义转换条件.
 * @desc 允许搭配响应式数据使用.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.0.3b
 */
export default class FiniteStateMachine<TEvent> {
    /**
     * 根状态.
     */
    public readonly root: State<TEvent>;

    public constructor(root: State<TEvent>) {
        this.root = root;
        this._current = root;
        this.root.onEnter.invoke();
    }

    private _current: State<TEvent>;

    /**
     * 当前状态.
     */
    public get current(): State<TEvent> {
        return this._current;
    }

    /**
     * 重置到根状态.
     */
    public reset() {
        if (this._current === this.root) return;
        this._current.onExit.invoke();
        this._current = this.root;
        this._current.onEnter.invoke();
    }

    /**
     * 评估 条件.
     * @desc 当条件发生变化时 将自动进入新 State.
     * @desc 连锁的. 进入新 State  直到该 State 无法再进入下一个满足条件的 State.
     * @param event
     */
    public evaluate(event: TEvent): boolean {
        let result = false;
        while (true) {
            let next: State<TEvent> | Region<TEvent> = this._current.evaluate(event);
            if (!next) {
                break;
            }

            if (next === this._current) {
                break;
            }

            this._current.exit();
            next.enter();
            this._current = next instanceof Region ? next.history : next;
            result = true;
        }
        return result;
    }

    /**
     * 调用当前状态的 {@link State.onUpdate} 存活委托.
     * @param deltaTime
     */
    public update(deltaTime: number) {
        this._current?.update(deltaTime);
    }
}