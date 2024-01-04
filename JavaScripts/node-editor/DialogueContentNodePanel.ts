import { GameConfig } from "../config/GameConfig";
import i18n from "../depend/i18n/i18n";
import { LinePanelNode } from "./node-ui/LinePanelNode";

/** 
 * @Author       : zewei.zhang
 * @Date         : 2023-12-25 09:58:39
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-02 15:04:39
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\DialogueContentNodePanel.ts
 * @Description  : 修改描述
 */
export default class DialogueContentNodePanel extends LinePanelNode {

    protected contantText: mw.TextBlock;
    private _configId: number;
    protected onStartPanel(): void {
        super.onStartPanel();

        this.contantText = TextBlock.newObject();
        this.contantText.position = new Vector2(10, 10);
        this.contantText.size = this.contentCanvas.size.clone().subtract(new Vector2(20, 20));
        this.contantText.textAlign = TextJustify.Left;
        this.contantText.textVerticalAlign = TextVerticalJustify.Top;
        this.contantText.textHorizontalLayout = UITextHorizontalLayout.AutoWarpText;
        this.contentCanvas.addChild(this.contantText);
    }

    public setContent(text: string, configId: number): void {
        this.contantText.text = text;
        this._configId = configId;
    }
}