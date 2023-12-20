
//元素的基类
export interface IElementBase{
	id:number;
}
//配置的基类
export class ConfigBase<T extends IElementBase>{
	private static readonly TAG_KEY:string = 'Key';//读取键(除了ID之外的别名，带key的字段必须是string类型)
	private static readonly TAG_LANGUAGE:string = 'Language';//关联语言表的id或key(如果有这个tag，导表工具要把数据生成为string类型，因为会自动进行值的转换)
	private static readonly TAG_MAINLANGUAGE:string = 'MainLanguage';//主语言tag
	private static readonly TAG_CHILDLANGUAGE:string = 'ChildLanguage';//子语言tag

	private readonly ELEMENTARR:Array<T> = [];
	private readonly ELEMENTMAP:Map<number, T> = new Map<number, T>();
	private readonly KEYMAP:Map<number | string, number> = new Map();
	private static languageIndex:number = 0
	private static getLanguage:(key:string|number)=>string;

	public constructor(excelData:Array<Array<any>>){
		let headerLine:number = 2;//表头的行数
		this.ELEMENTARR = new Array(excelData.length - headerLine);
		
		for(let i = 0; i < this.ELEMENTARR.length; i++){
			this.ELEMENTARR[i] = {} as T
		}
		let column = excelData[0].length;//列数
		for(let j = 0; j < column; j++){//遍历各列
			let name:string = excelData[0][j];
			let tags:Array<string> = excelData[1][j].split('|');
			if(tags.includes(ConfigBase.TAG_CHILDLANGUAGE)) continue;
			let jOffect:number = 0;//列偏移量
			if(tags.includes(ConfigBase.TAG_MAINLANGUAGE)){
				let index = j + ConfigBase.languageIndex;
				let targetTags:Array<string> = excelData[1][index].split('|');
				if(index < column && targetTags.includes(ConfigBase.TAG_CHILDLANGUAGE)){
					jOffect = ConfigBase.languageIndex;
				}
			}
			let hasTag_Key:boolean = tags.includes(ConfigBase.TAG_KEY);
			let hasTag_Language:boolean = tags.includes(ConfigBase.TAG_LANGUAGE);
			for(let i = 0; i < this.ELEMENTARR.length; i++){
				let ele = this.ELEMENTARR[i];
				let value = excelData[i + headerLine][j + jOffect];
				if(j == 0){//ID
					this.ELEMENTMAP.set(value, ele);
				}else{
					if(hasTag_Key){
						this.KEYMAP.set(value, excelData[i + headerLine][0]);
					}
					if(hasTag_Language){
						if(ConfigBase.getLanguage != null){
							value = ConfigBase.getLanguage(value);
						}else{
							value = "unknow"
						}
					}
				}
				ele[name] = value;
			}
		}
	}
	//设置获取语言的方法
	public static initLanguage(languageIndex:number, getLanguageFun:(key:string|number)=>string){
		ConfigBase.languageIndex = languageIndex;
		ConfigBase.getLanguage = getLanguageFun;
		if(ConfigBase.languageIndex < 0){
			ConfigBase.languageIndex = ConfigBase.getSystemLanguageIndex();
		}
	}
	//获取系统语言索引
	private static getSystemLanguageIndex():number{
		let language = LocaleUtil.getDefaultLocale().toString().toLowerCase();
		if (!!language.match("en")) {
			return 0;
		}
		if (!!language.match("zh")) {
			return 1;
		}
		if (!!language.match("ja")) {
			return 2;
		}
		if (!!language.match("de")) {
			return 3;
		}
		return 0;
	}
	/**
	* 根据id获取一个元素
	* @param id id|key
	* @returns Element
	*/
	public getElement(id:number|string): T {
		let ele = this.ELEMENTMAP.get(Number(id)) || this.ELEMENTMAP.get(this.KEYMAP.get(id));
		if(ele == null){
			console.warn(this.constructor.name + "配置表中找不到元素 id:" + id);
		}
		return ele;
	}
	/**
	* 根据字段名和字段值查找一个元素
	* @param fieldName 字段名
	* @param fieldValue 字段值
	* @returns 第一个找到的Element
	*/
	public findElement(fieldName:string, fieldValue:any): T{
		for(let i = 0; i < this.ELEMENTARR.length; i++){
			if(this.ELEMENTARR[i][fieldName] == fieldValue){
				return this.ELEMENTARR[i];
			}
		}
	}
	/**
	* 根据字段名和字段值查找一组元素
	* @param fieldName 字段名
	* @param fieldValue 字段值
	* @returns 所有符合要求的Element
	*/
	public findElements(fieldName:string,fieldValue:any):Array<T>{
		let arr:Array<T> = [];
		for(let i = 0;i < this.ELEMENTARR.length;i++){
			if(this.ELEMENTARR[i][fieldName] == fieldValue){
				arr.push(this.ELEMENTARR[i]);
			}
		}
		return arr;
	}
	/**获取所有元素*/
	public getAllElement():Array<T>{
		return this.ELEMENTARR;
	}
}