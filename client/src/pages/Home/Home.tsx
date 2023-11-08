import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import socket from "../../socket";
import SelectRoom from "../../components/SelectRoom/SelectRoom";
import SubmitUser from "../../components/SubmitUser/SubmitUser";

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

  // change bg color
  const [color, setColor] = useState("#EEDBB5");
  const handleClick = (color: string) => {
    setColor(color);
  };
  useEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);

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
          <h3>Choose bg color!</h3>
          <button
            onClick={() => {
              handleClick("#EEDBB5");
            }}
          >
            Default
          </button>
          <button
            onClick={() => {
              handleClick("yellow");
            }}
          >
            Yellow
          </button>
          <button
            onClick={() => {
              handleClick("blue");
            }}
          >
            Blue
          </button>
          <button
            onClick={() => {
              handleClick("green");
            }}
          >
            Green
          </button>
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
