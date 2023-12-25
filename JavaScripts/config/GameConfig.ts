import {ConfigBase, IElementBase} from "./ConfigBase";
import {DialogueContentNodeConfig} from "./DialogueContentNode";
import {DialogueEntityConfig} from "./DialogueEntity";
import {DialogueFuncConfig} from "./DialogueFunc";
import {DialogueInteractNodeConfig} from "./DialogueInteractNode";
import {LanguageConfig} from "./Language";
import {SoundConfig} from "./Sound";

export class GameConfig{
	private static configMap:Map<string, ConfigBase<IElementBase>> = new Map();
	/**
	* 多语言设置
	* @param languageIndex 语言索引(-1为系统默认语言)
	* @param getLanguageFun 根据key获取语言内容的方法
	*/
	public static initLanguage(languageIndex:number, getLanguageFun:(key:string|number)=>string){
		ConfigBase.initLanguage(languageIndex, getLanguageFun);
		this.configMap.clear();
	}
	public static getConfig<T extends ConfigBase<IElementBase>>(ConfigClass: { new(): T }): T {
		if (!this.configMap.has(ConfigClass.name)) {
			this.configMap.set(ConfigClass.name, new ConfigClass());
		}
		return this.configMap.get(ConfigClass.name) as T;
	}
	public static get DialogueContentNode():DialogueContentNodeConfig{ return this.getConfig(DialogueContentNodeConfig) };
	public static get DialogueEntity():DialogueEntityConfig{ return this.getConfig(DialogueEntityConfig) };
	public static get DialogueFunc():DialogueFuncConfig{ return this.getConfig(DialogueFuncConfig) };
	public static get DialogueInteractNode():DialogueInteractNodeConfig{ return this.getConfig(DialogueInteractNodeConfig) };
	public static get Language():LanguageConfig{ return this.getConfig(LanguageConfig) };
	public static get Sound():SoundConfig{ return this.getConfig(SoundConfig) };
}