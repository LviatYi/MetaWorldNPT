import { INodeStructDef, IRequiredNodeStructDef } from "./INodeStructDef";
import { NodeType } from "../enum/NodeType";
import { nodeArgDefMap } from "../registry/RegArgDef";
import { Environment } from "../environment/Environment";
import { INodeRetInfo } from "./INodeRetInfo";
import { Context } from "../environment/Context";

/**
 * 节点整体定义 基类.
 * @desc 继承该类以描述新的行为树节点.
 * @desc 对子类使用 @RegNodeDef 装饰器进行反射.
 * @desc 对子类所需参数使用 @RegArgDef 装饰器进行反射.
 */
export abstract class NodeHolisticDef<C extends Context = Context,
    N extends object = object>
    implements IRequiredNodeStructDef {
    public get name(): string {
        return this.constructor.name;
    }

    public abstract type: Readonly<NodeType>;

    public desc: Readonly<string> = "";

    public input: ReadonlyArray<string>;

    public output: ReadonlyArray<string>;

    public doc: Readonly<string> | undefined;

    /**
     * 节点行为定义.
     */
    public abstract behave(nodeIns: N,
                           env: Environment<C, N>,
                           ...input: unknown[]): INodeRetInfo;

    private _defineCache: INodeStructDef | undefined;

    /**
     * 导出 节点结构定义.
     * @return {INodeStructDef}
     */
    public get structDefine(): INodeStructDef {
        if (!this._defineCache) {
            const args = nodeArgDefMap.get(this.name);
            this._defineCache = {
                name: this.name,
                type: this.type,
                desc: this.desc,
                args,
                input: this.input,
                output: this.output,
                doc: this.doc,
            };
        }

        return this._defineCache;
    }

    public query<T extends NodeHolisticDef>(this: T,
                                            nodeInd: N,
                                            key: Exclude<keyof T, keyof NodeHolisticDef>): unknown {
        return (nodeInd as unknown)[key];
    }
}