import { GameConfig } from "../../config/GameConfig";
import { ILanguageElement } from "../../config/Language";

//#region Config 配置区 用于 i18n 配置

/**
 * 多语言类型.
 * 此处映射应与 Language 配置表中的语言列顺序一致.
 *
 * 枚举值用于 ConfigBase.Language 初始化 Value 时计算偏移量.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export enum LanguageTypes {
    English,
    Chinese,
    Japanese,
    German,
}

/**
 * 缺省多语言表.
 *
 * 开发环境中的语言配置表 允许在不打开 Excel 并再生成配置的情况下进行多语言控制.
 * 用于开发时快速定义缺省文本.
 *
 * 最佳实践要求 发布后此表数据不应被采纳.
 */
let languageDefault = {
    //#region Bag
    BagItemName0001: "背包物体0001",

    Bag_004: "跟随",

    Bag_005: "休息",

    Bag_006: "数量",
    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    //#region CollectibleItem
    CollectLanKey0001: "采集",
    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    //#region TinyGame
    TinyGameLanKey0001: "拾取",

    TinyGameLanKey0002: "放下",

    TinyGameLanKey0003: "喷火",

    verifyCodeTooFrequently: "Code verify request too frequently.",
    verifyCodeFail: "Verification failed, please try again!",
    verifyCodeSuccess: "Verification success!",
    isVerifying: "Verifying now, please wait.",
    //#endregion

    //#region MainPanel
    Collection_002: "收集成功",

    Collection_003: "收集失败",

    Catch_002: "捕捉成功",

    Catch_003: "捕捉失败",

    Catch_004: "您的DragonBall不足，无法捕捉。",

    NonCandidateSceneDragon: "没有可捕获的龙娘哦！",

    Need_FireDargon: "You need to equip Fire Dragon",

    TinyGameLanKey0004: "恭喜通关小游戏，请在背包中查收奖励",

    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
};
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Core 核心功能 请勿修改

type LanguageTable = {
    [Property in keyof typeof languageDefault]: Property;
};

/**
 * i18n.
 * 文本本地化工具.
 * @desc ---
 * @desc It depends on GameConfigBase.
 * @desc To use specified language, you should call:
 * @desc <code>
 * @desc     i18n.use(LanguageType);
 * @desc </code>
 * @desc
 * @desc When releasing, you should call:
 * @desc <code>
 * @desc     i18n.release();
 * @desc </code>
 * @desc
 * @desc Recommended way to call the trans api:
 * @desc <code>
 * @desc     i18n.lan(i18n.keyTable.UI_Common_Tips);
 * @desc </code>
 * @desc ---
 * @desc register {@link UIScript.addBehavior} "lan" "register".
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.5.3b
 */
class i18n {
    /**
     * Lan Config Keys.
     */
    public keyTable: LanguageTable;

    private _languageType: LanguageTypes = 0;

    /**
     * 静态 lan key 持有映射.
     * @private
     */
    private _staticUiLanKeyMap: Map<mw.StaleButton | mw.TextBlock, string> = new Map();

    /**
     * i18n 本地化.
     * 将文本翻译为当地语言.
     * @param keyOrText
     * @param params
     */
    public lan(keyOrText: string, ...params: unknown[]): string {
        if (keyOrText === null || keyOrText === undefined) return "NullKey";

        let text: string = (GameConfig.Language[keyOrText] as ILanguageElement)?.Value;

        if (isNullOrEmpty(text)) {
            text = languageDefault ? languageDefault[keyOrText] : null;
        }

        if (isNullOrEmpty(text)) {
            text = keyOrText;
        }

        return StringUtil.format(text, ...params);
    }

    /**
     * you shouldn't call it.
     */
    public constructor() {
        mw.UIScript.addBehavior("lan", (ui: mw.StaleButton | mw.TextBlock) => {
            if (!ui || !("text" in ui)) return;
            let keyOrString: string;
            if (this._staticUiLanKeyMap.has(ui)) {
                keyOrString = this._staticUiLanKeyMap.get(ui);
            } else {
                keyOrString = ui.text;
                if (isNullOrEmpty(keyOrString)) return;
                this._staticUiLanKeyMap.set(ui, keyOrString);
            }

            ui.text = this.lan(keyOrString);
        });
        mw.UIScript.addBehavior("unregister", (ui: mw.StaleButton | mw.TextBlock) => {
            this._staticUiLanKeyMap.delete(ui);
        });
    }

    /**
     * 初始化.
     */
    public init(): this {
        this.keyTable = {} as LanguageTable;
        for (const key of Object.keys(languageDefault)) {
            this.keyTable[key] = key;
        }
        return this;
    }

    /**
     * 使用指定语种.
     * @param languageType
     */
    public use(languageType: LanguageTypes = 0): this {
        this._languageType = languageType;
        GameConfig.initLanguage(languageType, defaultGetLanguage);
        for (const [ui, lanKey] of this._staticUiLanKeyMap) {
            if (ui) ui.text = this.lan(lanKey);
        }
        return this;
    }

    /**
     * 当前使用的语种.
     */
    public currentLanguage(): LanguageTypes {
        return this._languageType;
    }

    /**
     * 发布版本时请调用.
     * @desc 用于清空 DefaultLanguage 表 以检查是否所有的 DL 条目都完成配表.
     * @profession
     */
    public release(isRelease: boolean = true): this {
        if (!isRelease) {
            return this;
        }
        languageDefault = null;
        return this;
    }
}

/**
 * default get language func.
 * @param key
 */
export function defaultGetLanguage(key: number | string) {
    const config = GameConfig.Language.getElement(key);
    if (!config) return "unknown_" + key;

    return config.Value;
}

function isNullOrEmpty(text: string): boolean {
    return text === undefined || text === null || text === "";
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Export

export default new i18n().init().use();
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