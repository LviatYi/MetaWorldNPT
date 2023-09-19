import TestPanel_Generate from "../ui-generate/TestPanel_generate";
import Nolan from "../depends/nolan/Nolan";

@UI.UICallOnly("")
export default class TestPanel extends TestPanel_Generate {
    private _nolan: Nolan;

    protected onAwake(): void {
        super.onAwake();

        this._nolan = new Nolan();

        this.testButton.onClicked.add(this.onTestButtonClick);
        this.testButton1.onClicked.add(this.onTestButton1Click);
    }

    private onTestButtonClick = () => {
        console.log(`Test Button Clicked at ${Date.now()}`);
        this._nolan.test();
    };

    private onTestButton1Click = () => {
        console.log(`Test Button 1 Clicked at ${Date.now()}`);
        this._nolan.logCameraState();
    };
}
