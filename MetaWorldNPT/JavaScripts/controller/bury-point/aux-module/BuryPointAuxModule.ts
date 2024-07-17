import noReply = mwext.Decorator.noReply;
import Log4Ts from "mw-log4ts";
import BuryPointController from "../BuryPointController";

export default class BuryPointAuxModuleData extends mwext.Subdata {
    //@Decorator.persistence()
    //public isSave: bool;
    @Decorator.persistence()
    public lastEnterTime: number = 0;

    @Decorator.persistence()
    public lastStepTime: number[] = [];

    @Decorator.persistence()
    public buryData: object = {};

    /**
     * 是否 当天已进入.
     */
    public isTodayEntered(): boolean {
        const lastEnterTime = new Date(this.lastEnterTime);
        const now = new Date();

        return lastEnterTime.getFullYear() === now.getFullYear() &&
            lastEnterTime.getMonth() === now.getMonth() &&
            lastEnterTime.getDate() === now.getDate();
    }

    /**
     * 是否 当天已进行步骤.
     */
    public isTodayStepDone(index: number): boolean {
        const lastEnterTime = new Date(this.lastStepTime[index] ?? 0);
        const now = new Date();

        return isSameDay(lastEnterTime, now);
    }

    /**
     * 是否 当天已经进行所有步骤.
     * @param maxStep 步骤上限.
     */
    public isTodayAllStepDone(maxStep: number): boolean {
        let result = true;

        for (let i = 0; i < maxStep; ++i) {
            result = result && this.isTodayStepDone(i);
            if (!result) break;
        }

        return result;
    }

    /**
     * 查询 埋点依据.
     * @param {string} eventName
     * @return {D | undefined}
     */
    public queryBuryDataByEventName<D extends object>(eventName: string): D | undefined {
        return this.buryData?.[eventName] as D;
    }

    /**
     * 更新 埋点依据.
     * @param {string} eventName
     * @param {object} data
     * @param {boolean} syncToClient 是否 同步到客户端.
     */
    public updateBuryDataByEventName(eventName: string,
                                     data: object,
                                     syncToClient: boolean = true): void {
        this.buryData[eventName] = data;

        this.save(syncToClient);
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
export class BuryPointAuxModuleC extends mwext.ModuleC<BuryPointAuxModuleS, BuryPointAuxModuleData> {
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
    public updateStepTime(index: number): void {
        if (this.data.isTodayStepDone(index)) return;

        this.server.net_updateStepTime(index);
    }

    /**
     * 获取 Module Data.
     * @return {any}
     */
    public getData() {
        return this.data;
    }

//#region Net Method
    public net_updateEnterTime(time: number): void {
        this.data.lastEnterTime = time;
        this.data.save(false);
    }

    public net_updateStepTime(stepIndex: number, time: number): void {
        this.data.lastStepTime[stepIndex] = time;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export class BuryPointAuxModuleS extends mwext.ModuleS<BuryPointAuxModuleC, BuryPointAuxModuleData> {
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

    protected onPlayerJoined(player: mw.Player): void {
        super.onPlayerJoined(player);
    }

    protected onPlayerEnterGame(player: mw.Player): void {
        super.onPlayerEnterGame(player);

        const time = Date.now();
        const data = this.getPlayerData(player);
        if (data) {
            data.lastEnterTime = time;
            data.save(false);
        }

        this.getClient(player).net_updateEnterTime(time);
    }

    protected onPlayerLeft(player: mw.Player): void {
        super.onPlayerLeft(player);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Method

    /**
     * 更新 进行步骤时间.
     * @param playerId
     * @param index
     */
    public updateStepTime(playerId: number, index: number): void {
        const data = this.getPlayerData(playerId);
        if (!data) return;
        if (data.isTodayStepDone(index)) return;

        const time = Date.now();
        data.lastStepTime[index] = time;
        data.save(false);
        this.getClient(playerId).net_updateStepTime(index, time);
    }

    /**
     * 获取 Module Data.
     * @return {BuryPointAuxModuleData | undefined}
     */
    public getData(player: mw.Player | string | number): BuryPointAuxModuleData | undefined {
        try {
            return this.getPlayerData(player);
        } catch (e) {
            return undefined;
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Net Method

    @noReply()
    net_updateStepTime(index: number) {
        this.updateStepTime(this.currentPlayerId, index);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

function isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

/**
 * 初始化模块.
 */
export function initBuryPointAuxModule() {
    ModuleService.registerModule(BuryPointAuxModuleS,
        BuryPointAuxModuleC,
        BuryPointAuxModuleData);
}

try {
    // Log4Ts.log({name: "BuryPointAuxModule"}, `auto init BuryPointAuxModule`);
    // initBuryPointAuxModule();
    if (mw.SystemUtil.isClient()) {
        const module = mwext.ModuleService.getModule(BuryPointAuxModuleC);
        BuryPointController.getInstance()
            .setQueryBuryDataHandler((player, eventName) => {
                return module?.getData()
                        ?.queryBuryDataByEventName(eventName)
                    ?? undefined;
            });
        BuryPointController.getInstance()
            .setUpdateBuryDataHandler((player, eventName, data) => {
                module?.getData()
                    ?.updateBuryDataByEventName(eventName, data, true);
            });
    }
    if (mw.SystemUtil.isServer()) {
        const module = mwext.ModuleService.getModule(BuryPointAuxModuleS);
        BuryPointController.getInstance()
            .setQueryBuryDataHandler((player, eventName) => {
                return module?.getData(player)
                        ?.queryBuryDataByEventName(eventName)
                    ?? undefined;
            });
        BuryPointController.getInstance()
            .setUpdateBuryDataHandler((player, eventName, data) => {
                module?.getData(player)
                    ?.updateBuryDataByEventName(eventName, data, true);
            });
    }
} catch (e) {
    Log4Ts.error({name: "BuryPointAuxModule"}, e);
}

