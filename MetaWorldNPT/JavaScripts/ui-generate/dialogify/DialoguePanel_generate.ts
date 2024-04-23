/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.2.0
 * UI: UI/dialogify/DialoguePanel.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/dialogify/DialoguePanel.ui')
export default class DialoguePanel_Generate extends UIScript {
	private cnvContentNode_Internal: mw.Canvas
	public get cnvContentNode(): mw.Canvas {
		if(!this.cnvContentNode_Internal&&this.uiWidgetBase) {
			this.cnvContentNode_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvContentNode') as mw.Canvas
		}
		return this.cnvContentNode_Internal
	}
	private txtSourceName_Internal: mw.TextBlock
	public get txtSourceName(): mw.TextBlock {
		if(!this.txtSourceName_Internal&&this.uiWidgetBase) {
			this.txtSourceName_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvContentNode/txtSourceName') as mw.TextBlock
		}
		return this.txtSourceName_Internal
	}
	private txtContent_Internal: mw.TextBlock
	public get txtContent(): mw.TextBlock {
		if(!this.txtContent_Internal&&this.uiWidgetBase) {
			this.txtContent_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvContentNode/txtContent') as mw.TextBlock
		}
		return this.txtContent_Internal
	}
	private imgNext_Internal: mw.Image
	public get imgNext(): mw.Image {
		if(!this.imgNext_Internal&&this.uiWidgetBase) {
			this.imgNext_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvContentNode/imgNext') as mw.Image
		}
		return this.imgNext_Internal
	}
	private btnNext_Internal: mw.Button
	public get btnNext(): mw.Button {
		if(!this.btnNext_Internal&&this.uiWidgetBase) {
			this.btnNext_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvContentNode/btnNext') as mw.Button
		}
		return this.btnNext_Internal
	}
	private cnvOptions_Internal: mw.Canvas
	public get cnvOptions(): mw.Canvas {
		if(!this.cnvOptions_Internal&&this.uiWidgetBase) {
			this.cnvOptions_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvOptions') as mw.Canvas
		}
		return this.cnvOptions_Internal
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
        
        this.initLanguage(this.txtSourceName)
        
	
        this.initLanguage(this.txtContent)
        
	
        // 静态文本多语言
        
    }

    protected overrideTextSetter() {
        
        overrideBubblingWidget(this.txtSourceName);
        
	
        overrideBubblingWidget(this.txtContent);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtSourceName)
        
	
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