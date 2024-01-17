import { Singleton } from "../depend/singleton/Singleton";

interface IKeyInteractive {
    keyEnable?(): boolean;
}

type KeyInteractiveUIScript = UIScript & IKeyInteractive


export class KeyboardManager extends Singleton<KeyboardManager>() {



    private _keyboardsState: Map<string, boolean> = new Map<string, boolean>();


    protected onConstruct(): void {

        // let keys = Object.keys(mw.Keys);

        // for (const key of keys) {
        //     const value = mw.Keys[key];
        //     let event1 = mw.InputUtil.onKeyDown(value, () => {
        //         this._keyboardsState.set(key, true);
        //         // this.onKeyDown.call(value as mw.Keys);
        //     });

        //     let event2 = mw.InputUtil.onKeyUp(value, () => {
        //         this._keyboardsState.set(key, false);
        //         // this.onKeyUp.call(value as mw.Keys);
        //     })

        //     this._keyboardsEvent.set(key, [event1, event2]);
        // }
    }


    onKeyDown<T extends KeyInteractiveUIScript>(key: Keys, tag: T, callback: () => void): void {
        let fun = () => {
            //判断在不在顶层
            if (this.keyTriggerGuard(key, tag)) {
                console.log(tag.constructor.name, " zorder:", tag.uiObject["slot"].zOrder)
                callback();
            } else {
                return;
            }
        }
        InputUtil.onKeyDown(key, fun);

    }

    onKeyUp(key: Keys, Tag: { name: string }): void {

    }



    public isKewDown(key: string): boolean {

        return !!this._keyboardsState.get(key);
    }

    getParent(ui: UIScript) {

    }
    private keyTriggerGuard<T extends KeyInteractiveUIScript>(key: Keys, tag: T): boolean {
        if (!(!tag.keyEnable || tag.keyEnable())) return false

        if (tag?.uiObject ?? null) return false;


    }
}

