import RandomUtil from "../util/RandomUtil.js";
import moore from "./Moore.js";
import {squaredEuclideanDistance} from "./SquaredEuclideanDistance.js";

/**
 * 邻域 neighbour 选取范围基值.
 * @private
 */
const neighbourSelectionBaseRange: number = 1;

/**
 * 优化网格.
 * 以一维数组形式存储.
 */
class GridInfo {
    /**
     * 索引跨度.
     */
    public stride: number[];

    /**
     * 网格中对于点作为一维形态的索引.
     * 如果网格内存在任何一点，则保存.
     *      - index 通过计算 网格坐标 与 stride 对各维度加权得出.
     *      - value 点在 {GridInfo._samplePoints} 中的索引.
     */
    public data: Uint32Array;

    constructor(stride: number[], data: Uint32Array) {
        this.stride = stride;
        this.data = data;
    }
}

/**
 * Generate a sequence of random points with a distance constraint.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @see https://github.com/kchapelier/poisson-disk-sampling
 * @version 1.0.1
 * @licence MIT
 */
export default class PoissonDiskNoise {
//region Static Config
    /**
     * 点生成尝试次数默认值.
     * @private
     */
    private static readonly DEFAULT_MAX_TRAIL = 30;

    /**
     * 邻域 neighbour 选取范围基值.
     * @private
     */
    private static readonly NEIGHBOUR_SELECTION_BASE_RANGE: number = 1;
//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 最小生成距离.
     */
    public minDist: number;

    /**
     * 最大生成距离.
     */
    public maxDist: number;
    /**
     * 生成空间范围.
     * 决定维度与大小.
     */
    public shape: number[];

    /**
     * 最大尝试次数
     */
    public maxTrial: number;

    /**
     * 已采样点.
     * @private
     */
    public point: number[][];

    /**
     * 维度.
     * @private
     */
    private readonly _dimension: number;

    /**
     * 最小生成距离平方.
     * @private
     */
    private readonly _sqrMinDist: number;

    /**
     * 候选点.
     * @private
     */
    private _candidates: number[][];

    /**
     * 当前活跃点.
     * @private
     */
    private _currentPoint: number[];

    /**
     * 短距离精度.
     * @private
     */
    private readonly _minDistancePlusEpsilon: number;

    /**
     * 最大步长.
     * @private
     */
    private readonly _deltaDistance: number;

    /**
     * 优化网格的 cell 大小.
     * @private
     */
    private readonly _gridCellSize: number;

    /**
     * 优化网格的大小.
     * @private
     */
    private readonly _gridSize: number[];

    /**
     * 优化网格.
     * 允许快速寻找待追溯邻域内是否已存在至少一点.
     * 以一维数组进行存储.
     * @private
     */
    private _grid: GridInfo;

    /**
     * 优化网格的待追溯邻域.
     * @private
     */
    private readonly _neighbourhood: number[][];

    constructor(options: {
        /**
         * 最小生成距离
         */
        minDist: number;
        /**
         * 最大生成距离
         */
        maxDist?: number;
        /**
         * 生成空间范围.
         * 决定维度与大小.
         */
        shape: number[];
        /**
         * 最大尝试次数
         */
        maxTrial?: number;
    }) {
        this.minDist = options.minDist;
        this.maxDist = options.maxDist || this.minDist * 2;
        this.shape = options.shape;
        this.maxTrial = options.maxTrial || PoissonDiskNoise.DEFAULT_MAX_TRAIL;
        this._sqrMinDist = this.minDist * this.minDist;
        this._dimension = options.shape.length;
        this.point = new Array<Array<number>>();

        let maxShape = 0;
        for (let i = 0; i < this.shape.length; i++) {
            maxShape = Math.max(maxShape, this.shape[i]);
        }
        let floatPrecisionMitigation = Math.max(1, maxShape / 128 | 0);
        let epsilonDistance = 1e-14 * floatPrecisionMitigation;

        this._minDistancePlusEpsilon = this.minDist + epsilonDistance;
        this._deltaDistance = Math.max(0, this.maxDist - this._minDistancePlusEpsilon);

        this._neighbourhood = getCloseNeighbour(this._dimension);
        this._currentPoint = new Array<number>();
        this._candidates = new Array<Array<number>>();
        this._gridSize = new Array<number>();
        // |--------mD----------|
        // |                  / |
        // |-------1--------/   |
        // |              / |   |
        // |           /    |  mD
        // |       mD       1   |
        // |  sqrt(2)       |   |
        // |/               |   |
        // |-gdCellSize-----|---|
        this._gridCellSize = this.minDist / Math.sqrt(this._dimension);
        for (let i = 0; i < this._dimension; i++) {
            this._gridSize.push(Math.ceil(this.shape[i] / this._gridCellSize));
        }
        this._grid = generateGridInfo(this._gridSize);
    }

    /**
     * 是否已完成采样.
     */
    public get done() {
        return this.point.length > 0 && (!this._currentPoint) && this._candidates.length == 0;
    }

