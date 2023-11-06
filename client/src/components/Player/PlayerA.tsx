import React, { useEffect, useState } from 'react'
import socket from '../../socket'
import './Player.css'

function PlayerA() {
    const [name, setName] = useState<string>();
    const [score, setScore] = useState(0);
    useEffect(() => {
        // socket.on('players_in_room', (data) => {
        //     const playersInRoom = data;
        //     if (playersInRoom[0]) {
        //         // console.log(playersInRoom[0]);
        //         setName(playersInRoom[0].name);
        //         setScore(playersInRoom[0].score)
        //     }
        // })

        socket.on('me', (data) => {
            setName(data.name);
            setScore(data.score);
        })
    }, [socket])
    return (<>
        {/* <h3>{name}</h3> */}
        <div>Me</div>
        <div className='name'>{name}</div>
        <div>current score: {score}</div>
    </>)
}

export default PlayerA