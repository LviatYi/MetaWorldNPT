import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","name","originPainting","isSubjective"],["","","",""],[1,"Me",null,true],[2,"Somebody",null,false]];
export interface IRelateEntityElement extends IElementBase{
 	/**ID*/
	id:number
	/**名称*/
	name:string
	/**立绘*/
	originPainting:string
	/**是否主体*/
	isSubjective:boolean
 } 
export class RelateEntityConfig extends ConfigBase<IRelateEntityElement>{
	constructor(){
		super(EXCELDATA);
	}

}