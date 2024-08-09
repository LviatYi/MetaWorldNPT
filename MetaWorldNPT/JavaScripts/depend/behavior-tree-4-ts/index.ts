import { ITreeData } from "./base/tree/ITreeData";
import { checkNodeDefined, logENodeNotDefined, NodeIns } from "./base/node/NodeIns";
import { Environment } from "./base/environment/Environment";
import { NodeRetStatus } from "./base/node/NodeRetStatus";
import { Context, ContextUpdateParams } from "./base/environment/Context";
import { INodeData } from "./base/node/INodeData";

export * from "./base/tree/ITreeData";
export * from "./base/registry/RegArgDef";
export * from "./base/registry/RegNodeDef";
export * from "./base/node/INodeArg";
export * from "./base/node/INodeData";
export * from "./base/node/INodeIns";
export * from "./base/node/INodeRetInfo";
export * from "./base/node/INodeStructDef";
export * from "./base/node/NodeHolisticDef";
export * from "./base/node/NodeIns";
export * from "./base/node/NodeRetStatus";
export * from "./base/environment/Context";
export * from "./base/environment/Environment";
export * from "./base/enum/NodeType";
export * from "./node/AlwaysFailure";
export * from "./node/AlwaysSuccess";
export * from "./node/Assign";
export * from "./node/Compare";
export * from "./node/Defined";
export * from "./node/Erase";
export * from "./node/Expression";
export * from "./node/Filter";
export * from "./node/Foreach";
export * from "./node/IfElse";
export * from "./node/IfValIs";
export * from "./node/Include";
export * from "./node/Invert";
export * from "./node/Log";
export * from "./node/Max";
export * from "./node/Min";
export * from "./node/Once";
export * from "./node/Parallel";
export * from "./node/Random";
export * from "./node/Regulator";
export * from "./node/Repeat";
export * from "./node/RepeatUntil";
export * from "./node/Selector";
export * from "./node/Sequence";
export * from "./node/Timeout";
export * from "./node/Wait";
export * from "./node/Write";

export default class BehaviorTree<C extends Context = Context> {
    public static logName = "B.T.";

    private _data: ITreeData;

    public get name(): string {
        return this._data.name;
    }

    public get desc(): string {
        return this._data.desc;
    }

    public tick: number = 0;

    public root: NodeIns<C>;

    public env: Environment<C, NodeIns<C>>;

    public constructor(treeData: ITreeData, context?: C | undefined) {
        context = context ?? new Context() as C;

        NodeIns.log = (...p) => context.innerLog("inner-node", ...p);
        NodeIns.warn = (...p) => context.innerWarn("inner-node", ...p);
        NodeIns.error = (...p) => context.innerError("inner-node", ...p);

        this._data = treeData;
        this.env = new Environment(context);
        this.env.context.innerLog(
            "tree",
            `+++++ L O A D ++++++++++++++++++++++++++++++++++++++++++++++`,
            `tree: ${this.name}.`,
            `override id? ${this.env.context.overrideId}`);

        if (this.env.context.overrideId) this.dfsOverrideId(this._data.root);
        if (checkNodeDefined(treeData.root.name)) {
            this.root = new NodeIns(treeData.root);
        } else {
            logENodeNotDefined(treeData.root.name);
        }
    }

    /**
     * 执行行为树.
     */
    public run(): void {
        if (this.env.empty()) {
            this.env.context.innerLog(
                "tree",
                `===== R E R U N ============================================`,
                `current tick: ${this.tick}`);
            this.root?.run(this.env);
        } else {
            let lastNode = this.env.last();
            while (lastNode) {
                this.env.context.innerLog(
                    "tree",
                    `----- C O N T I N U E --------------------------------------`,
                    `current tick: ${this.tick}`,
                    `continue id: ${lastNode.id}`);
                const ret = lastNode.run(this.env);
                if (ret === NodeRetStatus.Running) break;
                lastNode = this.env.last();
            }
        }

        ++this.tick;
    }

    /**
     * 中断重置行为树.
     */
    public interrupt(): void {
        this.env.context.innerLog(
            "tree",
            `${BehaviorTree.logName} xxxxx I N T E R R U P T xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`,
            `current tick: ${this.tick}`);
        this.env.clear();
    }

    /**
     * 更新 Context 的上下文信息.
     * @param params inferred by ContextUpdateParams<C>.
     */
    public updateContext<C extends Context>(...params: ContextUpdateParams<C>): this {
        this.env.updateContext(...params);

        return this;
    }

    private dfsOverrideId(d: INodeData, id: number = 0): number {
        d.id = ++id;
        for (let i = 0; i < d?.children?.length ?? 0; ++i) {
            id = this.dfsOverrideId(d.children[i], id);
        }

        return id;
    }
}