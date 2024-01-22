import FloatPanel from "./lab/ui/float/FloatPanel";
import { TestPanel } from "./test/TestPanel";

@Component
export default class GameLauncher extends mw.Script {
    private _floatPanel: FloatPanel;

//region MetaWorld Event
    protected onStart(): void {
        super.onStart();
        this.useUpdate = true;
        console.log("Game Launched");
//region Member init
//         UIService.show(UIDefault);
        UIService.show(TestPanel);
//endregion ------------------------------------------------------------------------------------------------------

//region Widget bind
//endregion ------------------------------------------------------------------------------------------------------

//region Event subscribe
//endregion ------------------------------------------------------------------------------------------------------
        setTimeout(
            this.delayExecute,
            200);
    }

    protected onUpdate(dt: number): void {
        super.onUpdate(dt);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

//endregion

//region Init
//endregion

    public delayExecute: () => void = () => {
    };

//region Event Callback
//endregion
}
