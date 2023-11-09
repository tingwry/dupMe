import React, { useEffect, useState } from "react";
import socket from "../../socket";
import Countdown from "../Countdown";
import "./Piano.css";

function Pianov3() {
  const allnotes = ["C", "D", "E", "F", "G", "A", "B"];
  const [notelist, setNotelist] = useState<{ id: number; note: string }[]>([]);
  const [notelistReceived, setNotelistReceived] = useState<
    { id: number; note: string }[]
  >([]);

  const [isCreating, setIsCreating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Click note
  const handleClickNote = (item: string) => {
    if (isCreating || isFollowing) {
      const newNote = { id: notelist.length, note: item };
      const updatedNotelist = [...notelist, newNote]; //Add in array
      setNotelist(updatedNotelist);
      socket.emit('send_notelist', { notelist: updatedNotelist });

      const audio = new Audio(`sounds/${item}.mp3`);
      audio.play();
    }
  };

  useEffect(() => {
    socket.on('receive_notelist', (data) => {
      setNotelistReceived(data.notelist);
    });

    socket.on('start_create_server', (data) => {
      setNotelist([]);
      setNotelistReceived([]);
      setIsCreating(true);
      socket.emit('start_create_client');
    });

    socket.on('end_create_server', () => {
        setIsCreating(false);
        socket.emit('end_create_client');
    })

    socket.on('start_follow_server', () => {
      setNotelist([]);
      setIsFollowing(true); // also hide the received note
      socket.emit('start_follow_client');
    });

    socket.on('end_follow_server', () => {
        console.log({ arrayR: notelistReceived, arrayS: notelist })
        socket.emit('end_follow_client', { arrayR: notelistReceived, arrayS: notelist });
        setNotelist([]);
        setNotelistReceived([]);
        setIsFollowing(false);
    })

    socket.on("restart", (data) => {
      setNotelist([]);
      setNotelistReceived([]);
      setIsCreating(false);
      setIsFollowing(false);
      console.log("restart");
    });

  }, [socket]);

  return (
    <>
      <div className="display">
        <h3>Display</h3>
        {notelist.map((item) => (
          <div className="display-note" key={item.id}>
            {item.note}
          </div>
        ))}
      </div>

      <div className="display">
        <h3>Received</h3>
        {!isFollowing && (
          <>
            {notelistReceived.map((item) => (
              <div className="display-note" key={item.id}>
                {item.note}
              </div>
            ))}
          </>
        )}
      </div>

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
    </>
  );
}

export default Pianov3;
