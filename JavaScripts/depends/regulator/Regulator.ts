/**
 * 分帧器.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author minjia.zhang
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
export default class Regulator {
    /**
     * 更新间隔. ms.
     */
    public updateInterval: number;

    /**
     * 上次就绪时间.
     */
    public lastUpdate: number = 0;

    public elapsed(now: number): number {
        return now - this.lastUpdate;
    }

    /**
     * 是否 就绪.
     */
    public ready(): boolean {
        const now = Date.now();
        if (this.elapsed(now) >= this.updateInterval) {
            this.lastUpdate = now;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param updateInterval 更新间隔.
     */
    constructor(updateInterval?: number) {
        this.updateInterval = updateInterval || 1000;
    }

    /**
     * 频率. 每秒 ready 次数.
     */
    public frequency(val: number): this {
        this.updateInterval = 1000 / val;
        return this;
    }

    /**
     * 间隔.
     * @param val
     */
    public interval(val: number): this {
        this.updateInterval = val;
        return this;
    }
}