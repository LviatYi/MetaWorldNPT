import { IArgValueOption } from "../registry/RegArgDef";

/**
 * 节点参数类型.
 */
export enum NodeArgTypes {
    Boolean = "boolean",
    BooleanOpt = "boolean?",
    Int = "int",
    IntOpt = "int?",
    Float = "float",
    FloatOpt = "float?",
    Enum = "enum",
    EnumOpt = "enum?",
    String = "string",
    StringOpt = "string?",
}

// /**
//  * 节点参数类型推断.
//  */
// export type InferNodeArgType<T extends NodeArgTypes> =
//     T extends NodeArgTypes.Boolean ? boolean :
//         T extends NodeArgTypes.Int ? number :
//             T extends NodeArgTypes.Float ? number :
//                 T extends NodeArgTypes.Enum ? string | number :
//                     T extends NodeArgTypes.String ? string :
//                         T extends NodeArgTypes.Json ? string :
//                             T extends NodeArgTypes.Code ? string :
//                                 never;

/**
 * 节点参数定义.
 */
export interface INodeArg {
    /**
     * 名称.
     */
    name: string;

    /**
     * 参数类型.
     */
    type: NodeArgTypes;

    /**
     * 描述.
     */
    desc: string;

    /**
     * 默认值.
     */
    default?: unknown;

    /**
     * 可选项.
     */
    options?:ReadonlyArray<IArgValueOption>;
}