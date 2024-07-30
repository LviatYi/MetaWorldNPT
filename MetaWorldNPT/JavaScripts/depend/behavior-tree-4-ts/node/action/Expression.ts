import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeType } from "../../base/enum/NodeType";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { Environment } from "../../base/environment/Environment";
import { isNotYield, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../../base/node/NodeIns";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";
import { Context } from "../../base/environment/Context";
import Gtk from "gtoolkit";
import { createParser } from "@adifkz/exp-p";

const parser = createParser();

@RegNodeDef()
export class Expression extends NodeHolisticDef<Context, NodeIns> {
    public type = NodeType.Action;

    public desc = "表达式";

    public doc = `# Expression

计算表达式。支持 \`+-*/^()\` 等运算符。

- 无子节点。
- 赋值成功后返回 Success。否则返回 Failure。

- **expression 表达式**：函数的运算部分，可使用一个字母构成的字符串作为参数占位符，参数占位符必定义参数路径或默认值。
- **params 参数路径映射列表**：一个 JSON 对象，表达式中所使用的参数占位符在此处定义路径，该路径指向黑板的某个数值变量。
- **defaultParams 默认值列表**：一个 JSON 对象，表达式中所使用的参数占位符在此处定义默认值。

- output
    - Output 输出`;

    @RegArgDef(NodeArgTypes.String, "表达式")
    expression: string;

    @RegArgDef(NodeArgTypes.String, "参数路径映射")
    params: string;

    @RegArgDef(NodeArgTypes.String, "默认参数映射")
    defaultParams: string;

    output = [
        "Output",
    ];

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        if (Gtk.isNullOrEmpty(this.expression)) {
            env.context.error(`expression is empty.`);
            return {status: NodeRetStatus.Failure};
        }

        const paramObj = JSON.parse(this.params);
        const paramMap = JSON.parse(this.defaultParams);

        for (const key in paramObj) {
            const path = paramObj[key];
            if (Gtk.isNullOrEmpty(path)) {
                continue;
            }

            paramMap[key] = env.getValByPath(undefined, path) ?? paramMap[key];
        }

        let result: unknown;
        try {
            result = parser.evaluate(this.expression, paramMap);
        } catch (e) {
            env.context.error(this.name, `expression error.`, e);
            return {status: NodeRetStatus.Failure};
        }

        env.context.log(this.name, `expression result: ${result}`);

        return {status: NodeRetStatus.Success, out: [result]};
    }
}
