import { NodeRetStatus } from "../node/NodeRetStatus";
import Gtk from "gtoolkit";
import { Context, ContextUpdateParams } from "./Context";

export class Environment<C extends Context = Context, N extends object = object> {
    /**
     * 黑板.
     */
    private _blackboard: Map<string | undefined, Map<string, unknown>> = new Map();

    private _context: C;

    /**
     * 上下文.
     * @type {C}
     */
    public get context(): Readonly<C> {
        return this._context;
    }

    /**
     * 元素栈.
     */
    private _stack: N[] = [];

    /**
     * 上次栈中节点返回值.
     */
    public lastStackRet: NodeRetStatus | undefined = undefined;

    /**
     * 是否 中断.
     */
    public isAbort: boolean = false;

    /**
     * Environment 构造函数.
     * @param context - 环境变量.
     */
    public constructor(context?: C | undefined) {
        this._context = (context ?? new Context()) as C;
    }

    /**
     * 更新 Context 的上下文信息.
     * @param params inferred by ContextUpdateParams<C>.
     */
    public updateContext<C extends Context>(...params: ContextUpdateParams<C>): void {
        this._context.update(...params);
    }

//#region Blackboard
    /**
     * 获取 公共黑板属性.
     * @param {string} k
     * @return {unknown}
     */
    public get(k: string): unknown {
        return this.innerGet(undefined, k);
    }

    /**
     * 设置 公共黑板属性.
     * @param {string} k
     * @param v
     * @return {boolean} 是否 设置成功 以下情况视为失败：
     *   - 未变化.
     */
    public set(k: string, v: unknown): boolean {
        return this.innerSet(undefined, k, v);
    }

    /**
     * 获取 私有黑板属性.
     * @param {string} selfKey
     * @param {string} k
     * @return {unknown}
     */
    public selfGet(selfKey: string, k: string): unknown | undefined {
        return this.innerGet(selfKey, k);
    }

    /**
     * 设置 私有黑板属性.
     * @param {string} selfKey
     * @param {string} k
     * @param v
     * @return {boolean} 是否 设置成功 以下情况视为失败：
     *   - 未变化.
     */
    public selfSet(selfKey: string, k: string, v: unknown): boolean {
        return this.innerSet(selfKey, k, v);
    }

    /**
     * 根据成员路径 获取 公共黑板属性.
     * @desc 成员路径 是一个以 `.` 隔开的字符串.
     * @desc 当 k 为空时，path 的首个元素会被认为是 k，且该元素弹出.
     * @desc ---
     * @desc 当 path 为空时，直接返回 k 指向的值.
     * @desc 否则返回 path 指向的对象的属性值.
     * @desc ---
     * @desc 如，path 为 `a.b` 或 `.a.b`：
     * @desc 当 k 不为空时，将获取 k 指向的值 obj，返回 obj.a.b.
     * @desc 当 k 为空时，将获取 a 指向的值 obj，返回 obj.b.
     * @desc obj 必须为对象或空.
     * @param {string|undefined} k
     * @param {string} path
     * @return {unknown}
     */
    public getValByPath(k: string | undefined, path: string): unknown | undefined {
        return this.innerGetValByPath(undefined, k, path);
    }

    /**
     * 根据成员路径 设置 公共黑板属性.
     * @desc 成员路径 是一个以 `.` 隔开的字符串.
     * @desc 当 k 为空时，path 的首个元素会被认为是 k，且该元素弹出.
     * @desc ---
     * @desc 当 path 为空时，直接设置 k 指向的值.
     * @desc 否则设置 path 指向的对象的属性值.
     * @desc ---
     * @desc 如，path 为 `a.b` 或 `.a.b`：
     * @desc 当 k 不为空时，将获取 k 指向的值 obj，设置 obj.a.b.
     * @desc 当 k 为空时，将获取 a 指向的值 obj，设置 obj.b.
     * @desc obj 必须为对象或空.
     * @param {string|undefined} k
     * @param {string} path
     * @param val
     * @return {boolean} 是否 设置成功 以下情况视为失败：
     *   - 未变化.
     *   - obj 或某个成员为简单类型.
     *   - 索引路径无效.
     */
    public setValByPath(k: string | undefined, path: string, val: unknown): boolean {
        return this.innerSetValByPath(undefined, k, path, val);
    }

    /**
     * 根据成员路径 获取 私有黑板属性.
     * @desc 成员路径 是一个以 `.` 隔开的字符串.
     * @desc 当 k 为空时，path 的首个元素会被认为是 k，且该元素弹出.
     * @desc ---
     * @desc 当 path 为空时，直接返回 k 指向的值.
     * @desc 否则返回 path 指向的对象的属性值.
     * @desc ---
     * @desc 如，path 为 `a.b` 或 `.a.b`：
     * @desc 当 k 不为空时，将获取 k 指向的值 obj，返回 obj.a.b.
     * @desc 当 k 为空时，将获取 a 指向的值 obj，返回 obj.b.
     * @desc obj 必须为对象或空.
     * @param {string} selfKey
     * @param {string|undefined} k
     * @param {string} path
     * @return {unknown}
     */
    public getSelfValByPath(selfKey: string, k: string | undefined, path: string): unknown | undefined {
        return this.innerGetValByPath(selfKey, k, path);
    }

