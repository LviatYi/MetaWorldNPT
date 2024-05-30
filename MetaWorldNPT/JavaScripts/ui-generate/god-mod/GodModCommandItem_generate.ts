/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.0
 * UI: UI/god-mod/GodModCommandItem.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/god-mod/GodModCommandItem.ui')
export default class GodModCommandItem_Generate extends UIScript {
	private btnCommand_Internal: mw.Button
	public get btnCommand(): mw.Button {
		if(!this.btnCommand_Internal&&this.uiWidgetBase) {
			this.btnCommand_Internal = this.uiWidgetBase.findChildByPath('GodModCommandItem/btnCommand') as mw.Button
		}
		return this.btnCommand_Internal
	}
	private cnvFlags_Internal: mw.Canvas
	public get cnvFlags(): mw.Canvas {
		if(!this.cnvFlags_Internal&&this.uiWidgetBase) {
			this.cnvFlags_Internal = this.uiWidgetBase.findChildByPath('GodModCommandItem/cnvFlags') as mw.Canvas
		}
		return this.cnvFlags_Internal
	}
	private cnvSFlag_Internal: mw.Canvas
	public get cnvSFlag(): mw.Canvas {
		if(!this.cnvSFlag_Internal&&this.uiWidgetBase) {
			this.cnvSFlag_Internal = this.uiWidgetBase.findChildByPath('GodModCommandItem/cnvFlags/cnvSFlag') as mw.Canvas
		}
		return this.cnvSFlag_Internal
	}
	private imgSFlag_Internal: mw.Image
	public get imgSFlag(): mw.Image {
		if(!this.imgSFlag_Internal&&this.uiWidgetBase) {
			this.imgSFlag_Internal = this.uiWidgetBase.findChildByPath('GodModCommandItem/cnvFlags/cnvSFlag/imgSFlag') as mw.Image
		}
		return this.imgSFlag_Internal
	}
	private txtSFlag_Internal: mw.TextBlock
	public get txtSFlag(): mw.TextBlock {
		if(!this.txtSFlag_Internal&&this.uiWidgetBase) {
			this.txtSFlag_Internal = this.uiWidgetBase.findChildByPath('GodModCommandItem/cnvFlags/cnvSFlag/txtSFlag') as mw.TextBlock
		}
		return this.txtSFlag_Internal
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
        
        this.btnCommand.onClicked.add(() => Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        // 未暴露的文本按钮
        
        // 文本控件
        
        this.initLanguage(this.txtSFlag)
        
	
        // 未暴露的文本控件
        
        this.initLanguage(this.uiWidgetBase.findChildByPath("GodModCommandItem/TxtCommandItemLabel") as mw.TextBlock);
        
	
    }

    protected overrideTextSetter() {
        
        globalThis.overrideTextBlockTextSetter(this.txtSFlag);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtSFlag)
        
	
        // 隐藏文本多语言
        
        this.unregisterLanKey(this.uiWidgetBase.findChildByPath("GodModCommandItem/TxtCommandItemLabel") as mw.TextBlock);
        
	
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