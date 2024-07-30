import { NodeHolisticDef } from "./NodeHolisticDef";
import { Environment } from "../environment/Environment";
import { NodeRetStatus } from "./NodeRetStatus";
import { Context } from "../environment/Context";

/**
 * 运行节点实例.
 */
export interface INodeIns<C extends Context = Context> {
    get id(): number,

    get name(): string;

    get define(): NodeHolisticDef;

    get args(): { [key: string]: unknown };

    get input(): ReadonlyArray<string>;

    get output(): ReadonlyArray<string>;

    get size(): number;

    /**
     * 运行节点.
     * @param {Environment<INodeIns>} env
     * @return {INodeRetInfo}
     */
    run(env: Environment<C, INodeIns<C>>): NodeRetStatus;

    /**
     * 运行子节点.
     * @param {Environment<C,INodeIns<C>>} env
     * @param {number} index 作为指定索引 运行子节点.
     * @param {NodeRetStatus} retWhenOutOfIndex 当索引超出时返回的状态.
     * @param {boolean} customStack=false 自定义栈管理. 不要将子节点置于栈管理.
     *      - 将使用虚拟栈管理子节点 子节点的 Yield 态将指向父节点自身.
     * @return {INodeRetInfo}
     */
    runChild(env: Environment<C, INodeIns<C>>,
             index: number,
             retWhenOutOfIndex?: NodeRetStatus,
             customStack?: boolean): NodeRetStatus;

    /**
     * 当前等待于.
     * @param {Environment} env
     * @return {boolean | number}
     *    当未等待时返回 false.
     *    自身等待时 返回 true.
     *    子节点等待时 返回 index.
     */
    currYieldAt(env: Environment): boolean | number;
}