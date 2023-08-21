type DelegateFunction<T extends unknown> = (param: T) => void | boolean;

/**
 * Multi Delegate.
 * Ts 探索者啊 你一定要学会知足常乐. 因为你永远无法向 C# 或 C++ 那样使用简单的操作符进行委托操作.
 * 支持
 *  - 指定调用次数.
 *  - 条件存活.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 2.0.1
 */
export default class MultiDelegate<T extends unknown> {
    private _callbackInfo: { callback: DelegateFunction<T>, alive: number }[] = [];

    /**
     * add a delegate.
     * if you pass in a predicate and the alive!=-1 ,calculate alive only when true is returned.
     * @param func
     * @param alive valid times.
     *      default = -1. 无限制.
     * @public
     */
    public add(func: DelegateFunction<T>, alive: number = -1): void {
        if (this.getIndex(func) !== -1) {
            return;
        }
        this._callbackInfo.push({callback: func, alive: alive});
    }

    /**
     * add a delegate. can be only invoke once.
     * behaves the same as add(func, 1)
     * @param func
     * @public
     */
    public once(func: DelegateFunction<T>): void {
        this.add(func, 1);
    }

    /**
     * invoke delegate.
     * @param param
     * @public
     */
    public invoke(param: T): void {
        for (let i = this._callbackInfo.length - 1; i >= 0; --i) {
            const callbackInfo = this._callbackInfo[i];
            let ret: boolean | void = undefined;

            if (callbackInfo.alive !== 0) {
                ret = callbackInfo.callback(param);
            }

            if (callbackInfo.alive !== -1 && (typeof ret !== "boolean" || ret)) {
                --callbackInfo.alive;
            }

            if (callbackInfo.alive === 0) {
                this.removeByIndex(i);
            }
        }
    }

    /**
     * remove a delegate.
     * @param func
     * @public
     */
    public remove(func: DelegateFunction<T>): void {
        const index: number = this.getIndex(func);
        this._callbackInfo.splice(index, 1);
    }

    /**
     * try to get the index of an existing delegate.
     * @param func
     * @return index func index. -1 not exist.
     * @private
     */
    private getIndex(func: DelegateFunction<T>): number {
        return this._callbackInfo.findIndex(item => {
            return item.callback === func;
        });
    }

    /**
     * remove Func by index.
     * @param index
     * @private
     */
    private removeByIndex(index: number): void {
        this._callbackInfo.splice(index, 1);
    }
}