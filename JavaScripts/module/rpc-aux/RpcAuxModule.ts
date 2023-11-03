import Character = mw.Character;
import StanceBlendMode = mw.StanceBlendMode;
import ModuleService = mwext.ModuleService;

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
 * @version 1.0.0b
 */
export class RpcAuxModuleC extends ModuleC<RpcAuxModuleS, RpcAuxModuleData> {
//#region Props
    private _syncSelfAssetId: string = null;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Method
    /**
     * 在指定观看者的客户端上 󰐊播放 挂载在对象上的动画.
     * @param charGuid 挂载对象.
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
    public playAnimation(charGuid: string,
                         assetId: string,
                         speed: number,
                         loop: number,
                         slot: mw.AnimSlot,
                         viewerIds: number | number[] = 0,
                         syncSelf: boolean = false) {
        if (charGuid === this.localPlayer.character.gameObjectId) {
            this._syncSelfAssetId = assetId;
        }
        this.server.net_playAnimation(charGuid,
            assetId,
            speed,
            loop,
            slot,
            viewerIds,
            syncSelf);
    }

    /**
     * 在指定观看者的客户端上 󰏤暂停 挂载在对象上的动画.
     * @param charGuid 挂载对象.
     * @param assetId 资源 id.
     *      - default undefined: 暂停所有.
     * @param viewerIds 指定观看者 playerId.
     *      - default 0: 为所有人.
     * @param syncSelf 是否 󰓦同步自身.
     *      - true: 同步自身. 当 charGuid 为自身 character 的 gameObjectId 时 其动画行为将会被 Server 控制.
     *      - default false.
     */
    public pauseAnimation(charGuid: string,
                          assetId: string = undefined,
                          viewerIds: number | number[] = 0,
                          syncSelf: boolean = false) {
        this.server.net_pauseAnimation(
            charGuid,
            assetId,
            viewerIds,
            syncSelf,
        );
    }

    /**
     * 在指定观看者的客户端上 󰐊继续 挂载在对象上的动画.
     * @param charGuid 挂载对象.
     * @param assetId 资源 id.
     *      - default undefined: 暂停所有.
     * @param viewerIds 指定观看者 playerId.
     *      - default 0: 为所有人.
     * @param syncSelf 是否 󰓦同步自身.
     *      - true: 同步自身. 当 charGuid 为自身 character 的 gameObjectId 时 其动画行为将会被 Server 控制.
     *      - default false.
     */
    public resumeAnimation(charGuid: string,
                           assetId: string = undefined,
                           viewerIds: number | number[] = 0,
                           syncSelf: boolean = false) {
        this.server.net_resumeAnimation(
            charGuid,
            assetId,
            viewerIds,
            syncSelf,
        );
    }

    /**
     * 在指定观看者的客户端上 󰓛停止 挂载在对象上的动画.
     * @param charGuid 挂载对象.
     * @param assetId 资源 id.
     *      - default undefined: 暂停所有.
     * @param viewerIds 指定观看者 playerId.
     *      - default 0: 为所有人.
     * @param syncSelf 是否 󰓦同步自身.
     *      - true: 同步自身. 当 charGuid 为自身 character 的 gameObjectId 时 其动画行为将会被 Server 控制.
     *      - default false.
     */
    public stopAnimation(charGuid: string,
                         assetId: string = undefined,
                         viewerIds: number | number[] = 0,
                         syncSelf: boolean = false) {
        this.server.net_stopAnimation(
            charGuid,
            assetId,
            viewerIds,
            syncSelf,
        );
    }

    /**
     * 在所有客户端 󰐊播放 基础姿态.
     * @param charGuid 挂载对象.
     * @param assetId 资源 id.
     */
    public playBasicStance(charGuid: string,
                           assetId: string) {
        this.server.net_playStance(charGuid,
            assetId);
    }

    /**
     * 在所有客户端 󰐊播放 姿态.
     * @param charGuid 挂载对象.
     * @param assetId 资源 id.
     * @param blendMode 姿态混合模式.
     */
    public playStance(charGuid: string,
                      assetId: string,
                      blendMode: StanceBlendMode) {
        this.server.net_playStance(charGuid,
            assetId,
            blendMode);
    }

    /**
     *
     * 在所有客户端 󰓛停止 姿态.
     * @param charGuid 挂载对象.
     * @param assetId 资源 id.
     *      - default undefined: 暂停所有.
     */
    public stopStance(charGuid: string,
                      assetId: string = undefined) {
        this.server.net_stopStance(charGuid,
            assetId);
    }

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
                             slot: mw.AnimSlot,
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
                                slot: mw.AnimSlot): boolean {
        const character = Character.findGameObjectById(charGuid) as Character;
        if (!character) return false;

        const anim = character.loadAnimation(assetId);
        if (!anim) return false;

        anim.speed = speed;
        anim.loop = loop;
        anim.slot = slot;
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
    protected onPlayerEnterGame(player: mw.Player): void {
        this.getAllClient().net_playerJoin(player.playerId);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Net Method

    public net_playAnimation(charGuid: string,
                             assetId: string,
                             speed: number,
                             loop: number,
                             slot: mw.AnimSlot,
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

    public net_playBasicStance(charGuid: string,
                               assetId: string) {
        this.handlePlayStance(charGuid,
            assetId);
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


//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Handler

    private handlePlayStance(charGuid: string,
                             assetId: string,
                             blendMode: mw.StanceBlendMode = undefined) {
        let character = GameObject.findGameObjectById(charGuid) as mw.Character;
        if (!character) return false;

        let stance = character.loadSubStance(assetId);
        if (!stance) return false;

        if (blendMode !== undefined && blendMode !== null) stance.blendMode = blendMode;

        return stance.play();
    }

    private handleStopStance(charGuid: string,
                             assetId: string = undefined) {
        let character = GameObject.findGameObjectById(charGuid) as mw.Character;
        if (!character) return false;

        let currentStance = character.currentSubStance;
        return currentStance && (currentStance.assetId === assetId || assetId === undefined) ?
            currentStance.stop() :
            false;
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

try {
    initRpcAuxModule();
} catch (e) {
    console.error(e);
}