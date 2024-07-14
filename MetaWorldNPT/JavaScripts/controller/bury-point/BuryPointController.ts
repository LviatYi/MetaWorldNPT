import Gtk, { Singleton } from "gtoolkit";
import { BuryEventInferParams, BuryEventInfo, BuryEventTypes } from "./base/BuryEventDefine";
import { generateBuryEventInfo } from "./base/BuryEventHandler";
import Log4Ts from "mw-log4ts/Log4Ts";

export type ReportHandler = (eventName: string, eventDesc: string, jsonData: string) => void;

/**
 * 查询埋点依据 处理函数.
 */
export type QueryBuryDataHandler = (player: mw.Player, eventName: string) => object | undefined;

/**
 * 更新埋点依据 处理函数.
 */
export type UpdateBuryDataHandler = (player: mw.Player, eventName: string, data: object) => void;

/**
 * 上报埋点参数或参数生成器.
 */
export type ReportParamOrGenerator<T extends BuryEventTypes, D extends object | undefined = undefined> =
    (BuryEventInferParams<T>) | ((data: D | undefined) => BuryEventInferParams<T>);

/**
 * 埋点控制器.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.0.0
 */
export default class BuryPointController extends Singleton<BuryPointController>() {
//#region Constant
    public static readonly REPORT_BURY_EVENT = "__REPORT_BURY_EVENT__";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public reportHandler: ReportHandler | undefined = getDefaultReportHandler();

    public queryBuryDataHandler: QueryBuryDataHandler | undefined;

    public updateBuryDataHandler: UpdateBuryDataHandler | undefined;

    onConstruct() {
        if (mw.SystemUtil.isClient()) {
            mw.Event.addServerListener(BuryPointController.REPORT_BURY_EVENT,
                (eventName: string,
                 eventDesc: string,
                 jsonData: string) => {
                    this.callReport(eventName, eventDesc, jsonData);
                });
        }
    }

    /**
     * 上报埋点事件.
     * @param {T} eventType
     * @param {BuryEventInferParams<T>} params
     * @param {mw.Player | number | string} player 玩家.
     * @return {string}
     */
    public report<T extends BuryEventTypes>(
        eventType: T,
        params: BuryEventInferParams<T>,
        player?: mw.Player | number | string): boolean {
        if (!player) player = mw.SystemUtil.isClient() ? mw.Player.localPlayer : undefined;
        else player = Gtk.queryPlayer(player);

        const info = generateBuryEventInfo(eventType, params);

        return this.allPlatformCallReport(player, info);
    }

    /**
     * 上报埋点事件.
     * @param {T} eventType
     * @param {BuryEventInferParams<T>} params
     * @param {mw.Player | number | string} player 玩家.
     * @return {string}
     */
    public reportCal<T extends BuryEventTypes, D extends object | undefined = undefined>(
        eventType: T,
        params: (data: D | undefined) => BuryEventInferParams<T>,
        player?: mw.Player | number | string): boolean {
        if (!player) player = mw.SystemUtil.isClient() ? mw.Player.localPlayer : undefined;
        else player = Gtk.queryPlayer(player);

        if (!player) {
            Log4Ts.warn(BuryPointController, `cant get player when get data for report.`);
            return false;
        }

        const d = this.innerGetData(player, eventType) as D;
        const p = params(d);

        const info = generateBuryEventInfo(eventType, p);

        return this.allPlatformCallReport(player, info);
    }

    /**
     * 报告自定义埋点.
     * @param eventName 事件名.
     * @param desc 事件描述.
     * @param jsonData Json 数据.
     * @param {mw.Player | number | string} player 玩家.
     */
    public customReport(eventName: string, desc: string, jsonData: string, player?: mw.Player | number | string): boolean {
        if (!mw.SystemUtil.isClient() && mw.SystemUtil.isServer()) {
            if (player) player = Gtk.queryPlayer(player);
            if (!player) {
                Log4Ts.warn(BuryPointController, `cant get player when report in server.`);
                return false;
            }

            mw.Event.dispatchToClient(player as mw.Player,
                BuryPointController.REPORT_BURY_EVENT,
                eventName,
                desc,
                jsonData,
            );

            return true;
        } else {
            try {
                this.callReport(eventName, desc, jsonData);
            } catch (e) {
                Log4Ts.error(BuryPointController, `error occurs when customReport.`, e);
                return false;
            }
        }

        return true;
    }

    /**
     * 获取埋点依据.
     */
    public getBuryData<D extends object>(player: mw.Player, eventName: string): D | undefined {
        return this.innerGetData(player, eventName);
    }

    /**
     * 更新埋点依据.
     * @param {mw.Player} player
     * @param {string} eventName
     * @param {object} data
     */
    public updateBuryData(player: mw.Player, eventName: string, data: object): boolean {
        return this.innerUpdateData(player, eventName, data);
    }

//#region Config
    /**
     * 设置 上报处理函数.
     * @param {ReportHandler} handler
     * @return {this}
     */
    public setReportHandler(handler?: ReportHandler): this {
        if (handler) this.reportHandler = handler;
        else this.reportHandler = getDefaultReportHandler();

        return this;
    }

    /**
     * 设置 查询埋点数据函数.
     * @param {QueryBuryDataHandler} handler
     * @return {this}
     */
    public setQueryBuryDataHandler(handler: QueryBuryDataHandler): this {
        this.queryBuryDataHandler = handler;

        return this;
    }

    /**
     * 设置 更新埋点数据函数.
     * @param {UpdateBuryDataHandler} handler
     * @return {this}
     */
    public setUpdateBuryDataHandler(handler: UpdateBuryDataHandler): this {
        this.updateBuryDataHandler = handler;

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private allPlatformCallReport<T extends BuryEventTypes>(player: mw.Player, info: BuryEventInfo<T>) {
        if (!mw.SystemUtil.isClient() && mw.SystemUtil.isServer()) {
            if (!player) {
                Log4Ts.warn(BuryPointController, `cant get player when report in server.`);
                return false;
            }
            mw.Event.dispatchToClient(player,
                BuryPointController.REPORT_BURY_EVENT,
                info.name,
                info.desc,
                JSON.stringify(info.params),
            );

            return true;
        } else {
            return this.callReport(info.name,
                info.desc,
                JSON.stringify(info.params));
        }
    }

    private callReport(eventName: string, eventDesc: string, jsonData: string): boolean {
        if (!this.reportHandler) return false;

        try {
            this.reportHandler(eventName, eventDesc, jsonData);
        } catch (e) {
            Log4Ts.error(BuryPointController, `error occurs when callReport.`, e);
            return false;
        }

        return true;
    }

    private innerGetData<D extends object>(player: mw.Player, eventName: string): D | undefined {
        return (this.queryBuryDataHandler?.(player, eventName) as D) ?? undefined;
    }

    private innerUpdateData(player: mw.Player, eventName: string, data: object): boolean {
        if (!this.updateBuryDataHandler) return false;

        try {
            this.updateBuryDataHandler(player, eventName, data);
        } catch (e) {
            Log4Ts.error(BuryPointController, `error occurs when updateData.`, e);
            return false;
        }

        return true;
    }
}

/**
 * 默认 上报处理函数.
 * @return {ReportHandler | undefined}
 */
function getDefaultReportHandler(): ReportHandler | undefined {
    return mw.SystemUtil.isClient() ? mw.RoomService.reportLogInfo : undefined;
}
