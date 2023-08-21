type DelegateFunction<T extends unknown> = (param: T) => void;

/**
 * 委托.
 * Ts 探索者啊 你一定要学会知足常乐. 因为你永远无法向 C# 或 C++ 那样使用简单的操作符进行委托操作.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export default class MultiDelegate<T extends unknown> {
    private _callbacks: DelegateFunction<T>[] = [];

    /**
     * 添加委托.
     * @param func
     */
    add(func: DelegateFunction<T>): void {
        this._callbacks.push(func);
    }

    /**
     * 执行委托.
     * @param param
     */
    invoke(param: T): void {
        for (const callback of this._callbacks) {
            callback(param);
        }
    }

    /**
     * 删除委托.
     * @param func
     */
    remove(func: DelegateFunction<T>): void {
        this._callbacks.splice(this._callbacks.indexOf(func), 1);
    }
}