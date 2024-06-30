import Gtk, { Singleton } from "gtoolkit";
import { ISoundOption } from "./sound/ISoundOption";
import { SoundProxy, SoundState } from "./sound/SoundProxy";
import Log4Ts from "mw-log4ts/Log4Ts";

/**
 * MediaService 多媒体管理器.
 * @desc 对音效与特效进行管理.
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
export class MediaService extends Singleton<MediaService>() {
//#region Constant
    /**
     * Server 要求播放 Sound 事件 事件名.
     */
    public static readonly ServerPlaySoundEventName
        = "__SERVER_PLAY_SOUND_EVENT_NAME__";

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄ ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Fields
    private _debug: boolean = true;

    private _mapSoundProxy: Map<string, SoundProxy[]> = new Map();

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config
    /**
     * 调试模式.
     * @param {boolean} enable=true 是否启用 调试模式.
     * @return {this}
     */
    public debug(enable: boolean = true): this {
        this._debug = enable;

        return this;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 播放一个声效.
     * @desc 客户端将返回一个 SoundProxy 用于更精细的操作.
     * @desc 服务端将返回 undefined 仅作为一个简单播放接口.
     * @param {ISoundOption} option
     * @param {mw.Vector} position
     * @param {mw.GameObject} parent
     * @param {boolean} autoDestroy 是否 自动销毁.
     *    undefined 时采用默认策略.
     *    - 当独占时, false.
     *    - 当非独占时, true.
     * @return {SoundProxy | undefined}
     */
    public playSound(option: ISoundOption,
                     position?: mw.Vector,
                     parent?: mw.GameObject,
                     autoDestroy?: boolean): SoundProxy | undefined {
        if (isClient()) {
            return this.loadSoundHandler(option,
                position,
                parent,
                autoDestroy ?? (!option.isExclusive)).play();
        } else if (isServer()) {
            mw.Event.dispatchToAllClient(MediaService.ServerPlaySoundEventName,
                option,
                position,
                parent,
                autoDestroy ?? (!option.isExclusive));
            return undefined;
        }
    }

    /**
     * 加载一个声效.
     * @desc 仅客户端.
     * @param {ISoundOption} option
     * @param {mw.Vector} position
     * @param {mw.GameObject} parent
     * @param {boolean} autoDestroy
     * @return {SoundProxy} SoundProxy
     * @private
     */
    private loadSoundHandler(option: ISoundOption,
                             position: mw.Vector | undefined,
                             parent: mw.GameObject | undefined,
                             autoDestroy: boolean): SoundProxy {
        let sound: SoundProxy | undefined;
        if (option.isExclusive ?? false) {
            const list = this._mapSoundProxy.get(option.assetId);
            if (list) {
                const index = list.findIndex(item => item.state === SoundState.Destroy);
                if (index >= 0) {
                    sound = list[index];
                }

                for (let i = 0; i < list.length; ++i) {
                    if (i === index) continue;
                    const s = list[i];
                    s.stop().destroy();
                }
            }
        }

        if (!sound) sound = new SoundProxy(option,
            autoDestroy,
            position,
            parent);

        this.registerSoundProxy(option.assetId, sound);
        sound.onDestroy.add(() => this.unregisterSoundProxy(option.assetId, sound));

        return sound;
    }

    /**
     * 获取所有指定的声效.
     * @param {string} assetId
     * @return {SoundProxy[]}
     */
    public getSoundProxy(assetId: string): SoundProxy[] {
        return this._mapSoundProxy.get(assetId) ?? [];
    }

    /**
     * 获取指定的声效.
     * @desc 返回首个指定的声效.
     * @desc 用于获取一个独占的声效.
     * @param {string} assetId
     * @return {SoundProxy | undefined}
     */
    public getSoundProxyExclusive(assetId: string): SoundProxy | undefined {
        return this._mapSoundProxy.get(assetId)?.[0];
    }

    private registerSoundProxy(assetId: string, info: SoundProxy) {
        const list = this._mapSoundProxy.get(assetId);
        if (!list) {
            this._mapSoundProxy.set(assetId, [info]);
            return;
        }

        list.push(info);
    }

    private unregisterSoundProxy(assetId: string, info: SoundProxy) {
        const list = this._mapSoundProxy.get(assetId);
        if (!list) return;

        Gtk.remove(list, info, false);
        if (list.length === 0) this._mapSoundProxy.delete(assetId);
    }

//#region Log
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄ ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

// export class EffectProxy extends AMediaProxy {
//
// }

function isClient(): boolean {
    return mw.SystemUtil.isClient();
}

function isServer(): boolean {
    return mw.SystemUtil.isServer();
}

const soundLengthMap: Map<string, number> = new Map();

export function querySoundLength(assetId: string): number | undefined {
    return soundLengthMap.get(assetId);
}

export function recordSoundLength(assetId: string, length: number) {
    if (length === 0) {
        Log4Ts.warn(recordSoundLength, `query sound length is 0, assetId: ${assetId}.`);
        return;
    }
    
    soundLengthMap.set(assetId, length);
}

// Register Event
if (isClient()) {
    mw.Event.addServerListener(MediaService.ServerPlaySoundEventName,
        (option: ISoundOption,
         location?: mw.Vector,
         parent?: mw.GameObject,
         autoDestroy: boolean = true) => {
            MediaService.getInstance().playSound(option, location, parent, autoDestroy);
        });
}