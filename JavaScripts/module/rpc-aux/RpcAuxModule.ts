import Character = mw.Character;
import StanceBlendMode = mw.StanceBlendMode;
import ModuleService = mwext.ModuleService;
import Animation = mw.Animation;
import Stance = mw.Stance;
import Player = mw.Player;
import EffectService = mw.EffectService;
import AnimationRpc from "./AnimationRpc";
import StanceRpc from "./StanceRpc";
import SubStanceRpc from "./SubStanceRpc";
import Log4Ts from "../../depend/log4ts/Log4Ts";

/**
 * 初始化模块.
 */
export function initRpcAuxModule() {
    ModuleService.registerModule(RpcAuxModuleS, RpcAuxModuleC, RpcAuxModuleData);
}

export default class RpcAuxModuleData extends Subdata {
    //@Decorator.saveProperty
    //public isSave: bool;
}

/**
 * rpc-aux Module.
 * RPC 辅助模块.
 * 帮助同步 动画与姿态状态.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.1.4b
 */
export class RpcAuxModuleC extends ModuleC<RpcAuxModuleS, RpcAuxModuleData> {
//#region Props
    private _syncSelfAssetId: string = null;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Method

//#region ├ Animation
    /**
     * 加载一个封装动画配置的 动画控制器.
     * @remarks 动画控制器 可能是一个 {@link Animation} 或 {@link AnimationRpc}. 取决于其是否需要同步 {@link sync}.
     * @remarks ---
     * @remarks "If it looks like a duck, swims like a duck, and quacks like a duck, then it probably is a duck."
     * @param target 挂载对象. 允许传入 {@link Character} {@link Player} 或 {@link GameObject} 的 gameObjectId.
     * @param assetId 资源 id.
     * @param speed 动画播放速度.
     * @param loop 动画循环次数.
     * @param slot 动画挂载点.
     * @param sync 是否 需要同步.
     */
    public loadAnimation(target: string | Character | Player,
                         assetId: string,
                         speed: number,
                         loop: number,
                         slot: AnimSlot,
                         sync: boolean = true,
    ): Animation | AnimationRpc {
        const character = toCharacter(target);

        let anim: Animation | AnimationRpc;
        if (sync && SystemUtil.isClient()) {
            anim = new AnimationRpc(
                assetId,
                character,
            );
        } else {
            anim = character?.loadAnimation(assetId);
        }
        if (!anim) return null;

        if (speed !== undefined) anim.speed = speed;
        if (loop !== undefined) anim.loop = loop;
        if (slot !== undefined) anim.slot = slot;

        return anim;
    }

    /**
     * 在指定观看者的客户端上 󰐊播放 挂载在对象上的动画.
     * @param target 挂载对象. 允许传入 {@link Character} {@link Player} 或 {@link GameObject} 的 gameObjectId.
     * @param assetId 资源 id.
     * @param speed 动画播放速度.
     * @param loop 动画循环次数.
     * @param slot 动画挂载点.
     * @param viewerIds 指定观看者 playerId.
     *      - default 0: 为所有人.
     * @param syncSelf 是否 󰓦同步自身.
     *      - true: 同步自身. 当 charGuid 为自身 character 的 gameObjectId 时 其动画行为将会被 Server 控制.
     *      - default false.
     */
    public playAnimation(target: string | Character | Player,
                         assetId: string,
                         speed: number,
                         loop: number,
                         slot: AnimSlot,
                         viewerIds: number | number[] = 0,
                         syncSelf: boolean = false) {
        const guid = toCharGuid(target);

        if (guid === this.localPlayer.character.gameObjectId) {
            this._syncSelfAssetId = assetId;
        }
        this.server.net_playAnimation(guid,
            assetId,
            speed,
            loop,
            slot,
            viewerIds,
            syncSelf);
    }

    /**
     * 在指定观看者的客户端上 󰏤暂停 挂载在对象上的动画.
     * @param target 挂载对象. 允许传入 {@link Character} {@link Player} 或 {@link GameObject} 的 gameObjectId.
     * @param assetId 资源 id.
     *      - default undefined: 暂停所有.
     * @param viewerIds 指定观看者 playerId.
     *      - default 0: 为所有人.
     * @param syncSelf 是否 󰓦同步自身.
     *      - true: 同步自身. 当 charGuid 为自身 character 的 gameObjectId 时 其动画行为将会被 Server 控制.
     *      - default false.
     */
    public pauseAnimation(target: string | Character | Player,
                          assetId: string = undefined,
                          viewerIds: number | number[] = 0,
                          syncSelf: boolean = false) {
        this.server.net_pauseAnimation(
            toCharGuid(target),
            assetId,
            viewerIds,
            syncSelf,
        );
    }

