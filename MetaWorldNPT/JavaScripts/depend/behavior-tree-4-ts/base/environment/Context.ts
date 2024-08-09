import Gtk from "gtoolkit";
import Log4Ts, { DebugLevels, evaluateLogLevel, LogFuncTypes, LogString } from "mw-log4ts";

export type TagType = string | number | object | undefined;

export type EventHandler = (...args: unknown[]) => void;

export type InnerLogSrcType = "tree" | "inner-node";

type LogSrcType = InnerLogSrcType | "node";

/**
 * 上下文基类.
 *
 * @desc 允许自定义上下文
 * @desc 但必须继承自 Context 的类
 * @desc 以包含必需的信息.
 */
export class Context {
    public elapsedTime: number = 0;

    public lastUpdateTime: number = 0;

    /**
     * 调试等级.
     */
    public debugLevel: DebugLevels;

    /**
     * 是否 由行为树 覆写 Id.
     */
    public overrideId: boolean;

    private _eventMap: Map<string, Map<TagType, EventHandler>> = new Map();

    constructor(debugLevel: DebugLevels = DebugLevels.Dev,
                overrideId: boolean = false,
                patientForSameContext: number = 5e3) {
        this.debugLevel = debugLevel;
        this.overrideId = overrideId;
        this.patientForSameContext = patientForSameContext;
    }

    /**
     * 更新上下文.
     * @param params 参数列表.
     * @friendly {@link Environment}. 其余类型禁止调用.
     */
    public update(...params: unknown[]): void;

    /**
     * 更新上下文.
     * @desc 更新时机 每帧.
     * @param {number} dt 距上次调用经过时间. ms
     * @friendly {@link Environment}. 其余类型禁止调用.
     */
    public update(dt: number): void {
        this.lastUpdateTime = this.elapsedTime;
        this.elapsedTime += dt;
    }

    /**
     * 监听一个事件.
     * @param {string} event
     * @param {EventHandler} callback
     * @param {TagType} tag
     */
    public on(event: string, callback: EventHandler, tag?: TagType) {
        Gtk.tryGet(this._eventMap, event, () => new Map())
            .set(tag, callback);
    }

    /**
     * 发布一个事件.
     * @param {string} event
     * @param args
     */
    public dispatch(event: string, ...args: unknown[]) {
        this.innerLog(
            "tree",
            `dispatch event: ${event}.`,
            () => ` rgs: ${JSON.stringify(args)}`);
        const map = this._eventMap.get(event);
        if (map) {
            map.forEach((callback) => {
                try {
                    callback(...args);
                } catch (e) {
                    this.innerError("tree", `error occurs in event ${event} callback.`, e);
                }
            });
        }
    }

    /**
     * 发布一个事件 至指定 tag.
     * @param {string} event
     * @param {TagType} tag 仅该 tag 下允许接收此事件.
     * @param args
     */
    public dispatchTo(event: string, tag: TagType, ...args: unknown[]) {
        this.innerLog(
            "tree",
            `dispatch event ${event} to tag: ${tag}.`,
            () => ` rgs: ${JSON.stringify(args)}`);
        const map = this._eventMap.get(event);
        if (map) {
            const callback = map.get(tag);
            try {
                callback?.(...args);
            } catch (e) {
                this.innerError("tree", `error occurs in event ${event} callback.`, e);
            }
        }
    }

    /**
     * 取消监听一个事件.
     * @param {string} event
     * @param {TagType} tag 指定 tag.
     *  - undefined 取消所有该事件的监听.
     */
    public off(event: string, tag?: TagType) {
        this.innerLog("tree", `cancel event ${event}${tag ? ` for tag: ${tag}.` : ""}.`);
        const map = this._eventMap.get(event);
        if (map) {
            if (tag) {
                map.delete(tag);
                if (map.size <= 0) this._eventMap.delete(event);
            } else {
                this._eventMap.delete(event);
            }
        }
    }

