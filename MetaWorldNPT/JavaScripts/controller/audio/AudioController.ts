import SoundService = mw.SoundService;
import {GameConfig} from "../../config/GameConfig";
import {ISoundElement} from "../../config/Sound";
import Log4Ts from "../../depend/log4ts/Log4Ts";
import {Singleton} from "../../depend/singleton/Singleton";

export enum SoundIDEnum {
    /**
     * 主场景BGM.
     */
    MainBGM = 1,
    /**
     * 通用按钮点击音效.
     */
    GeneralButtonClick = 2,
    /**
     * 奔跑音效.
     */
    MoveBGM = 3,
    /**
     * 跳跃按钮音效.
     */
    JumpButtonClick = 4,
}

/**
 * 声卡控制器.
 * @desc 提供听觉控制与配置接口.
 * @desc //TODO_LviatYi 脱离依赖鸡肋的 SoundService.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.2.1
 */
export default class AudioController extends Singleton<AudioController>() {
    //region Member
    private _volumeCache: number = -1;

    private _bgmVolumeCache: number = -1;

    /**
     * SoundIdEnum 与 id in SoundService 的映射.
     * 用于跟踪所有 SoundService 中的声音.
     * 但不意味着所有声音 id 都是有效的.
     * @private
     */
    private _soundMap: Map<SoundIDEnum, Set<number | string>> = new Map<SoundIDEnum, Set<number | string>>();
    //endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    //region Volume Controller

    /**
     * 音量缓存.
     * 上一次存在声音时的音量.
     * 永远为一个有效值：
     *      不为 0.
     *      默认为 1.
     * @private
     */
    private get volumeCache(): number {
        if (this._volumeCache < 0) {
            const currentVolumeScale = SoundService.volumeScale;
            this._volumeCache = currentVolumeScale !== 0 ? currentVolumeScale : 1;
        }
        return this._volumeCache;
    }

    private set volumeCache(value: number) {
        if (value !== 0) {
            this._volumeCache = value;
        }
    }

    /**
     * 背景音量缓存.
     * 上一次存在背景声音时的音量.
     * 永远为一个有效值：
     *      不为 0.
     *      默认为 1.
     * @private
     */
    private get bgmVolumeCache(): number {
        if (this._bgmVolumeCache < 0) {
            const currentVolumeScale = SoundService.BGMVolumeScale;
            this._bgmVolumeCache = currentVolumeScale !== 0 ? currentVolumeScale : 1;
        }
        return this._bgmVolumeCache;
    }

    private set bgmVolumeCache(value: number) {
        if (value !== 0) {
            this._bgmVolumeCache = value;
        }
    }

    /**
     * 音效音量. value in [0,1].
     */
    public get volumeScale(): number {
        return SoundService.volumeScale;
    }

    public set volumeScale(val: number) {
        if (SoundService.volumeScale !== val) {
            SoundService.volumeScale = val;
        }
        this.volumeCache = val;
    }

    /**
     * 背景音量. value in [0,1].
     * @constructor
     */
    public get bgmVolumeScale(): number {
        return SoundService.BGMVolumeScale;
    }

    public set bgmVolumeScale(val: number) {
        if (SoundService.BGMVolumeScale !== val) {
            SoundService.BGMVolumeScale = val;
        }
        this.bgmVolumeCache = val;
    }

    /**
     * 是否 播放音效.
     */
    public get isPlayEffect() {
        return this.volumeScale !== 0;
    }

    /**
     * 是否 播放背景音.
     */
    public get isPlayBgm() {
        return this.bgmVolumeScale !== 0;
    }

    //endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    //region Sound Controller
    /**
     * 设定静音.
     * @param mute 是否 静音.
     */
    public mute(mute: boolean = true) {
        this.muteBgm(mute);
        this.muteSoundEffect(mute);
    }

    /**
     * 设定静音背景音.
     * @param mute 是否 静音.
     */
    public muteBgm(mute: boolean = true) {
        this.bgmVolumeScale = mute ? 0 : this.bgmVolumeCache;
    }

    /**
     * 设定静音音效.
     * @param mute 是否 静音.
     */
    public muteSoundEffect(mute: boolean = true) {
        this.volumeScale = mute ? 0 : this.volumeCache;
    }

