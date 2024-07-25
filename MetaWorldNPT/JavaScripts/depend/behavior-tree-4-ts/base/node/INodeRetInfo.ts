import { NodeRetStatus } from "./NodeRetStatus";

/**
 * 节点返回信息.
 */
export interface INodeRetInfo {
    /**
     * 运行状态.
     */
    status: NodeRetStatus,

    /**
     * 输出.
     */
    out?: unknown[]
}