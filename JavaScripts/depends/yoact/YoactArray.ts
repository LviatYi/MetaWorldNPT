import { Yoact } from "./Yoact";
import { Delegate } from "../delegate/Delegate";
import createYoact = Yoact.createYoact;
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * 独一的.
 * @desc 即 拥有主键的. 其可通过主键标识唯一性 当主键相同时认定为同一对象.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
interface IUnique {
    /**
     * 主键.
     */
    primaryKey(): number;

    /**
     * 增量更新.
     * @desc 将 updated 的数据更新应用至自身.
     * @desc 建议自行比较内容 仅更新自身变动的成员 以达成增量更新.
     * @param updated 待更新数据.
     */
    move(updated: this): number;

    //
    // /**
    //  * 是否 等价.
    //  * @param lhs
    //  * @param rhs
    //  */
    // equal(lhs: this, rhs: this): boolean;
}

/**
 * Yoact Array.
 * 响应式数组.
 *
 * @desc 提供两种模式进行响应式更新.
 * @desc 1. 通过 {@link YoactArray.getItem} 获取数据条目后写入更新。这将直接从数据层更新至视图层.
 * @desc 2. 通过 {@link YoactArray.setAll} 设置所有数据。这将依赖 {@link IUnique.move} 进行自定义的增量更新.
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
export default class YoactArray<T extends IUnique> {
    private _dataMap: Map<number, T>;

    public onItemRemove: SimpleDelegate<number> = new SimpleDelegate();

    public onItemAdd: SimpleDelegate<number> = new SimpleDelegate();

    /**
     * 设定数据.
     * 根据主键确认独一性 依赖 {@link IUnique.move} 进行自定义的增量更新.
     * @param data
     */
    public setAll(data: T[]) {
        if (!this._dataMap) {
            this._dataMap = new Map<number, T>();
            data.forEach((item) => {
                this.addItem(item);
            });
        } else {
            const visited: Set<number> = new Set<number>();
            for (const item of data) {
                const primaryKey = item.primaryKey();
                if (this._dataMap.has(primaryKey)) {
                    this._dataMap.get(primaryKey).move(item);
                } else {
                    this.addItem(item);
                }
                visited.add(item.primaryKey());
            }

            Array.from(this._dataMap.keys()).forEach(
                (value) => this.removeItem(visited.has(value) ? null : value),
            );
        }
    }

    /**
     * 获取数据项目. 不存在则返回 null.
     * @param primaryKey 主键.
     */
    public getItem(primaryKey: number): T {
        return this._dataMap.get(primaryKey) ?? null;
    }

    private addItem(item: T): boolean {
        if (item === null) return;
        const primaryKey = item.primaryKey();
        if (!this._dataMap.has(primaryKey)) {
            this._dataMap.set(primaryKey, createYoact(item));
            this.onItemAdd.invoke(primaryKey);
            return true;
        } else {
            return false;
        }
    }

    private removeItem(primaryKey: number): boolean {
        if (primaryKey === null) return;
        if (!this._dataMap.has(primaryKey)) {
            this._dataMap.delete(primaryKey);
            this.onItemRemove.invoke(primaryKey);
            return true;
        } else {
            return false;
        }
    }
}