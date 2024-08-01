import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { RegNodeDef } from "../base/registry/RegNodeDef";
import { NodeType } from "../base/enum/NodeType";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { Environment } from "../base/environment/Environment";
import { isNotYield, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../base/node/NodeIns";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { RegArgDef } from "../base/registry/RegArgDef";
import { NodeArgTypes } from "../base/node/INodeArg";
import { Context } from "../base/environment/Context";
import { AcceptedInputType, AcceptedInputTypes, deserializeToAcceptedValue } from "./base/AcceptedInputType";

@RegNodeDef()
export class Write extends NodeHolisticDef<Context, NodeIns> {

    public type = NodeType.Action;

    public desc = "写入";

    public doc = `# Write

写入黑板变量。

- 无子节点。
- 写入成功后返回 Success。否则返回 Failure。
- **key 变量名**
- **value 值**：具体值。当 valType 为 object 时，应填入 Json。
- **valType 类型**`;

    @RegArgDef(NodeArgTypes.String, "变量名")
    key: string;

    @RegArgDef(NodeArgTypes.String, "值", "")
    value: string;

    @RegArgDef(NodeArgTypes.StringOpt,
        "类型",
        "number",
        AcceptedInputType)
    valType: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        env.set(this.key, deserializeToAcceptedValue(this.value,
            this.valType as AcceptedInputTypes));

        return {status: NodeRetStatus.Success};
    }
}