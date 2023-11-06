import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function gameHandler2(io: Server, socket: Socket): void {
    const ready = (motto: string) => {
        // data = "this player is ready" -> could add some motto
        console.log(motto, socket.id);

        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            users[userIndex].ready = true;
            io.to(socket.id).emit('ready_state', true);

            const roomId = users[userIndex].roomId;

            const playersInRoom = users.filter((user) => user.roomId === roomId);
            const bothPlayersReady = playersInRoom.every((player) => player.ready); // what if there's only one player

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
                const secondPlayerSocketId = playersInRoom.find((player) => !player.P1)?.sid

                if (secondPlayerSocketId !== undefined) {
                    startCreate(roomId, firstPlayerSocketId, secondPlayerSocketId)
                }
            
                // io.to(firstPlayerSocketId).emit('start_game');
            }
        } else {
            console.log("User not found")
        }
    }

    const startCreate = (roomId: string, createsid: string, followsid: string) => {
        io.to(createsid).emit('my_turn', { isMyTurn: true });
        countDown(roomId, 5, () => startFollow(roomId, createsid, followsid));
    }

    const startFollow = (roomId: string, createsid: string, followsid: string) => {
        console.log('startFollow')
        io.to(createsid).emit('my_turn', { isMyTurn: false });
        io.to(followsid).emit('my_turn', { isMyTurn: true });

        const endFollow = () => {
            console.log('endFollow')
            io.to(followsid).emit('end_follow')
            io.to(followsid).emit('my_turn', { isMyTurn: false });
        }

        countDown(roomId, 7, endFollow)
    }

    const scoring = (userIndex: number, arrayR: {id: number, note: string}[], arrayS: {id: number, note: string}[]) => {
        // Check note
        let addScore = 0;
        const minLenght = Math.min(arrayR.length, arrayS.length);

        for (let i = 0; i < minLenght; i++) {
            if (arrayR[i].id === arrayS[i].id && arrayR[i].note === arrayS[i].note) {
                addScore++;
            }
        };

        // Update score
        users[userIndex].score = users[userIndex].score + addScore;
        console.log(`${users[userIndex].name} add ${addScore} = ${users[userIndex].score}`);
    }

    const endTurn = (data: any) => {
        console.log('checkEnd')
        const userIndex = users.findIndex((user) => user.sid === socket.id);
        scoring(userIndex, data.arrayReceived, data.arraySubmit)

        const roomId = users[userIndex].roomId;
        const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

        if (users[userIndex].P1) { // If is P1
            if (rooms[roomIndex].round === 2) { // Round 2 = end game
                console.log(`end_game ${roomId}`);
                const playersInRoom = users.filter((user) => user.roomId === roomId);

                // find winner
                let winner = playersInRoom[0];
                let tie = false;

                if (playersInRoom[0] && playersInRoom[1]) {
                    // check if tie
                    if (playersInRoom[0].score === playersInRoom[1].score) {
                        tie = true;
                        console.log("this match is a tie");

                        // send score + winner to client

                        io.to(roomId).emit('playerA', playersInRoom[0]);
                        io.to(roomId).emit('playerB', playersInRoom[1]);
                        io.to(roomId).emit('tie', tie);
                        io.to(roomId).emit('winner', winner);
                    } else {
                        const maxScore = Math.max(playersInRoom[0].score, playersInRoom[1].score);
                        console.log("max score:", maxScore);

                        for (const playerInRoom of playersInRoom) {
                            if (playerInRoom.score === maxScore) {
                                winner = playerInRoom;
                                console.log("winner: ", winner);
                            }
                        }

                        console.log(users);

                        // send score + winner to client
                        io.to(roomId).emit('playerA', playersInRoom[0]);
                        io.to(roomId).emit('playerB', playersInRoom[1]);
                        io.to(roomId).emit('tie', tie);
                        io.to(roomId).emit('winner', winner);
                        io.to(roomId).emit('ready_state', false);
                    }
                } else {
                    console.log("there's some errorrrrrr");
                }
            } else { // Round 1 = continues
                console.log(`end_round ${rooms[roomIndex].round}`);
                rooms[roomIndex].round++;
                // io.to(roomId).emit('next_round', {round: rooms[roomIndex].round})
                // io.to(socket.id).emit('start_turn', {round: rooms[roomIndex].round});
                // startCreate(roomId, socket.id);
            }
        } else { // is not P1 = always start the next turn
            // io.to(socket.id).emit('start_turn', {round: rooms[roomIndex].round});
            // startCreate(roomId, followsid, createsid);
            console.log('end turn')
            io.to(socket.id).emit('my_turn', { isMyTurn: false });
            socket.to(roomId).emit('my_turn', { isMyTurn: true });
        }

    }

    const countDown = (roomId: string, duration: number, onTimeout: () => void) => {
        let currentTime = duration;
        const interval = setInterval(() => {
            if (currentTime === 0) {
                io.to(roomId).emit('timer', { time: currentTime });
                onTimeout();
                clearInterval(interval);
            } else {
                io.to(roomId).emit('timer', { time: currentTime });
                currentTime--;
            }
        }, 1000);
    }
    
    const sendNoteList = (data: any) => {
        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            const roomId = users[userIndex].roomId;
            socket.to(roomId).emit('receive_notelist', data);
        } else {
            console.log("User not found")
        }
    }

    const eendTurn = (data: any) => {
        let addScore = 0;
        const arrayR = data.arrayReceived
        const arrayS = data.arraySubmit
        const minLenght = Math.min(arrayR.length, arrayS.length);
        for (let i = 0; i < minLenght; i++) {
            if (arrayR[i].id === arrayS[i].id && arrayR[i].note === arrayS[i].note) {
                addScore++;
            }
        };

        // update score
        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            users[userIndex].score = users[userIndex].score + addScore;
            console.log(`${users[userIndex].name} add ${addScore} = ${users[userIndex].score}`);
        }

        const roomId = users[userIndex].roomId;
        const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

        if (users[userIndex].P1) { // If is P1
            if (rooms[roomIndex].round === 2) { // Round 2 = end game
                console.log(`end_game ${roomId}`);
                const playersInRoom = users.filter((user) => user.roomId === roomId);

                // find winner
                let winner = playersInRoom[0];
                let tie = false;

                if (playersInRoom[0] && playersInRoom[1]) {
                    // check if tie
                    if (playersInRoom[0].score === playersInRoom[1].score) {
                        tie = true;
                        console.log("this match is a tie");

                        // send score + winner to client

                        io.to(roomId).emit('playerA', playersInRoom[0]);
                        io.to(roomId).emit('playerB', playersInRoom[1]);
                        io.to(roomId).emit('tie', tie);
                        io.to(roomId).emit('winner', winner);
                    } else {
                        const maxScore = Math.max(playersInRoom[0].score, playersInRoom[1].score);
                        console.log("max score:", maxScore);

                        for (const playerInRoom of playersInRoom) {
                            if (playerInRoom.score === maxScore) {
                                winner = playerInRoom;
                                console.log("winner: ", winner);
                            }
                        }

                        console.log(users);

                        // send score + winner to client
                        io.to(roomId).emit('playerA', playersInRoom[0]);
                        io.to(roomId).emit('playerB', playersInRoom[1]);
                        io.to(roomId).emit('tie', tie);
                        io.to(roomId).emit('winner', winner);
                        io.to(roomId).emit('ready_state', false);
                    }
                } else {
                    console.log("there's some errorrrrrr");
                }
            } else { // Round 1 = continues
                console.log(`end_round ${rooms[roomIndex].round}`);
                rooms[roomIndex].round++;
                io.to(roomId).emit('next_round', {round: rooms[roomIndex].round})
                io.to(socket.id).emit('start_turn', {round: rooms[roomIndex].round});
            }
        } else { // is not P1 = always start the next turn
            io.to(socket.id).emit('start_turn', {round: rooms[roomIndex].round});
        }

    }

    const restart = (data: any) => {
        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            const roomId = users[userIndex].roomId;
            const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
            
            rooms[roomIndex].round = 1;

            if (data.tie) {
                users.forEach(user => {
                    if (user.roomId === roomId) {
                        user.ready = false;
                        user.P1 = false;
                        user.score = 0;
                    }
                })
            } else {
                users.forEach(user => {
                    if (user.roomId === roomId) {
                        user.ready = false;
                        user.score = 0;
                        if (user.sid === data.winner) {
                            user.P1 = true;
                        } else {
                            user.P1 = false;
                        }
                    }
                })
            }  

            console.log(users);
            io.to(roomId).emit('ready_state', false);
            io.to(roomId).emit('next_round', {round: rooms[roomIndex].round});
            console.log(`restart" ${roomId}`);
        }
    }

    socket.on('ready', ready);
    socket.on('send_notelist', sendNoteList);
    socket.on('end_turn', endTurn);
    socket.on('restart', restart);
}