/**
 * 是否包含对应位
 * @param subBits 子位
 * @param bits 父位
 */
export function isContain(subBits: number, bits: number) {
    return (subBits & bits) === subBits;
}


/**
 * 查找场景物体
 * @param guid 物体guid
 * @returns 查找物体的对象
 */
export function findGO<T>(guid: string) {
    return GameObject.findGameObjectById(guid) as T;
}

/**
 * 贝塞尔曲线
 * @param points 点集合
 * @param t [0,1]
 */
export function bezierCurve(points: mw.Vector[], t: number) {
    if (points.length < 2) return null;
    if (points.length === 2) return mw.Vector.lerp(points[0], points[1], t);

    const newPoints: mw.Vector[] = [];
    for (let i = 0; i < points.length - 1; i++) {
        const point0 = points[i];
        const point1 = points[i + 1];
        newPoints.push(mw.Vector.lerp(point0, point1, t));
    }

    return bezierCurve(newPoints, t);
}


/**
 * 数组转换成旋转
 * @param rot
 */
export function arrayToRot(rot: number[]): mw.Rotation {
    if (rot.length < 3) return mw.Rotation.zero;
    return new mw.Rotation(rot[0], rot[1], rot[2]);
}


/**
 * 数组转换成向量
 * @param rot
 */
export function arrayToVec(rot: number[]): mw.Vector {
    if (rot.length < 3) return mw.Vector.zero;
    return new mw.Vector(rot[0], rot[1], rot[2]);
}

/**
 * 复制向量数组
 * @param orgArr
 */
export function copyVecArray(orgArr: mw.Vector[]): mw.Vector[] {
    const newArr: mw.Vector[] = [];
    for (let i = 0; i < orgArr.length; i++) {
        newArr.push(orgArr[i].clone());
    }

    return newArr;
}

/**
 * 转换UI组件坐标
 * @param currentComp 需要转换的组件
 * @param targetComp 目标组件
 * @returns 转换到目标组件的本地位置
 */
export function convertUIComponentLoc<T extends mw.Widget, U extends mw.Widget>(currentComp: T, targetComp: U) {
    const currentParentGeometry = currentComp.parent.cachedGeometry;
    const targetGeometry = targetComp.cachedGeometry;
    const absPos = mw.localToAbsolute(currentParentGeometry, currentComp.position);
    const targetPos = mw.absoluteToLocal(targetGeometry, absPos);
    const centerPos = targetPos.add(currentComp.size.multiply(0.5));

    return centerPos;
}