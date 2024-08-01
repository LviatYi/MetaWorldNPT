// import { describe, it } from "vitest";
// import BehaviorTree, { Context, ITreeData } from "../index";
// import * as fs from "node:fs";
// import { equal } from "node:assert";
//
// export * from "../index";
// export * from "./test-node/WaitForTouch";
//
// describe(
//     "behavior tree 4 typescript | node composition 1",
//     () => {
//         it("Selector Once IfElse Assign", () => {
//             const tree = new BehaviorTree(
//                 JSON.parse(
//                     fs.readFileSync("./test/tree-data/ifElse.json", "utf-8"),
//                 ) as ITreeData,
//                 new Context(true, true),
//             );
//
//             for (let i = 0; i < 2; ++i) {
//                 tree.updateContext(0.5e3);
//                 tree.run();
//
//                 if (i % 2 > 0) {
//                     equal(tree.env.get("IfElseVal"), "2");
//                 } else {
//                     equal(tree.env.get("IfElseVal"), "1");
//                 }
//             }
//         });
//
//         it(`Parallel Sequence Wait Assign`, () => {
//                 const tree = new BehaviorTree(
//                     JSON.parse(
//                         fs.readFileSync("./test/tree-data/parallel.json", "utf-8"),
//                     ) as ITreeData,
//                     new Context(true, true),
//                 );
//
//                 for (let i = 0; i < 5; ++i) {
//                     tree.updateContext(1e3);
//                     tree.run();
//                     equal(tree.env.get("Val"), (i === 0 ? undefined : i));
//                 }
//             },
//         );
//
//         it("Write Expression Log", () => {
//             const tree = new BehaviorTree(
//                 JSON.parse(
//                     fs.readFileSync("./test/tree-data/expression.json", "utf-8"),
//                 ) as ITreeData,
//                 new Context(true, true),
//             );
//
//             for (let i = 0; i < 1; ++i) {
//                 tree.updateContext(1e3);
//                 tree.run();
//                 equal(tree.env.get("Output1"), 30);
//                 equal(tree.env.get("Output2"), 30);
//             }
//         });
//
//         // it(`Timeout`, () => {
//         //         const tree = new BehaviorTree(
//         //             JSON.parse(
//         //                 fs.readFileSync("./test/tree-data/timeout.json", "utf-8"),
//         //             ) as ITreeData,
//         //         );
//         //
//         //         for (let i = 0; i < testStep; ++i) {
//         //             tree.updateContext(0.5e3);
//         //             tree.run();
//         //         }
//         //     },
//         // );
//     },
// );
