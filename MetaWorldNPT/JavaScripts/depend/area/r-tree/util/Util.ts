/**
 * 无排序的数组元素移除.
 * @param {unknown[]} arr
 * @param {number} indexes
 */
export function removeItemByIndex(arr: unknown[], ...indexes: number[]) {
    indexes.sort((a, b) => b - a);
    indexes.forEach(index => {
        if (index < 0 || index >= arr.length) {
            return;
        }

        arr[index] = arr[arr.length - 1];
        arr.pop();
    });
}

// /**
//  * 排序的数组元素移除.
//  * @param {unknown[]} arr
//  * @param {number} indexes
//  */
// export function removeItemByIndex(arr: unknown[], ...indexes: number[]) {
//     indexes.sort((a, b) => b - a);
//     indexes.forEach(index => {
//         if (index < 0 || index >= arr.length) {
//             return;
//         }
//
//         arr.splice(index, 1);
//     });
// }