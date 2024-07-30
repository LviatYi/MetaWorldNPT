import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeType } from "../../base/enum/NodeType";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { Environment } from "../../base/environment/Environment";
import { isNotYield, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";
import { Context } from "../../base/environment/Context";

@RegNodeDef()
export class Erase extends NodeHolisticDef<Context, NodeIns> {

    public type = NodeType.Action;

    public desc = "擦除";

    public doc = `# Erase

擦除黑板变量。

- 无子节点。
- 返回 Success。
- **key 变量名**`;

    @RegArgDef(NodeArgTypes.String, "变量名")
    key: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        env.set(this.key, undefined);

        return {status: NodeRetStatus.Success};
    }
}