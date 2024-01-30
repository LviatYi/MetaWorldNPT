import Character = mw.Character;
import StanceBlendMode = mw.StanceBlendMode;
import ModuleService = mwext.ModuleService;
import Animation = mw.Animation;
import Stance = mw.Stance;
import Player = mw.Player;
import EffectService = mw.EffectService;
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
    ): IAnimation {
        const character = toCharacter(target);

        let anim: IAnimation;
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
     * @param viewerIds 指定观看者 playerId. 仅操作观看者. 需要操作自身时需手动添加 并设置 syncSelf 为 true.
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
     * @param viewerIds 指定观看者 playerId. 仅操作观看者. 需要操作自身时需手动添加 并设置 syncSelf 为 true.
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
     * @param viewerIds 指定观看者 playerId. 仅操作观看者. 需要操作自身时需手动添加 并设置 syncSelf 为 true.
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
     * @param viewerIds 指定观看者 playerId. 仅操作观看者. 需要操作自身时需手动添加 并设置 syncSelf 为 true.
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

        if (typeof viewerIds === "number") viewerIds = [viewerIds];
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

        if (typeof viewerIds === "number") viewerIds = [viewerIds];
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

        if (typeof viewerIds === "number") viewerIds = [viewerIds];
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

        if (typeof viewerIds === "number") viewerIds = [viewerIds];
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

//#region rpc-pojo
/**
 * I Animation of {@link mw.Animation}.
 */
export interface IAnimation {
//#region Config
    /**
     * 动画资源 Guid.
     */
    get assetId(): string;

    /**
     * 动画时长. s
     */
    get length(): number;

    /**
     * 循环次数.
     */
    get loop(): number;

    set loop(val: number);

    /**
     * 播放速率.
     */
    set speed(speed: number);

    get speed(): number;

    /**
     * 是否 正在播放.
     */
    get isPlaying(): boolean;

    /**
     * 动画播放插槽.
     */
    get slot(): mw.AnimSlot;

    set slot(slot: mw.AnimSlot);

    /**
     * 播放结束委托.
     */
    get onFinish(): mw.MulticastDelegate<() => void>;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Controller
    /**
     * 󰐊从头播放.
     */
    play(): boolean;

    /**
     * 󰏤暂停.
     */
    pause(): boolean;

    /**
     * 󰐊继续播放.
     */
    resume(): boolean;

    /**
     * 󰓛停止播放.
     */
    stop(): boolean;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

/**
 * RPC Animation.
 * @desc 对 Animation 的 RPC 封装.
 * @desc 允许通过 RPC 控制 Animation.
 * @desc 多端的.
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
export class AnimationRpc implements IAnimation {
//#region Module
    private _moduleCache: RpcAuxModuleC;

    private get module(): RpcAuxModuleC | null {
        if (SystemUtil.isServer()) {
            Log4Ts.log(AnimationRpc, `AnimationRpc module should not be used on server.`);
            return null;
        }

        if (!this._moduleCache) {
            this._moduleCache = ModuleService.getModule(RpcAuxModuleC) ?? null;
        }
        return this._moduleCache;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Config
    /**
     * 持有者.
     */
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
     * @param owner {@link mw.Character} 或 playerId.
     *      default undefined.  当客户端时自动采用本地玩家.
     *                          当服务端时必须指定.
     */
    constructor(assetId: string, owner: Character | number = undefined) {
        if (typeof owner === "number") owner = Player.getPlayer(owner)?.character;
        if (SystemUtil.isServer()) {
            if (!owner) {
                Log4Ts.error(AnimationRpc, `create ${AnimationRpc.name} failed. owner is undefined.`);
            } else {
                Log4Ts.log(AnimationRpc,
                    `create ${AnimationRpc.name} in server.`,
                    "为了保证接口一致性的设计原则 AniRpc 允许你在服务端创建它. 但若在服务器中创建原版 Animation 亦可实现 Rpc 同步.",
                );
            }
        }
        this.owner = owner;
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
    /**
     * IAnimation is AnimationRpc.
     * @param obj
     */
    public static isAnimationRpc(obj: IAnimation): obj is AnimationRpc {
        return obj instanceof AnimationRpc;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 可用性.
     */
    private valid(): boolean {
        return !!this.owner && !!this._localAnim;
    }
}


/**
 * I Stance of {@link mw.Stance}.
 */
export interface IStance {
//#region Config

    /**
     * 姿态资源 Guid.
     */
    get assetId(): string;

    /**
     * 启用瞄准偏移.
     */
    get aimOffsetEnabled(): boolean;

    set aimOffsetEnabled(value: boolean);

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Controller
    /**
     * 󰐊从头播放.
     */
    play(): boolean;

    /**
     * 󰓛停止播放.
     */
    stop(): boolean;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

/**
 * RPC Stance.
 * 对 Stance 的 RPC 封装.
 * 允许通过 RPC 控制 Stance.
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
export class StanceRpc implements IStance {
//#region Module
    private _module: RpcAuxModuleC;

    private get module(): RpcAuxModuleC | null {
        if (SystemUtil.isServer()) {
            Log4Ts.log(StanceRpc, `StanceRpc module should not be used on server.`);
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

    private readonly _localStance: Stance;

    get assetId() {
        return this._localStance.assetId;
    };

    get aimOffsetEnabled() {
        return this._localStance.aimOffsetEnabled;
    };

    set aimOffsetEnabled(val: boolean) {
        this._localStance.aimOffsetEnabled = val;
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * @param assetId
     * @param owner {@link mw.Character} 或 playerId.
     *      default undefined.  当客户端时自动采用本地玩家.
     *                          当服务端时必须指定.
     */
    constructor(assetId: string, owner: Character | number = undefined) {
        if (typeof owner === "number") owner = Player.getPlayer(owner)?.character;
        if (SystemUtil.isServer()) {
            if (!owner) {
                Log4Ts.error(StanceRpc, `create ${StanceRpc.name} failed. owner is undefined.`);
            } else {
                Log4Ts.log(StanceRpc,
                    `create ${StanceRpc.name} in server.`,
                    "为了保证接口一致性的设计原则 StcRpc 允许你在服务端创建它. 但若在服务器中创建原版 Stance 亦可实现 Rpc 同步.",
                );
            }
        }
        this.owner = owner;
        this._localStance = owner?.loadStance(assetId);
    }

//#region Controller
    public play(): boolean {
        if (!this.valid()) return false;

        if (!this._localStance?.play()) return false;

        if (SystemUtil.isServer()) return true;

        this.module?.playStance(
            this.owner.gameObjectId,
            this._localStance.assetId,
        );
        return true;
    }

    public stop(): boolean {
        if (!this.valid()) return false;

        if (!this._localStance?.stop()) return false;

        if (SystemUtil.isServer()) return true;

        this.module?.stopStance(
            this.owner.gameObjectId,
            this._localStance.assetId,
        );
        return true;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Guard
    /**
     * ISubstance is StanceRpc.
     * @param obj
     */
    public static isStanceRpc(obj: object): obj is StanceRpc {
        return obj instanceof StanceRpc;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 可用性.
     */
    private valid(): boolean {
        return !!this.owner && !!this._localStance;
    }
}

/**
 * I SubStance of {@link mw.SubStance}.
 */
export interface ISubStance {
//#region Config
    /**
     * 子姿态资源 Guid.
     */
    get assetId(): string;

    /**
     * 姿态混合模式.
     */
    get blendMode(): mw.StanceBlendMode;

    set blendMode(newBlendMode: mw.StanceBlendMode);

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Controller
    /**
     * 󰐊从头播放.
     */
    play(): boolean;

    /**
     * 󰓛停止播放.
     */
    stop(): boolean;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

/**
 * RPC SubStance.
 * 对 SubStance 的 RPC 封装.
 * 允许通过 RPC 控制 SubStance.
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
export class SubStanceRpc implements ISubStance {
//#region Module
    private _module: RpcAuxModuleC;

    private get module(): RpcAuxModuleC | null {
        if (SystemUtil.isServer()) {
            Log4Ts.log(SubStanceRpc, `SubStanceRpc module should not be used on server.`);
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

    private readonly _localStance: SubStance;

    get assetId() {
        return this._localStance.assetId;
    };

    get blendMode() {
        return this._localStance.blendMode;
    };

    set blendMode(val: StanceBlendMode) {
        this._localStance.blendMode = val;
    };

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * @param assetId
     * @param owner {@link mw.Character} 或 playerId.
     *      default undefined.  当客户端时自动采用本地玩家.
     *                          当服务端时必须指定.
     */
    constructor(assetId: string, owner: Character | number = undefined) {
        if (typeof owner === "number") owner = Player.getPlayer(owner)?.character;
        if (SystemUtil.isServer()) {
            if (!owner) {
                Log4Ts.error(SubStanceRpc, `create ${SubStanceRpc.name} failed. owner is undefined.`);
            } else {
                Log4Ts.log(SubStanceRpc,
                    `create ${SubStanceRpc.name} in server.`,
                    "为了保证接口一致性的设计原则 SubStcRpc 允许你在服务端创建它. 但若在服务器中创建原版 SubStance 亦可实现 Rpc 同步.",
                );
            }
        }
        this.owner = owner;
        this._localStance = owner?.loadSubStance(assetId);
    }

//#region Controller
    public play(): boolean {
        if (!this.valid()) return false;

        if (!this._localStance?.play()) return false;

        if (SystemUtil.isServer()) return true;

        this.module?.playSubStance(
            this.owner.gameObjectId,
            this._localStance.assetId,
            this._localStance.blendMode,
        );
        return true;
    }

    public stop(): boolean {
        if (!this.valid()) return false;

        if (!this._localStance?.stop()) return false;

        if (SystemUtil.isServer()) return true;

        this.module?.stopStance(
            this.owner.gameObjectId,
            this._localStance.assetId,
        );
        return true;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Guard
    /**
     * ISubStance is SubStanceRpc.
     * @param obj
     */
    public static isSubStanceRpc(obj: object): obj is SubStanceRpc {
        return obj instanceof SubStanceRpc;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * 可用性.
     */
    private valid(): boolean {
        return !!this.owner &&
            !!this._localStance;
    }
}

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