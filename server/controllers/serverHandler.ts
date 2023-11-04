import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function serverHandler(io: Server, socket: Socket): void {
    const serverRestart = (data: any) => {
        console.log(`serverRestart ${data.roomId}`)
        const roomId = data.roomId;
        const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
        const playersInRoom = users.filter((user) => user.roomId === roomId);

        playersInRoom.forEach((playerInRoom) => {
            playerInRoom.score = 0;
            playerInRoom.ready = false;
            playerInRoom.P1 = false;
        });

        rooms[roomIndex].round = 1;

        io.to(roomId).emit('restart');
    }

    socket.on('server_restart', serverRestart);
}