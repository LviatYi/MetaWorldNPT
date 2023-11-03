import {BuryInfo} from "../BuryPointController";
import {BuryEventDefine} from "../bury-event/BuryEventDefine";

export enum TsGameResultBuryRecordTypes {
    Shop = "shop",
    Reward = "reward",
    Treasure = "treasure",
    DigShop = "digshop",
}

class TsGameResultBuryInfo extends BuryInfo {
//#region Constant
    private static readonly DESC = "记录游戏情况";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public buryName: string = BuryEventDefine.TsGameResult;

    public buryDescription: string = TsGameResultBuryInfo.DESC;

    public record: string;
    public round: number;
    public camp: number;
    public value: number;
    public qte_01: number;
    public qte_02: number;

    constructor(record: string, round: number, camp: number, value: number, qte_01: number, qte_02: number) {
        super();
        this.record = record;
        this.round = round;
        this.camp = camp;
        this.value = value;
        this.qte_01 = qte_01;
        this.qte_02 = qte_02;
    }
}

export enum ShopResultBuryItemTypes {
    SuitPart = 1,
}

export class ShopResultBuryInfo extends TsGameResultBuryInfo {
    constructor(
        itemType: ShopResultBuryItemTypes,
        id: number,
        value: number) {
        super(TsGameResultBuryRecordTypes.Reward,
            itemType,
            id,
            value,
            undefined,
            undefined);
    }
}

export enum SubGameTypes {
    Null,
    Ski,
    Obby,
    Chase,
}

export enum RewardTypes {
    Null,
    SuitTicket
}

export class RewardResultBuryInfo extends TsGameResultBuryInfo {
    constructor(subGameType: SubGameTypes,
                rewardType: RewardTypes,
                value: number) {
        super(TsGameResultBuryRecordTypes.Reward,
            subGameType,
            rewardType,
            value,
            undefined,
            undefined);
    }
}

export enum DigTreasureTypes {
    /**
     * 空置.
     */
    Null,
    /**
     * 基础.
     */
    Normal,
    /**
     * 稀有.
     */
    Rare
}

export enum DigTreasureContentTypes {
    /**
     * 空置.
     */
    Null,

    /**
     * 服装碎片.
     */
    SuitFragment,
    /**
     * 服装单品.
     */
    SuitItem,
}

export class DigTreasureResultBuryInfo extends TsGameResultBuryInfo {
    constructor(
        treasureType: DigTreasureTypes,
        contentType: DigTreasureContentTypes,
        value: number) {
        super(TsGameResultBuryRecordTypes.Treasure,
            treasureType,
            contentType,
            value,
            undefined,
            undefined);
    }
}

export class DigExchangeResultBuryInfo extends TsGameResultBuryInfo {
    constructor(
        id: number,
        value: number) {
        super(TsGameResultBuryRecordTypes.DigShop,
            id,
            value,
            undefined,
            undefined,
            undefined);
    }
}