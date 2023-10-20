import React, { useState, useEffect } from "react";
import socket from "../socket";

function Score() {
  const [playerA, setPlayerA] = useState<{
    sid: string;
    name: string;
    roomId: string;
    score: number;
  }>();
  const [playerB, setPlayerB] = useState<{
    sid: string;
    name: string;
    roomId: string;
    score: number;
  }>();
  const [winner, setWinner] = useState<{
    sid: string;
    name: string;
    roomId: string;
    score: number;
  }>();
  const [tie, setTie] = useState(false);

  const handleRestart = () => {
    if (winner) {
      socket.emit('restart', {tie: tie, winner: winner.sid})
    } else {
      socket.emit('restart', {tie: tie, winner: "none"})
    }
  }

  useEffect(() => {
    socket.on('playerA', (data) => {
      setPlayerA(data);
    });

    socket.on('playerB', (data) => {
      setPlayerB(data);
    });

    socket.on("winner", (data) => {
      setWinner(data);
      // console.log("winner: ", data);
    });

    socket.on("tie", (data) => {
      setTie(data);
      // console.log("tie: ", data);
    });
  }, [socket]);

  

  return (
    <div>
      {playerA && playerB && (
        <>
          <h1>Current Scores</h1>
          <p>
            {playerA.name}: {playerA.score}
          </p>
          <p>
            {playerB.name}: {playerB.score}
          </p>
        </>
      )}
      {tie && <h1>This match is tied!</h1>}
      {!tie && winner && <h1>The winner is {winner.name}</h1>}
      <button onClick={handleRestart}>Restart</button>
    </div>
  );
}

export default Score;
