import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { Context } from "../../base/environment/Context";
import { NodeType } from "../../base/enum/NodeType";
import { Environment } from "../../base/environment/Environment";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { RegNodeDef } from "../../base/registry/RegNodeDef";

@RegNodeDef()
export class Invert extends NodeHolisticDef<Context, NodeIns> {
    public type = NodeType.Decorator;

    public desc: "求反";

    public doc: `# Invert

对子节点运行结果求返。

- 至多 1 个子节点。
- 若存在子节点，如果子节点返回 Running，返回 Running，否则返回 求反的子节点状态。
- 若不存在子节点，返回 Success。`;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);

        if (isYieldAtChild(yieldTag)) {
            const stackRet = env.lastStackRet;
            if (stackRet === NodeRetStatus.Running) {
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }

            switch (stackRet) {
                case NodeRetStatus.Success:
                    return {status: NodeRetStatus.Failure};
                default:
                    return {status: NodeRetStatus.Success};
            }
        }

        if (nodeIns.size <= 0) return {status: NodeRetStatus.Success};
        let ret = nodeIns.runChild(env, 0);
        switch (ret) {
            case NodeRetStatus.Success:
                return {status: NodeRetStatus.Failure};
            case NodeRetStatus.Failure:
                return {status: NodeRetStatus.Success};
            case NodeRetStatus.Running:
                return {status: NodeRetStatus.Running};
        }
    }
}