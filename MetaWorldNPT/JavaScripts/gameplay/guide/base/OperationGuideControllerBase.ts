import {Delegate} from "../../../util/GToolkit";
import {BrokenStatus} from "./BrokenStatus";
import SimpleDelegate = Delegate.SimpleDelegate;

export default class OperationGuideControllerBase<FA = void> {
//#region Event
    /**
     * 引导开始事件.
     * @type {Delegate.SimpleDelegate}
     */
    public readonly onFocus: SimpleDelegate<FA> = new SimpleDelegate<FA>();

    /**
     * 引导结束事件.
     * @type {Delegate.SimpleDelegate} 是否完成.
     */
    public readonly onFade: SimpleDelegate<FA> = new SimpleDelegate<FA>();

    /**
     * 引导异常中断事件. 应触发全组引导结束.
     * @desc 该事件播出时不会同时触发 引导结束 事件.
     * @type {Delegate.SimpleDelegate}
     */
    public readonly onBroken: SimpleDelegate<{ arg: FA, status: BrokenStatus }> = new SimpleDelegate();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}