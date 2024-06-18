import GodModService, { addGMCommand } from "./GodModService";
import Log4Ts from "mw-log4ts/Log4Ts";

addGMCommand("所有玩家信息 | G",
    "void",
    () => {
        Log4Ts.log(GodModService, `All player:`);
        Player.getAllPlayers().forEach((player) => {
            Log4Ts.log(undefined,
                `displayName: ${player.character.displayName}`,
                `nickName: ${player.nickname}`,
                `userId: ${player.userId}`,
                `playerId: ${player.playerId}`,
                `position: ${player.character.worldTransform.position}`,
                `walkSpeed: ${player.character.maxWalkSpeed}`,
                `currentState: ${mw.CharacterStateType[player.character.getCurrentState()]}`,
                `--------------------------------------------------`,
            );
        });
    },
    undefined,
    undefined,
    "GodMod",
);

addGMCommand("传送 | G",
    "vector",
    undefined,
    (player, params) => {
        player.character.worldTransform.position = params;
    },
    undefined,
    "GodMod",
);

addGMCommand("传送至我 | G",
    "string",
    undefined,
    (player, params) => {
        const target = Player.getPlayer(params);
        if (!target) {
            Log4Ts.error(GodModService, `Player not exist. userid: ${params}`);
            throw Error();
        }

        target.character.worldTransform.position = player.character.worldTransform.position.clone();
    },
    {
        label: "UserId",
        validator: [{
            reason: "用户不存在",
            validator: (param) => !!Player.getPlayer(param),
        }],
    },
    "GodMod",
);

addGMCommand("传送至 Ta | G",
    "string",
    undefined,
    (player, params) => {
        const target = Player.getPlayer(params);
        if (!target) {
            Log4Ts.error(GodModService, `Player not exist. userid: ${params}`);
            throw Error();
        }

        player.character.worldTransform.position = target.character.worldTransform.position.clone();
    },
    {
        label: "UserId",
        validator: [{
            reason: "用户不存在",
            validator: (param) => !!Player.getPlayer(param),
        }],
    },
    "GodMod",
);

addGMCommand("踢出游戏 | G",
    "string",
    undefined,
    (player, params) => {
        const target = Player.getPlayer(params);
        if (!target) {
            Log4Ts.error(GodModService, `Player not exist. userid: ${params}`);
            throw Error();
        }

        mw.RoomService.kick(target, "Kicked by GodMod Admin");
    },
    {
        label: "UserId",
        validator: [{
            reason: "用户不存在",
            validator: (param) => !!Player.getPlayer(param),
        }],
    },
    "GodMod",
);

addGMCommand("当前位置 | G",
    "void",
    () => {
        Log4Ts.log(GodModService,
            `Current player location:`,
            Player.localPlayer.character.worldTransform.position);
    },
    undefined,
    undefined,
    "GodMod",
);

addGMCommand("当前旋转 | G",
    "void",
    () => {
        Log4Ts.log(GodModService,
            `Current player rotation:`,
            Player.localPlayer.character.worldTransform.rotation);
    },
    undefined,
    undefined,
    "GodMod",
);