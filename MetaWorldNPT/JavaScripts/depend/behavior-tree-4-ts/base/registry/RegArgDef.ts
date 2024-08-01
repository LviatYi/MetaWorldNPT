import Gtk from "gtoolkit";
import { INodeArg, NodeArgTypes } from "../node/INodeArg";
import { NodeHolisticDef } from "../node/NodeHolisticDef";

/**
 * 节点参数定义映射.
 * @type {Map<string, INodeArg[]>} node constructor name => INodeArg[]
 */
export const nodeArgDefMap: Map<string, INodeArg[]> = new Map();

/**
 * 参数值选项.
 */
export interface IArgValueOption {
    name: string;
    value: unknown;
}

/**
 * 注册节点参数.
 * @param {NodeArgTypes} type 参数类型.
 * @param {string} desc 描述.
 * @param defaultVal 默认值.
 * @param {{name: string, value: unknown}[]} options 可选项.
 */
export function RegArgDef(type: NodeArgTypes,
                          desc: string,
                          defaultVal?: unknown,
                          options?: ReadonlyArray<IArgValueOption>) {
    return (target: NodeHolisticDef, propertyKey: string) => {
        Gtk.tryGet(nodeArgDefMap, target.constructor.name, [])
            .push({
                name: propertyKey,
                type,
                desc,
                default: defaultVal,
                options,
            });
    };
}