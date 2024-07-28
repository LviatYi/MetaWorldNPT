import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeType } from "../../base/enum/NodeType";
import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { Environment } from "../../base/environment/Environment";
import { Context } from "../../base/environment/Context";

@RegNodeDef()
export class Selector extends NodeHolisticDef<Context, NodeIns> {
    public type = NodeType.Composite;

    public desc: "选择执行";

    public doc: `# Selector

顺序执行所有子节点，直到任一节点返回 Success。

- 当子节点返回 Running，返回 Running。
- 当存在子节点返回 Success，立即返回 Success。否则返回 Failure。`;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        let i = nodeIns.currYieldAt(env);
        if (isYieldAtChild(i)) {
            let stackRet: NodeRetStatus = env.lastStackRet;
            if (stackRet === NodeRetStatus.Running) {
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }

            if (stackRet === NodeRetStatus.Success) {
                return {status: NodeRetStatus.Success};
            }

            ++i;
        } else {
            i = 0;
        }

        for (; i < nodeIns.size; ++i) {
            let ret = nodeIns.runChild(env, i);
            if (ret === NodeRetStatus.Success) {
                return {status: NodeRetStatus.Success};
            } else if (ret === NodeRetStatus.Running) {
                return {status: NodeRetStatus.Running};
            }
        }

        return {status: NodeRetStatus.Failure};
    }
}
