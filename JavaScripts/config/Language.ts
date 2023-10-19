import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","Value","Value_Ch","Value_J","Value_D"],["","Key|ReadByName","MainLanguage","ChildLanguage","ChildLanguage","ChildLanguage"],[1,"test_01","Test\\nline2","测试\\nline2",null,null]];
export interface ILanguageElement extends IElementBase{
 	/**id*/
	ID:number
	/**undefined*/
	Name:string
	/**英文*/
	Value:string
 } 
export class LanguageConfig extends ConfigBase<ILanguageElement>{
	constructor(){
		super(EXCELDATA);
	}
	/**测试\nline2*/
	get test_01():ILanguageElement{return this.getElement(1)};

}