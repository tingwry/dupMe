// import { users, rooms } from "./dataStorage";
// import { io } from "socket.io"
// const { io } = require("socket.io");

const socket = io(':3000');

function user()  {
    console.log(users)
    const count = users.length;
    const playerCountElement = document.getElementById('player-count');
    if (playerCountElement) {
        playerCountElement.innerText = `${count} players online`;
    }
};

function refreshUsers() {
    socket.emit('server_users');
}

function serverRestart(roomId) {
    console.log(`${roomId} restart`);
    socket.emit('server_restart', {roomId: roomId});
}

socket.on('users', (data) => {
    console.log(data);
    const userCountServer = data.length;
    const userCountElement = document.getElementById('user-count');
    if (userCountElement) {
        userCountElement.innerHTML = `${userCountServer} users online`
    }
})