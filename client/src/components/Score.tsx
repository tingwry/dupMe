import React, { useState, useEffect } from "react";
import socket from "../socket";
import { io } from "socket.io-client";

function Score() {
  const [p1, setp1] = useState<{
    sid: string;
    name: string;
    roomId: string;
    score: number;
  }>();
  const [p2, setp2] = useState<{
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

  useEffect(() => {
    socket.on("p1", (data) => {
      setp1(data);
    });

    socket.on("p2", (data) => {
      setp2(data);
    });

    socket.on("winner", (data) => {
      setWinner(data);
      console.log("winner: ", data);
    });

    socket.on("tie", (data) => {
      setTie(data);
      console.log("tie: ", data);
    });
  }, [socket]);
  console.log("winner");
  console.log(winner);

  return (
    <div>
      {p1 && p2 && (
        <>
          <h1>Current Scores</h1>
          <p>
            {p1.name}: {p1.score}
          </p>
          <p>
            {p2.name}: {p2.score}
          </p>
        </>
      )}
      {tie && <h1>This match is tied</h1>}
      {!tie && winner && <h1>The winner is {winner.name}</h1>}
    </div>
  );
}

export default Score;
