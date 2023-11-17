/**
 * throw when param need an Integer but receive a float.
 * 让 NotAnIntegerError 狠狠地敲你的脑袋！
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 *
 * @author LviatYi
 * @version 1.0.0
 */
class NotAnIntegerError extends Error {
    constructor(message: string = "Param need a Integer") {
        super();
        this.name = "NotAnIntegerError";
    }
}

/**
 * throw when param out of byte range.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 *
 * @author LviatYi
 * @version 1.0.0
 */
class ValueOutOfByteRangeError extends Error {
    constructor(val: number, message: string = "Param to large") {
        super(`${message}, got a ${val}`);
        this.name = "ValueOutOfByteRangeError";
    }
}

/**
 * ByteArray.
 * Allows you to determine the number of bits occupied by each element.
 *
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 *
 * @author LviatYi
 * @version 1.0.2
 */
export default class ByteArray {
    /**
     * the number of bits occupied by each element.
     */
    public readonly elementSize: number;
    /**
     * the number of elements in the array.
     */
    public readonly count: number;

    private readonly _bits: Uint8Array;
    private readonly ELEMENT_SIZE_IN_ORIGIN_ARRAY: number = 0x8 * Uint8Array.BYTES_PER_ELEMENT;

    /**
     * ByteArray.
     *
     * @param count
     * @param byteLength default 1 as a boolean. which means this
     * is a bit array.
     */
    constructor(count: number, byteLength: number = 1) {
        if (count != Math.floor(count) || byteLength != Math.floor(byteLength)) {
            throw new NotAnIntegerError();
        }

        this.count = count;
        this.elementSize = byteLength;
        this._bits = new Uint8Array(Math.ceil(count * byteLength / this.ELEMENT_SIZE_IN_ORIGIN_ARRAY));
    }

    private get length(): number {
        return Math.ceil(this.count * this.elementSize / this.ELEMENT_SIZE_IN_ORIGIN_ARRAY);
    }

    /**
     * show data as it is in memory.
     */
    public showMemory(): void {
        for (let i = 0; i < this.length; i++) {
            let line: string = "";
            for (let j = 0; j < this.ELEMENT_SIZE_IN_ORIGIN_ARRAY; j++) {
                line += ((this._bits[i] & 1 << j) > 0 ? 1 : 0).toString();
                if ((j + 1) * 2 == this.ELEMENT_SIZE_IN_ORIGIN_ARRAY) {
                    line += " ";
                }
            }
            console.log(line);
        }
    }

    /**
     * get value by index
     * @param index
     */
    public getValue(index: number): number {
        index |= 0;

        let bitIndex: number = index * this.elementSize;

        if (this.length <= Math.floor((bitIndex + this.elementSize) / this.ELEMENT_SIZE_IN_ORIGIN_ARRAY)) {
            return 0;
        }

        let ans: number = 0;
        for (let i = this.elementSize - 1; i >= 0; --i) {
            ans <<= 1;
            ans += (this._bits[Math.floor((bitIndex + i) / this.ELEMENT_SIZE_IN_ORIGIN_ARRAY)] &
                (0x1 << ((bitIndex + i) % this.ELEMENT_SIZE_IN_ORIGIN_ARRAY))) > 0 ? 1 : 0;
        }
        return ans;
    }

    /**
     * set value by index
     * @param index
     * @param val
     * @throws ValueOutOfByteRangeError if val >= 2^elementSize
     */
    public setValue(index: number, val: boolean | number): void {
        index |= 0;
        if (typeof val === "number") {
            val |= 0;
        }

        index = Math.floor(index);
        let newVal: number = typeof val === "boolean" ? (val ? 1 : 0) : Math.floor(val);
        if (newVal > (1 << this.elementSize)) {
            throw new ValueOutOfByteRangeError(newVal);
        }

        let bitIndex: number = index * this.elementSize;
        let page: number = Math.floor(bitIndex / this.ELEMENT_SIZE_IN_ORIGIN_ARRAY);

        for (let i = this.ELEMENT_SIZE_IN_ORIGIN_ARRAY - 1; i >= 0; --i) {
            if (newVal & 0x1 << i) {
                this._bits[page] |= 0x1 << (bitIndex + i) % this.ELEMENT_SIZE_IN_ORIGIN_ARRAY;
            } else {
                this._bits[page] &= ~(0x1 << (bitIndex + i) % this.ELEMENT_SIZE_IN_ORIGIN_ARRAY);
            }
        }
    }

    /**
     * for each element, call the callback with element as param.
     * @param callback
     */
    public forEach(callback: (item: number) => void) {
        for (let i = 0; i < this.count; i++) {
            callback(this.getValue(i));
        }
    }

    //TODO_LviatYi serialize to string

    //TODO_LviatYi deserialize from string
}