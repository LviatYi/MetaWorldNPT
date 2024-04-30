export type AnyPoint = IPoint2 | IPoint3;

/**
 * Point in 2D.
 */
export interface IPoint2 {
    x: number;
    y: number;
}

/**
 * Point in 3D.
 */
export interface IPoint3 {
    x: number;
    y: number;
    z: number;
}
