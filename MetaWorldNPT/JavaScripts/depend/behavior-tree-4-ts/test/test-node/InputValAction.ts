import { NodeType } from "../../base/enum/NodeType";
import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { NodeIns } from "../../base/node/NodeIns";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { Environment } from "../../base/environment/Environment";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import { RegArgDef } from "../../base/registry/RegArgDef";
import { NodeArgTypes } from "../../base/node/INodeArg";
import Log4Ts from "mw-log4ts/Log4Ts";
import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { Context } from "../../base/environment/Context";

@RegNodeDef()
export class InputValAction extends NodeHolisticDef<Context, NodeIns> {
    public type = NodeType.Action;

    public desc: "Input";

    public doc: `# InputValAction

input a __Val__`;

    public input: ReadonlyArray<string> = [
        "__Val__",
    ];

    @RegArgDef(NodeArgTypes.Float, "someParam", 10)
    public someParam: string;

    public behave(nodeIns: NodeIns,
                  env: Environment<Context, NodeIns>,
                  val: number): INodeRetInfo {
        Log4Ts.log(InputValAction, `Input ${val}, Param: ${this.someParam}`);

        return {
            status: NodeRetStatus.Success,
        };
    }
}
