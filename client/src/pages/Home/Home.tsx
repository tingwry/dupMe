import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import socket from "../../socket";
import SelectRoom from "../../components/SelectRoom/SelectRoom";
import SubmitUser from "../../components/SubmitUser/SubmitUser";
import HowToPlay from "../../components/HowToPlay";

function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  const [users, setUsers] = useState<
    {
      sid: string;
      name: string;
      roomId: string;
      score: number;
      ready: boolean;
      P1: boolean;
    }[]
  >([]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("users", (data) => {
      setUsers(data);
    });
  }, [socket]);

  return (
    <>
      <h1>WELCOME!</h1>
      {isConnected ? (
        <>
          <p>static pic</p>
          <p>current players: {users.length}</p>
          {users.map((item) => (
            <div key={item.sid}>
              {item.name}, {item.roomId}
            </div>
          ))}
          <SelectRoom />
        </>
      ) : (
        <>
          <SubmitUser />
          <p>
            <Link to="/how-to-play">
              <button>How to Play</button>
            </Link>
          </p>
        </>
      )}
    </>
  );
}

export default Home;
