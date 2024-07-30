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
    name: string,

    /**
     * 常量参数.
     */
    args: { [key: string]: unknown },

    /**
     * 输入参数名.
     */
    input: Array<string>,

    /**
     * 输出参数名.
     */
    output: Array<string>,

    /**
     * 子节点.
     */
    children?: INodeData[],
}