import React, { useEffect, useState } from 'react'
import socket from '../../socket'
import './Player.css'

function Me() {
    const [name, setName] = useState<string>();
    const [avatar, setAvatar] = useState<string>();
    const [score, setScore] = useState(0);

    useEffect(() => {
        socket.on('me', (data) => {
            setName(data.name);
            setAvatar(data.avatar);
            console.log(data.avatar)
            setScore(data.score);
        })
    }, [socket])

    return (<>
        <h3>Me</h3>
        <img
            // style={{ width: "100px", height: "100px", flexWrap: "wrap" }}
            className='avatar'
            src={avatar}
            alt="Me"
        />
        <div className='name'>{name}</div>
        <div>current score: {score}</div>
    </>)
}

export default Me