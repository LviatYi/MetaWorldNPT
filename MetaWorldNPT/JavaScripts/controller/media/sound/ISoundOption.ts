/**
 * 声效 控制参数.
 */
export interface ISoundOption {
    /**
     * Asset ID.
     */
    assetId: string;

    /**
     * 循环次数.
     * @desc <=0 不限次数
     * @desc >0 指定次数
     */
    loopCount?: number;

    /**
     * 音量大小.
     */
    volume?: number;

    /**
     * 是否 空间的.
     * @desc 仅空间音效的位置具有意义.
     * @desc 空间音效的位置决定衰减性.
     */
    isSpatial?: boolean;

    /**
     * 空间衰减函数模型.
     */
    attenuationDistanceModel?: mw.AttenuationDistanceModel;

    /**
     * 空间衰减形状.
     */
    attenuationShape?: mw.AttenuationShape;

    /**
     * 空间衰减形状的范围.
     * @desc 将按照适合的属性还原为 mw.Vector.
     * @desc [x,y?,z?]
     */
    attenuationShapeExtents?: number[];

    /**
     * 空间衰减距离.
     */
    falloffDistance?: number;

    /**
     * 是否 UI 的.
     * @desc UI 音效在游戏暂停时仍播放.
     */
    isUiSound?: boolean;

    /**
     * 是否 独占的.
     * @desc 独占音效在播放时会停止其他同 AssetId 音效.
     */
    isExclusive?: boolean;
}

/**
 * 声效 配置参数.
 */
export interface ISoundConfig extends ISoundOption {
    /**
     * Config ID.
     */
    id: number;
}

/**
 * 应用声效配置.
 * @desc 即便 go 已经生成 其内部配置仍需要资产加载后才可成功设置.
 * @desc 因此务必在调用该函数之前 load 资产.
 * @desc mw.Sound.play 会自动加载资产.
 * @param {mw.Sound} go
 * @param {ISoundOption} option 声效配置.
 * @param {number} volumeScale=1 音量缩放. 0-1
 * @param {boolean} applyAssetId=false 是否 应用 AssetId.
 */
export function applySoundOptionToGo(go: mw.Sound,
                                     option: ISoundOption,
                                     volumeScale: number = 1,
                                     applyAssetId: boolean = false) {
    if (applyAssetId) go.setSoundAsset(option.assetId);

    if (option.loopCount != undefined) go.isLoop = option.loopCount <= 0;
    if (option.volume != undefined) go.volume = option.volume * volumeScale;
    if (option.isSpatial != undefined) go.isSpatialization = option.isSpatial;
    if (option.attenuationDistanceModel != undefined) go.attenuationDistanceModel = option.attenuationDistanceModel;
    if (option.attenuationShape != undefined) go.attenuationShape = option.attenuationShape;
    if (option.attenuationShapeExtents != undefined) go.attenuationShapeExtents = shapeExtentArrayToVector(option.attenuationShapeExtents);
    if (option.falloffDistance != undefined) go.falloffDistance = option.falloffDistance;
    if (option.isUiSound != undefined) go.isUISound = option.isUiSound;
}

/**
 * 将 shapeExtentArray 转换为合适的 Vector.
 * @param {number[]} array
 * @return {mw.Vector}
 */
function shapeExtentArrayToVector(array: number[]): mw.Vector {
    if (array.length == 0) return Vector.zero;
    return new mw.Vector(array[0],
        array[1] ?? array[0],
        array[2] ?? array[0]);
}