/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.2.3
 * UI: UI/global-tips/BubbleWidget.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/global-tips/BubbleWidget.ui')
export default class BubbleWidget_Generate extends UIScript {
	private cnvTips_Internal: mw.Canvas
	public get cnvTips(): mw.Canvas {
		if(!this.cnvTips_Internal&&this.uiWidgetBase) {
			this.cnvTips_Internal = this.uiWidgetBase.findChildByPath('cnvTips') as mw.Canvas
		}
		return this.cnvTips_Internal
	}
	private imgBg_Internal: mw.Image
	public get imgBg(): mw.Image {
		if(!this.imgBg_Internal&&this.uiWidgetBase) {
			this.imgBg_Internal = this.uiWidgetBase.findChildByPath('cnvTips/imgBg') as mw.Image
		}
		return this.imgBg_Internal
	}
	private imgLight_Internal: mw.Image
	public get imgLight(): mw.Image {
		if(!this.imgLight_Internal&&this.uiWidgetBase) {
			this.imgLight_Internal = this.uiWidgetBase.findChildByPath('cnvTips/imgLight') as mw.Image
		}
		return this.imgLight_Internal
	}
	private txtContent_Internal: mw.TextBlock
	public get txtContent(): mw.TextBlock {
		if(!this.txtContent_Internal&&this.uiWidgetBase) {
			this.txtContent_Internal = this.uiWidgetBase.findChildByPath('cnvTips/txtContent') as mw.TextBlock
		}
		return this.txtContent_Internal
	}



	protected onStart() {
    }

	protected onAwake() {
        // 强制实现其 以规避 show 自作主张的使用 .layer 覆写 onShow 的默认参数导致的接口设计哲学不统一.
        this.layer = mw.UILayerMiddle;
        this.overrideTextSetter();
		this.initTextLan();
	}

    protected onUpdate(dt: number): void {
	}

	protected onShow(...args:unknown[]) {
	}

	protected onHide() {
	}

    protected onDestroy() {
        this.unregisterTextLan();
    }

    protected initTextLan() {
        // 文本按钮多语言
        
        // 静态文本按钮多语言
        
        // 文本多语言
        
        this.initLanguage(this.txtContent)
        
	
        // 静态文本多语言
        
    }

    protected overrideTextSetter() {
        
        overrideBubblingWidget(this.txtContent);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtContent)
        
	
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

function findPropertyDescriptor(obj: unknown, prop: string): PropertyDescriptor | null {
    while (obj !== null) {
        let descriptor = Object.getOwnPropertyDescriptor(obj, prop);
        if (descriptor) {
            return descriptor;
        }
        obj = Object.getPrototypeOf(obj);
    }
    return null;
}

function overrideBubblingWidget(textWidget: mw.TextBlock) {
    const originSetter = findPropertyDescriptor(textWidget, "text")?.set;
    if (!originSetter) return;
    Object.defineProperty(textWidget, "text", {
        set: function (value: string) {
            if (textWidget.text === value) return;
            originSetter.call(textWidget, value);
        },
    });
}