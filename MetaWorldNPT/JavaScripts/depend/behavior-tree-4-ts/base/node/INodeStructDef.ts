import { NodeType } from "../enum/NodeType";
import { INodeArg } from "./INodeArg";

/**
 * 编码必需的节点结构定义.
 */
export interface IRequiredNodeStructDef {
    /**
     * 名称.
     */
    name: string;

    /**
     * 类型
     */
    type: Readonly<NodeType>;

    /**
     * 描述
     */
    desc: Readonly<string>;

    /**
     * 输入值.
     */
    input: ReadonlyArray<string>;

    /**
     * 输出值.
     */
    output: ReadonlyArray<string>;

    /**
     * 备注
     */
    doc?: Readonly<string>;
}

/**
 * 节点结构定义.
 */
export interface INodeStructDef extends IRequiredNodeStructDef {
    /**
     * 节点常量参数.
     */
    args?: INodeArg[];
}

