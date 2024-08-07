﻿/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.1
 * UI: UI/UIScrollerViewLab/PredictionItem.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/UIScrollerViewLab/PredictionItem.ui')
export default class PredictionItem_Generate extends UIScript {
	private image_Internal: mw.Image
	public get image(): mw.Image {
		if(!this.image_Internal&&this.uiWidgetBase) {
			this.image_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/image') as mw.Image
		}
		return this.image_Internal
	}
	private idText_Internal: mw.TextBlock
	public get idText(): mw.TextBlock {
		if(!this.idText_Internal&&this.uiWidgetBase) {
			this.idText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/idText') as mw.TextBlock
		}
		return this.idText_Internal
	}
	private infoText_Internal: mw.TextBlock
	public get infoText(): mw.TextBlock {
		if(!this.infoText_Internal&&this.uiWidgetBase) {
			this.infoText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/infoText') as mw.TextBlock
		}
		return this.infoText_Internal
	}
	private selectBtn_Internal: mw.StaleButton
	public get selectBtn(): mw.StaleButton {
		if(!this.selectBtn_Internal&&this.uiWidgetBase) {
			this.selectBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/selectBtn') as mw.StaleButton
		}
		return this.selectBtn_Internal
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
        
        this.initLanguage(this.selectBtn);
        this.selectBtn.onClicked.add(() => mw.Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        // 按钮
        
        // 未暴露的文本按钮
        
        // 文本控件
        
        this.initLanguage(this.idText)
        
	
        this.initLanguage(this.infoText)
        
	
        // 未暴露的文本控件
        
    }

    protected overrideTextSetter() {
        
        globalThis.overrideTextBlockTextSetter(this.idText);
        
	
        globalThis.overrideTextBlockTextSetter(this.infoText);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        this.unregisterLanKey(this.selectBtn);
        
	
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.idText)
        
	
        this.unregisterLanKey(this.infoText)
        
	
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