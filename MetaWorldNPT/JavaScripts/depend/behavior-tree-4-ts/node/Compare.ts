import { Context } from "../base/environment/Context";
import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { NodeIns } from "../base/node/NodeIns";
import { RegArgDef } from "../base/registry/RegArgDef";
import { NodeArgTypes } from "../base/node/INodeArg";
import Gtk from "gtoolkit";
import { NodeType } from "../base/enum/NodeType";
import { Environment } from "../base/environment/Environment";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { RegNodeDef } from "../base/registry/RegNodeDef";

@RegNodeDef()
export class Compare extends NodeHolisticDef<Context, NodeIns> {
    public type: Readonly<NodeType> = NodeType.Condition;

    public desc = "比较";

    public doc = `# Compare

将黑板变量中的数值变量与指定值比较。

- 无子节点。
- 返回 Success 或 Failure，取决于黑板变量与指定值的比较结果。
- **lhs 键** 变量路径。可以指向一个键，也可以指向成员。但应指向一个数值变量。
- **rhs 比较值**  
- **cmp 比较方式**  
- **precision 精度**：比较精度。默认为 \`1e-6\`。`;

    @RegArgDef(NodeArgTypes.String, "变量路径")
    lhs: string;

    @RegArgDef(NodeArgTypes.Int, "比较值")
    rhs: number;

    @RegArgDef(NodeArgTypes.Enum,
        "比较方式",
        ">",
        [{name: "等于", value: "=="},
            {name: "不等于", value: "!="},
            {name: "大于", value: ">"},
            {name: "小于", value: "<"},
            {name: "不大于", value: "<="},
            {name: "不小于", value: ">="},
        ])
    cmp: string;

    @RegArgDef(NodeArgTypes.FloatOpt, "精度", 1e-6)
    precision: number;

    public behave(nodeIns: NodeIns, env: Environment<Context, NodeIns>): INodeRetInfo {
        let p: unknown = env.getValByPath(undefined, this.lhs);
        p = p ?? Number(p);
        if (Gtk.isNullOrUndefined(p) || Number.isNaN(p)) return {status: NodeRetStatus.Failure};

        if (Gtk.isNullOrUndefined(this.precision) ||
            typeof this.precision !== "number" ||
            Number.isNaN(this.precision)) {
            this.precision = 1e-6;
        }

        switch (this.cmp) {
            case "==":
                return {
                    status: Math.abs((p as number) - this.rhs) < this.precision ?
                        NodeRetStatus.Success :
                        NodeRetStatus.Failure,
                };
            case "!=":
                return {
                    status: Math.abs((p as number) - this.rhs) >= this.precision ?
                        NodeRetStatus.Success :
                        NodeRetStatus.Failure,
                };
            case "<":
                return {status: (p as number) - this.rhs < this.precision ? NodeRetStatus.Success : NodeRetStatus.Failure};
            case "<=":
                return {status: (p as number) - this.rhs <= this.precision ? NodeRetStatus.Success : NodeRetStatus.Failure};
            case ">=":
                return {status: (p as number) - this.rhs >= -this.precision ? NodeRetStatus.Success : NodeRetStatus.Failure};
            case ">":
            default:
                return {status: (p as number) - this.rhs > -this.precision ? NodeRetStatus.Success : NodeRetStatus.Failure};
        }
    }
}