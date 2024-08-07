import { NodeHolisticDef } from "../base/node/NodeHolisticDef";
import { RegNodeDef } from "../base/registry/RegNodeDef";
import { NodeType } from "../base/enum/NodeType";
import { INodeRetInfo } from "../base/node/INodeRetInfo";
import { Environment } from "../base/environment/Environment";
import { isNotYield, logEUnexpectState, NodeIns, UNEXPECT_ERROR } from "../base/node/NodeIns";
import { NodeRetStatus } from "../base/node/NodeRetStatus";
import { RegArgDef } from "../base/registry/RegArgDef";
import { NodeArgTypes } from "../base/node/INodeArg";
import { Context } from "../base/environment/Context";
import Gtk from "gtoolkit";
import { createParser } from "@adifkz/exp-p";

const parser = createParser();
parser.setFunctions({
    "if": (_, a: unknown, b: unknown, c: unknown) => a ? b : c,
    "min": (_, a: number, b: number) => Math.min(a, b),
    "max": (_, a: number, b: number) => Math.max(a, b),
    "clamp": (_, a: number, min: number, max: number) => Math.min(Math.max(a, min), max),
    "rand": (_, min?: number, max?: number) => Gtk.random(min, max),
});

@RegNodeDef()
export class Expression extends NodeHolisticDef<Context, NodeIns> {
    public type = NodeType.Action;

    public desc = "表达式";

    public doc = `# Expression

计算表达式。支持 \`+-*/^()\` 等运算符，支持简单函数。

- 无子节点。
- 赋值成功后返回 Success。否则返回 Failure。

## 函数支持

- \`if(a, b, c)\`：如果 a 为真则返回 b，否则返回 c。
- \`min(a, b)\`：返回 a 和 b 中的最小值。
- \`max(a, b)\`：返回 a 和 b 中的最大值。
- \`clamp(a, min, max)\`：返回 a 在 min 和 max 之间的值。
- \`rand(min=0, max=1)\`：返回 min 和 max 之间的随机数。

- **expression 表达式**：函数的运算部分，可使用一个字母构成的字符串作为参数占位符，参数占位符必定义参数路径或默认值。
- **params 参数路径映射列表**：一个 JSON 对象，表达式中所使用的参数占位符在此处定义路径，该路径指向黑板的某个数值变量。
- **defaultParams 默认值列表**：一个 JSON 对象，表达式中所使用的参数占位符在此处定义默认值。
- **outputKey 输出路径**`;

    @RegArgDef(NodeArgTypes.String, "表达式")
    expression: string;

    @RegArgDef(NodeArgTypes.String, "参数路径映射")
    params: string;

    @RegArgDef(NodeArgTypes.StringOpt, "默认参数映射")
    defaultParams: string;

    @RegArgDef(NodeArgTypes.String, "输出路径映射", "__OUTPUT__")
    outputKey: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        if (Gtk.isNullOrEmpty(this.expression)) {
            env.context.error(`${this.name}: expression is empty.`);
            return {status: NodeRetStatus.Failure};
        }

        let paramObj: object = {};
        try {
            paramObj = JSON.parse(this.params);
        } catch (e) {
            env.context.error(`${this.name}: parse params error. not a valid JSON object`, e);
        }
        let paramMap = {};
        try {
            paramMap = JSON.parse(this.defaultParams);
        } catch (e) {
            env.context.error(`${this.name}: parse default params error. not a valid JSON object`, e);
        }

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
            env.context.error(`${this.name}: expression error.`, e);
            return {status: NodeRetStatus.Failure};
        }

        env.context.log(`${this.name}: expression result: ${result}`);

        env.setValByPath(undefined, this.outputKey, result);

        return {status: NodeRetStatus.Success};
    }
}
