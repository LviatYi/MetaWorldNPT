import Animation = mw.Animation;
import ModuleService = mwext.ModuleService;
import { RpcAuxModuleC } from "./RpcAuxModule";
import Log4Ts from "../../depends/log4ts/Log4Ts";

/**
 * RPC Animation.
 * 对 Animation 的 RPC 封装.
 * 允许通过 RPC 控制 Animation.
 * 多端的.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export default class AnimationRpc {
//#region Module
    private _module: RpcAuxModuleC;

    private get module(): RpcAuxModuleC | null {
        if (SystemUtil.isServer()) {
            Log4Ts.log(AnimationRpc, `AnimationRpc module should not be used on server.`);
            return null;
        }

        if (!this._module) {
            this._module = ModuleService.getModule(RpcAuxModuleC);
        }
        return this._module;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config
    public readonly owner: Character;

    private readonly _localAnim: Animation;

    get assetId() {
        return this._localAnim.assetId;
    };

    get length() {
        return this._localAnim.length;
    };

    get loop() {
        return this._localAnim.loop;
    };

    set loop(val: number) {
        this._localAnim.loop = val;
    };

    set speed(speed: number) {
        this._localAnim.speed = speed;
    }

    get speed() {
        return this._localAnim.speed;
    };

    get isPlaying() {
        return this._localAnim.isPlaying;
    };

    get slot() {
        return this._localAnim.slot;
    };

    set slot(slot: mw.AnimSlot) {
        this._localAnim.slot = slot;
    }

    get onFinish() {
        return this._localAnim.onFinish;
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * @param assetId
     * @param owner
     *      default undefined. 当客户端时自动采用本地玩家.
     */
    constructor(assetId: string, owner: Character = undefined) {
        this.owner = owner ?? SystemUtil.isClient() ? Player.localPlayer.character : undefined;
        this._localAnim = owner?.loadAnimation(assetId);
    }

//#region Controller
    public play(): boolean {
        if (!this.valid()) return false;

        if (!this._localAnim?.play()) return false;

        if (SystemUtil.isServer()) return true;

        this.module?.playAnimation(
            this.owner.gameObjectId,
            this._localAnim.assetId,
            this._localAnim.speed,
            this._localAnim.loop,
            this._localAnim.slot,
            0,
            false,
        );
        return true;
    }

    public pause(): boolean {
        if (!this.valid()) return false;

        if (!this._localAnim?.pause()) return false;

        if (SystemUtil.isServer()) return true;

        this.module?.pauseAnimation(
            this.owner.gameObjectId,
            this._localAnim.assetId,
            0,
            false,
        );
        return true;
    }

    public resume(): boolean {
        if (!this.valid()) return false;

        if (!this._localAnim?.resume()) return false;

        if (SystemUtil.isServer()) return true;

        this.module?.resumeAnimation(
            this.owner.gameObjectId,
            this._localAnim.assetId,
            0,
            false,
        );
        return true;
    }

    public stop(): boolean {
        if (!this.valid()) return false;

        if (!this._localAnim?.stop()) return false;

        if (SystemUtil.isServer()) return true;

        this.module?.stopAnimation(
            this.owner.gameObjectId,
            this._localAnim.assetId,
            0,
            false,
        );
        return true;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Guard
    public static isAnimationRpc(obj: object): obj is AnimationRpc {
        return obj instanceof AnimationRpc;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 可用性.
     */
    private valid(): boolean {
        return !!this.owner &&
            !!this._localAnim;
    }
}