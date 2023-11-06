import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function findMe(io: Server, socket: Socket): void {
    const me = users.find((user) => (user.sid === socket.id));
    if (me) {
        const myName = me.name;
        const myScore = me.score;
        socket.emit('me', { name: myName, score: myScore });
    }
}

export function updatePlayerInRoom(io: Server, socket: Socket, roomId: string): void {
    const me = users.find((user) => (user.roomId === roomId) && (user.sid === socket.id));
    const opponent = users.find((user) => (user.roomId === roomId) && (user.sid !== socket.id));
    let myName = "";
    let myScore = 0;
    let opponentName = "";
    let opponentScore = 0;
    let playerCount = 0;

    if (me) { // im still in the room
        myName = me.name;
        myScore = me.score;
        playerCount++;

        // send my info to me
        socket.emit('me', { name: myName, score: myScore });
    }
    if (opponent) { // opponent still in the room
        const opponentSid = opponent.sid;
        opponentName = opponent.name;
        opponentScore = opponent.score;
        playerCount++;

        // send my info to opponent
        io.to(opponentSid).emit('opponent', { name: myName, score: myScore })
    }
    if (me && opponent) { // both still in the room
        // send opponent's info to me
        socket.emit('opponent', { name: opponentName, score: opponentScore });
    }

    const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
    if (roomIndex !== -1) {
        if (rooms[roomIndex].players !== playerCount) { // a player join or leave that room
            rooms[roomIndex].players = playerCount;
            rooms[roomIndex].round = 0;
            io.to(roomId).emit('restart', { round: 0 });
        }
    }
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