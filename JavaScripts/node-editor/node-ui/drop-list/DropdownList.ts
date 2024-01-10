import DropdownItem_Generate from "../../../ui-generate/node-ui/DropdownItem_generate";
import DropdownList_Generate from "../../../ui-generate/node-ui/DropdownList_generate";

/** 
 * @Author       : zewei.zhang
 * @Date         : 2024-01-08 15:52:14
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-08 19:12:51
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\node-ui\drop-list\DropdownList.ts
 * @Description  : 下拉框
 */
export default class DropdownList {
    root: DropdownList_Generate;
    // _itemCls: DropdownItem_Generate;
    space;
    /** 不显示的缓存道具 */
    _cache;
    /** 显示的道具 */
    _items;
    /** 是否下拉 */
    _isDropdown;
    /** 点击委托 */
    onSelect = new Action1();
    onClickShow = new Action();
    onClickHide = new Action();
    constructor(space = 0.5) {
        this.root = UIService.create(DropdownList_Generate);
        this.root.dropList.visibility = SlateVisibility.Collapsed;
        this.root.cmdButton.onClicked.add(this.toggle.bind(this));
        this.space = space;
        /** 缓存 */
        this._cache = [];
        /** 所有条目 */
        this._items = [];
    }
    /**
    * 添加展开按钮事件
    */
    toggle() {

        this._isDropdown = !this._isDropdown;
        this._isDropdown ? this.onClickShow.call() : this.onClickHide.call();
        this.root.dropList.visibility = this._isDropdown ? SlateVisibility.Visible : SlateVisibility.Collapsed;
        this._invalidateLayout();
    }
    /**
     * 添加展开按钮事件
     */
    expand() {
        this._isDropdown = true;
        this._invalidateLayout();
    }
    /**
     * 添加展开按钮事件
     */
    unExpand() {
        this._isDropdown = false;
        this._invalidateLayout();
    }
    /**
     * 添加一个选项
     * @param node
     * @param index 索引
     */
    addItem(data: string, id: number, index = -1) {
        let itemUI = this._cache.length > 0 ? this._cache.shift() : UIService.create(DropdownItem_Generate);
        if (!itemUI.list) {
            itemUI.list = this;
            itemUI.button.touchMethod = ButtonTouchMethod.PreciseTap;
            itemUI.button.onClicked.add(() => {
                this.onSelect.call(id);
                this.unExpand();
            });
            this.root.cmdPanel.addChild(itemUI.uiObject);
        }
        itemUI.uiObject.visibility = SlateVisibility.SelfHitTestInvisible;
        itemUI.button.text = data;
        if (index >= 0) {
            this._items.splice(index, 0, itemUI);
        }
        else {
            this._items.push(itemUI);
        }
        this.root.cmdPanel.size = new Vector2(270, this._items.length * (itemUI.uiObject.size.y + this.space));
        this._invalidateLayout();
    }
    /**
     * 删除一个选项
     * @param node
     */
    removeItem(node) {
        const index = this._items.indexOf(node);
        if (index >= 0) {
            node.visible = false;
            this._cache.push(...this._items.splice(index, 1));
            this._invalidateLayout();
        }
    }
    /**
     * 清除列表
     */
    clear() {
        for (const item of this._items) {
            if (!this._cache.includes(item)) {
                this._cache.push(item);
            }
            item.uiObject.visibility = SlateVisibility.Collapsed;
        }
        this._items.length = 0;
        this._invalidateLayout();
    }
    /**
     * 删除一个指定索引
     * @param index
     */
    removeItemAt(index) {
        const node = this.getItem(index);
        if (node) {
            this.removeItem(node);
        }
    }
    /**
     * 获取一个选项,超出范围则返回空
     * @param index
     */
    getItem(index) {
        if (index >= 0 && index < this._items.length)
            return this._items[index];
        return null;
    }
    /**
     * 获取选项数量
     */
    get size() {
        return this._items.length;
    }
    /**
     * 重新对齐面板
     */
    _invalidateLayout() {
        if (this._isDropdown) {
            let offset = 0;
            this.root.cmdPanel.position = Vector2.zero;
            this.root.dropList.visibility = SlateVisibility.SelfHitTestInvisible;
            for (let i = 0; i < this._items.length; i++) {
                this._items[i].uiObject.position = new Vector2(0, offset);
                offset += this._items[i].uiObject.size.y + this.space;
            }
        }
        else {
            this.root.dropList.visibility = SlateVisibility.Collapsed;
        }
    }
}