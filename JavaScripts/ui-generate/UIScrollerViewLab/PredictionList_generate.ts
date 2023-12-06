
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/UIScrollerViewLab/PredictionList.ui
*/



@UIBind('UI/UIScrollerViewLab/PredictionList.ui')
export default class PredictionList_Generate extends UIScript {
		private scrollBox_Internal: mw.ScrollBox
	public get scrollBox(): mw.ScrollBox {
		if(!this.scrollBox_Internal&&this.uiWidgetBase) {
			this.scrollBox_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrollBox') as mw.ScrollBox
		}
		return this.scrollBox_Internal
	}
	private container_Internal: mw.Canvas
	public get container(): mw.Canvas {
		if(!this.container_Internal&&this.uiWidgetBase) {
			this.container_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrollBox/container') as mw.Canvas
		}
		return this.container_Internal
	}
	private dataBindText_Internal: mw.TextBlock
	public get dataBindText(): mw.TextBlock {
		if(!this.dataBindText_Internal&&this.uiWidgetBase) {
			this.dataBindText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/dataBindText') as mw.TextBlock
		}
		return this.dataBindText_Internal
	}


 
	/**
	* onStart 之前触发一次
	*/
	protected onAwake() {
	}
	 
}
 