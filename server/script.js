import { users, rooms } from "./dataStorage";
import { io } from "socket.io"

const socket = io(':3000');

function updatePlayerCount()  {
    console.log(users)
    const count = users.length;
    const playerCountElement = document.getElementById('player-count');
    if (playerCountElement) {
        playerCountElement.innerText = `${count} players online`;
    }
};

function restart() {
    // Add your restart logic here
    console.log('restart')
    return;
};

// const restartButton = document.getElementById('restart-button');
// if (restartButton) {
//     restartButton.addEventListener('click', restart);
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const restartButton = document.getElementById('restart-button');
//     if (restartButton) {
//         restartButton.addEventListener('click', restart);
//     }
// });

document.addEventListener('DOMContentLoaded', function () {
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
        restartButton.addEventListener('click', restart);
    }
});