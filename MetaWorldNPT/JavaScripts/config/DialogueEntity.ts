import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","name","originPainting","isSubjective"],["","","",""],[1,"Me",null,true],[2,"Somebody",null,false]];
export interface IDialogueEntityElement extends IElementBase{
 	/**ID*/
	id:number
	/**名称*/
	name:string
	/**立绘*/
	originPainting:string
	/**是否主体*/
	isSubjective:boolean
 } 
export class DialogueEntityConfig extends ConfigBase<IDialogueEntityElement>{
	constructor(){
		super(EXCELDATA);
	}

}