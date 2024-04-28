﻿/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.2.3
 * UI: UI/node-ui/DropdownList.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/node-ui/DropdownList.ui')
export default class DropdownList_Generate extends UIScript {
	private cmdButton_Internal: mw.StaleButton
	public get cmdButton(): mw.StaleButton {
		if(!this.cmdButton_Internal&&this.uiWidgetBase) {
			this.cmdButton_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/cmdButton') as mw.StaleButton
		}
		return this.cmdButton_Internal
	}
	private dropList_Internal: mw.ScrollBox
	public get dropList(): mw.ScrollBox {
		if(!this.dropList_Internal&&this.uiWidgetBase) {
			this.dropList_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/dropList') as mw.ScrollBox
		}
		return this.dropList_Internal
	}
	private cmdPanel_Internal: mw.Canvas
	public get cmdPanel(): mw.Canvas {
		if(!this.cmdPanel_Internal&&this.uiWidgetBase) {
			this.cmdPanel_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/dropList/cmdPanel') as mw.Canvas
		}
		return this.cmdPanel_Internal
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
        // 文本按钮多语言
        
        this.initLanguage(this.cmdButton);
        
	
        // 静态文本按钮多语言
        
        // 文本多语言
        
        // 静态文本多语言
        
    }

    protected overrideTextSetter() {
        
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        this.unregisterLanKey(this.cmdButton);
        
	
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
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