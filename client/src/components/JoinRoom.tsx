import React, { useEffect, useState } from "react";
import socket from "../socket";
import Piano from "./Piano";
import "./Component.css";

function JoinRoom() {
  // Join room
  const [rooms, setRooms] = useState<{roomId: string, players:{sid: string}[]}[]>([]);
  const [roomId, setRoomId] = useState("");
  const [enteredRoom, setEnteredRoom] = useState(false);
  const [playersInRoom, setPlayersInRoom] = useState<{sid: string, name: string, roomId: string, score: number}[]>([]);

  const joinRoom = () => {
    if (roomId !== "") {
      socket.emit("join_room", roomId);
      setEnteredRoom(true);
      console.log("join_room", roomId);
    }
  };

  const handleClickRoom = (item: string) => {
    socket.emit("join_room", item);
      setEnteredRoom(true);
      console.log("join_room", item);
      setRoomId(item);
};

  useEffect(() => {
    socket.on('rooms', (data) => {
        setRooms(data);
    })
    socket.on("players_in_room", (data) => {
      setPlayersInRoom(data);
    });
  }, [socket]);

  return (
    <>
      <h1>JoinRoom</h1>
        <div>{enteredRoom ? (<>
            <p>room: {roomId}</p>
            {playersInRoom.map((item) => (
                <div key={item.sid}>{item.sid}, {item.name}</div>
            ))}
            <button>leave this room</button>
            <Piano roomId={roomId}/>
        </>) : (<>
            {/* <input
                placeholder="Room Number..."
                onChange={(event) => {
                setRoom(event.target.value);
                }}
            />
            <button onClick={joinRoom}> Join Room</button> */}
            <div className='rooms-container'>
                {rooms.map((item) => (
                    <div key={item.roomId} onClick={() => {handleClickRoom(item.roomId)}}>{item.roomId}</div>
                ))}
            </div>
        </>)}</div>
    </>
  );
}

export default JoinRoom;