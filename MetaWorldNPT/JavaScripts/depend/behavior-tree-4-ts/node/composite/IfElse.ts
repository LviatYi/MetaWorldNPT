import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeType } from "../../base/enum/NodeType";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { Environment } from "../../base/environment/Environment";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";

/**
 * If Else.
 * @desc **示范性节点**
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
export class IfElse extends NodeHolisticDef<NodeIns> {
    public type = NodeType.Composite; // 组合节点

    public desc: "条件执行"; // 简单描述

    public doc: `# If Else

当第一个节点返回\`Success\`时执行第 2 个节点（若存在），当返回\`Fail\`时执行第 3 个节点（若存在）。

- 至少有 1 个子节点，最多有 3 个子节点，分别代表条件节点 *1、执行节点 *2。
- 当执行节点不存在时，返回 Success。否则返回执行节点返回值。`;// doc 支持 Markdown.
    // 示范性节点将采用如下格式：
    //
    // # 节点名称
    //
    // 详细描述（描述节点的功能）
    //
    // - 附加信息（描述节点的要求与返回值等信息）

    public behave(nodeIns: NodeIns,
                  env: Environment<NodeIns>): INodeRetInfo {
        // 代码逻辑上首先应考虑节点是否已处于运行状态。
        // 但设计时建议先考虑节点未处于运行状态的情况。
        const yieldTag = nodeIns.currYieldAt(env);
        let stackRet: NodeRetStatus = env.lastStackRet;
        if (isYieldAtChild(yieldTag)) {
            if (stackRet === NodeRetStatus.Running) {
                // 如果进入节点时，该节点处于子节点 Yield 态，而上次栈帧的运行结果为 Running，这在 BT4Ts 是不应该出现的。
                // 只有子节点退出了 Yield 态，父节点才能继续执行。
                // 抛出错误时，应首先考虑使用可复用的函数与对象。
                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }

            // 当 yieldTag 为数字时，表示上次进入了以 yieldTag 为索引的子节点。
            // 内部的逻辑处理。根据节点功能各有不同。
            // 由于该节点自身不可能等待运行，因此不需要考虑 yieldTag 为 true 的情况。
            if (yieldTag === 0) {
                switch (stackRet) {
                    case NodeRetStatus.Success:
                        return {status: nodeIns.runChild(env, 1)};
                    case NodeRetStatus.Fail:
                        return {status: nodeIns.runChild(env, 2)};
                }
            } else return {status: stackRet};
        }

        // 设计时建议先考虑节点未处于运行状态的情况，即先写以下部分。
        let ret = nodeIns.runChild(env, 0);
        switch (ret) {
            // runChild 将自动设置 Yield 状态至子节点 Yield 态，无需手动设置。
            // 内部的逻辑处理。根据节点功能各有不同。
            // 可以看出，该节点自身不可能等待运行，因为只有三种情况：
            // 前两种将设置子节点 Yield 态。第三种则直接返回。
            case NodeRetStatus.Success:
                return {status: nodeIns.runChild(env, 1)};
            case NodeRetStatus.Fail:
                return {status: nodeIns.runChild(env, 2)};
            case NodeRetStatus.Running:
                return {status: NodeRetStatus.Running};
        }
    }
}
