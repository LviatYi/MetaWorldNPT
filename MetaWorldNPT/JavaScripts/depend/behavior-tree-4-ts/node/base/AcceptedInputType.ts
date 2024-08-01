export const AcceptedInputTypeExceptObject = [{
    name: "number",
    value: "number",
}, {
    name: "string",
    value: "string",
}, {
    name: "boolean",
    value: "boolean",
}] as const;

export const AcceptedInputType = [{
    name: "object",
    value: "object",
}, ...AcceptedInputTypeExceptObject] as const;

export type AcceptedInputTypes = typeof AcceptedInputType[number]["value"]

export type AcceptedInputTypesExceptObject = Exclude<typeof AcceptedInputType[number]["value"], "object">;

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