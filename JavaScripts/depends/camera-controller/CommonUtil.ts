
/**
 * 是否包含对应位
 * @param subBits 子位
 * @param bits 父位
 */
export function isContain(subBits: number, bits: number) {
    return (subBits & bits) === subBits;
}

/**
 * 通过guid进行角色换装（整套替换）
 * @param cha 人型对象
 * @param guidArr 换装数据
 * @returns 
 */
export function changeAppearance(cha: Gameplay.CharacterBase, guidArr: string) {
    let appearance = cha.getAppearance<Gameplay.HumanoidV2>();
    if (!appearance) {
        appearance = new Gameplay.HumanoidV2(cha);
    }

    appearance.clearAppearance();
    appearance.setAppearanceData([guidArr]);
}



/**
 * 查找场景物体
 * @param guid 物体guid
 * @returns 查找物体的对象
 */
export function findGO<T>(guid: string) {
    return Core.GameObject.find(guid) as T;
}

/**
 * 贝塞尔曲线
 * @param points 点集合 
 * @param t [0,1]
 */
export function bezierCurve(points: Type.Vector[], t: number) {
    if (points.length < 2) return null;
    if (points.length === 2) return Type.Vector.lerp(points[0], points[1], t);

    const newPoints: Type.Vector[] = [];
    for (let i = 0; i < points.length - 1; i++) {
        const point0 = points[i];
        const point1 = points[i + 1];
        newPoints.push(Type.Vector.lerp(point0, point1, t));
    }

    return bezierCurve(newPoints, t);
}


/**
 * 数组转换成旋转
 * @param rot 
 */
export function arrayToRot(rot: number[]): Type.Rotation {
    if (rot.length < 3) return Type.Rotation.zero;
    return new Type.Rotation(rot[0], rot[1], rot[2]);
}


/**
 * 数组转换成向量
 * @param rot 
 */
export function arrayToVec(rot: number[]): Type.Vector {
    if (rot.length < 3) return Type.Vector.zero;
    return new Type.Vector(rot[0], rot[1], rot[2]);
}

/**
 * 复制向量数组
 * @param orgArr 
 */
export function copyVecArray(orgArr: Type.Vector[]): Type.Vector[] {
    const newArr: Type.Vector[] = [];
    for (let i = 0; i < orgArr.length; i++) {
        newArr.push(orgArr[i].clone());
    }

    return newArr;
}

/**
 * 是否是当前玩家
 * @param sign 玩家ID|玩家角色guid
 */
export function isCurrentPlayer(sign: number | string) {
    if (typeof sign === "string")
        return sign === Gameplay.getCurrentPlayer().character.guid;

    return sign === Gameplay.getCurrentPlayer().getPlayerID();
}

/**
 * 设置天空球预设
 * @param preset 
 */
export function setSkyBox(preset: Gameplay.SkyPreset, defaultGuid?: string) {
    const skyBox = findGO<Gameplay.SkyBox>("4B3D5D4C44CEB3DB0432A3BAD536C315");
    skyBox.skyPreset = preset;

    if (defaultGuid) {
        skyBox.skyDomeTextureAssetByID = defaultGuid;
    }
}


/**
 * 转换UI组件坐标
 * @param currentComp 需要转换的组件
 * @param targetComp 目标组件
 * @returns 转换到目标组件的本地位置
 */
export function convertUIComponentLoc<T extends UI.Widget, U extends UI.Widget>(currentComp: T, targetComp: U) {
    const currentParentGeometry = currentComp.parent.cachedGeometry;
    const targetGeometry = targetComp.cachedGeometry;
    const absPos = UI.localToAbsolute(currentParentGeometry, currentComp.position);
    const targetPos = UI.absoluteToLocal(targetGeometry, absPos);
    const centerPos = targetPos.add(currentComp.size.multiply(0.5));

    return centerPos;
}