import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import socket from '../../socket';
import './SelectRoom.css'

function SelectRoom() {
    const [rooms, setRooms] = useState<{ roomId: string, round: number, players: number }[]>([]);

    const navigate = useNavigate();

    const handleJoin = (item: string) => {
        socket.emit('join_room', item);
        // setInRoom(true);
        navigate('/room');
    };

    useEffect(() => {
        socket.on('rooms', (data) => {
            setRooms(data);
        });

    }, [socket]);

    return (<>
        <h2>Join room</h2>
        <div className="room-container">
            {rooms.map((item) => (
                <div
                    key={item.roomId}
                    onClick={() => {handleJoin(item.roomId);}}
                >
                    <div>{item.roomId}</div>
                    <div>{item.players} players</div>
                </div>
            ))}
        </div>
    </>)
}

export default SelectRoom