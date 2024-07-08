import { IPoint3 } from "gtoolkit";

interface ITransform {
    position: IPoint3;
}

interface ITransformable {
    parent: mw.GameObject | undefined;

    worldTransform: ITransform;

    localTransform: ITransform;
}

export class SimulatedWorldTransform implements ITransform {
    public parent: mw.GameObject | undefined;

    public localPos: IPoint3 = {
        x: 0,
        y: 0,
        z: 0,
    };

    private _cached: IPoint3;

    public get position(): IPoint3 {
        if (!this.parent) return this.localPos;

        if (!this._cached) this._cached = {x: 0, y: 0, z: 0};
        this._cached.x = this.localPos.x + this.parent.worldTransform.position.x;
        this._cached.y = this.localPos.y + this.parent.worldTransform.position.y;
        this._cached.z = this.localPos.z + this.parent.worldTransform.position.z;
        
        return this._cached;
    }

    public set position(pos: IPoint3) {
        if (this.parent) {
            const parentPos = this.parent.worldTransform.position;
            this.localPos.x = pos.x - parentPos.x;
            this.localPos.y = pos.y - parentPos.y;
            this.localPos.z = pos.z - parentPos.z;
        } else {
            this.localPos.x = pos.x;
            this.localPos.y = pos.y;
            this.localPos.z = pos.z;
        }
    }

    constructor(pos: IPoint3,
                parent: mw.GameObject | undefined) {
        this.parent = parent;
        this.localPos.x = pos.x;
        this.localPos.y = pos.y;
        this.localPos.z = pos.z;
    }
}

export class LinkedLocalTransform implements ITransform {
    private _linked: SimulatedWorldTransform;

    public set position(pos: IPoint3) {
        this._linked.localPos.x = pos.x;
        this._linked.localPos.y = pos.y;
        this._linked.localPos.z = pos.z;
    }

    public get position(): IPoint3 {
        return this._linked.localPos;
    }

    constructor(linked: SimulatedWorldTransform) {
        this._linked = linked;
    }
}

export class MwTransformer implements ITransformable {
    parent: mw.GameObject | undefined;

    worldTransform: ITransform;

    localTransform: ITransform;

    constructor(localPosition?: IPoint3, parent?: mw.GameObject) {
        const simulatedWorldTransform = new SimulatedWorldTransform(
            localPosition ?? {x: 0, y: 0, z: 0},
            parent);
        this.worldTransform = simulatedWorldTransform;
        this.localTransform = new LinkedLocalTransform(simulatedWorldTransform);
    }
}
