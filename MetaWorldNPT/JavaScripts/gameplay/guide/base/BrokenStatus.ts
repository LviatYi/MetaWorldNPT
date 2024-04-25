/**
 * 引导损坏状态.
 */
export enum BrokenStatus {
    /**
     * 未知原因.
     */
    Null,
    /**
     * 外部错误.
     */
    Error,
    /**
     * 超时.
     */
    Timeout,
    /**
     * 强制退出.
     */
    ForceExit,
    /**
     * UI 阻塞退出.
     */
    UiBlockExit,
    /**
     * UI 未找到.
     */
    UiNotFound,
}