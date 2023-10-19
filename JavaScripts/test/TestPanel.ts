import TestPanel_Generate from "../ui-generate/TestPanel_generate";
import Nolan from "../depends/nolan/Nolan";
import GToolkit from "../util/GToolkit";
import Waterween from "../depends/waterween/Waterween";
import {CubicBezier} from "../depends/easing/Easing";
import {FlowTweenTask} from "../depends/waterween/tweenTask/FlowTweenTask";
import i18n, {LanguageTypes} from "../depends/i18n/i18n";
import MWSysCharacter = UE.MWSysCharacter;

@UI.UICallOnly("")
export default class TestPanel extends TestPanel_Generate {
    private _nolan: Nolan;

    private _input: TouchInput;

    private _currCharacter: Gameplay.Character;

    private _originRotation: Type.Rotation;

    private _wantRotation: Type.Rotation = Type.Rotation.zero;

    private _flowTask: FlowTweenTask<{ x: number, y: number }>;

    private _targetOpacityTask: FlowTweenTask<unknown>;

    private _roleInclineTask: FlowTweenTask<unknown>;

    private _elapsed: number = 0;

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;

        this._nolan = new Nolan();

        this._flowTask = Waterween.flow(
            () => {
                return {
                    x: this.image.position.x,
                    y: this.image.position.y,
                };
            },
            (val) => {
                this.image.position = new Vector2(val.x, val.y);
                GToolkit.log(TestPanel, this.image.position.toString());
            },
            1e3,
        );

        this._roleInclineTask = Waterween.flow(
            () => {
                return {
                    x: this._wantRotation.x,
                    y: this._wantRotation.y,
                };
            },
            (val) => {
                this._wantRotation.x = val.x;
                this._wantRotation.y = val.y;
            },
            1e3,
            new CubicBezier(0, .4, .3, 1),
            0.1,
            true,
        );

        this.testButton.onClicked.add(this.onTestButtonClick);
        this.testButton1.onClicked.add(this.onTestButton1Click);
        this.testButton2.onClicked.add(this.onTestButton2Click);

        i18n.use(LanguageTypes.English);
        this.textBlock.text = i18n.lan("test_01");

        this._input = new TouchInput();
        this._input.setPlayerController();
        this._input.onTouchEnd.add(this.onClick);
    }

    private _ryCache: number = 0;

    private _rzCache: number = 0;

    protected onUpdate(d: number) {
        this._elapsed += d;
        if (!this._currCharacter) {
            this._currCharacter = Gameplay.getCurrentPlayer().character;
            this._originRotation = GToolkit.getCharacterMeshRotation(this._currCharacter);
        }
        // this._nolan.logCameraState();
        this._nolan.test();
    }

    private onTestButtonClick = () => {
        this._nolan.takeCamera();
    };

    private onTestButton1Click = () => {
        this._nolan.returnCamera();
    };

    private onTestButton2Click = () => {
        const mwCharacter = (this._currCharacter["ueCharacter"] as MWSysCharacter);
        // GToolkit.log(TestPanel, `Rotator: ${mwCharacter.GetControlRotator().ToString()}`);
        // GToolkit.log(TestPanel, `Rotation: ${mwCharacter.GetControlRotation().ToString()}`);

        mwCharacter.ControlRotator = new UE.Rotator(0, 0, 0);
    };

    private onClick = () => {
        const input = this._input.getTouchVectorArray()[0];
        GToolkit.log(TestPanel, `get input: ${input.toString()}`);
        const uiLocation = GToolkit.screenToUI(input);

        GToolkit.log(TestPanel, `try set: ${uiLocation.toString()}`);
        this._flowTask.to({
            x: uiLocation.x,
            y: uiLocation.y,
        });
    };
}
