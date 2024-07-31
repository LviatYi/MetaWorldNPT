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
    public static readonly FilterKey = "__FILTER_KEY__";

    /**
     * 失败筛选键.
     */
    public static readonly FailureFilterKey = "__FAILURE_FILTER_KEY__";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Decorator;

    public desc = "筛选";

    public doc = `# Filter

筛选一个数组。

- 至多 1 个节点。
- 若输入数组未定义，返回 Failure。
- 若不存在子节点，断言返回 Failure，否则断言返回子节点状态。
- 当断言为 Running，返回 Running。
- 当断言为 Success，将该元素填入返回值。
- 否则，若定义了 outputKey ，将该元素填入返回值，否则跳过。
- 返回 Success。

- **inputKey 输入参数名**：应指向一个数组。
- **keyForJudge 待判断参数名（元素）**：输出一个元素，提供给子节点以判断。
- **outputKey 输出参数名**：输出一个数组。
- **outputFalseKey 输出失败参数名**：输出一个数组。`;

    @RegArgDef(NodeArgTypes.String, "输入参数名（数组）", "InputArray")
    public inputKey: string;

    @RegArgDef(NodeArgTypes.String, "待判断参数名（元素）", "__JUDGE_ITEM__")
    public keyForJudge: string;

    @RegArgDef(NodeArgTypes.String, "输出参数名（数组）", "OutputArray")
    public outputKey: string;

    @RegArgDef(NodeArgTypes.StringOpt, "输出 false 参数名（数组）", "")
    public outputFalseKey: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const input = env.get(this.inputKey) as unknown[];
        if (Gtk.isNullOrUndefined(input) || !Array.isArray(input)) {
            return {status: NodeRetStatus.Failure};
        }

        let yieldTag = nodeIns.currYieldAt(env);
        let result: unknown[];
        let failureResult: unknown[];
        if (isYieldAtChild(yieldTag)) {
            const stackRet = env.lastStackRet;
            if (stackRet === NodeRetStatus.Running) {
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }
            result = env.selfGet(nodeIns.selfKey, Filter.FilterKey) as unknown[];
            failureResult = env.selfGet(nodeIns.selfKey, Filter.FailureFilterKey) as unknown[];
        } else {
            result = [];
            failureResult = [];
        }

        for (let i = 0; i < nodeIns.size; ++i) {
            env.set(this.keyForJudge, input[i]);
            let ret = nodeIns.runChild(env, 0);

            if (ret === NodeRetStatus.Running) {
                env.selfSet(nodeIns.selfKey,
                    Filter.FilterKey,
                    result);
                env.selfSet(nodeIns.selfKey,
                    Filter.FailureFilterKey,
                    failureResult);
                break;
            } else if (ret === NodeRetStatus.Success) {
                result.push(input[i]);
            } else {
                failureResult.push(input[i]);
            }
        }

        env.set(this.outputKey, result);
        if (!Gtk.isNullOrEmpty(this.outputFalseKey)) {
            env.set(this.outputFalseKey, failureResult);
        }
        env.set(this.keyForJudge, undefined);

        return {status: NodeRetStatus.Success};
    }
}
