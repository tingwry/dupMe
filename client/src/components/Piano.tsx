import React, { useEffect, useState } from "react";
import "./Component.css";
import Countdown from "./Countdown";
import socket from "../socket";
import Score from "./Score";

function Piano() {
  const allnotes = ["C", "D", "E", "F", "G", "A", "B"];
  const [notelist, setNotelist] = useState<{ id: number; note: string }[]>([]);

  const [round, setRound] = useState(1);

  const [createDuration, setCreateDuration] = useState(5);
  const [isCreating, setIsCreating] = useState(false);
  const [followDuration, setFollowDuration] = useState(7);
  const [isFollowing, setIsFollowing] = useState(false);

  const [notelistReceived, setNotelistReceived] = useState<{ id: number; note: string }[]>([]);

  // Click note
  const handleClickNote = (item: string) => {
    const newNote = { id: notelist.length, note: item };
    const updatedNotelist = [...notelist, newNote]
    setNotelist(updatedNotelist); //Add in array
  };

  // Sending notes
  const sendNotelist = () => {
    socket.emit("send_notelist", { notelist: notelist });
    console.log("Notelist is sent", { notelist: notelist });
    setNotelist([]);
    setIsCreating(false);
  };

  // Socket event for
  useEffect(() => {
    // Starting the game after both are ready
    socket.on("start_game", (data) => {
      setNotelist([]);
      setIsCreating(true);
    });

    socket.on('start_turn', (data) => {
      setNotelist([]);
      setIsCreating(true);
    })

    socket.on('next_round', (data) =>{
      setRound(data.round);
    })

    socket.on("receive_notelist", (data) => {
      setNotelist([]);
      setNotelistReceived(data.notelist);
      console.log("receive_notelist", data);
      setIsFollowing(true);
    });
  }, [socket]);

  const endTurn = (arrayReceived: {id: number, note: string}[], arraySubmit: {id: number, note: string}[]) => {
    socket.emit('end_turn', {arrayReceived: arrayReceived, arraySubmit: arraySubmit});
    setIsFollowing(false);
    setNotelistReceived([]);
  };

    return (
        <>
            <Score />
            <p>Create a pattern:
            <Countdown
                key={`create_${round}`}
                duration={createDuration}
                running={isCreating}
                onTimeout={() => sendNotelist()}
            />
            </p>

            <p>Follow the pattern: 
            <Countdown
                key={`follow_${round}`}
                duration={followDuration}
                running={isFollowing}
                onTimeout={() => endTurn(notelistReceived, notelist)}
            />
            </p>

            <div className="piano-container">
                {allnotes.map((item) => (
                    <div
                        key={item}
                        onClick={() => {handleClickNote(item);}}
                    >
                        <div>{item}</div>
                    </div>
                ))}
            </div>
            <button onClick={() => {setNotelist([])}}>Clear</button>

            <h1>Display</h1>
            <div className="piano-container">
                {notelist.map((item) => (
                    <div key={item.id}>
                        <div>{item.note}</div>
                    </div>
                ))}
            </div>            

            <h1>Received</h1>
            <div className="piano-container">
                {notelistReceived.map((item) => (
                    <div key={item.id}>
                        <div>{item.note}</div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Piano;
