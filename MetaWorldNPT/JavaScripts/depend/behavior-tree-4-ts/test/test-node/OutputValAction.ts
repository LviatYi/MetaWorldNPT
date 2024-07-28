import { RegNodeDef } from "../../base/registry/RegNodeDef";
import { NodeType } from "../../base/enum/NodeType";
import { NodeHolisticDef } from "../../base/node/NodeHolisticDef";
import { NodeIns } from "../../base/node/NodeIns";
import { INodeRetInfo } from "../../base/node/INodeRetInfo";
import { Environment } from "../../base/environment/Environment";
import Log4Ts from "mw-log4ts/Log4Ts";
import { NodeRetStatus } from "../../base/node/NodeRetStatus";
import Gtk from "gtoolkit";
import { Context } from "../../base/environment/Context";

@RegNodeDef()
export class OutputValAction extends NodeHolisticDef<Context,NodeIns> {
    public type = NodeType.Action;

    public desc: "Output";

    public doc: `# OutputValAction

output a __Val__`;

    public output: ReadonlyArray<string> = [
        "__Val__",
    ];

    public behave(nodeIns: NodeIns,
                  env: Environment<Context,NodeIns>): INodeRetInfo {
        const r = Gtk.random(0, 10, true);
        Log4Ts.log(OutputValAction, `Output ${r}!`);

        return {
            status: NodeRetStatus.Success,
            out: [r],
        };
    }
}
