// import { Yoact } from "../Yoact";
// import { expect, test } from "vitest";
// import createYoact = Yoact.createYoact;
// import bindYoact = Yoact.bindYoact;
//
// class SubTestData {
//     public id: number;
//
//     constructor(id: number = undefined) {
//         this.id = id ?? Math.random() * 100 | 0;
//     }
// }
//
// class TestData {
//     public str: string;
//     public sub: SubTestData;
//
//     constructor(id: number = undefined, str: string = undefined) {
//         this.sub = new SubTestData(id);
//         this.str = str ?? `string-${this.sub.id}`;
//     }
// }
//
// test(
//     `data reactive | primitive data modify`,
//     () => {
//         let dataBindTest = new TestData();
//         dataBindTest = createYoact(dataBindTest);
//
//         const view = {
//             str: "",
//             id: 0,
//             toString: () => {
//                 return `view\nstr: ${view.str}, id: ${view.id}`;
//             },
//         };
//
//         bindYoact(() => {
//             view.str = dataBindTest.str;
//             view.id = dataBindTest.sub.id;
//         });
//
//         const d = Math.random();
//         d > 0.5 ? dataBindTest.str = `Data: ${d * 100 | 0}` : dataBindTest.sub.id = d * 100 | 0;
//
//         expect(view.str).toBe(dataBindTest.str);
//         expect(view.id).toBe(dataBindTest.sub.id);
//     },
// );
//
// test(
//     `data reactive | object data modify`,
//     () => {
//         let dataBindTest = new TestData();
//         dataBindTest = createYoact(dataBindTest);
//
//         const view = {
//             str: "",
//             id: 0,
//             toString: () => {
//                 return `view\nstr: ${view.str}, id: ${view.id}`;
//             },
//         };
//
//         bindYoact(() => {
//             view.str = dataBindTest.str;
//             view.id = dataBindTest.sub.id;
//         });
//
//         let d = Math.random();
//         dataBindTest.sub = new SubTestData(d * 100 | 0);
//         dataBindTest.str = `str: ${dataBindTest.sub.id}`;
//         d = Math.random();
//         dataBindTest.sub.id = d * 100 | 0;
//
//         expect(view.str).toBe(dataBindTest.str);
//         expect(view.id).toBe(dataBindTest.sub.id);
//     },
// );
//
// test(
//     `data reactive | array item modify`,
//     () => {
//         let dataBindTest: TestData[] = [];
//         for (let i = 0; i < 4; i++) {
//             dataBindTest.push(new TestData());
//         }
//         dataBindTest = createYoact(dataBindTest);
//
//         const view = {
//             str: "",
//             id: 0,
//             toString: () => {
//                 return `view\nstr: ${view.str}, id: ${view.id}`;
//             },
//         };
//
//         bindYoact(() => {
//             view.str = dataBindTest[dataBindTest.length - 1].str;
//             view.id = dataBindTest[dataBindTest.length - 1].sub.id;
//         });
//
//         let d = dataBindTest.length - 1;
//         console.log(`modify ${d}, current length: ${dataBindTest.length}`);
//         dataBindTest[d].sub.id = d * 100 + (Math.random() * 10) | 0;
//         dataBindTest[d].str = `str: ${dataBindTest[d].sub.id}`;
//
//         expect(view.str).toBe(dataBindTest[dataBindTest.length - 1].str);
//         expect(view.id).toBe(dataBindTest[dataBindTest.length - 1].sub.id);
//     },
// );
//
// test(
//     `data reactive | array item add`,
//     () => {
//         let dataBindTest: TestData[] = [];
//         for (let i = 0; i < 4; i++) {
//             dataBindTest.push(new TestData());
//         }
//         dataBindTest = createYoact(dataBindTest);
//
//         const view = {
//             str: "",
//             id: 0,
//             toString: () => {
//                 return `view\nstr: ${view.str}, id: ${view.id}`;
//             },
//         };
//
//         bindYoact(() => {
//             view.str = dataBindTest[dataBindTest.length - 1].str;
//             view.id = dataBindTest[dataBindTest.length - 1].sub.id;
//         });
//
//         let d = Math.random() * 100 | 0;
//         dataBindTest.push(new TestData(d, `str: ${d}`));
//
//         expect(view.str).toBe(dataBindTest[dataBindTest.length - 1].str);
//         expect(view.id).toBe(dataBindTest[dataBindTest.length - 1].sub.id);
//     },
// );
//
// test(
//     `data reactive | array item delete`,
//     () => {
//         let dataBindTest: TestData[] = [];
//         for (let i = 0; i < 4; i++) {
//             let d: number = Math.random() * 100 | 0;
//             dataBindTest.push(new TestData(d, `str: ${d}`));
//         }
//         dataBindTest = createYoact(dataBindTest);
//         const view = {
//             str: "",
//             id: 0,
//             toString: () => {
//                 return `view\nstr: ${view.str}, id: ${view.id}`;
//             },
//         };
//         bindYoact(() => {
//             view.str = dataBindTest[dataBindTest.length - 1].str;
//             view.id = dataBindTest[dataBindTest.length - 1].sub.id;
//         });
//         dataBindTest.pop();
//         expect(view.str).toBe(dataBindTest[dataBindTest.length - 1].str);
//         expect(view.id).toBe(dataBindTest[dataBindTest.length - 1].sub.id);
//     },
// );