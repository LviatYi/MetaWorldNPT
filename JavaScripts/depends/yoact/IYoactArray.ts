import { Delegate } from "../delegate/Delegate";
import IUnique from "./IUnique";
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * Yoact Array Interface.
 * 响应式数组 接口.
 *
 * @desc ---
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
export default interface IYoactArray<T extends IUnique> {

    /**
     * 当 数据项 移除 时 调用.
     *      - (index:number)=>void;
     *          - index: 数据项索引.
     */
    onItemRemove: SimpleDelegate<number>;

    /**
     * 当 数据项 添加 时 调用.
     *      - (index:number)=>void;
     *          - index: 数据项索引.
     */
    onItemAdd: SimpleDelegate<number>;

    /**
     * 设定数据.
     * 根据主键确认独一性 依赖 {@link IUnique.move} 进行自定义的增量更新.
     * @param data
     */
    setAll(data: T[]): void;

    /**
     * 获取数据项. 不存在则返回 null.
     * @param primaryKey 主键.
     */
    getItem(primaryKey: number): T;

    /**
     * 添加 数据项.
     * 当已经存在则进行更新.
     * @param item
     */
    addItem(item: T): boolean;

    /**
     * 移除 数据项.
     * @param primaryKey 数据项主键.
     */
    removeItem(primaryKey: number): boolean;
}