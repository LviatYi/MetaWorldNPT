import { TEvt4Mw } from "./TEvt4MW";
import { dispatchPkgWithEventDef } from "../TEvent";
import Log4Ts from "mw-log4ts/Log4Ts";

//#region TDD
type EventDef = {
    "EventA": number;
    "EventB": string;
    "EventC": {
        int: number,
        str: string,
    };
    "EventD": [
        number,
        string,
    ];
}

function dispatch(eventName: string, ...params: unknown[]): boolean {
    return true;
}

dispatchPkgWithEventDef<EventDef>()(dispatch, "EventA", 1); // true
// dispatchPkgWithEventDef<EventDef>()(dispatch, "EventA", 1, 2); // false
dispatchPkgWithEventDef<EventDef>()(dispatch, "EventB", "str"); // true
// dispatchPkgWithEventDef<EventDef>()(dispatch, "EventB", 1); // false
dispatchPkgWithEventDef<EventDef>()(dispatch, "EventC", {
    int: 1,
    str: "str",
}); // true
// dispatchPkgWithEventDef<EventDef>()(dispatch, "EventC", 1); // false
// dispatchPkgWithEventDef<EventDef>()(dispatch, "EventC", [{
//     int: 1,
//     str: "str",
// }]); // false
dispatchPkgWithEventDef<EventDef>()(dispatch, "EventD", 1, "str"); // true
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄

//#region TDD

const TEvent = new TEvt4Mw<EventDef>();

if (mw.SystemUtil.isClient()) {
    TEvent.addLocalListener("EventA", (int: number) => {
        Log4Ts.log({name: "TEventTest"}, int);
    });

    TEvent.addServerListener("EventD", (int, str) => {
        Log4Ts.log({name: "TEventTest"}, `server: `, int, str);
    });

    mw.setTimeout(() => {
            TEvent.dispatchToLocal("EventA", 10);

            TEvent.dispatchToServer("EventD", 10, "hello");
        },
        3e3);
}

if (mw.SystemUtil.isServer()) {
    TEvent.addClientListener("EventD", (player, int, str) => {
        Log4Ts.log({name: "TEventTest"}, `${player.playerId}: `, int, str);
    });

    mw.setTimeout(() => {
            TEvent.dispatchToClient(mw.Player.getAllPlayers()[0], "EventD", 10, "hello");
        },
        3e3);
}
//#endregion ⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠐⠒⠒⠒⠒⠚⠛⣿⡟⠄⠄⢠⠄⠄⠄⡄⠄⠄⣠⡶⠶⣶⠶⠶⠂⣠⣶⣶⠂⠄⣸⡿⠄⠄⢀⣿⠇⠄⣰⡿⣠⡾⠋⠄⣼⡟⠄⣠⡾⠋⣾⠏⠄⢰⣿⠁⠄⠄⣾⡏⠄⠠⠿⠿⠋⠠⠶⠶⠿⠶⠾⠋⠄⠽⠟⠄⠄⠄⠃⠄⠄⣼⣿⣤⡤⠤⠤⠤⠤⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