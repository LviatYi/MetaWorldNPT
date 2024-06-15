/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.1
 * UI: UI/god-mod/GodModPanel.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/god-mod/GodModPanel.ui')
export default class GodModPanel_Generate extends UIScript {
	private btnExpand_Internal: mw.TextBlock
	public get btnExpand(): mw.TextBlock {
		if(!this.btnExpand_Internal&&this.uiWidgetBase) {
			this.btnExpand_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CnvFunctional/CnvExpand/btnExpand') as mw.TextBlock
		}
		return this.btnExpand_Internal
	}
	private btnMove_Internal: mw.TextBlock
	public get btnMove(): mw.TextBlock {
		if(!this.btnMove_Internal&&this.uiWidgetBase) {
			this.btnMove_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CnvFunctional/CnvMove/btnMove') as mw.TextBlock
		}
		return this.btnMove_Internal
	}
	private btnClose_Internal: mw.TextBlock
	public get btnClose(): mw.TextBlock {
		if(!this.btnClose_Internal&&this.uiWidgetBase) {
			this.btnClose_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CnvFunctional/CnvClose/btnClose') as mw.TextBlock
		}
		return this.btnClose_Internal
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
        
        this.initLanguage(this.btnExpand)
        
	
        this.initLanguage(this.btnMove)
        
	
        this.initLanguage(this.btnClose)
        
	
        // 未暴露的文本控件
        
        this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/CnvParamInput/CnvParamInputContainer/TextBlock") as mw.TextBlock);
        
	
    }

    protected overrideTextSetter() {
        
        globalThis.overrideTextBlockTextSetter(this.btnExpand);
        
	
        globalThis.overrideTextBlockTextSetter(this.btnMove);
        
	
        globalThis.overrideTextBlockTextSetter(this.btnClose);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.btnExpand)
        
	
        this.unregisterLanKey(this.btnMove)
        
	
        this.unregisterLanKey(this.btnClose)
        
	
        // 隐藏文本多语言
        
        this.unregisterLanKey(this.uiWidgetBase.findChildByPath("RootCanvas/CnvParamInput/CnvParamInputContainer/TextBlock") as mw.TextBlock);
        
	
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