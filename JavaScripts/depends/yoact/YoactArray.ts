import { Yoact } from "./Yoact";
import { Delegate } from "../delegate/Delegate";
import IYoactArray from "./IYoactArray";
import IUnique from "./IUnique";
import createYoact = Yoact.createYoact;
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * Yoact Array.
 * 响应式数组.
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
export default class YoactArray<T extends IUnique> implements IYoactArray<T> {
    private _dataMap: Map<number, T>;

    public onItemRemove: SimpleDelegate<number> = new SimpleDelegate();

    public onItemAdd: SimpleDelegate<number> = new SimpleDelegate();

    public setAll(data: T[]): void {
        if (this.checkDataMapValid()) {
            this._dataMap = new Map<number, T>();
            data.forEach((item) => {
                this.innerCheckAddItem(item.primaryKey(), item);
            });
        } else {
            const visited: Set<number> = new Set<number>();
            for (const item of data) {
                const primaryKey = item.primaryKey();
                this.innerCheckAddItem(primaryKey, item);
                visited.add(primaryKey);
            }

            Array.from(this._dataMap.keys()).forEach(
                (value) => this.innerRemoveItem(visited.has(value) ? null : value),
            );
        }
    }

    public getItem(primaryKey: number): T {
        return this._dataMap.get(primaryKey) ?? null;
    }

    public addItem(item: T): boolean {
        if (item === null) return false;

        if (this.checkDataMapValid()) {
            this.innerDirectAddItem(item.primaryKey(), item);
            return true;
        } else {
            return this.innerCheckAddItem(item.primaryKey(), item);
        }
    }

    public removeItem(primaryKey: number): boolean {
        if (!this._dataMap) return false;

        return this.innerRemoveItem(primaryKey);
    }

    /**
     * 已存检查 添加.
     * @param primaryKey
     * @param item
     * @private
     * @return 是否 添加.
     *      - false: 提供的数据无效或已经存在同键数据项.
     */
    private innerCheckAddItem(primaryKey: number, item: T): boolean {
        if (item === null) return false;

        if (!this._dataMap.has(primaryKey)) {
            this.innerDirectAddItem(primaryKey, item);
            return true;
        } else {
            this.innerSetItem(primaryKey, item);
            return false;
        }
    }

    /**
     * 直接 添加.
     * @param primaryKey
     * @param item
     * @private
     */
    private innerDirectAddItem(primaryKey: number, item: T) {
        this._dataMap.set(primaryKey, createYoact(item));
        this.onItemAdd.invoke(primaryKey);
    }

    private innerSetItem(primaryKey: number, item: T) {
        this._dataMap.get(primaryKey).move(item);
    }

    /**
     * 检查 {@link _dataMap} 可用性.
     * @desc 一切来自外部的操作都应该执行此检查.
     * @returns {boolean} 是否 检查中新建了 {@link _dataMap}.
     * @private
     */
    private checkDataMapValid(): boolean {
        if (!this._dataMap) {
            this._dataMap = new Map<number, T>();
            return true;
        }

        return false;
    }

    private innerRemoveItem(primaryKey: number): boolean {
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