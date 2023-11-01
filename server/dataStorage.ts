export let users: {
    sid: string, 
    name: string, 
    roomId: string, 
    score: number, 
    ready: boolean, 
    P1: boolean
}[] = [];

export let rooms: {
    roomId: string, 
    round: number, 
    players: number
}[] = [
    {roomId: "room 1", round: 1, players: 0},
    {roomId: "room 2", round: 1, players: 0},
    {roomId: "room 3", round: 1, players: 0},
    {roomId: "room 4", round: 1, players: 0},
    {roomId: "room 5", round: 1, players: 0},
];