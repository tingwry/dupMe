import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

// export function info(io: Server, socket: Socket) {
//     const userIndex = users.findIndex((user) => user.sid === socket.id);
//     if (userIndex !== -1) {
//         const roomId = users[userIndex].roomId;
//         const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

//         if (roomIndex !== -1) {
//             return { status: true, result: {userIndex: userIndex, roomId: roomId, roomIndex: roomIndex}};
//         } else {
//             console.log("Room not found")
//             return {status: false, result: "Room not found"}
//         }
//     } else {
//         console.log("User not found")
//         return {status: false, result: "User not found"}
//     }
// }

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