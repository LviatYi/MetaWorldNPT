/**
 * IRestartTweenTask.
 * Tween task interface who can restart.
 */
export interface IRestartTweenTask {
    /**
     * 重置 补间.
     * @param pause 是否伴随 󰏤暂停. default false.
     */
    restart(pause?: boolean): this;
}