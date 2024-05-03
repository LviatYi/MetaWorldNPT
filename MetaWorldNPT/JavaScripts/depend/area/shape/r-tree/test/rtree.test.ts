import { describe, expect, it } from "vitest";
import Rectangle from "../Rectangle.js";
import { RTree } from "../RTree.js";

describe(
    "rectangle | functional",
    () => {
        it(`hit`, () => {
                const rect = new Rectangle([0, 0], [1, 1]);
                expect(rect.hit([0.5, 0.5])).toBeTruthy();
            },
        );

        it(`intersect`, () => {
                const rect = new Rectangle([0, 0], [1, 1]);
                const rect2 = new Rectangle([0.5, 0.5], [1.5, 1.5]);
                const rect3 = new Rectangle([-0.5, -0.5], [0.5, 0.5]);
                const rect4 = new Rectangle([2, 2], [3, 3]);

                expect(rect.intersect(rect2)).toBeTruthy();
                expect(rect.intersect(rect3)).toBeTruthy();
                expect(rect.intersect(rect4)).toBeFalsy();
            },
        );
    },
);

describe(
    "rtree | functional",
    () => {
        it(`insert`, () => {
                const rtree = new RTree();

                rtree.insert(new Rectangle([0, 0], [1, 1]));

                expect(rtree["_root"].boxes.length).toBe(1);

                rtree.insert(new Rectangle([10, 10], [10.5, 10.5]));
                expect(rtree["_root"].boxes.length).toBe(2);

                rtree.insert(new Rectangle([9.9, 9.9], [10.4, 10.4]));

                for (let i = 1; i < 5; ++i) {
                    rtree.insert(new Rectangle([0.1 * i, 0.1 * i], [1 + 0.1 * i, 1 + 0.1 * i]));
                }
                rtree.insert(new Rectangle([10.2, 10.2], [10.7, 10.7]));
                expect(rtree["_root"].boxes.length).toBe(rtree["_root"].children.length);
                expect(Array.from(rtree).length).toBe(8);
            },
        );

        it(`remove`, () => {
                const rtree = new RTree();

                let targetRect = new Rectangle([0.1, 0.1], [1 + 0.1, 1 + 0.1]);

                rtree.insert(new Rectangle([0, 0], [1, 1]));
                rtree.insert(new Rectangle([10, 10], [10.5, 10.5]));
                rtree.insert(new Rectangle([9.9, 9.9], [10.4, 10.4]));
                rtree.insert(targetRect);
                for (let i = 2; i < 5; ++i) {
                    rtree.insert(new Rectangle([0.1 * i, 0.1 * i], [1 + 0.1 * i, 1 + 0.1 * i]));
                }
                rtree.insert(new Rectangle([10.2, 10.2], [10.7, 10.7]));

                rtree.remove(targetRect);
                expect(Array.from(rtree).length).toBe(7);
                expect(rtree["_root"].children[0].boxes.length).toBe(4);
            },
        );

        it(`bounding update when insert`, () => {
                const rtree = new RTree();

                rtree.insert(new Rectangle([0, 0], [1, 1]));
                expect(rtree.box).eql(new Rectangle([0, 0], [1, 1]));

                rtree.insert(new Rectangle([0.1, 0.1], [1.1, 1.1]));
                expect(rtree.box).eql(new Rectangle([0, 0], [1.1, 1.1]));
            },
        );

        it(`bounding update when remove`, () => {
                const rtree = new RTree();
                let rects = [];
                for (let i = 0; i < 5; ++i) {
                    let rect = new Rectangle([0.1 * i, 0.1 * i], [1 + 0.1 * i, 1 + 0.1 * i]);
                    rects.push(rect);
                    rtree.insert(rect);
                }

                expect(rtree.box).eql(new Rectangle([0, 0], [1.4, 1.4]));

                rtree.remove(rects[0]);
                expect(rtree.box).eql(new Rectangle([0.1, 0.1], [1.4, 1.4]));
            },
        );

        it(`test hit`, () => {
                const rtree = new RTree();

                let targetRect = new Rectangle([10, 10], [10.5, 10.5]);

                rtree.insert(new Rectangle([0, 0], [1, 1]));
                rtree.insert(targetRect);
                rtree.insert(new Rectangle([9.9, 9.9], [10.4, 10.4]));
                for (let i = 1; i < 5; ++i) {
                    rtree.insert(new Rectangle([0.1 * i, 0.1 * i], [1 + 0.1 * i, 1 + 0.1 * i]));
                }
                rtree.insert(new Rectangle([10.2, 10.2], [10.7, 10.7]));

                expect(rtree.queryPoint([10.1, 10.1]).length).toBe(2);
                expect(rtree.queryPoint([10.1, 10.1]).indexOf(targetRect) >= 0).toBeTruthy();
            },
        );
    },
);