import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";
import { serverUpdatePlayerInRoom } from "./playerController";

export function serverHandler(io: Server, socket: Socket): void {
    const serverUsers = () => {
        console.log('server called users')
        io.emit('users', users)
    }

    const serverRestart = (data: any) => {
        console.log(`serverRestart ${data.roomId}`)
        const roomId = data.roomId;
        const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
        const playersInRoom = users.filter((user) => user.roomId === roomId);

        // set new properties
        playersInRoom.forEach((playerInRoom) => {
            playerInRoom.score = 0;
            playerInRoom.ready = false;
            playerInRoom.P1 = false;
        });

        rooms[roomIndex].round = 0;

        // send info to client
        serverUpdatePlayerInRoom(io, socket, roomId)
        io.to(roomId).emit('restart', { round: 0 });
        io.to(roomId).emit('ready_state', false);
    }

    socket.on('server_users', serverUsers)
    socket.on('server_restart', serverRestart);
}