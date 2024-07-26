import { NodeRetStatus } from "../node/NodeRetStatus";
import Gtk from "gtoolkit";

export class Environment<N extends object = object> {
    /**
     * 黑板.
     */
    private _blackboard: Map<string | undefined, Map<string, unknown>> = new Map();

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
     * @param envVariables - 环境变量.
     */
    public constructor(public envVariables?: object | undefined) {
    }

    public get(k: string): unknown {
        return this.innerGet(undefined, k);
    }

    public set(k: string, v: unknown): boolean {
        return this.innerSet(undefined, k, v);
    }

    public selfGet(selfKey: string, k: string): unknown | undefined {
        return this.innerGet(selfKey, k);
    }

    public selfSet(selfKey: string, k: string, v: unknown): boolean {
        return this.innerSet(selfKey, k, v);
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
}