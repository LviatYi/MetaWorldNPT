
/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/TestPanel.ui
*/



@UIBind('UI/TestPanel.ui')
export default class TestPanel_Generate extends UIScript {
		private image_Internal: mw.Image
	public get image(): mw.Image {
		if(!this.image_Internal&&this.uiWidgetBase) {
			this.image_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/image') as mw.Image
		}
		return this.image_Internal
	}
	private testButton_Internal: mw.Button
	public get testButton(): mw.Button {
		if(!this.testButton_Internal&&this.uiWidgetBase) {
			this.testButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/testButton') as mw.Button
		}
		return this.testButton_Internal
	}
	private testButtonText_Internal: mw.TextBlock
	public get testButtonText(): mw.TextBlock {
		if(!this.testButtonText_Internal&&this.uiWidgetBase) {
			this.testButtonText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/testButton/testButtonText') as mw.TextBlock
		}
		return this.testButtonText_Internal
	}
	private testButton1_Internal: mw.Button
	public get testButton1(): mw.Button {
		if(!this.testButton1_Internal&&this.uiWidgetBase) {
			this.testButton1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/testButton1') as mw.Button
		}
		return this.testButton1_Internal
	}
	private testButtonText1_Internal: mw.TextBlock
	public get testButtonText1(): mw.TextBlock {
		if(!this.testButtonText1_Internal&&this.uiWidgetBase) {
			this.testButtonText1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/testButton1/testButtonText1') as mw.TextBlock
		}
		return this.testButtonText1_Internal
	}
	private testButton2_Internal: mw.Button
	public get testButton2(): mw.Button {
		if(!this.testButton2_Internal&&this.uiWidgetBase) {
			this.testButton2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/testButton2') as mw.Button
		}
		return this.testButton2_Internal
	}
	private testButtonText2_Internal: mw.TextBlock
	public get testButtonText2(): mw.TextBlock {
		if(!this.testButtonText2_Internal&&this.uiWidgetBase) {
			this.testButtonText2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/testButton2/testButtonText2') as mw.TextBlock
		}
		return this.testButtonText2_Internal
	}
	private testButton3_Internal: mw.Button
	public get testButton3(): mw.Button {
		if(!this.testButton3_Internal&&this.uiWidgetBase) {
			this.testButton3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/testButton3') as mw.Button
		}
		return this.testButton3_Internal
	}
	private testButtonText3_Internal: mw.TextBlock
	public get testButtonText3(): mw.TextBlock {
		if(!this.testButtonText3_Internal&&this.uiWidgetBase) {
			this.testButtonText3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/testButton3/testButtonText3') as mw.TextBlock
		}
		return this.testButtonText3_Internal
	}
	private text_Internal: mw.TextBlock
	public get text(): mw.TextBlock {
		if(!this.text_Internal&&this.uiWidgetBase) {
			this.text_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/text') as mw.TextBlock
		}
		return this.text_Internal
	}


 
	/**
	* onStart 之前触发一次
	*/
	protected onAwake() {
	}
	 
}
 