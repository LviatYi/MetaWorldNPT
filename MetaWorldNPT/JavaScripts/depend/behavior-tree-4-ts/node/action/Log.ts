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

enum LogLevel {
    Info = "Info",
    Warn = "Warn",
    Error = "Error",
}

@RegNodeDef()
export class Log extends NodeHolisticDef<Context, NodeIns> {

    public type = NodeType.Action;

    public desc: "输出";

    public doc: `# Log

输出一段信息。

- 至多一个子节点。
- 等待完成前，返回 Running。
- 等待完成后，若不存在子节点，则返回 Success，否则返回子节点状态。
- waitTime 最短等待时间. ms
- maxLogTime 最长等待时间. ms 若定义，则采用 [waitTime,maxLogTime) 范围内的随机值。`;

    @RegArgDef(NodeArgTypes.String, "信息", "Hello.")
    message: string;

    @RegArgDef(NodeArgTypes.String, "输出变量名")
    key: string;

    @RegArgDef(NodeArgTypes.Enum,
        "日志级别",
        LogLevel.Info,
        [{
            name: LogLevel.Info,
            value: LogLevel.Info,
        }, {
            name: LogLevel.Warn,
            value: LogLevel.Warn,
        }, {
            name: LogLevel.Error,
            value: LogLevel.Error,
        }])
    level: LogLevel;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>): INodeRetInfo {
        const yieldTag = nodeIns.currYieldAt(env);
        if (!isNotYield(yieldTag)) {
            logEUnexpectState(nodeIns, env.lastStackRet);
            throw UNEXPECT_ERROR;
        }

        let message = this.message;
        let val = Gtk.isNullOrEmpty(this.key) ?
            undefined :
            env.get(this.key);

        let messageVal = message + (Gtk.isNullOrUndefined(val) ?
            "" :
            Gtk.isPrimitiveType(val) ?
                val :
                JSON.stringify(val));

        switch (this.level) {
            case LogLevel.Info:
                env.context.log(messageVal);
                break;
            case LogLevel.Warn:
                env.context.warn(messageVal);
                break;
            case LogLevel.Error:
                env.context.error(messageVal);
                break;
        }

        return {status: NodeRetStatus.Success};
    }
}