/**
 * 埋点事件 定义.
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
export const BuryEventDefine = enforceBuryEventInfo({
    Ts_Page: {
        name: "ts_page",
        desc: "记录进入界面的点",
        params: {
            gameid: "long",
            ugc_type: "long",
            editor_parent_id: "long",
            ugc_parent_id: "string",
            page_name: "string",
            pre_page_name: "string",
        },
    },
    Ts_Tutorial_Start: {
        name: "ts_tutorial_start",
        desc: "记录教程开始的点",
        params: {
            gameid: "long",
            tutorial_id: "long",
            tutorial_name: "string",
        },
    },
});

/**
 * 埋点事件类型.
 */
export type BuryEventTypes = keyof typeof BuryEventDefine;

type BuryParamType = "long" | "double" | "string";

type InferBuryParamType<T extends BuryParamType> =
    T extends "long" ? number :
        T extends "double" ? number :
            T extends "string" ? string : never;

interface IBuryEventInfo {
    name: string;
    desc: string;
    params: { [key: string]: BuryParamType };
}

function enforceBuryEventInfo<T extends { [key: string]: IBuryEventInfo }>(arg: T): T {
    return arg;
}

type BuryEventParams<T extends BuryEventTypes> = (typeof BuryEventDefine)[T]["params"];

/**
 * 埋点事件参数.
 */
export type BuryEventInferParams<T extends BuryEventTypes> = {
    // LviatYi: TypeScript Type Server try to infer `key` as number symbol or string.
    // @ts-ignore
    [K in keyof BuryEventParams<T>]: InferBuryParamType<BuryEventParams<T>[K]>;
};

/**
 * 埋点事件信息.
 */
export type BuryEventInfo<T extends BuryEventTypes> = {
    name: string;
    desc: string;
    params: BuryEventParams<T>;
}
