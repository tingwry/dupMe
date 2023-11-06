import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function findPlayer(io: Server, socket: Socket, userIndex: number, roomId: string) {
    // if (playersInRoom.length === 1) {
    //     socket.emit('me', { name: playersInRoom[0].name, score: playersInRoom[0].score });
    //     socket.emit('opponent', { name: "", score: 0 });
    // } else if (playersInRoom.length === 2) {
    //     playersInRoom.forEach((player) => {
    //         if (player.sid === socket.id) {
    //             socket.emit('me', { name: player.name, score: player.score });
    //             console.log(`me ${player.name}, ${player.score}`)
    //         } else {
    //             socket.emit('opponent', { name: player.name, score: player.score });
    //             console.log(`opponent ${player.name}, ${player.score}`)
    //         }
    //     });
    // }

    // return playersInRoom.length;

    const me = users[userIndex];
    const myName = me.name;
    const myRoom = me.roomId;
    const myScore = me.score;

    // send my info to me
    socket.emit('me', {name: myName, score: myScore})

    const opponent = users.filter((user) => (user.roomId === roomId) && (user.sid !== socket.id));
    console.log(`opponent length ${opponent.length}`)

    if (opponent.length !== 0) {
        console.log(`opponent`)
        console.log(opponent)
        const opponentSid = opponent[0].sid;
        const opponentName = opponent[0].name;
        const opponentScore = opponent[0].score;
 
        // send opponent's info to me
        socket.emit('opponent', { name: opponentName, score: opponentScore });
        // send my info to opponent
        io.to(opponentSid).emit('opponent', {name: myName, score: myScore});

        if (myRoom === "main") {
            // send my info to opponent
            io.to(opponentSid).emit('opponent', {name: "", score: 0});
            return 1;
        }
        return 2;
    } else { // no opponent = the only player in the room
        console.log(`no opponent`)
        socket.emit('opponent', { name: '', score: 0 });
        if (myRoom === "main") {
            return 0;
        }
        return 1;
    }
 
}

export function findMe(io: Server, socket: Socket, userIndex: number): void {
    const me = users[userIndex];
    const myName = me.name;
    const myScore = me.score;

    // send my info to me
    socket.emit('me', {name: myName, score: myScore});
}


// คิดกรณี leave room ยัง
// ตอนนี้ชอบพังตอนคนแรกเข้าห้อง
export function findOpponent(io: Server, socket: Socket, userIndex: number, roomId: string): void {
    const opponent = users.filter((user) => (user.roomId === roomId) && (user.sid !== socket.id));
    if (opponent.length !== 0) {
        const me = users[userIndex];
        const myName = me.name;
        const myScore = me.score;

        const opponentSid = opponent[0].sid;
        const opponentName = opponent[0].name;
        const opponentScore = opponent[0].score;

        // send opponent's info to me
        socket.emit('opponent', { name: opponentName, score: opponentScore });
        // send my info to opponent
        io.to(opponentSid).emit('opponent', { name: myName, score: myScore })
    } else { // no opponent
        // send opponent's info to user with sid = sid
        socket.emit('opponent', { name: "", score: 0 });
        return undefined;
    }
}