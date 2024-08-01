import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { NodeIns } from "../../base/node/NodeIns";
import { Context } from "../../base/environment/Context";
import { NodeType } from "../../base/enum/NodeType";
import { Environment, getValByPath } from "../../base/environment/Environment";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { RegNodeDef } from "../../base/registry/RegNodeDef";
import Gtk from "gtoolkit";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";

@RegNodeDef()
export class Min extends NodeHolisticDef<Context, NodeIns> {
    public type = NodeType.Decorator;

    public desc = "最小的";

    public doc = `# Min

从一个数组中获取最小的元素。

- 无子节点。
- 若输入数组未定义或空，返回 Failure，若属性不为 number，返回 Failure。否则返回 Success。

- **inputKey 输入参数名**：应指向一个数组。
- **propertyPath 属性路径**：指向对象的某个 number 类型属性，用以判断。
- **outputKey 输出路径**：输出一个元素。`;

    @RegArgDef(NodeArgTypes.String, "输入参数名（数组）", "__INPUT_ARRAY__")
    public inputKey: string;

    @RegArgDef(NodeArgTypes.StringOpt, "属性路径")
    public propertyPath: string;

    @RegArgDef(NodeArgTypes.String, "输出路径", "__OUTPUT_ITEM__")
    public outputKey: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const input = env.getValByPath(undefined, this.inputKey) as unknown[];
        if (!Array.isArray(input) || Gtk.isNullOrEmpty(input)) {
            return {status: NodeRetStatus.Failure};
        }

        let min = getValByPath<number>(input[0], this.propertyPath?.split(".") ?? []);
        let minItem = input[0];
        if (typeof min !== "number") {
            env.context.warn(`Min: The property path is not a number.`);
            return {status: NodeRetStatus.Failure};
        }

        for (let i = 1; i < input.length; i++) {
            const item = input[i];
            let v = getValByPath<number>(item, this.propertyPath?.split(".") ?? []);
            if (v < min) {
                min = v;
                minItem = item;
            }
        }

        env.setValByPath(undefined, this.outputKey, minItem);
        return {status: NodeRetStatus.Success};
    }
}
