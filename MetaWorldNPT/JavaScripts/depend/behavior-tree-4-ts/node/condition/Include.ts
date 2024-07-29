import { Context } from "../../base/environment/Context";
import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { isNotYield, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";
import Gtk from "gtoolkit";
import { NodeType } from "../../base/enum/NodeType";
import { Environment } from "../../base/environment/Environment";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { RegNodeDef } from "../../base/registry/RegNodeDef";

@RegNodeDef()
export class Include extends NodeHolisticDef<Context, NodeIns> {
    public type: Readonly<NodeType> = NodeType.Condition;

    public desc = "是否包含";

    public doc = `# Include

判断黑板变量中的数组是否包含指定值。

- 无子节点。
- 返回 Success 或 Failure，取决于黑板变量是否包含指定值。
- **key 键**：应指向一个数组。
- **value 值**：一个简单类型值 number|string|boolean。`;

    @RegArgDef(NodeArgTypes.String, "变量路径")
    key: string;

    @RegArgDef(NodeArgTypes.String, "值", "")
    value: unknown;

    public behave(nodeIns: NodeIns<Context>, env: Environment<Context, NodeIns<Context>>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let valPath = this.key.split(/[.,]/);
        if (valPath.length <= 0) return {status: NodeRetStatus.Failure};

        let o: unknown = env.get(valPath[0]);
        let p: unknown = o;

        for (let i = 1; i < valPath.length; ++i) {
            if (Gtk.isNullOrUndefined(p) || typeof p !== "object") return {status: NodeRetStatus.Failure};

            p = p[valPath[i]];
        }

        if (!Array.isArray(p) || Gtk.isNullOrEmpty(p)) return {status: NodeRetStatus.Failure};

        if (Gtk.isNullOrUndefined(this.value)) {
            env.context.error(() => `value not exists.`);
            return {status: NodeRetStatus.Failure};
        }

        const index = p[valPath[valPath.length - 1]].indexOf(this.value);
        return {status: index >= 0 ? NodeRetStatus.Success : NodeRetStatus.Failure};
    }
}

