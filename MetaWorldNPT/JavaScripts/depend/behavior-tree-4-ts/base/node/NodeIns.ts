import { NodeRetStatus } from "./NodeRetStatus";
import { NodeHolisticDef } from "./NodeHolisticDef";
import { nodeDefMap } from "../registry/RegNodeDef";
import Gtk from "gtoolkit";
import { Environment } from "../environment/Environment";
import { INodeRetInfo } from "./INodeRetInfo";
import { INodeData } from "./INodeData";
import { INodeIns } from "./INodeIns";
import Log4Ts from "mw-log4ts/Log4Ts";

//#region Constant
const YIELD_PROP_KEY = "__YIELD__";

/**
 * Yield 状态标记.
 */
export type YieldTag = boolean | number

export const YIELD_AT_SELF = true;

export const NOT_YIELD = false;

/**
 * 是否 自身处于 Yield 状态.
 */
export function isYieldAtSelf(tag: YieldTag): boolean {
    return tag === YIELD_AT_SELF;
}

/**
 * 是否 子节点处于 Yield 状态.
 */
export function isYieldAtChild(tag: YieldTag): boolean {
    return typeof tag === "number";
}

/**
 * 是否 不处于 Yield 状态.
 */
export function isNotYield(tag: YieldTag): boolean {
    return tag === false;
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

/**
 * 运行节点实例.
 * @desc 内部引用至 NodeHolisticDef.
 */
export class NodeIns implements INodeIns {
    private _data: INodeData;

    public get id(): number {
        return this._data.id;
    }

    public get name(): string {
        return this._data.defineName;
    }

    private _defineCache: NodeHolisticDef | undefined;

    public get define(): NodeHolisticDef<INodeIns> {
        if (!this._defineCache) {
            this._defineCache = nodeDefMap.get(this.name);
        }

        return this._defineCache;
    }

    public get args(): { [key: string]: unknown } {
        return this._data.args;
    }

    private _children: INodeIns[] = [];

    public get size(): number {
        return this._children.length;
    }

    public get debug(): boolean {
        return !!this._data.debug;
    }

    constructor(data: INodeData) {
        this._data = data;

        for (const child of this._data.children) {
            this._children.push(new NodeIns(child));
        }
    }

    public run(env: Environment<INodeIns>): NodeRetStatus {
        const currYieldAt = this.currYieldAt(env);
        if (currYieldAt === NOT_YIELD) {
            this.setYieldAt(env, YIELD_AT_SELF);
            env.push(this);
        } else if (currYieldAt !== YIELD_AT_SELF) {
            Log4Ts.error(NodeIns, `child is yield. you must handle this first. child index: ${currYieldAt}`);
            return NodeRetStatus.Running;

        }

        let vars: unknown[] = new Array(this.define.input.length);
        for (let i = 0; i < this.define.input.length; ++i) {
            vars[i] = env.get(this.define.input[i]);
        }

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
            ret.status = NodeRetStatus.Fail;
            Log4Ts.error(NodeIns,
                `error occurs when run node.`,
                `id: ${this.id}`,
                `name: ${this.name}.`,
                errorInfo ?? "");
            return ret.status;
        }

        if (ret.status !== NodeRetStatus.Running) {
            this.setYieldAt(env, NOT_YIELD);
            env.pop();
        }

        for (let i = 0; i < this.define.output.length && i < ret.out.length; i++) {
            env.set(this.define.output[i], ret.out[i]);
        }

        env.lastStackRet = ret.status;

        (this.debug) && Log4Ts.log(NodeIns,
            `run finished.`,
            `node id: ${this.id}`,
            `ret status: ${NodeRetStatus[ret.status]}`,
            `out: ${ret.out}`,
        );

        return ret.status;
    }

    public runChild(env: Environment<INodeIns>,
                    index: number,
                    retWhenOutOfIndex: NodeRetStatus = NodeRetStatus.Success): NodeRetStatus {
        if (index <= 0 || index > this.size) return retWhenOutOfIndex;
        let ret = this._children[index].run(env);

        if (ret === NodeRetStatus.Running) {
            this.setYieldAt(env, index);
        } else if (this.currYieldAt(env) === index) {
            this.setYieldAt(env, YIELD_AT_SELF);
        }
        return ret;
    }

    private get selfKey(): string {
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
        return env.selfGet(this.selfKey, YIELD_PROP_KEY) as boolean | number;
    }
}

export const UNEXPECT_ERROR: Error = Error("unexpected status error");

/**
 * 非预期的状态错误.
 */
export function logEUnexpectState(node: NodeIns, status: NodeRetStatus) {
    Log4Ts.error(NodeIns, `unexpected status error in ${node.id} in ${NodeRetStatus[status]}`);
}