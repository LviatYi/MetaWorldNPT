import GToolkit from "../../../util/GToolkit";
import InteractPredicateFactory from "../interact-generator-type/InteractPredicateTypes";

export interface IRelateEntityConfigElement {
    /**
     * ID.
     */
    id: number;

    /**
     * 名称.
     */
    name: string;

    /**
     * 立绘.
     */
    originPainting: string;

    /**
     * 是否主体.
     */
    isSubjective: boolean;
}

export interface IDialogueContentNodeConfigElement {
    /**
     * ID.
     */
    id: number;

    /**
     * 下条内容Id.
     */
    nextId: number;

    /**
     * 内容.
     */
    content: string;

    /**
     * 来源实体Id.
     */
    sourceId: number;

    /**
     * 可及性对话交互节点 Ids.
     */
    interactPredNodeIds: number[][];
}

export interface IDialogueInteractNodeConfigElement {
    /**
     * ID.
     */
    id: number;

    /**
     * 对话内容节点Id.
     */
    contentNodeId: number;

    /**
     * 内容.
     */
    content: string;

    /**
     * 对话节点功能Id.
     */
    funcId: number;

    /**
     * 图标.
     */
    icon: string;
}

/**
 * 对话配置读取器 抽象类.
 */
export default abstract class ADialogifyConfigReader<
    RC extends IRelateEntityConfigElement,
    CC extends IDialogueContentNodeConfigElement,
    IC extends IDialogueInteractNodeConfigElement> {

    /**
     * 获取 叙述实体 配置元素.
     * @param id
     */
    public abstract getRelateEntityConfig(id: number): RC;

    /**
     * 获取 对话内容节点 配置元素.
     * @param id
     */
    public abstract getDialogueContentNodeConfig(id: number): CC;

    /**
     * 获取 对话交互节点 配置元素.
     * @param id
     */
    public abstract getDialogueInteractNodeConfig(id: number): IC;
}

/**
 * 是否 对话内容节点 链接到下一个内容节点.
 * @param config
 */
export function isDialogueContentNodeHasNextId(config: IDialogueContentNodeConfigElement): boolean {
    return isValidDialogueContentNodeId(config.nextId);
}

/**
 * 是否 有效的对话节点 Id.
 * 有效 指 id 不为 null 且 不为 0.
 * @param id
 */
export function isValidDialogueContentNodeId(id: number): boolean {
    return !(GToolkit.isNullOrUndefined(id) || id === 0);
}

/**
 * 是否 对话交互节点 链接到下一个内容节点.
 * @param config
 */
export function isDialogueInteractNodeHasContentNodeId(config: IDialogueInteractNodeConfigElement): boolean {
    return !(GToolkit.isNullOrUndefined(config.contentNodeId) || config.contentNodeId === 0);
}

/**
 * 是否 对话交互节点 拥有功能.
 * @param config
 */
export function isDialogueInteractNodeHasFuncId(config: IDialogueInteractNodeConfigElement): boolean {
    return !(GToolkit.isNullOrUndefined(config.funcId) || config.funcId === 0);
}

/**
 * 是否 有效的叙述实体 Id.
 * 有效 指 id 不为 null 且 不为 0.
 * @param sourceId
 */
export function isEntityIdValid(sourceId: number) {
    return !(GToolkit.isNullOrUndefined(sourceId) || sourceId === 0);
}

/**
 * 获取 对话内容节点 附属的对话交互节点列表.
 * @param config
 */
export function getInteractNodes(config: IDialogueContentNodeConfigElement): number[] {
    return config.interactPredNodeIds
        .filter((ip) => {
            if (ip.length === 0) return false;
            const predId = ip[1];
            return predId === undefined || predId === 0 || InteractPredicateFactory(predId)?.(config.id);
        })
        .map(ip => ip[0]);
}