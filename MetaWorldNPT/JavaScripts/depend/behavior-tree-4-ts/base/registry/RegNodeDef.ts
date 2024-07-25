import { NodeHolisticDef } from "../node/NodeHolisticDef";
import Log4Ts from "mw-log4ts";
import { Constructor } from "gtoolkit";
import { INodeStructDef } from "../node/INodeStructDef";

/**
 * 节点定义映射.
 * @type {Map<string, NodeHolisticDef>} node constructor name => NodeHolisticDef
 */
export const nodeDefMap: Map<string, NodeHolisticDef> = new Map();

/**
 * 节点装饰器.
 * @desc 用于注册一个节点定义.
 */
export function RegNodeDef() {
    return function <T extends Constructor<NodeHolisticDef>>(constructor: T): T {
        const node = new constructor();
        Log4Ts.log(RegNodeDef,
            `Define node: ${constructor.name}.`);

        if (nodeDefMap.has(constructor.name)) {
            Log4Ts.error(RegNodeDef,
                `There is already a node with the same name: ${constructor.name}`);
            return constructor;
        }

        nodeDefMap.set(constructor.name, node);
        return constructor;
    };
}

/**
 * 收集所有节点结构定义.
 */
export function collectAllNodeDef(): INodeStructDef[] {
    let res: INodeStructDef[] = [];

    nodeDefMap.forEach(e => res.push(e.structDefine));

    return res;
}