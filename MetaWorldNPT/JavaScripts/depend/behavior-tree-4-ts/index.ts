import { ITreeData } from "./base/tree/ITreeData";
import { checkNodeDefined, logENodeNotDefined, NodeIns } from "./base/node/NodeIns";
import { Environment } from "./base/environment/Environment";
import { NodeRetStatus } from "./base/node/NodeRetStatus";
import Log4Ts from "mw-log4ts/Log4Ts";
import { Context, ContextUpdateParams } from "./base/environment/Context";

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
export * from "./node/composite/IfElse";
export * from "./node/composite/Parallel";
export * from "./node/composite/Selector";
export * from "./node/composite/Sequence";
export * from "./node/action/Assign";
export * from "./node/action/Log";
export * from "./node/action/Wait";
export * from "./node/decorator/AlwaysFailure";
export * from "./node/decorator/AlwaysSuccess";
export * from "./node/decorator/Filter";
export * from "./node/decorator/Foreach";
export * from "./node/decorator/Invert";
export * from "./node/decorator/Once";
export * from "./node/decorator/Repeat";
export * from "./node/decorator/RepeatUntil";
export * from "./node/decorator/Timeout";

export default class BehaviorTree<C extends Context = Context> {
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
        this._data = treeData;
        Log4Ts.log(BehaviorTree, `load tree: ${this.name}`);
        if (checkNodeDefined(treeData.root.name)) {
            this.root = new NodeIns(treeData.root);
        } else {
            logENodeNotDefined(treeData.root.name);
        }
        this.env = new Environment((context ?? new Context()) as C);
    }

    /**
     * 执行行为树.
     */
    public run(): void {
        Log4Ts.log(BehaviorTree, `current tick: ${this.tick}`);
        if (this.env.empty()) {
            this.root?.run(this.env);
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

    /**
     * 中断重置行为树.
     */
    public interrupt(): void {
        this.env.clear();
    }

    /**
     * 更新 Context 的上下文信息.
     * @param params inferred by ContextUpdateParams<C>.
     */
    public updateContext<C extends Context>(...params: ContextUpdateParams<C>): void {
        this.env.updateContext(...params);
    }
}