﻿/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 1.0.8
 * UI: UI/UIAnimLab/tween/TweenElement.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/UIAnimLab/tween/TweenElement.ui')
export default class TweenElement_Generate extends UIScript {
	private imgMain_Internal: mw.Image
	public get imgMain(): mw.Image {
		if(!this.imgMain_Internal&&this.uiWidgetBase) {
			this.imgMain_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/imgMain') as mw.Image
		}
		return this.imgMain_Internal
	}
	private imgArrow_Internal: mw.Image
	public get imgArrow(): mw.Image {
		if(!this.imgArrow_Internal&&this.uiWidgetBase) {
			this.imgArrow_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/imgArrow') as mw.Image
		}
		return this.imgArrow_Internal
	}



	protected onAwake() {
		this.initTextLan();
	}

    public destroy(): void {
        this.unregisterTextLan();
        super.destroy();
    }

    protected initTextLan() {
        // 文本按钮多语言
        
        // 静态文本按钮多语言
        
        // 文本多语言
        
        // 静态文本多语言
        
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        // 隐藏文本多语言
        
    }

    private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let lanFunc = mw.UIScript.getBehavior("lan");
        lanFunc?.(ui);
    }

    private unregisterLanKey(ui: mw.StaleButton | mw.TextBlock) {
        let unregisterFunc = mw.UIScript.getBehavior("unregister");
        unregisterFunc?.(ui);
    }
}
 