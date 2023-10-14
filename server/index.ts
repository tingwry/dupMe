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
const users: {id: string, name: string, room: string}[] = [];

// Join a room

io.on("connection", (socket) => {
    // Connection -------------------------------------
    console.log(`Boombayah connected: ${socket.id}`)

    socket.on("submit_name", (data) => {
        const user = {id: socket.id, name: data, room:"main"};
        users.push(user);
        console.log(users);

        // Send the list of all connected users to the client
        io.emit('users', users);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Remove the user from the connected users array
        const index = users.findIndex((user) => user.id === socket.id);
        if (index !== -1) {
            users.splice(index, 1);
        }
        console.log(users);

        // Send the updated list of connected users to all clients
        io.emit('users', users);
    });

    // Join a room -------------------------------------
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`${socket.id} join_room ${data}`)

        // Update the room property for the user in the users array
        const userIndex = users.findIndex((user) => user.id === socket.id);
        if (userIndex !== -1) {
            users[userIndex].room = data;
        }

        console.log(users)

        // Send the list of players in the room to the client who entered the room
        const playersInRoom = users.filter((user) => user.room === data);
        io.to(socket.id).emit('players_in_room', playersInRoom);
        // console.log(`players in room ${data} =`)
        // console.log(playersInRoom)

        // Broadcasting the list of players in the room to all users in the room
        io.to(data).emit('players_in_room', playersInRoom);
    })

    // Each turn -------------------------------------
    socket.on("send_notelist", (data) => {
        console.log("receive_notelist", data)
        socket.to(data.room).emit("receive_notelist", data);
    })

    // -------------------------------------
})

server.listen(3000, () => {
    console.log("Boombayah is running");
})