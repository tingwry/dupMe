import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import console from "console";
import path from "path";

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

import { userHandler } from "./controllers/userHandler";
import { roomHandler } from "./controllers/roomHandler";
import { gameHandler } from "./controllers/gameHandler";
// import { gameHandler3 } from "./controllers/gamev3";


io.on('connection', (socket) => {  
    console.log(`Boombayah welcome: ${socket.id}`)
    userHandler(io, socket);
    roomHandler(io, socket);
    gameHandler(io, socket);
    // gameHandler3(io, socket);
})

// Run server
const PORT = 3000;
const SERVER_IP = "127.0.0.1"; 
server.listen(PORT, SERVER_IP, () => {
    console.log(`Boombayah is running at http://${SERVER_IP}:${PORT}`);
})