import DialogueContentNodePanel from "./DialogueContentNodePanel";

/** 
 * @Author       : zewei.zhang
 * @Date         : 2024-01-02 14:48:50
 * @LastEditors  : zewei.zhang
 * @LastEditTime : 2024-01-02 14:57:20
 * @FilePath     : \MetaWorldNPT\JavaScripts\node-editor\DialogueCharacterNodePanel.ts
 * @Description  : 交互人物节点
 */
export default class DialogueCharacterNodePanel extends DialogueContentNodePanel {

    protected onStartPanel(): void {
        super.onStartPanel();
        this.contentBg.imageColor = LinearColor.colorHexToLinearColor("#E2E2E2");
        this.titleBg.imageColor = LinearColor.colorHexToLinearColor("#FFFFFF");
        this.titleText.fontColor = LinearColor.colorHexToLinearColor("#161716");
        this.contantText.fontColor = LinearColor.colorHexToLinearColor("#161716");
    }

}