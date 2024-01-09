import ADialoguePanelController from "./ADialoguePanelController";
import ADialogifyConfigReader, {
    IDialogueContentNodeConfigElement,
    IDialogueInteractNodeConfigElement,
    IRelateEntityConfigElement,
} from "../dialogify-config-reader/ADialogifyConfigReader";
import DialoguePanel_Generate from "../../../ui-generate/dialogify/DialoguePanel_generate";
import InteractNode_Generate from "../../../ui-generate/dialogify/InteractNode_generate";

export default class DialoguePanelController extends ADialoguePanelController<
    DialoguePanel_Generate,
    InteractNode_Generate,
    IRelateEntityConfigElement,
    IDialogueContentNodeConfigElement,
    IDialogueInteractNodeConfigElement,
    ADialogifyConfigReader<IRelateEntityConfigElement, IDialogueContentNodeConfigElement, IDialogueInteractNodeConfigElement>> {

    protected get interactorItemConstructor(): new() => InteractNode_Generate {
        return InteractNode_Generate;
    }
}