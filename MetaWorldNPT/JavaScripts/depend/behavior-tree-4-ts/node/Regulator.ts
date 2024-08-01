import { Context } from "../base/environment/Context";
import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { isNotYield, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../base/node/NodeIns";
import { RegArgDef } from "../base/registry/RegArgDef";
import { NodeArgTypes } from "../base/node/INodeArg";
import Gtk from "gtoolkit";
import { NodeType } from "../base/enum/NodeType";
import { Environment } from "../base/environment/Environment";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { RegNodeDef } from "../base/registry/RegNodeDef";

@RegNodeDef()
export class Regulator extends NodeHolisticDef<Context, NodeIns> {
//#region Constant
    public static readonly LastSuccessKey = "__LAST_SUCCESS_KEY__";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type: Readonly<NodeType> = NodeType.Decorator;

    public desc = "频率";

    public doc = `# Regulator

距离上次判真的特定时间内判伪。

- 无子节点。
- 首次调用返回 Success 。距离上次返回 Success 所经过的时长 >=duration 则返回 Success，否则返回 Failure。
- **duration 间隔时长**：ms`;

    @RegArgDef(NodeArgTypes.Int, "间隔时长 ms", 1e3)
    duration: number;

    public behave(nodeIns: NodeIns, env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let lastSuccessAt = env.selfGet(nodeIns.selfKey,
            Regulator.LastSuccessKey) as number | undefined;
        if (Gtk.isNullOrUndefined(lastSuccessAt) ||
            env.context.elapsedTime >= lastSuccessAt + this.duration) {
            env.selfSet(nodeIns.selfKey,
                Regulator.LastSuccessKey,
                env.context.elapsedTime);
            env.context.log(`${this.name}: Ok.`);
            return {status: NodeRetStatus.Success};
        } else {
            env.context.log(`${this.name}: Skip.`);
            return {status: NodeRetStatus.Failure};
        }
    }
}