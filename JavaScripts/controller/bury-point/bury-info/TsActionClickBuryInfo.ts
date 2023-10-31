import {BuryInfo} from "../BuryPointController";
import {BuryEventDefine} from "../bury-event/BuryEventDefine";

export class TsActionClickBuryInfo extends BuryInfo {
//#region Constant
    private static readonly TS_ACTION_CLICK_BURY_DESC = "记录游戏中的各种事件";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public buryName: string = BuryEventDefine.TsActionClick;

    public buryDescription: string = TsActionClickBuryInfo.TS_ACTION_CLICK_BURY_DESC;

    public scene_id: number;
    public button: string;
    public resource_1: number;
    public resource_2: number;
    public resource_3: number;
    public resource_4: number;

    constructor(
        scene_id: number,
        button: string,
        resource_1: number,
        resource_2: number,
        resource_3: number,
        resource_4: number) {
        super();
        this.scene_id = scene_id;
        this.button = button;
        this.resource_1 = resource_1;
        this.resource_2 = resource_2;
        this.resource_3 = resource_3;
        this.resource_4 = resource_4;
    }
}