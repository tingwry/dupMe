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

const users: {id: string, name: string}[] = [];

io.on("connection", (socket) => {
    // Connection -------------------------------------
    console.log(`Boombayah connected: ${socket.id}`)

    socket.on("submit_name", (data) => {
        const user = {id: socket.id, name: data};
        users.push(user);
        console.log(users);

        // Send the list of connected users to the client
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
    // -------------------------------------

    socket.on("join_room", (data) => {
        socket.join(data);
    })

    socket.on("send_name", (data) => {
        socket.to(data.room).emit("receive_name", data)
    })

    socket.on("send_notelist", (data) => {
        socket.to(data.room).emit("receive_notelist", data);
    })
})

server.listen(3000, () => {
    console.log("Boombayah is running");
})