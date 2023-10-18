import {Util} from "./util/Util.js";
import FloatPanel from "./lab/ui/FloatPanel";
import {GameConfig} from "./config/GameConfig";
import {defaultGetLanguage} from "./depends/i18n/i18n";
import LanguageType = Type.LanguageType;

@Core.Class
export default class GameLauncher extends Core.Script {
    private _floatPanel: FloatPanel;

//region MetaWorld Event
    protected onStart(): void {
        super.onStart();
        this.useUpdate = true;
        console.log("Game Launched");
//region Member init
        Util.Initialize();
        GameConfig.initLanguage(LanguageType.Chinese, defaultGetLanguage);
        // this._floatPanel = UIManager.instance.getUI(FloatPanel);
//endregion ------------------------------------------------------------------------------------------------------

//region Widget bind
//endregion ------------------------------------------------------------------------------------------------------

//region Event subscribe
//endregion ------------------------------------------------------------------------------------------------------
        TimeUtil.delayExecute(this.delayExecute, 200);
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
