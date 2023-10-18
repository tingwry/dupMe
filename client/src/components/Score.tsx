import React, { useState, useEffect } from "react";
import socket from "../socket";

function Score() {
  const [users, setUsers] = useState<
    { sid: string; name: string; roomId: string; score: number }[]
  >([]);
  const [winner, setWinner] = useState<{
    sid: string;
    name: string;
    roomId: string;
    score: number;
  }>();

  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data);
    });

    socket.on("winner", (data) => {
      setWinner(data);
      console.log("winner", data);
    });
  }, [socket]);

  return (
    <div>
      <h1>Current Scores</h1>
      <p>
        {users[0].name}: {users[0].score}
      </p>
      <p>
        {users[1].name}: {users[1].score}
      </p>
      {winner && <h1>The winner is {winner.name}</h1>}
    </div>
  );
}

export default Score;
