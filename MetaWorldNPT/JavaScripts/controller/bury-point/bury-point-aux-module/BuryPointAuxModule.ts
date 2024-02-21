import noReply = mwext.Decorator.noReply;
import { TsCoreGameplayStepStages } from "../bury-info/TsCoreGameplayStep";
import BuryPointController, { BuryInfo } from "../BuryPointController";
import GToolkit from "../../../util/GToolkit";
import Log4Ts from "../../../depend/log4ts/Log4Ts";

export default class BuryPointAuxModuleData extends Subdata {
    //@Decorator.persistence()
    //public isSave: bool;
    @Decorator.persistence()
    public lastEnterTime: number = 0;

    @Decorator.persistence()
    public lastStepTime: number[] = [];

    /**
     * 是否 当天已进入.
     */
    public isTodayEntered(): boolean {
        const lastEnterTime = new Date(this.lastEnterTime);
        const now = new Date();

        return lastEnterTime.getFullYear() === now.getFullYear() && lastEnterTime.getMonth() === now.getMonth() && lastEnterTime.getDate() === now.getDate();
    }

    /**
     * 是否 当天已进行步骤.
     */
    public isTodayStepDone(index: TsCoreGameplayStepStages): boolean {
        const lastEnterTime = new Date(this.lastStepTime[index] ?? 0);
        const now = new Date();

        return lastEnterTime.getFullYear() === now.getFullYear() && lastEnterTime.getMonth() === now.getMonth() && lastEnterTime.getDate() === now.getDate();
    }

    /**
     * 是否 当天已经进行所有步骤.
     */
    public isTodayAllStepDone(): boolean {
        let result = true;

        for (const stage in TsCoreGameplayStepStages) {
            result = result && this.isTodayStepDone(Number(TsCoreGameplayStepStages[stage]));
            if (!result) break;
        }
        return result;
    }
}

/**
 * 埋点辅助 Module.
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
export class BuryPointAuxModuleC extends ModuleC<BuryPointAuxModuleS, BuryPointAuxModuleData> {
//#region MetaWorld Event
    protected onAwake(): void {
        super.onAwake();
    }

    protected onStart(): void {
        super.onStart();

//#region Member init
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Subscribe
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);
    }

    protected onEnterScene(sceneType: number): void {
        super.onEnterScene(sceneType);
    }

    protected onDestroy(): void {
        super.onDestroy();
//#region Event Unsubscribe
        //TODO_LviatYi 
//#endregion ------------------------------------------------------------------------------------------
    }

    protected onExecute(type: number, ...params: any[]): void {
        super.onExecute(type, ...params);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 更新 进行步骤时间.
     * @param index
     */
    public updateStepTime(index: TsCoreGameplayStepStages): void {
        if (this.data.isTodayStepDone(index)) return;

        this.server.net_updateStepTime(index);
    }

    /**
     * 更新 进入游戏时间.
     */
    public updateEnterTime(): void {
        if (this.data.isTodayEntered()) return;

        this.server.net_updateEnterTime();
    }

//#region Net Method
    public net_updateEnterTime(time: number): void {
        this.data.lastEnterTime = time;
        this.data.save(false);
    }

    public net_updateStepTime(stepIndex: TsCoreGameplayStepStages, time: number): void {
        this.data.lastStepTime[stepIndex] = time;
    }

    public net_reportBuryInfo(data: BuryInfo) {
        BuryPointController.getInstance().report(data);
    }

    public net_customReportBuryInfo(eventName: string, desc: string, data: string) {
        BuryPointController.getInstance().customReport(eventName, desc, data);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export class BuryPointAuxModuleS extends ModuleS<BuryPointAuxModuleC, BuryPointAuxModuleData> {
//#region MetaWorld Event
    protected onAwake(): void {
        super.onAwake();
    }

    protected onStart(): void {
        super.onStart();

//#region Member init     
//#endregion ------------------------------------------------------------------------------------------ 

//#region Event Subscribe
//#endregion ------------------------------------------------------------------------------------------
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);
    }

    protected onDestroy(): void {
        super.onDestroy();
//#region Event Unsubscribe
        //TODO_LviatYi 
//#endregion ------------------------------------------------------------------------------------------
    }

    protected onExecute(type: number, ...params: any[]): void {
        super.onExecute(type, ...params);
    }

    protected onPlayerLeft(player: mw.Player): void {
        super.onPlayerLeft(player);
    }

    protected onPlayerEnterGame(player: mw.Player): void {
        super.onPlayerEnterGame(player);
    }

    protected onPlayerJoined(player: mw.Player): void {
        super.onPlayerJoined(player);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Method
    /**
     * 自服务端 报告埋点.
     * 若不指定 playerId, 则随机选择一个客户端协助报告埋点.
     * @param data
     * @param playerId
     */
    public reportBuryInfo(data: BuryInfo, playerId: number = undefined) {
        if (!playerId) {
            playerId = GToolkit.randomArrayItem(Player.getAllPlayers()).playerId;
        }
        if (!playerId) {
            Log4Ts.log(BuryPointAuxModuleS, `there is no player in game.`);
            return;
        }

        this.getClient(playerId).net_reportBuryInfo(data);
    }

    /**
     * 自服务端 报告自定义埋点.
     * 若不指定 playerId, 则随机选择一个客户端协助报告埋点.
     * @param eventName
     * @param desc
     * @param data
     * @param playerId
     */
    public customReportBuryInfo(eventName: string, desc: string, data: string, playerId: number = undefined) {
        if (!playerId) {
            playerId = GToolkit.randomArrayItem(Player.getAllPlayers()).playerId;
        }
        if (!playerId) {
            Log4Ts.log(BuryPointAuxModuleS, `there is no player in game.`);
            return;
        }

        this.getClient(playerId).net_customReportBuryInfo(eventName, desc, data);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Net Method
    @noReply()
    net_updateEnterTime() {
        const time = Date.now();
        this.currentData.lastEnterTime = time;
        this.currentData.save(false);
        this.getClient(this.currentPlayerId).net_updateEnterTime(time);
    }

    @noReply()
    net_updateStepTime(index: TsCoreGameplayStepStages) {
        if (this.currentData.isTodayStepDone(index)) return;

        const time = Date.now();
        this.currentData.lastStepTime[index] = time;
        this.currentData.save(false);
        this.getClient(this.currentPlayerId).net_updateStepTime(index, time);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}