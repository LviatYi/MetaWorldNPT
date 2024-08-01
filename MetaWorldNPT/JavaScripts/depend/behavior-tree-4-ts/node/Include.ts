import { Context } from "../base/environment/Context";
import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { isNotYield, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../base/node/NodeIns";
import { RegArgDef } from "../base/registry/RegArgDef";
import { NodeArgTypes } from "../base/node/INodeArg";
import Gtk from "gtoolkit";
import { NodeType } from "../base/enum/NodeType";
import { Environment } from "../base/environment/Environment";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { RegNodeDef } from "../base/registry/RegNodeDef";

@RegNodeDef()
export class Include extends NodeHolisticDef<Context, NodeIns> {
    public type: Readonly<NodeType> = NodeType.Condition;

    public desc = "是否包含";

    public doc = `# Include

判断黑板变量中的数组是否包含指定值。

- 无子节点。
- 返回 Success 或 Failure，取决于黑板变量的某个数组是否包含指定值。
- **key 键** 变量路径。可以指向一个键，也可以指向成员。
- **value 值**：一个简单类型值 number|string|boolean。`;

    @RegArgDef(NodeArgTypes.String, "变量路径")
    key: string;

    @RegArgDef(NodeArgTypes.String, "值", "")
    value: unknown;

    public behave(nodeIns: NodeIns, env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let p: unknown = env.getValByPath(undefined, this.key);

        if (!Array.isArray(p) || Gtk.isNullOrEmpty(p)) return {status: NodeRetStatus.Failure};

        if (Gtk.isNullOrUndefined(this.value)) {
            env.context.error(`${this.name}: value is null.`);
            return {status: NodeRetStatus.Failure};
        }

        const index = p.indexOf(this.value);
        return {status: index >= 0 ? NodeRetStatus.Success : NodeRetStatus.Failure};
    }
}