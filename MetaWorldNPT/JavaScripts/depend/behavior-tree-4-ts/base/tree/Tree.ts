import { ITreeData } from "./ITreeData";
import { NodeIns } from "../node/NodeIns";
import { Environment } from "../environment/Environment";
import { NodeRetStatus } from "../node/NodeRetStatus";

export class BehaviorTree<P extends object | undefined = undefined> {
    private _data: ITreeData;

    public get name(): string {
        return this._data.name;
    }

    public get desc(): string {
        return this._data.desc;
    }

    public tick: number = 0;

    public root: NodeIns;

    public env: Environment<P>;

    constructor(treeData: ITreeData, envVariables?: P) {
        this._data = treeData;
        this.root = new NodeIns(treeData.root);
        this.env = new Environment(envVariables);
    }

    run(env: Environment<NodeIns>): void {
        if (env.empty()) {
            this.root.run(env);
        } else {
            let lastNode = env.last();
            while (lastNode) {
                const ret = lastNode.run(env);
                if (ret.status === NodeRetStatus.Running) {
                    break;
                }
                lastNode = env.last();
            }
        }

        ++this.tick;
    }

    interrupt(env: Environment): void {
        env.clear();
    }
}

export interface BehaviorTreeInstance {
    tree: BehaviorTree;
    env: Environment;
    run: () => void;
    interrupt: () => void;
    is_running: () => boolean;
    set_env: (k: string, v: any) => void;
}

