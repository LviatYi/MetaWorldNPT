import { describe, it } from "vitest";
import BehaviorTree, { ITreeData } from "../index";
import * as fs from "node:fs";

export * from "../index";
export * from "./test-node/InputValAction";
export * from "./test-node/LogHelloAction";
export * from "./test-node/OutputValAction";
export * from "./test-node/WaitPar";
export * from "./test-node/WaitForTouch";

const testStep = 10;

describe(
    "behavior tree 4 typescript | node",
    () => {
        it(
            `Parallel`,
            () => {
                const tree = new BehaviorTree(
                    JSON.parse(
                        fs.readFileSync("./test/tree-data/parallel.json", "utf-8"),
                    ) as ITreeData,
                );

                for (let i = 0; i < testStep; ++i) {
                    tree.updateContext(0.5e3);
                    tree.run();
                }
            },
        );
        it(
            `Timeout`,
            () => {
                const tree = new BehaviorTree(
                    JSON.parse(
                        fs.readFileSync("./test/tree-data/timeout.json", "utf-8"),
                    ) as ITreeData,
                );

                for (let i = 0; i < testStep; ++i) {
                    tree.updateContext(0.5e3);
                    tree.run();
                }
            },
        );
    },
);
