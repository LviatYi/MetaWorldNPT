/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 1.0.8
 * UI: UI/node-ui/BaseUINode.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/node-ui/BaseUINode.ui')
export default class BaseUINode_Generate extends UIScript {
	private titleCanvas_Internal: mw.Canvas
	public get titleCanvas(): mw.Canvas {
		if(!this.titleCanvas_Internal&&this.uiWidgetBase) {
			this.titleCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/titleCanvas') as mw.Canvas
		}
		return this.titleCanvas_Internal
	}
	private titleBorder_Internal: mw.Image
	public get titleBorder(): mw.Image {
		if(!this.titleBorder_Internal&&this.uiWidgetBase) {
			this.titleBorder_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/titleCanvas/titleBorder') as mw.Image
		}
		return this.titleBorder_Internal
	}
	private titleBg_Internal: mw.Image
	public get titleBg(): mw.Image {
		if(!this.titleBg_Internal&&this.uiWidgetBase) {
			this.titleBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/titleCanvas/titleBg') as mw.Image
		}
		return this.titleBg_Internal
	}
	private deleteBtn_Internal: mw.StaleButton
	public get deleteBtn(): mw.StaleButton {
		if(!this.deleteBtn_Internal&&this.uiWidgetBase) {
			this.deleteBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/titleCanvas/deleteBtn') as mw.StaleButton
		}
		return this.deleteBtn_Internal
	}
	private collapseBtn_Internal: mw.StaleButton
	public get collapseBtn(): mw.StaleButton {
		if(!this.collapseBtn_Internal&&this.uiWidgetBase) {
			this.collapseBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/titleCanvas/collapseBtn') as mw.StaleButton
		}
		return this.collapseBtn_Internal
	}
	private titleText_Internal: mw.TextBlock
	public get titleText(): mw.TextBlock {
		if(!this.titleText_Internal&&this.uiWidgetBase) {
			this.titleText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/titleCanvas/titleText') as mw.TextBlock
		}
		return this.titleText_Internal
	}
	private contentCanvas_Internal: mw.Canvas
	public get contentCanvas(): mw.Canvas {
		if(!this.contentCanvas_Internal&&this.uiWidgetBase) {
			this.contentCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/contentCanvas') as mw.Canvas
		}
		return this.contentCanvas_Internal
	}
	private contentBorder_Internal: mw.Image
	public get contentBorder(): mw.Image {
		if(!this.contentBorder_Internal&&this.uiWidgetBase) {
			this.contentBorder_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/contentCanvas/contentBorder') as mw.Image
		}
		return this.contentBorder_Internal
	}
	private contentBg_Internal: mw.Image
	public get contentBg(): mw.Image {
		if(!this.contentBg_Internal&&this.uiWidgetBase) {
			this.contentBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/contentCanvas/contentBg') as mw.Image
		}
		return this.contentBg_Internal
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
        
        this.initLanguage(this.deleteBtn);
        
	
        this.initLanguage(this.collapseBtn);
        
	
        // 静态文本按钮多语言
        
        // 文本多语言
        
        this.initLanguage(this.titleText)
        
	
        // 静态文本多语言
        
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        this.unregisterLanKey(this.deleteBtn);
        
	
        this.unregisterLanKey(this.collapseBtn);
        
	
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.titleText)
        
	
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
 