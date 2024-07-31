import { NodeRetStatus } from "./NodeRetStatus";
import { NodeHolisticDef } from "./NodeHolisticDef";
import { nodeDefMap } from "../registry/RegNodeDef";
import Gtk from "gtoolkit";
import { Environment } from "../environment/Environment";
import { INodeRetInfo } from "./INodeRetInfo";
import { INodeData } from "./INodeData";
import { INodeIns } from "./INodeIns";
import { nodeArgDefMap } from "../registry/RegArgDef";
import { Context } from "../environment/Context";
import { LogString } from "mw-log4ts";

//#region Constant
export const YIELD_PROP_KEY = "__YIELD__";

/**
 * Yield 状态标记.
 */
export type YieldTag = boolean | number

export const YIELD_AT_SELF = true;

export const NOT_YIELD = false;

/**
 * 是否 自身处于 Yield 状态.
 */
export function isYieldAtSelf(tag: YieldTag): tag is true {
    return tag === YIELD_AT_SELF;
}

/**
 * 是否 子节点处于 Yield 状态.
 */
export function isYieldAtChild(tag: YieldTag): tag is number {
    return typeof tag === "number";
}

/**
 * 是否 不处于 Yield 状态.
 */
export function isNotYield(tag: YieldTag): tag is false {
    return tag === false;
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

/**
 * 运行节点实例.
 * @desc 内部引用至 NodeHolisticDef.
 */
export class NodeIns<C extends Context = Context> implements INodeIns<C> {
    public static log: (...m: LogString[]) => void;

    public static warn: (...m: LogString[]) => void;

    public static error: (...m: LogString[]) => void;

    public static logName = "N.I.";

    private _data: INodeData;

    public get id(): number {
        return this._data.id;
    }

    public get name(): string {
        return this._data.name;
    }

    private _defineCache: NodeHolisticDef | undefined;

    public get define(): NodeHolisticDef<C, INodeIns<C>> {
        if (!this._defineCache) {
            this._defineCache = nodeDefMap.get(this.name);
        }

        return this._defineCache;
    }

    public get args(): { [key: string]: unknown } {
        return this._data.args;
    }

    public get input(): ReadonlyArray<string> {
        return this._data.input;
    }

    public get output(): ReadonlyArray<string> {
        return this._data.output;
    }

    private _deep: number;

    public get deep(): number {
        return this._deep;
    }

    private _children: INodeIns<C>[] = [];

    public get size(): number {
        return this._children.length;
    }

    public get logTitle(): string {
        return `${this.id}-${this.name}`;
    }

    constructor(data: INodeData, id: number = undefined, deep: number = 0) {
        this._data = data;
        this._deep = deep;
        if (id !== undefined) {
            this._data.id = id;
        }

        if (Gtk.isNullOrEmpty(this._data.children)) return;

        for (const child of this._data.children) {
            if (!checkNodeDefined(child.name)) {
                this._children.length = 0;
                break;
            }

            this._children.push(new NodeIns<C>(child, undefined, deep + 1));
        }
    }

    public run(env: Environment<C, INodeIns<C>>): NodeRetStatus {
        const currYieldAt = this.currYieldAt(env);

        // Running Status Judge
        if (currYieldAt === NOT_YIELD) {
            NodeIns.log(() => `${NodeIns.logName} ${
                "  ".repeat(this.deep)}┌─${
                ">>".repeat(Math.max(1, 8 - env.size))
            } RUN ${this.logTitle}`);
            env.push(this);
        } else if (currYieldAt !== YIELD_AT_SELF && env.lastStackRet === NodeRetStatus.Running) {
            NodeIns.error(NodeIns.logName,
                `child is yield. you must handle this first.`,
                `self: ${this.logTitle}`,
                `child index: ${currYieldAt}`);
            return NodeRetStatus.Running;
        }

        // Input
        let vars: unknown[] = new Array(this.define.input?.length ?? 0);
        for (let i = 0; i < this.define.input?.length ?? 0; ++i) {
            const key = this.input[i];
            vars[i] = env.get(key) ?? undefined;
        }
        if (vars.length > 0) NodeIns.log(NodeIns.logName,
            `input:`,
            ...vars.map((k, i) =>
                `    ${k}: ${vars[i]}`),
        );

        // Args
        const argsDefList = nodeArgDefMap.get(this.define.name);
        if (!Gtk.isNullOrEmpty(argsDefList)) {
            for (const arg of argsDefList) {
                this.define[arg.name] = this.args?.[arg.name] ?? arg.default;
            }
            NodeIns.log(NodeIns.logName,
                `arg:`,
                ...argsDefList.map((k, i) =>
                    `    ${argsDefList[i].name}: ${this.define[argsDefList[i].name]}`),
            );
        }

        // Behave
        let ret: INodeRetInfo;
        let errored: boolean = false;
        let errorInfo: Error;
        try {
            ret = this.define.behave(this, env, ...vars);
        } catch (e) {
            errorInfo = e;
            errored = true;
        }

        if (Gtk.isNullOrUndefined(ret)) errored = true;
        if (errored) {
            NodeIns.error(NodeIns.logName,
                `error occurs when run node.`,
                `node: ${this.logTitle}`,
                errorInfo ?? "");
            return NodeRetStatus.Failure;
        }

        if (ret.status !== NodeRetStatus.Running) {
            this.setYieldAt(env, NOT_YIELD);
            env.pop();

            NodeIns.log(`${NodeIns.logName} ${
                "  ".repeat(this.deep)}└─${
                "<<".repeat(Math.max(1, 8 - env.size))
            } RET ${this.logTitle}`);
        } else if (this.currYieldAt(env) === NOT_YIELD) {
            this.setYieldAt(env, YIELD_AT_SELF);
        }

        // Output
        for (let i = 0;
             i < (this.define?.output?.length ?? 0) && i < (ret.out?.length ?? 0);
             i++) {
            NodeIns.log(NodeIns.logName,
                () => `output: ${this.define.output[i]}: ${ret.out[i]}`);
            env.set(this.output[i], ret.out[i]);
        }

        env.lastStackRet = ret.status;

        return ret.status;
    }

    public runChild(env: Environment<C, INodeIns<C>>,
                    index: number,
                    retWhenOutOfIndex: NodeRetStatus = NodeRetStatus.Success,
                    customStack: boolean = false): NodeRetStatus {
        if (index < 0 || index >= this.size) return retWhenOutOfIndex;
        let ret = this._children[index].run(env);

        if (ret === NodeRetStatus.Running) {
            this.setYieldAt(env, customStack ? YIELD_AT_SELF : index);
        } else {
            this.setYieldAt(env, YIELD_AT_SELF);
        }
        return ret;
    }

    public get selfKey(): string {
        return this.id.toString();
    }

    /**
     * 设置当前等待状态.
     * @param {Environment} env
     * @param {boolean | number} at
     * @private
     */
    private setYieldAt(env: Environment, at: YieldTag) {
        env.selfSet(this.selfKey, YIELD_PROP_KEY, at);
    }

    /**
     * 当前等待状态.
     * @param {Environment} env
     * @return {boolean | number}
     *    当未等待时返回 false.
     *    自身等待时 返回 true.
     *    子节点等待时 index.
     */
    public currYieldAt(env: Environment): YieldTag {
        return (env.selfGet(this.selfKey, YIELD_PROP_KEY) ?? false) as boolean | number;
    }
}

export function checkNodeDefined(name: string): boolean {
    if (!nodeDefMap.has(name)) {
        logENodeNotDefined(name);
        return false;
    }

    return true;
}

export const UNEXPECT_ERROR: Error = Error("unexpected status.");

/**
 * 非预期的状态错误.
 */
export function logEUnexpectState(node: NodeIns, status: NodeRetStatus) {
    NodeIns.error?.(NodeIns, `unexpected status error in ${node.id} in ${NodeRetStatus[status]}`);
}

/**
 * 未定义的节点.
 */
export function logENodeNotDefined(name: string) {
    NodeIns.error?.(NodeIns, `can't find defined of node ${name}`);
}