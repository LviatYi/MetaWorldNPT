import Log4Ts from "../../log4ts/Log4Ts";

/**
 * 交互条件 enum.
 */
export enum InteractPredicateTypes {
    /**
     * 空置.
     */
    Null,
    /**
     * 测试交互构建器.
     */
    TestFunc = 127,
}

/**
 * 交互条件.
 * @param contentNodeId 对话内容节点 id.
 * @return 是否可交互.
 */
export type InteractPredicate = (contentNodeId: number) => boolean;

export default function InteractPredicateFactory(type: InteractPredicateTypes): InteractPredicate {
    switch (type) {
        case InteractPredicateTypes.TestFunc:
            return testFunc;
        case InteractPredicateTypes.Null:
        default:
            return normalDialogueFunc;
    }
}

export function normalDialogueFunc(contentNodeId: number): boolean {
    return true;
}

export function testFunc() {
    Log4Ts.log({name: "DialogueFuncTypes"}, `test called.`);
    return false;
}

