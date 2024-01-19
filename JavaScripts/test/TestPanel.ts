import TestPanel_Generate from "../ui-generate/TestPanel_generate";
import GToolkit from "../util/GToolkit";
import Nolan from "../depend/nolan/Nolan";
import Log4Ts from "../depend/log4ts/Log4Ts";
import { TestModuleC } from "../module/TestModule";
import ByteArray from "../depend/byteArray/ByteArray";
import CircleMask from "../lab/ui/circle-mask/CircleMask";
import KeyOperationManager from "../controller/key-operation-manager/KeyOperationManager";
import Player = mw.Player;
import Camera = mw.Camera;

export class TestPanel extends TestPanel_Generate {
//#region View Props
//     private _testPanel: BagPanel;
    private _isDebug: boolean = true;
    private _nolan: Nolan;

    private _module: TestModuleC;

    private _circleCount: number = 0;

    private _targetCount: number = 100;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region MetaWorld UI Event

    protected onAwake(): void {
        super.onAwake();
        this.canUpdate = true;

//#region Member init
        this._module = ModuleService.getModule(TestModuleC);

        KeyOperationManager.getInstance().onKeyDown(mw.Keys.SpaceBar, this, () => {
            Log4Ts.log(TestPanel, `space clicked`);
        });

//#endregion ------------------------------------------------------------------------------------------

//#region Widget bind
        this._nolan = Nolan.getInstance();
        this.testButton.onClicked.add(this.onTestBtn0Click);
        this.testButton1.onClicked.add(this.onTestBtn1Click);
        this.testButton2.onClicked.add(this.onTestBtn2Click);
        this.testButton3.onClicked.add(this.onTestBtn3Click);
//#endregion ------------------------------------------------------------------------------------------

//#region Event subscribe
        Event.addLocalListener("CircleMaskGenerateDone", this.onCircleGenerated);
//#endregion ------------------------------------------------------------------------------------------
    }

    protected onUpdate() {
        if (this._isDebug) {
            GToolkit.drawRay(
                (this._nolan["_main"] as Camera).worldTransform.position,
                Player.getControllerRotation().rotateVector(Vector.forward),
            );
        }
    }

    protected onShow() {
    }

    protected onHide() {
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Init
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region UI Behavior
    public showInfo(info: string) {
        this.text.text = info;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Event Callback
    private onTestBtn0Click = () => {
        Log4Ts.log(TestPanel, `test T click`);
        if (this._circleCount > 0) {
            this._circleCount = 0;
            const circles = GameObject.findGameObjectById("ComponentRoot").getComponents(CircleMask);
            for (const circle of circles) {
                circle.destroy();
            }
            Log4Ts.log(TestPanel, `destroy all mask.`);
        } else {
            this._targetCount = 1000;
            for (let i = 0; i < this._targetCount; ++i) {
                GameObject.findGameObjectById("ComponentRoot").addComponent(CircleMask);
            }
            Log4Ts.log(TestPanel, `generate masks.`);
        }
    };

    private onTestBtn1Click = () => {
        Log4Ts.log(TestPanel, `test J click`);
        this._nolan.reset();
    };

    private onTestBtn2Click = () => {
        Log4Ts.log(TestPanel, `test K click`);
        this._module.testFetch();
    };

    private onTestBtn3Click = () => {
        Log4Ts.log(TestPanel, `test L click`);

        testByteArray();
    };

    private onCircleGenerated = () => {
        ++this._circleCount;
        if (this._targetCount === this._circleCount) {
            Log4Ts.log(TestPanel, `circle mask generate done. count: ${CircleMask.count}`);
        }
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

function testByteArray() {
    const byteLength = 17;
    const count = 10000;
    const data = new Array(count);

    for (let i = 0; i < count; ++i) {
        data[i] = Math.random() * (2 ** byteLength) | 0;
    }

    Log4Ts.log(TestPanel, `generate data byteLength: ${byteLength},count: ${count}`);

    const startTime = Date.now();
    const byteArray = ByteArray.createInstance(count, byteLength);
    for (let i = 0; i < count; ++i) {
        byteArray.setValue(i, data[i]);
    }

    const createTime = Date.now();
    const dataString = byteArray.toString();
    const encodeTime = Date.now();
    const byteArray2 = ByteArray.fromString(dataString, count, byteLength);
    const decodeTime = Date.now();

    Log4Ts.log(TestPanel, `byte array createTime: ${createTime - startTime}ms`);
    Log4Ts.log(TestPanel, `string length: ${dataString.length}`);
    Log4Ts.log(TestPanel, `pure string encodeTime: ${encodeTime - createTime}ms`);
    Log4Ts.log(TestPanel, `pure string decodeTime: ${decodeTime - encodeTime}ms`);

    for (let i = 0; i < count; ++i) {
        if (data[i] !== byteArray2.getValue(i)) {
            Log4Ts.error(testByteArray, `not work`);
        }
    }
}

function setValue(byteArray: ByteArray, x: number, y: number, value: boolean, rowCount: number) {
    byteArray.setValue(x + y * rowCount, value);
}

function getValue(byteArray: ByteArray, x: number, y: number, value: boolean, rowCount: number): boolean {
    return !!byteArray.getValue(x + y * rowCount);
}

function createByteArray(rowCount: number, columnCount: number): ByteArray {
    return ByteArray.createInstance(rowCount * columnCount, 1);
}

function stringify(byteArray: ByteArray): string {
    return byteArray.toString();
}

function parse(data: string, rowCount: number, columnCount: number, byteLength: number = 1): ByteArray {
    return ByteArray.fromString(data, rowCount * columnCount, byteLength);
}