import DialogueContentNodePanel from "./DialogueContentNodePanel";
/** 
 * @Author       : zewei.zhang
 * @Date         : 2024-01-02 14:07:04
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-02 14:49:03
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\DialogueInteractNodePanel.ts
 * @Description  : 交互选项节点
 */
export default class DialogueInteractNodePanel extends DialogueContentNodePanel {


    protected onStartPanel(): void {
        super.onStartPanel();
        this.contentBg.imageColor = LinearColor.colorHexToLinearColor("#85B686");
        this.titleBg.imageColor = LinearColor.colorHexToLinearColor("#45A64E");
    }

}