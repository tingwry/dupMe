import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function roomHandler(io: Server, socket: Socket): void {
    const joinRoom = (roomId: string) => {
        socket.join(roomId);
        console.log(`${socket.id} join_room ${roomId}`);

        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            users[userIndex].roomId = roomId;
        }

        const playersInRoom = users.filter((user) => user.roomId === roomId);
        const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

        // Update the number of players in the room --> error???
        rooms[roomIndex].players = playersInRoom.length

        // Broadcasting the list of players in the room to all users in the server and the room
        io.emit('users', users);
        io.emit('rooms', rooms)
        io.to(roomId).emit('players_in_room', playersInRoom);
    }

    const leaveRoom = () => {
        const userIndex = users.findIndex((user) => user.sid === socket.id);   
        if (userIndex !== -1) {
            const previousRoomId = users[userIndex].roomId;

            socket.leave(previousRoomId);
            users[userIndex].roomId = "main"; // Update the room property for the user in the users array
            
            const playersInRoom = users.filter((user) => user.roomId === previousRoomId);
            const previousRoomIdIndex = rooms.findIndex((room) => room.roomId === previousRoomId);

            // Update the number of players in the room
            const playerCount = playersInRoom.length;
            rooms[previousRoomIdIndex].players = playerCount

            // Broadcasting the list of players in the room to all users in the server and the room
            io.emit('users', users);
            io.emit('rooms', rooms);
            io.to(previousRoomId).emit('players_in_room', playersInRoom);

            console.log(`${socket.id} leave_room ${previousRoomId}`);    
        }
    }

    socket.on('join_room', joinRoom);
    socket.on('leave_room', leaveRoom)
}