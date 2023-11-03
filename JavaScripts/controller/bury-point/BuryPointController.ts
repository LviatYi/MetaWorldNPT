import { Singleton } from "../../depends/singleton/Singleton";

const reportLogInfo = mw.RoomService.reportLogInfo;

/**
 * 埋点信息抽象类.
 * 自定义埋点信息需继承此类.
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
export abstract class BuryInfo {
    /**
     * 埋点事件名.
     */
    public abstract buryName: string;

    /**
     * 埋点事件描述.
     */
    public buryDescription: string = "";

    /**
     * 将自定义属性转换为 Json 字符串.
     */
    public dataStringify(): string {
        const obj = {};
        for (const buryPointInfoKey in this) {
            if (buryPointInfoKey === "buryName" || buryPointInfoKey === "buryDescription") {
                continue;
            }
            obj[buryPointInfoKey as string] = this[buryPointInfoKey];
        }

        return JSON.stringify(obj);
    }
}

/**
 * 埋点控制器.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 * @version 0.9.0a
 */
export default class BuryPointController extends Singleton<BuryPointController>() {

    /**
     * 埋点反馈.
     * @param data 事件数据.
     * @private
     */
    public report(data: BuryInfo) {
        reportLogInfo(data.buryName, data.buryDescription, data.dataStringify());
    }

    /**
     * 自定义埋点反馈.
     * @param eventName 事件名.
     * @param desc 事件描述.
     * @param data Json 数据.
     */
    public customReport(eventName: string, desc: string, data: string) {
        reportLogInfo(eventName, desc, data);
    }
}