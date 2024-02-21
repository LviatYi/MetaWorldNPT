import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","name"],["",""],[1,"经验+3"]];
export interface IDialogueFuncElement extends IElementBase{
 	/**ID*/
	id:number
	/**名称 \*/
	name:string
 } 
export class DialogueFuncConfig extends ConfigBase<IDialogueFuncElement>{
	constructor(){
		super(EXCELDATA);
	}

}