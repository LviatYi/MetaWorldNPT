const EMPTY = new Stack(null!);

export class Parallel extends Process {
    override run(node: Node, env: TreeEnv): Status {
        const last = (node.resume(env) as Stack[]) ?? [];
        const level = env.stack.length;
        let count = 0;

        node.children.forEach((child, idx) => {
            let stack = last[idx];
            let status: Status | undefined;
            if (stack === undefined) {
                status = child.run(env);
            } else if (stack.length > 0) {
                for (let i = stack.length - 1; i >= 0; i--) {
                    child = stack.get(i)!;
                    env.stack.push(child);
                    status = child.run(env);
                    if (status === "running") {
                        env.stack.pop(false);
                        break;
                    } else {
                        stack.pop();
                    }
                }
            } else {
                status = "success";
            }

            if (status === "running") {
                if (stack === undefined) {
                    stack = env.stack.take(level, env.stack.length - level);
                }
            } else {
                stack = EMPTY;
                count++;
            }

            last[idx] = stack;
        });

        if (count === node.children.length) {
            return "success";
        } else {
            return node.yield(env, last);
        }
    }
}

import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeType } from "../../base/enum/NodeType";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { Environment } from "../../base/environment/Environment";
import { isYieldAtChild, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";

@RegNodeDef()
export class Parallel extends NodeHolisticDef<NodeIns> {
    public type = NodeType.Composite;

    public desc: "并行执行";

    public doc: `# Parallel

并行执行所有子节点。

- 当任一节点返回 Running，返回 Running。否则返回 Success。`;

    public behave(nodeIns: NodeIns,
                  env: Environment<NodeIns>): INodeRetInfo {

        const yieldTag = nodeIns.currYieldAt(env);
        let stackRet: NodeRetStatus = env.lastStackRet;
        if (isYieldAtChild(yieldTag)) {
            if (stackRet === NodeRetStatus.Running) {

                logEUnexpectState(nodeIns, stackRet);
                throw UNEXPECT_ERROR;
            }

            if (yieldTag === 0) {
                switch (stackRet) {
                    case NodeRetStatus.Success:
                        return {status: nodeIns.runChild(env, 1)};
                    case NodeRetStatus.Fail:
                        return {status: nodeIns.runChild(env, 2)};
                }
            } else return {status: stackRet};
        }

        let ret = nodeIns.runChild(env, 0);
        switch (ret) {

            case NodeRetStatus.Success:
                return {status: nodeIns.runChild(env, 1)};
            case NodeRetStatus.Fail:
                return {status: nodeIns.runChild(env, 2)};
            case NodeRetStatus.Running:
                return {status: NodeRetStatus.Running};
        }
    }
}

