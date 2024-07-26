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

/**
 * WaitForTouch.
 * @desc **示范性节点 02** 节点常量.
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 * @author LviatYi
 * @font JetBrainsMono Nerd Font Mono https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/JetBrainsMono.zip
 * @fallbackFont Sarasa Mono SC https://github.com/be5invis/Sarasa-Gothic/releases/download/v0.41.6/sarasa-gothic-ttf-0.41.6.7z
 */
@RegNodeDef() // BT4Ts 的功能依赖反射，因此需要进行注册
export class WaitForTouch extends NodeHolisticDef<NodeIns> {
//#region Constant
    /**
     * 等待完成键.
     */
    public static readonly WaitForTouchKey = "__WAIT_FOR_TOUCH_KEY__"; // 自定义私有数据键
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Action; // 行为节点

    public desc: "等待触碰"; // 简单描述

    public doc: `# WaitForTouch

等待一定次数。

- 无子节点。
- 等待完成后返回 Success，否则返回 Running。
- waitTime 最短等待时间. ms
- maxWaitForTouchTime 最长等待时间. ms 若定义，则采用 [waitTime,maxWaitForTouchTime) 范围内的随机值。`;// doc 支持 Markdown。
    // 示范性节点将采用如下格式：
    //
    // # 节点名称
    //
    // 详细描述（描述节点的功能）
    //
    // - 附加信息（描述节点的要求与返回值等信息）

    @RegArgDef(NodeArgTypes.Float, "最小等待时间", 0)
    waitTime: number; // 定义节点常量
    // BT4Ts 的功能依赖反射，因此需要进行注册
    // 支持类型、描述、默认值及额外选项

    public behave(nodeIns: NodeIns,
                  env: Environment<NodeIns>): INodeRetInfo {
        // 代码逻辑上首先应考虑节点是否已处于运行状态。
        // 但设计时建议先考虑节点未处于运行状态的情况。
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
