import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeType } from "../../base/enum/NodeType";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { Environment } from "../../base/environment/Environment";
import { NodeIns } from "../../base/node/NodeIns";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { Context } from "../../base/environment/Context";

/**
 * Parallel.
 * @desc **示范性节点 05** 自定义栈管理.
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
export class Parallel extends NodeHolisticDef<Context, NodeIns> {
//#region Constant
    /**
     * 未完成子节点记录键.
     */
    public static readonly UndoneChildrenKey = "__UNDONE_CHILDREN_KEY__"; // 自定义私有数据键
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

    public type = NodeType.Composite; // 组合节点

    public desc: "并行执行"; // 简单描述

    public doc: `# Parallel

并行执行所有子节点。

- 当任一节点返回 Running，返回 Running。否则返回 Success。`;// doc 支持 Markdown。
    // 示范性节点将采用如下格式：
    //
    // # 节点名称
    //
    // 详细描述（描述节点的功能）
    //
    // - 附加信息（描述节点的要求与返回值等信息）

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        // 代码逻辑上首先应考虑节点是否已处于运行状态。
        // 但该节点要求并行执行，这意味着与 BT4Ts 的默认行为不同。
        // 具有默认栈管理行为的 BT4Ts ，内部不会同时出现超过两个不具垂直路径关系的节点处于 Running 状态。
        // 因此，该节点的并行执行需要自定义栈管理。
        let level = env.size; // 记录当前栈层 超出此层的节点即由该节点引发的子节点，需要另外处理。
        let hitPoint = nodeIns.size;
        let firstTouch = false;

        // 通过私有数据 定义未完成子节点记录。
        let undoneChildrenRec = env.selfGet(
            nodeIns.selfKey,
            Parallel.UndoneChildrenKey) as NodeIns[][];

        if (undoneChildrenRec === undefined) {
            firstTouch = true;
            undoneChildrenRec = Array.from({length: nodeIns.size}, () => []);
        }

        for (let i = 0; i < nodeIns.size; ++i) {
            let ret: NodeRetStatus;
            if (firstTouch) {
                ret = nodeIns.runChild(env, i, undefined, true);
            } else if (undoneChildrenRec[i].length > 0) {
                while (undoneChildrenRec[i].length > 0) {
                    const child = undoneChildrenRec[i].shift()!;
                    // BT4Ts 的栈管理机制要求，将要运行的节点必须在 BT4Ts 的栈顶。
                    // 由于子结点不受 BT4Ts 的栈所管理，因此需要手动推入栈。
                    env.push(child);
                    ret = child.run(env);

                    if (ret === NodeRetStatus.Running) {
                        // 谨慎对待 run 对 env 的栈的副作用。
                        let p = 0;
                        while (env.size > level) {
                            undoneChildrenRec[i].splice(p, 0, env.pop());
                            ++p;
                        }
                        break;
                    }
                }
            } else {
                ret = NodeRetStatus.Success;
            }

            if (ret === NodeRetStatus.Running) {
                // 正在运行的子节点需从 BT4Ts 栈中弹出，因为它的运行将直接受此节点管理。
                while (env.size > level) {
                    undoneChildrenRec[i].push(env.pop());
                }
            } else {
                --hitPoint;
            }
        }

        if (hitPoint === 0) {
            // 设置私有数据。
            env.selfSet(nodeIns.selfKey, Parallel.UndoneChildrenKey, undefined);
            return {status: NodeRetStatus.Success};
        } else {
            env.selfSet(nodeIns.selfKey, Parallel.UndoneChildrenKey, undoneChildrenRec);
            return {status: NodeRetStatus.Running};
        }
    }
}

