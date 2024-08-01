import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../base/node/NodeIns";
import { Context } from "../base/environment/Context";
import { NodeType } from "../base/enum/NodeType";
import { Environment } from "../base/environment/Environment";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { RegNodeDef } from "../base/registry/RegNodeDef";

@RegNodeDef()
export class AlwaysSuccess extends NodeHolisticDef<Context, NodeIns> {
    public type = NodeType.Decorator;

    public desc = "判真";

    public doc = `# AlwaysSuccess

返回 Success 态。

- 至多 1 个子节点。
- 若存在子节点且返回 Running 时，返回 Running。否则返回 Success。`;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);

        if (isYieldAtChild(yieldTag)) {
            const stackRet = env.lastStackRet;
            if (stackRet === NodeRetStatus.Running) {
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }

            return {status: NodeRetStatus.Success};
        }

        if (nodeIns.size <= 0) return {status: NodeRetStatus.Success};
        let ret = nodeIns.runChild(env, 0);
        switch (ret) {
            case NodeRetStatus.Success:
            case NodeRetStatus.Failure:
                return {status: NodeRetStatus.Success};
            case NodeRetStatus.Running:
                return {status: NodeRetStatus.Running};
        }
    }
}
