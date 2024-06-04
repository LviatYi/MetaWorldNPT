import { Property } from "../Style";

export default abstract class Component {
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
                if (this.renderAnimHandler) {
                    mw.TimeUtil.onEnterFrame.remove(this.renderAnim);
                }
                this.destroy();
                this._root.destroyObject();
            };
        }
        if (this.renderAnimHandler) {
            mw.TimeUtil.onEnterFrame.add(this.renderAnim);
        }
    }

    public get root(): mw.Canvas {
        if (!this._root) this.initRoot();

        return this._root;
    }

    protected destroy(): void {
    };

    public attach(canvas: mw.Canvas | Component): this {
        if (canvas instanceof mw.Canvas) {
            canvas.addChild(this.root);
        } else {
            canvas.root.addChild(this.root);
        }

        return this;
    }

    public detach() {
        this._root?.removeObject();
    }

    private renderAnim: (dt: number) => void = (dt) => {
        if (this._root && this._root.visible) {
            this.renderAnimHandler(dt);
        }
    };

    protected renderAnimHandler: (dt: number) => void;
}

export interface ComponentOption<S = { x: number, y: number }> {
    size?: S;

    padding?: Property.Padding;

    zOrder?: number;
}