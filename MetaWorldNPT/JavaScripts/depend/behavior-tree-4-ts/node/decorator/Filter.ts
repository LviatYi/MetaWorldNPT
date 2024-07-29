import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { Context } from "../../base/environment/Context";
import { NodeType } from "../../base/enum/NodeType";
import { Environment } from "../../base/environment/Environment";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { RegNodeDef } from "../../base/registry/RegNodeDef";
import Gtk from "gtoolkit";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";

@RegNodeDef()
export class Filter extends NodeHolisticDef<Context, NodeIns> {
//#region Constant
    /**
     * 筛选键.
     */
    public static readonly FilterKey = "__FILTER_KEY__"; // 自定义私有数据键
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Decorator;

    public desc = "筛选";

    public doc = `# Filter

筛选一个数组。

- 至多 1 个节点。
- 若输入数组未定义，返回 Failure。
- 若不存在子节点，断言返回 Failure，否则断言返回子节点状态。
- 当断言为 Running，返回 Running。
- 当断言为 Success，将该元素填入返回值，否则跳过。
- 返回 Success。

- **inputKey 输入参数名**：应指向一个数组。
- **outputKey 输出参数名**：指向一个数组。`;

    @RegArgDef(NodeArgTypes.String, "输入参数名（数组）", "InputArray")
    public inputKey: string;

    @RegArgDef(NodeArgTypes.String, "输出参数名（数组）", "OutputArray")
    public outputKey: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const input = env.get(this.inputKey) as unknown[];
        if (Gtk.isNullOrUndefined(input) || !Array.isArray(input)) {
            return {status: NodeRetStatus.Failure};
        }

        let yieldTag = nodeIns.currYieldAt(env);
        let result: unknown[];
        if (isYieldAtChild(yieldTag)) {
            const stackRet = env.lastStackRet;
            if (stackRet === NodeRetStatus.Running) {
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }
            result = env.selfGet(nodeIns.selfKey, Filter.FilterKey) as unknown[];
        } else {
            result = [];
        }

        for (let i = 0; i < nodeIns.size; ++i) {
            env.set(this.inputKey, input[i]);
            let ret = nodeIns.runChild(env, 0);

            if (ret === NodeRetStatus.Running) {
                env.selfSet(nodeIns.selfKey,
                    Filter.FilterKey,
                    result);
                break;
            } else if (ret === NodeRetStatus.Success) {
                result.push(input[i]);
            }
        }

        env.set(this.outputKey, result);
        return {status: NodeRetStatus.Success};
    }
}
