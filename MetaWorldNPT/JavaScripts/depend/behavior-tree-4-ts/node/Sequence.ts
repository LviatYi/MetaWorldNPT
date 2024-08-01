import { RegNodeDef } from "../base/registry/RegNodeDef";
import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../base/node/NodeIns";
import { NodeType } from "../base/enum/NodeType";
import { Environment } from "../base/environment/Environment";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { Context } from "../base/environment/Context";

@RegNodeDef()
export class Sequence extends NodeHolisticDef<Context, NodeIns> {
    public type = NodeType.Composite;

    public desc = "顺序执行";

    public doc = `# Sequence

顺序执行所有子节点，直到任一节点返回 Failure。

- 当子节点返回 Running，返回 Running。
- 当所有子节点返回 Success，返回 Success。否则立即返回 Failure。`;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        let i = nodeIns.currYieldAt(env);
        if (isYieldAtChild(i)) {
            let stackRet: NodeRetStatus = env.lastStackRet;
            if (stackRet === NodeRetStatus.Running) {
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }

            if (stackRet === NodeRetStatus.Failure) {
                return {status: NodeRetStatus.Failure};
            }

            ++i;
        } else {
            i = 0;
        }

        for (; i < nodeIns.size; ++i) {
            let ret = nodeIns.runChild(env, i);
            if (ret === NodeRetStatus.Failure) {
                return {status: NodeRetStatus.Failure};
            } else if (ret === NodeRetStatus.Running) {
                return {status: NodeRetStatus.Running};
            }
        }

        return {status: NodeRetStatus.Success};
    }
}