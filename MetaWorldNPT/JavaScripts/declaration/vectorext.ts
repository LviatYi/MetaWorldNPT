
const tempV: mw.Vector = mw.Vector.zero;

function initialize() {




    Object.defineProperty(mw.Vector.prototype, "lerp", {
        value: function (to: mw.Vector, t: number, outer: mw.Vector) {
            return mw.Vector.lerp(this, to, t, outer ? outer : this);
        },
        configurable: false
    })

    Object.defineProperty(mw.Vector.prototype, "lerps", {
        value: function (from: mw.Vector, to: mw.Vector, t: number) {
            mw.Vector.lerp(from, to, t, this);
            return this;
        },
        configurable: false
    })

    Object.defineProperty(mw.Vector.prototype, 'clamp', {

        value: function (min: { x: number; y: number; z: number; }, max: { x: number; y: number; z: number; }) {
            this.x = Math.max(min.x, Math.min(max.x, this.x));
            this.y = Math.max(min.y, Math.min(max.y, this.y));
            this.z = Math.max(min.z, Math.min(max.z, this.z));
            return this;
        }
    })



    Object.defineProperty(mw.Vector.prototype, 'min', {

        value: function (v: { x: number; y: number; z: number; }) {
            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);
            this.z = Math.min(this.z, v.z);

            return this;
        }
    })


    Object.defineProperty(mw.Vector.prototype, 'max', {

        value: function (v: { x: number; y: number; z: number; }) {
            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);
            this.z = Math.max(this.z, v.z);
            return this;

        }
    })

    Object.defineProperty(mw.Vector.prototype, 'mix', {

        value: function (this: mw.Vector, v: { x: number; y: number; z: number; }, t: number) {
            this.x = this.x + (v.x - this.x) * t;
            this.y = this.y + (v.y - this.y) * t;
            this.z = this.z + (v.z - this.z) * t;
            return this;


        }
    })

    Object.defineProperty(mw.Vector.prototype, 'rotate', {

        value: function (v: number) {
            const radius = v * Math.PI / 180
            const { x, y } = this
            this.x = x * Math.cos(radius) - y * Math.sin(radius);
            this.y = (x * Math.sin(radius) + y * Math.cos(radius));
            return this;
        }
    })

    Object.defineProperty(mw.Vector.prototype, 'dot', {

        value: function (v: { x: number; y: number; z: number; }) {
            mw.Vector.dot(this, v as mw.Vector);
        }
    })

    Object.defineProperty(mw.Vector.prototype, "cross", {
        value: function (v: { z: number; y: number; x: number; }) {

            mw.Vector.cross(this, v as mw.Vector, this);

            return this;
        }
    })

    Object.defineProperty(mw.Vector.prototype, "crossVectors", {
        value: function (a: { x: any; y: any; z: any; }, b: { x: any; y: any; z: any; }) {
            mw.Vector.cross(a as mw.Vector, b as mw.Vector, this);

            return this;
        }
    })

    Object.defineProperty(mw.Vector.prototype, "angleTo", {
        value: function (v: mw.Vector) {
            const denominator = Math.sqrt(this.sqrLength * v.sqrLength);

            if (denominator === 0) return 0;

            const theta = this.dot(v) / denominator;

            return Math.acos(clamp(theta, - 1, 1));
        }
    })

    Object.defineProperty(mw.Vector.prototype, "distanceTo", {
        value: function (v: mw.Vector) {
            return Math.sqrt(this.squaredDistanceTo(v));
        }
    })

    Object.defineProperty(mw.Vector.prototype, "squaredDistanceTo", {
        value: function (v: mw.Vector) {
            const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

            return (dx * dx) + (dy * dy) + (dz * dz);
        }
    })


    Object.defineProperty(mw.Vector.prototype, "equal", {
        value: function (v: mw.Vector) {
            return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
        }
    })


    Object.defineProperty(mw.Vector.prototype, 'subVectors', {
        value: function (a: mw.Vector, b: mw.Vector) {

            return mw.Vector.subtract(a, b, this);

        }

    })



    Object.defineProperty(mw.Vector.prototype, 'assert', {

        value: function () {
            if (isNaN(this.x)) {
                throw new Error("unValid x component of vector")
            }
            if (isNaN(this.y)) {
                throw new Error("unValid y component of vector")
            }
            if (isNaN(this.z)) {
                throw new Error("unValid z component of vector")
            }

            return this;
        }
    })

    Object.defineProperty(mw.Rotation.prototype, "lerp", {
        value: function (from: mw.Rotation, t: number) {
            this.set(mw.Rotation.lerp(this, from, t));
            return this;
        },
        configurable: false
    })



    Object.defineProperty(mw.Rotation.prototype, "lerps", {
        value: function (from: mw.Rotation, to: mw.Rotation, t: number) {
            this.set(mw.Rotation.lerp(from, to, t));
            return this;
        },
        configurable: false
    })


    Object.defineProperty(mw.Vector2.prototype, "lerp", {
        value: function (to: mw.Vector2, t: number, outer?: mw.Vector2) {
            return mw.Vector2.lerp(this, to, t, outer ? outer : this);
        },
        configurable: false
    })
}

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));

}


export const VectorExt = {
    initialize
}