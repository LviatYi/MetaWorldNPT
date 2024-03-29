﻿/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 1.0.8
 * UI: UI/mw-module-bag/BagMain.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/mw-module-bag/BagMain.ui')
export default class BagMain_Generate extends UIScript {
	private btn1_Internal: mw.StaleButton
	public get btn1(): mw.StaleButton {
		if(!this.btn1_Internal&&this.uiWidgetBase) {
			this.btn1_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/MWCanvas_1/btn1') as mw.StaleButton
		}
		return this.btn1_Internal
	}
	private btn2_Internal: mw.StaleButton
	public get btn2(): mw.StaleButton {
		if(!this.btn2_Internal&&this.uiWidgetBase) {
			this.btn2_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/MWCanvas_1/btn2') as mw.StaleButton
		}
		return this.btn2_Internal
	}
	private btn3_Internal: mw.StaleButton
	public get btn3(): mw.StaleButton {
		if(!this.btn3_Internal&&this.uiWidgetBase) {
			this.btn3_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/MWCanvas_1/btn3') as mw.StaleButton
		}
		return this.btn3_Internal
	}
	private mScrollBox_Internal: mw.ScrollBox
	public get mScrollBox(): mw.ScrollBox {
		if(!this.mScrollBox_Internal&&this.uiWidgetBase) {
			this.mScrollBox_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/mScrollBox') as mw.ScrollBox
		}
		return this.mScrollBox_Internal
	}
	private mContent_Internal: mw.Canvas
	public get mContent(): mw.Canvas {
		if(!this.mContent_Internal&&this.uiWidgetBase) {
			this.mContent_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/mScrollBox/mContent') as mw.Canvas
		}
		return this.mContent_Internal
	}
	private infoCanvas_Internal: mw.Canvas
	public get infoCanvas(): mw.Canvas {
		if(!this.infoCanvas_Internal&&this.uiWidgetBase) {
			this.infoCanvas_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/infoCanvas') as mw.Canvas
		}
		return this.infoCanvas_Internal
	}
	private mIcon_Internal: mw.Image
	public get mIcon(): mw.Image {
		if(!this.mIcon_Internal&&this.uiWidgetBase) {
			this.mIcon_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/infoCanvas/mIcon') as mw.Image
		}
		return this.mIcon_Internal
	}
	private mName_Internal: mw.TextBlock
	public get mName(): mw.TextBlock {
		if(!this.mName_Internal&&this.uiWidgetBase) {
			this.mName_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/infoCanvas/mName') as mw.TextBlock
		}
		return this.mName_Internal
	}
	private mNum_Internal: mw.TextBlock
	public get mNum(): mw.TextBlock {
		if(!this.mNum_Internal&&this.uiWidgetBase) {
			this.mNum_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/infoCanvas/mNum') as mw.TextBlock
		}
		return this.mNum_Internal
	}
	private mDesc_Internal: mw.TextBlock
	public get mDesc(): mw.TextBlock {
		if(!this.mDesc_Internal&&this.uiWidgetBase) {
			this.mDesc_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/infoCanvas/mDesc') as mw.TextBlock
		}
		return this.mDesc_Internal
	}
	private mBtnOpt1_Internal: mw.StaleButton
	public get mBtnOpt1(): mw.StaleButton {
		if(!this.mBtnOpt1_Internal&&this.uiWidgetBase) {
			this.mBtnOpt1_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/infoCanvas/mBtnOpt1') as mw.StaleButton
		}
		return this.mBtnOpt1_Internal
	}
	private mBtnOpt1_1_Internal: mw.StaleButton
	public get mBtnOpt1_1(): mw.StaleButton {
		if(!this.mBtnOpt1_1_Internal&&this.uiWidgetBase) {
			this.mBtnOpt1_1_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/infoCanvas/mBtnOpt1_1') as mw.StaleButton
		}
		return this.mBtnOpt1_1_Internal
	}
	private mBtnOpt1_2_Internal: mw.StaleButton
	public get mBtnOpt1_2(): mw.StaleButton {
		if(!this.mBtnOpt1_2_Internal&&this.uiWidgetBase) {
			this.mBtnOpt1_2_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/infoCanvas/mBtnOpt1_2') as mw.StaleButton
		}
		return this.mBtnOpt1_2_Internal
	}
	private mBtnClose_Internal: mw.StaleButton
	public get mBtnClose(): mw.StaleButton {
		if(!this.mBtnClose_Internal&&this.uiWidgetBase) {
			this.mBtnClose_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/mBtnClose') as mw.StaleButton
		}
		return this.mBtnClose_Internal
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
        
        this.initLanguage(this.btn1);
        
	
        this.initLanguage(this.btn2);
        
	
        this.initLanguage(this.btn3);
        
	
        this.initLanguage(this.mBtnOpt1);
        
	
        this.initLanguage(this.mBtnOpt1_1);
        
	
        this.initLanguage(this.mBtnOpt1_2);
        
	
        this.initLanguage(this.mBtnClose);
        
	
        // 静态文本按钮多语言
        
        // 文本多语言
        
        this.initLanguage(this.mName)
        
	
        this.initLanguage(this.mNum)
        
	
        this.initLanguage(this.mDesc)
        
	
        // 静态文本多语言
        
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        this.unregisterLanKey(this.btn1);
        
	
        this.unregisterLanKey(this.btn2);
        
	
        this.unregisterLanKey(this.btn3);
        
	
        this.unregisterLanKey(this.mBtnOpt1);
        
	
        this.unregisterLanKey(this.mBtnOpt1_1);
        
	
        this.unregisterLanKey(this.mBtnOpt1_2);
        
	
        this.unregisterLanKey(this.mBtnClose);
        
	
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.mName)
        
	
        this.unregisterLanKey(this.mNum)
        
	
        this.unregisterLanKey(this.mDesc)
        
	
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
 