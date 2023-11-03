import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function roomHandler(io: Server, socket: Socket): void {
    const joinRoom = (roomId: string) => {
        socket.join(roomId);
        console.log(`${socket.id} join_room ${roomId}`);

        const userIndex = users.findIndex((user) => user.sid === socket.id);
        const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

        if (userIndex !== -1 && roomIndex !== -1) {
            users[userIndex].roomId = roomId;

            // Update the number of players in the room --> error???
            const playersInRoom = users.filter((user) => user.roomId === roomId);
            rooms[roomIndex].players = playersInRoom.length

            // Broadcasting the list of players in the room to all users in the server and the room
            io.emit('users', users);
            io.emit('rooms', rooms)
            io.to(roomId).emit('players_in_room', playersInRoom);
        } 
    }

    const leaveRoom = () => {
        const userIndex = users.findIndex((user) => user.sid === socket.id);   
        if (userIndex !== -1) {
            const previousRoomId = users[userIndex].roomId;

            socket.leave(previousRoomId);
            users[userIndex].roomId = "main"; // Update the room property for the user in the users array
            
            const playersInRoom = users.filter((user) => user.roomId === previousRoomId);
            const previousRoomIdIndex = rooms.findIndex((room) => room.roomId === previousRoomId);

            if (previousRoomIdIndex !== -1) {
                // Update the number of players in the room
                rooms[previousRoomIdIndex].players = playersInRoom.length;
                
                // Broadcasting the list of players in the room to all users in the server and the room
                io.emit('rooms', rooms);
                io.to(previousRoomId).emit('players_in_room', playersInRoom);
                console.log(`${socket.id} leave_room ${previousRoomId}`);   
            }
            io.emit('users', users);
        }
    }

    socket.on('join_room', joinRoom);
    socket.on('leave_room', leaveRoom)
}