import { BuryEventDefine, BuryEventInferParams, BuryEventInfo, BuryEventTypes } from "./BuryEventDefine";

/**
 * 根据提供的特定信息生成埋点事件信息.
 * @param {T} eventType
 * @param {BuryEventInferParams<T>} params
 * @return {BuryEventInfo<T>}
 */
export function generateBuryEventInfo<T extends BuryEventTypes>(
    eventType: T,
    params: BuryEventInferParams<T>)
    : BuryEventInfo<T> {
    const obj = {
        name: BuryEventDefine[eventType].name,
        desc: BuryEventDefine[eventType].desc,
        params,
    };

    return obj as BuryEventInfo<T>;
}