import { users, rooms } from "./dataStorage";

const updatePlayerCount = (): void => {
    console.log(users)
    const count: number = users.length;
    const playerCountElement: HTMLElement | null = document.getElementById('player-count');
    if (playerCountElement) {
        playerCountElement.innerText = `${count} players online`;
    }
};

const restartFunction = (): void => {
    // Add your restart logic here
};

updatePlayerCount();

const restartButton: HTMLButtonElement | null = document.getElementById('restart-button') as HTMLButtonElement;
if (restartButton) {
    restartButton.addEventListener('click', restartFunction);
}