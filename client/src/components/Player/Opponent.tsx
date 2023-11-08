import React, { useEffect, useState } from 'react'
import socket from '../../socket'
import './Player.css'

function Opponent() {
    const [name, setName] = useState<string>();
    const [avatar, setAvatar] = useState<string>();
    const [score, setScore] = useState(0);

    const [oppoentReaction, settOpponenReaction] = useState<string>("Your opponent's reaction will be shown here");

    useEffect(() => {
        socket.on('opponent', (data) => {
            setName(data.name);
            setAvatar(data.avatar);
            setScore(data.score);
        })

        socket.on('receive_reaction', (data) => {
            settOpponenReaction(data.reaction);
        })
    }, [socket])

    return (<>
        <h3>Opponent</h3>
        <img
            className='avatar'
            src={avatar}
            alt="Opponent"
        />
        <div className='name'>{name}</div>
        <div>current score: {score}</div>
        <p>{oppoentReaction}</p>
    </>)
}

export default Opponent