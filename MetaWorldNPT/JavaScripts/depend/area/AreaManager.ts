import { Singleton } from "../../util/GToolkit";
import { AnyPoint, IPoint3 } from "./shape/base/IPoint";
import { IAreaElement } from "./shape/base/IArea";
import Enumerable from "linq";

/**
 * @desc # AreaManager 区域管理器.
 * @desc
 * @desc 提供由 3D 点集或 2D 多边形构成区域的管理.
 * @desc
 * @desc ## 包依赖 Dependencies
 * @desc
 * @desc depends on robust-predicates.
 * @desc `npm install robust-predicates`
 * @desc
 * @desc ## 定义 Definition
 * @desc
 * @desc - 区域: 由 2维形状或 3维点集构成. 用于包含信息点.
 * @desc    - 2维形状: 由一系列2维点定义 构成凸包或非凸包.
 * @desc    - 3维点集: 由一系列3维点定义.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export default class AreaManager extends Singleton<AreaManager>() {
    //#region Constant
    private static readonly POINTS_3D_AREA_HOLDER_TAG = "points-3d-area-holder-tag";
    private static readonly SHAPE_2D_AREA_HOLDER_TAG = "shape-2d-area-holder-tag";
    public static readonly AREA_ID_TAG_PREFIX = "area-id-tag-";
    //#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    private _areaMap: Map<number, IAreaElement<AnyPoint>[]> = new Map();

    /**
     * 是否指定 AreaId 的区域中包含形状.
     * @param {number} id
     * @return {boolean}
     */
    public isIncludeShape(id: number): boolean {
        return Enumerable.from(this._areaMap.get(id))
            .any(a => a.type === "Shape");
    }

    /**
     * 获取区域中定义的点集合.
     * @desc
     * @param {number} id
     * @return {Enumerable.IEnumerable<IPoint3>}
     */
    public getPointSet(id: number): Enumerable.IEnumerable<IPoint3> {
        return Enumerable.from(this._areaMap.get(id))
            .where(a => a.type === "PointSet")
            .selectMany(a => a.points() as IPoint3[]);
    }
}
