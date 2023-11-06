import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";
import { updatePlayerInRoom } from "./playerController";

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

    const startCreate = (sid: string, roomId: string, round: number) => {
        io.to(sid).emit('start_create');
        io.to(roomId).emit('start_turn', { round: round }); // to reset timer
        console.log(`round ${round}`)
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
        let tie = false;

        if (playersInRoom[0] && playersInRoom[1]) {

            // check if tie
            if (playersInRoom[0].score === playersInRoom[1].score) {
                // tie = true;
                console.log("this match is a tie");

                playersInRoom.forEach((playerInRoom) => {
                    playerInRoom.score = 0;
                    playerInRoom.ready = false;
                    playerInRoom.P1 = false;
                });

                io.to(roomId).emit('tie', true);
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

                io.to(roomId).emit('winner', winner.name);
                io.to(roomId).emit('end_game', { tie: false, winner: winner.name})
            }

            // io.to(roomId).emit('ready_state', false);
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
                if (firstPlayerSocketId === undefined) {
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
                startCreate(firstPlayerSocketId, roomId, round);
            }
        } else {
            console.log('waiting for another player')
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

    const endCreate = () => {
        // Info
        const userInfo = info();
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        socket.to(roomId).emit('start_follow');
    }

    const endFollow = (data: any) => {
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

        // check ending
        if (users[userIndex].P1) { // If is P1
            if (rooms[roomIndex].round === 2) { // Round 2 = end game
                // console.log(`end_game ${roomId} ${rooms[roomIndex].round}`);
                rooms[roomIndex].round = 0;
                winner(roomId);
            } else { // Round 1 = continues
                // console.log(`end_round ${roomId} ${rooms[roomIndex].round}`);
                rooms[roomIndex].round++;
                const round = rooms[roomIndex].round;
                startCreate(socket.id, roomId, round);
            }
        } else { // is not P1 = always start the next turn
            // console.log(`end_turn ${roomId} ${rooms[roomIndex].round}`);
            const round = rooms[roomIndex].round;
            startCreate(socket.id, roomId, round);
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
    socket.on('end_follow', endFollow);
    socket.on('client-restart', clientRestart);
}