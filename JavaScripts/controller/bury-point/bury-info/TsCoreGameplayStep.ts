import {BuryInfo} from "../BuryPointController";
import {BuryEventDefine} from "../bury-event/BuryEventDefine";
export enum TsCoreGameplayStepStages {

    /**
     * 成功进入一次子游戏对局
     */
    SuccessEnterSubGame = 1,
    /**
     * 完成一次对局结算
     */
    FinishSettle,
    /**
     * 触发NPC交互
     */
    InteractiveNpc,
    /**
     * 触发场景交互物交互
     */
    InteractSceneInteraction,
    /**
     * 播放一次表情
     */
    PlayExpression,
    /**
     * 播放一次动作
     */
    PlayMotion,
    /**
     * 成功完成一次挖宝
     */
    OpenTreasure,
    /**
     * 成功完成一次滑雪
     */
    SkiFinish,
    /**
     * 进行一次换装
     */
    DressFinish,
}

export class TsCoreGameplayStep extends BuryInfo {
//#region Constant
    private static readonly DESC = "ts游戏核心循环步骤";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public buryName: string = BuryEventDefine.TsCoreStep;

    public buryDescription: string = TsCoreGameplayStep.DESC;

    public coregameplay_step: number;

    constructor(coreGameplayStep: TsCoreGameplayStepStages) {
        super();
        this.coregameplay_step = coreGameplayStep;
    }
}