import { decode, encode } from "uint8-to-b64";
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
    constructor(message = "Param need a Integer") {
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
    constructor(val, message = "Param to large") {
        super(`${message}, got a ${val}`);
        this.name = "ValueOutOfByteRangeError";
    }
}
/**
 * ByteArray.
 * @desc Allows you to determine the number of bits occupied by each element.
 * @desc use
 * @desc {@link createInstance} or
 * @desc {@link fromByteString} or
 * @desc {@link fromString}
 * @desc to create a new instance.
 *
 * @desc example-ByteArray (value)
 * @desc 0,1,2,3,4,5
 *
 * @desc example-ByteArray (memory)
 * @desc 000 0.01 01|0 011.
 * @desc 100 1|01 00.0 000|
 *
 * @desc example-ByteArray (string in ASCII)
 * @desc  
 * @desc 0  1  2  3  4  5
 * @desc ---
 * ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟
 * ⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄
 * ⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄
 * ⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄
 * ⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
 *
 * @author LviatYi
 * @version 2.0.4
 */
export default class ByteArray {
    //#region Constant
    static ELEMENT_SIZE_IN_ORIGIN_ARRAY = 0x8 * Uint8Array.BYTES_PER_ELEMENT;
    static CHUNK_SIZE = 1024;
    //#endregion
    /**
     * the number of bits occupied by each element.
     */
    elementSize;
    /**
     * the number of elements in the array.
     */
    count;
    _bits;
    /**
     * ByteArray.
     *
     * @param count
     * @param byteLength
     *      default 1. as a boolean. which means this is a bit array.
     * @param content
     */
    constructor(count, byteLength = 1, content = undefined) {
        if (count !== (count | 0) || byteLength !== (byteLength | 0)) {
            throw new NotAnIntegerError();
        }
        if (byteLength >= (1 << 5) - 1) {
            throw new ValueOutOfByteRangeError(byteLength, "byte length can't be larger than 30");
        }
        this.count = count;
        this.elementSize = byteLength;
        this._bits = content || new Uint8Array(this.length);
    }
    /**
     * equal to length of {@link ByteArray._bits}.
     * @private
     */
    get length() {
        return Math.ceil(this.count * this.elementSize / ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY);
    }
    /**
     * create a {@link ByteArray}.
     * @param count
     * @param byteLength byte length of each element.
     */
    static createInstance(count, byteLength = 1) {
        return new ByteArray(count, byteLength);
    }
    /**
     * create a {@link ByteArray} from a byte string.
     * @param str
     * @param byteLength byte length of each element.
     */
    static fromByteString(str, byteLength = 1) {
        let result = new ByteArray(str.length / byteLength | 0, byteLength);
        for (let i = 0; i < str.length / byteLength; ++i) {
            let value = 0;
            for (let j = byteLength - 1; j >= 0; --j) {
                value <<= 1;
                value += str[i * byteLength + j] === "1" ? 1 : 0;
            }
            result.setValue(i, value);
        }
        return result;
    }
    /**
     * create a {@link ByteArray} from string.
     * @param str
     * @param count count of elements.
     * you should fill in this parameter to prevent **tail noise**.
     * - **tail noise**: the noise at the end of the string. when the bit count of element < the bit count of element in Uint8Array, it may happen.
     * example:
     * data we want:
     * |011 010 01|
     * |1 --- --- -|
     * data we read:
     * |011 010 01|
     * |1 000 000 -|
     * @param byteLength byte length of each element.
     */
    static fromString(str, count = undefined, byteLength = 1) {
        const byteArray = new Uint8Array(str.split("").map(char => char.charCodeAt(0) % 256));
        if (count === undefined)
            count = (byteArray.length * ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY / byteLength) | 0;
        return new ByteArray(count, byteLength, byteArray);
    }
    /**
     * create a {@link ByteArray} from base64 string.
     * @param str
     * @param count count of elements.
     * you should fill in this parameter to prevent **tail noise**.
     * - **tail noise**: the noise at the end of the string. when the bit count of element < the bit count of element in Uint8Array, it may happen.
     * example:
     * data we want:
     * |011 010 01|
     * |1 --- --- -|
     * data we read:
     * |011 010 01|
     * |1 000 000 -|
     * @param byteLength byte length of each element.
     */
    static fromBase64(str, count = undefined, byteLength = 1) {
        const byteArray = decode(str);
        if (count === undefined)
            count = (byteArray.length * ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY / byteLength) | 0;
        return new ByteArray(count, byteLength, byteArray);
    }
    /**
     * show data as it is in memory.
     */
    showMemory() {
        for (let i = 0; i < this.length; i++) {
            let line = "";
            for (let j = 0; j < ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY; j++) {
                line += ((this._bits[i] & 1 << j) > 0 ? 1 : 0).toString();
                if ((j + 1) * 2 == ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY) {
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
    getValue(index) {
        index = index | 0;
        let bitIndex = index * this.elementSize;
        if (this.length < Math.floor((bitIndex + this.elementSize) / ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY)) {
            return 0;
        }
        let ans = 0;
        for (let i = this.elementSize - 1; i >= 0; --i) {
            ans <<= 1;
            ans += (this._bits[Math.floor((bitIndex + i) / ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY)] &
                (0x1 << ((bitIndex + i) % ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY))) > 0 ? 1 : 0;
        }
        return ans;
    }
    /**
     * set value by index
     * @param index
     * @param val
     * @throws ValueOutOfByteRangeError if val >= 2^elementSize
     */
    setValue(index, val) {
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
        let bitIndex = index * this.elementSize;
        for (let i = this.elementSize - 1; i >= 0; --i) {
            if (val & 0x1 << i) {
                this._bits[(bitIndex + i) / ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY | 0] =
                    this._bits[(bitIndex + i) / ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY | 0]
                        | 0x1 << (bitIndex + i) % ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY;
            }
            else {
                this._bits[(bitIndex + i) / ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY | 0] =
                    this._bits[(bitIndex + i) / ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY | 0]
                        & ~(0x1 << (bitIndex + i) % ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY);
            }
        }
    }
    /**
     * for each element, call the callback with element as param.
     * @param callback
     */
    forEach(callback) {
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
    fill(val, start = 0, end = this.count) {
        for (let i = start; i < end; ++i) {
            this.setValue(i, val);
        }
        return this;
    }
    /**
     * count value in {@link ByteArray}.
     * @param value
     */
    countValue(value = true) {
        if (typeof value === "boolean") {
            value = value ? 1 : 0;
        }
        let result = 0;
        for (let i = 0; i < this.count; ++i) {
            if (this.getValue(i) === value)
                ++result;
        }
        return result;
    }
    /**
     * get all index who equals value.
     * @param value
     */
    getIndexes(value = true) {
        if (typeof value === "boolean") {
            value = value ? 1 : 0;
        }
        let result = [];
        for (let i = 0; i < this.count; ++i) {
            if (this.getValue(i) === value)
                result.push(i);
        }
        return result;
    }
    /**
     * to byte string.
     */
    toByteString() {
        let line = "";
        for (let i = 0; i < this.length; ++i) {
            let end;
            const suffix = this.count * this.elementSize % ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY;
            end = i === this.length - 1 && suffix !== 0 ? suffix : ByteArray.ELEMENT_SIZE_IN_ORIGIN_ARRAY;
            for (let j = 0; j < end; ++j) {
                line += ((this._bits[i] & 1 << j) > 0 ? 1 : 0).toString();
            }
        }
        return line;
    }
    /**
     * to base64 string.
     */
    toBase64() {
        return encode(this._bits);
    }
    /**
     * to string.
     */
    toString() {
        let res = "";
        let chunk = 0x8 * ByteArray.CHUNK_SIZE;
        let i = 0;
        for (; i < this._bits.length / chunk; i++) {
            res += String.fromCharCode.apply(null, this._bits.slice(i * chunk, (i + 1) * chunk));
        }
        res += String.fromCharCode.apply(null, this._bits.slice(i * chunk));
        return res;
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < this.count; ++i) {
            yield this.getValue(i);
        }
    }
}
//# sourceMappingURL=ByteArray.js.map