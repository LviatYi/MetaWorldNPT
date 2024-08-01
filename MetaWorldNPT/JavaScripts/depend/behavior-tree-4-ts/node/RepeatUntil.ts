import { RegNodeDef } from "../base/registry/RegNodeDef";
import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../base/node/NodeIns";
import { NodeType } from "../base/enum/NodeType";
import { Environment } from "../base/environment/Environment";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { Context } from "../base/environment/Context";
import { RegArgDef } from "../base/registry/RegArgDef";
import { NodeArgTypes } from "../base/node/INodeArg";

@RegNodeDef()
export class RepeatUtil extends NodeHolisticDef<Context, NodeIns> {
//#region Constant
    /**
     * 重复执行次数键.
     */
    public static readonly RepeatHitPointKey = "__REPEAT_HIT_POINT_KEY__"; // 自定义私有数据键
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Decorator;

    public desc = "重复直到";

    public doc = `# RepeatUtil

重复地执行子节点，直到任一子节点返回与结束态一致的状态。

- 当不存在子节点，断言子节点返回 Success，从而根据该断言判断返回。
- 当存在子节点返回 Running，返回 Running。
- 当所有执行返回 Success，断言 Success。否则立即断言 Failure，然后根据断言判断返回。
- 当断言与结束态一致时，返回 Success。否则返回 Failure。

- **limit 循环上限**： -1 时无上限。当上限不为 -1 且达到上限仍未返回，则返回 Failure。
- **untilStatue 结束态**：当达到该值时结束循环。true 表示 Success，false 表示 Failure。`;

    @RegArgDef(NodeArgTypes.Int, "循环上限", 10)
    public limit: number;

    @RegArgDef(NodeArgTypes.Boolean, "结束态", true)
    public untilStatue: boolean;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        let i = nodeIns.currYieldAt(env);
        let first: boolean = false;
        if (isYieldAtChild(i)) {
            let stackRet: NodeRetStatus = env.lastStackRet;
            if (stackRet === NodeRetStatus.Running) {
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }

            if (stackRet === NodeRetStatus.Failure &&
                !this.untilStatue) {
                return {status: NodeRetStatus.Success};
            }

            ++i;
        } else {
            first = true;
            i = 0;
        }

        let hitPoint = first ?
            this.limit :
            env.selfGet(nodeIns.selfKey, RepeatUtil.RepeatHitPointKey) as number;

        for (; i < nodeIns.size; ++i) {
            let ret = nodeIns.runChild(env, i);

            if (ret === NodeRetStatus.Failure) {
                if (!this.untilStatue) {
                    return {status: NodeRetStatus.Success};
                }
            } else if (ret === NodeRetStatus.Running) {
                env.selfSet(nodeIns.selfKey, RepeatUtil.RepeatHitPointKey, hitPoint);
                return {status: NodeRetStatus.Running};
            }
        }

        if (this.untilStatue) {
            return {status: NodeRetStatus.Success};
        }
        hitPoint !== -1 && --hitPoint;

        if (hitPoint !== -1 && hitPoint < 0) {
            return {status: NodeRetStatus.Failure};
        }

        return {status: NodeRetStatus.Running};
    }
}