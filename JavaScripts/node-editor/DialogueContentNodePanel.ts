import { ICharacterElement } from "../config/Character";
import { GameConfig } from "../config/GameConfig";
import i18n from "../depend/i18n/i18n";
import DialogueInteractNodePanel from "./DialogueInteractNodePanel";
import { EventNotify } from "./EventNotify";
import DropdownList from "./node-ui/drop-list/DropdownList";
import { LinePanelNode } from "./node-ui/line-node/LinePanelNode";
import { NodeType } from "./node-ui/manager/NodeAndLineManager";


/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-12-25 09:58:39
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-09 17:27:02
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\DialogueContentNodePanel.ts
 * @Description  : 修改描述
 */
export default class DialogueContentNodePanel extends LinePanelNode {
    protected contantText: mw.TextBlock;
    public configId: number;

    public sourceCharacterId: number = 0;

    private dropdownList: DropdownList;

    private dropdownLinster: EventListener;


    protected onStartPanel(): void {
        super.onStartPanel();
        this.nodeType = NodeType.DialogueContentNode;

        this.contantText = TextBlock.newObject();
        this.contantText.position = new Vector2(10, 10);
        this.contantText.size = this.contentCanvas.size.clone().subtract(new Vector2(20, 20));
        this.contantText.textAlign = TextJustify.Left;
        this.contantText.textVerticalAlign = TextVerticalJustify.Top;
        this.contantText.textHorizontalLayout = UITextHorizontalLayout.AutoWarpText;
        this.contentCanvas.addChild(this.contantText);


        this.contentBg.imageColor = LinearColor.colorHexToLinearColor("#94B8D9");
        this.titleBg.imageColor = LinearColor.colorHexToLinearColor("#3D6CB5");
        this.dropdownList = new DropdownList();
        this.dropdownList.root.uiObject.position = new mw.Vector2(this.contentCanvas.size.x * 0.5 - this.dropdownList.root.uiObject.size.x * 0.5, this.contentCanvas.size.y - this.dropdownList.root.cmdButton.size.y - 3);
        this.contentCanvas.addChild(this.dropdownList.root.uiObject);
        this.dropdownLinster = Event.addLocalListener(EventNotify.OnDropdownListShow, (nodeId: number) => {
            if (nodeId != this.nodeId) {
                //不是自己把层次降下来
                this.uiObject.zOrder = mw.UILayerBottom;
                //别人的下拉框收起来
                if (this.dropdownList._isDropdown) {
                    this.dropdownList.toggle();
                }
            }
        });

        this.dropdownList.onClickShow.add(() => {
            Event.dispatchToLocal(EventNotify.OnDropdownListShow, this.nodeId);
            this.uiObject.zOrder = mw.UILayerTop;
        });

        this.dropdownList.onClickHide.add(() => {
            this.uiObject.zOrder = mw.UILayerBottom;
        });

    }

    public setContent(text: string, configId: number): void {
        this.contantText.text = text;
        this.configId = configId;

        //读对应的人物
        let config = GameConfig.DialogueContentNode.getElement(configId);
        if (config && config.sourceId) {
            let character = GameConfig.Character.getElement(config.sourceId);
            if (character && character.name) {
                this.dropdownList.root.cmdButton.text = i18n.lan(character.name);
                this.sourceCharacterId = character.id;
            }
        }

        let configList = GameConfig.Character.getAllElement();
        for (let i = 0; i < configList.length; i++) {
            let element = configList[i];
            this.dropdownList.addItem(i18n.lan(element.name), element.id);
        }

        this.dropdownList.onSelect.add((id: number) => {

            this.dropdownList.root.cmdButton.text = i18n.lan(GameConfig.Character.getElement(id).name);
            this.sourceCharacterId = id;

        })
    }

    onUIDestroy(): void {
        this.dropdownLinster.disconnect();
        this.dropdownList.onSelect.clear();
        this.dropdownList.onClickShow.clear();
        this.dropdownList.onClickHide.clear();
        // this.dropdownList.root.cmdButton.onClicked.removeAll();
        // this.dropdownList.root.uiObject.destroyObject();
        super.onUIDestroy();
    }
}