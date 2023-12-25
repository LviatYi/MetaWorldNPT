import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","nextId","content","sourceId","interactNodeIds"],["","","","",""],[1,2,"1",0,null],[2,3,"Dialogue0001",2,[1,2,5]],[3,4,"Dialogue0002",1,null],[4,5,"Dialogue0003",2,null],[5,6,"Dialogue0004",1,null],[6,0,"Dialogue0005",2,[3,4]],[7,0,"Dialogue0006",1,null],[8,0,"Dialogue0007",1,null],[9,0,"Dialogue0008",2,[2]],[10,11,"Dialogue0009",1,null],[11,12,"Dialogue0010",3,null],[12,13,"Dialogue0011",1,null],[13,14,"Dialogue0012",3,null],[14,15,"Dialogue0013",3,null],[15,16,"Dialogue0014",1,null],[16,17,"Dialogue0015",3,null],[17,18,"Dialogue0016",1,null],[18,19,"Dialogue0017",3,null],[19,20,"Dialogue0018",1,null],[20,21,"Dialogue0019",3,null],[21,22,"Dialogue0020",3,null],[22,23,"Dialogue0021",1,null],[23,24,"Dialogue0022",3,null],[24,25,"Dialogue0023",1,null],[25,0,"Dialogue0024",3,null],[26,27,"Dialogue0025",4,null],[27,28,"Dialogue0026",1,null],[28,29,"Dialogue0027",4,null],[29,30,"Dialogue0028",4,null],[30,31,"Dialogue0029",1,null],[31,32,"Dialogue0030",4,null],[32,33,"Dialogue0031",1,null],[33,34,"Dialogue0032",4,null],[34,35,"Dialogue0033",1,null],[35,36,"Dialogue0034",4,null],[36,37,"Dialogue0035",1,null],[37,38,"Dialogue0036",4,null],[38,39,"Dialogue0037",1,null],[39,40,"Dialogue0038",4,null],[40,41,"Dialogue0039",1,null],[41,0,"Dialogue0040",4,null],[42,43,"Dialogue0041",5,null],[43,44,"Dialogue0042",1,null],[44,45,"Dialogue0043",5,null],[45,46,"Dialogue0044",5,null],[46,47,"Dialogue0045",5,null],[47,48,"Dialogue0046",1,null],[48,0,"Dialogue0047",5,null],[49,50,"Dialogue0048",6,null],[50,51,"Dialogue0049",1,null],[51,52,"Dialogue0050",6,null],[52,53,"Dialogue0051",6,null],[53,54,"Dialogue0052",6,null],[54,55,"Dialogue0053",6,null],[55,56,"Dialogue0054",6,null],[56,57,"Dialogue0055",1,null],[57,0,"Dialogue0056",6,null],[58,59,"Dialogue0057",7,null],[59,60,"Dialogue0058",1,null],[60,61,"Dialogue0059",7,null],[61,62,"Dialogue0060",7,null],[62,63,"Dialogue0061",7,null],[63,64,"Dialogue0062",7,null],[64,65,"Dialogue0063",7,null],[65,66,"Dialogue0064",1,null],[66,0,"Dialogue0065",7,null],[67,68,"Dialogue0066",8,null],[68,69,"Dialogue0067",1,null],[69,70,"Dialogue0068",8,null],[70,71,"Dialogue0069",8,null],[71,72,"Dialogue0070",8,null],[72,73,"Dialogue0071",1,null],[73,0,"Dialogue0072",8,null],[74,75,"Dialogue0073",9,null],[75,76,"Dialogue0074",1,null],[76,77,"Dialogue0075",9,null],[77,78,"Dialogue0076",9,null],[78,79,"Dialogue0077",1,null],[79,0,"Dialogue0078",9,null]];
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
 } 
export class DialogueContentNodeConfig extends ConfigBase<IDialogueContentNodeElement>{
	constructor(){
		super(EXCELDATA);
	}

}