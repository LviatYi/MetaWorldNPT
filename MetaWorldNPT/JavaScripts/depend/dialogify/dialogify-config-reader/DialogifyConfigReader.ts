import ADialogifyConfigReader, {
    IDialogueContentNodeConfigElement,
    IDialogueInteractNodeConfigElement,
    IRelateEntityConfigElement,
} from "./ADialogifyConfigReader";
import { GameConfig } from "../../../config/GameConfig";

/**
 * 平凡 对话配置读取器.
 */
class DialogifyConfigReader extends ADialogifyConfigReader<
    IRelateEntityConfigElement,
    IDialogueContentNodeConfigElement,
    IDialogueInteractNodeConfigElement> {

    public getDialogueContentNodeConfig(id: number): IDialogueContentNodeConfigElement {
        return GameConfig.DialogueContentNode.getElement(id);
    }

    public getDialogueInteractNodeConfig(id: number): IDialogueInteractNodeConfigElement {
        return GameConfig.DialogueInteractNode.getElement(id);
    }

    public getRelateEntityConfig(id: number): IRelateEntityConfigElement {
        return GameConfig.RelateEntity.getElement(id);
    }
}

export default new DialogifyConfigReader();