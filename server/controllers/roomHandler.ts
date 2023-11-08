import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";
import { playerInfo, updatePlayerInRoom, updatePlayerInRoom2 } from "./playerController";

export function roomHandler(io: Server, socket: Socket): void {
    const joinRoom = (roomId: string) => {
        socket.join(roomId);
        console.log(`${socket.id} join_room ${roomId}`);

        const userIndex = users.findIndex((user) => user.sid === socket.id);
        if (userIndex !== -1) {
            users[userIndex].roomId = roomId;
            
            // Broadcasting the list of players in the room to all users in the server and the room
            updatePlayerInRoom(io, socket, roomId);
            socket.emit('in_room', roomId);
            io.emit('users', users);
            io.emit('rooms', rooms);
        } 
    }

    const leaveRoom = () => {
        const userIndex = users.findIndex((user) => user.sid === socket.id);   
        if (userIndex !== -1) {
            const previousRoomId = users[userIndex].roomId;

            // update properties
            socket.leave(previousRoomId);
            users[userIndex].roomId = "main";
            users[userIndex].P1 = false;
            
            // Broadcasting the list of players in the room to all users in the server and the room
            updatePlayerInRoom(io, socket, previousRoomId);
            io.emit('users', users);
            io.emit('rooms', rooms);
            socket.emit('profile', { name: users[userIndex].name, avatar: users[userIndex].avatar })
            console.log(`${socket.id} leave_room ${previousRoomId}`); 
        }
    }

    const reaction = (data: any) => {
        const userInfo = playerInfo(io, socket);
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        if ((userIndex !== -1) && roomId && (roomIndex !== -1)) {
            socket.to(roomId).emit('receive_reaction', data);
            return;
        }
    }

    socket.on('join_room', joinRoom);
    socket.on('leave_room', leaveRoom);
    socket.on('send_reaction', reaction)
}