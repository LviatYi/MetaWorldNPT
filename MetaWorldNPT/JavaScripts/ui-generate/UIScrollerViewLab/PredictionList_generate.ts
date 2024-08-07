﻿/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.1
 * UI: UI/UIScrollerViewLab/PredictionList.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/UIScrollerViewLab/PredictionList.ui')
export default class PredictionList_Generate extends UIScript {
	private scrollBox_Internal: mw.ScrollBox
	public get scrollBox(): mw.ScrollBox {
		if(!this.scrollBox_Internal&&this.uiWidgetBase) {
			this.scrollBox_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrollBox') as mw.ScrollBox
		}
		return this.scrollBox_Internal
	}
	private container_Internal: mw.Canvas
	public get container(): mw.Canvas {
		if(!this.container_Internal&&this.uiWidgetBase) {
			this.container_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrollBox/container') as mw.Canvas
		}
		return this.container_Internal
	}
	private dataBindText_Internal: mw.TextBlock
	public get dataBindText(): mw.TextBlock {
		if(!this.dataBindText_Internal&&this.uiWidgetBase) {
			this.dataBindText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/dataBindText') as mw.TextBlock
		}
		return this.dataBindText_Internal
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
        
        this.initLanguage(this.dataBindText)
        
	
        // 未暴露的文本控件
        
    }

    protected overrideTextSetter() {
        
        globalThis.overrideTextBlockTextSetter(this.dataBindText);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.dataBindText)
        
	
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