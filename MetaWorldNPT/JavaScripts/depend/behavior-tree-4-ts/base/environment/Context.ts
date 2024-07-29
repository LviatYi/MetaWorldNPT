import Gtk from "gtoolkit";
import { LogString } from "mw-log4ts";
import Log4Ts from "mw-log4ts/Log4Ts";

export type TagType = string | number | object | undefined;

export type EventHandler = (...args: unknown[]) => void;

/**
 * 上下文基类.
 *
 * @desc 允许自定义上下文
 * @desc 但必须继承自 Context 的类
 * @desc 以包含必需的信息.
 */
export class Context {
    public elapsedTime: number = 0;

    /**
     * 是否 启用调试.
     */
    public useDebug: boolean;

    /**
     * 是否 由行为树 覆写 Id.
     */
    public overrideId: boolean;

    private _eventMap: Map<string, Map<TagType, EventHandler>> = new Map();

    constructor(useDebug: boolean = false,
                overrideId: boolean = false) {
        this.useDebug = useDebug;
        this.overrideId = overrideId;
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
        this.log(
            `dispatch event: ${event}.`,
            () => ` rgs: ${JSON.stringify(args)}`);
        const map = this._eventMap.get(event);
        if (map) {
            map.forEach((callback) => {
                try {
                    callback(...args);
                } catch (e) {
                    this.error(`error occurs in event ${event} callback.`, e);
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
        this.log(
            `dispatch event ${event} to tag: ${tag}.`,
            () => ` rgs: ${JSON.stringify(args)}`);
        const map = this._eventMap.get(event);
        if (map) {
            const callback = map.get(tag);
            try {
                callback?.(...args);
            } catch (e) {
                this.error(`error occurs in event ${event} callback.`, e);
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
        this.log(`cancel event ${event}${tag ? ` for tag: ${tag}.` : ""}.`);
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
        this.log(`cancel all event for tag: ${tag}.`);
        this._eventMap.forEach(item => {
            item.delete(tag);
        });
    }

    public log(...m: LogString[]): void {
        if (!this.useDebug) return;

        Log4Ts.log({name: "BehaviorTree"}, ...m);
    }

    public warn(...m: LogString[]): void {
        if (!this.useDebug) return;

        Log4Ts.warn({name: "BehaviorTree"}, ...m);
    }

    public error(...m: LogString[]): void {
        if (!this.useDebug) return;

        Log4Ts.error({name: "BehaviorTree"}, ...m);
    }
}

/**
 * 上下文更新参数.
 */
export type ContextUpdateParams<T> = T extends { update: (...param: infer P) => void } ? P : never;