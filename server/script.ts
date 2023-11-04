import { users, rooms } from "./dataStorage";
import { Socket } from "socket.io";

export function updatePlayerCount(): void  {
    console.log(users)
    const count: number = users.length;
    const playerCountElement: HTMLElement | null = document.getElementById('player-count');
    if (playerCountElement) {
        playerCountElement.innerText = `${count} players online`;
    }
};

export function restart(): void {
    // Add your restart logic here
    console.log('restart')
};

const restartButton: HTMLButtonElement | null = document.getElementById('restart-button') as HTMLButtonElement;
if (restartButton) {
    restartButton.addEventListener('click', restart);
}