import Log4Ts from "../../log4ts/Log4Ts";

/**
 * 对话交互构建器 enum.
 */
export enum InteractGeneratorTypes {
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
 * 对话交互构建器.
 * @param contentNodeId 对话内容节点 id.
 * @return number[] 对话内容节点.
 *
 */
export type InteractGenerator = (contentNodeId: number) => number[];

export default function InteractGeneratorFactory(type: InteractGeneratorTypes): InteractGenerator {
    switch (type) {
        case InteractGeneratorTypes.TestFunc:
            return testFunc;
        case InteractGeneratorTypes.Null:
        default:
            return normalDialogueFunc;
    }
}

export function normalDialogueFunc(contentNodeId: number): number[] {
    return [];
}

export function testFunc() {
    Log4Ts.log({name: "DialogueFuncTypes"}, `test called.`);
    return [127];
}

