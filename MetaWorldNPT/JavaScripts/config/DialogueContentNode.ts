import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","nextId","content","sourceId","interactPredNodeIds"],["","","","",""],[1,2,"ExampleContent1",1,null],[2,0,"ExampleContent2",2,[[1]]],[3,0,"ExampleContent3",1,null],[127,128,"Test Node with next",127,null],[128,0,"Test Node with generator",128,null],[129,0,"Test Node for end",127,null]];
export interface IDialogueContentNodeElement extends IElementBase{
 	/**ID*/
	id:number
	/**下条内容 ID*/
	nextId:number
	/**内容*/
	content:string
	/**来源角色 ID*/
	sourceId:number
	/**可及性对话交互节点 IDs*/
	interactPredNodeIds:Array<Array<number>>
 } 
export class DialogueContentNodeConfig extends ConfigBase<IDialogueContentNodeElement>{
	constructor(){
		super(EXCELDATA);
	}

}