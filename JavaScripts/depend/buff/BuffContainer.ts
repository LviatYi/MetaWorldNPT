import BuffBase from "./Buff";

declare type BuffType = number;

type LazyBuffInstance<B extends BuffBase<RoleCtrl>, RoleCtrl> = () => B;

export type BuffRefresher<B extends BuffBase<RoleCtrl>, RoleCtrl> = {
    type: BuffType,
    caster: RoleCtrl,
    refresher: (buff: B) => void,
    buffCreator: LazyBuffInstance<B, RoleCtrl>
}

export enum AddBuffResult {
    Null,
    Added,
    Refreshed,
}

/**
 * Buff 控制器.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @author maopan.liao
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export class BuffContainer<RoleCtrl> {
    private buffs: Map<BuffType, BuffBase<RoleCtrl>> = new Map();

    private _suppresser: Set<BuffType> = new Set<BuffType>();

    private _killer: Set<BuffType> = new Set<BuffType>();

    private isSuppressed(type: BuffType): boolean {
        for (const suppresser of this._suppresser) {
            const buff = this.getBuff(suppresser);
            if (buff.suppressBuffs.indexOf(type) !== -1) return true;
        }

        return false;
    }

    private isKilled(type: BuffType): boolean {
        for (const killer of this._killer) {
            const buff = this.getBuff(killer);
            if (buff.killBuffs.indexOf(type) !== -1) return true;
        }

        return false;
    }

    /**
     * 是否 存在同类型 Buff.
     *      同类型 指具有相同的 {@link BuffBase.type}.
     * @param type
     */
    public hasBuff(type: BuffType) {
        return this.buffs.has(type);
    }

    /**
     * 获取 指定类型 Buff.
     * @param type
     */
    public getBuff(type: BuffType) {
        return this.buffs.get(type);
    }

    /**
     * 添加 Buff 或刷新已有 **同型** Buff.
     *      **同型** 指具有相同的 {@link BuffBase.type} 与 {@link BuffBase.caster}.
     * @param buff 被添加的新 Buff 或用于刷新的 BuffRefresher.
     *      - 当提供一个 {@link BuffBase} 时 直接添加一个新 Buff.
     *      - 当提供一个 {@link BuffRefresher} 时 尝试刷新已有 **同型** Buff. 否则添加一个新 Buff.
     */
    public addBuff<T extends BuffBase<RoleCtrl>>(buff: T | BuffRefresher<T, RoleCtrl>): AddBuffResult {
        if ("buffCreator" in buff) {
            if (this.hasBuff(buff.type)) {
                const oldBuff: T = this.getBuff(buff.type) as T;
                if (oldBuff.caster === buff.caster) {
                    buff.refresher(oldBuff);
                    oldBuff.refresh();
                    return AddBuffResult.Refreshed;
                }
            }

            buff = buff.buffCreator();
        }

        if (this.hasBuff(buff.type)) {
            this.removeBuff(buff.type);
        }

        if (this.isKilled(buff.type)) return;
        if (this.isSuppressed(buff.type)) buff.enable = false;

        if (buff.isSuppresser) {
            this._suppresser.add(buff.type);
            for (const type of buff.suppressBuffs) {
                const b = this.buffs.get(type);
                if (!b || !b.enable) continue;
                b.enable = false;
            }
        }
        if (buff.isKiller) {
            this._killer.add(buff.type);
            for (const type of buff.killBuffs) {
                this.removeBuff(type);
            }
        }

        this.buffs.set(buff.type, buff);
        buff.start();

        if (buff.survivalStrategy < 0) this.removeBuff(buff.type);

        return AddBuffResult.Added;
    }

    /**
     * 移除 指定类型 Buff.
     * @param buffType
     */
    public removeBuff(buffType: BuffType) {
        if (!this.hasBuff(buffType)) return;

        const buff = this.buffs.get(buffType);
        this.buffs.delete(buffType);
        buff.remove();

        if (buff.isSuppresser) {
            this._suppresser.delete(buffType);
            for (const type of buff.suppressBuffs) {
                const b = this.buffs.get(type);
                if (!(!b || !b.enable) && !this.isSuppressed(type)) b.enable = true;
            }
        }
        if (buff.isKiller) this._killer.delete(buffType);
    }

    public destroy() {
        for (const type of this.buffs.keys()) {
            this.removeBuff(type);
        }
    }

    public update(dt: number) {
        let currentTime = Date.now();

        for (const buff of this.buffs.values()) {

            if (buff.survivalStrategy > 0) {
                if (currentTime > buff.startTime + buff.survivalStrategy) {
                    this.removeBuff(buff.type);
                    continue;
                }
            }

            if (buff.intervalTime > 0) {
                let passTime = currentTime - buff.startTime;
                let totalCnt = Math.floor(passTime / buff.intervalTime);
                let cnt = totalCnt - buff.times;

                for (let i = 0; i < cnt; i++) {
                    buff.intervalThink();
                }
            }

        }
    }
}