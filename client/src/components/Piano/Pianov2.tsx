import React, { useEffect, useState } from "react";
import socket from "../../socket";
import Countdown from "../Countdown";
import "./Piano.css";

function Pianov2() {
  const allnotes = ["C", "D", "E", "F", "G", "A", "B"];
  const [notelist, setNotelist] = useState<{ id: number; note: string }[]>([]);
  const [notelistReceived, setNotelistReceived] = useState<
    { id: number; note: string }[]
  >([]);
  const [round, setRound] = useState(0);

  const [createDuration, setCreateDuration] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [followDuration, setFollowDuration] = useState(20);
  const [isFollowing, setIsFollowing] = useState(false);

  // Click note
  const [sound, setSound] = useState("Default");
  const [soundCSS, setSoundCSS] = useState(true);

  const handleClickNote = (item: string) => {
    if (isCreating || isFollowing) {
      const newNote = { id: notelist.length, note: item };
      const updatedNotelist = [...notelist, newNote]; //Add in array
      setNotelist(updatedNotelist);
      // socket.emit("send_notelist", { notelist: updatedNotelist });

      if (sound == "Default") {
        const audio = new Audio(`sounds/${item}.mp3`);
        audio.play();
      } else if (sound == "Cat") {
        const audio = new Audio(`sounds_cat/${item}_cat.mp3`);
        audio.play();
      }
    }
  };

  const handleDelete = () => {
    if (isCreating || isFollowing) {
      const updatedNotelist = [...notelist]
      updatedNotelist.pop();
      setNotelist(updatedNotelist);
    }
  }

  const handleSound = (sound: string) => {
    setSound(sound);
    if (sound === "Default") {
        setSoundCSS(true);
    } else if (sound === "Cat") {
        setSoundCSS(false);
    }
    
    console.log(sound)
  }

  const endCreate = () => {
    socket.emit("end_create");
    setIsCreating(false);
  };

  const endFollow = () => {
    socket.emit("end_follow", { arrayR: notelistReceived, arrayS: notelist });
    setNotelist([]);
    setNotelistReceived([]);
    setIsFollowing(false);
  };

  useEffect(() => {
    socket.emit("send_notelist", { notelist: notelist });
  }, [notelist])

  useEffect(() => {
    socket.on('mode', (data) => {
      setCreateDuration(data.createDuration);
      setFollowDuration(data.followDuration);
      setRound(data.round);
    })

    socket.on("start_create", (data) => {
      setNotelist([]);
      setNotelistReceived([]);
      setIsCreating(true);
    });

    socket.on("receive_notelist", (data) => {
      setNotelistReceived(data.notelist);
    });

    socket.on("start_follow", () => {
      setNotelist([]);
      setIsFollowing(true); // also hide the received note
    });

    socket.on("start_turn", (data) => {
      setNotelist([]);
      setNotelistReceived([]);
      setRound(data.round);
    });

    socket.on("restart", (data) => {
      setNotelist([]);
      setNotelistReceived([]);
      setRound(data.round);
      setIsCreating(false);
      setIsFollowing(false);
      console.log("restart");
    });

    socket.on("surrender", (data) => {
      setRound(data.round);
      setIsCreating(false);
      setIsFollowing(false);
      console.log("surrender");
    });
  }, [socket]);

  return (
    <>
        <div style={{display:"none"}}>
        {/* <div> */}
        <div className="countdown">
            Create a pattern:
            <Countdown
            key={`create_${round}`}
            duration={createDuration}
            running={isCreating}
            onTimeout={endCreate}
            />
        </div>

        <div className="countdown">
            Follow the pattern:
            <Countdown
            key={`follow_${round}`}
            duration={followDuration}
            running={isFollowing}
            onTimeout={endFollow}
            />
        </div>
        </div>
        <div className="display">
            <div className="display-title">Received</div>
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
                onClick={() => {handleClickNote(item)}}
            >
                {item}
            </div>
            ))}
        </div>

        <div className="display">
            <div className="display-title">Display</div>
            {notelist.map((item) => (
            <div className="display-note" key={item.id}>
                {item.note}
            </div>
            ))}
        </div>
        <button onClick={handleDelete}>Delete previous note</button>
        <p></p>
        <div className="sound-container">
            <div className="sound-title">Piano Sound: </div>
            <button 
                onClick={() => handleSound("Default")}
                className={ soundCSS ? "button-clicked" : "button-default" }
            >
                Default
            </button>
            <button 
                onClick={() => handleSound("Cat")}
                className={ soundCSS ? "button-default" : "button-clicked" }
            >
                Cat
            </button>
        </div>
    </>
  );
}

export default Pianov2;

