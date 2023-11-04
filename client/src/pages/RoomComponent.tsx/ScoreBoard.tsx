import React, { useEffect, useState } from 'react'
import socket from '../../socket';

function ScoreBoard() {
    const [score, setScore] = useState(0)
    const [tie, setTie] = useState(false);
    const [winner, setWinner] = useState<string>();

    useEffect(() => {
        socket.on('score', (data) => {
            setScore(data)
        })

        socket.on('tie', (data) => {
            setTie(data);
        })

        socket.on('winner', (data) => {
            console.log(data)
            // setWinner(data)
        })
    }, [socket])

    
    return (
        <>
            <p>score: {score}</p>
            <p>{tie ? 'tie' : 'not tie'}</p>
            <p>winner: {winner}</p>
        </>
    )
}

export default ScoreBoard