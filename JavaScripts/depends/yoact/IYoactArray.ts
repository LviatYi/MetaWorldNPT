import { Delegate } from "../delegate/Delegate";
import IUnique from "./IUnique";
import SimpleDelegate = Delegate.SimpleDelegate;

export class OnItemAddArg {
    /**
     * 数据项主键.
     */
    public key: number;

    /**
     * 插入顺序.
     *      - -1 时无插入顺序.
     */
    public index: number;

    constructor(key: number, index: number = -1) {
        this.key = key;
        this.index = index;
    }
}

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
    onItemAdd: SimpleDelegate<OnItemAddArg>;

    /**
     * 设定数据.
     * 根据主键确认独一性 依赖 {@link IUnique.move} 进行自定义的增量更新.
     * @param data
     */
    setAll(data: T[]): this;

    /**
     * 获取数据.
     */
    getAll(): T[];

    /**
     * 获取数据. 以 {@link IterableIterator} 形式.
     */
    getAllAsIterator(): IterableIterator<T>;

    /**
     * 获取数据项. 不存在则返回 null.
     * @param primaryKey 主键.
     */
    getItem(primaryKey: number): T;

    /**
     * 获取数据项. 不存在则返回 {@link defaultValue} 并以此填充入 {@link IYoactArray} 中.
     * @param primaryKey
     * @param defaultValue
     */
    getItemWithDefault(primaryKey: number, defaultValue: T): T;

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

    /**
     * 手动刷新.
     * 将现存数据项列表的重新播出 {@link onItemAdd} 事件.
     */
    refresh(): void;

    /**
     * 定义比较器 以进行排序.
     * @param cmp 排序器.
     *      - default null 取消排序器.
     */
    sort(cmp: (item: T) => number): void;

    /**
     * 定义过滤器 以进行过滤.
     * @param flt 过滤器.
     *      - default null 取消过滤器.
     */
    filter(flt: (item: T) => boolean): void;
}