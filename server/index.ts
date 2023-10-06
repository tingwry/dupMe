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

// io.on("connection", (socket) => {
//     console.log(`Boombayah connected: ${socket.id}`)

//     socket.on("join_room", (data) => {
//         socket.join(data);
//     })

//     socket.on("send_message", (data) => {
//         socket.to(data.room).emit("receive_message", data)
//     })
// })

server.listen(3000, () => {
    console.log("Boombayah is running");
})