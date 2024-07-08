import GodModService, { addGMCommand } from "./GodModService";
import Gtk from "gtoolkit";
import Log4Ts from "mw-log4ts";

export function registerCommonCommands() {
    addGMCommand("所有玩家信息 | G",
        "void",
        () => {
            Log4Ts.log(GodModService, `All player:`);
            mw.Player.getAllPlayers().forEach((player) => {
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
            const target = mw.Player.getPlayer(params);
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
                validator: (param) => !!mw.Player.getPlayer(param),
            }],
        },
        "GodMod",
    );

    addGMCommand("传送至 Ta | G",
        "string",
        undefined,
        (player, params) => {
            const target = mw.Player.getPlayer(params);
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
                validator: (param) => !!mw.Player.getPlayer(param),
            }],
        },
        "GodMod",
    );

    addGMCommand("踢出游戏 | G",
        "string",
        undefined,
        (player, params) => {
            const target = mw.Player.getPlayer(params);
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
                validator: (param) => !!mw.Player.getPlayer(param),
            }],
        },
        "GodMod",
    );

    addGMCommand("查看当前位置 | G",
        "string",
        (guid: string) => {
            if (!Gtk.isNullOrEmpty(guid)) {
                const target = mw.GameObject.findGameObjectById(guid);

                if (target) {
                    Log4Ts.log(GodModService,
                        `position of target whose guid is ${guid}:`,
                        target.worldTransform.position);
                } else {
                    Log4Ts.log(registerCommonCommands, `guid ${guid} not found.`);
                }
            }
            Log4Ts.log(GodModService,
                `Current player position:`,
                mw.Player.localPlayer.character.worldTransform.position);
        },
        undefined,
        {label: "guid 可不填 同时输出玩家"},
        "GodMod",
    );

    addGMCommand("查看当前旋转 | G",
        "string",
        (guid: string) => {
            if (!Gtk.isNullOrEmpty(guid)) {
                const target = mw.GameObject.findGameObjectById(guid);

                if (target) {
                    Log4Ts.log(GodModService,
                        `rotation of target whose guid is ${guid}:`,
                        target.worldTransform.rotation);
                } else {
                    Log4Ts.log(registerCommonCommands, `guid ${guid} not found.`);
                }
            }
            Log4Ts.log(GodModService,
                `Current player rotation:`,
                mw.Player.localPlayer.character.worldTransform.rotation);
        },
        undefined,
        {label: "guid 可不填 同时输出玩家"},
        "GodMod",
    );

    addGMCommand("跳转房间 | G",
        "string",
        undefined,
        (player, roomId) => {
            mw.TeleportService.asyncTeleportToRoom(roomId, [player.userId], {})
                .then((reason) => {
                    switch (reason.status) {
                        case mw.TeleportStatus.success:
                            break;
                        case mw.TeleportStatus.error:
                        case mw.TeleportStatus.timeout:
                        case mw.TeleportStatus.ignored:
                            Log4Ts.error(GodModService,
                                `Jump to room failed.`,
                                `roomId: ${roomId}`,
                                `status: ${reason.status}`,
                                `users: ${reason.userIds}`,
                                `error code: ${reason.errorCode}`,
                                `reason: ${reason.message}`);

                            throw new Error(reason.message);
                    }
                });
        },
        undefined,
        "GodMod",
    );

    addGMCommand("行走速度 | G",
        "number",
        () => {
            const player = mw.Player.localPlayer;
            Log4Ts.log(GodModService,
                `current walk speed: ${player.character.maxWalkSpeed}`,
                `current acceleration: ${player.character.maxAcceleration}`,
            );
        },
        (player, params) => {
            if (Number.isNaN(params) || params <= 0) return;

            player.character.maxWalkSpeed = params;
            player.character.maxAcceleration = params * 2;
        },
        undefined,
        "GodMod",
    );
}