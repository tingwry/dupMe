import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function playerInfo(io: Server, socket: Socket) {
    const userIndex = users.findIndex((user) => user.sid === socket.id);
    if (userIndex !== -1) {
        const roomId = users[userIndex].roomId;
        const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

        if (roomIndex !== -1) {
            return { userIndex: userIndex, roomId: roomId, roomIndex: roomIndex };
        } else {
            console.log("Room not found")
            return { userIndex: userIndex, roomId: roomId, roomIndex: null }
        }
    } else {
        console.log("User not found")
        return { userIndex: null, roomId: null, roomIndex: null }
    }
}

export function updatePlayerInRoom(io: Server, socket: Socket, roomId: string): void {
    const me = users.find((user) => (user.roomId === roomId) && (user.sid === socket.id));
    const opponent = users.find((user) => (user.roomId === roomId) && (user.sid !== socket.id));
    let myName = "";
    let myAvatar = "";
    let myScore = 0;
    let opponentName = "";
    let opponentAvatar = "";
    let opponentScore = 0;
    let playerCount = 0;

    if (me) { // im still in the room
        myName = me.name;
        myAvatar = me.avatar;
        myScore = me.score;
        playerCount++;

        // send my info to me
        socket.emit('me', { name: myName, avatar: myAvatar, score: myScore });
    }
    if (opponent) { // opponent still in the room
        const opponentSid = opponent.sid;
        opponentName = opponent.name;
        opponentAvatar = opponent.avatar;
        opponentScore = opponent.score;
        playerCount++;

        // send my info to opponent
        io.to(opponentSid).emit('opponent', { name: myName, avatar: myAvatar, score: myScore })
    }
    if (me && opponent) { // both still in the room
        // send opponent's info to me
        socket.emit('opponent', { name: opponentName, avatar: opponentAvatar, score: opponentScore });
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