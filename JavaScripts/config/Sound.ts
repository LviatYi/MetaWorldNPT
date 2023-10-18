import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","soundGuid","soundName","loopPlayBack","volume","isEffect","isStereo","innerRadius","falloffDistance","ps"],["","","","","","","","","",""],[1,"34743","主场景BGM",1,0.4,false,false,200,600,null],[2,"134703","通用按钮点击音效",0,0.3,true,false,200,600,null],[3,"13934","奔跑音效",1,1,true,true,200,3000,null],[4,"124715","跳跃按钮音效",0,1,true,false,200,600,null]];
export interface ISoundElement extends IElementBase{
 	/**ID*/
	id:number
	/**资源ID*/
	soundGuid:string
	/**音效名称*/
	soundName:string
	/**循环播放
0=不循环
1=循环*/
	loopPlayBack:number
	/**音量大小*/
	volume:number
	/**是否是音效
1=音效
0=BGM*/
	isEffect:boolean
	/**是否是3D音效*/
	isStereo:boolean
	/**内部半径*/
	innerRadius:number
	/**衰减距离*/
	falloffDistance:number
	/**备注*/
	ps:string
 } 
export class SoundConfig extends ConfigBase<ISoundElement>{
	constructor(){
		super(EXCELDATA);
	}

}