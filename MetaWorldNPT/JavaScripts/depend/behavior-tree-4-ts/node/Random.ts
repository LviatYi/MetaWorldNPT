import { RegNodeDef } from "../base/registry/RegNodeDef";
import { NodeType } from "../base/enum/NodeType";
import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../base/node/NodeIns";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { Environment } from "../base/environment/Environment";
import { Context } from "../base/environment/Context";
import { RegArgDef } from "../base/registry/RegArgDef";
import { NodeArgTypes } from "../base/node/INodeArg";
import Gtk from "gtoolkit";

@RegNodeDef()
export class Random extends NodeHolisticDef<Context, NodeIns> {
    public type = NodeType.Composite;

    public desc = "随机执行";

    public doc = `# Random

随机执行一个子节点。

- 返回子节点状态。

- **weight 权重**: 以 \`,\`隔开的数组，值为数字。未定义的元素权重为 1。`;

    @RegArgDef(NodeArgTypes.StringOpt, "权重", "")
    public weight: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        let yieldTag = nodeIns.currYieldAt(env);
        if (isYieldAtChild(yieldTag)) {
            let stackRet: NodeRetStatus = env.lastStackRet;
            if (stackRet === NodeRetStatus.Running) {
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }

            return {status: stackRet};
        }

        let w = (this.weight?.split(/[,.，。|]/) ?? [])
            .map(x => {
                const v = Number(x);
                return Number.isNaN(v) ? 1 : v;
            });

        w = w.concat(new Array(Math.max(0, nodeIns.size - w.length)).fill(1));
        let r = Gtk.randomWeight(w);

        let ret = nodeIns.runChild(env, r);
        if (ret === NodeRetStatus.Success) {
            return {status: NodeRetStatus.Success};
        } else if (ret === NodeRetStatus.Running) {
            return {status: NodeRetStatus.Running};
        }

        return {status: NodeRetStatus.Failure};
    }
}
