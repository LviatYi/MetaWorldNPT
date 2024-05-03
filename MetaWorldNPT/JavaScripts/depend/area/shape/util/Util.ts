import { AnyPoint, IPoint2, IPoint3 } from "../base/IPoint";
import Rectangle from "../r-tree/Rectangle";

export function point2ToRect(point: IPoint2): Rectangle {
    return new Rectangle([point.x, point.y], [point.x, point.y]);
}

export function point3ToRect(point: IPoint3, range: number = 0): Rectangle {
    const halfRange = range / 2;
    return new Rectangle(
        [point.x - halfRange, point.y - halfRange, point.z - halfRange],
        [point.x + halfRange, point.y + halfRange, point.z + halfRange],
    );
}

export function point3FromArray(point: number[]): IPoint3 {
    return {
        x: point[0],
        y: point[1],
        z: point[2],
    };
}

export function pointToArray(point: AnyPoint): number[] {
    if ("z" in point) {
        return [point.x, point.y, point.z];
    } else {
        return [point.x, point.y];
    }
}
