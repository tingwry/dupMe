import React, { ChangeEvent, useEffect, useState } from 'react'
import socket from '../socket';
import "./Welcome.css";
import { useNavigate } from 'react-router-dom';

function Welcome() {
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
    // const [inRoom, setInRoom] = useState(false);
    const [users, setUsers] = useState<{sid: string, name: string, roomId: string, score: number, ready: boolean, P1: boolean}[]>([]);
    const [rooms, setRooms] = useState<{ roomId: string, round: number, players: number }[]>([]);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSubmitName = () => {
        socket.emit('submit_name', name);
        socket.connect();
        setIsConnected(true);
    };

    const handleJoin = (item: string) => {
        socket.emit('join_room', item);
        // setInRoom(true);
        navigate('/room');
    };

    useEffect(() => {
        socket.on('connect', () => {
          setIsConnected(true);
          console.log(`${name} connected`);
        });
    
        socket.on('disconnect', () => {
          setIsConnected(false);
          console.log(`${name} disconnected`);
        });

        socket.on('users', (data) => {
            setUsers(data);
        })

        socket.on('rooms', (data) => {
            setRooms(data);
        });

    }, [socket]);
    return (
        <>
            {/* {!inRoom && <> */}
                <h1>WELCOME!</h1>
                {isConnected ? (
                    <>
                        <p>static pic</p>
                        <p>{name}</p>
                        <p>current players: {users.length}</p>
                        {users.map((item) => (
                            <div key={item.sid}>
                                {item.name}, {item.roomId}
                            </div>
                        ))}
                        {/* {!inRoom && */}
                            <h2>Join room</h2>
                            <div className="rooms-container">
                                {rooms.map((item) => (
                                    <div
                                        key={item.roomId}
                                        onClick={() => {handleJoin(item.roomId);}}
                                    >
                                        {item.roomId}, {item.players}
                                    </div>
                                ))}
                            </div>
                        {/* } */}
                    </>
                ) : (
                    <>
                        <p>select pic</p>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Enter your name"
                        />
                        <p></p>
                        <button onClick={handleSubmitName}>Submit</button>
                    </>
                )}
            {/* </> } */}
            {/* <SubmitName />
            <JoinRoom2 /> */}
        </>
    )
}

export default Welcome