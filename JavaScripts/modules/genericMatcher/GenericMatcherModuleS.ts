import GenericMatcherModuleC from "./GenericMatcherModuleC";
import GenericMatcherModuleData from "./GenericMatcherModuleData";

/**
 * 加入检查器.
 *  - id item id.
 */
type PushChecker = (id: number) => boolean;

/**
 * 匹配策略 枚举.
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
enum MatchStrategyTypes {
    /**
     * 默认.
     */
    Default = 0,

    /**
     * 正向轮流.
     *  - 轮流队伍人数增加.
     *  - 最后补充缺位人数.
     */
    ForwardTurns = 1
}

/**
 * 匹配队列.
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
class MatcherQueue {
    /**
     * 队列.
     */
    private _queue: Set<number> = new Set<number>();

    /**
     * 队列人数.
     */
    public get size(): number {
        return this._queue.size;
    }

    /**
     * 添加至队列.
     * @param id
     */
    public push(id: number): boolean {
        if (this._queue.has(id)) {
            // 已存在.
            return false;
        }

        for (const checker of this._pushChecker) {
            if (!checker(id)) {
                //未通过准入检查.
                return false;
            }
        }

        this._queue.add(id);
        return true;
    }

    /**
     * 从队列移除.
     * @param id
     */
    public remove(id: number): boolean {
        if (this._queue.has(id)) {
            return this._queue.delete(id);
        }

        // 不存在.
        return false;
    }

    /**
     * 是否 id 已存在.
     * @param id
     */
    public has(id: number): boolean {
        return this._queue.has(id);
    }

    /**
     * 检查器.
     */
    private _pushChecker: PushChecker[] = [];

    /**
     * 添加检查器.
     * @param checker
     */
    public addChecker(checker: PushChecker | PushChecker[]): boolean {
        if (Array.isArray(checker)) {
            let result: boolean = true;
            for (const checkerElem of checker) {
                result &&= this.addChecker(checkerElem);
            }
            return result;
        } else {
            if (this._pushChecker.indexOf(checker) !== -1) {
                return false;
            } else {
                this._pushChecker.push(checker);
                return true;
            }
        }
    }

    /**
     * 移除检查器.
     * @param checker
     */
    public removeChecker(checker: PushChecker): boolean {
        if (this._pushChecker.indexOf(checker) === -1) {
            return false;
        } else {
            this._pushChecker.splice(this._pushChecker.indexOf(checker), 1);
            return true;
        }
    }
}

