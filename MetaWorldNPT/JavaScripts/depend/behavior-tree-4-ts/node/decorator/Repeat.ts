import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { NodeType } from "../../base/enum/NodeType";
import { Environment } from "../../base/environment/Environment";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { Context } from "../../base/environment/Context";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";

@RegNodeDef()
export class Repeat extends NodeHolisticDef<Context, NodeIns> {
//#region Constant
    /**
     * 重复执行次数键.
     */
    public static readonly RepeatHitPointKey = "__REPEAT_HIT_POINT_KEY__"; // 自定义私有数据键
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Decorator;

    public desc: "重复";

    public doc: `# Repeat

重复地执行子节点。

- 当不存在子节点，返回 Success。
- 当存在子节点返回 Running，返回 Running。
- 当所有执行返回 Success，返回 Success。否则立即返回 Failure。`;

    @RegArgDef(NodeArgTypes.Int, "循环次数", 1)
    public count: number;

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

            if (stackRet === NodeRetStatus.Failure) {
                return {status: NodeRetStatus.Failure};
            }

            ++i;
        } else {
            first = true;
            i = 0;
        }

        let hitPoint = first ?
            this.count :
            env.selfGet(nodeIns.selfKey, Repeat.RepeatHitPointKey) as number;

        while (hitPoint > 0) {
            for (; i < nodeIns.size; ++i) {
                let ret = nodeIns.runChild(env, i);
                if (ret === NodeRetStatus.Failure) {
                    return {status: NodeRetStatus.Failure};
                } else if (ret === NodeRetStatus.Running) {
                    env.selfSet(nodeIns.selfKey, Repeat.RepeatHitPointKey, hitPoint);
                    return {status: NodeRetStatus.Running};
                }
            }
            --hitPoint;
        }

        return {status: NodeRetStatus.Success};
    }
}