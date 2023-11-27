import { Yoact } from "./Yoact";
import { Delegate } from "../delegate/Delegate";
import IYoactArray, { OnItemAddArg } from "./IYoactArray";
import IUnique from "./IUnique";
import createYoact = Yoact.createYoact;
import SimpleDelegate = Delegate.SimpleDelegate;

/**
 * Yoact Array.
 * 响应式数组.
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
export default class YoactArray<T extends IUnique> implements IYoactArray<T> {
    private _dataMap: Map<number, T>;

    private _output: number[] = [];

    private _comparer: (item: T) => number = null;

    private _filter: (item: T) => boolean = null;

    public onItemRemove: SimpleDelegate<number> = new SimpleDelegate();

    public onItemAdd: SimpleDelegate<OnItemAddArg> = new SimpleDelegate<OnItemAddArg>();

    private _length: number = 0;

    /**
     * 所有加入 item 数量.
     * 不由 {@link filter} 筛选.
     */
    public get length() {
        return this._length;
    }

    /**
     * 输入 item 数量.
     * 由 {@link filter} 筛选.
     */
    public get outputLength(){
        return this._output.length;
    }

    public setAll(data: T[]): this {
        if (this.touchDataMap()) {
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

    public getAll(): T[] {
        return this._dataMap ? Array.from(this.getAllAsIterator()) : [];
    }

    public getAllAsIterator(): IterableIterator<T> {
        return this._dataMap ? this._dataMap.values() : null;
    }

    public getItem(primaryKey: number): T {
        return this._dataMap?.get(primaryKey) ?? null;
    }

    public getItemWithDefault(primaryKey: number, defaultValue: T): T {
        this.touchDataMap();

        if (!this._dataMap.has(primaryKey)) {
            this.innerAddItem(primaryKey, defaultValue);
        }

        return this._dataMap.get(primaryKey);
    }

    public addItem(item: T): boolean {
        if (item === null) return false;

        if (this.touchDataMap()) {
            this.innerAddItem(item.primaryKey(), item);
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

        for (const key of this._output) {
            this.onItemAdd.invoke(new OnItemAddArg(key));
        }
    }

    public sort(cmp: (item: T) => number = null): void {
        if (this._comparer === cmp) return;
        this._comparer = cmp;
        if (!cmp) return;

        this.refreshOutput();
    }

    public filter(flt: (item: T) => boolean = null): void {
        if (this._filter === flt) return;
        this._filter = flt;

        this.refreshOutput();
    }

    /**
     * 重设 {@link _filter} 或 {@link _comparer} 后 重计算所有排序与筛选.
     * @desc 重设以上属性需大规模刷新.
     * @private
     */
    private refreshOutput() {
        this._output =
            Array
                .from(this._dataMap.keys());
        if (this._comparer)
            this._output.sort(
                (lhs, rhs) => {
                    return this._comparer(this._dataMap.get(lhs)) - this._comparer(this._dataMap.get(rhs));
                });
        if (this._filter) {
            this._output = this._output.filter((key) => this.isFiltered(key));
        }

        for (let key of this._dataMap.keys()) {
            this.onItemRemove.invoke(key);
        }

        for (let i = 0; i < this._output.length; i++) {
            const key = this._output[i];
            if (this.isFiltered(key)) this.onItemAdd.invoke(new OnItemAddArg(key, i));
        }
    }

    /**
     * 更新元素时 重计算排序与筛选.
     * @desc 重设 item 内部属性需单独刷新.
     * @param key
     * @private
     */
    private refreshOutputItem(key: number) {
        const item = this._dataMap.get(key);
        const originIndex = this._output.indexOf(key);
        const isFiltered = this.isFiltered(key);

        if (!isFiltered) {
            if (originIndex === -1) {
                return;
            }
            this._output.splice(originIndex, 1);
            this.onItemRemove.invoke(key);
            return;
        }

        const index = this.getInsertIndex(item);
        const weight = this._comparer(item);

        if (originIndex < 0) {
            this._output.splice(index, 0, key);
            this.onItemAdd.invoke(new OnItemAddArg(key, index));
            return;
        }

        if (this._comparer(this._dataMap.get(this._output[index])) === weight) {
            return;
        }

        this._output.splice(originIndex, 1);
        this.onItemRemove.invoke(key);
        this._output.splice(index, 0, key);
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
            this.innerAddItem(primaryKey, item);
            return true;
        } else {
            this.innerUpdateItem(primaryKey, item);
            return false;
        }
    }

    /**
     * 内部 添加.
     * @param primaryKey
     * @param item
     * @private
     */
    private innerAddItem(primaryKey: number, item: T) {
        this._dataMap.set(primaryKey, createYoact(item));
        ++this._length;
        if (this.isFiltered(primaryKey)) {
            const insertIndex = this.getInsertIndex(item);
            this._output.splice(insertIndex, 0, primaryKey);
            this.onItemAdd.invoke(new OnItemAddArg(primaryKey, insertIndex));
        }
    }

    /**
     * 内部 删除.
     * @param primaryKey
     * @private
     */
    private innerRemoveItem(primaryKey: number): boolean {
        if (primaryKey === null) return;
        if (this._dataMap.has(primaryKey)) {
            this.onItemRemove.invoke(primaryKey);
            this._dataMap.delete(primaryKey);
            this._output.splice(this._output.indexOf(primaryKey), 1);
            --this._length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * 内部 更新.
     * @param primaryKey
     * @param item
     * @private
     */
    private innerUpdateItem(primaryKey: number, item: T) {
        this._dataMap.get(primaryKey).move(item);
        this.refreshOutputItem(primaryKey);
    }

    /**
     * 使 {@link _dataMap} 可用.
     * @desc 一切来自外部的操作都应该执行此检查.
     * @returns {boolean} 是否 检查中新建了 {@link _dataMap}.
     * @private
     */
    private touchDataMap(): boolean {
        if (!this._dataMap) {
            this._dataMap = new Map<number, T>();
            return true;
        }

        return false;
    }

    /**
     * 计算 插入位置.
     * 当不存在排序比较函数时 插入到最后.
     * @param item
     * @param start
     * @param end
     * @private
     */
    private getInsertIndex(item: T, start: number = 0, end: number = undefined): number {
        if (end === undefined) end = this._output.length;
        if (!this._comparer) return end;
        if (start >= end) return start;

        const mid = ((start + end) / 2) | 0;
        const midWeight = this._comparer(this._dataMap.get(this._output[mid]));
        const itemWeight = this._comparer(item);
        if (midWeight >= itemWeight) {
            return this.getInsertIndex(item, start, mid);
        } else {
            return this.getInsertIndex(item, mid + 1, end);
        }
    }

    /**
     * 计算 是否被滤出.
     * @param key
     * @private
     */
    private isFiltered(key: number): boolean {
        if (this._filter === null) return true;
        const item = this._dataMap.get(key);
        if (!item) return false;
        return this._filter(item);
    }
}