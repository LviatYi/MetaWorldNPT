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
    Japanese
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
    ["UI_FashionMagazineSerialSuffix"]: "期",

    ["UI_FashionMagazineAbleToStore"]: "去购买",

    ["UI_FashionMagazineUnableToStore"]: "服装和您的性别不符，仅供浏览哦",

    ["UI_GameSelectGameComingSoon"]: "正在筹备",

    ["UI_ActOfMotion"]: "动作",

    ["UI_ActOfExpression"]: "表情",

    ["UI_Common_Tips"]: "提示",

    ["UI_Create_Role_Tips"]: "确认创建该角色？\n一旦创建，性别将无法更改",
};

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Core 核心功能 请勿修改

type LanguageTable = {
    [Property in keyof typeof languageDefault]: Property;
};

/**
 * i18n.
 * 文本本地化工具.
 *
 * It depends on GameConfigBase.
 * To use specified language, you should call:
 * <code>
 *     i18n.use(LanguageType);
 * </code>
 *
 * When releasing, you should call:
 * <code>
 *     i18n.release();
 * </code>
 *
 * Recommended way to call the trans api:
 * <code>
 *     i18n.lan(i18n.keyTable.UI_Common_Tips);
 * </code>
 *
 *
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.5.0b
 */
class i18n {
    /**
     * Lan Config Keys.
     */
    public keyTable: LanguageTable;

    private _languageType: LanguageTypes = 0;

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
            let keyOrString: string = ui.text;
            if (isNullOrEmpty(keyOrString)) {
                return;
            }

            ui.text = this.lan(keyOrString);
            return;
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
     * 用于清空 DefaultLanguage 表 以检查是否所有的 DL 条目都完成配表.
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
    if (!config) {
        return "unknown_" + key;
    }

    return config.Value;
}

function isNullOrEmpty(text: string): boolean {
    return text === undefined || text === null || text === "";
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Export

export default new i18n().init().use();
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