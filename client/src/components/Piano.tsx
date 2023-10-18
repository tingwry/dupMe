import React, { useEffect, useState } from "react";
import "./Component.css";
import Countdown from "./Countdown";
import socket from "../socket";
import Score from "./Score";

interface Props {
  roomId: string;
}

function Piano({ roomId }: Props) {
  const allnotes = ["C", "D", "E", "F", "G", "A", "B"];
  const [notelist, setNotelist] = useState<{ id: number; note: string }[]>([]);

  const [isP1, setIsP1] = useState(false); //mod1
  const [round, setRound] = useState(1);
  const [P2Ends, setP2Ends] = useState(0);

  // const [isReady, setIsReady] = useState(false)
  // const [readyDuration, setReadyDuration] = useState(3);
  const [countdownKey, setCountdownKey] = useState(0);
  const [createDuration, setCreateDuration] = useState(5);
  const [isCreating, setIsCreating] = useState(false);
  const [followDuration, setFollowDuration] = useState(5);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [notelistReceived, setNotelistReceived] = useState<
    { id: number; note: string }[]
  >([]);
  const [score, setScore] = useState(0);

  const [gameEnded, setGameEnded] = useState(false);

  // Click note
  const handleClickNote = (item: string) => {
    const newNote = { id: notelist.length, note: item };
    setNotelist([...notelist, newNote]); //Add in array
  };

  // Ready
  const handleReady = () => {
    socket.emit('ready', "this player is ready");
    setIsButtonClicked(true);
  }

  // First Player can start creating pattern
  const handleStart = () => {
    setIsP1(true);
    setNotelist([]);
    // setReadyDuration(3);
    // setIsReady(true);
  };

  // Socket event for sending notes
  const sendNotelist = () => {
    socket.emit("send_notelist", { roomId, notelist: notelist });
    console.log("Notelist is sent", { roomId, notelist: notelist });

    setNotelist([]);
    setIsCreating(false);
  };

  // Socket event for
  useEffect(() => {
    // Starting the game after both are ready
    socket.on("start_game", (data) => {
      setIsP1(true);
      setNotelist([]);
      // setReadyDuration(3);
      // setIsReady(true);
    });

    socket.on("start_round", (data) => {
      setNotelist([]);
      // setReadyDuration(3);
      setCountdownKey(countdownKey + 1);
      // setIsReady(true);
      setIsCreating(false);
      setIsFollowing(false);

      console.log("start_round", data);
    });

    // Receiving notes
    socket.on("receive_notelist", (data) => {
      setNotelist([]);
      setNotelistReceived(data.notelist);
      console.log("receive_notelist", data);
      // setReadyDuration(3);
      // setIsReady(true);
      setIsFollowing(true);
    });
  }, [socket]);

  // Scoring
  const checkNotelist = (
    arrayReceived: { id: number; note: string }[],
    arraySubmit: { id: number; note: string }[]
  ) => {
    const minLenght = Math.min(arrayReceived.length, arraySubmit.length);
    console.log("checkNotelist", arrayReceived, arraySubmit, minLenght);

    let updatedScore = score;

    for (let i = 0; i < minLenght; i++) {
      if (
        arrayReceived[i].id === arraySubmit[i].id &&
        arrayReceived[i].note === arraySubmit[i].note
      ) {
        updatedScore++;
      }
    }

    setScore(updatedScore);
    setIsFollowing(false);

    setP2Ends(P2Ends + 1);

    if (isP1) {
      if (round === 2) {
        socket.emit("end_game", updatedScore);
        setGameEnded(true);
      } else {
        socket.emit("end_round", { roomId: roomId, round: round });
        setRound(round + 1);
      }
    } else {
      console.log("this turn ends");
      setNotelist([]);
      setIsCreating(true);

      if (P2Ends === 1) {
        socket.emit("end_3_turns", updatedScore);
      }
    }
  };

  return (
    <>
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

      {/* countdown 3 sec before the turn start */}
      {/* <p>Starting in: </p>
            <Countdown duration={3} running={isCurrentPlayer} onTimeout={() => {setIsCreating(true)}} /> */}
      {gameEnded ? <Score /> : <></>}

      <button onClick={handleReady}
        className={isButtonClicked ? 'button-clicked' : 'button-default'}>{isButtonClicked ? 'Waiting for the other player to be ready...' : 'Ready'}</button>
      {/* <button onClick={handleStart}>Start</button> */}
      <p>Create a pattern:</p>
      <Countdown
        key={`create_${countdownKey}`}
        duration={createDuration}
        running={isCreating || isP1}
        onTimeout={() => sendNotelist()}
      />
      <p></p>

      <h1>Display</h1>
      <div className="piano-container">
        {notelist.map((item) => (
          <div key={item.id}>{item.note}</div>
        ))}
      </div>
      <p>Waiting for ... to create a pattern</p>

      <p>Follow the pattern: </p>
      <Countdown
        key={`follow_${countdownKey}`}
        duration={followDuration}
        running={isFollowing}
        onTimeout={() => checkNotelist(notelistReceived, notelist)}
      />

      <h1>Received</h1>
      <div className="piano-container">
        {notelistReceived.map((item) => (
          <div key={item.id}>{item.note}</div>
        ))}
      </div>

      <p>score: {score}</p>
    </>
  );
}

export default Piano;
