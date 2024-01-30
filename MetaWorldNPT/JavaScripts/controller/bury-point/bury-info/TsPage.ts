import {BuryInfo} from "../BuryPointController";
import {BuryEventDefine} from "../bury-event/BuryEventDefine";

export enum TsPageTypes {
    /**
     * 进入创角界面时上报.
     */
    Role = "role",
    /**
     * 进入大厅页面时上报.
     */
    Hall = "hall",
    /**
     * 进入背包界面时上报.
     */
    Bag = "bag",
    /**
     * 进入商城界面时上报.
     */
    Shop = "shop",
    /**
     * 进入时尚期刊界面时上报.
     */
    Journal = "journal",
    /**
     * 进入游戏选择界面时上报.
     */
    Game = "game",
    /**
     * 进入地图选择界面时上报.
     */
    Map = "map",
    /**
     * 进入挖宝兑换界面时上报.
     */
    DigShop = "digshop",
}

export class TsPage extends BuryInfo {
//#region Constant
    private static readonly DESC = "记录界面进入及使用情况";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public buryName: string = BuryEventDefine.TsPage;

    public buryDescription: string = TsPage.DESC;

    public page_name: TsPageTypes;

    constructor(type: TsPageTypes) {
        super();
        this.page_name = type;
    }
}