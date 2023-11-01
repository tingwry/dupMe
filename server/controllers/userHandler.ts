import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function userHandler(io: Server, socket: Socket): void {
    const submitName = (name: string) => {
        const user = {
            sid: socket.id, 
            name: name, 
            roomId: "main", 
            score: 0, 
            ready: false, 
            P1: false
        };
        users.push(user);

        console.log(`user connected: ${socket.id}`);
        console.log(`connected users: ${users.length}`);

        // Send the list of all connected users to the client
        io.emit('users', users);
        io.emit('rooms', rooms);
    }

    const disconnect = () => {
        console.log(`User disconnected: ${socket.id}`);
        console.log(`connected users: ${users.length}`);

        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            const roomId = users[userIndex].roomId;
            users.splice(userIndex, 1);

            const playersInRoom = users.filter((user) => user.roomId === roomId);
            const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

            rooms[roomIndex].players = playersInRoom.length;
            
            // Broadcasting the list of players in the room to all users in the server and the room
            io.emit('users', users);
            io.emit('rooms', rooms)
            io.to(roomId).emit('players_in_room', playersInRoom);
        } else {
            console.log("User not found")
        }
    }

    socket.on('submit_name', submitName);
    socket.on('disconnect', disconnect);
}
