import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import console from "console";

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

let users: {sid: string, name: string, roomId: string, score: number, ready: boolean, P1: boolean}[] = [];
let rooms: {roomId: string, round: number, players: number}[] = [
    {roomId: "room 1", round: 1, players: 0},
    {roomId: "room 2", round: 1, players: 0},
    {roomId: "room 3", round: 1, players: 0},
    {roomId: "room 4", round: 1, players: 0},
    {roomId: "room 5", round: 1, players: 0},
]

io.on('connection', (socket) => {  
    // Connection -------------------------------------
    console.log(`Boombayah welcome: ${socket.id}`)

    socket.on('submit_name', (data) => {
        const user = {sid: socket.id, name: data, roomId: "main", score: 0, ready: false, P1: false};
        users.push(user);
        console.log(`user connected: ${socket.id}`)
        console.log(`connected users: ${users.length}`);

        // Send the list of all connected users to the client
        io.emit('users', users);
        io.emit('rooms', rooms);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        console.log(`connected users: ${users.length}`);

        // Remove the user from the connected users array
        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            const roomId = users[userIndex].roomId;
            users.splice(userIndex, 1);

            const playersInRoom = users.filter((user) => user.roomId === roomId);
            const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

            rooms[roomIndex].players = playersInRoom.length;

            // Broadcasting the list of players in the room to all users in the server and the room
            io.emit('users', users);
            io.emit('rooms', rooms)
            io.to(roomId).emit('players_in_room', playersInRoom);
            
        }
    });
    // -------------------------------------

    // Room -------------------------------------
    socket.on('join_room', (data) => {
        const roomId = data;
        const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

        // Check if there are less than 2 players in the room
        if (rooms[roomIndex].players < 2) {
            socket.join(roomId);
            console.log(`${socket.id} join_room ${roomId}`);

            // Update the room property for the user in the users array
            const userIndex = users.findIndex((user) => user.sid === socket.id);
            if (userIndex !== -1) {
                users[userIndex].roomId = roomId;
            }

            const playersInRoom = users.filter((user) => user.roomId === roomId);

            // Update the number of players in the room
            rooms[roomIndex].players = playersInRoom.length

            // Broadcasting the list of players in the room to all users in the server and the room
            io.emit('users', users);
            io.emit('rooms', rooms)
            io.to(roomId).emit('players_in_room', playersInRoom);
        } else {
            // Notify the client that the room is full
            io.to(socket.id).emit('room_full');
        }
    });



    socket.on('leave_room', (data) => {
        const userIndex = users.findIndex((user) => user.sid === socket.id);       
        if (userIndex !== -1) {
            const previousRoomId = users[userIndex].roomId;

            socket.leave(previousRoomId);
            users[userIndex].roomId = "main"; // Update the room property for the user in the users array
            
            const playersInRoom = users.filter((user) => user.roomId === previousRoomId);
            const previousRoomIdIndex = rooms.findIndex((room) => room.roomId === previousRoomId);

            // Update the number of players in the room
            rooms[previousRoomIdIndex].players = playersInRoom.length;

            // Broadcasting the list of players in the room to all users in the server and the room
            io.emit('users', users);
            io.emit('rooms', rooms);
            io.to(previousRoomId).emit('players_in_room', playersInRoom);

            console.log(`${socket.id} leave_room ${previousRoomId}`);    
        }
    })
    // -------------------------------------

    // Game -------------------------------------
    socket.on('ready', (data) => {
        // data = "this player is ready" -> could add some motto
        console.log(data, socket.id);

        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            // Mark the user as ready
            users[userIndex].ready = true;
            io.to(socket.id).emit('ready_state', true);

            // Check if both players in the room are ready
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
            
                io.to(firstPlayerSocketId).emit("start_game");
            }
    }})

    socket.on('send_notelist', (data) => {
        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            const roomId = users[userIndex].roomId;

            // socket.to sends the event to all sockets in the specified room, but it does not include the current socket.
            // io.to send the event to all sockets in the specified room, regardless of the namespace.
            socket.to(roomId).emit("receive_notelist", data);
        }
    });

    socket.on('end_turn', (data) => {
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
    });

    socket.on('restart', (data) => {
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
    })

    // socket.on('end_game', (data) => {
    //     console.log(`end_game: ${data}`)

    //     const user = users.find((user) => user.sid === socket.id);

    //     if (user) {
    //         user.score = data;
    //         console.log("score of P1", user.score);

    //         const roomId = user.roomId;
    //         const playersInRoom = users.filter((user) => user.roomId === roomId);

    //         // console.log("playersInRoom");
    //         // console.log(playersInRoom);

    //         // find winner
    //         let winner = playersInRoom[0];
    //         console.log(winner);
    //         let tie = false;
    //         if (playersInRoom[0] && playersInRoom[1]) {
    //             // check if tie
    //             if (playersInRoom[0].score === playersInRoom[1].score) {
    //                 tie = true;
    //                 console.log("this match is a tie");

    //                 // send score + winner to client

    //                 io.to(roomId).emit('p1', playersInRoom[0]);
    //                 io.to(roomId).emit('p2', playersInRoom[1]);
    //                 io.to(roomId).emit('tie', tie);
    //                 io.to(roomId).emit('winner', winner);
    //             } else {
    //                 const maxScore = Math.max(playersInRoom[0].score, playersInRoom[1].score);
    //                 console.log("max score:", maxScore);

    //                 for (const playerInRoom of playersInRoom) {
    //                     if (playerInRoom.score === maxScore) {
    //                         winner = playerInRoom;
    //                         console.log("winner: ", winner);
    //                     }
    //                 }

    //                 // send score + winner to client

    //                 // console.log(playersInRoom[0].roomId);
    //                 console.log("playersInRoom")
    //                 console.log(playersInRoom)
                    
    //                 io.to(roomId).emit('p1', playersInRoom[0]);
    //                 io.to(roomId).emit('p2', playersInRoom[1]);
    //                 io.to(roomId).emit('tie', tie);
    //                 io.to(roomId).emit('winner', winner);
    //             }
    //         } else {
    //             console.log("there's some errorrrrrr");
    //         }
    //     }
    // })

    // socket.on("end_3_turns", (data) => {
    //     // console.log(`end_game: ${data}`)
    //     // set score

    //     // io.to("room").emit(`score: ${data.finalScore}`);

    //     let user = users.find((user) => user.sid === socket.id);

    //     if (user) {
    //         user.score = data;
    //         console.log("score of P2", user.score);
    //     }
    // })
    // -------------------------------------

    // test -------------------------------------
    socket.on('start_RSG', () => {
        io.emit('ready_set_go');
    })
})

server.listen(3000, () => {
    console.log("Boombayah is running");
})