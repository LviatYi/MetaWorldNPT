
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/UIScrollerViewLab/PredictionItem.ui
*/



@UIBind('UI/UIScrollerViewLab/PredictionItem.ui')
export default class PredictionItem_Generate extends UIScript {
		private image_Internal: mw.Image
	public get image(): mw.Image {
		if(!this.image_Internal&&this.uiWidgetBase) {
			this.image_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/image') as mw.Image
		}
		return this.image_Internal
	}
	private idText_Internal: mw.TextBlock
	public get idText(): mw.TextBlock {
		if(!this.idText_Internal&&this.uiWidgetBase) {
			this.idText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/idText') as mw.TextBlock
		}
		return this.idText_Internal
	}
	private infoText_Internal: mw.TextBlock
	public get infoText(): mw.TextBlock {
		if(!this.infoText_Internal&&this.uiWidgetBase) {
			this.infoText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/infoText') as mw.TextBlock
		}
		return this.infoText_Internal
	}
	private selectBtn_Internal: mw.StaleButton
	public get selectBtn(): mw.StaleButton {
		if(!this.selectBtn_Internal&&this.uiWidgetBase) {
			this.selectBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/selectBtn') as mw.StaleButton
		}
		return this.selectBtn_Internal
	}


 
	/**
	* onStart 之前触发一次
	*/
	protected onAwake() {
	}
	 
}
 