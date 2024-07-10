/**
 * 平台标记.
 * @flag
 */
export enum PlatformFlag {
    /**
     * 空置.
     */
    Null = 0,

    /**
     * 客户端.
     */
    Client = 1 << 1,

    /**
     * 服务器.
     */
    Server = 1 << 2
}