import {Singleton} from "../depends/singleton/Singleton";
import {GameConfig} from "../config/GameConfig";
import {ISoundElement} from "../config/Sound";
import GToolkit from "../util/GToolkit";
import SoundService = Service.SoundService;

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
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.0.0a
 */
export default class AudioController extends Singleton<AudioController>() {
//region Member
    private _service: SoundService;

    private get service() {
        if (this._service) {
            this._service = SoundService.getInstance();
        }
        return this._service;
    }

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
            const currentVolumeScale = SoundService.getInstance().volumeScale;
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
            const currentVolumeScale = SoundService.getInstance().BGMVolumeScale;
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
     * 音效音量.
     */
    public get volumeScale(): number {
        return SoundService.getInstance().volumeScale;
    }

    public set volumeScale(val: number) {
        if (SoundService.getInstance().volumeScale !== val) {
            SoundService.getInstance().volumeScale = val;
        }
        this.volumeCache = val;
    }

    /**
     * 背景音量.
     * @constructor
     */
    public get bgmVolumeScale(): number {
        return SoundService.getInstance().BGMVolumeScale;
    }

    public set bgmVolumeScale(val: number) {
        if (SoundService.getInstance().BGMVolumeScale !== val) {
            SoundService.getInstance().BGMVolumeScale = val;
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
     * @param effectEnable 是否 静音音效.
     * @param bgmEnable 是否 静音背景音.
     */
    public mute(effectEnable: boolean, bgmEnable: boolean);

    /**
     * 设定静音.
     * @param enable 是否 静音所有声音.
     */
    public mute(enable: boolean);

    public mute(enable: boolean = false, bgmEnable: boolean = false) {
        if (bgmEnable === undefined) {
            bgmEnable = enable;
        }
        this.volumeScale = enable ? this.volumeCache : 0;
        this.bgmVolumeScale = enable ? this.bgmVolumeCache : 0;
    }

    /**
     * 播放一个 soundId 实例.
     * @param soundId
     * @param location
     * @return 返回 声音播放 id 或 guid.
     *      ig 二象性 源自 SoundService 的精妙设计.
     */
    public play(soundId: SoundIDEnum, location: Type.Vector = Type.Vector.zero): string | number {
        const config: ISoundElement = this.getConfig(soundId);
        let holdId: number | string;
        if (config.isEffect) {
            if (config.isStereo) {
                if (location.equals(Type.Vector.zero)) {
                    GToolkit.log(AudioController, `传入立体声音效 但播放位置为 zero. 请检查是否传入正确的参数.`);
                }
                holdId = this.service.play3DSound(
                    config.soundGuid,
                    location,
                    config.loopPlayBack,
                    config.volume,
                    {
                        innerRadius: config.innerRadius,
                        falloffDistance: config.falloffDistance,
                    },
                );
            } else {
                holdId = this.service.playSound(
                    config.soundGuid,
                    config.loopPlayBack,
                    config.volume,
                );
            }
        } else {
            this.service.stopBGM();
            this.service.playBGM(
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
        this.service.stopBGM();
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
                    if (config.isEffect) {
                        if (config.isStereo) {
                            this.service.stop3DSound(value as number);
                        } else {
                            this.service.stopSound(value as string);
                        }
                    } else {
                        this.service.stopBGM();
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
    private getConfig(soundId: SoundIDEnum): ISoundElement {
        return GameConfig.Sound.getElement(soundId);
    }

//endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}