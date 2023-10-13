import React, { useEffect, useState } from "react";
import "./Component.css";
import { io } from "socket.io-client";
import socket from "../socket";

function Piano() {
  const allnotes = ["C", "D", "E", "F", "G", "A", "B"];

  // Notes clicking
  const [notelist, setNotelist] = useState<{ id: number; note: string }[]>(
    []
  );
  const handleClickNote = (item: string) => {
    const newNote = { id: notelist.length, note: item };
    setNotelist([...notelist, newNote]); //Add in array
  };

  useEffect(() => {
    console.log("A note added", notelist);
  }, [notelist]);

  // Socket event for sending notes
  const sendNotelist = () => {
    console.log("Notelist is sent", notelist);
    // socket.emit("send_notelist", { notelist, room });
  };

  /// Timer for sending notes
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prevSecondsLeft) => {
        if (prevSecondsLeft === 1) {
          // sendNotelist();
          clearInterval(timer);
          return 0;
        }
        return prevSecondsLeft - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      sendNotelist();
      setNotelist([]);
    }
  }, [secondsLeft]);

  // Received notes
  const [notelistReceived, setNotelistReceived] = useState<
    { id: number; note: string }[]
  >([]);

  useEffect(() => {
    socket.on("receive_notelist", (data) => {
      setNotelistReceived(data);
      console.log("receive_notelist", data);
      setSecondsLeft(20);
      setNotelist([]);
    });
  }, [socket]);

  return (
    <>
      <h1>Seconds Left: {secondsLeft}</h1>

      <h1>Piano</h1>
      <div className="piano-container">
        {allnotes.map((item) => (
          <div
            key={item}
            onClick={() => {
              handleClickNote(item);
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <h1>Display</h1>
      <div className="piano-container">
        {notelist.map((item) => (
          <div key={item.id}>{item.note}</div>
        ))}
      </div>

      <h1>Received</h1>
      <div className="piano-container">
        {notelistReceived.map((item) => (
          <div key={item.id}>{item.note}</div>
        ))}
      </div>
    </>
  );
}

export default Piano;
