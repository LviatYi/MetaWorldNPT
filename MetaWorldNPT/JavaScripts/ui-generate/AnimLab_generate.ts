/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.1.0
 * UI: UI/AnimLab.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/AnimLab.ui')
export default class AnimLab_Generate extends UIScript {
	private topCurtain_Internal: mw.Canvas
	public get topCurtain(): mw.Canvas {
		if(!this.topCurtain_Internal&&this.uiWidgetBase) {
			this.topCurtain_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/topCurtain') as mw.Canvas
		}
		return this.topCurtain_Internal
	}
	private topCurtainBg_Internal: mw.Image
	public get topCurtainBg(): mw.Image {
		if(!this.topCurtainBg_Internal&&this.uiWidgetBase) {
			this.topCurtainBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/topCurtain/topCurtainBg') as mw.Image
		}
		return this.topCurtainBg_Internal
	}
	private bottomCurtain_Internal: mw.Canvas
	public get bottomCurtain(): mw.Canvas {
		if(!this.bottomCurtain_Internal&&this.uiWidgetBase) {
			this.bottomCurtain_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/bottomCurtain') as mw.Canvas
		}
		return this.bottomCurtain_Internal
	}
	private bottomCurtainBg_Internal: mw.Image
	public get bottomCurtainBg(): mw.Image {
		if(!this.bottomCurtainBg_Internal&&this.uiWidgetBase) {
			this.bottomCurtainBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/bottomCurtain/bottomCurtainBg') as mw.Image
		}
		return this.bottomCurtainBg_Internal
	}



	protected onStart() {
    }

	protected onAwake() {
        // 强制实现其 以规避 show 自作主张的使用 .layer 覆写 onShow 的默认参数导致的接口设计哲学不统一.
        this.layer = mw.UILayerMiddle;
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
 