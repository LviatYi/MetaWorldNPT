import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { NodeType } from "../../base/enum/NodeType";
import { Environment } from "../../base/environment/Environment";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";

@RegNodeDef()
export class WaitPar extends NodeHolisticDef<NodeIns> {
    public type = NodeType.Composite;

    public desc: "延迟顺序执行";

    public doc: `# WaitPar

延迟顺序执行所有子节点，直到任一节点返回 Failure。

- 当所有节点返回 Success，返回 Success。当子节点返回 Running，返回 Running。否则返回 Failure。`;

    public behave(nodeIns: NodeIns,
                  env: Environment<NodeIns>): INodeRetInfo {
        let t = env.get("touchedTime") as number;
        if (t === undefined) {
            t = 0;
            env.set("touchedTime", t + 1);
        }

        if (t < 1) return {status: NodeRetStatus.Running};

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