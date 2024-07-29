import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeType } from "../../base/enum/NodeType";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { Environment } from "../../base/environment/Environment";
import { NodeIns } from "../../base/node/NodeIns";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";
import { Context } from "../../base/environment/Context";

@RegNodeDef()
export class Timeout extends NodeHolisticDef<Context, NodeIns> {
//#region Constant
    /**
     * 未完成子节点记录键.
     */
    public static readonly UndoneChildrenKey = "__UNDONE_CHILDREN_KEY__";

    /**
     * 超时键.
     */
    public static readonly TimeoutAtKey = "__TIMEOUT_AT_KEY__";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Decorator;

    public desc = "超时";

    public doc = `# Timeout

超时后退出。

- 至多一个子节点。
- 若不存在子节点，返回 Success。
- 超时前，返回 子节点状态。
- 超时后，中断子节点运行，返回 Failure。

- **timeout 超时时间**：ms`;

    @RegArgDef(NodeArgTypes.Int, "超时时间", 0)
    timeout: number;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        let level = env.size;
        let ret: NodeRetStatus;

        let undoneChildrenRec = env.selfGet(
            nodeIns.selfKey,
            Timeout.UndoneChildrenKey) as NodeIns[];

        if (undoneChildrenRec === undefined) {
            if (nodeIns.size <= 0) return {status: NodeRetStatus.Success};

            env.selfSet(nodeIns.selfKey,
                Timeout.TimeoutAtKey,
                env.context.elapsedTime + this.timeout);

            undoneChildrenRec = [];

            ret = nodeIns.runChild(env, 0, undefined, true);
        } else if (env.context.elapsedTime < (env.selfGet(nodeIns.selfKey,
            Timeout.TimeoutAtKey) as number)) {
            while (undoneChildrenRec.length > 0) {
                const child = undoneChildrenRec.shift();
                undoneChildrenRec.push(child);
                ret = child.run(env);

                if (ret === NodeRetStatus.Running) {
                    let p = 0;
                    while (env.size > level) {
                        undoneChildrenRec.splice(p, 0, env.pop());
                        ++p;
                    }
                    break;
                }
            }
        } else {
            env.selfSet(
                nodeIns.selfKey,
                Timeout.UndoneChildrenKey,
                undefined);

            return {status: NodeRetStatus.Failure};
        }

        switch (ret) {
            case NodeRetStatus.Failure:
            case NodeRetStatus.Success:
                return {status: ret};
            case NodeRetStatus.Running:
                while (env.size > level) {
                    undoneChildrenRec.push(env.pop());
                }

                env.selfSet(
                    nodeIns.selfKey,
                    Timeout.UndoneChildrenKey,
                    undoneChildrenRec);

                return {status: NodeRetStatus.Running};
        }
    }
}
