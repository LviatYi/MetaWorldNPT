/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.2.0
 * UI: UI/Board.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/Board.ui')
export default class Board_Generate extends UIScript {
	private imgMouseTip_Internal: mw.Image
	public get imgMouseTip(): mw.Image {
		if(!this.imgMouseTip_Internal&&this.uiWidgetBase) {
			this.imgMouseTip_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/imgMouseTip') as mw.Image
		}
		return this.imgMouseTip_Internal
	}
	private cnvShowMain_Internal: mw.Canvas
	public get cnvShowMain(): mw.Canvas {
		if(!this.cnvShowMain_Internal&&this.uiWidgetBase) {
			this.cnvShowMain_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvShowMain') as mw.Canvas
		}
		return this.cnvShowMain_Internal
	}
	private btnMain_Internal: mw.Button
	public get btnMain(): mw.Button {
		if(!this.btnMain_Internal&&this.uiWidgetBase) {
			this.btnMain_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/btnMain') as mw.Button
		}
		return this.btnMain_Internal
	}
	private cnvMain2_Internal: mw.Canvas
	public get cnvMain2(): mw.Canvas {
		if(!this.cnvMain2_Internal&&this.uiWidgetBase) {
			this.cnvMain2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/cnvMain2') as mw.Canvas
		}
		return this.cnvMain2_Internal
	}
	private btnMain3_Internal: mw.Button
	public get btnMain3(): mw.Button {
		if(!this.btnMain3_Internal&&this.uiWidgetBase) {
			this.btnMain3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas2/btnMain3') as mw.Button
		}
		return this.btnMain3_Internal
	}
	private cnvMain4_Internal: mw.Canvas
	public get cnvMain4(): mw.Canvas {
		if(!this.cnvMain4_Internal&&this.uiWidgetBase) {
			this.cnvMain4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas2/cnvMain4') as mw.Canvas
		}
		return this.cnvMain4_Internal
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

    public destroy(): void {
        this.unregisterTextLan();
        super.destroy();
    }

    protected initTextLan() {
        // 文本按钮多语言
        
        // 静态文本按钮多语言
        
        // 文本多语言
        
        // 静态文本多语言
        
    }

    protected overrideTextSetter() {
        
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
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