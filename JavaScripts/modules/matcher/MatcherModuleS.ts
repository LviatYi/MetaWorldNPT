import MatcherModuleC from "./MatcherModuleC";
import MatcherModuleData from "./MatcherModuleData";
import MatcherConditionBase from "./MatcherConditionBase";

/**
 * 匹配监视 Module Server.
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
export default class MatcherModuleS extends ModuleS<MatcherModuleC, MatcherModuleData> {
    /**
     * 匹配条件监视映射.
     *  - key 游戏 ID.
     *  - value 匹配条件监视.
     * @private
     */
    private _gameConditionMapper: Map<number, MatcherConditionBase> = new Map<number, MatcherConditionBase>();

    /**
     * 当匹配成功时调用.
     * param1: gameId
     */
    public onSuccess: Action = new Action();

    /**
     * 当任何角色加入匹配时调用.
     * param1: gameId
     * param2: playerId
     */
    public onMatch: Action = new Action();

    /**
     * 当任何角色取消匹配时调用.
     * param1: gameId
     * param2: playerId
     */
    public onCancelMatch: Action = new Action();

//region MetaWorld Event
    protected onAwake(): void {
        super.onAwake();
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

    /**
     * 匹配条件.
     * @param gameId 游戏 ID.
     */
    public getCondition(gameId: number): MatcherConditionBase {
        return this._gameConditionMapper.get(gameId);
    }

    /**
     * @param gameId 游戏 ID.
     * @param condition 设定 匹配条件.
     */
    public setCondition(gameId: number, condition: MatcherConditionBase) {
        this._gameConditionMapper[gameId] = condition;
    }

    /**
     * 注册游戏.
     * 用于添加 匹配条件 监视.
     * @param gameId
     * @param condition
     */
    public registerGame(gameId: number, condition: MatcherConditionBase) {
        this._gameConditionMapper[gameId] = condition;
    }

    /**
     * 刷新可匹配性.
     * 当存在新可匹配队列时调用此函数 使等待队列进入匹配.
     * @param gameId
     */
    public refreshMatchable(gameId: number) {
        if (!this.hasGame(gameId)) {
            return;
        }
        const condition = this._gameConditionMapper.get(gameId);
        while (this.isMatchable(gameId)) {
            const id = condition.waitingQueue.shift();
            this.tryStartMatch(gameId, id);
        }
    }

    /**
     * 是否 可匹配的.
     *  false 时需匹配.
     * @param gameId
     */
    public isMatchable(gameId: number) {
        if (this.hasGame(gameId)) {
            return this._gameConditionMapper.get(gameId).isMatchable;
        } else {
            return false;
        }
    }

    /**
     * 尝试匹配.
     * 当无法加入匹配队列时排队.
     * @param gameId
     * @param playerId
     */
    public tryStartMatch(gameId: number, playerId: number) {
        if (!this.hasGame(gameId)) {
            return;
        }

        if (!this._gameConditionMapper.get(gameId).isMatchable()) {
            this._gameConditionMapper.get(gameId).waitingQueue.push(playerId);
        } else {
            this.onMatch.call(gameId, playerId);
            if (this._gameConditionMapper.get(gameId).isMatchSuccess) {
                this.onSuccess.call(gameId);
            }
        }
    }

    /**
     * 尝试 取消匹配.
     * @param gameId
     * @param playerId
     */
    public tryCancelMatch(gameId: number, playerId: number) {
        const waitingIndex: number = this._gameConditionMapper.get(gameId).waitingQueue.indexOf(playerId);
        if (waitingIndex !== -1) {
            this._gameConditionMapper.get(gameId).waitingQueue.splice(waitingIndex, 1);
        } else {
            this.onCancelMatch.call(gameId, playerId);
        }
    }

    /**
     * 是否 已注册游戏.
     * @param gameId
     * @private
     */
    private hasGame(gameId: number): boolean {
        return this._gameConditionMapper.has(gameId);
    }

//region Net Method

    /**
     * 加入匹配.
     */
    public net_tryStartMatch(gameId: number): void {
        this.tryStartMatch(gameId, this.currentPlayerId);
    }

    /**
     * 取消匹配.
     */
    public net_tryCancelMatch(gameId: number): void {
        this.tryCancelMatch(gameId, this.currentPlayerId);
    }

    /**
     * 查询可匹配状态.
     *  false 当需排队.
     * @param gameId
     */
    public net_queryMatchable(gameId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.isMatchable(gameId)) {
                resolve(true);
            } else {
                reject();
            }
        });
    }

    /**
     * 查询进度文本.
     * @param gameId
     * @param playerId
     */
    public net_getProcessText(gameId: number, playerId: number): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.hasGame(gameId)) {
                const condition = this._gameConditionMapper.get(gameId);
                if (condition.isMatchable()) {
                    resolve(`${condition.currentMatchCount}/${condition.matchCountFloor}`);
                } else {
                    resolve(`${condition.waitingIndex(playerId)}/${condition.matchCountFloor}`);
                }
            } else {
                reject();
            }
        });
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}