/**
 * 匹配队列 管理类.
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
class MatcherQueueManager {
    private _queues: MatcherQueue[] = [];

    /**
     * 队列容量.
     */
    public queueCapacity: number;

    /**
     * 匹配策略.
     */
    public matcherStrategyType: MatchStrategyTypes = MatchStrategyTypes.Default;

    /**
     * 共有加入检查器.
     */
    private readonly _commonPushCheckers: PushChecker[] = [];

    /**
     * 队伍数量.
     */
    public get queueCount(): number {
        return this._queues.length;
    }

    /**
     * @param count 设定队伍数量. 将影响队列数量.
     */
    public set queueCount(count: number) {
        if (this._queues.length === count) {
            return;
        }

        for (let i = this._queues.length; i < count; i++) {
            const newQueue = new MatcherQueue();
            if (this._queues.length > 0) {
                newQueue.addChecker([...this._commonPushCheckers]);
            }
            this._queues.push(newQueue);
        }
    }

    /**
     * 上次专注队列 index.
     * 维护时机: 当使用 {@link focusIndex} 对指定 queue 进行添加时.
     * @private
     */
    private _lastFocusIndex: number;

    /**
     * 下一个应该置入 id 的队列 index.
     * @return -1 当所有队列满时.
     */
    public get focusIndex(): number {
        switch (this.matcherStrategyType) {
            case MatchStrategyTypes.Default:
            case MatchStrategyTypes.ForwardTurns:
                let focus = this._lastFocusIndex + 1;
                do {
                    if (this._queues[focus].size >= this.queueCapacity) {
                        ++focus;
                    } else {
                        return focus;
                    }
                } while (focus !== this._lastFocusIndex + 1);
                return -1;
            default:
                return -1;
        }
    }

    /**
     * 加入 id.
     * @return false 当已加入任何队伍或满员.
     */
    public add(id: number): boolean {
        for (const queue of this._queues) {
            if (queue.has(id)) {
                // 不允许多队籍.
                return false;
            }
        }

        const focus = this.focusIndex;
        if (focus === -1) {
            return false;
        }

        return this._queues[focus].push(id);
    }

    /**
     * 移除 id.
     */
    public remove(id: number): boolean {
        for (const queue of this._queues) {
            if (queue.remove(id)) {
                return true;
            }
        }

        return false;
    }

    /**
     * id 所在队列 index.
     * @param id -1 当未加入任何队列时.
     */
    public queueIndexOf(id: number): number {
        for (let i = 0; i < this._queues.length; i++) {
            if (this._queues[i].has(id)) {
                return i;
            }
        }

        return -1;
    }

    /**
     * 添加加入检查器.
     * @param checker 加入检查器. 其能够通过 id 指明该 item 是否被允许加入队列.
     * @param queueId default -1. 队列 id. 当 -1 时为公共检查器.
     */
    public addPushChecker(checker: PushChecker, queueId: number = -1) {
        if (queueId === -1) {
            if (this._commonPushCheckers.indexOf(checker) !== -1) {
                return;
            }
            this._commonPushCheckers.push(checker);
            for (const queue of this._queues) {
                queue.addChecker(checker);
            }
        } else if (queueId > 0 && queueId < this._queues.length) {
            this._queues[queueId].addChecker(checker);
        }
    }

    /**
     * 移除加入检查器.
     * @param checker 加入检查器. 其能够通过 id 指明该 item 是否被允许加入队列.
     * @param queueId default -1. 队列 id. 当 -1 时为公共检查器.
     */
    public removePushChecker(checker: PushChecker, queueId: number = -1) {
        if (queueId === -1) {
            if (this._commonPushCheckers.indexOf(checker) === -1) {
                return;
            }
            this._commonPushCheckers.splice(this._commonPushCheckers.indexOf(checker));
            for (const queue of this._queues) {
                queue.removeChecker(checker);
            }
        } else if (queueId > 0 && queueId < this._queues.length) {
            this._queues[queueId].removeChecker(checker);
        }
    }
}

/**
 * Matcher Module Server.
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
export default class GenericMatcherModuleS extends ModuleS<GenericMatcherModuleC, GenericMatcherModuleData> {
    private _queueManager: MatcherQueueManager = new MatcherQueueManager();

//region MetaWorld Event
    protected onAwake(): void {
        super.onAwake();

        this._queueManager.queueCapacity = 5;
        this._queueManager.queueCount = 2;
    }

    protected onStart(): void {
        super.onStart();

//region Member init     
//endregion ------------------------------------------------------------------------------------------ 

//region Event
//endregion ------------------------------------------------------------------------------------------
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    protected onExecute(type: number, ...params: any[]): void {
        super.onExecute(type, ...params);
    }

    protected onPlayerLeft(player: Gameplay.Player): void {
        super.onPlayerLeft(player);
    }

    protected onPlayerEnterGame(player: Gameplay.Player): void {
        super.onPlayerEnterGame(player);
    }

    protected onPlayerJoined(player: Gameplay.Player): void {
        super.onPlayerJoined(player);
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//region Net Method
    /**
     * 加入匹配.
     */
    public net_startMatch(): boolean {
        return this._queueManager.add(this.currentPlayerId);
    }

    /**
     * 取消匹配.
     */
    public net_cancelMatch(): boolean {
        return this._queueManager.remove(this.currentPlayerId);
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}