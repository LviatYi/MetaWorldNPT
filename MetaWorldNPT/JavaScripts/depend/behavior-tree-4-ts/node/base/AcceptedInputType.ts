export const AcceptedInputType = [{
    name: "number",
    value: "number",
}, {
    name: "string",
    value: "string",
}, {
    name: "boolean",
    value: "boolean",
}, {
    name: "object",
    value: "object",
}] as const;

export type AcceptedInputTypes = typeof AcceptedInputType[number]["value"];

/**
 * 反序列化.
 * @param {string} value
 * @param {AcceptedInputTypes} valType
 * @return {unknown}
 */
export function deserializeToAcceptedValue(value: string, valType: AcceptedInputTypes): unknown {
    switch (valType) {
        case "string":
            return String(value);
        case "boolean":
            return value === "1" ||
                value === "true" ||
                /[Yy](es)?$/.test(value);
        case "object":
            try {
                return JSON.parse(value as string);
            } catch (e) {
                return undefined;
            }
        case "number":
        default:
            let val = Number(value);
            if (Number.isNaN(val)) val = 0;

            return val;
    }
}