import TestPanel_Generate from "../ui-generate/TestPanel_generate";
import Nolan from "../depends/nolan/Nolan";
import AccessorTween, {SingleTweenTask} from "../depends/accessorTween/AccessorTween";

@UI.UICallOnly("")
export default class TestPanel extends TestPanel_Generate {
    private _nolan: Nolan;

    private _input: TouchInput;

    private _singleTask: SingleTweenTask;

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;

        this._nolan = new Nolan();

        this.testButton.onClicked.add(this.onTestButtonClick);
        this.testButton1.onClicked.add(this.onTestButton1Click);

        this._input = new TouchInput();
        this._input.setPlayerController();
        this._input.onTouchEnd.add(this.onClick);

        this._singleTask = AccessorTween.single(
            () => {
                return this.image.transform.position.x;
            },
            (val) => {
                const transform = this.image.transform;
                this.image.transform = new UI.UITransform(val, transform.position.y, transform.size.x, transform.size.y);
                console.log(`set x: ${val}`);
            }
        );
    }

    protected onUpdate() {
    }

    private onTestButtonClick = () => {
        console.log(`Test Button Clicked at ${Date.now()}`);
        this._nolan.test();
    };

    private onTestButton1Click = () => {
        console.log(`Test Button 1 Clicked at ${Date.now()}`);
        this._nolan.logCameraState();
    };

    private onClick = () => {
        const input = this._input.getTouchVectorArray()[0];
        console.log(`clicked at input: ${input}`);

        this._singleTask.to(input.x, 1e3);
    };
}
