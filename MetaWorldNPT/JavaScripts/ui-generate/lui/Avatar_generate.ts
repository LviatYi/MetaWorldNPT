/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.1
 * UI: UI/lui/Avatar.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/lui/Avatar.ui')
export default class Avatar_Generate extends UIScript {
	private cnvBgIcon_Internal: mw.Canvas
	public get cnvBgIcon(): mw.Canvas {
		if(!this.cnvBgIcon_Internal&&this.uiWidgetBase) {
			this.cnvBgIcon_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/Canvas_1/Canvas_1/Canvas_1_2/Canvas_1_1/Canvas_1_1/cnvBgIcon') as mw.Canvas
		}
		return this.cnvBgIcon_Internal
	}
	private imgBgIcon_Internal: mw.Image
	public get imgBgIcon(): mw.Image {
		if(!this.imgBgIcon_Internal&&this.uiWidgetBase) {
			this.imgBgIcon_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/Canvas_1/Canvas_1/Canvas_1_2/Canvas_1_1/Canvas_1_1/cnvBgIcon/imgBgIcon') as mw.Image
		}
		return this.imgBgIcon_Internal
	}
	private btnIcon_Internal: mw.Button
	public get btnIcon(): mw.Button {
		if(!this.btnIcon_Internal&&this.uiWidgetBase) {
			this.btnIcon_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/Canvas_1/Canvas_1/Canvas_1_2/Canvas_1_1/Canvas_1_1/btnIcon') as mw.Button
		}
		return this.btnIcon_Internal
	}
	private imgClickAnim_Internal: mw.Image
	public get imgClickAnim(): mw.Image {
		if(!this.imgClickAnim_Internal&&this.uiWidgetBase) {
			this.imgClickAnim_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/Canvas_1/Canvas_1/Canvas_1_2/Canvas_1_1/Canvas_1_1/imgClickAnim') as mw.Image
		}
		return this.imgClickAnim_Internal
	}
	private imgHighlight_Internal: mw.Image
	public get imgHighlight(): mw.Image {
		if(!this.imgHighlight_Internal&&this.uiWidgetBase) {
			this.imgHighlight_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/Canvas_1/Canvas_1/Canvas_1_2/Canvas_1_1/Canvas_1_1/imgHighlight') as mw.Image
		}
		return this.imgHighlight_Internal
	}
	private txtLabel_Internal: mw.TextBlock
	public get txtLabel(): mw.TextBlock {
		if(!this.txtLabel_Internal&&this.uiWidgetBase) {
			this.txtLabel_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/Canvas_1/Canvas_1/Canvas_1_2/Canvas_1_1/Canvas_1_1/txtLabel') as mw.TextBlock
		}
		return this.txtLabel_Internal
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
        
        this.btnIcon.onClicked.add(() => mw.Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        // 未暴露的文本按钮
        
        // 文本控件
        
        this.initLanguage(this.txtLabel)
        
	
        // 未暴露的文本控件
        
    }

    protected overrideTextSetter() {
        
        globalThis.overrideTextBlockTextSetter(this.txtLabel);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtLabel)
        
	
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