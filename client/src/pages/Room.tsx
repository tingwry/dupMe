import React from 'react'
import socket from '../socket';
import Players from './RoomComponent.tsx/Players';
import Ready from './RoomComponent.tsx/Ready';
import Piano from './RoomComponent.tsx/Piano';
import { useNavigate } from 'react-router-dom';
import ScoreBoard from './RoomComponent.tsx/ScoreBoard';

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
            <ScoreBoard />
            <Piano />
        </>
    )
}

export default Room