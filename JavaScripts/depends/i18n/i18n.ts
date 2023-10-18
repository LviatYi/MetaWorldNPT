import {GameConfig} from "../../config/GameConfig";
import {ILanguageElement} from "../../config/Language";

/**
 * 缺省多语言表.
 *
 * 开发环境中的语言配置表 允许在不打开 Excel 并再生成配置的情况下进行多语言控制.
 * 用于开发时快速定义缺省文本.
 *
 * 最佳实践要求 发布后此表数据不应被采纳.
 */
const languageDefault: { [key: string]: string } = {
    ["ts_language_1"]: "{0}通关成功，用时<color=#red>{1}</color>",

    ["UI_FashionMagazineSerialSuffix_1921681001"]: "期",

    ["UI_FashionMagazineAbleToStore_1921681002"]: "去购买",

    ["UI_FashionMagazineUnableToStore_1921681003"]: "服装和您的性别不符，仅供浏览哦",

    ["UI_GameSelectGameComingSoon_1921681004"]: "正在筹备",

    ["UI_ActOfMotion_1921681005"]: "动作",

    ["UI_ActOfExpression_1921681006"]: "表情",

    ["UI_Bag_1921681007"]: "背包",

    ["UI_Map_1921681006"]: "出行",
};

/**
 * i18n.
 * 文本本地化工具.
 *
 * It depends on GameConfigBase.
 * To use this, you need to initialize:
 * <code>
 *     GameConfig.initLanguage(LanguageType, defaultGetLanguage);
 * </code>
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 0.8.1a
 */
class i18n {
    /**
     * i18n 本地化.
     * 将文本翻译为当地语言.
     * @param keyOrText
     * @param params
     */
    public lan(keyOrText: string, ...params: any[]): string {
        let text: string = (GameConfig.Language[keyOrText] as ILanguageElement).Value;

        if (isNullOrEmpty(text)) {
            text = languageDefault[keyOrText];
        }

        if (isNullOrEmpty(text)) {
            text = keyOrText;
        }

        return StringUtil.format(text, ...params);
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

export default new i18n();