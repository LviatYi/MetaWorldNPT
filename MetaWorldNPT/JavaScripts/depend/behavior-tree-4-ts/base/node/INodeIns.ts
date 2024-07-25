import { NodeHolisticDef } from "./NodeHolisticDef";
import { Environment } from "../environment/Environment";
import { INodeRetInfo } from "./INodeRetInfo";
import { NodeRetStatus } from "./NodeRetStatus";

/**
 * 运行节点实例.
 */
export interface INodeIns {
    get id(): number,

    get name(): string;

    get define(): NodeHolisticDef;

    get args(): { [key: string]: unknown };

    get size(): number;

    get debug(): boolean;

    /**
     * 运行节点.
     * @param {Environment<INodeIns>} env
     * @return {INodeRetInfo}
     */
    run(env: Environment<INodeIns>): NodeRetStatus;

    /**
     * 运行子节点.
     * @param {Environment<INodeIns>} env
     * @param {number} index 作为指定索引 运行子节点.
     * @param {NodeRetStatus} retWhenOutOfIndex 当索引超出时返回的状态.
     * @return {INodeRetInfo}
     */
    runChild(env: Environment<INodeIns>,
             index: number,
             retWhenOutOfIndex?: NodeRetStatus): NodeRetStatus;

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