import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeType } from "../../base/enum/NodeType";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { Environment } from "../../base/environment/Environment";
import { isYieldAtSelf, NodeIns } from "../../base/node/NodeIns";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";
import Log4Ts from "mw-log4ts/Log4Ts";
import { Context } from "../../base/environment/Context";

@RegNodeDef()
export class WaitForTouch extends NodeHolisticDef<Context, NodeIns> {
//#region Constant
    /**
     * 等待完成键.
     */
    public static readonly WaitForTouchKey = "__WAIT_FOR_TOUCH_KEY__";
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Action;

    public desc: "等待触碰";

    public doc: `# WaitForTouch

等待一定次数。

- 无子节点。
- 等待完成后返回 Success，否则返回 Running。
- waitTime 等待次数. ms
- maxWaitForTouchTime 最长等待时间. ms 若定义，则采用 [waitTime,maxWaitForTouchTime) 范围内的随机值。`;

    @RegArgDef(NodeArgTypes.Float, "等待次数", 0)
    waitTime: number;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {

        const yieldTag = nodeIns.currYieldAt(env);

        if (!isYieldAtSelf(yieldTag)) {
            const hitPoint = this.waitTime;
            Log4Ts.log(WaitForTouch, `${nodeIns.id} touched. last time: ${hitPoint}`);
            if (hitPoint === 0) return {status: NodeRetStatus.Success};

            env.selfSet(nodeIns.selfKey,
                WaitForTouch.WaitForTouchKey,
                hitPoint);
        } else {
            let hitPoint = env.selfGet(nodeIns.selfKey,
                WaitForTouch.WaitForTouchKey) as number;
            --hitPoint;
            Log4Ts.log(WaitForTouch, `${nodeIns.id} touched. last time: ${hitPoint}`);

            if (hitPoint <= 0) return {status: NodeRetStatus.Success};
            env.selfSet(nodeIns.selfKey, WaitForTouch.WaitForTouchKey, hitPoint);
        }

        return {status: NodeRetStatus.Running};
    }
}
