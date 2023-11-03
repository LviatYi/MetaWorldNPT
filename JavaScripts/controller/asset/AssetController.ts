import { Singleton } from "../../depends/singleton/Singleton";

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
export default class AssetsController extends Singleton<AssetsController>() {
    private _loadCache: Set<string> = new Set();

    /**
     * 下载的最大尝试次数.
     */
    public maxRetryDownLoadTime: number = 1;

    /**
     * 加载资源.
     * @param guid 资源id
     * @returns
     */
    public async load(guid: string | string[]): Promise<boolean> {
        let ret: boolean = true;


        if (Array.isArray(guid)) {
            for (let g of guid) {
                ret = ret && await this.loadHandler(g);
            }
        } else {
            ret = await this.loadHandler(guid);
        }

        return ret;
    }

    /**
     * 加载并获取资源.
     * 当无法加载时返回 null.
     * @param guid
     */
    public async get(guid: string): Promise<GameObject> {
        const result = await this.load(guid);
        if (result) {
            return GameObject.asyncSpawn(guid);
        } else {
            return null;
        }
    }

    /**
     * 处理下载.
     * @param guid
     * @param retried 已重试次数.
     * @private
     */
    private async loadHandler(guid: string, retried: number = 0): Promise<boolean> {
        if (this.isAssetLoaded(guid)) {
            return true;
        }

        const ret = await mw.AssetUtil.asyncDownloadAsset(guid);
        if (ret) {
            this._loadCache.add(guid);
        } else {
            if (retried >= this.maxRetryDownLoadTime) {
                throw new Error(`download assets failed maybe there is network error or wrong asset guid: ${guid}`);
            }

            return this.loadHandler(guid, retried++);
        }

        return ret;
    }

    /**
     * 是否 资源已加载.
     */
    public isAssetLoaded(guid: string): boolean {
        return this._loadCache.has(guid);
    }
}