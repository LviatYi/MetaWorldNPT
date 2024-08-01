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
import {
    AcceptedInputTypeExceptObject,
    AcceptedInputTypesExceptObject,
    deserializeToAcceptedValue,
} from "./base/AcceptedInputType";

@RegNodeDef()
export class IfValIs extends NodeHolisticDef<Context, NodeIns> {
    public type: Readonly<NodeType> = NodeType.Condition;

    public desc = "是否值为";

    public doc = `# IfValIs

判断黑板变量中的变量是否与指定值相等。

- 无子节点。
- 返回 Success 或 Failure，取决于黑板变量是否与指定值相等。
- **key 键** 变量路径。可以指向一个键，也可以指向成员。`;

    @RegArgDef(NodeArgTypes.String, "变量路径")
    key: string;

    @RegArgDef(NodeArgTypes.String, "值", "true")
    value: string;

    @RegArgDef(NodeArgTypes.Enum,
        "类型",
        "boolean",
        AcceptedInputTypeExceptObject)
    valType: string;

    public behave(nodeIns: NodeIns, env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let p: unknown = env.getValByPath(undefined, this.key);
        if (Gtk.isNullOrUndefined(p)) return {status: NodeRetStatus.Failure};

        let cmp = deserializeToAcceptedValue(this.value, this.valType as AcceptedInputTypesExceptObject);
        return {status: p === cmp ? NodeRetStatus.Success : NodeRetStatus.Failure};
    }
}