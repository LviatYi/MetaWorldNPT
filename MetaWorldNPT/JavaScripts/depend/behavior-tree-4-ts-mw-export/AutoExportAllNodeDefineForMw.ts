import Log4Ts from "mw-log4ts";
import { collectAllNodeDef } from "../behavior-tree-4-ts/base/registry/RegNodeDef";

const EXPORT_BEHAVIOR_TREE_NODES_DEFINE_STORAGE_KEY =
    "__BEHAVIOR_TREE_NODES_DEFINE_EXPORTED__";

function autoExportAllNodeDefineForMw() {
    mw.TimeUtil.onEnterFrame.remove(autoExportAllNodeDefineForMw);
    if (!mw.SystemUtil.isServer()) return;

    const res = JSON.stringify(collectAllNodeDef());

    Log4Ts.log({name: "BehaviorTreeManager"},
        `Output Nodes: `,
        `${res}`,
        `saved in DataStorage by key ${EXPORT_BEHAVIOR_TREE_NODES_DEFINE_STORAGE_KEY}`);

    mw.DataStorage.asyncSetData(
        EXPORT_BEHAVIOR_TREE_NODES_DEFINE_STORAGE_KEY,
        res);
}