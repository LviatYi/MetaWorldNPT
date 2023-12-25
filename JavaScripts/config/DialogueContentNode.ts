import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","nextId","content","sourceId","interactNodeIds","interactGeneratorId"],["","","","","",""],[1,2,"ExampleContent1",1,null,0],[2,0,"ExampleContent2",2,[1],0],[3,0,"ExampleContent3",1,null,0]];
export interface IDialogueContentNodeElement extends IElementBase{
 	/**ID*/
	id:number
	/**下条内容 ID*/
	nextId:number
	/**内容*/
	content:string
	/**来源角色 ID*/
	sourceId:number
	/**对话交互节点列表 IDs*/
	interactNodeIds:Array<number>
	/**对话交互构建器 ID*/
	interactGeneratorId:number
 } 
export class DialogueContentNodeConfig extends ConfigBase<IDialogueContentNodeElement>{
	constructor(){
		super(EXCELDATA);
	}

}