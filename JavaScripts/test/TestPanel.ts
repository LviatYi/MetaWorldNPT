import TestPanel_Generate from "../ui-generate/TestPanel_generate";
import Nolan from "../depends/nolan/Nolan";
import GToolkit from "../util/GToolkit";
import Waterween from "../depends/waterween/Waterween";
import {CubicBezier} from "../depends/easing/Easing";
import {FlowTweenTask} from "../depends/waterween/tweenTask/FlowTweenTask";


@UI.UICallOnly("")
export default class TestPanel extends TestPanel_Generate {
    private _nolan: Nolan;

    private _input: TouchInput;

    private _currCharacter: Gameplay.Character;

    private _originRotation: Type.Rotation;

    private _wantRotation: Type.Rotation = Type.Rotation.zero;

    private _flowTask: FlowTweenTask<unknown>;

    private _flowPitchTask: FlowTweenTask<number>;

    private _flowRollTask: FlowTweenTask<number>;

    private _isUpdate: boolean;

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
            },
            5e3,
        );

        this._flowPitchTask = Waterween.flow(
            () => {
                return this._wantRotation.x;
            },
            (val) => {
                this._wantRotation.x = val;
            },
            1e3,
            new CubicBezier(0, .4, .3, 1),
        );

        this._flowRollTask = Waterween.flow(
            () => {
                return this._wantRotation.y;
            },
            (val) => {
                this._wantRotation.y = val;
            },
            1e3,
            new CubicBezier(0, .4, .3, 1),
        );

        this.testButton.onClicked.add(this.onTestButtonClick);
        this.testButton1.onClicked.add(this.onTestButton1Click);
        this.testButton2.onClicked.add(this.onTestButton2Click);

        this._input = new TouchInput();
        this._input.setPlayerController();
        this._input.onTouchEnd.add(this.onClick);
    }

    protected onUpdate(d: number) {
        this._elapsed += d;
        if (!this._currCharacter) {
            this._currCharacter = Gameplay.getCurrentPlayer().character;
            this._originRotation = GToolkit.getCharacterMeshRotation(this._currCharacter);
        }

        // GToolkit.drawRay(this._currCharacter.worldLocation.clone().add(GToolkit.getCharacterCapsuleLowerCenterRelative(this._currCharacter)), Type.Vector.down);
        // GToolkit.drawRay(this._currCharacter.worldLocation, Type.Vector.down);
        GToolkit.detectCurrentCharacterTerrain(undefined, true);

        // this.calAngle();
        // const distRotation = this._originRotation.clone().add(this._wantRotation);
        // GToolkit.rotateCharacterMesh(this._currCharacter, distRotation.y, distRotation.z, distRotation.x);
    }

    private onTestButtonClick = () => {
        this._nolan.takeCamera();
        this._nolan.test();
    };

    private onTestButton1Click = () => {
    };

    private onTestButton2Click = () => {
        this._isUpdate = !this._isUpdate;
    };

    private onClick = () => {
        const input = this._input.getTouchVectorArray()[0];
        this._flowTask.to({
            x: input.x,
            y: input.y,
        });
    };

    private calAngle() {
        const [sideAngle, frontAngle] = GToolkit.calCentripetalAngle(this._currCharacter);

        this._flowPitchTask.to(sideAngle * 0.75);
        this._flowRollTask.to(frontAngle * 0.75);
    }
}
