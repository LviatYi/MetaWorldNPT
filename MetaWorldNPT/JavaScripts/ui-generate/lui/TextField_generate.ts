/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.1
 * UI: UI/lui/TextField.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/lui/TextField.ui')
export default class TextField_Generate extends UIScript {
	private imgBg_Internal: mw.Image
	public get imgBg(): mw.Image {
		if(!this.imgBg_Internal&&this.uiWidgetBase) {
			this.imgBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/imgBg') as mw.Image
		}
		return this.imgBg_Internal
	}
	private imgHighlight_Internal: mw.Image
	public get imgHighlight(): mw.Image {
		if(!this.imgHighlight_Internal&&this.uiWidgetBase) {
			this.imgHighlight_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/imgHighlight') as mw.Image
		}
		return this.imgHighlight_Internal
	}
	private txtLabel_Internal: mw.TextBlock
	public get txtLabel(): mw.TextBlock {
		if(!this.txtLabel_Internal&&this.uiWidgetBase) {
			this.txtLabel_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/txtLabel') as mw.TextBlock
		}
		return this.txtLabel_Internal
	}
	private txtInput_Internal: mw.InputBox
	public get txtInput(): mw.InputBox {
		if(!this.txtInput_Internal&&this.uiWidgetBase) {
			this.txtInput_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/txtInput') as mw.InputBox
		}
		return this.txtInput_Internal
	}
	private imgLine_Internal: mw.Image
	public get imgLine(): mw.Image {
		if(!this.imgLine_Internal&&this.uiWidgetBase) {
			this.imgLine_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/imgLine') as mw.Image
		}
		return this.imgLine_Internal
	}
	private imgHighlightLine_Internal: mw.Image
	public get imgHighlightLine(): mw.Image {
		if(!this.imgHighlightLine_Internal&&this.uiWidgetBase) {
			this.imgHighlightLine_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/imgHighlightLine') as mw.Image
		}
		return this.imgHighlightLine_Internal
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
        // 文本按钮
        
        // 按钮
        
        // 未暴露的文本按钮
        
        // 文本控件
        
        this.initLanguage(this.txtLabel)
        
	
        // 未暴露的文本控件
        
    }

    protected overrideTextSetter() {
        
        globalThis.overrideTextBlockTextSetter(this.txtLabel);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtLabel)
        
	
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

if (!globalThis.findPropertyDescriptor) {
    globalThis.findPropertyDescriptor = (obj: unknown, prop: string): PropertyDescriptor | null => {
        while (obj !== null) {
            let descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            if (descriptor) {
                return descriptor;
            }
            obj = Object.getPrototypeOf(obj);
        }
        return null;
    };
}

if (!globalThis.overrideTextBlockTextSetter) {
    globalThis.overrideTextBlockTextSetter = (textWidget: mw.TextBlock) => {
        const originSetter = globalThis.findPropertyDescriptor(textWidget, "text")?.set;
        if (!originSetter) return;
        Object.defineProperty(textWidget, "text", {
            set: function (value: string) {
                if (textWidget.text === value) return;
                originSetter.call(textWidget, value);
            },
            get: globalThis.findPropertyDescriptor(textWidget, "text")?.get,
        });
    };
}