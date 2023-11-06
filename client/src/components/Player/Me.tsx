import React, { useEffect, useState } from 'react'
import socket from '../../socket'
import './Player.css'

function Me() {
    const [name, setName] = useState<string>();
    const [score, setScore] = useState(0);
    useEffect(() => {
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

export default Me