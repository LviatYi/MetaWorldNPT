import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","assetId","loopCount","volume","isSpatial","attenuationDistanceModel","attenuationShape","attenuationShapeExtents","falloffDistance","isUiSound","isExclusive","soundName","desc"],["","","","","","","","","","","","",""],[1,"34743",1,0.4,false,false,200,null,600,null,null,"主场景BGM",null],[2,"134703",0,0,null,null,0,null,0,null,null,null,null],[3,"13934",1,1,true,true,200,null,3000,null,null,"奔跑音效",null],[4,"124715",0,1,true,false,200,null,600,null,null,"跳跃按钮音效",null]];
export interface ISoundElement extends IElementBase{
 	/**ID*/
	id:number
	/**Asset ID*/
	assetId:string
	/**循环次数
<=0 不限次数
>0 指定次数*/
	loopCount:number
	/**音量大小*/
	volume:number
	/**是否 空间的*/
	isSpatial:boolean
	/**空间衰减函数模型
线性 0，指数 1，倒数 2，反指数 3*/
	attenuationDistanceModel:boolean
	/**空间衰减形状
球体 0，胶囊体 1，盒体 2，锥体 3*/
	attenuationShape:number
	/**空间衰减形状的范围
针对不同的衰减形状，该属性的意义不同*/
	attenuationShapeExtents:Array<number>
	/**空间衰减距离
空间衰减形状外 按照该距离进行衰减*/
	falloffDistance:number
	/**是否 UI 的
UI 音效在游戏暂停时仍播放*/
	isUiSound:boolean
	/**是否 独占的
独占音效在播放时会停止其他同 AssetId 音效*/
	isExclusive:boolean
	/**音效名称*/
	soundName:string
	/**备注*/
	desc:string
 } 
export class SoundConfig extends ConfigBase<ISoundElement>{
	constructor(){
		super(EXCELDATA);
	}

}