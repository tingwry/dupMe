import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function findPlayer(io: Server, socket: Socket): void {
    const userIndex = users.findIndex((user) => user.sid === socket.id);
    if (userIndex !== -1) {
        const roomId = users[userIndex].roomId;
        const playersInRoom = users.filter((user) => user.roomId === roomId);

        playersInRoom.forEach((player) => {
            if (player.sid === socket.id) {
                socket.emit('me', { name: player.name, score: player.score });
            } else {
                socket.emit('opponent', { name: player.name, score: player.score });
            }
        });

    }
}