import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";
import { serverUpdatePlayerInRoom } from "./playerController";
import { serverRestartRoom, serverUsers } from "./ServerController";

export function serverHandler(io: Server, socket: Socket): void {
    socket.on('server_users', (data) => {
        serverUsers(io, socket);
    })

    socket.on('server_restart', (data) => {
    serverRestartRoom(io, socket, data.roomId)});
}