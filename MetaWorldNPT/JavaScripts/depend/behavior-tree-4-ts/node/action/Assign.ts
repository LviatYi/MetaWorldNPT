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
import Gtk from "gtoolkit";

@RegNodeDef()
export class Assign extends NodeHolisticDef<Context, NodeIns> {

    public type = NodeType.Action;

    public desc = "赋值";

    public doc = `# Assign

对黑板对象的成员赋值。

- 无子节点。
- 赋值成功后返回 Success。否则返回 Failure。

- input:
    - object: 对象 变量名称
    - assignKey: 输入值 变量名称

- **propertyPath 变量路径**：支持对对象成员进行赋值，格式为以 \`.\` 隔开的字符串。`;

    input = [
        "object",
        "assignKey",
    ];

    @RegArgDef(NodeArgTypes.String, "成员路径")
    propertyPath: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>,
                  obj: unknown,
                  assignVal: unknown): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let path = this.propertyPath.split(/[.,]/);
        if (Gtk.isNullOrUndefined(obj) ||
            typeof obj === "object" ||
            path.length <= 0) {
            env.context.error(() => `input invalid.`);
            return {status: NodeRetStatus.Failure};
        }

        let p = obj;
        for (let i = 0; i < path.length; ++i) {
            if (i === path.length - 1) {
                p[path[i]] = assignVal;
            } else {
                if (Gtk.isNullOrUndefined(p[path[i]])) {
                    p[path[i]] = {};
                } else if (typeof p[path[i]] !== "object") {
                    env.context.error(() => `try assign val for obj. but ${path[0]} is not object.`);
                    return {status: NodeRetStatus.Failure};
                }

                p = p[path[i]];
            }
        }

        return {status: NodeRetStatus.Success};
    }
}
