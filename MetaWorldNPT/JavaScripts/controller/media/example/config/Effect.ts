import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","assetId","loopCountOrDuration","positionOffset","rotation","scale","slotType","floatParams","floatRandomParams","vectorParams","vectorRandomParams","colorParams","colorRandomParams","cullDistance","singleLength"],["","","","","","","","","","","","","","",""],[1,"4336",3,null,null,new mw.Vector(2,1,1),0,null,null,null,null,null,null,0,0],[2,"13407",3000,new mw.Vector(100,0,0),null,null,0,null,null,null,null,null,null,0,0]];
export interface IEffectElement extends IElementBase{
 	/**ID*/
	id:number
	/**Asset ID*/
	assetId:string
	/**循环次数或时长

当特效为循环特效时 该属性作为循环时长 ms
当特效为非循环特效时 该属性作为循环次数*/
	loopCountOrDuration:number
	/**位置偏移量*/
	positionOffset:mw.Vector
	/**旋转*/
	rotation:mw.Vector
	/**缩放*/
	scale:mw.Vector
	/**人形角色插槽类型*/
	slotType:number
	/**浮点数

length:10|width:20*/
	floatParams:Array<string>
	/**随机浮点数*/
	floatRandomParams:Array<string>
	/**向量*/
	vectorParams:Array<string>
	/**随机向量*/
	vectorRandomParams:Array<string>
	/**色彩*/
	colorParams:Array<string>
	/**随机色彩

back-color:#FF0000*/
	colorRandomParams:Array<string>
	/**#FF2222*/
	cullDistance:number
	/**裁剪距离

与玩家之间超出此距离的对象将被剪裁*/
	singleLength:number
 } 
export class EffectConfig extends ConfigBase<IEffectElement>{
	constructor(){
		super(EXCELDATA);
	}

}