    /**
     * 取消指定 tag 所监听的事件.
     * @param {TagType} tag.
     */
    public offByTag(tag: TagType) {
        this.innerLog("tree", `cancel all event for tag: ${tag}.`);
        this._eventMap.forEach(item => {
            item.delete(tag);
        });
    }

    /**
     * @desc 仅推荐行为树自身服务调用. 将会绕过同文耐心检查.
     * @internal 内部的.
     * @param {LogSrcType} type
     * @param {LogString} m
     */
    public innerLog(type: LogSrcType, ...m: LogString[]): void {
        if (!evaluateLogLevel(LogFuncTypes.Log, this.debugLevel)) return;

        Log4Ts.log({name: "BehaviorTree " + this.getLogHeader(type)}, ...m);
    }

    public log(...m: LogString[]): void {
        if (!evaluateLogLevel(LogFuncTypes.Log, this.debugLevel) ||
            this.patientCheckValid && !this.patientCheck(m.join(""))) return;

        Log4Ts.log({name: "BehaviorTree " + this.getLogHeader("node")}, ...m);
    }

    /**
     * @desc 仅推荐行为树自身服务调用. 将会绕过同文耐心检查.
     * @internal 内部的.
     * @param {LogSrcType} type
     * @param {LogString} m
     */
    public innerWarn(type: LogSrcType, ...m: LogString[]): void {
        if (!evaluateLogLevel(LogFuncTypes.Warn, this.debugLevel)) return;

        Log4Ts.warn({name: "BehaviorTree " + this.getLogHeader(type)}, ...m);
    }

    public warn(...m: LogString[]): void {
        if (!evaluateLogLevel(LogFuncTypes.Warn, this.debugLevel) ||
            this.patientCheckValid && !this.patientCheck(m.join(""))) return;

        Log4Ts.warn({name: "BehaviorTree " + this.getLogHeader("node")}, ...m);
    }

    /**
     * @desc 仅推荐行为树自身服务调用. 将会绕过同文耐心检查.
     * @internal 内部的.
     * @param {LogSrcType} type
     * @param {LogString} m
     */
    public innerError(type: LogSrcType, ...m: LogString[]): void {
        if (!evaluateLogLevel(LogFuncTypes.Error, this.debugLevel)) return;

        Log4Ts.error({name: "BehaviorTree " + this.getLogHeader(type)}, ...m);
    }

    public error(...m: LogString[]): void {
        if (!evaluateLogLevel(LogFuncTypes.Error, this.debugLevel) ||
            this.patientCheckValid && !this.patientCheck(m.join(""))) return;

        Log4Ts.error({name: "BehaviorTree " + this.getLogHeader("node")}, ...m);
    }

    private getLogHeader(type: LogSrcType): string {
        switch (type) {
            case "tree":
                /**
                 * Behavior Tree.
                 */
                return "B.T.";
            case "inner-node":
                /**
                 * (Inner) Node Instance.
                 */
                return "N.I.";
            case "node":
            default:
                /**
                 * Node (in) Running.
                 */
                return "N.R.";
        }
    }

    private _logContextCache: Map<string, number> = new Map();

    /**
     * 同文日志耐心间隔. ms
     * 0 时关闭.
     */
    public patientForSameContext = 5e3;

    /**
     * Patient for same log check.
     * @desc 同文耐心检查.
     * @param {string} context
     * @param {number} now
     * @return {boolean} pass state.
     * @private
     */
    private patientCheck(context: string, now?: number): boolean {
        let t = this._logContextCache.get(context);
        now = now ?? Date.now();
        if (t !== undefined && now - t < this.patientForSameContext) {
            return false;
        }

        this._logContextCache.set(context, now);
        return true;
    }

    private get patientCheckValid() {
        return this.patientForSameContext > 0;
    }
}

/**
 * 上下文更新参数.
 */
export type ContextUpdateParams<T> = T extends { update: (...param: infer P) => void } ? P : never;