/**
 * Log4Ts.
 * pure TS 日志管理器.
 * @desc 提供统一的日志管理.
 * @desc 以及简单的过滤功能.
 * @nothrow
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 1.3.2
 */
class Log4Ts {
//#region Config
    /**
     * 日志等级.
     */
    public debugLevel: DebugLevels = DebugLevels.Dev;

    private _config: Log4TsConfig = new Log4TsConfig();

    private _cache_chunk: string[] = [];

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    /**
     * debug log.
     * @param announcer announcer with name.
     *      when null or undefined, will print as second indent.
     * @param messages text.
     */
    public log = (announcer: Announcer, ...messages: (LogString | string | unknown)[]): void => {
        if (this.debugLevel !== DebugLevels.Dev || !this._config.checkAnnouncer(announcer)) return;
        const logFunc: LogFunc = this._config.logFunc;

        this.print(logFunc, announcer, ...messages);
    };

    /**
     * debug warn.
     * @param announcer announcer with name.
     *      when null or undefined, will print as second indent.
     * @param messages text.
     */
    public warn = (announcer: Announcer, ...messages: (LogString | string | unknown)[]): void => {
        if (this.debugLevel === DebugLevels.Silent || !this._config.checkAnnouncer(announcer)) return;
        const logFunc: LogFunc = this._config.logFunc;

        this.print(logFunc, announcer, ...messages);
    };

    /**
     * debug error.
     * @param announcer announcer with name.
     *      when null or undefined, will print as second indent.
     * @param messages text.
     */
    public error = (announcer: Announcer, ...messages: (LogString | string | unknown)[]): void => {
        if (this.debugLevel === DebugLevels.Silent || !this._config.checkAnnouncer(announcer)) return;
        const logFunc: LogFunc = this._config.errorFunc;

        this.print(logFunc, announcer, ...messages);
    };

    /**
     * 设置配置.
     * @param config
     */
    public setConfig(config: Log4TsConfig = undefined): this {
        this._config = config ?? new Log4TsConfig();
        return this;
    }

    private print(logFunc: LogFunc, announcer: Announcer, ...messages: (LogString | string | unknown)[]) {
        for (const msg of messages) {
            let msgStr: string;
            if (typeof msg === "string") {
                msgStr = msg;
            } else if (typeof msg === "function") {
                try {
                    msgStr = msg();
                } catch (e) {
                    msgStr = "function error.";
                }
            } else {
                msgStr = msg?.toString() ?? "message obj cant be convert to string.";
            }
            try {
                const logStr = `${
                    announcer && announcer.name ?
                        announcer.name + ":" :
                        `   `
                } ${msgStr}`;
                this._cache_chunk.push(logStr);
                logFunc(logStr);
            } catch (e) {
            }
            this.checkHandleChunk();

            announcer = null;
        }
    }

    private checkHandleChunk() {
        if (this._cache_chunk.length >= this._config.chunkSize) {
            this.forceHandleChunk();
        }
    }

    /**
     * 立即使用 Handler 处理 chunk 池 并清空 chunk.
     */
    public forceHandleChunk() {
        try {
            this._config.chunkHandler?.(this._cache_chunk);
            this._cache_chunk.length = 0;
        } catch (e) {
            console.log(`Log4Ts Self: chunkHandler error. ${e}`);
        }
    }
}

/**
 * 日志等级.
 */
export enum DebugLevels {
    /**
     * 无日志.
     */
    Silent = 0,
    /**
     * 信息. 包含 warn error.
     */
    Info,
    /**
     * 开发. 包含 log warn error.
     */
    Dev,
}

//#region Type
/**
 * 日志 lambda.
 */
export type LogString = (...params: unknown[]) => string;

/**
 * 宣称者.
 */
export type Announcer = { name: string };

/**
 * 宣称者或宣称者名.
 */
export type NameOrAnnouncer = string | Announcer;

/**
 * 日志打印函数.
 */
export type LogFunc = (...data: unknown[]) => void;

/**
 * 日志缓存分块处理器.
 */
export type ChunkHandler = (chunk: string[]) => void;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

export class Log4TsConfig {
//#region Constant
    private static readonly DEFAULT_CHUNK_SIZE = 50;
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region Member
    private _lastValidAnnouncer: Announcer = null;

    private _logFunc: LogFunc = console.log;

    private _warnFunc: LogFunc = console.warn;

    private _errorFunc: LogFunc = console.error;

    private _cacheChunkHandler: ChunkHandler | null = null;

    private _chunkSize: number = Log4TsConfig.DEFAULT_CHUNK_SIZE;

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public get logFunc(): LogFunc {
        return this._logFunc;
    }

    public get warnFunc(): LogFunc {
        return this._warnFunc;
    }

    public get errorFunc(): LogFunc {
        return this._errorFunc;
    }

    /**
     * chunk 池大小.
     * @return {number}
     */
    public get chunkSize(): number {
        return this._chunkSize;
    }

    /**
     * 白名单.
     * @desc only announcers in _whiteList could be printed.
     */
    private _whiteList: Set<string> = new Set<string>();

    /**
     * 黑名单.
     * @desc announcers in _blackList will never be printed.
     */
    private _blackList: Set<string> = new Set<string>();

