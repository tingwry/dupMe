import React, { useEffect, useState } from 'react'
import socket from '../../socket'
import './Player.css'

function Me() {
    const [name, setName] = useState<string>();
    const [avatar, setAvatar] = useState<string>();
    const [score, setScore] = useState(0);
    const [myReaction, settMyReaction] = useState<string>("Your reaction will be shown here");
    const allReaction = ["yay", "sad", "bye", "hi"];

    const handleReaction = (item: string) => {
        socket.emit('send_reaction', { reaction: item });
        settMyReaction(item);
    }

    useEffect(() => {
        socket.on('me', (data) => {
            setName(data.name);
            setAvatar(data.avatar);
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

        <h3>Your reaction</h3>
        {allReaction.map((item) => (
            <button 
                key={item} 
                onClick={() => {handleReaction(item)}}
            >
                {item}
            </button>
        ))}
        <p>{myReaction}</p>
    </>)
}

export default Me