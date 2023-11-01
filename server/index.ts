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

import { userHandler } from "./controllers/userHandler";
import { roomHandler } from "./controllers/roomHandler";
import { gameHandler } from "./controllers/gameHandler";


io.on('connection', (socket) => {  
    console.log(`Boombayah welcome: ${socket.id}`)
    userHandler(io, socket);
    roomHandler(io, socket);
    gameHandler(io, socket);

    // test -------------------------------------
    // socket.on('start_RSG', () => {
    //     io.emit('ready_set_go');
    // })
})

server.listen(3000, () => {
    console.log("Boombayah is running");
})