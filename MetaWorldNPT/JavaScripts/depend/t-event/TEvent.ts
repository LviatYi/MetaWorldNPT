/**
 * Type of event name TEvent support.
 * 支持的事件名称类型.
 */
export type EventNameTypes = string | number | symbol;

/**
 * event name in EventDef.
 */
export type EventNameDef<EvtDef> = keyof EvtDef;

/**
 * event parameter type in EventDef.
 */
export type EventParamDef<EvtDef, N extends EventNameDef<EvtDef>> = EvtDef[N] extends Array<unknown> ?
    EvtDef[N] :
    [EvtDef[N]];

/**
 * Dispatcher handler.
 */
export type Dispatcher<DR = void> =
    (evtName: EventNameTypes, ...param: unknown[]) => DR;

/**
 * Dispatcher handler with identity.
 */
export type DispatcherWithId<ID, DR = void> =
    (id: ID, evtName: EventNameTypes, ...param: unknown[]) => DR;

/**
 * Subscriber handler.
 */
export type Subscriber<SR = void> =
    (evtName: EventNameTypes, callback: (...params: unknown[]) => unknown) => SR;

/**
 * Subscriber handler whose callback handles an ID.
 */
export type SubscriberHandleId<ID, SR = void> =
    (evtName: EventNameTypes, callback: (id: ID, ...params: unknown[]) => unknown) => SR;

/**
 * Subscriber handler with identity.
 */
export type SubscriberFromId<ID, SR = void> =
    (id: ID, evtName: EventNameTypes, callback: (...params: unknown[]) => unknown) => SR;

/**
 * Event callback.
 */
export type TEventCallback<EvtDef, N extends keyof EvtDef> =
    (...params: EventParamDef<EvtDef, N>) => unknown;

/**
 * Event callback with identity.
 */
export type TEventCallbackIdentified<EvtDef, N extends keyof EvtDef, ID> =
    (id: ID, ...params: EventParamDef<EvtDef, N>) => unknown;

/**
 * 订阅事件构建器.
 * @desc curry 柯里化风格调用.
 * @return {<N extends EventNameDef<EvtDef>, SR>
 *     (subscriber: Subscriber<SR>, eventName: N, callback: CB) => SR}
 */
export function subscribePkgWithEventDef<EvtDef>() {
    return function <
        N extends EventNameDef<EvtDef>,
        SR,
        CB extends TEventCallback<EvtDef, N> |
            TEventCallbackIdentified<EvtDef, N, unknown>>(
        subscriber: Subscriber<SR>,
        eventName: N,
        callback: CB): SR {
        return subscriber(eventName, callback);
    };
}

/**
 * 发布事件构建器.
 * @return {<N extends EventNameDef<EvtDef>, DR>
 *     (dispatcher: Dispatcher<DR>, eventName: N, ...params: EventParamDef<EvtDef, N>) => DR}
 */
export function dispatchPkgWithEventDef<EvtDef>() {
    return function <N extends EventNameDef<EvtDef>, DR>(
        dispatcher: Dispatcher<DR>,
        eventName: N,
        ...params: EventParamDef<EvtDef, N>)
        : DR {
        return dispatcher(eventName, ...params);
    };
}

/**
 * 发布特定身份的事件构建器.
 * @return {<N extends EventNameDef<EvtDef>, ID, DR>
 *     (dispatcher: DispatcherWithId<ID, DR>, id: ID, eventName: N, ...params: EventParamDef<EvtDef, N>) => DR}
 */
export function dispatchToIdPkgWithEventDef<EvtDef>() {
    return function <N extends EventNameDef<EvtDef>, ID, DR>(
        dispatcher: DispatcherWithId<ID, DR>,
        id: ID,
        eventName: N,
        ...params: EventParamDef<EvtDef, N>)
        : DR {
        return dispatcher(id, eventName, ...params);
    };
}

/**
 * 以类型封装地 订阅事件.
 * @param {Subscriber<SR>} subscriber
 * @param {N} eventName
 * @param {(...params: EventParamDef<EvtDef, N>) => void} callback
 * @return {SR}
 */
export function subscribePkg<EvtDef, N extends EventNameDef<EvtDef>, SR = void>(
    subscriber: Subscriber<SR>,
    eventName: N,
    callback: TEventCallback<EvtDef, N>): SR {
    return subscriber(eventName, callback);
}

/**
 * 以类型封装地 订阅来自特定身份的事件.
 * @param {SubscriberFromId<SR>} subscriber
 * @param {ID} id
 * @param {N} eventName
 * @param {TEventCallbackIdentified<EvtDef, N, ID>} callback
 * @return {SR}
 */
export function subscribePkgFromID<EvtDef, N extends EventNameDef<EvtDef>, ID, SR = void>(
    subscriber: SubscriberFromId<ID, SR>,
    eventName: N,
    id: ID,
    callback: TEventCallbackIdentified<EvtDef, N, ID>): SR {
    return subscriber(id, eventName, callback);
}

/**
 * 以类型封装地 订阅来自未知身份的事件.
 * @param {SubscriberFromId<SR>} subscriber
 * @param {N} eventName
 * @param {TEventCallbackIdentified<EvtDef, N, ID>} callback
 * @return {SR}
 */
export function subscribePkgWithID<EvtDef, N extends EventNameDef<EvtDef>, ID, SR = void>(
    subscriber: SubscriberHandleId<ID, SR>,
    eventName: N,
    callback: TEventCallbackIdentified<EvtDef, N, ID>): SR {
    return subscriber(eventName, callback);
}

/**
 * 以类型封装地 发布事件.
 * @param {Dispatcher<DR>} dispatcher
 * @param {N} eventName
 * @param {EventParamDef<EvtDef, N>} params
 * @return {DR}
 */
export function dispatchPkg<EvtDef, N extends EventNameDef<EvtDef>, DR>(
    dispatcher: Dispatcher<DR>,
    eventName: N,
    ...params: EventParamDef<EvtDef, N>)
    : DR {
    return dispatcher(eventName, ...params);
}

/**
 * 以类型封装地 带有特定身份地 发布事件.
 * @param {DispatcherWithId<ID, DR>} dispatcher
 * @param {N} eventName
 * @param {ID} id 身份识别.
 * @param {EventParamDef<EvtDef, N>} params
 * @return {DR}
 */
export function dispatchPkgWithID<EvtDef, N extends EventNameDef<EvtDef>, ID, DR>(
    dispatcher: DispatcherWithId<ID, DR>,
    eventName: N,
    id: ID,
    ...params: EventParamDef<EvtDef, N>)
    : DR {
    return dispatcher(id, eventName, ...params);
}
