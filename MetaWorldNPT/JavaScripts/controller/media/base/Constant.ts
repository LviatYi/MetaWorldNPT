import { IPoint3 } from "gtoolkit";

/**
 * 假定的 粒子特效单次播放时长. ms
 */
export let DefaultEffectLength = 0.5e3;

/**
 * MediaService 全局同步用 Point3 缓存.
 * @type {{x: number, y: number, z: number}}
 */
export const GlobalCachedPoint3: IPoint3 = {x: 0, y: 0, z: 0};