    /**
     * 直接添加一点.
     * 如果存在其他点，可能破坏 Poisson Disk 规则.
     * @param point
     */
    public directAddPoint(point: Array<number>) {
        let internalArrayIndex: number = 0;

        this._candidates.push(point);
        this.point.push(point);

        for (let d = 0; d < this._dimension; d++) {
            internalArrayIndex += ((point[d] / this._gridCellSize) | 0) * this._grid.stride[d];
        }

        this._grid.data[internalArrayIndex] = this.point.length;

        return point;
    }

    /**
     * 生成下一个点.
     *
     * @return point 生成点坐标.
     * 如果返回 null 则已经生成完毕 无法生成新点.
     * 但不一定意味着空间里无法插入满足条件的新点.
     */
    public next(): number[] {
        if (this.point.length === 0) {
            return this.addRandomPoint();
        }
        let point: number[];

        while (!point) {
            if (this.done) {
                return null;
            }
            point = this.generateNext();
        }
        return point;
    }

    /**
     * 向空间内填满点.
     */
    public fill() {
        if (this.point.length === 0) {
            this.addRandomPoint();
        }

        while (this.generateNext()) {
        }

        return this.point;
    }

    /**
     * 随机生成一点.
     * 如果已存在其他点 则可能破坏 Poisson Disk 规则.
     */
    public addRandomPoint() {
        const point: Array<number> = new Array<number>(this._dimension);

        for (let i = 0; i < this._dimension; i++) {
            point[i] = Math.random() * this.shape[i];
        }

        return this.directAddPoint(point);
    }

    /**
     * 判断是否已有一个邻点与点冲突.
     * @param point
     */
    private hasCloseNeighbourhood(point: number[]) {
        for (let neighbourIndex = 0; neighbourIndex < this._neighbourhood.length; neighbourIndex++) {
            let internalArrayIndex = 0;

            for (let d = 0; d < this._dimension; d++) {
                const currentDimensionValue = ((point[d] / this._gridCellSize) | 0) + this._neighbourhood[neighbourIndex][d];
                if (currentDimensionValue < 0 || currentDimensionValue >= this._gridSize[d]) {
                    internalArrayIndex = -1;
                    break;
                }
                internalArrayIndex += currentDimensionValue * this._grid.stride[d];
            }

            if (internalArrayIndex !== -1 && this._grid.data[internalArrayIndex] !== 0) {
                const existingPoint = this.point[this._grid.data[internalArrayIndex] - 1];

                if (squaredEuclideanDistance(point, existingPoint) < this._sqrMinDist) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 尝试生成下一个点.
     * @private
     * @return point 生成点坐标.
     */
    private generateNext(): number[] {
        while (this._candidates.length > 0) {
            if (this._currentPoint === null) {
                this._currentPoint = this._candidates.shift();
            }

            const currentPoint = this._currentPoint;

            let tries: number = 0;
            for (; tries < this.maxTrial; tries++) {
                let inShape: boolean = true;
                const distance = this._minDistancePlusEpsilon + this._deltaDistance * Math.random();

                const newPoint = RandomUtil.dimensionSphereRandom(this._dimension);

                for (let i = 0; inShape && i < this._dimension; i++) {
                    newPoint[i] = currentPoint[i] + newPoint[i] * distance;
                    inShape = (newPoint[i] >= 0 && newPoint[i] < this.shape[i]);
                }

                if (inShape && !this.hasCloseNeighbourhood(newPoint)) {
                    return this.directAddPoint(newPoint);
                }
            }

            if (tries === this.maxTrial) {
                this._currentPoint = null;
            }
        }

        return null;
    }
}

/**
 * 按距离排序与筛选的邻域点.
 * @param dimension
 */
function getCloseNeighbour(dimension: number) {
    const neighbourhood: number[][] = moore(2, dimension, true).filter(item => {
        let dist = 0;
        for (let d = 0; d < dimension; d++) {
            dist += Math.pow(Math.max(0, Math.abs(item[d]) - neighbourSelectionBaseRange), 2);
        }

        return dist < dimension;
    });

    neighbourhood.sort((item1, item2) => {
        let dist1: number = 0, dist2: number = 0;
        for (let d = 0; d < dimension; d++) {
            dist1 += Math.pow(item1[d], 2);
            dist2 += Math.pow(item2[d], 2);
        }

        return dist1 - dist2;
    });

    return neighbourhood;
}

/**
 * 根据网格大小生成网格.
 * @param gridShape
 */
function generateGridInfo(gridShape: Array<number>): GridInfo {
    let dimension: number = gridShape.length,
        totalLength: number = 1,
        stride: number[] = new Array(dimension);

    for (let d = dimension - 1; d >= 0; --d) {
        stride[d] = totalLength;
        totalLength = totalLength * gridShape[d];
    }

    return new GridInfo(stride, new Uint32Array(totalLength));
}