/**
 * 行为树节点 类型.
 */
export enum NodeType {
    /**
     * 复合节点.
     */
    Composite = "Composite",

    /**
     * 装饰节点.
     */
    Decorator = "Decorator",

    /**
     * 条件节点.
     */
    Condition = "Condition",

    /**
     * 行为节点.
     */
    Action = "Action"
}