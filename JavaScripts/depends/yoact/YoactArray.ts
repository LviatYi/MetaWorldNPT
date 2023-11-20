import { Yoact } from "./Yoact";
import { Delegate } from "../delegate/Delegate";
import IYoactArray, { OnItemAddArg } from "./IYoactArray";
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

    private _orderedDataList: number[] = [];

    private _comparer: (item: T) => number = null;

    public onItemRemove: SimpleDelegate<number> = new SimpleDelegate();

    public onItemAdd: SimpleDelegate<OnItemAddArg> = new SimpleDelegate<OnItemAddArg>();

    public setAll(data: T[]): this {
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

        return this;
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

    public refresh(): void {
        if (!this._dataMap) return;

        for (const key of this._orderedDataList) {
            this.onItemAdd.invoke(new OnItemAddArg(key));
        }
    }

    public sort(cmp: (item: T) => number): void {
        if (!cmp) return;
        if (this._comparer === cmp) return;

        this._comparer = cmp;
        this._orderedDataList.length = 0;
        for (const item of this._dataMap.values()) {
            this.reorder(item);
        }
    }

    private reorder(item: T) {
        const index = this.getInsertIndex(item);
        const key = item.primaryKey();
        const weight = this._comparer(item);
        const originIndex = this._orderedDataList.indexOf(key);

        if (originIndex < 0) {
            this._orderedDataList.splice(index, 0, key);
            this.onItemAdd.invoke(new OnItemAddArg(key, index));
            return;
        }

        if (this._comparer(this._dataMap.get(this._orderedDataList[index])) === weight) {
            return;
        }

        this._orderedDataList.splice(originIndex, 1);
        this.onItemRemove.invoke(key);
        this._orderedDataList.splice(index, 0, key);
        this.onItemAdd.invoke(new OnItemAddArg(key, index));
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
        const insertIndex = this.getInsertIndex(item);
        this._orderedDataList.splice(insertIndex, 0, primaryKey);
        this.onItemAdd.invoke(new OnItemAddArg(primaryKey, insertIndex));
    }

    private innerSetItem(primaryKey: number, item: T) {
        this._dataMap.get(primaryKey).move(item);
        if (this._comparer) {
            this.reorder(item);
        }
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
        if (this._dataMap.has(primaryKey)) {
            this.onItemRemove.invoke(primaryKey);
            this._dataMap.delete(primaryKey);
            this._orderedDataList.splice(this._orderedDataList.indexOf(primaryKey), 1);
            return true;
        } else {
            return false;
        }
    }

    private getInsertIndex(item: T, start: number = 0, end: number = undefined): number {
        if (end === undefined) end = this._orderedDataList.length;
        if (!this._comparer) return end;
        if (start >= end) return start;

        const mid = ((start + end) / 2) | 0;
        const midWeight = this._comparer(this._dataMap.get(this._orderedDataList[mid]));
        const itemWeight = this._comparer(item);
        if (midWeight >= itemWeight) {
            return this.getInsertIndex(item, start, mid);
        } else {
            return this.getInsertIndex(item, mid + 1, end);
        }
    }
}