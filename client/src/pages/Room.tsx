import React from 'react'
import socket from '../socket';
import Players from './RoomComponent.tsx/Players';
import Ready from './RoomComponent.tsx/Ready';
import Piano from './RoomComponent.tsx/Piano';
import { useNavigate } from 'react-router-dom';
import Pianov3 from './RoomComponent.tsx/Pianov3';

function Room() {
    const navigate = useNavigate();
    const handleLeave = () => {
        socket.emit('leave_room', "roomId");
        // console.log("leave_room");
        navigate('/')
    };
    return (
        <>
            <p>room</p>
            <button onClick={handleLeave}>leave this room</button>
            <Players />
            <Ready />
            <Pianov3 />
        </>
    )
}

export default Room