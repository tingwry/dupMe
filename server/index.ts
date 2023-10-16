import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
})

// Conection
const users: {sid: string, name: string}[] = [];

// Join a room
const rooms: {roomId: string, players:{sid: string, name: string, score: number, P1: boolean, round: number}[]}[] = [];

io.on("connection", (socket) => {
    // Connection -------------------------------------
    console.log(`Boombayah connected: ${socket.id}`)

    socket.on("submit_name", (data) => {
        const user = {sid: socket.id, name: data};
        users.push(user);
        console.log("users: ");
        console.log(users);

        // Send the list of all connected users to the client
        io.emit('users', users);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Remove the user from the connected users array
        const index = users.findIndex((user) => user.sid === socket.id);
        if (index !== -1) {
            users.splice(index, 1);
        }
        console.log("users: ");
        console.log(users);

        // Send the updated list of connected users to all clients
        io.emit('users', users);
    });
    // -------------------------------------

    // Join a room -------------------------------------
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log("socket.rooms: ", socket.rooms);
        // console.log(`${socket.id} join_room ${data}`);

        // Update the room property for the user in the users array
        const user = users.find((user) => user.sid === socket.id);
        const player = {sid: user?.sid || "", name: user?.name || "", score: 0, P1: false, round: 0}
        const foundRoom = rooms.find((room) => room.roomId === data)
        if (foundRoom) {
            foundRoom.players.push(player)
        } else {
            rooms.push({roomId: data, players:[player]})
        }

        console.log("rooms: ");
        console.log(rooms);

        // Send the list of players in the room to the client who entered the room
        // const playersInRoom = users.filter((user) => user.room === data);
        const playersInRoom = foundRoom?.players;
        console.log(`players in room ${data} =`)
        console.log(playersInRoom)

        // Broadcasting the list of players in the room to all users in the room
        io.to(data).emit('players_in_room', playersInRoom);

        // all available rooms ---------
        // Access all rooms currently available in the server
        // const availableRooms = io.sockets.adapter.rooms;
        // console.log("availableRooms:");
        // console.log(availableRooms);
        // availableRooms.forEach((room) => {
        //     console.log(room);
        // })
        // ---------
    })
    // -------------------------------------

    // Each game -------------------------------------
    socket.on("ready", (data) => {
        // player ready
    })

    // if both player ready -> randomize P1
    const P1 = true;
    const P2 = true;
    if (P1 && P2) {
        io.to("P1 socket.id").emit("start_game", "P1 socket.id")
    }

    socket.on("send_notelist", (data) => {
        console.log("receive_notelist", data)
        // socket.to sends the event to all sockets in the specified room, but it does not include the current socket.
        // io.to send the event to all sockets in the specified room, regardless of the namespace.
        socket.to(data.room).emit("receive_notelist", data);
    })

    socket.on("end_turn", (data) => {
        console.log(`end_turn: ${data}`)
        // set score
    })

    socket.on("end_round", (data) => {
        // set score
        io.to("room").emit("scores of both players in this round", "scores whatever");
    })



    // -------------------------------------
})

server.listen(3000, () => {
    console.log("Boombayah is running");
})