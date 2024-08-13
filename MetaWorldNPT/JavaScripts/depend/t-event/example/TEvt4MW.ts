import {
    dispatchPkg,
    dispatchPkgWithID,
    EventNameDef,
    EventParamDef,
    subscribePkg,
    subscribePkgWithID,
    TEventCallback,
    TEventCallbackIdentified,
} from "../TEvent";

/**
 * 事件管理器 MW 特供版.
 * @desc 需要实例化后使用.
 */
export class TEvt4Mw<EvtDef> {
    addLocalListener<N extends EventNameDef<EvtDef>>(
        eventName: N,
        callback: TEventCallback<EvtDef, N>): EventListener {
        return subscribePkg(mw.Event.addLocalListener, eventName, callback);
    };

    addClientListener<N extends EventNameDef<EvtDef>>(
        eventName: N,
        callback: TEventCallbackIdentified<EvtDef, N, mw.Player>): mw.EventListener {
        return subscribePkgWithID<EvtDef, N, mw.Player, mw.EventListener>(mw.Event.addClientListener,
            eventName,
            callback);
    }

    addServerListener<N extends EventNameDef<EvtDef>>(
        eventName: N,
        callback: TEventCallback<EvtDef, N>): EventListener {
        return subscribePkg(mw.Event.addServerListener,
            eventName,
            callback);
    }

    addSceneEventListener(eventName: string, callback: (data: string) => void): mw.EventListener {
        return mw.Event.addSceneEventListener(eventName, callback);
    }

    addGameEventListener(eventName: string, callback: (data: string) => void): mw.EventListener {
        return mw.Event.addGameEventListener(eventName, callback);
    }

    dispatchToLocal<N extends EventNameDef<EvtDef>>(
        eventName: N,
        ...params: EventParamDef<EvtDef, N>): mw.DispatchEventResult {
        return dispatchPkg<EvtDef, N, mw.DispatchEventResult>(
            mw.Event.dispatchToLocal,
            eventName,
            ...params);
    };

    dispatchToClient<N extends EventNameDef<EvtDef>>(
        player: mw.Player,
        eventName: N,
        ...params: EventParamDef<EvtDef, N>): mw.DispatchEventResult {
        return dispatchPkgWithID<EvtDef, N, mw.Player, mw.DispatchEventResult>(
            mw.Event.dispatchToClient,
            eventName,
            player,
            ...params);
    }

    dispatchToServer<N extends EventNameDef<EvtDef>>(
        eventName: N,
        ...params: EventParamDef<EvtDef, N>): mw.DispatchEventResult {
        return dispatchPkg<EvtDef, N, mw.DispatchEventResult>(
            mw.Event.dispatchToServer,
            eventName,
            ...params);
    }

    dispatchToServerUnreliable<N extends EventNameDef<EvtDef>>(
        eventName: N,
        ...params: EventParamDef<EvtDef, N>): mw.DispatchEventResult {
        return dispatchPkg<EvtDef, N, mw.DispatchEventResult>(
            mw.Event.dispatchToServerUnreliable,
            eventName,
            ...params);
    }

    dispatchToClientUnreliable<N extends EventNameDef<EvtDef>>(
        player: mw.Player,
        eventName: N,
        ...params: EventParamDef<EvtDef, N>): mw.DispatchEventResult {
        return dispatchPkgWithID<EvtDef, N, mw.Player, mw.DispatchEventResult>(
            mw.Event.dispatchToClientUnreliable,
            eventName,
            player,
            ...params);
    }

    dispatchToAllClient<N extends EventNameDef<EvtDef>>(
        eventName: N,
        ...params: EventParamDef<EvtDef, N>): mw.DispatchEventResult {
        return dispatchPkg<EvtDef, N, mw.DispatchEventResult>(
            mw.Event.dispatchToAllClient,
            eventName,
            ...params);
    }

    dispatchToAllClientUnreliable<N extends EventNameDef<EvtDef>>(
        eventName: N,
        ...params: EventParamDef<EvtDef, N>): mw.DispatchEventResult {
        return dispatchPkg<EvtDef, N, mw.DispatchEventResult>(
            mw.Event.dispatchToAllClientUnreliable,
            eventName,
            ...params);
    }

    dispatchSceneEvent(eventName: string, data: string): void {
        return mw.Event.dispatchSceneEvent(eventName, data);
    }

    dispatchGameEvent(eventName: string, data: string): void {
        return mw.Event.dispatchGameEvent(eventName, data);
    }

    removeListener(event: EventListener): void {
        event && event.disconnect();
    }
}