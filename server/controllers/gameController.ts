import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function readySetGo(io: Server, socket: Socket, roomId: string, round: number, onTimeout: () => void): void {
    let currentTime = 4;
    const interval = setInterval(() => {
        if (currentTime === 0) {
            io.to(roomId).emit('rsg', { message: "Your turn" });
            onTimeout();
            clearInterval(interval);
        } else if (currentTime === 1) {
            io.to(roomId).emit('rsg', { message: "Go" });
            currentTime--;
        } else if (currentTime === 2) {
            io.to(roomId).emit('rsg', { message: "Set" });
            currentTime--;
        } else if (currentTime === 3) {
            io.to(roomId).emit('rsg', { message: "Ready" });
            currentTime--;
        } else {
            io.to(roomId).emit('rsg', { message: `Round ${round}` });
            currentTime--;
        }
    }, 1000);
}

export function countdown(io: Server, socket: Socket, roomId: string, duration: number, onTimeout: () => void): void {
    let currentTime = duration;
    const interval = setInterval(() => {
        if (currentTime === 0) {
            io.to(roomId).emit('countdown', { countdown: currentTime });
            onTimeout();
            clearInterval(interval);
        } else {
            io.to(roomId).emit('countdown', { countdown: currentTime });
            currentTime--;
        }
    }, 1000);
}

export function startCreate(io: Server, socket: Socket, sid: string, roomId: string, round: number) {
    io.to(sid).emit('start_create');
    io.to(roomId).emit('start_turn', { round: round }); // to reset timer
    console.log(`round ${round}`)
}

export function scoring(arrayR: { id: number; note: string }[], arrayS: { id: number; note: string }[]) {
    let addScore = 0;
    const minLenght = Math.min(arrayR.length, arrayS.length);
    for (let i = 0; i < minLenght; i++) {
        if (arrayR[i].id === arrayS[i].id && arrayR[i].note === arrayS[i].note) {
            addScore++;
        }
    };
    return addScore
}

export function winner(io: Server, socket: Socket, roomId: string) {
    // find winner
    const playersInRoom = users.filter((user) => user.roomId === roomId);

    if (playersInRoom[0] && playersInRoom[1]) {

        // check if tie
        if (playersInRoom[0].score === playersInRoom[1].score) {
            console.log("this match is a tie");

            playersInRoom.forEach((playerInRoom) => {
                playerInRoom.score = 0;
                playerInRoom.ready = false;
                playerInRoom.P1 = false;
            });

            io.to(roomId).emit('end_game', { tie: true, winner: "none" })
        } else {
            let winner = playersInRoom[0];
            const maxScore = Math.max(playersInRoom[0].score, playersInRoom[1].score);
            console.log("max score:", maxScore);

            for (const playerInRoom of playersInRoom) {
                if (playerInRoom.score === maxScore) {
                    winner = playerInRoom;
                    console.log("winner: ", winner.name);

                    playerInRoom.P1 = true;
                } else {
                    playerInRoom.P1 = false;
                }
            }

            io.to(roomId).emit('end_game', { tie: false, winner: winner.name})
        }

        // io.to(roomId).emit('ready_state', false);
    } else {
        console.log("there's some errorrrrrr");
    }
}