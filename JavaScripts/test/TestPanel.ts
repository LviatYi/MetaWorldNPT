import TestPanel_Generate from "../ui-generate/TestPanel_generate";
import Nolan from "../depends/nolan/Nolan";
import AccessorTween, {SingleTweenTask} from "../depends/waterween/Waterween";
import {CubicBezier} from "../depends/easing/Easing";
import GToolkit from "../util/GToolkit";
import Vector = Type.Vector;

@UI.UICallOnly("")
export default class TestPanel extends TestPanel_Generate {
    private _nolan: Nolan;

    private _input: TouchInput;

    private _currCharacter: Gameplay.Character;

    private _forceTransform: Type.Transform;

    private _elapsed: number = 0;

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;

        this._nolan = new Nolan();

        this.testButton.onClicked.add(this.onTestButtonClick);
        this.testButton1.onClicked.add(this.onTestButton1Click);

        this._input = new TouchInput();
        this._input.setPlayerController();
        this._input.onTouchEnd.add(this.onClick);

        setTimeout(() => {
        }, 5e3);
    }

    protected onUpdate(d: number) {
        this._elapsed += d;
        if (!this._currCharacter) {
            this._currCharacter = Gameplay.getCurrentPlayer().character;
            // this._currCharacter.physicsEnabled = false;
            setTimeout(() => {
                console.log("force look forward");
                this._currCharacter.lookAt(this._currCharacter.worldLocation.add(Vector.forward));
                console.log(`origin: ${GToolkit.getCharacterCapsuleLowerCenter(this._currCharacter)}`);
                // this._currCharacter.transform = GToolkit.rotateCharacterRoundCapsuleLowerCenter(this._currCharacter, 10);
                // console.log(`after: ${GToolkit.getCharacterCapsuleLowerCenter(this._currCharacter)}`);
            }, 1e3);

        }


        // console.log(`current: ${GToolkit.getCharacterCapsuleLowerCenter(this._currCharacter)}`);
        // updateAngle(this._currCharacter);
        GToolkit.drawRay(this._currCharacter.worldLocation.clone().add(GToolkit.getCharacterCapsuleLowerCenterRelative(this._currCharacter)), Type.Vector.down);
        GToolkit.drawRay(this._currCharacter.worldLocation, Type.Vector.down);
    }

    private onTestButtonClick = () => {
        console.log(`Test Button Clicked at ${Date.now()}`);
        console.log(`before: ${GToolkit.getCharacterCapsuleLowerCenter(this._currCharacter)}`);
        this._currCharacter.transform = GToolkit.rotateCharacterRoundCapsuleLowerCenter(this._currCharacter, 0, -10);
        console.log(`after: ${GToolkit.getCharacterCapsuleLowerCenter(this._currCharacter)}`);
        setTimeout(() => {
            console.log(`but current: ${GToolkit.getCharacterCapsuleLowerCenter(this._currCharacter)}`);
        }, 2e3);
        this._currCharacter.addMoveInput(Vector.forward);
    };

    private onTestButton1Click = () => {
        console.log(`Test Button 1 Clicked at ${Date.now()}`);
        console.log(`before: ${GToolkit.getCharacterCapsuleLowerCenter(this._currCharacter)}`);
        this._currCharacter.transform = GToolkit.rotateCharacterRoundCapsuleLowerCenter(this._currCharacter, 0, 10);
        console.log(`after: ${GToolkit.getCharacterCapsuleLowerCenter(this._currCharacter)}`);
        setTimeout(() => {
            console.log(`but current: ${GToolkit.getCharacterCapsuleLowerCenter(this._currCharacter)}`);
        }, 2e3);
        this._currCharacter.addMoveInput(Vector.forward);
    };

    private onClick = () => {
        const input = this._input.getTouchVectorArray()[0];
        // console.log(`clicked at input: ${input}`);
    };
}

function updateAngle(character: Gameplay.Character) {
    const hitInfo = GToolkit.detectCurrentCharacterTerrain(undefined, false);
    if (hitInfo) {
        const terrainNormal = hitInfo.impactNormal;
        const transform = character.transform;
        const currUp = transform.getUpVector();
        const currRight = transform.getRightVector();
        const currForward = transform.getForwardVector();

        const sideCrossNormal = Type.Vector.cross(currUp, currForward);
        const frontCrossNormal = Type.Vector.cross(currUp, currRight);

        const projSide = Type.Vector.projectOnPlane(
            terrainNormal,
            sideCrossNormal
        );
        const projFront = Type.Vector.projectOnPlane(
            terrainNormal,
            frontCrossNormal
        );

        let sideAngle: number = Type.Vector.angle3D(
            currUp,
            projSide);
        let frontAngle: number = Type.Vector.angle3D(
            currUp,
            projFront);

        sideAngle *= Type.Vector.angle3D(Type.Vector.cross(currUp, projSide), currRight) > 90 ? -1 : 1;
        frontAngle *= Type.Vector.angle3D(Type.Vector.cross(currUp, projFront), currForward) > 90 ? -1 : 1;

        const newTransform = GToolkit.rotateCharacterRoundCapsuleLowerCenter(
            character,
            frontAngle,
            sideAngle);

        // console.log(`want rotation is ${newTransform.rotation.x},${newTransform.rotation.y}`);
        // console.log(`current rotation is ${transform.rotation.x},${transform.rotation.y}`);
        // this._taskRotateX.to(newTransform.rotation.x);
        // this._taskLocationX.to(newTransform.location.x);
        // this._taskRotateY.to(newTransform.rotation.y);
        // this._taskLocationY.to(newTransform.location.y);
        character.transform = newTransform;
    }
}
