/**
 * 行为树节点 运行返回类型.
 */
export enum NodeRetStatus {
    /**
     * 失败.
     */
    Fail = 0,

    /**
     * 成功.
     */
    Success,

    /**
     * 运行中.
     */
    Running,

    // /**
    //  * 中断.
    //  */
    // Abort,
}
