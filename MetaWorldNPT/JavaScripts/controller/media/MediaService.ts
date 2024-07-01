import Gtk, { Singleton } from "gtoolkit";
import { ISoundOption } from "./sound/ISoundOption";
import { SoundProxy } from "./sound/SoundProxy";
import Log4Ts from "mw-log4ts/Log4Ts";
import { MediaState } from "./base/MediaState";
import { IEffectOption } from "./effect/IEffectOption";
import { EffectProxy } from "./effect/EffectProxy";

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

    /**
     * Server 要求播放 Effect 事件 事件名.
     */
    public static readonly ServerPlayEffectEventName
        = "__SERVER_PLAY_EFFECT_EVENT_NAME__";

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄ ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Fields
    private _debug: boolean = true;

    private _mapSoundProxy: Map<string, SoundProxy[]> = new Map();

    private _mapEffectProxy: Map<string, EffectProxy[]> = new Map();

    private _hostToEffect: Map<mw.GameObject, EffectProxy[]> = new Map();

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

//#region Sound Controller
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
                const index = list.findIndex(item => item.state === MediaState.Destroy);
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
            autoDestroy);

        sound.setPosition(position);
        sound.setParent(parent);

        this.registerSoundProxy(option.assetId, sound);
        sound.onDestroy.add(() => this.unregisterSoundProxy(option.assetId, sound));

        return sound;
    }

    /**
     * 获取所有指定的声效.
     * @desc 仅客户端.
     * @param {string} assetId
     * @return {SoundProxy[]}
     */
    public getSoundProxy(assetId: string): SoundProxy[] {
        return this._mapSoundProxy.get(assetId) ?? [];
    }

    /**
     * 获取指定的声效.
     * @desc 仅客户端.
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

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Media Controller
    /**
     * 播放一个粒子特效.
     * @desc 客户端将返回一个 EffectProxy 用于更精细的操作.
     * @desc 服务端将返回 undefined 仅作为一个简单播放接口.
     * @param {IEffectOption} option
     * @param {mw.Vector | mw.GameObject | undefined} positionOrParent
     * @param {boolean} autoDestroy 是否 自动销毁.
     *    undefined 时采用默认策略.
     *    - 当独占时, false.
     *    - 当非独占时, true.
     * @return {EffectProxy | undefined}
     */
    public playEffect(option: IEffectOption,
                      positionOrParent?: mw.Vector | mw.GameObject,
                      autoDestroy: boolean = true): EffectProxy | undefined {
        if (isClient()) {
            return this.loadEffectHandler(option,
                positionOrParent,
                autoDestroy).play();
        } else if (isServer()) {
            mw.Event.dispatchToAllClient(MediaService.ServerPlayEffectEventName,
                option,
                positionOrParent,
                autoDestroy);
            return undefined;
        }
    }

    /**
     * 加载一个粒子特效.
     * @desc 仅客户端.
     * @param {ISoundOption} option
     * @param {mw.Vector | mw.GameObject | undefined} positionOrParent
     * @param {boolean} autoDestroy
     * @return {SoundProxy} SoundProxy
     * @private
     */
    private loadEffectHandler(option: IEffectOption,
                              positionOrParent: mw.Vector | mw.GameObject | undefined,
                              autoDestroy: boolean): EffectProxy {
        let effect: EffectProxy = new EffectProxy(option, autoDestroy);

        if (positionOrParent instanceof mw.Vector) effect.setPosition(positionOrParent);
        else if (positionOrParent instanceof mw.GameObject) effect.setParent(positionOrParent);

        this.registerEffectProxy(option.assetId, effect);
        effect.onDestroy.add(() => this.unregisterEffectProxy(option.assetId, effect));

        return effect;
    }

    /**
     * 获取所有指定的粒子特效.
     * @desc 仅客户端.
     * @param {string} assetId
     * @return {EffectProxy[]}
     */
    public getEffectProxy(assetId: string): EffectProxy[] {
        return this._mapEffectProxy.get(assetId) ?? [];
    }

    /**
     * 获取指定 Host 下所有粒子特效.
     * @desc 仅客户端.
     * @param {mw.GameObject} go
     * @return {EffectProxy[]}
     */
    public getEffectByHost(go: mw.GameObject): EffectProxy[] {
        return this._hostToEffect.get(go) ?? [];
    }

    /**
     * 获取指定的粒子特效.
     * @desc 仅客户端.
     * @desc 返回首个指定的声效.
     * @desc 用于获取一个独占的声效.
     * @param {string} assetId
     * @return {EffectProxy | undefined}
     */
    public getEffectProxyExclusive(assetId: string): EffectProxy | undefined {
        return this._mapEffectProxy.get(assetId)?.[0];
    }

    private registerEffectProxy(assetId: string, info: EffectProxy, host?: mw.GameObject) {
        let list = Gtk.tryGet(this._mapEffectProxy, assetId, []);
        list.push(info);

        if (host) {
            list = Gtk.tryGet(this._hostToEffect, host, []);
            list.push(info);
        }
    }

    private unregisterEffectProxy(assetId: string, info: EffectProxy, host?: mw.GameObject) {
        let list = this._mapEffectProxy.get(assetId);

        list && Gtk.remove(list, info, false);
        if (list && list.length === 0) this._mapEffectProxy.delete(assetId);

        if (host) {
            list = this._hostToEffect.get(host);
            list && Gtk.remove(list, info, false);
            if (list && list.length === 0) this._hostToEffect.delete(host);
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Log
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄ ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

function isClient(): boolean {
    return mw.SystemUtil.isClient();
}

function isServer(): boolean {
    return mw.SystemUtil.isServer();
}

const soundLengthMap: Map<string, number> = new Map();

const effectLengthMap: Map<string, number> = new Map();

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

export function queryEffectLength(assetId: string): number {
    return effectLengthMap.get(assetId) ?? 0.5e3;
}

export function recordEffectLength(assetId: string, length: number) {
    if (length === 0) {
        Log4Ts.warn(recordSoundLength, `query effect length is 0, assetId: ${assetId}.`);
        return;
    }

    effectLengthMap.set(assetId, length);
}

// Register Event
if (isClient()) {
    mw.Event.addServerListener(MediaService.ServerPlaySoundEventName,
        (option: ISoundOption,
         position?: mw.Vector,
         parent?: mw.GameObject,
         autoDestroy: boolean = true) => {
            MediaService.getInstance().playSound(option,
                position,
                parent,
                autoDestroy);
        });
    mw.Event.addServerListener(MediaService.ServerPlayEffectEventName,
        (option: IEffectOption,
         positionOrParent: mw.Vector | mw.GameObject,
         autoDestroy: boolean = true) => {
            MediaService.getInstance().playEffect(option,
                positionOrParent,
                autoDestroy);
        });
}