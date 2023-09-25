/**
 * 两点欧几里得距离的平方.
 * @param a
 * @param b
 */
export function squaredEuclideanDistance(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        return 0;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result += Math.pow(a[i] - b[i], 2);
    }

    return result;
}