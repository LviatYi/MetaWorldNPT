import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","contentNodeId","content","funcId","icon"],["","","","",""],[1,3,"CharacterInteract0001",1,null],[127,129,"Say bye",127,null]];
export interface IDialogueInteractNodeElement extends IElementBase{
 	/**ID*/
	id:number
	/**对话内容节点 ID*/
	contentNodeId:number
	/**内容*/
	content:string
	/**对话节点功能 ID*/
	funcId:number
	/**图标*/
	icon:string
 } 
export class DialogueInteractNodeConfig extends ConfigBase<IDialogueInteractNodeElement>{
	constructor(){
		super(EXCELDATA);
	}

}