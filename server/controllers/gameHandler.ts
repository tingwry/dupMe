import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";
import { updatePlayerInRoom } from "./playerController";
import { countdown } from "./gameController";

export function gameHandler(io: Server, socket: Socket): void {
    // Controllers
    const info = () => {
        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            const roomId = users[userIndex].roomId;
            const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

            if (roomIndex !== -1) {
                return {userIndex: userIndex, roomId: roomId, roomIndex: roomIndex};
            } else {
                // console.log("Room not found")
                throw new Error("Room not found");
            }
        } else {
            // console.log("User not found")
            throw new Error("User not found");
        }
    }

    const readySetGo = (roomId: string, round: number, onTimeout: () => void) => {
    // const readySetGo = (sid: string, roomId: string, round: number) => {
        let currentTime = 4;
        const interval = setInterval(() => {
            if (currentTime === 0) {
                io.to(roomId).emit('rsg', { message: "" });
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

    const startCreate = (createsid: any, followsid: any, roomId: string, round: number) => {
        io.to(createsid).emit('start_create');
        console.log(`round ${round}`);

        // countDown in server
        countdown(io, socket, roomId, 5, () => endCreate(createsid, followsid, roomId));
    }

    const endCreate = (createsid: any, followsid: any, roomId: string) => {
        io.to(createsid).emit('end_create');
        io.to(followsid).emit('start_follow');
        countdown(io, socket, roomId, 5, () => {
            io.to(followsid).emit('end_follow');
        });
    }

    const scoring = (arrayR: { id: number; note: string }[], arrayS: { id: number; note: string }[]) => {
        let addScore = 0;
        const minLenght = Math.min(arrayR.length, arrayS.length);
        for (let i = 0; i < minLenght; i++) {
            if (arrayR[i].id === arrayS[i].id && arrayR[i].note === arrayS[i].note) {
                addScore++;
            }
        };
        return addScore
    }

    const winner = (roomId: string) => {
        // find winner
        const playersInRoom = users.filter((user) => user.roomId === roomId);

        let winner = playersInRoom[0];

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

        } else {
            console.log("there's some errorrrrrr");
        }
    }

    // For socket
    const ready = () => {
        // Info
        const userInfo = info();
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        // Set ready to true
        users[userIndex].ready = true;
        io.to(sid).emit('ready_state', true);

        // Check both players
        const playersInRoom = users.filter((user) => user.roomId === roomId);
        if (playersInRoom[0] && playersInRoom[1]) {
            const bothPlayersReady = playersInRoom.every((player) => player.ready);

            if (bothPlayersReady) {
                let firstPlayerSocketId = playersInRoom.find((player) => player.P1)?.sid
                if (!firstPlayerSocketId) {
                    firstPlayerSocketId = Math.random() < 0.5 ? playersInRoom[0].sid : playersInRoom[1].sid;
    
                    // update P1 to true for the person who goes first
                    users.forEach((user) => {
                        if (user.sid === firstPlayerSocketId) {
                            user.P1 = true;
                        }
                    });
                }

                rooms[roomIndex].round = 1;
                const round = rooms[roomIndex].round;

                let secondPlayerSocketId = playersInRoom.find((player) => !player.P1)?.sid
                if (firstPlayerSocketId && secondPlayerSocketId) {
                    readySetGo(roomId, round, () => {
                        startCreate(firstPlayerSocketId, secondPlayerSocketId, roomId, round)
                    })
                }
            }
        } else {
            console.log('Waiting for another player')
        }
    }

    const sendNoteList = (data: any) => {
        // Info
        const userInfo = info();
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        socket.to(roomId).emit('receive_notelist', data);
    } 

    const endTurn = (data: any) => {
        // Info
        const userInfo = info();
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        // const playersInRoom = users.filter((user) => user.roomId === roomId);
        const arrayR = data.arrayR;
        const arrayS = data.arrayS;
        
        // score
        const addScore = scoring(arrayR, arrayS);
        users[userIndex].score = users[userIndex].score + addScore;
        console.log(`${users[userIndex].name} add ${addScore} = ${users[userIndex].score}`);

        io.to(roomId).emit('score', addScore);
        updatePlayerInRoom(io, socket, roomId);

        const p1 = users.find((user) => {(user.P1) && (user.roomId === roomId)})
        const p2 = users.find((user) => {!(user.P1) && (user.roomId === roomId)})

        // check ending
        if (p1 && p2) {
            if (socket.id === p1.sid) { // If is P1
                if (rooms[roomIndex].round === 2) { // Round 2 = end game
                    rooms[roomIndex].round = 0;
                    winner(roomId);
                } else { // Round 1 = continues
                    rooms[roomIndex].round++;
                    const round = rooms[roomIndex].round;
                    readySetGo(roomId, round, () => startCreate(p1.sid, p2.sid, roomId, round));
                }
            } else { // is not P1 = always start the next turn
                const round = rooms[roomIndex].round;
                readySetGo(roomId, round, () => startCreate(p2.sid, p1.sid, roomId, round))
            }
        }
        
    }

    const clientRestart = () => {
        // Info
        const userInfo = info();
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;
        
        const playersInRoom = users.filter((user) => user.roomId === roomId);

        playersInRoom.forEach((playerInRoom) => {
            playerInRoom.score = 0;
            playerInRoom.ready = false;
        });

        rooms[roomIndex].round = 0;

        io.to(roomId).emit('score', 0);
        updatePlayerInRoom(io, socket, roomId);

        io.to(roomId).emit('restart', { round: 0 });
        io.to(roomId).emit('ready_state', false);

        console.log(`client restart ${roomId}`)
    }

    socket.on('ready', ready);
    socket.on('send_notelist', sendNoteList);
    socket.on('end_create', endCreate);
    // socket.on('end_follow', endFollow);
    socket.on('end_turn', endTurn);
    socket.on('client-restart', clientRestart);
}