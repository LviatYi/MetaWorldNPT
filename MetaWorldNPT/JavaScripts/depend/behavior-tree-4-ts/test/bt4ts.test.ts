import { describe, it } from "vitest";
import BehaviorTree, { ITreeData } from "../index";
import * as fs from "node:fs";
import Log4Ts from "mw-log4ts/Log4Ts";

export * from "../index";
export * from "./test-node/InputValAction";
export * from "./test-node/LogHelloAction";
export * from "./test-node/OutputValAction";
export * from "./test-node/WaitPar";
export * from "./test-node/WaitForTouch";

const testStep = 10;

describe(
    "byte array | functional",
    () => {
        it(
            `tree`,
            () => {
                const tree = new BehaviorTree(
                    JSON.parse(fs.readFileSync("./test/treeData.json", "utf-8")) as ITreeData,
                );

                Log4Ts.log(undefined, `load tree: ${tree.name}`);

                for (let i = 0; i < testStep; ++i) {
                    tree.run();
                }
            },
        );
    },
);
