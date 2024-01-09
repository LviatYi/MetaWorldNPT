/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * UI: UI/UIAnimLab/float/FloatCanvas.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/UIAnimLab/float/FloatCanvas.ui')
export default class FloatCanvas_Generate extends UIScript {
	private curtain_Internal: mw.Canvas
	public get curtain(): mw.Canvas {
		if(!this.curtain_Internal&&this.uiWidgetBase) {
			this.curtain_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/curtain') as mw.Canvas
		}
		return this.curtain_Internal
	}
	private top_Internal: mw.Canvas
	public get top(): mw.Canvas {
		if(!this.top_Internal&&this.uiWidgetBase) {
			this.top_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/curtain/top') as mw.Canvas
		}
		return this.top_Internal
	}
	private bottom_Internal: mw.Canvas
	public get bottom(): mw.Canvas {
		if(!this.bottom_Internal&&this.uiWidgetBase) {
			this.bottom_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/curtain/bottom') as mw.Canvas
		}
		return this.bottom_Internal
	}



	/**
	* onStart 之前触发一次
	*/
	protected onAwake() {
		this.initTextLan();
	}

    protected initTextLan() {
        
        //按钮多语言
        
        //文本多语言
        
        //文本多语言
        
    }

    private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let lanFunc = mw.UIScript.getBehavior("lan");
        lanFunc && lanFunc(ui);
    }
}
 