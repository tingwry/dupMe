import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function serverUsers(io: Server, socket: Socket): void {
    console.log('server called users')
    io.emit('users', users)
}

export function serverUpdatePlayerInRoom(io: Server, socket: Socket, roomId: string): void {
    const playerInRoom = users.filter((user) => (user.roomId === roomId));
    const playerCount = playerInRoom.length;

    if (playerCount === 2) {
        io.to(playerInRoom[0].sid).emit('me', { name : playerInRoom[0].name, score: playerInRoom[0].score})
        io.to(playerInRoom[0].sid).emit('opponent', { name : playerInRoom[1].name, score: playerInRoom[1].score})
        io.to(playerInRoom[1].sid).emit('me', { name : playerInRoom[1].name, score: playerInRoom[1].score})
        io.to(playerInRoom[1].sid).emit('opponent', { name : playerInRoom[0].name, score: playerInRoom[0].score})
    }
}

export function serverRestartRoom(io: Server, socket: Socket, roomId: string) {
    console.log(`serverRestart ${roomId}`);
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