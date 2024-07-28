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

@RegNodeDef()
export class Assign extends NodeHolisticDef<Context, NodeIns> {

    public type = NodeType.Action;

    public desc: "赋值";

    public doc: `# Assign

对黑板变量赋值。

- 无子节点。
- 赋值成功后返回 Success。否则返回 Failure。
- key 变量路径：支持对对象字段进行赋值，格式为以 \`.\` 隔开的字符串。
- value 值：具体值。
- valType 类型：number|string|boolean。`;

    @RegArgDef(NodeArgTypes.String, "变量路径")
    key: string;

    @RegArgDef(NodeArgTypes.String, "值", "")
    value: unknown;

    @RegArgDef(NodeArgTypes.String,
        "类型",
        "number",
        [{
            name: "number",
            value: "number",
        }, {
            name: "string",
            value: "string",
        }, {
            name: "boolean",
            value: "boolean",
        }])
    valType: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let valPath = this.key.split(".");
        if (valPath.length <= 0) return {status: NodeRetStatus.Failure};

        let needObj = valPath.length > 1;
        let p: unknown = env.get(valPath[0]);
        if (!Gtk.isNullOrUndefined(p) &&
            typeof p !== "object" &&
            needObj) {
            env.context.error(`assign val of ${this.key}, but ${valPath[0]} is not object.`);
            return {status: NodeRetStatus.Failure};
        }

        let val: unknown;
        switch (this.valType) {
            case "string":
                val = String(this.value);
                break;
            case "boolean":
                val = this.value === "1" ||
                    this.value === "true" ||
                    this.value === 1 ||
                    this.value === true ||
                    this.value === "yes" ||
                    this.value === "Yes" ||
                    this.value === "Y" ||
                    this.value === "y";
                break;
            case "number":
            default:
                val = Number(this.value);
                if (Number.isNaN(val)) val = 0;
                break;
        }

        let o: unknown = needObj ? p : val;
        for (let i = 1; i < valPath.length; ++i) {
            if (Gtk.isNullOrUndefined(p) && i === 1) {
                o = p = {};
            }

            if (i < valPath.length - 1 && Gtk.isNullOrUndefined(p[valPath[i]])) {
                p[valPath[i]] = {};
            }

            if (i === valPath.length - 1) {
                p[valPath[i]] = val;
            } else {
                p = p[valPath[i]];
            }
        }

        env.set(valPath[0], o);

        return {status: NodeRetStatus.Success};
    }
}
