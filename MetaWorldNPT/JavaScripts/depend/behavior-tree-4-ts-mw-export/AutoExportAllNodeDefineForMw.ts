import Log4Ts from "mw-log4ts";
import { collectAllNodeDef } from "../behavior-tree-4-ts";

const EXPORT_BEHAVIOR_TREE_NODES_DEFINE_STORAGE_KEY =
    "__BEHAVIOR_TREE_NODES_DEFINE_EXPORTED__";

function autoExportAllNodeDefineForMw() {
    mw.TimeUtil.onEnterFrame.remove(autoExportAllNodeDefineForMw);
    const res = collectAllNodeDef();
    Log4Ts.log({name: "BehaviorTreeManager"},
        `Output Nodes: `,
        `${JSON.stringify(res)}`,
        `saved in DataStorage by key ${EXPORT_BEHAVIOR_TREE_NODES_DEFINE_STORAGE_KEY}`,
        `saved in ClipBoard.`);
    if (mw.SystemUtil.isServer()) {
        mw.DataStorage.asyncSetData(
            EXPORT_BEHAVIOR_TREE_NODES_DEFINE_STORAGE_KEY,
            res);
    }
    if (mw.SystemUtil.isClient()) {
        mw.StringUtil.clipboardCopy(JSON.stringify(res));
    }

}

mw.TimeUtil.onEnterFrame.add(autoExportAllNodeDefineForMw);