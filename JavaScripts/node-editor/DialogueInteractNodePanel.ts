import DialogueContentNodePanel from "./DialogueContentNodePanel";
import { LinePanelNode } from "./node-ui/line-node/LinePanelNode";
/** 
 * @Author       : zewei.zhang
 * @Date         : 2024-01-02 14:07:04
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-08 18:40:58
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\DialogueInteractNodePanel.ts
 * @Description  : 交互选项节点
 */
export default class DialogueInteractNodePanel extends LinePanelNode {

    protected contantText: mw.TextBlock;
    public configId: number;

    protected onStartPanel(): void {
        super.onStartPanel();
        this.contantText = TextBlock.newObject();
        this.contantText.position = new Vector2(10, 10);
        this.contantText.size = this.contentCanvas.size.clone().subtract(new Vector2(20, 20));
        this.contantText.textAlign = TextJustify.Left;
        this.contantText.textVerticalAlign = TextVerticalJustify.Top;
        this.contantText.textHorizontalLayout = UITextHorizontalLayout.AutoWarpText;
        this.contentCanvas.addChild(this.contantText);

        this.contentBg.imageColor = LinearColor.colorHexToLinearColor("#85B686");
        this.titleBg.imageColor = LinearColor.colorHexToLinearColor("#45A64E");
    }

    public setContent(text: string, configId: number): void {
        this.contantText.text = text;
        this.configId = configId;
    }

}