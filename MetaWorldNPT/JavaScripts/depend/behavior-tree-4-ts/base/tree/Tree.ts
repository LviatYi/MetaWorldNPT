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

    public env: Environment<NodeIns>;

    constructor(treeData: ITreeData, envVariables?: P) {
        this._data = treeData;
        this.root = new NodeIns(treeData.root);
        this.env = new Environment(envVariables);
    }

    run(): void {
        if (this.env.empty()) {
            this.root.run(this.env);
        } else {
            let lastNode = this.env.last();
            while (lastNode) {
                const ret = lastNode.run(this.env);
                if (ret === NodeRetStatus.Running) {
                    break;
                }
                lastNode = this.env.last();
            }
        }

        ++this.tick;
    }

    interrupt(): void {
        this.env.clear();
    }
}