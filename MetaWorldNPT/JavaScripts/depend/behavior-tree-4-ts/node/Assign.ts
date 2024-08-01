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

@RegNodeDef()
export class Assign extends NodeHolisticDef<Context, NodeIns> {

    public type = NodeType.Action;

    public desc = "赋值";

    public doc = `# Assign

使用黑板属性对输入对象赋值。

- 无子节点。
- 赋值成功后返回 Success。否则返回 Failure。

- input:
    - assignKey: 输入值 变量名称

- **path 目标路径**：向黑板写入的键。支持对对象成员进行赋值，格式为以 \`.\` 隔开的字符串。`;

    input = [
        "assignKey",
    ];

    @RegArgDef(NodeArgTypes.String, "目标路径")
    path: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>,
                  assignVal: unknown): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let result = env.setValByPath(undefined, this.path, assignVal);

        return {
            status: result ?
                NodeRetStatus.Success :
                NodeRetStatus.Failure,
        };
    }
}
