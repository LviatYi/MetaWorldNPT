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
export class Write extends NodeHolisticDef<Context, NodeIns> {

    public type = NodeType.Action;

    public desc = "写入";

    public doc = `# Write

写入黑板变量。

- 无子节点。
- 写入成功后返回 Success。否则返回 Failure。
- **key 变量名**
- **value 值**：具体值。当 valType 为 object 时，应填入 Json。
- **valType 类型**：number|string|boolean|object。`;

    @RegArgDef(NodeArgTypes.String, "变量名")
    key: string;

    @RegArgDef(NodeArgTypes.String, "值", "")
    value: string;

    @RegArgDef(NodeArgTypes.StringOpt,
        "类型",
        "number",
        [{
            name: "number",
            value: "number",
        }, {
            name: "string",
            value: "string",
        }, {
            name: "boolean",
            value: "boolean",
        }, {
            name: "object",
            value: "object",
        }])
    valType: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let val: unknown;
        switch (this.valType) {
            case "string":
                val = String(this.value);
                break;
            case "boolean":
                val = this.value === "1" ||
                    this.value === "true" ||
                    /[Yy](es)?$/.test(this.value);
                break;
            case "object":
                try {
                    val = JSON.parse(this.value as string);
                } catch (e) {
                    NodeIns.error("error occurs when parse JSON object.", e);
                    return {status: NodeRetStatus.Failure};
                }
                break;
            case "number":
            default:
                val = Number(this.value);
                if (Number.isNaN(val)) val = 0;
                break;
        }

        env.set(this.key, val);

        return {status: NodeRetStatus.Success};
    }
}