/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.0
 * UI: UI/god-mod/GodModPanel.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/god-mod/GodModPanel.ui')
export default class GodModPanel_Generate extends UIScript {
	private btnExpand_Internal: mw.Button
	public get btnExpand(): mw.Button {
		if(!this.btnExpand_Internal&&this.uiWidgetBase) {
			this.btnExpand_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CnvFunctional/CnvExpand/btnExpand') as mw.Button
		}
		return this.btnExpand_Internal
	}
	private btnMove_Internal: mw.Button
	public get btnMove(): mw.Button {
		if(!this.btnMove_Internal&&this.uiWidgetBase) {
			this.btnMove_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CnvFunctional/CnvMove/btnMove') as mw.Button
		}
		return this.btnMove_Internal
	}
	private btnClose_Internal: mw.Button
	public get btnClose(): mw.Button {
		if(!this.btnClose_Internal&&this.uiWidgetBase) {
			this.btnClose_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CnvFunctional/CnvClose/btnClose') as mw.Button
		}
		return this.btnClose_Internal
	}
	private inputField_Internal: mw.InputBox
	public get inputField(): mw.InputBox {
		if(!this.inputField_Internal&&this.uiWidgetBase) {
			this.inputField_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CnvSearchCommand/inputField') as mw.InputBox
		}
		return this.inputField_Internal
	}
	private btnCommandExpand_Internal: mw.Button
	public get btnCommandExpand(): mw.Button {
		if(!this.btnCommandExpand_Internal&&this.uiWidgetBase) {
			this.btnCommandExpand_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CnvCommandChosen/btnCommandExpand') as mw.Button
		}
		return this.btnCommandExpand_Internal
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
        
        this.btnExpand.onClicked.add(() => Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        this.btnMove.onClicked.add(() => Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        this.btnClose.onClicked.add(() => Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        this.btnCommandExpand.onClicked.add(() => Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        // 未暴露的文本按钮
        
        // 文本控件
        
        // 未暴露的文本控件
        
        this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/CnvCommandChosen/CnvCommandItem/TxtCommandItemLabel") as mw.TextBlock);
        
	
    }

    protected overrideTextSetter() {
        
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        // 隐藏文本多语言
        
        this.unregisterLanKey(this.uiWidgetBase.findChildByPath("RootCanvas/CnvCommandChosen/CnvCommandItem/TxtCommandItemLabel") as mw.TextBlock);
        
	
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