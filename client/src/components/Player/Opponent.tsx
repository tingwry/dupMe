import React, { useEffect, useState } from 'react'
import socket from '../../socket'
import './Player.css'

function Opponent() {
    const [name, setName] = useState<string>();
    const [avatar, setAvatar] = useState<string>();
    const [score, setScore] = useState(0);

    useEffect(() => {
        socket.on('opponent', (data) => {
            setName(data.name);
            setAvatar(data.avatar);
            setScore(data.score);
        })
    }, [socket])

    return (<>
        <h3>Opponent</h3>
        <img
            // style={{ width: "100px", height: "100px", flexWrap: "wrap" }}
            className='avatar'
            src={avatar}
            alt="Opponent"
        />
        <div className='name'>{name}</div>
        <div>current score: {score}</div>
    </>)
}

export default Opponent