    /**
     * 播放一个 soundId 实例.
     * @param soundId
     * @param target 播放位置或播放游戏物体.
     * @return 返回 声音播放 id 或 guid.
     *      ig 二象性 源自 SoundService 的精妙设计.
     */
    public play(soundId: SoundIDEnum | number,
                target: mw.Vector | mw.GameObject | string = mw.Vector.zero): string | number {
        const config: ISoundElement = this.getConfig(soundId);
        if (!config) return;
        let holdId: number | string;
        if (config.isEffect) {
            if (config.isStereo) {
                if (target instanceof mw.Vector && target.equals(mw.Vector.zero)) {
                    Log4Ts.warn(AudioController,
                        `传入立体声音效. id: ${soundId}`,
                        `但播放位置为 zero. 请检查是否传入正确的参数.`);
                }
                holdId = SoundService.play3DSound(
                    config.soundGuid,
                    target,
                    config.loopCount,
                    config.volume,
                    {
                        radius: config.innerRadius,
                        falloffDistance: config.falloffDistance,
                    },
                );
            } else {
                holdId = SoundService.playSound(
                    config.soundGuid,
                    config.loopCount,
                    config.volume,
                );
            }
        } else {
            SoundService.stopBGM();
            SoundService.playBGM(
                config.soundGuid,
                config.volume,
            );
        }
        let set = this._soundMap.get(soundId);
        if (!set) {
            set = new Set<number | string>();
            this._soundMap.set(soundId, set);
        }
        set.add(holdId);
        return holdId;
    }

    /**
     * 停止 背景音.
     */
    public stopBgm() {
        SoundService.stopBGM();
    }

    /**
     * 停止所有 soundId 实例.
     * @param soundId
     */
    public stop(soundId: SoundIDEnum) {
        let set = this._soundMap.get(soundId);
        if (set) {
            const removeCache: (number | string)[] = [];
            set.forEach(
                (value) => {
                    const config = this.getConfig(soundId);
                    if (!config) return;
                    if (config.isEffect) {
                        if (config.isStereo) {
                            SoundService.stop3DSound(value as number);
                        } else {
                            SoundService.stopSound(value as string);
                        }
                    } else {
                        SoundService.stopBGM();
                    }
                    removeCache.push(value);
                },
            );
            for (const removeCacheElement of removeCache) {
                set.delete(removeCacheElement);
            }
        }
    }

    //endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    //region Helper
    /**
     * 获取配置.
     * @private
     */
    private getConfig(soundId: SoundIDEnum): ISoundElement | null {
        try {
            return GameConfig.Sound.getElement(soundId) ?? null;
        } catch (e) {
            Log4Ts.error(AudioController, `获取配置失败. id: ${soundId}`, e);
            return null;
        }
    }