    private _filter: (name: string) => boolean = null;

    /**
     * 设置 log 函数.
     * @param func
     */
    public setLogFunc(func: LogFunc): this {
        this._logFunc = func;
        return this;
    }

    /**
     * 设置 warn 函数.
     * @param func
     */
    public setWarnFunc(func: LogFunc): this {
        this._warnFunc = func;
        return this;
    }

    /**
     * 设置 error 函数.
     * @param func
     */
    public setErrorFunc(func: LogFunc): this {
        this._errorFunc = func;
        return this;
    }

    /**
     * 设置 chunk 池大小.
     * @param {number} size
     *  - default 1.
     *  - 未主动调用前 默认值为 {@link Log4TsConfig.DEFAULT_CHUNK_SIZE}.
     * @return {this}
     */
    public setChunkSize(size: number = 1): this {
        this._chunkSize = size;
        return this;
    }

    /**
     * 设置 **chunk 池** 处理器.
     * @desc 当 chunk 池满时自动触发，并清除 chunk 池.
     * @desc chunk 池为日志的缓存池，用于处理大量日志时的分块输出.
     * @desc 当 chunk 池中的日志数量达到 {@link chunkSize} 时，池满.
     * @param {ChunkHandler} handler
     * @return {this}
     */
    public setChunkHandler(handler: ChunkHandler): this {
        this._cacheChunkHandler = handler;
        return this;
    }

    /**
     * chunk 池处理器.
     * @friend {@link Log4Ts}
     */
    public get chunkHandler(): ChunkHandler | null {
        return this._cacheChunkHandler;
    }

    /**
     * 添加 白名单.
     * @param names
     */
    public addWhiteList(...names: (NameOrAnnouncer | NameOrAnnouncer[])[]): this {
        names.forEach(name => {
            if (Array.isArray(name)) {
                name.forEach(n => {
                    if (typeof n !== "string") n = n.name;
                    this._whiteList.add(n);
                });
            } else {
                if (typeof name !== "string") name = name.name;
                this._whiteList.add(name);
            }
        });
        return this;
    }

    /**
     * 添加 黑名单.
     * @param names
     */
    public addBlackList(...names: (NameOrAnnouncer | NameOrAnnouncer[])[]): this {
        names.forEach(name => {
            if (Array.isArray(name)) {
                name.forEach(n => {
                    if (typeof n !== "string") n = n.name;
                    this._blackList.add(n);
                });
            } else {
                if (typeof name !== "string") name = name.name;
                this._blackList.add(name);
            }
        });
        return this;
    }

    /**
     * 设定过滤器.
     * @desc 当过滤器存在时 仅过滤器生效.
     * @desc 以支持更多的客制化过滤选项.
     * @param filter
     */
    public setFilter(filter: (name: string) => boolean): this {
        this._filter = filter;
        return this;
    }

    /**
     * 重置过滤器.
     * @desc 重置后将使用白名单与黑名单进行过滤.
     */
    public resetFilter(): this {
        this._filter = null;
        return this;
    }

    private inWhiteList(announcer: Announcer): boolean {
        return this._whiteList.size === 0 || (announcer.name ? this._whiteList.has(announcer.name) : false);
    }

    private inBlackList(announcer: Announcer): boolean {
        return announcer.name ? this._blackList.has(announcer.name) : false;
    }

    /**
     * 检查 Announcer 是否可打印.
     * @param announcer
     */
    public checkAnnouncer(announcer: Announcer): boolean {
        if (announcer == null) {
            if (this._lastValidAnnouncer == null) return false;
        } else this._lastValidAnnouncer = announcer;

        return this._filter ?
            this._filter(this._lastValidAnnouncer.name) :
            this.inWhiteList(this._lastValidAnnouncer) && !this.inBlackList(this._lastValidAnnouncer);
    }

//#region Shorter Builder
    /**
     * short for {@link setFilter}.
     * @param filter
     */
    public sF(filter: (name: string) => boolean): this {
        return this.setFilter(filter);
    }

    /**
     * short for {@link resetFilter}.
     */
    public rsF() {
        return this.resetFilter();
    }

    /**
     * short for {@link setLogFunc}.
     * @param func
     * @constructor
     */
    public SLog(func: LogFunc) {
        this.setLogFunc(func);
    }

    /**
     * short for {@link setWarnFunc}.
     * @param func
     * @constructor
     */
    public SWarn(func: LogFunc) {
        this.setWarnFunc(func);
    }

    /**
     * short for {@link setErrorFunc}.
     * @param func
     * @constructor
     */
    public SError(func: LogFunc) {
        this.setErrorFunc(func);
    }

    /**
     * short for {@link addWhiteList}.
     * @param names
     */
    public aW(...names: (NameOrAnnouncer | NameOrAnnouncer[])[]) {
        return this.addWhiteList(...names);
    }

    /**
     * short for {@link addBlackList}.
     * @param names
     */
    public aB(...names: (NameOrAnnouncer | NameOrAnnouncer[])[]) {
        return this.addBlackList(...names);
    }

//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
}

//#region Export
export default new Log4Ts().setConfig();
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