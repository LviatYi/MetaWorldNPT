import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","name","originPainting"],["","",""],[1,"Me",null],[2,"CharacterName0001",null],[3,"CharacterName0002",null],[4,"CharacterName0003",null],[5,"CharacterName0004",null],[6,"CharacterName0005",null],[7,"CharacterName0006",null],[8,"CharacterName0007",null],[9,"CharacterName0008",null],[10,"CharacterName0009",null],[11,"CharacterName0010",null],[12,"CharacterName0011",null],[13,"CharacterName0012",null],[14,"CharacterName0013",null]];
export interface ICharacterElement extends IElementBase{
 	/**ID*/
	id:number
	/**名称*/
	name:string
	/**立绘*/
	originPainting:string
 } 
export class CharacterConfig extends ConfigBase<ICharacterElement>{
	constructor(){
		super(EXCELDATA);
	}

}