    //endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

// class SoundHolder {
//     private _assetId: string;
//     private _soundGo: Sound;
//
//     private _is3D: boolean;
//     private _lastLoopCount: number;
//     private _volumeScale: number;
//
//     private _isDone = true;
//     private _isDestroy = false;
//     private _isLoading = false;
//
//     private _onComplete: SimpleDelegate<void> = new SimpleDelegate();
//     private _loadingWaitingPool: SimpleDelegate<void> = new SimpleDelegate();
//
//     public constructor(assetId: string) {
//         this._assetId = assetId;
//         this.loadAsset();
//     }
//
//     private async loadAsset(): Promise<boolean> {
//         if (SystemUtil.isClient()) {
//             if (this._isLoading || this._soundGo !== null) return;
//             this._isLoading = true;
//             SoundHolder
//                 .spawnAsset(this._assetId)
//                 .then(go => {
//                     this._isLoading = false;
//                     if (go !== null && go instanceof Sound) this.initGo(go);
//                     this._loadingWaitingPool.invoke();
//                     return Promise.resolve(true);
//                 });
//         } else {
//             Log4Ts.error(SoundHolder, `sound can't be created on server.`);
//             return Promise.resolve(false);
//         }
//     }
//
//     private initGo(go: Sound) {
//         if (this._isDestroy) {
//             go.destroy();
//             return;
//         }
//
//         this._soundGo = go;
//         this._soundGo.volume = 0;
//         this._soundGo.stop();
//         this._soundGo.onFinish.add(() => {
//             if (this._isDone) return;
//             this._lastLoopCount--;
//             if (this._lastLoopCount == 0) {
//                 this.stop();
//                 this._onComplete.invoke();
//             } else this._soundGo.play();
//         });
//         this._soundGo.onDestroyDelegate.add(() => {
//             this._soundGo = null;
//             this._isLoading = false;
//             this._isDone = true;
//         });
//     }
//
//     public destroy() {
//         if (this._isDestroy) return;
//         this._isDestroy = true;
//         this.stop();
//         if (this._soundGo !== null) {
//             try {
//                 this._soundGo.destroy();
//             } catch (e) {
//             }
//         }
//     }
//
//     private setCommonParams(is3D: boolean, loopNum: number = 1, volumeScale = 1) {
//         this._is3D = is3D;
//         this._isDone = false;
//         this._lastLoopCount = loopNum;
//         this._volumeScale = volumeScale;
//     }
//
//     play(volume: number, loopNum: number, volumeScale: number) {
//         if (this._isDestroy) return;
//
//         this.setCommonParams(false, loopNum, volumeScale);
//         this.doAsLoadDone(() => {
//             if (this._isDone || !this._soundGo) return;
//
//             this._soundGo.isSpatialization = false;
//             this._soundGo.isUISound = true;
//             this._soundGo.isLoop = loopNum <= 0;
//             this._soundGo.play();
//             this._soundGo.volume = this.getPlayVolume();
//         });
//
//     }
//
//     playInTarget(target, loopNum, volume, volumeScale, playParam) {
//         this.showLog("playInTarget");
//         if (this._isDestroy)
//             return;
//         this.setCommonParams(true, loopNum, volume, volumeScale);
//         this.asyncGetGo().then((go) => {
//             if (go == null || this._isDone)
//                 return;
//             go.parent = target;
//             go.localTransform.position = Type16.Vector.zero;
//             this.play3D(go, loopNum, playParam);
//         });
//     }
//
//     playInPos(pos, loopNum = 1, volume, volumeScale, playParam) {
//         if (this._isDestroy)
//             return;
//         this.setCommonParams(true, loopNum, volume, volumeScale);
//         this.asyncGetGo().then((go) => {
//             if (go == null || this._isDone)
//                 return;
//             go.parent = null;
//             go.worldTransform.position = pos;
//             this.play3D(go, loopNum, playParam);
//         });
//     }
//
//     play3D(sound: Sound, loopNum: number = 1, playParam: {
//         radius: number,
//         falloffDistance: number
//     } = undefined) {
//         const radius = playParam?.radius ?? 200;
//         const falloffDistance = playParam?.falloffDistance ?? 600;
//         sound.isSpatialization = true;
//         sound.isUISound = false;
//         sound.isLoop = loopNum <= 0;
//         sound.volume = this.getPlayVolume();
//         sound.attenuationShape = AttenuationShape.Sphere;
//         sound.attenuationShapeExtents = new Vector(radius, 0, 0);
//         sound.falloffDistance = falloffDistance;
//         sound.play();
//     }
//
//     stop() {
//         this._isDone = true;
//         try {
//             if (this._soundGo != null) {
//                 this._soundGo.parent = null;
//                 this._soundGo.stop();
//             }
//         } catch (e) {
//             e;
//         }
//     }
//
//     getPlayVolume() {
//         return this._volume * this.mVolumeScale;
//     }
//
//     set volumeScale(value) {
//         this.mVolumeScale = value;
//         if (this._soundGo != null) {
//             this._soundGo.volume = this.getPlayVolume();
//         }
//     }
//
//     set volume(value) {
//         this._volume = value;
//         if (this._soundGo != null) {
//             this._soundGo.volume = this.getPlayVolume();
//         }
//     }
//
//     get assetId() {
//         return this.mAssetId;
//     }
//
//     get isDone() {
//         return this._isDone;
//     }
//
//     get is3D() {
//         return this._is3D;
//     }
//
//     clone() {
//         return new SoundHolder(this._assetId);
//     }
//
//     private doAsLoadDone(callback: SimpleDelegateFunction<void>) {
//         if (this._isLoading) {
//             try {
//                 callback?.();
//             } catch (e) {
//             }
//         } else {
//             this._loadingWaitingPool.add(callback);
//         }
//     }
//
//     static async spawnAsset(assetId: string): Promise<Sound> {
//         if (AssetUtil.assetLoaded(assetId)) return GameObject.spawn<Sound>(assetId);
//         return new Promise((resolve) => {
//             AssetUtil.asyncDownloadAsset(assetId).then((success) => {
//                 if (success) {
//                     GameObject.asyncSpawn<Sound>(assetId).then((go) => resolve(go));
//                     return;
//                 }
//                 Log4Ts.log(SoundHolder,
//                     `asset load fail.`,
//                     `assetId: ${assetId}`);
//                 resolve(null);
//             });
//         });
//     }
// }