import { Property } from "../style/Property";
import Gtk, { Delegate } from "gtoolkit";

const rootComponentMap: Map<mw.Widget, Component> = new Map();

export abstract class Component {
    protected static create(): Component {
        throw new Error("not implemented.");
    }

    protected static defaultOption(): unknown {
        throw new Error("not implemented.");
    }

    private static destroyObject(component: Component) {
        component._destroyed = true;
        component.onDestroy.invoke();
        rootComponentMap.get(component.root.parent)?._componentChildren.delete(component);

        for (const componentChild of component._componentChildren.values()) {
            componentChild.destroy();
        }

        if (component.renderAnimHandler) {
            mw.TimeUtil.onEnterFrame.remove(component.renderAnim);
        }
        component.destruct();
        component._root.constructor.prototype.destroyObject.call(component._root);
        rootComponentMap.delete(component.root);
    }

    private _root: mw.Canvas;

    private _componentChildren: Set<Component> = new Set();

    private _destroyed: boolean = false;

    public get destroyed(): boolean {
        return this._destroyed;
    }

    protected initRoot(_root?: mw.Canvas): void {
        this._root = _root ? _root :
            mw.Canvas.newObject(undefined, "root");

        rootComponentMap.set(this._root, this);

        this._root.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        if (this._root.destroyObject === this._root.constructor.prototype.destroyObject) {
            this._root.destroyObject = () => {
                Component.destroyObject(this);
            };
        }
        if (this.renderAnimHandler) {
            mw.TimeUtil.onEnterFrame.add(this.renderAnim);
        }
    }

    public get name(): string {
        return this.constructor.name;
    }

    public get root(): mw.Canvas {
        if (!this._root) this.initRoot();

        return this._root;
    }

    public setLayout(option: ComponentOption): this {
        if (this._root) {
            if (option.zOrder !== undefined) this._root.zOrder = option.zOrder;

            Gtk.setUiSize(this._root, option.size.x, option.size.y);
        }

        return this;
    }

    protected destruct(): void {
    }

    public attach(canvas: mw.Canvas | Component): this {
        if (this._root?.parent) this.detach();

        if (canvas instanceof mw.Canvas) {
            canvas.addChild(this._root);
            traceComponentParent(canvas)?._componentChildren.add(this);
        } else {
            canvas.root.addChild(this._root);
            canvas._componentChildren.add(this);
        }

        this.onAttach.invoke();
        return this;
    }

    public detach() {
        if (!this._root?.parent) return;

        this.onDetach.invoke();
        rootComponentMap.get(this.root)
            ?._componentChildren.delete(this);
        this._root?.removeObject();
    }

    public destroy() {
        if (this._destroyed) return;
        this._root?.destroyObject();
    }

//#region Anim
    private renderAnim: (dt: number) => void = (dt) => {
        if (this._root && this._root.visible) {
            this.renderAnimHandler(dt);
        }
    };

    protected renderAnimHandler: (dt: number) => void;
//#endregion

//#region Event
    public onAttach: Delegate.SimpleDelegate<void> = new Delegate.SimpleDelegate<void>().setProtected();

    public onDetach: Delegate.SimpleDelegate<void> = new Delegate.SimpleDelegate<void>().setProtected();

    public onDestroy: Delegate.SimpleDelegate<void> = new Delegate.SimpleDelegate<void>().setProtected();
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export interface ComponentOption {
    size?: { x: number, y: number };

    padding?: Property.Padding;

    zOrder?: number;
}

/**
 * 追溯 Widget 的首个祖先组件.
 * @param {mw.Widget} widget
 * @return {Component | undefined}
 */
function traceComponentParent(widget: mw.Widget): Component | undefined {
    let focus = widget;
    while (focus) {
        if (rootComponentMap.has(focus)) return rootComponentMap.get(focus);
        focus = focus.parent;
    }

    return undefined;
}

/**
 * Extract layout from option.
 * @param {ComponentOption} option
 * @returns {[
 * [number, number],
 * [number, number, number, number],
 * [number, number]
 * ]}
 *      [x,y]
 *      [pt, pr, pb, pl]
 *      [x - pl - pr, y - pt - pb]
 */
export function extractLayoutFromOption(option: ComponentOption): [
    [number, number],
    [number, number, number, number],
    [number, number]] {
    const [x, y] = [option.size.x, option.size.y];
    const [pt, pr, pb, pl] = [option.padding.top ?? 0,
        option.padding.right ?? 0,
        option.padding.bottom ?? 0,
        option.padding.left ?? 0,
    ];
    return [[x, y],
        [pt, pr, pb, pl],
        [x - pl - pr, y - pt - pb]];
}

/**
 * Override layout option.
 * @param {ComponentOption} self
 * @param {ComponentOption} from
 * @returns {ComponentOption}
 */
export function overrideOption(self: ComponentOption,
                               from: ComponentOption): ComponentOption {
    if (self === from) return;
    if (from?.zOrder !== undefined) self.zOrder = from.zOrder;
    if (from?.size !== undefined) {
        if (from.size.x !== undefined) self.size.x = from.size.x;
        if (from.size.y !== undefined) self.size.y = from.size.y;
    }
    if (from?.padding) {
        if (from.padding.top !== undefined) self.padding.top = from.padding.top;
        if (from.padding.right !== undefined) self.padding.right = from.padding.right;
        if (from.padding.bottom !== undefined) self.padding.bottom = from.padding.bottom;
        if (from.padding.left !== undefined) self.padding.left = from.padding.left;
    }

    return self;
}

/**
 * 获取 root 为 Canvas 的组件.
 * @param {mw.Canvas} root
 * @returns {Component | undefined}
 */
export function getComponentFromRoot<T extends Component>(root: mw.Widget): T | undefined {
    return rootComponentMap.get(root) as T;
}

let lastTouchActivePosition: mw.Vector2[] = [];

let touchActive: boolean[] = [];

function updateLastTouchActivePosition(index: number, x: number, y: number) {
    if (lastTouchActivePosition[index]) lastTouchActivePosition[index] = new mw.Vector2();
    lastTouchActivePosition[index].set(x, y);
}

/**
 * Get last touch active position.
 * @param {number} index
 * @return {mw.Vector2 | undefined}
 */
export function getLastTouchActivePosition(index: number): mw.Vector2 | undefined {
    return lastTouchActivePosition[index];
}

/**
 * Check if touch is active.
 * @param {number} index
 * @return {boolean}
 */
export function isTouchActive(index: number): boolean {
    return touchActive[index] ?? false;
}

/**
 * Get click position on platform.
 * @return {mw.Vector2 | undefined}
 */
export function getClickPositionOnPlatform(): mw.Vector2 | undefined {
    return Gtk.useMouse ?
        mw.getMousePositionOnPlatform() :
        getLastTouchActivePosition(0);
}

if (mw.SystemUtil.isClient()) {
    mw.InputUtil?.["onRawTouchBegin"]?.()?.add((index, location) => {
        updateLastTouchActivePosition(index, location.x, location.y);
        touchActive[index] = true;
    });

    mw.InputUtil?.["onRawTouchMove"]?.()?.add((index, location) => {
        updateLastTouchActivePosition(index, location.x, location.y);
    });

    mw.InputUtil?.["onRawTouchEnd"]?.()?.add((index) => {
        touchActive[index] = false;
    });
}