/**
 * 上下文基类.
 *
 * @desc 允许自定义上下文
 * @desc 但必须继承自 Context 的类
 * @desc 以包含必需的信息.
 */
export class Context {
    public elapsedTime: number = 0;

    /**
     * 更新上下文.
     * @param params 参数列表.
     * @friendly {@link Environment}. 其余类型禁止调用.
     */
    public update(...params: unknown[]): void;

    /**
     * 更新上下文.
     * @desc 更新时机 每帧.
     * @param {number} dt 距上次调用经过时间. ms
     * @friendly {@link Environment}. 其余类型禁止调用.
     */
    public update(dt: number): void {
        this.elapsedTime += dt;
    }
}

/**
 * 上下文更新参数.
 */
export type ContextUpdateParams<T> = T extends { update: (...param: infer P) => void } ? P : never;