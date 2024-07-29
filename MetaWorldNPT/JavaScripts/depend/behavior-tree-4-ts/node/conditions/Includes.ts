import { Context } from "../../base/environment/Context";
import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { isNotYield, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { NodeType, Environment, INodeRetInfo, NodeRetStatus } from "../../test/bt4ts.test";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";
import Gtk from "gtoolkit";

export default class Includes extends NodeHolisticDef<Context, NodeIns> {

    public desc = "包含";
    public doc = `# Includes

判断黑板变量中的数组是否包含指定值。

- 无子节点。
- 返回 Success 或 Failure，取决于黑板变量是否包含指定值。
- key 键：若定义，则检查黑板变量。
- value 值：若定义，则与黑板变量比较。`;
    public type: Readonly<NodeType> = NodeType.Condition;

    @RegArgDef(NodeArgTypes.String, "变量路径")
    key: string;

    @RegArgDef(NodeArgTypes.String, "值", "")
    value: unknown;

    public behave(nodeIns: NodeIns<Context>, env: Environment<Context, NodeIns<Context>>, ...input: unknown[]): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let valPath = this.key.split(".");
        if (valPath.length <= 0) return { status: NodeRetStatus.Failure };

        let needObj = valPath.length > 1;
        let p: unknown = env.get(valPath[0]);
        if (!Gtk.isNullOrUndefined(p) &&
            typeof p !== "object" &&
            needObj) {
            env.context.error(() => `find val of ${this.key}, but ${valPath[0]} is not object.`);
            return { status: NodeRetStatus.Failure };
        }

        if (!Gtk.isNullOrUndefined(p[valPath[valPath.length - 1]])) {
            env.context.error(() => `val of ${this.key} not found.`);
            return { status: NodeRetStatus.Failure };
        }

        if (!Array.isArray(p[valPath[valPath.length - 1]])) {
            env.context.error(() => `val of ${this.key} is not array.`);
            return { status: NodeRetStatus.Failure };
        }

        if (Gtk.isNullOrUndefined(this.value)) {
            env.context.error(() => `value not exists.`);
            return { status: NodeRetStatus.Failure };
        }

        const index = p[valPath[valPath.length - 1]].indexOf(this.value);
        return { status: index >= 0 ? NodeRetStatus.Success : NodeRetStatus.Failure };
    }
}

