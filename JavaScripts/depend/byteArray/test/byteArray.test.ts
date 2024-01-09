// // byte array createTime: 308ms
// // string length: 30000000
// // byte string encodeTime: 3118ms
// // byte string decodeTime: 664ms
// // byte array createTime: 293ms
// // string length: 5000000
// // base64 string encodeTime: 2ms
// // base64 string decodeTime: 9ms
// // byte array createTime: 297ms
// // string length: 3750000
// // pure string encodeTime: 20ms
// // pure string decodeTime: 110ms
//
// // byte array createTime: 294ms
// // string length: 30000000
// // byte string encodeTime: 3070ms
// // byte string decodeTime: 687ms
// // byte array createTime: 308ms
// // string length: 5000000
// // base64 string encodeTime: 2ms
// // base64 string decodeTime: 10ms
// // byte array createTime: 295ms
// // string length: 3750000
// // pure string encodeTime: 20ms
// // pure string decodeTime: 117ms
//
// // byte array createTime: 292ms
// // string length: 30000000
// // byte string encodeTime: 3058ms
// // byte string decodeTime: 651ms
// // byte array createTime: 294ms
// // string length: 5000000
// // base64 string encodeTime: 2ms
// // base64 string decodeTime: 8ms
// // byte array createTime: 290ms
// // string length: 3750000
// // pure string encodeTime: 23ms
// // pure string decodeTime: 115ms
//
// import { beforeAll, describe, expect, it } from "vitest";
// import ByteArray from "../ByteArray.js";
//
// let byteLength: number;
// let count: number;
// let data: number[];
//
// const maxByteLength = 30;
// const maxCount = 1000000;
//
// describe(
//     "byte array | functional",
//     () => {
//         beforeAll(
//             (args) => {
//                 byteLength = (maxByteLength * Math.random()) | 0;
//                 count = (maxCount * Math.random()) | 0;
//                 data = new Array(count);
//
//                 for (let i = 0; i < count; ++i) {
//                     data[i] = Math.random() * (2 ** byteLength) | 0;
//                 }
//             },
//         );
//         it(
//             `get / set`,
//             () => {
//                 const byteArray = ByteArray.createInstance(count, byteLength);
//                 for (let i = 0; i < count; ++i) {
//                     byteArray.setValue(i, data[i]);
//                 }
//
//                 for (let i = 0; i < count; ++i) {
//                     expect(data[i]).toBe(byteArray.getValue(i));
//                 }
//             },
//         );
//
//         it(
//             `to byte string`,
//             () => {
//                 const byteArray = ByteArray.createInstance(count, byteLength);
//                 for (let i = 0; i < count; ++i) {
//                     byteArray.setValue(i, data[i]);
//                 }
//
//                 const dataString = byteArray.toByteString();
//                 const byteArray2 = ByteArray.fromByteString(dataString, byteLength);
//
//                 for (let i = 0; i < count; ++i) {
//                     expect(data[i]).toBe(byteArray2.getValue(i));
//                 }
//             },
//         );
//
//         it(
//             `to base64 string`,
//             () => {
//                 const byteArray = ByteArray.createInstance(count, byteLength);
//                 for (let i = 0; i < count; ++i) {
//                     byteArray.setValue(i, data[i]);
//                 }
//
//                 const dataString = byteArray.toBase64();
//                 const byteArray2 = ByteArray.fromBase64(dataString, count, byteLength);
//
//                 for (let i = 0; i < count; ++i) {
//                     expect(data[i]).toBe(byteArray2.getValue(i));
//                 }
//             },
//         );
//
//         it(
//             `to pure string`,
//             () => {
//                 const byteArray = ByteArray.createInstance(count, byteLength);
//                 for (let i = 0; i < count; ++i) {
//                     byteArray.setValue(i, data[i]);
//                 }
//
//                 const dataString = byteArray.toByteString();
//                 const byteArray2 = ByteArray.fromByteString(dataString, byteLength);
//
//                 for (let i = 0; i < count; ++i) {
//                     expect(data[i]).toBe(byteArray2.getValue(i));
//                 }
//             },
//         );
//     },
// );
//
// describe(
//     "byte array | performance",
//     () => {
//         beforeAll(
//             (args) => {
//                 byteLength = maxByteLength;
//                 count = maxCount;
//                 data = new Array(count);
//
//                 for (let i = 0; i < count; ++i) {
//                     data[i] = Math.random() * (2 ** byteLength) | 0;
//                 }
//
//                 console.log(`generate data byteLength: ${byteLength},count: ${count}`);
//             },
//         );
//
//         it(
//             `create & encode & decode byte string`,
//             () => {
//                 const startTime = Date.now();
//                 const byteArray = ByteArray.createInstance(count, byteLength);
//                 for (let i = 0; i < count; ++i) {
//                     byteArray.setValue(i, data[i]);
//                 }
//
//                 const createTime = Date.now();
//                 const dataString = byteArray.toByteString();
//                 const encodeTime = Date.now();
//                 const byteArray2 = ByteArray.fromByteString(dataString, byteLength);
//                 const decodeTime = Date.now();
//
//                 console.log(`byte array createTime: ${createTime - startTime}ms`);
//                 console.log(`string length: ${dataString.length}`);
//                 console.log(`byte string encodeTime: ${encodeTime - createTime}ms`);
//                 console.log(`byte string decodeTime: ${decodeTime - encodeTime}ms`);
//                 for (let i = 0; i < count; ++i) {
//                     expect(data[i]).toBe(byteArray2.getValue(i));
//                 }
//             },
//         );
//
//         it(
//             `create & encode & decode base64 string`,
//             () => {
//                 const startTime = Date.now();
//                 const byteArray = ByteArray.createInstance(count, byteLength);
//                 for (let i = 0; i < count; ++i) {
//                     byteArray.setValue(i, data[i]);
//                 }
//
//                 const createTime = Date.now();
//                 const dataString = byteArray.toBase64();
//                 const encodeTime = Date.now();
//                 const byteArray2 = ByteArray.fromBase64(dataString, count, byteLength);
//                 const decodeTime = Date.now();
//
//                 console.log(`byte array createTime: ${createTime - startTime}ms`);
//                 console.log(`string length: ${dataString.length}`);
//                 console.log(`base64 string encodeTime: ${encodeTime - createTime}ms`);
//                 console.log(`base64 string decodeTime: ${decodeTime - encodeTime}ms`);
//                 for (let i = 0; i < count; ++i) {
//                     expect(data[i]).toBe(byteArray2.getValue(i));
//                 }
//             },
//         );
//
//         it(
//             `create & encode & decode pure string`,
//             () => {
//                 const startTime = Date.now();
//                 const byteArray = ByteArray.createInstance(count, byteLength);
//                 for (let i = 0; i < count; ++i) {
//                     byteArray.setValue(i, data[i]);
//                 }
//
//                 const createTime = Date.now();
//                 const dataString = byteArray.toString();
//                 const encodeTime = Date.now();
//                 const byteArray2 = ByteArray.fromString(dataString, count, byteLength);
//                 const decodeTime = Date.now();
//
//                 console.log(`byte array createTime: ${createTime - startTime}ms`);
//                 console.log(`string length: ${dataString.length}`);
//                 console.log(`pure string encodeTime: ${encodeTime - createTime}ms`);
//                 console.log(`pure string decodeTime: ${decodeTime - encodeTime}ms`);
//                 for (let i = 0; i < count; ++i) {
//                     expect(data[i]).toBe(byteArray2.getValue(i));
//                 }
//             },
//         );
//     },
// );