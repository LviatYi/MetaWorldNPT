import Gtk from "gtoolkit";
import Log4Ts, { LogString } from "mw-log4ts";

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

    public useDebug: boolean;

    private _eventMap: Map<string, Map<TagType, EventHandler>> = new Map();

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
        const map = this._eventMap.get(event);
        if (map) {
            map.forEach((callback) => {
                try {
                    callback(...args);
                } catch (e) {
                    Log4Ts.log(Context,
                        `error occurs in event callback.`,
                        e);
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
        const map = this._eventMap.get(event);
        if (map) {
            const callback = map.get(tag);
            if (callback) {
                callback(...args);
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
        this._eventMap.forEach(item => {
            item.delete(tag);
        });
    }

    public log(...m: LogString[]) {
        if (!this.useDebug) return;

        Log4Ts.log({name: "BehaviorTree"}, ...m);
    }

    public warn(...m: LogString[]) {
        if (!this.useDebug) return;

        Log4Ts.warn({name: "BehaviorTree"}, ...m);
    }

    public error(...m: LogString[]) {
        if (!this.useDebug) return;

        Log4Ts.error({name: "BehaviorTree"}, ...m);
    }
}

/**
 * 上下文更新参数.
 */
export type ContextUpdateParams<T> = T extends { update: (...param: infer P) => void } ? P : never;