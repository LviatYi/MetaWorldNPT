/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * UI: UI/UIScrollerViewLab/PredictionItem.ui
*/

import UIScript = mw.UIScript;


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
		this.initTextLan();
	}

    protected initTextLan() {
        
        this.initLanguage(this.selectBtn);
        
	
        //按钮多语言
        
        //文本多语言
        
        this.initLanguage(this.idText)
        
	
        this.initLanguage(this.infoText)
        
	
        //文本多语言
        
    }

    private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let lanFunc = mw.UIScript.getBehavior("lan");
        lanFunc && lanFunc(ui);
    }
}
 