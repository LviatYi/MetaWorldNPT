/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 1.0.8
 * UI: UI/UIAnimLab/tween/NewUI.ui
*/

import UIScript = mw.UIScript;


@UIBind('UI/UIAnimLab/tween/NewUI.ui')
export default class NewUI_Generate extends UIScript {
	private mTopCanvas_Internal: mw.Canvas
	public get mTopCanvas(): mw.Canvas {
		if(!this.mTopCanvas_Internal&&this.uiWidgetBase) {
			this.mTopCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTopCanvas') as mw.Canvas
		}
		return this.mTopCanvas_Internal
	}
	private mTopBg_Internal: mw.Image
	public get mTopBg(): mw.Image {
		if(!this.mTopBg_Internal&&this.uiWidgetBase) {
			this.mTopBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTopCanvas/mTopBg') as mw.Image
		}
		return this.mTopBg_Internal
	}
	private btnClose_Internal: mw.Button
	public get btnClose(): mw.Button {
		if(!this.btnClose_Internal&&this.uiWidgetBase) {
			this.btnClose_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTopCanvas/btnClose') as mw.Button
		}
		return this.btnClose_Internal
	}
	private mCanvas_SourceNormal_Internal: mw.Canvas
	public get mCanvas_SourceNormal(): mw.Canvas {
		if(!this.mCanvas_SourceNormal_Internal&&this.uiWidgetBase) {
			this.mCanvas_SourceNormal_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTopCanvas/mCanvas_SourceNormal') as mw.Canvas
		}
		return this.mCanvas_SourceNormal_Internal
	}
	private mImg_BG_Source_1_Internal: mw.Image
	public get mImg_BG_Source_1(): mw.Image {
		if(!this.mImg_BG_Source_1_Internal&&this.uiWidgetBase) {
			this.mImg_BG_Source_1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTopCanvas/mCanvas_SourceNormal/mImg_BG_Source_1') as mw.Image
		}
		return this.mImg_BG_Source_1_Internal
	}
	private mNormalText_Internal: mw.TextBlock
	public get mNormalText(): mw.TextBlock {
		if(!this.mNormalText_Internal&&this.uiWidgetBase) {
			this.mNormalText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTopCanvas/mCanvas_SourceNormal/mNormalText') as mw.TextBlock
		}
		return this.mNormalText_Internal
	}
	private mImg_Icon_Normal_Internal: mw.Image
	public get mImg_Icon_Normal(): mw.Image {
		if(!this.mImg_Icon_Normal_Internal&&this.uiWidgetBase) {
			this.mImg_Icon_Normal_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTopCanvas/mCanvas_SourceNormal/mImg_Icon_Normal') as mw.Image
		}
		return this.mImg_Icon_Normal_Internal
	}
	private mCardCanvas_Internal: mw.Canvas
	public get mCardCanvas(): mw.Canvas {
		if(!this.mCardCanvas_Internal&&this.uiWidgetBase) {
			this.mCardCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCardCanvas') as mw.Canvas
		}
		return this.mCardCanvas_Internal
	}
	private mScrollBox_Internal: mw.ScrollBox
	public get mScrollBox(): mw.ScrollBox {
		if(!this.mScrollBox_Internal&&this.uiWidgetBase) {
			this.mScrollBox_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCardCanvas/mScrollBox') as mw.ScrollBox
		}
		return this.mScrollBox_Internal
	}
	private cardItemCanvas_Internal: mw.Canvas
	public get cardItemCanvas(): mw.Canvas {
		if(!this.cardItemCanvas_Internal&&this.uiWidgetBase) {
			this.cardItemCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCardCanvas/mScrollBox/cardItemCanvas') as mw.Canvas
		}
		return this.cardItemCanvas_Internal
	}
	private encounterTag_Internal: mw.Canvas
	public get encounterTag(): mw.Canvas {
		if(!this.encounterTag_Internal&&this.uiWidgetBase) {
			this.encounterTag_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCardCanvas/mScrollBox/cardItemCanvas/encounterTag') as mw.Canvas
		}
		return this.encounterTag_Internal
	}
	private encounterTagText_Internal: mw.TextBlock
	public get encounterTagText(): mw.TextBlock {
		if(!this.encounterTagText_Internal&&this.uiWidgetBase) {
			this.encounterTagText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCardCanvas/mScrollBox/cardItemCanvas/encounterTag/encounterTagText') as mw.TextBlock
		}
		return this.encounterTagText_Internal
	}
	private evadeTag_Internal: mw.Canvas
	public get evadeTag(): mw.Canvas {
		if(!this.evadeTag_Internal&&this.uiWidgetBase) {
			this.evadeTag_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCardCanvas/mScrollBox/cardItemCanvas/evadeTag') as mw.Canvas
		}
		return this.evadeTag_Internal
	}
	private evadeTagText_Internal: mw.TextBlock
	public get evadeTagText(): mw.TextBlock {
		if(!this.evadeTagText_Internal&&this.uiWidgetBase) {
			this.evadeTagText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCardCanvas/mScrollBox/cardItemCanvas/evadeTag/evadeTagText') as mw.TextBlock
		}
		return this.evadeTagText_Internal
	}
	private mBottomCanvas_Internal: mw.Canvas
	public get mBottomCanvas(): mw.Canvas {
		if(!this.mBottomCanvas_Internal&&this.uiWidgetBase) {
			this.mBottomCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas') as mw.Canvas
		}
		return this.mBottomCanvas_Internal
	}
	private mBottomBg_Internal: mw.Image
	public get mBottomBg(): mw.Image {
		if(!this.mBottomBg_Internal&&this.uiWidgetBase) {
			this.mBottomBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mBottomBg') as mw.Image
		}
		return this.mBottomBg_Internal
	}
	private mCharacterCanvas_Internal: mw.Canvas
	public get mCharacterCanvas(): mw.Canvas {
		if(!this.mCharacterCanvas_Internal&&this.uiWidgetBase) {
			this.mCharacterCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mCharacterCanvas') as mw.Canvas
		}
		return this.mCharacterCanvas_Internal
	}
	private mCampBg_Internal: mw.Image
	public get mCampBg(): mw.Image {
		if(!this.mCampBg_Internal&&this.uiWidgetBase) {
			this.mCampBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mCharacterCanvas/mCampBg') as mw.Image
		}
		return this.mCampBg_Internal
	}
	private mCharacterIcon_Internal: mw.Button
	public get mCharacterIcon(): mw.Button {
		if(!this.mCharacterIcon_Internal&&this.uiWidgetBase) {
			this.mCharacterIcon_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mCharacterCanvas/mCharacterIcon') as mw.Button
		}
		return this.mCharacterIcon_Internal
	}
	private characterNameText_Internal: mw.TextBlock
	public get characterNameText(): mw.TextBlock {
		if(!this.characterNameText_Internal&&this.uiWidgetBase) {
			this.characterNameText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mCharacterCanvas/characterNameText') as mw.TextBlock
		}
		return this.characterNameText_Internal
	}
	private mChooseCanvas_Internal: mw.Canvas
	public get mChooseCanvas(): mw.Canvas {
		if(!this.mChooseCanvas_Internal&&this.uiWidgetBase) {
			this.mChooseCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas') as mw.Canvas
		}
		return this.mChooseCanvas_Internal
	}
	private mChange_Internal: mw.Canvas
	public get mChange(): mw.Canvas {
		if(!this.mChange_Internal&&this.uiWidgetBase) {
			this.mChange_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mChange') as mw.Canvas
		}
		return this.mChange_Internal
	}
	private reorderBtn_Internal: mw.TextBlock
	public get reorderBtn(): mw.TextBlock {
		if(!this.reorderBtn_Internal&&this.uiWidgetBase) {
			this.reorderBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mChange/reorderBtn') as mw.TextBlock
		}
		return this.reorderBtn_Internal
	}
	private mbtnChange_Internal: mw.Button
	public get mbtnChange(): mw.Button {
		if(!this.mbtnChange_Internal&&this.uiWidgetBase) {
			this.mbtnChange_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mChange/mbtnChange') as mw.Button
		}
		return this.mbtnChange_Internal
	}
	private mchangeBtn_Internal: mw.Button
	public get mchangeBtn(): mw.Button {
		if(!this.mchangeBtn_Internal&&this.uiWidgetBase) {
			this.mchangeBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mchangeBtn') as mw.Button
		}
		return this.mchangeBtn_Internal
	}
	private mCard1_Internal: mw.Canvas
	public get mCard1(): mw.Canvas {
		if(!this.mCard1_Internal&&this.uiWidgetBase) {
			this.mCard1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard1') as mw.Canvas
		}
		return this.mCard1_Internal
	}
	private mLight1_Internal: mw.Image
	public get mLight1(): mw.Image {
		if(!this.mLight1_Internal&&this.uiWidgetBase) {
			this.mLight1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard1/mLight1') as mw.Image
		}
		return this.mLight1_Internal
	}
	private mCardbg1_Internal: mw.Image
	public get mCardbg1(): mw.Image {
		if(!this.mCardbg1_Internal&&this.uiWidgetBase) {
			this.mCardbg1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard1/mCardbg1') as mw.Image
		}
		return this.mCardbg1_Internal
	}
	private txtEmpty1_Internal: mw.TextBlock
	public get txtEmpty1(): mw.TextBlock {
		if(!this.txtEmpty1_Internal&&this.uiWidgetBase) {
			this.txtEmpty1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard1/txtEmpty1') as mw.TextBlock
		}
		return this.txtEmpty1_Internal
	}
	private mNameBg1_Internal: mw.Image
	public get mNameBg1(): mw.Image {
		if(!this.mNameBg1_Internal&&this.uiWidgetBase) {
			this.mNameBg1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard1/mNameBg1') as mw.Image
		}
		return this.mNameBg1_Internal
	}
	private txtName1_Internal: mw.TextBlock
	public get txtName1(): mw.TextBlock {
		if(!this.txtName1_Internal&&this.uiWidgetBase) {
			this.txtName1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard1/txtName1') as mw.TextBlock
		}
		return this.txtName1_Internal
	}
	private mbtnIcon1_Internal: mw.Button
	public get mbtnIcon1(): mw.Button {
		if(!this.mbtnIcon1_Internal&&this.uiWidgetBase) {
			this.mbtnIcon1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard1/mbtnIcon1') as mw.Button
		}
		return this.mbtnIcon1_Internal
	}
	private mArrow1_Internal: mw.Image
	public get mArrow1(): mw.Image {
		if(!this.mArrow1_Internal&&this.uiWidgetBase) {
			this.mArrow1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard1/mArrow1') as mw.Image
		}
		return this.mArrow1_Internal
	}
	private mCard2_Internal: mw.Canvas
	public get mCard2(): mw.Canvas {
		if(!this.mCard2_Internal&&this.uiWidgetBase) {
			this.mCard2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard2') as mw.Canvas
		}
		return this.mCard2_Internal
	}
	private mLight2_Internal: mw.Image
	public get mLight2(): mw.Image {
		if(!this.mLight2_Internal&&this.uiWidgetBase) {
			this.mLight2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard2/mLight2') as mw.Image
		}
		return this.mLight2_Internal
	}
	private mCardbg2_Internal: mw.Image
	public get mCardbg2(): mw.Image {
		if(!this.mCardbg2_Internal&&this.uiWidgetBase) {
			this.mCardbg2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard2/mCardbg2') as mw.Image
		}
		return this.mCardbg2_Internal
	}
	private txtEmpty2_Internal: mw.TextBlock
	public get txtEmpty2(): mw.TextBlock {
		if(!this.txtEmpty2_Internal&&this.uiWidgetBase) {
			this.txtEmpty2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard2/txtEmpty2') as mw.TextBlock
		}
		return this.txtEmpty2_Internal
	}
	private mNameBg2_Internal: mw.Image
	public get mNameBg2(): mw.Image {
		if(!this.mNameBg2_Internal&&this.uiWidgetBase) {
			this.mNameBg2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard2/mNameBg2') as mw.Image
		}
		return this.mNameBg2_Internal
	}
	private txtName2_Internal: mw.TextBlock
	public get txtName2(): mw.TextBlock {
		if(!this.txtName2_Internal&&this.uiWidgetBase) {
			this.txtName2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard2/txtName2') as mw.TextBlock
		}
		return this.txtName2_Internal
	}
	private mbtnIcon2_Internal: mw.Button
	public get mbtnIcon2(): mw.Button {
		if(!this.mbtnIcon2_Internal&&this.uiWidgetBase) {
			this.mbtnIcon2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard2/mbtnIcon2') as mw.Button
		}
		return this.mbtnIcon2_Internal
	}
	private mArrow2_Internal: mw.Image
	public get mArrow2(): mw.Image {
		if(!this.mArrow2_Internal&&this.uiWidgetBase) {
			this.mArrow2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard2/mArrow2') as mw.Image
		}
		return this.mArrow2_Internal
	}
	private mCard3_Internal: mw.Canvas
	public get mCard3(): mw.Canvas {
		if(!this.mCard3_Internal&&this.uiWidgetBase) {
			this.mCard3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard3') as mw.Canvas
		}
		return this.mCard3_Internal
	}
	private mLight3_Internal: mw.Image
	public get mLight3(): mw.Image {
		if(!this.mLight3_Internal&&this.uiWidgetBase) {
			this.mLight3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard3/mLight3') as mw.Image
		}
		return this.mLight3_Internal
	}
	private mCardbg3_Internal: mw.Image
	public get mCardbg3(): mw.Image {
		if(!this.mCardbg3_Internal&&this.uiWidgetBase) {
			this.mCardbg3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard3/mCardbg3') as mw.Image
		}
		return this.mCardbg3_Internal
	}
	private txtEmpty3_Internal: mw.TextBlock
	public get txtEmpty3(): mw.TextBlock {
		if(!this.txtEmpty3_Internal&&this.uiWidgetBase) {
			this.txtEmpty3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard3/txtEmpty3') as mw.TextBlock
		}
		return this.txtEmpty3_Internal
	}
	private mNameBg3_Internal: mw.Image
	public get mNameBg3(): mw.Image {
		if(!this.mNameBg3_Internal&&this.uiWidgetBase) {
			this.mNameBg3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard3/mNameBg3') as mw.Image
		}
		return this.mNameBg3_Internal
	}
	private txtName3_Internal: mw.TextBlock
	public get txtName3(): mw.TextBlock {
		if(!this.txtName3_Internal&&this.uiWidgetBase) {
			this.txtName3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard3/txtName3') as mw.TextBlock
		}
		return this.txtName3_Internal
	}
	private mbtnIcon3_Internal: mw.Button
	public get mbtnIcon3(): mw.Button {
		if(!this.mbtnIcon3_Internal&&this.uiWidgetBase) {
			this.mbtnIcon3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard3/mbtnIcon3') as mw.Button
		}
		return this.mbtnIcon3_Internal
	}
	private mArrow3_Internal: mw.Image
	public get mArrow3(): mw.Image {
		if(!this.mArrow3_Internal&&this.uiWidgetBase) {
			this.mArrow3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard3/mArrow3') as mw.Image
		}
		return this.mArrow3_Internal
	}
	private mCard4_Internal: mw.Canvas
	public get mCard4(): mw.Canvas {
		if(!this.mCard4_Internal&&this.uiWidgetBase) {
			this.mCard4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard4') as mw.Canvas
		}
		return this.mCard4_Internal
	}
	private mLight4_Internal: mw.Image
	public get mLight4(): mw.Image {
		if(!this.mLight4_Internal&&this.uiWidgetBase) {
			this.mLight4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard4/mLight4') as mw.Image
		}
		return this.mLight4_Internal
	}
	private mCardbg4_Internal: mw.Image
	public get mCardbg4(): mw.Image {
		if(!this.mCardbg4_Internal&&this.uiWidgetBase) {
			this.mCardbg4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard4/mCardbg4') as mw.Image
		}
		return this.mCardbg4_Internal
	}
	private txtEmpty4_Internal: mw.TextBlock
	public get txtEmpty4(): mw.TextBlock {
		if(!this.txtEmpty4_Internal&&this.uiWidgetBase) {
			this.txtEmpty4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard4/txtEmpty4') as mw.TextBlock
		}
		return this.txtEmpty4_Internal
	}
	private mNameBg4_Internal: mw.Image
	public get mNameBg4(): mw.Image {
		if(!this.mNameBg4_Internal&&this.uiWidgetBase) {
			this.mNameBg4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard4/mNameBg4') as mw.Image
		}
		return this.mNameBg4_Internal
	}
	private txtName4_Internal: mw.TextBlock
	public get txtName4(): mw.TextBlock {
		if(!this.txtName4_Internal&&this.uiWidgetBase) {
			this.txtName4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard4/txtName4') as mw.TextBlock
		}
		return this.txtName4_Internal
	}
	private mbtnIcon4_Internal: mw.Button
	public get mbtnIcon4(): mw.Button {
		if(!this.mbtnIcon4_Internal&&this.uiWidgetBase) {
			this.mbtnIcon4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard4/mbtnIcon4') as mw.Button
		}
		return this.mbtnIcon4_Internal
	}
	private mArrow4_Internal: mw.Image
	public get mArrow4(): mw.Image {
		if(!this.mArrow4_Internal&&this.uiWidgetBase) {
			this.mArrow4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBottomCanvas/mChooseCanvas/mCard4/mArrow4') as mw.Image
		}
		return this.mArrow4_Internal
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
        
        this.initLanguage(this.mNormalText)
        
	
        this.initLanguage(this.encounterTagText)
        
	
        this.initLanguage(this.evadeTagText)
        
	
        this.initLanguage(this.characterNameText)
        
	
        this.initLanguage(this.reorderBtn)
        
	
        this.initLanguage(this.txtEmpty1)
        
	
        this.initLanguage(this.txtName1)
        
	
        this.initLanguage(this.txtEmpty2)
        
	
        this.initLanguage(this.txtName2)
        
	
        this.initLanguage(this.txtEmpty3)
        
	
        this.initLanguage(this.txtName3)
        
	
        this.initLanguage(this.txtEmpty4)
        
	
        this.initLanguage(this.txtName4)
        
	
        // 静态文本多语言
        
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.mNormalText)
        
	
        this.unregisterLanKey(this.encounterTagText)
        
	
        this.unregisterLanKey(this.evadeTagText)
        
	
        this.unregisterLanKey(this.characterNameText)
        
	
        this.unregisterLanKey(this.reorderBtn)
        
	
        this.unregisterLanKey(this.txtEmpty1)
        
	
        this.unregisterLanKey(this.txtName1)
        
	
        this.unregisterLanKey(this.txtEmpty2)
        
	
        this.unregisterLanKey(this.txtName2)
        
	
        this.unregisterLanKey(this.txtEmpty3)
        
	
        this.unregisterLanKey(this.txtName3)
        
	
        this.unregisterLanKey(this.txtEmpty4)
        
	
        this.unregisterLanKey(this.txtName4)
        
	
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
 