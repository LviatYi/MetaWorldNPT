import Log4Ts from "../../log4ts/Log4Ts";

/**
 * 对话节点功能 enum.
 */
export enum DialogueNodeFuncTypes {
    /**
     * 空置.
     */
    Null,
    /**
     * 测试节点功能.
     */
    TestFunc = 127,
}

export type DialogueFunc = () => void;

export default function DialogueFuncFactory(type: DialogueNodeFuncTypes): DialogueFunc {
    switch (type) {
        case DialogueNodeFuncTypes.TestFunc:
            return testFunc;
        case DialogueNodeFuncTypes.Null:
        default:
            return normalDialogueFunc;
    }
}

export function normalDialogueFunc() {
    Log4Ts.log(normalDialogueFunc, `called.`);
}

export function testFunc() {
    Log4Ts.log({name: "DialogueFuncTypes"}, `test called.`);
}

