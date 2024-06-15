/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.1
 * UI: UI/lui/Dialogify.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/lui/Dialogify.ui')
export default class Dialogify_Generate extends UIScript {
	private btnModal_Internal: mw.Button
	public get btnModal(): mw.Button {
		if(!this.btnModal_Internal&&this.uiWidgetBase) {
			this.btnModal_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/btnModal') as mw.Button
		}
		return this.btnModal_Internal
	}
	private imgBack_Internal: mw.Image
	public get imgBack(): mw.Image {
		if(!this.imgBack_Internal&&this.uiWidgetBase) {
			this.imgBack_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/imgBack') as mw.Image
		}
		return this.imgBack_Internal
	}
	private txtTitle_Internal: mw.TextBlock
	public get txtTitle(): mw.TextBlock {
		if(!this.txtTitle_Internal&&this.uiWidgetBase) {
			this.txtTitle_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/txtTitle') as mw.TextBlock
		}
		return this.txtTitle_Internal
	}
	private txtMessage_Internal: mw.TextBlock
	public get txtMessage(): mw.TextBlock {
		if(!this.txtMessage_Internal&&this.uiWidgetBase) {
			this.txtMessage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/txtMessage') as mw.TextBlock
		}
		return this.txtMessage_Internal
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
        
        this.btnModal.onClicked.add(() => mw.Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        // 未暴露的文本按钮
        
        // 文本控件
        
        this.initLanguage(this.txtTitle)
        
	
        this.initLanguage(this.txtMessage)
        
	
        // 未暴露的文本控件
        
    }

    protected overrideTextSetter() {
        
        globalThis.overrideTextBlockTextSetter(this.txtTitle);
        
	
        globalThis.overrideTextBlockTextSetter(this.txtMessage);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtTitle)
        
	
        this.unregisterLanKey(this.txtMessage)
        
	
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