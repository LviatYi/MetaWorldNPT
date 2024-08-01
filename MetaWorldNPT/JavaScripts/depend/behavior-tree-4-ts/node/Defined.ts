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
export class Defined extends NodeHolisticDef<Context, NodeIns> {
    public type: Readonly<NodeType> = NodeType.Condition;

    public desc = "是否定义";

    public doc = `# Defined

判断黑板变量是否定义指定值。

- 无子节点。
- 返回 Success 或 Failure，取决于黑板变量是否定义指定值。
- **key 键** 变量路径。可以指向一个键，也可以指向成员。`;

    @RegArgDef(NodeArgTypes.String, "变量路径")
    key: string;

    public behave(nodeIns: NodeIns, env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let p: unknown = env.getValByPath(undefined, this.key);

        return Gtk.isNullOrUndefined(p) ?
            {status: NodeRetStatus.Failure} :
            {status: NodeRetStatus.Success};
    }
}