    /**
     * 根据成员路径 设置 私有黑板属性.
     * @desc 成员路径 是一个以 `.` 隔开的字符串.
     * @desc 当 k 为空时，path 的首个元素会被认为是 k，且该元素弹出.
     * @desc ---
     * @desc 当 path 为空时，直接设置 k 指向的值.
     * @desc 否则设置 path 指向的对象的属性值.
     * @desc ---
     * @desc 如，path 为 `a.b` 或 `.a.b`：
     * @desc 当 k 不为空时，将获取 k 指向的值 obj，设置 obj.a.b.
     * @desc 当 k 为空时，将获取 a 指向的值 obj，设置 obj.b.
     * @desc obj 必须为对象或空.
     * @param {string} selfKey
     * @param {string|undefined} k
     * @param {string} path
     * @param val
     * @return {boolean} 是否 设置成功 以下情况视为失败：
     *   - 未变化.
     *   - obj 或某个成员为简单类型.
     *   - 索引路径无效.
     */
    public setSelfValByPath(selfKey: string, k: string | undefined, path: string, val: unknown): boolean {
        return this.innerSetValByPath(selfKey, k, path, val);
    }

    private innerGetValByPath(inner: string | undefined,
                              k: string | undefined,
                              path: string): unknown | undefined {
        const relPath: string[] = path.split(".");
        if (Gtk.isNullOrEmpty(k)) {
            if (Gtk.isNullOrEmpty(relPath)) return undefined;
            k = relPath[0];
            relPath.shift();
        }

        const o = this.innerGet(inner, k);

        return getValByPath(o, relPath);
    }

    private innerSetValByPath(inner: string | undefined, k: string | undefined, path: string, val: unknown): boolean {
        const relPath: string[] = path.split(".");
        if (Gtk.isNullOrEmpty(k)) {
            if (Gtk.isNullOrEmpty(relPath)) return false;
            k = relPath[0];
            relPath.shift();
        }

        let o = this.innerGet(inner, k);

        if (typeof o === "object") return setValByPath(o, relPath, val);
        else return this.innerSet(inner, k, o);
    }

    private innerGet(inner: string | undefined, k: string): unknown | undefined {
        return this._blackboard.get(inner)?.get(k) ?? undefined;
    }

    private innerSet(inner: string | undefined, k: string, v: unknown): boolean {
        const map = Gtk.tryGet(this._blackboard,
            inner,
            () => new Map<string, unknown>());

        if (map.get(k) === v) return false;

        map.set(k, v);
        return true;
    }

    /**
     * 转换黑板内容为 string.
     * @return {string}
     */
    public blackboardToString(): string {
        let retObj = {};
        for (let [inner, map] of this._blackboard) {
            if (inner === undefined) inner = "__GLOBAL__";
            let c = {};

            for (const [k, v] of map) {
                c[k] = v;
            }
            retObj[inner] = c;
        }

        return JSON.stringify(retObj);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Call Stack
    public push(node: N): void {
        this._stack.push(node);
    }

    public pop(): N | undefined {
        return this._stack.pop();
    }

    public last(): N | undefined {
        return this._stack[this._stack.length - 1];
    }

    public empty(): boolean {
        return this._stack.length === 0;
    }

    public get size(): number {
        return this._stack.length;
    }

    public clear() {
        this._stack.length = 0;
        this._blackboard.clear();
        this.lastStackRet = undefined;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export function getValByPath<T = unknown>(object: unknown, path: string[]): T {
    if (Gtk.isNullOrEmpty(path)) return object as T;

    let p = object;
    for (let i = 0; i < path.length; ++i) {
        if (Gtk.isNullOrEmpty(path[i])) continue;
        if (typeof p !== "object" || p == null) return undefined;
        p = p[path[i]];
    }

    return p as T;
}

export function setValByPath(object: unknown, path: string[], val: unknown): boolean {
    if (Gtk.isNullOrUndefined(object) ||
        typeof object !== "object" ||
        Gtk.isNullOrEmpty(path)) return false;

    let p = object;
    let l = p;
    for (let i = 0; i < path.length - 1; ++i) {
        if (Gtk.isNullOrEmpty(path[i])) continue;
        p = l[path[i]];
        if (typeof p !== "object" || p == null) {
            p = l[path[i]] = {};
        }
        l = p;
    }

    p[path[path.length - 1]] = val;
    return true;
}