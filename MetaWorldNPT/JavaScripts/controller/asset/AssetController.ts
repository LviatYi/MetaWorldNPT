import { Singleton } from "gtoolkit";
import Log4Ts from "mw-log4ts/Log4Ts";

/**
 * 资源管理器.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.0.0
 */
export default class AssetController extends Singleton<AssetController>() {
    private _loadingTasks: Map<string, Promise<boolean>> = new Map();

    public get maxRetryDownLoadTime(): number {
        return this._maxRetryDownLoadTime;
    }

    private _maxRetryDownLoadTime: number = 5;

    /**
     * 设置 最大尝试下载次数.
     */
    public setMaxRetryDownLoadTime(val: number): this {
        this._maxRetryDownLoadTime = val;
        return this;
    }

    /**
     * 加载资源.
     * @param assetId 资源id.
     * @returns
     */
    public async load(assetId: string): Promise<boolean> {
        if (this.isAssetLoaded(assetId)) return true;
        const task = this._loadingTasks.get(assetId);
        if (task) {
            return task;
        } else {
            const promise = this.loadHandler(assetId,
                this._maxRetryDownLoadTime);
            this._loadingTasks.set(assetId, promise);

            const result = await promise;
            this._loadingTasks.delete(assetId);
            return result;
        }
    }

    /**
     * 处理下载.
     * @param assetId
     * @param retried 重试次数.
     * @private
     */
    private async loadHandler(assetId: string, retried: number): Promise<boolean> {
        const ret = await mw.AssetUtil.asyncDownloadAsset(assetId);
        if (ret) return true;

        if (retried <= 0) {
            this.logDownloadFailed(assetId);
            return false;
        }

        return this.loadHandler(assetId, retried++);
    }

    /**
     * 是否 资源已加载.
     */
    public isAssetLoaded(assetId: string): boolean {
        return mw.AssetUtil.assetLoaded(assetId);
    }

    private logDownloadFailed(assetId: string) {
        Log4Ts.error(AssetController,
            `download assets failed maybe there is network error or wrong asset id: ${assetId}`);
    }
}