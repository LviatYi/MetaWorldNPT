import Gtk from "gtoolkit";
import Log4Ts from "mw-log4ts";

/**
 * 粒子特效 控制参数.
 */
export interface IEffectOption {
    /**
     * Asset ID.
     */
    assetId: string;

    /**
     * 循环次数或时长.
     * @desc mw.Effect 区分为循环特效与非循环特效.
     * @desc 当特效为循环特效时 该属性作为循环时长. ms
     * @desc 当特效为非循环特效时 该属性作为循环次数.
     * @desc =0 不设置.
     */
    loopCountOrDuration?: number;

    /**
     * 位置偏移量.
     */
    positionOffset?: mw.Vector;

    /**
     * 旋转.
     */
    rotation?: mw.Vector;

    /**
     * 缩放.
     */
    scale?: mw.Vector;

    /**
     * 人形角色插槽类型.
     */
    slotType?: mw.HumanoidSlotType;

    /**
     * 浮点数 属性名及参数.
     */
    floatParams?: string[];

    /**
     * 随机浮点数 属性名及参数.
     */
    floatRandomParams?: string[];

    /**
     * 向量 属性名及参数.
     */
    vectorParams?: string[];

    /**
     * 随机向量 属性名及参数.
     */
    vectorRandomParams?: string[];

    /**
     * 色彩 属性名及参数.
     */
    colorParams?: string[];

    /**
     * 随机色彩 属性名及参数.
     */
    colorRandomParams?: string[];

    /**
     * 裁剪距离.
     * @desc 与玩家之间超出此距离的对象将被剪裁.
     */
    cullDistance?: number;

    /**
     * 单次特效粒子时长.
     * @desc 用于校正特效时长.
     */
    singleLength?: number;
}

/**
 * 粒子特效 配置参数.
 */
export interface IEffectConfig extends IEffectOption {
    /**
     * Config ID.
     */
    id: number;
}

/**
 * 应用粒子特效配置.
 * @desc 即便 go 已经生成 其内部配置仍需要资产加载后才可成功设置.
 * @desc 因此务必在调用该函数之前 load 资产.
 * @desc mw.Effect.play 会自动加载资产.
 * @param {mw.Effect} go
 * @param {IEffectOption} option 粒子特效配置.
 * @param {boolean} loopVerify 是否 循环的. 用于强制验证.
 *   mw.Effect 自身带有是否循环属性，然而这个属性并不总是准确的.
 *   当 loopVerify 不为 undefined 时，其将决定是否循环.
 */
export function applyEffectOptionToGo(go: mw.Effect,
                                      option: IEffectOption,
                                      loopVerify?: boolean) {
    if (option.rotation != undefined) go.worldTransform.rotation.set(
        option.rotation.x,
        option.rotation.y,
        option.rotation.z);
    if (option.scale != undefined) go.worldTransform.scale.set(option.scale);
    if (option.cullDistance != undefined && option.cullDistance !== 0) go.setCullDistance(option.cullDistance);

    for (const [key, params] of
        parseEffectParams(option.floatParams, "float")) {
        go.setFloat(key, params);
    }
    for (const [key, [min, max]] of
        parseEffectParams(option.floatRandomParams, "floatRandom")) {
        go.setFloatRandom(key, min, max);
    }
    for (const [key, params] of
        parseEffectParams(option.vectorParams, "vector")) {
        go.setVector(key, params);
    }
    for (const [key, [min, max]] of
        parseEffectParams(option.vectorRandomParams, "vectorRandom")) {
        go.setVectorRandom(key, min, max);
    }
    for (const [key, params] of
        parseEffectParams(option.colorParams, "color")) {
        go.setColor(key, params);
    }
    for (const [key, [min, max]] of
        parseEffectParams(option.colorRandomParams, "colorRandom")) {
        go.setColorRandom(key, min, max);
    }

    if (option.loopCountOrDuration != undefined) {
        if (loopVerify || (loopVerify == undefined && go.loop)) go.duration = option.loopCountOrDuration / 1e3;
        else go.loopCount = option.loopCountOrDuration;
    }
}

export type EffectParamAllowedType = {
    "float": number,
    "floatRandom": [number, number],
    "vector": mw.Vector,
    "vectorRandom": [mw.Vector, mw.Vector],
    "color": mw.LinearColor,
    "colorRandom": [mw.LinearColor, mw.LinearColor],
}

export function parseEffectParams<T extends keyof EffectParamAllowedType>(str: string[] | undefined, type: T)
    : [string, EffectParamAllowedType[T]][] {
    if (Gtk.isNullOrEmpty(str)) return [];

    const result: [string, EffectParamAllowedType[T]][] = [];
    str.forEach((s) => {
        if (Gtk.isNullOrEmpty(s)) return;
        const [key, value] = s.split(":");
        switch (type) {
            case "float":
                let val = Number(value);
                if (isNaN(val)) {
                    logENotValidParam(s);
                    return;
                }

                result.push([key, val as EffectParamAllowedType[T]]);
                break;
            case "floatRandom":
                const [min, max] = value.split(",")
                    .map(v => {
                        let value = Number(v);
                        return isNaN(value) ? value : 0;
                    });

                result.push([key, [min ?? 0, max ?? min ?? 0] as EffectParamAllowedType[T]]);
                break;
            case "vector":
                const [x, y, z] = value
                    .split(",")
                    .map(v => {
                        let value = Number(v);
                        return isNaN(value) ? value : 0;
                    });

                result.push([key, new mw.Vector(x ?? 0, y ?? 0, z ?? 0) as EffectParamAllowedType[T]]);
                break;
            case "vectorRandom":
                const [xMin, yMin, zMin,
                    xMax, yMax, zMax] = value
                    .split(",")
                    .map(v => {
                        let value = Number(v);
                        return isNaN(value) ? value : 0;
                    });

                result.push([key, [
                    new mw.Vector(xMin ?? 0, yMin ?? 0, zMin ?? 0),
                    new mw.Vector(xMax ?? xMin ?? 0, yMax ?? yMin ?? 0, zMax ?? zMin ?? 0),
                ] as EffectParamAllowedType[T]]);
                break;
            case "color":
                if (Gtk.isNullOrEmpty(value)) {
                    logENotValidParam(s);
                    return;
                }
                result.push([key, mw.LinearColor.colorHexToLinearColor(value) as EffectParamAllowedType[T]]);
                break;
            case "colorRandom":
                const [colorMin, colorMax] = value.split(",");
                if (Gtk.isNullOrEmpty(colorMin)) {
                    logENotValidParam(s);
                    return;
                }

                result.push([key, [
                    mw.LinearColor.colorHexToLinearColor(colorMin),
                    mw.LinearColor.colorHexToLinearColor(colorMax ?? colorMin),
                ] as EffectParamAllowedType[T]]);
                break;
        }
    });

    return result;
}

function logENotValidParam(s: string) {
    Log4Ts.error(parseEffectParams, `not valid param in ${s}`);
}
