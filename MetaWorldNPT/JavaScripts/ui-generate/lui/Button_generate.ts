/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.1
 * UI: UI/lui/Button.ui
 */

import UIScript = mw.UIScript;
import Log4Ts from "mw-log4ts/Log4Ts";

@UIBind('UI/lui/Button.ui')
export default class Button_Generate extends UIScript {
	private btn_Internal: mw.Button
	public get btn(): mw.Button {
		if(!this.btn_Internal&&this.uiWidgetBase) {
			this.btn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/btn') as mw.Button
		}
		return this.btn_Internal
	}
	private cnvClickAnim_Internal: mw.Canvas
	public get cnvClickAnim(): mw.Canvas {
		if(!this.cnvClickAnim_Internal&&this.uiWidgetBase) {
			this.cnvClickAnim_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvClickAnim') as mw.Canvas
		}
		return this.cnvClickAnim_Internal
	}
	private imgClickAnim_Internal: mw.Image
	public get imgClickAnim(): mw.Image {
		if(!this.imgClickAnim_Internal&&this.uiWidgetBase) {
			this.imgClickAnim_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvClickAnim/imgClickAnim') as mw.Image
		}
		return this.imgClickAnim_Internal
	}
	private txtBtn_Internal: mw.TextBlock
	public get txtBtn(): mw.TextBlock {
		if(!this.txtBtn_Internal&&this.uiWidgetBase) {
			this.txtBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/txtBtn') as mw.TextBlock
		}
		return this.txtBtn_Internal
	}
	private cnvIcon_Internal: mw.Canvas
	public get cnvIcon(): mw.Canvas {
		if(!this.cnvIcon_Internal&&this.uiWidgetBase) {
			this.cnvIcon_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvIcon') as mw.Canvas
		}
		return this.cnvIcon_Internal
	}
	private imgIcon_Internal: mw.Image
	public get imgIcon(): mw.Image {
		if(!this.imgIcon_Internal&&this.uiWidgetBase) {
			this.imgIcon_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvIcon/imgIcon') as mw.Image
		}
		return this.imgIcon_Internal
	}
	private imgHighlight_Internal: mw.Image
	public get imgHighlight(): mw.Image {
		if(!this.imgHighlight_Internal&&this.uiWidgetBase) {
			this.imgHighlight_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/imgHighlight') as mw.Image
		}
		return this.imgHighlight_Internal
	}



	protected onStart() {
		Log4Ts.log(Button_Generate, `on start.`);
    }

	protected onAwake() {
        // 强制实现其 以规避 show 自作主张的使用 .layer 覆写 onShow 的默认参数导致的接口设计哲学不统一.
        this.layer = mw.UILayerMiddle;
        this.overrideTextSetter();
		this.initTextLan();
	}

    protected onUpdate(dt: number): void {
		Log4Ts.log(Button_Generate, `updating...`);
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
        
        this.btn.onClicked.add(() => mw.Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        // 未暴露的文本按钮
        
        // 文本控件
        
        this.initLanguage(this.txtBtn)
        
	
        // 未暴露的文本控件
        
    }

    protected overrideTextSetter() {
        
        globalThis.overrideTextBlockTextSetter(this.txtBtn);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtBtn)
        
	
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