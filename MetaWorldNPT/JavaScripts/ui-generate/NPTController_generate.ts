/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.0
 * UI: UI/NPTController.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/NPTController.ui')
export default class NPTController_Generate extends UIScript {
	private btnT_Internal: mw.Button
	public get btnT(): mw.Button {
		if(!this.btnT_Internal&&this.uiWidgetBase) {
			this.btnT_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/btnT') as mw.Button
		}
		return this.btnT_Internal
	}
	private txtT_Internal: mw.TextBlock
	public get txtT(): mw.TextBlock {
		if(!this.txtT_Internal&&this.uiWidgetBase) {
			this.txtT_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/btnT/txtT') as mw.TextBlock
		}
		return this.txtT_Internal
	}
	private btnJ_Internal: mw.Button
	public get btnJ(): mw.Button {
		if(!this.btnJ_Internal&&this.uiWidgetBase) {
			this.btnJ_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/btnJ') as mw.Button
		}
		return this.btnJ_Internal
	}
	private txtJ_Internal: mw.TextBlock
	public get txtJ(): mw.TextBlock {
		if(!this.txtJ_Internal&&this.uiWidgetBase) {
			this.txtJ_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/btnJ/txtJ') as mw.TextBlock
		}
		return this.txtJ_Internal
	}
	private btnK_Internal: mw.Button
	public get btnK(): mw.Button {
		if(!this.btnK_Internal&&this.uiWidgetBase) {
			this.btnK_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/btnK') as mw.Button
		}
		return this.btnK_Internal
	}
	private txtK_Internal: mw.TextBlock
	public get txtK(): mw.TextBlock {
		if(!this.txtK_Internal&&this.uiWidgetBase) {
			this.txtK_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/btnK/txtK') as mw.TextBlock
		}
		return this.txtK_Internal
	}
	private btnL_Internal: mw.Button
	public get btnL(): mw.Button {
		if(!this.btnL_Internal&&this.uiWidgetBase) {
			this.btnL_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/btnL') as mw.Button
		}
		return this.btnL_Internal
	}
	private txtL_Internal: mw.TextBlock
	public get txtL(): mw.TextBlock {
		if(!this.txtL_Internal&&this.uiWidgetBase) {
			this.txtL_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/btnL/txtL') as mw.TextBlock
		}
		return this.txtL_Internal
	}
	private txtTimer_Internal: mw.TextBlock
	public get txtTimer(): mw.TextBlock {
		if(!this.txtTimer_Internal&&this.uiWidgetBase) {
			this.txtTimer_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/txtTimer') as mw.TextBlock
		}
		return this.txtTimer_Internal
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
        
        this.btnT.onClicked.add(() => Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        this.btnJ.onClicked.add(() => Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        this.btnK.onClicked.add(() => Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        this.btnL.onClicked.add(() => Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        // 未暴露的文本按钮
        
        // 文本控件
        
        this.initLanguage(this.txtT)
        
	
        this.initLanguage(this.txtJ)
        
	
        this.initLanguage(this.txtK)
        
	
        this.initLanguage(this.txtL)
        
	
        this.initLanguage(this.txtTimer)
        
	
        // 未暴露的文本控件
        
    }

    protected overrideTextSetter() {
        
        globalThis.overrideTextBlockTextSetter(this.txtT);
        
	
        globalThis.overrideTextBlockTextSetter(this.txtJ);
        
	
        globalThis.overrideTextBlockTextSetter(this.txtK);
        
	
        globalThis.overrideTextBlockTextSetter(this.txtL);
        
	
        globalThis.overrideTextBlockTextSetter(this.txtTimer);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtT)
        
	
        this.unregisterLanKey(this.txtJ)
        
	
        this.unregisterLanKey(this.txtK)
        
	
        this.unregisterLanKey(this.txtL)
        
	
        this.unregisterLanKey(this.txtTimer)
        
	
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