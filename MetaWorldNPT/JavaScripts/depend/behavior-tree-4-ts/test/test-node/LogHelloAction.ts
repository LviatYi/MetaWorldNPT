import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeType } from "../../base/enum/NodeType";
import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { NodeIns } from "../../base/node/NodeIns";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { Environment } from "../../base/environment/Environment";
import Log4Ts from "mw-log4ts/Log4Ts";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { Context } from "../../base/environment/Context";

@RegNodeDef()
export class LogHelloAction extends NodeHolisticDef<Context, NodeIns> {
    public type = NodeType.Action;

    public desc: "Hello!";

    public doc: `# LogHelloAction`;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context,NodeIns>): INodeRetInfo {
        Log4Ts.log(LogHelloAction, `Hello!`);

        return {
            status: NodeRetStatus.Success,
        };
    }
}
