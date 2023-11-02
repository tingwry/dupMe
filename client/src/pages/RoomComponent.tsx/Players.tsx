import React, { useEffect, useState } from 'react'
import socket from '../../socket';
import './Room.css'

function Players() {
    const [playersInRoom, setPlayersInRoom] = useState<{sid: string, name: string, roomId: string, score: number, ready: boolean, P1: boolean}[]>([]);

    useEffect(() => {
        socket.on("players_in_room", (data) => {
            setPlayersInRoom(data);
        });
    }, [socket]);

    return (
        <>
            <div className='players-container'>
                <div className='player'>
                    pa
                </div>
                <div className='add-score'>
                    hola
                </div>
                <div className='player'>
                    pb
                </div>
                
            </div>
            {playersInRoom.map((item) => (
                    <div key={item.sid}>
                        {item.name}, {item.roomId}
                    </div>
                ))}
        </>
    )
}

export default Players