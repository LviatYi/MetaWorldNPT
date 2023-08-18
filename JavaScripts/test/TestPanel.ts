import TestPanel_Generate from "../ui-generate/TestPanel_generate";
import FloatPanel from "../lab/ui/FloatPanel";
import UIManager = UI.UIManager;

@UI.UICallOnly("")
export default class TestPanel extends TestPanel_Generate {
    private _floatPanel: FloatPanel;

    protected onAwake(): void {
        super.onAwake();

        this._floatPanel = UIManager.instance.getUI(FloatPanel);
        this.testButton.onClicked.add(this.onTestButtonClick);
    }

    private onTestButtonClick = () => {
        if (this._floatPanel.shown) {
            this._floatPanel.concealCurtain({transparency: true});
        } else {
            this._floatPanel.showCurtain({transparency: true});
        }
    };
}
