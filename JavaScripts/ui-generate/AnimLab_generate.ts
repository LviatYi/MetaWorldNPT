
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/AnimLab.ui
*/



@UIBind('UI/AnimLab.ui')
export default class AnimLab_Generate extends UIScript {
		private topCurtain_Internal: mw.Canvas
	public get topCurtain(): mw.Canvas {
		if(!this.topCurtain_Internal&&this.uiWidgetBase) {
			this.topCurtain_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/topCurtain') as mw.Canvas
		}
		return this.topCurtain_Internal
	}
	private topCurtainBg_Internal: mw.Image
	public get topCurtainBg(): mw.Image {
		if(!this.topCurtainBg_Internal&&this.uiWidgetBase) {
			this.topCurtainBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/topCurtain/topCurtainBg') as mw.Image
		}
		return this.topCurtainBg_Internal
	}
	private bottomCurtain_Internal: mw.Canvas
	public get bottomCurtain(): mw.Canvas {
		if(!this.bottomCurtain_Internal&&this.uiWidgetBase) {
			this.bottomCurtain_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/bottomCurtain') as mw.Canvas
		}
		return this.bottomCurtain_Internal
	}
	private bottomCurtainBg_Internal: mw.Image
	public get bottomCurtainBg(): mw.Image {
		if(!this.bottomCurtainBg_Internal&&this.uiWidgetBase) {
			this.bottomCurtainBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/bottomCurtain/bottomCurtainBg') as mw.Image
		}
		return this.bottomCurtainBg_Internal
	}


 
	/**
	* onStart 之前触发一次
	*/
	protected onAwake() {
	}
	 
}
 