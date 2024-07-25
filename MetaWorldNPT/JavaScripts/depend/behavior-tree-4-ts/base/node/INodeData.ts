/**
 * 节点数据.
 * @desc 对节点定义进行描述.
 */
export interface INodeData {
    /**
     * Id.
     */
    id: number,

    /**
     * 定义节点名称.
     */
    defineName: string,

    /**
     * 常量参数.
     */
    args: { [key: string]: unknown },

    /**
     * 子节点.
     */
    children: INodeData[],

    /**
     * 是否 调试.
     */
    debug?: boolean,
}