/**
 * 行为树节点 运行返回类型.
 */
export enum NodeRetStatus {
    /**
     * 失败.
     */
    Failure,

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
