import { GameConfig } from "../../config/GameConfig";
import { ILanguageElement } from "../../config/Language";
import { Yoact } from "../yoact/Yoact";
import Log4Ts from "../log4ts/Log4Ts";
import createYoact = Yoact.createYoact;
import bindYoact = Yoact.bindYoact;
import stopEffect = Yoact.stopEffect;

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
    LanKey: "Default",
};
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Core 核心功能 请勿修改

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
 * @desc     i18n.lan(i18n.lanKeys.LanKey);
 * @desc </code>
 * @desc short for:
 * @desc <code>
 * @desc     i18n.resolves.LanKey();
 * @desc </code>
 * @desc with yoact for:
 * @desc <code>
 * @desc    i18n.bind(txtAny, i18n.lanKeys.LanKey);
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
 * @version 1.6.2b
 */
class i18n {
    /**
     * Lan Config Keys.
     * @type {ResolveTable}
     */
    public lanKeys: LanguageTable;

    /**
     * Resolve Config Values.
     * @type {ResolveTable}
     */
    public resolves: ResolveTable;

    private _languageType: { data: LanguageTypes } = createYoact({data: LanguageTypes.English});

    private _lastLanguageType: number = -1;

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
     * i18n 响应式本地化.
     * @desc 当语言切换时, 会自动更新绑定的文本.
     * @param {{text: string}} textWidget
     * @param {string} key
     * @param params
     * @profession
     */
    public bind(textWidget: { text: string }, key: string, ...params: unknown[]): Yoact.Effect {
        return bindYoact(
            () => {
                if (this._languageType.data !== this._lastLanguageType) {
                    Log4Ts.log(i18n, `changed language. current language: ${this._languageType.data}`);
                    this._lastLanguageType = this._languageType.data;
                }
                textWidget.text = this.lan(key, params);
            },
        );
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

            this[keyEffect] = this.bind(ui, keyOrString);
        });
        mw.UIScript.addBehavior("unregister", (ui: mw.StaleButton | mw.TextBlock) => {
            this._staticUiLanKeyMap.delete(ui);
            this[keyEffect] && stopEffect(this[keyEffect] as Yoact.Effect);
        });
    }

    /**
     * 初始化.
     */
    public init(): this {
        this.lanKeys = {} as LanguageTable;
        for (const key of Object.keys(languageDefault)) {
            this.lanKeys[key] = key;
        }
        for (const key of Object.keys(languageDefault)) {
            this.resolves[key] = (...params: unknown[]) => this.lan(key, params);
        }
        return this;
    }

    /**
     * 使用指定语种.
     * @param languageType
     * @param force 是否 强制刷新.
     */
    public use(languageType: LanguageTypes = 0, force: boolean = false): this {
        if (this._languageType.data === languageType && !force) return this;
        this._languageType.data = languageType;
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
        return this._languageType.data;
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

type LanguageTable = {
    [Property in keyof typeof languageDefault]: Property;
};

type ResolveTable = {
    [Property in keyof typeof languageDefault]: (...params: unknown[]) => string;
};

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

const keyEffect = Symbol("UI_I18N_EFFECT");

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Export

export default new i18n().init().use();
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