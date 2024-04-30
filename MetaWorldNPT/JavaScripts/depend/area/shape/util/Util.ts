import { IPoint2, IPoint3 } from "../base/IPoint";

/**
 * bounding box in Points.
 * @param {IPoint2[]} points
 * @return {[IPoint2, IPoint2]}
 */
export function pointsBoundingBoxIn2D(points: IPoint2[]): [IPoint2, IPoint2] {
    let minX: number = points[0]?.x ?? 0;
    let minY: number = points[0]?.y ?? 0;
    let maxX: number = points[0]?.x ?? 0;
    let maxY: number = points[0]?.y ?? 0;

    for (const point of points) {
        if (point.x < minX) {
            minX = point.x;
        }
        if (point.y < minY) {
            minY = point.y;
        }
        if (point.x > maxX) {
            maxX = point.x;
        }
        if (point.y > maxY) {
            maxY = point.y;
        }
    }

    return [
        { x: minX, y: minY },
        { x: maxX, y: maxY },
    ];
}

/**
 * bounding box in Shape.
 * @param {IPoint3[]} points
 * @return {[IPoint3, IPoint3]}
 */
export function pointsBoundingBoxIn3D(points: IPoint3[]): [IPoint3, IPoint3] {
    let minX: number = points[0]?.x ?? 0;
    let minY: number = points[0]?.y ?? 0;
    let minZ: number = points[0]?.z ?? 0;
    let maxX: number = points[0]?.x ?? 0;
    let maxY: number = points[0]?.y ?? 0;
    let maxZ: number = points[0]?.z ?? 0;

    for (const point of points) {
        if (point.x < minX) {
            minX = point.x;
        }
        if (point.y < minY) {
            minY = point.y;
        }
        if (point.z < minZ) {
            minZ = point.z;
        }
        if (point.x > maxX) {
            maxX = point.x;
        }
        if (point.y > maxY) {
            maxY = point.y;
        }
        if (point.z > maxZ) {
            maxZ = point.z;
        }
    }

    return [
        { x: minX, y: minY, z: minZ },
        { x: maxX, y: maxY, z: maxZ },
    ];
}

export function Point3FromArray(point: number[]): IPoint3 {
    return {
        x: point[0],
        y: point[1],
        z: point[2],
    };
}