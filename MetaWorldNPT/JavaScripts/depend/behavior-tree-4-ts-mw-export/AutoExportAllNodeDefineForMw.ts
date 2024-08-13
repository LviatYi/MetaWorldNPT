import Log4Ts from "mw-log4ts";
import { collectAllNodeDef } from "../behavior-tree-4-ts";

const EXPORT_BEHAVIOR_TREE_NODES_DEFINE_STORAGE_KEY =
    "__BEHAVIOR_TREE_NODES_DEFINE_EXPORTED__";

function autoExportAllNodeDefineForMw(clipboard: boolean = false) {
    mw.TimeUtil.onEnterFrame.remove(autoExportHandler);
    const res = collectAllNodeDef();
    Log4Ts.log({name: "BehaviorTreeManager"},
        `Output Nodes: `,
        `${JSON.stringify(res)}`,
        `saved in DataStorage by key ${EXPORT_BEHAVIOR_TREE_NODES_DEFINE_STORAGE_KEY}`,
        `${clipboard ? "saved in ClipBoard." : ""}`)
    if (mw.SystemUtil.isServer()) {
        mw.DataStorage.asyncSetData(
            EXPORT_BEHAVIOR_TREE_NODES_DEFINE_STORAGE_KEY,
            res);
    }
    if (mw.SystemUtil.isClient()) {
        clipboard && mw.StringUtil.clipboardCopy(JSON.stringify(res));
    }
}

const autoExportHandler = () => autoExportAllNodeDefineForMw(false);

mw.TimeUtil.onEnterFrame.add(autoExportHandler);