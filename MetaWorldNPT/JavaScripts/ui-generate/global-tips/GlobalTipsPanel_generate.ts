/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.2.0
 * UI: UI/global-tips/GlobalTipsPanel.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/global-tips/GlobalTipsPanel.ui')
export default class GlobalTipsPanel_Generate extends UIScript {
	private cnvBubblingContainer_Internal: mw.Canvas
	public get cnvBubblingContainer(): mw.Canvas {
		if(!this.cnvBubblingContainer_Internal&&this.uiWidgetBase) {
			this.cnvBubblingContainer_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvBubblingContainer') as mw.Canvas
		}
		return this.cnvBubblingContainer_Internal
	}
	private cnvOnlyTip_Internal: mw.Canvas
	public get cnvOnlyTip(): mw.Canvas {
		if(!this.cnvOnlyTip_Internal&&this.uiWidgetBase) {
			this.cnvOnlyTip_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvOnlyTip') as mw.Canvas
		}
		return this.cnvOnlyTip_Internal
	}
	private imgOnlyTipBg_Internal: mw.Image
	public get imgOnlyTipBg(): mw.Image {
		if(!this.imgOnlyTipBg_Internal&&this.uiWidgetBase) {
			this.imgOnlyTipBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvOnlyTip/imgOnlyTipBg') as mw.Image
		}
		return this.imgOnlyTipBg_Internal
	}
	private txtOnlyTip_Internal: mw.TextBlock
	public get txtOnlyTip(): mw.TextBlock {
		if(!this.txtOnlyTip_Internal&&this.uiWidgetBase) {
			this.txtOnlyTip_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvOnlyTip/txtOnlyTip') as mw.TextBlock
		}
		return this.txtOnlyTip_Internal
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
        
        this.initLanguage(this.txtOnlyTip)
        
	
        // 静态文本多语言
        
    }

    protected overrideTextSetter() {
        
        overrideBubblingWidget(this.txtOnlyTip);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtOnlyTip)
        
	
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