interface ITransform {
    position: mw.Vector;
}

interface ITransformable {
    parent: mw.GameObject | undefined;

    worldTransform: ITransform;

    localTransform: ITransform;
}

export class LinkedTransform implements ITransform {
    parent: mw.GameObject | undefined;

    public pos: mw.Vector = mw.Vector.zero;

    public get position(): mw.Vector {
        return this.parent ?
            this.parent.worldTransform.position.clone().add(this.pos) :
            this.pos;
    }

    public set position(pos: mw.Vector) {
        if (this.parent) {
            const parentPos = this.parent.worldTransform.position;
            this.pos.x = pos.x - parentPos.x;
            this.pos.y = pos.y - parentPos.y;
            this.pos.z = pos.z - parentPos.z;
        } else {
            this.pos.set(pos);
        }

        this.changedCallback?.(pos);
    }

    public changedCallback: ((pos: mw.Vector) => void) | undefined;

    constructor(pos: mw.Vector,
                parent: mw.GameObject | undefined,
                changedCallback?: (pos: mw.Vector) => void) {
        this.parent = parent;
        this.pos = pos;
        this.changedCallback = changedCallback;
    }
}

export class MwTransformer implements ITransformable {
    parent: mw.GameObject | undefined;

    worldTransform: ITransform;

    localTransform: ITransform;

    constructor(localPosition?: mw.Vector, parent?: mw.GameObject) {
        this.worldTransform = new LinkedTransform(
            localPosition ?? mw.Vector.zero,
            parent,
            (pos) => {
                if (this.localTransform) this.localTransform.position = pos;
            });
        this.localTransform = new LinkedTransform(
            localPosition ?? mw.Vector.zero,
            undefined,
            (pos) => {
                if (this.worldTransform) this.worldTransform.position = pos;
            });
    }
}
