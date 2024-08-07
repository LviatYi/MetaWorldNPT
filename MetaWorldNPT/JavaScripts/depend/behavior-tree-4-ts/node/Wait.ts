import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { RegNodeDef } from "../base/registry/RegNodeDef";
import { NodeType } from "../base/enum/NodeType";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { Environment } from "../base/environment/Environment";
import { isNotYield, isYieldAtSelf, NodeIns } from "../base/node/NodeIns";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { RegArgDef } from "../base/registry/RegArgDef";
import { NodeArgTypes } from "../base/node/INodeArg";
import { Context } from "../base/environment/Context";

/**
 * Wait.
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
export class Wait extends NodeHolisticDef<Context, NodeIns> {
//#region Constant
    /**
     * 等待完成键.
     */
    public static readonly WaitTimeoutAtKey = "__WAIT_TIMEOUT_AT_KEY__"; // 自定义私有数据键
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Action; // 行为节点

    public desc = "等待"; // 简单描述

    public doc = `# Wait

等待一段时间。

- 顺序执行。
- 等待完成前，返回 Running。
- 等待完成后，若不存在子节点，则返回 Success，否则返回子节点状态。

- **waitTime 最短等待时间**：ms
- **maxWaitTime 最长等待时间**：ms 若定义，则采用 [waitTime,maxWaitTime) 范围内的随机值。`;// doc 支持 Markdown。
    // 示范性节点将采用如下格式：
    //
    // # 节点名称
    //
    // 详细描述（描述节点的功能）
    //
    // - 附加信息（描述节点的要求与返回值等信息）

    @RegArgDef(NodeArgTypes.Int, "最小等待时间 ms", 0)
    waitTime: number; // 定义节点常量
    // BT4Ts 的功能依赖反射，因此需要进行注册
    // 支持类型、描述、默认值及额外选项

    @RegArgDef(NodeArgTypes.IntOpt, "最大等待时间 ms")
    maxWaitTime: number;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        // 代码逻辑上首先应考虑节点是否已处于运行状态。
        // 但设计时建议先考虑节点未处于运行状态的情况。
        const yieldTag = nodeIns.currYieldAt(env);

        if (isNotYield(yieldTag)) {
            // 设计时建议先考虑节点未处于运行状态的情况，即先写以下部分。
            // 使用节点常量时，可以直接通过 this 访问。
            // 但这不意味着 Define 的状态为节点所拥有，相反地，仅为「借用」关系。
            // 仅在节点运行前，Define 中的常量字段由 BT4Ts 填入。
            const waitTime = (this.maxWaitTime && this.maxWaitTime > this.waitTime ?
                Math.random() * (this.maxWaitTime - this.waitTime) + this.waitTime :
                this.waitTime);
            if (waitTime === 0) {
                env.selfSet(nodeIns.selfKey, Wait.WaitTimeoutAtKey, undefined);
                return {
                    status: nodeIns.runChild(env, 0),
                };
            }

            env.selfSet(nodeIns.selfKey,
                Wait.WaitTimeoutAtKey,
                env.context.elapsedTime + waitTime);

            return {status: NodeRetStatus.Running};
        }
        if (env.context.elapsedTime < (env.selfGet(nodeIns.selfKey,
            Wait.WaitTimeoutAtKey) as number)) {

            return {status: NodeRetStatus.Running};
        }

        let i = isYieldAtSelf(yieldTag) ? 0 : yieldTag;

        for (; i < nodeIns.size; ++i) {
            let ret = nodeIns.runChild(env, i);
            switch (ret) {
                case NodeRetStatus.Failure:
                case NodeRetStatus.Running:
                    return {status: ret};
                case NodeRetStatus.Success:
                    break;
            }
        }

        return {status: NodeRetStatus.Success};
    }
}
