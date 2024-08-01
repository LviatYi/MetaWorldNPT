import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../base/node/NodeIns";
import { Context } from "../base/environment/Context";
import { NodeType } from "../base/enum/NodeType";
import { Environment } from "../base/environment/Environment";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { RegNodeDef } from "../base/registry/RegNodeDef";

@RegNodeDef()
export class Once extends NodeHolisticDef<Context, NodeIns> {
//#region Constant
    /**
     * 单次执行完成键.
     */
    public static readonly OnceKey = "__ONCE_KEY__"; // 自定义私有数据键
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Decorator;

    public desc = "单次";

    public doc = `# Once

当次运行环境中，单次执行子节点。

- 顺序执行。
- 单次执行时，若存在子节点，子节点 Running 时返回 Running，否则返回 Success。
- 单次执行后，返回 Failure，且不再执行子节点。`;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        let done = env.selfGet(nodeIns.selfKey,
            Once.OnceKey) as boolean;

        if (done) return {status: NodeRetStatus.Failure};

        let i = nodeIns.currYieldAt(env);

        if (isYieldAtChild(i)) {
            const stackRet = env.lastStackRet;
            if (stackRet === NodeRetStatus.Running) {
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }

            ++i;
        } else {
            i = 0;
        }

        done = nodeIns.size <= 0;
        if (!done) {
            for (; i < nodeIns.size; ++i) {
                let ret = nodeIns.runChild(env, i);
                if (ret === NodeRetStatus.Running) break;
            }

            done = true;
        }

        if (done) {
            env.selfSet(nodeIns.selfKey,
                Once.OnceKey,
                true);
            return {status: NodeRetStatus.Success};
        }

        return {status: NodeRetStatus.Running};
    }
}
