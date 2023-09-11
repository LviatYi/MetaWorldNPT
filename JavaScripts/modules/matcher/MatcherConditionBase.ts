import {Getter} from "../../dependency/accessor/Getter";

/**
 * 匹配条件接口.
 * 用以判断匹配状态
 *  - 是否 匹配成功.
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
export default abstract class MatcherConditionBase {
    /**
     * 等候队列.
     * 元素为 playerId.
     */
    public readonly waitingQueue: number[] = [];

    /**
     * 匹配条件下限.
     */
    public matchCountFloor: number;

    /**
     * 当前匹配队列.
     * bitwise 只读的.
     * 元素为 playerId.
     */
    public currentMatchQueue: Getter<number[]>;

    /**
     * 是否 允许匹配.
     *  - false 需排队.
     */
    public isMatchable: Getter<boolean>;

    /**
     * 是否 匹配成功.
     */
    public abstract get isMatchSuccess(): boolean;

    constructor(matchCountFloor: number, currentMatchQueue: Getter<number[]>, isMatchable: Getter<boolean>) {
        this.matchCountFloor = matchCountFloor;
        this.currentMatchQueue = currentMatchQueue;
        this.isMatchable = isMatchable;
    }

    /**
     * 当前匹配人数.
     */
    public currentMatchCount(): number {
        return this.currentMatchQueue().length;
    }

    /**
     * 排队序号.
     * @param playerId
     */
    public waitingIndex(playerId: number): number {
        return this.waitingQueue.indexOf(playerId);
    }
}