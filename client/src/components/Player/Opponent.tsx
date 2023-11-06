import React, { useEffect, useState } from 'react'
import socket from '../../socket'
import './Player.css'

function Opponent() {
    const [name, setName] = useState<string>('');
    const [score, setScore] = useState(0);
    useEffect(() => {
        // socket.on('players_in_room', (data) => {
        //     const playersInRoom = data;
        //     if (playersInRoom[1]) {
        //         setName(playersInRoom[1].name);
        //         setScore(playersInRoom[1].score)
        //     } else {
        //         setName('');
        //         setScore(0);
        //     }
        // })

        socket.on('opponent', (data) => {
            setName(data.name);
            setScore(data.score);
        })
    }, [socket])
    return (<>
        <div>Opponent</div>
        <div className='name'>{name}</div>
        <div>current score: {score}</div>
    </>)
}

export default Opponent