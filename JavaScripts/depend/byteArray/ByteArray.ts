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
 * @version 1.0.8
 */
export default class ByteArray {
    /**
     * the number of bits occupied by each element.
     */
    public readonly elementSize: number;
    /**
     * the number of elements in the array.4
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
     * create a {@link ByteArray} from a byte string.
     * @param str
     * @param byteLength
     */
    public static from(str: string, byteLength: number = 1): ByteArray {
        let result: ByteArray = new ByteArray(str.length / byteLength | 0, byteLength);

        for (let i = 0; i < str.length / byteLength; ++i) {
            let value: number = 0;
            for (let j = byteLength - 1; j >= 0; --j) {
                value <<= 1;
                value += str[i * byteLength + j] === "1" ? 1 : 0;
            }
            result.setValue(i, value);
        }

        return result;
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
        index = index | 0;

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
        index = index | 0;
        if (typeof val === "number") {
            val = val | 0;
        }
        if (typeof val === "boolean") {
            val = val ? 1 : 0;
        }

        if (val > (1 << this.elementSize)) {
            throw new ValueOutOfByteRangeError(val);
        }

        let bitIndex: number = index * this.elementSize;

        for (let i = this.elementSize - 1; i >= 0; --i) {
            if (val & 0x1 << i) {
                this._bits[(bitIndex + i) / this.ELEMENT_SIZE_IN_ORIGIN_ARRAY | 0] =
                    this._bits[(bitIndex + i) / this.ELEMENT_SIZE_IN_ORIGIN_ARRAY | 0]
                    | 0x1 << (bitIndex + i) % this.ELEMENT_SIZE_IN_ORIGIN_ARRAY;
            } else {
                this._bits[(bitIndex + i) / this.ELEMENT_SIZE_IN_ORIGIN_ARRAY | 0] =
                    this._bits[(bitIndex + i) / this.ELEMENT_SIZE_IN_ORIGIN_ARRAY | 0]
                    & ~(0x1 << (bitIndex + i) % this.ELEMENT_SIZE_IN_ORIGIN_ARRAY);
            }
        }
    }

    /**
     * for each element, call the callback with element as param.
     * @param callback
     */
    public forEach(callback: (item: number) => void): void {
        for (let i = 0; i < this.count; ++i) {
            callback(this.getValue(i));
        }
    }

    /**
     * fill by value index.
     * @param val
     * @param start
     * @param end
     */
    public fill(val: number, start: number = 0, end: number = this.count): this {
        for (let i = start; i < end; ++i) {
            this.setValue(i, val);
        }

        return this;
    }

    /**
     * count value in {@link ByteArray}.
     * @param value
     */
    public countValue(value: boolean | number = true): number {
        if (typeof value === "boolean") {
            value = value ? 1 : 0;
        }

        let result = 0;
        for (let i = 0; i < this.count; ++i) {
            if (this.getValue(i) === value) ++result;
        }

        return result;
    }

    /**
     * get all index who equals value.
     * @param value
     */
    public getIndexes(value: boolean | number = true): number[] {
        if (typeof value === "boolean") {
            value = value ? 1 : 0;
        }

        let result: number[] = [];

        for (let i = 0; i < this.count; ++i) {
            if (this.getValue(i) === value) result.push(i);
        }

        return result;
    }

    /**
     * to byte string.
     */
    public toString(): string {
        let line: string = "";

        for (let i = 0; i < this.length; ++i) {
            let end = i === this.length - 1 ? this.count * this.elementSize % this.ELEMENT_SIZE_IN_ORIGIN_ARRAY : this.ELEMENT_SIZE_IN_ORIGIN_ARRAY;
            for (let j = 0; j < end; ++j) {
                line += ((this._bits[i] & 1 << j) > 0 ? 1 : 0).toString();
            }
        }
        return line;
    }
}