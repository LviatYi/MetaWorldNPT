import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../base/node/NodeIns";
import { Context } from "../base/environment/Context";
import { NodeType } from "../base/enum/NodeType";
import { Environment } from "../base/environment/Environment";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { RegNodeDef } from "../base/registry/RegNodeDef";
import Gtk from "gtoolkit";
import { RegArgDef } from "../base/registry/RegArgDef";
import { NodeArgTypes } from "../base/node/INodeArg";

@RegNodeDef()
export class Foreach extends NodeHolisticDef<Context, NodeIns> {
//#region Constant
    /**
     * 遍历键.
     */
    public static readonly ForeachKey = "__FOREACH_KEY__"; // 自定义私有数据键
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Action;

    public desc = "遍历";

    public doc = `# Foreach

遍历一个数组，将元素作为参数执行子节点。  
子节点不应改动数组。  

- 顺序执行。
- 若输入未定义，返回 Failure。若输入为空数组或不存在子节点，返回 Success。
- 当存在子节点返回 Running，返回 Running。
- 当所有执行返回 Success，返回 Success。否则立即返回 Failure。

- **inputKey 输入参数名**：应指向一个数组。
- **outputKey 输出参数名**：指向一个元素。`;

    @RegArgDef(NodeArgTypes.String, "输入参数名（数组）", "__INPUT_ARRAY__")
    public inputKey: string;

    @RegArgDef(NodeArgTypes.String, "输出参数名（元素）", "__OUTPUT_ITEM__")
    public outputKey: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const input = env.get(this.inputKey) as unknown[];
        if (Gtk.isNullOrUndefined(input) || !Array.isArray(input)) {
            return {status: NodeRetStatus.Failure};
        }

        if (input.length === 0) {
            return {status: NodeRetStatus.Success};
        }

        let hitPoint: number;
        let i = nodeIns.currYieldAt(env);

        if (isYieldAtChild(i)) {
            const stackRet = env.lastStackRet;
            if (stackRet === NodeRetStatus.Running) {
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }

            ++i;
            hitPoint = env.selfGet(nodeIns.selfKey, Foreach.ForeachKey) as number;
        } else {
            i = 0;
            hitPoint = input.length;
        }

        let proc = input.length - hitPoint;
        if (proc < 0) {
            return {status: NodeRetStatus.Failure};
        }
        let running = false;
        while (hitPoint > 0) {
            env.set(this.outputKey, input[proc]);
            for (; i < nodeIns.size; ++i) {
                let ret = nodeIns.runChild(env, i);

                if (ret === NodeRetStatus.Running) {
                    running = true;
                    break;
                } else if (ret === NodeRetStatus.Failure) {
                    return {status: NodeRetStatus.Failure};
                }
            }
            env.set(this.outputKey, undefined);

            --hitPoint;
        }

        if (running) {
            env.selfSet(nodeIns.selfKey,
                Foreach.ForeachKey,
                hitPoint);
            return {status: NodeRetStatus.Running};
        }

        return {status: NodeRetStatus.Success};
    }
}
