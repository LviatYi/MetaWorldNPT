/**
 * Auto generate by ui editor.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用

 * Template Author
 * @zewei.zhang
 * @LviatYi
 * @version 31.5.1
 * UI: UI/lui/AutoComplete.ui
 */

import UIScript = mw.UIScript;


@UIBind('UI/lui/AutoComplete.ui')
export default class AutoComplete_Generate extends UIScript {
	private cnvInput_Internal: mw.Canvas
	public get cnvInput(): mw.Canvas {
		if(!this.cnvInput_Internal&&this.uiWidgetBase) {
			this.cnvInput_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/cnvInput') as mw.Canvas
		}
		return this.cnvInput_Internal
	}
	private scrContainer_Internal: mw.ScrollBox
	public get scrContainer(): mw.ScrollBox {
		if(!this.scrContainer_Internal&&this.uiWidgetBase) {
			this.scrContainer_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer') as mw.ScrollBox
		}
		return this.scrContainer_Internal
	}
	private cnvContainer_Internal: mw.Canvas
	public get cnvContainer(): mw.Canvas {
		if(!this.cnvContainer_Internal&&this.uiWidgetBase) {
			this.cnvContainer_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer') as mw.Canvas
		}
		return this.cnvContainer_Internal
	}
	private cnvGroupItem_Internal: mw.Canvas
	public get cnvGroupItem(): mw.Canvas {
		if(!this.cnvGroupItem_Internal&&this.uiWidgetBase) {
			this.cnvGroupItem_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvGroupItem') as mw.Canvas
		}
		return this.cnvGroupItem_Internal
	}
	private imgItemBgGroup_Internal: mw.Image
	public get imgItemBgGroup(): mw.Image {
		if(!this.imgItemBgGroup_Internal&&this.uiWidgetBase) {
			this.imgItemBgGroup_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvGroupItem/imgItemBgGroup') as mw.Image
		}
		return this.imgItemBgGroup_Internal
	}
	private imgHightlightGroup_Internal: mw.Image
	public get imgHightlightGroup(): mw.Image {
		if(!this.imgHightlightGroup_Internal&&this.uiWidgetBase) {
			this.imgHightlightGroup_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvGroupItem/imgHightlightGroup') as mw.Image
		}
		return this.imgHightlightGroup_Internal
	}
	private cnvItemLabelGroup_Internal: mw.Canvas
	public get cnvItemLabelGroup(): mw.Canvas {
		if(!this.cnvItemLabelGroup_Internal&&this.uiWidgetBase) {
			this.cnvItemLabelGroup_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvGroupItem/cnvItemLabelGroup') as mw.Canvas
		}
		return this.cnvItemLabelGroup_Internal
	}
	private txtItemGroup_Internal: mw.TextBlock
	public get txtItemGroup(): mw.TextBlock {
		if(!this.txtItemGroup_Internal&&this.uiWidgetBase) {
			this.txtItemGroup_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvGroupItem/cnvItemLabelGroup/txtItemGroup') as mw.TextBlock
		}
		return this.txtItemGroup_Internal
	}
	private cnvItem_Internal: mw.Canvas
	public get cnvItem(): mw.Canvas {
		if(!this.cnvItem_Internal&&this.uiWidgetBase) {
			this.cnvItem_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvItem') as mw.Canvas
		}
		return this.cnvItem_Internal
	}
	private imgItemBg_Internal: mw.Image
	public get imgItemBg(): mw.Image {
		if(!this.imgItemBg_Internal&&this.uiWidgetBase) {
			this.imgItemBg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvItem/imgItemBg') as mw.Image
		}
		return this.imgItemBg_Internal
	}
	private btnItem_Internal: mw.Button
	public get btnItem(): mw.Button {
		if(!this.btnItem_Internal&&this.uiWidgetBase) {
			this.btnItem_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvItem/btnItem') as mw.Button
		}
		return this.btnItem_Internal
	}
	private imgHightlight_Internal: mw.Image
	public get imgHightlight(): mw.Image {
		if(!this.imgHightlight_Internal&&this.uiWidgetBase) {
			this.imgHightlight_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvItem/imgHightlight') as mw.Image
		}
		return this.imgHightlight_Internal
	}
	private cnvItemLabel_Internal: mw.Canvas
	public get cnvItemLabel(): mw.Canvas {
		if(!this.cnvItemLabel_Internal&&this.uiWidgetBase) {
			this.cnvItemLabel_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvItem/cnvItemLabel') as mw.Canvas
		}
		return this.cnvItemLabel_Internal
	}
	private txtItem_Internal: mw.TextBlock
	public get txtItem(): mw.TextBlock {
		if(!this.txtItem_Internal&&this.uiWidgetBase) {
			this.txtItem_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/scrContainer/cnvContainer/cnvItem/cnvItemLabel/txtItem') as mw.TextBlock
		}
		return this.txtItem_Internal
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
        
        this.btnItem.onClicked.add(() => mw.Event.dispatchToLocal("__BUTTON_CLICKED__"));
        
	
        // 未暴露的文本按钮
        
        // 文本控件
        
        this.initLanguage(this.txtItemGroup)
        
	
        this.initLanguage(this.txtItem)
        
	
        // 未暴露的文本控件
        
    }

    protected overrideTextSetter() {
        
        globalThis.overrideTextBlockTextSetter(this.txtItemGroup);
        
	
        globalThis.overrideTextBlockTextSetter(this.txtItem);
        
	
    }

    protected unregisterTextLan(){
        // 文本按钮多语言
        
        // 隐藏文本按钮多语言
        
        // 文本多语言
        
        this.unregisterLanKey(this.txtItemGroup)
        
	
        this.unregisterLanKey(this.txtItem)
        
	
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