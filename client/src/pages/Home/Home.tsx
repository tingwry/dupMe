import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import socket from "../../socket";
import SelectRoom from "../../components/SelectRoom/SelectRoom";
import SubmitUser from "../../components/SubmitUser/SubmitUser";
import ChatRoom from "../../components/ChatRoom/ChatRoom";
import ChatRoomv2 from "../../components/ChatRoom/ChatRoomv2";

function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

    const [name, setName] = useState<string>();
    const [avatar, setAvatar] = useState<string>();

    const [users, setUsers] = useState<{sid: string, name: string, roomId: string, score: number, ready: boolean, P1: boolean}[]>([]);

    // bg color
    const [color, setColor] = useState("#EEDBB5");
    const handleClick = (color: string) => {
        setColor(color);
    };

    useEffect(() => {
        document.body.style.backgroundColor = color;
    }, [color]);

    useEffect(() => {
        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on('profile', (data) => {
            console.log(data);
            setName(data.name);
            setAvatar(data.avatar);
        })

        socket.on('users', (data) => {
            setUsers(data);
        })
    }, [socket]);

    return (<>
        <h1>WELCOME!</h1>
        {isConnected ? ( <>
            <img
                // style={{ width: "100px", height: "100px", flexWrap: "wrap" }}
                className='avatar'
                src={avatar}
                alt="Profile"
            />
            <div className='name'>{name}</div>
            {/* <p>current players: {users.length}</p>
            {users.map((item) => (
                <div key={item.sid}>
                    {item.name}, {item.roomId}
                </div>
            ))} */}
            <SelectRoom />

            <div>
                <h3>Choose bg color!</h3>
                <button onClick={() => {handleClick("#EEDBB5")}}>
                    Default
                </button>
                <button onClick={() => {handleClick("yellow")}}>
                    Yellow
                </button>
                <button onClick={() => {handleClick("blue")}}>
                    Blue
                </button>
                <button onClick={() => {handleClick("green")}}>
                    Green
                </button>
            </div>
            <ChatRoomv2 />
        </> ) : ( <>
            <SubmitUser />
            <p></p>
            <Link to="/how-to-play">
              <button>How to Play</button>
            </Link>
        </> )}
    </>)
}

export default Home;
