import MatcherConditionBase from "./MatcherConditionBase";
import {Getter} from "../../dependency/accessor/Getter";

/**
 * 匹配 数量满足 条件.
 * 仅当匹配人数与 {@link gameCapacity} 一直时 判定匹配成功.
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
export default class QuantityMeetCondition extends MatcherConditionBase {
    /**
     * 对局游戏人数总容量.
     */
    public gameCapacity: number;

    public get isMatchSuccess(): boolean {
        return this.currentMatchQueue().length === this.gameCapacity;
    }

    constructor(matchCountFloor: number, currentMatchQueue: Getter<number[]>, isMatchable: Getter<boolean>, gameCapacity: number) {
        super(matchCountFloor, currentMatchQueue, isMatchable);
        this.gameCapacity = gameCapacity;
    }
}