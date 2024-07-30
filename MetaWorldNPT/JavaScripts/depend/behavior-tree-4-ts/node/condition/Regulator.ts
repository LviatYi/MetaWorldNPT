import { Context } from "../../base/environment/Context";
import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { isNotYield, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";
import Gtk from "gtoolkit";
import { NodeType } from "../../base/enum/NodeType";
import { Environment } from "../../base/environment/Environment";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { RegNodeDef } from "../../base/registry/RegNodeDef";

@RegNodeDef()
export class Regulator extends NodeHolisticDef<Context, NodeIns> {
    public type: Readonly<NodeType> = NodeType.Condition;

    public desc = "频率";

    public doc = `# Regulator

距离上次判真的特定时间内判伪。

- 无子节点。
- 首次调用返回 Success 。距离上次返回 Success 所经过的时长 >=duration 则返回 Success，否则返回 Failure。
- **duration**：间隔时长。`;

    @RegArgDef(NodeArgTypes.String, "变量路径")
    duration: string;

    public behave(nodeIns: NodeIns, env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let valPath = this.key.split(/[.,]/);
        if (valPath.length <= 0) return {status: NodeRetStatus.Failure};

        let o: unknown = env.get(valPath[0]);
        let p: unknown = o;

        for (let i = 1; i < valPath.length; ++i) {
            if (Gtk.isNullOrUndefined(p) || typeof p !== "object") return {status: NodeRetStatus.Failure};

            p = p[valPath[i]];
        }

        if (!Array.isArray(p) || Gtk.isNullOrEmpty(p)) return {status: NodeRetStatus.Failure};

        if (Gtk.isNullOrUndefined(this.value)) {
            env.context.error(() => `value not exists.`);
            return {status: NodeRetStatus.Failure};
        }

        const index = p[valPath[valPath.length - 1]].indexOf(this.value);
        return {status: index >= 0 ? NodeRetStatus.Success : NodeRetStatus.Failure};
    }
}