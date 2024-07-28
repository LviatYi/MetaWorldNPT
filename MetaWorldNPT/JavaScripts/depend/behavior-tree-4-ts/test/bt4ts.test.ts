import { assert, describe, expect, it } from "vitest";
import BehaviorTree, { ITreeData } from "../index";
import * as fs from "node:fs";

export * from "../index";
export * from "./test-node/InputValAction";
export * from "./test-node/LogHelloAction";
export * from "./test-node/OutputValAction";
export * from "./test-node/WaitPar";
export * from "./test-node/WaitForTouch";

describe(
    "behavior tree 4 typescript | node composition 1",
    () => {
        it("Selector Once IfElse Assign", () => {
            const tree = new BehaviorTree(
                JSON.parse(
                    fs.readFileSync("./test/tree-data/ifElse.json", "utf-8"),
                ) as ITreeData,
            );

            for (let i = 0; i < 2; ++i) {
                tree.updateContext(0.5e3);
                tree.run();

                if (i % 2 > 0) {
                    expect(tree.env.get("a")["b"] === "20");
                } else {
                    expect(tree.env.get("a")["b"] === "10");
                }
            }
        });

        it(`Parallel Sequence Wait Assign`, () => {
                const tree = new BehaviorTree(
                    JSON.parse(
                        fs.readFileSync("./test/tree-data/parallel.json", "utf-8"),
                    ) as ITreeData,
                );

                for (let i = 0; i < 5; ++i) {
                    tree.updateContext(1e3);
                    tree.run();
                    expect(tree.env.get("Val") === (i === 0 ? undefined : i));
                }
            },
        );

        // it(`Timeout`, () => {
        //         const tree = new BehaviorTree(
        //             JSON.parse(
        //                 fs.readFileSync("./test/tree-data/timeout.json", "utf-8"),
        //             ) as ITreeData,
        //         );
        //
        //         for (let i = 0; i < testStep; ++i) {
        //             tree.updateContext(0.5e3);
        //             tree.run();
        //         }
        //     },
        // );
    },
);
