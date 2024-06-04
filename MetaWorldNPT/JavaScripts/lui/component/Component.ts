import Log4Ts from "../../depend/log4ts/Log4Ts";

export abstract class Component {
    protected static create(): Component {
        throw new Error("not implemented.");
    }

    protected static defaultOption(): unknown {
        throw new Error("not implemented.");
    }

    private _root: mw.Canvas;

    protected initRoot(_root?: mw.Canvas): void {
        this._root = _root ?
            _root :
            mw.Canvas.newObject(undefined, "root");
        this._root.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        if (this._root.destroyObject === this._root.constructor.prototype.destroyObject) {
            this._root.destroyObject = () => {
                this.destroy();
                this._root.destroyObject();
            };
        }
    }

    public get root(): mw.Canvas {
        return this._root;
    }

    protected abstract destroy(): void;

    public attach(canvas: mw.Canvas | Component): this {
        if (!this._root) {
            Log4Ts.log(Component, `not ready.`);
            return this;
        }

        if (canvas instanceof mw.Canvas) {
            canvas.addChild(this._root);
        } else {
            canvas.root.addChild(this._root);
        }

        return this;
    }
}