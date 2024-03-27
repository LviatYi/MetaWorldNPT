/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 1.0.8
 * UI: UI/UIAnimLab/tween/NewUI_副本1.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/UIAnimLab/tween/NewUI_副本1.ui')
export default class NewUI_副本1_Generate extends UIScript {
	private mcardBg_Internal: mw.Image
	public get mcardBg(): mw.Image {
		if(!this.mcardBg_Internal&&this.uiWidgetBase) {
			this.mcardBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CardCanvas/mcardBg') as mw.Image
		}
		return this.mcardBg_Internal
	}
	private mCardIcon_Internal: mw.Image
	public get mCardIcon(): mw.Image {
		if(!this.mCardIcon_Internal&&this.uiWidgetBase) {
			this.mCardIcon_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CardCanvas/mCardIcon') as mw.Image
		}
		return this.mCardIcon_Internal
	}
	private mSelected_Internal: mw.Image
	public get mSelected(): mw.Image {
		if(!this.mSelected_Internal&&this.uiWidgetBase) {
			this.mSelected_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CardCanvas/mSelected') as mw.Image
		}
		return this.mSelected_Internal
	}
	private mBlock_Internal: mw.Image
	public get mBlock(): mw.Image {
		if(!this.mBlock_Internal&&this.uiWidgetBase) {
			this.mBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CardCanvas/mBlock') as mw.Image
		}
		return this.mBlock_Internal
	}
	private mbtnItem_Internal: mw.Button
	public get mbtnItem(): mw.Button {
		if(!this.mbtnItem_Internal&&this.uiWidgetBase) {
			this.mbtnItem_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CardCanvas/mbtnItem') as mw.Button
		}
		return this.mbtnItem_Internal
	}
	private mCompose_Internal: mw.Image
	public get mCompose(): mw.Image {
		if(!this.mCompose_Internal&&this.uiWidgetBase) {
			this.mCompose_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CardCanvas/mCompose') as mw.Image
		}
		return this.mCompose_Internal
	}
	private txtCompose_Internal: mw.TextBlock
	public get txtCompose(): mw.TextBlock {
		if(!this.txtCompose_Internal&&this.uiWidgetBase) {
			this.txtCompose_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CardCanvas/txtCompose') as mw.TextBlock
		}
		return this.txtCompose_Internal
	}
	private txtName_Internal: mw.TextBlock
	public get txtName(): mw.TextBlock {
		if(!this.txtName_Internal&&this.uiWidgetBase) {
			this.txtName_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/CardCanvas/txtName') as mw.TextBlock
		}
		return this.txtName_Internal
	}
	private levelProgressBar_Internal: mw.ProgressBar
	public get levelProgressBar(): mw.ProgressBar {
		if(!this.levelProgressBar_Internal&&this.uiWidgetBase) {
			this.levelProgressBar_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/LevelCanvas/levelProgressBar') as mw.ProgressBar
		}
		return this.levelProgressBar_Internal
	}
	private pieceInfoText_Internal: mw.TextBlock
	public get pieceInfoText(): mw.TextBlock {
		if(!this.pieceInfoText_Internal&&this.uiWidgetBase) {
			this.pieceInfoText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/LevelCanvas/pieceInfoText') as mw.TextBlock
		}
		return this.pieceInfoText_Internal
	}
	private mLvlUpLight_Internal: mw.Image
	public get mLvlUpLight(): mw.Image {
		if(!this.mLvlUpLight_Internal&&this.uiWidgetBase) {
			this.mLvlUpLight_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/LevelCanvas/mLvlUpLight') as mw.Image
		}
		return this.mLvlUpLight_Internal
	}
	private mArrow_Internal: mw.Image
	public get mArrow(): mw.Image {
		if(!this.mArrow_Internal&&this.uiWidgetBase) {
			this.mArrow_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/LevelCanvas/mArrow') as mw.Image
		}
		return this.mArrow_Internal
	}



	protected onAwake() {
		this.initTextLan();
	}

    public destroy(): void {
        this.unregisterTextLan();
        super.destroy();
    }

    protected initTextLan() {
        // 文本按钮多语言
        
        // 静态文本按钮多语言
        
        // 文本多语言
        
        this.initLanguage(this.txtCompose)
        
	
        this.initLanguage(this.txtName)
        
	
        this.initLanguage(this.pieceInfoText)
        
	
        // 静态文本多语言
        
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtCompose)
        
	
        this.unregisterLanKey(this.txtName)
        
	
        this.unregisterLanKey(this.pieceInfoText)
        
	
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
 