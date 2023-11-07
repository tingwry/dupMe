import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";
import { updatePlayerInRoom } from "./playerController";

export function gameHandler3(io: Server, socket: Socket): void {
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

    const countdown = (duration: number, roomId: string, onTimeout: () => void) => {
        let currentTime = duration;
        const interval = setInterval(() => {
            if (currentTime === 0) {
                io.to(roomId).emit('time', { time: currentTime });
                onTimeout();
                clearInterval(interval);
            } else {
                io.to(roomId).emit('time', { time: currentTime });
                currentTime--;
            }
        }, 1000);
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
                io.to(roomId).emit('end_game', { tie: false, winner: winner.name })
            }

        } else {
            console.log("there's some errorrrrrr");
        }
    }

    const endFollow = (roomId: string) => {
        socket.to(roomId).emit('end_follow');

        io.to(roomId).emit('turn', { turn: "Turn ended" });
    }

    const endCreate = (roomId: string) => {
        socket.emit('end_create');
        socket.to(roomId).emit('start_follow');

        socket.emit('turn', { turn: "Waiting for another player to follow the pattern" });
        socket.to(roomId).emit('turn', { turn: "Your turn to follow the pattern" });
    }

    const startCreate = (roomId: string) => {
        socket.emit('start_create');

        socket.emit('turn', { turn: "Your turn to create a pattern" });
        socket.to(roomId).emit('turn', { turn: "Waiting for another player to create a pattern" });
    }

    const readySetGo = (roomId: string) => {
        let currentTime = 3;
        const interval = setInterval(() => {
            if (currentTime === 0) {
                io.to(roomId).emit('time', { time: "Go" });
                socket.emit('start_create');
                clearInterval(interval);
            } else if (currentTime === 1) {
                io.to(roomId).emit('time', { time: "Set" });
                currentTime--;
            } else if (currentTime === 2) {
                io.to(roomId).emit('time', { time: "Ready" });
                currentTime--;
            } else if (currentTime === 3) {
                io.to(roomId).emit('time', { time: "..." });
                currentTime--;
            }
        }, 1000);
    }

    const endTurn = (data: any) => {
        // Info
        const userInfo = info();
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        // // score
        // console.log(data)
        // const arrayR = data.arrayR;
        // const arrayS = data.arrayS;
        
        // // score
        // const addScore = scoring(arrayR, arrayS);
        // users[userIndex].score = users[userIndex].score + addScore;
        // console.log(`${users[userIndex].name} add ${addScore} = ${users[userIndex].score}`);

        // io.to(roomId).emit('score', addScore);
        // updatePlayerInRoom(io, socket, roomId);

        // check ending
        if (users[userIndex].P1) { // If is P1
            if (rooms[roomIndex].round > 1) { // Round 2 = end game
                // rooms[roomIndex].round = 0;
                console.log('game ended')
                // winner(roomId);
            } else { // Round 1 = continues
                rooms[roomIndex].round++;
                console.log(`round ${rooms[roomIndex].round} turn 1 ended`)
                // readySetGo(roomId);
            }
        } else { // is not P1 = always start the next turn
            // console.log('round 1 turn 1 ended');
            readySetGo(roomId);
            // readySetGo(roomId, () => {
            //     startCreate(roomId);
            //     countdown(5, roomId, () => {
            //         endCreate(roomId)
            //         countdown(7, roomId, () => {
            //             endFollow(roomId)
            //             // console.log('end follow')
            //         })
            //     })
            // });
        }
    }

    // For socket
    const sendNoteList = (data: any) => {
        // Info
        const userInfo = info();
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        socket.to(roomId).emit('receive_notelist', data);
    }

    const ready = () => {
        // Info
        const userInfo = info();
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        // Set ready to true
        users[userIndex].ready = true;

        // Check both players
        const playersInRoom = users.filter((user) => user.roomId === roomId);
        if (playersInRoom[0] && playersInRoom[1]) {
            const bothPlayersReady = playersInRoom.every((player) => player.ready);

            if (bothPlayersReady) {
                let firstPlayer = playersInRoom.find((player) => player.P1);
                let p1sid = "";
                let p1name = "";
                if (!firstPlayer) {
                    p1sid = Math.random() < 0.5 ? playersInRoom[0].sid : playersInRoom[1].sid;
    
                    // update P1 to true for the person who goes first
                    users.forEach((user) => {
                        if (user.sid === p1sid) {
                            user.P1 = true;
                            p1name = user.name;
                        }
                    });
                } else {
                    p1sid = firstPlayer.sid;
                    p1name = firstPlayer.name;
                }

                rooms[roomIndex].round = 1;
                io.to(roomId).emit('turn', { turn: `${p1name} is the first player`});
                io.to(p1sid).emit('start_turn_server');
            }
        } else {
            socket.emit('turn', { turn: "Waiting for another player to be ready" });
            console.log('waiting for another player')
        }
    }

    const startTurn = () => {
        // Info
        const userInfo = info();
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        readySetGo(roomId);
        // readySetGo(roomId, () => {
        //     startCreate(roomId);
        //     countdown(5, roomId, () => {
        //         endCreate(roomId)
        //         countdown(7, roomId, () => {
        //             endFollow(roomId)
        //             // console.log('end follow')
        //         })
        //     })
        // });
    }

    // const clientRestart = () => {
    //     // Info
    //     const userInfo = info();
    //     const sid = socket.id
    //     const userIndex = userInfo.userIndex;
    //     const roomId = userInfo.roomId;
    //     const roomIndex = userInfo.roomIndex;
        
    //     const playersInRoom = users.filter((user) => user.roomId === roomId);

    //     playersInRoom.forEach((playerInRoom) => {
    //         playerInRoom.score = 0;
    //         playerInRoom.ready = false;
    //     });

    //     rooms[roomIndex].round = 0;

    //     io.to(roomId).emit('score', 0);
    //     updatePlayerInRoom(io, socket, roomId);

    //     io.to(roomId).emit('restart', { round: 0 });
    //     io.to(roomId).emit('ready_state', false);

    //     console.log(`client restart ${roomId}`)
    // }

    socket.on('send_notelist', sendNoteList);

    socket.on('ready', ready);
    socket.on('start_turn_client', startTurn);
    socket.on('start_create_client', startCreate);

    socket.on('end_turn', endTurn);

    // socket.on('client-restart', clientRestart);
    
}