/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.2.0
 * UI: UI/globalTips/tiptiptip.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/globalTips/tiptiptip.ui')
export default class tiptiptip_Generate extends UIScript {
	private canvasTip_Internal: mw.Canvas
	public get canvasTip(): mw.Canvas {
		if(!this.canvasTip_Internal&&this.uiWidgetBase) {
			this.canvasTip_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/canvasTip') as mw.Canvas
		}
		return this.canvasTip_Internal
	}
	private imgTipBg_Internal: mw.Image
	public get imgTipBg(): mw.Image {
		if(!this.imgTipBg_Internal&&this.uiWidgetBase) {
			this.imgTipBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/canvasTip/imgTipBg') as mw.Image
		}
		return this.imgTipBg_Internal
	}
	private textDescribtion_Internal: mw.TextBlock
	public get textDescribtion(): mw.TextBlock {
		if(!this.textDescribtion_Internal&&this.uiWidgetBase) {
			this.textDescribtion_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/canvasTip/textDescribtion') as mw.TextBlock
		}
		return this.textDescribtion_Internal
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

    public destroy(): void {
        this.unregisterTextLan();
        super.destroy();
    }

    protected initTextLan() {
        // 文本按钮多语言
        
        // 静态文本按钮多语言
        
        // 文本多语言
        
        this.initLanguage(this.textDescribtion)
        
	
        // 静态文本多语言
        
    }

    protected overrideTextSetter() {
        
        overrideBubblingWidget(this.textDescribtion);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.textDescribtion)
        
	
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

function overrideBubblingWidget(textWidget: mw.TextBlock) {
    const originSetter = Object.getOwnPropertyDescriptor(textWidget, "text").set;
    Object.defineProperty(textWidget, "text", {
        set: function (value: string) {
            if (textWidget.text === value) return;
            originSetter.call(textWidget, value);
        },
    });
}