    /**
     * 在指定观看者的客户端上 󰐊继续 挂载在对象上的动画.
     * @param target 挂载对象. 允许传入 {@link Character} {@link Player} 或 {@link GameObject} 的 gameObjectId.
     * @param assetId 资源 id.
     *      - default undefined: 暂停所有.
     * @param viewerIds 指定观看者 playerId.
     *      - default 0: 为所有人.
     * @param syncSelf 是否 󰓦同步自身.
     *      - true: 同步自身. 当 charGuid 为自身 character 的 gameObjectId 时 其动画行为将会被 Server 控制.
     *      - default false.
     */
    public resumeAnimation(target: string | Character | Player,
                           assetId: string = undefined,
                           viewerIds: number | number[] = 0,
                           syncSelf: boolean = false) {
        this.server.net_resumeAnimation(
            toCharGuid(target),
            assetId,
            viewerIds,
            syncSelf,
        );
    }

    /**
     * 在指定观看者的客户端上 󰓛停止 挂载在对象上的动画.
     * @param target 挂载对象. 允许传入 {@link Character} {@link Player} 或 {@link GameObject} 的 gameObjectId.
     * @param assetId 资源 id.
     *      - default undefined: 暂停所有.
     * @param viewerIds 指定观看者 playerId.
     *      - default 0: 为所有人.
     * @param syncSelf 是否 󰓦同步自身.
     *      - true: 同步自身. 当 charGuid 为自身 character 的 gameObjectId 时 其动画行为将会被 Server 控制.
     *      - default false.
     */
    public stopAnimation(target: string | Character | Player,
                         assetId: string = undefined,
                         viewerIds: number | number[] = 0,
                         syncSelf: boolean = false) {
        this.server.net_stopAnimation(
            toCharGuid(target),
            assetId,
            viewerIds,
            syncSelf,
        );
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region ├ Stance
    /**
     * 加载一个封装姿态配置的 姿态控制器.
     * @remarks 姿态控制器 可能是一个 {@link Stance} 或 {@link StanceRpc}. 取决于其是否需要同步 {@link sync}.
     * @remarks ---
     * @remarks "If it looks like a duck, swims like a duck, and quacks like a duck, then it probably is a duck."
     * @param target 挂载对象. 允许传入 {@link Character} {@link Player} 或 {@link GameObject} 的 gameObjectId.
     * @param assetId 资源 id.
     * @param aimOffsetEnabled 是否 启用瞄准偏移.
     * @param sync 是否 需要同步.
     */
    public loadStance(target: string | Character | Player,
                      assetId: string = undefined,
                      aimOffsetEnabled: boolean,
                      sync: boolean = true,
    ): Stance | StanceRpc {
        const character = toCharacter(target);

        let stance: Stance | StanceRpc;
        if (sync && SystemUtil.isClient()) {
            stance = new StanceRpc(
                assetId,
                character,
            );
        } else {
            stance = character?.loadStance(assetId);
        }
        if (!stance) return null;

        if (aimOffsetEnabled !== undefined) stance.aimOffsetEnabled = aimOffsetEnabled;

        return stance;
    }

    /**
     * 加载一个封装子姿态配置的 子姿态控制器.
     * @remarks 子姿态控制器 可能是一个 {@link SubStance} 或 {@link SubStanceRpc}. 取决于其是否需要同步 {@link sync}.
     * @remarks ---
     * @remarks "If it looks like a duck, swims like a duck, and quacks like a duck, then it probably is a duck."
     * @param target 挂载对象. 允许传入 {@link Character} {@link Player} 或 {@link GameObject} 的 gameObjectId.
     * @param assetId 资源 id.
     * @param blendMode 混合模式.
     * @param sync 是否 需要同步.
     */
    public loadSubStance(target: string | Character | Player,
                         assetId: string,
                         blendMode: StanceBlendMode,
                         sync: boolean = true,
    ): SubStance | SubStanceRpc {
        const character = toCharacter(target);

        let stance: SubStance | SubStanceRpc;
        if (sync && SystemUtil.isClient()) {
            stance = new SubStanceRpc(
                assetId,
                character,
            );
        } else {
            stance = character?.loadSubStance(assetId);
        }
        if (!stance) return null;

        if (blendMode !== undefined) stance.blendMode = blendMode;

        return stance;
    }

    /**
     * 在所有客户端 󰐊播放 基础姿态.
     * @param target 挂载对象. 允许传入 {@link Character} {@link Player} 或 {@link GameObject} 的 gameObjectId.
     * @param assetId 资源 id.
     */
    public playStance(target: string | Character | Player,
                      assetId: string) {
        this.server.net_playStance(
            toCharGuid(target),
            assetId);
    }

    /**
     * 在所有客户端 󰐊播放 子姿态.
     * @param target 挂载对象. 允许传入 {@link Character} {@link Player} 或 {@link GameObject} 的 gameObjectId.
     * @param assetId 资源 id.
     * @param blendMode 姿态混合模式.
     */
    public playSubStance(target: string | Character | Player,
                         assetId: string,
                         blendMode: StanceBlendMode) {
        this.server.net_playStance(
            toCharGuid(target),
            assetId,
            blendMode);
    }

    /**
     *
     * 在所有客户端 󰓛停止 姿态.
     * @param target 挂载对象. 允许传入 {@link Character} {@link Player} 或 {@link GameObject} 的 gameObjectId.
     * @param assetId 资源 id.
     *      - default undefined: 暂停所有.
     */
    public stopStance(target: string | Character | Player,
                      assetId: string = undefined) {
        this.server.net_stopStance(
            toCharGuid(target),
            assetId);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region └ Effect
    /**
     * 在玩家插槽位置播放 Effect.
     * @param assetId
     * @param target
     * @param slotType
     * @param loopCount
     * @param offset
     * @param rotation
     * @param scale
     */
    public playEffectOnPlayer(
        assetId: string,
        target: Player | Character,
        slotType?: HumanoidSlotType,
        loopCount?: number,
        offset?: Vector,
        rotation?: Rotation,
        scale?: Vector,
    ): Promise<number> {
        return this.server.net_playEffect(
            assetId,
            target,
            slotType,
            loopCount,
            offset,
            rotation,
            scale,
        );
    }

    /**
     * 跟随 GameObject 或指定位置播放 Effect.
     * @param assetId
     * @param target
     * @param loopCount
     * @param offset
     * @param rotation
     * @param scale
     */
    public playEffect(
        assetId: string,
        target: GameObject | Vector,
        loopCount?: number,
        offset?: Vector,
        rotation?: Rotation,
        scale?: Vector,
    ): Promise<number> {
        return this.server.net_playEffect(
            assetId,
            target,
            undefined,
            loopCount,
            offset,
            rotation,
            scale,
        );
    }

    /**
     * 停止 Effect.
     * @param effectId
     */
    public stopEffect(effectId: number) {
        this.server.net_stopEffect(effectId);
    }

    /**
     * 停止挂载在 target 上的指定 Effect.
     * @param assetId
     * @param target
     */
    public stopEffectByHost(
        assetId: string,
        target: Player | Character | GameObject) {
        let id: number | string;
        if (target instanceof Player) {
            id = target.playerId;
        } else if (target instanceof Character) {
            id = target.player?.playerId ?? 0;
        } else {
            id = target.gameObjectId;
        }

        this.server.net_stopEffectByHost(assetId, id);

    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Net Method
    public net_playerJoin(newPlayerId: number) {
        if (this.localPlayerId === newPlayerId) return;
        const character = this.localPlayer.character;
        if (!character) return;

        this.handleSelfAnimationSyncToNewPlayer(character, newPlayerId);
    }

    public net_playAnimation(charGuid: string,
                             assetId: string,
                             speed: number,
                             loop: number,
                             slot: AnimSlot,
                             syncMe: boolean = false) {
        if (charGuid === this.localPlayer.character.gameObjectId && !syncMe) return;

        this.handlePlayAnimation(
            charGuid,
            assetId,
            speed,
            loop,
            slot,
        );
    }

    public net_pauseAnimation(charGuid: string,
                              assetId: string = undefined,
                              syncMe: boolean = false) {
        if (charGuid === this.localPlayer.character.gameObjectId && !syncMe) return;

        this.handlePauseAnimation(
            charGuid,
            assetId);
    }

    public net_resumeAnimation(charGuid: string,
                               assetId: string = undefined,
                               syncMe: boolean = false) {
        if (charGuid === this.localPlayer.character.gameObjectId && !syncMe) return;

        this.handleResumeAnimation(
            charGuid,
            assetId);
    }

    public net_stopAnimation(charGuid: string,
                             assetId: string = undefined,
                             syncMe: boolean = false) {
        if (charGuid === this.localPlayer.character.gameObjectId && !syncMe) return;

        this.handleStopAnimation(
            charGuid,
            assetId);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Handler
    private handlePlayAnimation(charGuid: string,
                                assetId: string,
                                speed: number,
                                loop: number,
                                slot: AnimSlot): boolean {
        const character = Character.findGameObjectById(charGuid) as Character;
        if (!character) return false;

        const anim = character.loadAnimation(assetId);
        if (!anim) return false;

        if (speed !== undefined) anim.speed = speed;
        if (loop !== undefined) anim.loop = loop;
        if (slot !== undefined) anim.slot = slot;
        return anim.play();
    }

    private handlePauseAnimation(charGuid: string,
                                 assetId: string = undefined): boolean {
        let character = Character.findGameObjectById(charGuid) as Character;
        if (!character) return false;

        let anim = character.currentAnimation;
        if (!anim || (assetId === undefined && anim.assetId !== assetId)) return false;

        return anim.pause();
    }

    private handleResumeAnimation(charGuid: string,
                                  assetId: string = undefined): boolean {
        let character = Character.findGameObjectById(charGuid) as Character;
        if (!character) return false;

        let anim = character.currentAnimation;
        if (!anim || (assetId === undefined && anim.assetId !== assetId)) return false;

        return anim.resume();
    }

    private handleStopAnimation(charGuid: string,
                                assetId: string = undefined): boolean {
        let character = Character.findGameObjectById(charGuid) as Character;
        if (!character) return false;

        let anim = character.currentAnimation;
        if (!anim || (assetId === undefined && anim.assetId !== assetId)) return false;

        return anim.stop();
    }

    /**
     * 将自身动画同步给新加入的玩家.
     * @param selfCharacter 自身角色.
     * @param newPlayerId 新玩家 playerId.
     * @private
     */
    private handleSelfAnimationSyncToNewPlayer(selfCharacter: Character, newPlayerId: number) {
        const currentAnimation = selfCharacter.currentAnimation;
        if (!currentAnimation || currentAnimation.assetId !== this._syncSelfAssetId || !currentAnimation.isPlaying) return;

        this.server.net_playAnimation(
            selfCharacter.gameObjectId,
            currentAnimation.assetId,
            currentAnimation.speed,
            currentAnimation.loop,
            currentAnimation.slot,
            newPlayerId,
            false,
        );
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

export class RpcAuxModuleS extends ModuleS<RpcAuxModuleC, RpcAuxModuleData> {
//#region MW Event
    protected onPlayerEnterGame(player: Player): void {
        this.getAllClient().net_playerJoin(player.playerId);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Net Method

    public net_playAnimation(charGuid: string,
                             assetId: string,
                             speed: number,
                             loop: number,
                             slot: AnimSlot,
                             viewerIds: number | number[] = 0,
                             syncSelf: boolean = false) {
        if (viewerIds === 0) {
            this.getAllClient().net_playAnimation(charGuid,
                assetId,
                speed,
                loop,
                slot,
                syncSelf);
            return;
        }

        viewerIds = Array.isArray(viewerIds) ? [...viewerIds] : [viewerIds];
        for (const viewId of viewerIds) {
            this.getClient(viewId).net_playAnimation(
                charGuid,
                assetId,
                speed,
                loop,
                slot,
                syncSelf);
        }
    }

    public net_pauseAnimation(charGuid: string,
                              assetId: string = undefined,
                              viewerIds: number | number[] = 0,
                              syncSelf: boolean = false) {
        if (viewerIds === 0) {
            this.getAllClient().net_pauseAnimation(
                charGuid,
                assetId,
                syncSelf);
            return;
        }

        viewerIds = Array.isArray(viewerIds) ? [...viewerIds] : [viewerIds];
        for (const viewId of viewerIds) {
            this.getClient(viewId).net_pauseAnimation(
                charGuid,
                assetId,
                syncSelf);
        }
    }

    public net_resumeAnimation(charGuid: string,
                               assetId: string = undefined,
                               viewerIds: number | number[] = 0,
                               syncSelf: boolean = false) {
        if (viewerIds === 0) {
            this.getAllClient().net_resumeAnimation(
                charGuid,
                assetId,
                syncSelf,
            );
            return;
        }

        viewerIds = Array.isArray(viewerIds) ? [...viewerIds] : [viewerIds];
        for (const viewId of viewerIds) {
            this.getClient(viewId).net_resumeAnimation(
                charGuid,
                assetId,
                syncSelf);
        }
    }

    public net_stopAnimation(charGuid: string,
                             assetId: string = undefined,
                             viewerIds: number | number[] = 0,
                             syncSelf: boolean = false) {
        if (viewerIds === 0) {
            this.getAllClient().net_stopAnimation(
                charGuid,
                assetId,
                syncSelf,
            );
            return;
        }

        viewerIds = Array.isArray(viewerIds) ? [...viewerIds] : [viewerIds];
        for (const viewId of viewerIds) {
            this.getClient(viewId).net_stopAnimation(
                charGuid,
                assetId,
                syncSelf);
        }
    }

    public net_playStance(charGuid: string,
                          assetId: string,
                          blendMode: StanceBlendMode = undefined) {
        this.handlePlayStance(charGuid,
            assetId,
            blendMode);
    }

    public net_stopStance(charGuid: string,
                          assetId: string = undefined) {
        this.handleStopStance(charGuid,
            assetId);
    }

    public net_playEffect(
        assetId: string,
        target: Player | Character | GameObject | Vector,
        slotType?: HumanoidSlotType,
        loopCount?: number,
        offset?: Vector,
        rotation?: Rotation,
        scale?: Vector,
    ): Promise<number> {
        return Promise.resolve(this.handlePlayEffect(
            assetId,
            target,
            slotType,
            loopCount,
            offset,
            rotation,
            scale,
        ));
    }

    public net_stopEffect(effectId: number) {
        this.handleStopEffect(effectId);
    }

    public net_stopEffectByHost(assetId: string, id: string | number) {
        this.handleStopEffectByHost(assetId, id);
    }


//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Handler

    private handlePlayStance(charGuid: string,
                             assetId: string,
                             blendMode: StanceBlendMode = undefined) {
        let character = GameObject.findGameObjectById(charGuid) as Character;
        if (!character) return false;

        let stance = character.loadSubStance(assetId);
        if (!stance) return false;

        if (blendMode !== undefined && blendMode !== null) stance.blendMode = blendMode;

        return stance.play();
    }

    private handleStopStance(charGuid: string,
                             assetId: string = undefined) {
        let character = GameObject.findGameObjectById(charGuid) as Character;
        if (!character) return false;

        let currentStance = character.currentSubStance;
        return currentStance && (currentStance.assetId === assetId || assetId === undefined) ?
            currentStance.stop() :
            false;
    }

    private handlePlayEffect(
        assetId: string,
        target: Player | Character | GameObject | Vector,
        slotType?: HumanoidSlotType,
        loopCount?: number,
        offset?: Vector,
        rotation?: Rotation,
        scale?: Vector,
    ): number {
        let duration = undefined;
        if (loopCount < 0) {
            duration = -loopCount;
            loopCount = undefined;
        }

        if (target instanceof Vector) {
            return EffectService.playAtPosition(
                assetId,
                target,
                {
                    loopCount: loopCount,
                    duration: duration,
                    rotation: rotation,
                    scale: scale,
                });
        } else if (target instanceof Player || target instanceof Character) {
            target = (target as Player)?.character;
            return EffectService.playOnGameObject(
                assetId,
                target,
                {
                    slotType: slotType,
                    loopCount: loopCount,
                    duration: duration,
                    position: offset,
                    rotation: rotation,
                    scale: scale,
                });
        } else {
            return EffectService.playOnGameObject(
                assetId,
                target,
                {
                    loopCount: loopCount,
                    duration: duration,
                    position: offset,
                    rotation: rotation,
                    scale: scale,
                });
        }
    }

    private handleStopEffect(effectId: number) {
        EffectService.stop(effectId);
    }

    private handleStopEffectByHost(assetId: string, id: string | number) {
        if (typeof id === "number") {
            EffectService.stopEffectFromHost(assetId, Player.getPlayer(id));
        } else {
            EffectService.stopEffectFromHost(assetId, GameObject.findGameObjectById(id));
        }
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

function toCharacter(target: string | Character | Player): Character {
    let character: Character;

    if (target instanceof Character) {
        character = target;
    } else if (target instanceof Player) {
        character = target.character;
    } else {
        character = Character.findGameObjectById(target) as Character;
    }

    return character;
}

function toCharGuid(target: string | Character | Player): string {
    let guid: string;

    if (target instanceof Character) {
        guid = target.gameObjectId;
    } else if (target instanceof Player) {
        guid = target.character.gameObjectId;
    } else {
        guid = target;
    }
    return guid;
}

try {
    Log4Ts.log({name: "RpcAuxModule"}, `auto init RpcAuxModule`);
    initRpcAuxModule();
} catch (e) {
    Log4Ts.error({name: "RpcAuxModule"}, e);
}