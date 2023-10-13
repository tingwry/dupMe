import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import socket from "../socket";

function JoinRoom() {
  // Join room
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [nameReceived, setNameReceived] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setShowNameInput(true);
      console.log("join room", room);
    }
  };

  const sendName = () => {
    socket.emit("send_name", { name, room });
    console.log("send_name", { name, room });
  };

  useEffect(() => {
    socket.on("receive_name", (data) => {
      setNameReceived(data.name);
      console.log("receive_name", data, data.name);
    });
  }, [socket]);

  return (
    <>
      <h1>JoinRoom</h1>
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>

      {showNameInput && (
        <>
          <input
            placeholder="Enter Name..."
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <button onClick={sendName}> Submit</button>

          <p>{nameReceived}</p>
        </>
      )}
    </>
  );
}

export default JoinRoom;
