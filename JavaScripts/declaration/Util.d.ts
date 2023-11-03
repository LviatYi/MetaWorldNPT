// interface Array<T> {
//     /**
//      * 移除数组中predicate为true的第一个元素的索引，-1
//      * 否则。
//      * @param predicate 为数组的每个元素调用 predicate 一次，按升序排列
//      *      顺序，直到它找到predicate返回 true 的一个。如果找到这样的元素，
//      *      删除。否则，不做处理。
//      * @param thisArg 如果提供，它将用作每次调用的 this 值
//      *      谓词。如果未提供，则使用 undefined 代替。
//      */
//     remove(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): boolean;
// }

// declare interface Vector {
//     newWithX(value: number): Vector;
//
//     newWithY(value: number): Vector;
//
//     newWithZ(value: number): Vector;
// }