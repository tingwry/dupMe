import React, { useEffect, useState } from 'react'
import socket from '../../socket';
import { useNavigate } from 'react-router-dom';
import './Status.css'

function Status() {
    const [isReady, setIsReady] = useState(false); // data from the server
    const [score, setScore] = useState(0);

    const [playing, setPlaying] = useState(false);
    const [afterMatch, setIsAfterMatch] = useState(false);
    const [message, setMessage] = useState("")
    const [countdown, setCoundown] = useState<number>();
    
    const [round, setRound] = useState(0);
    const [tie, setTie] = useState(false);
    const [winner, setWinner] = useState<string>();
    const [result, setResult] = useState<string>();
    
    const navigate = useNavigate();
    const handleLeave = () => {
        socket.emit('leave_room');
        navigate('/')
    };

    const handleReady = () => {
        socket.emit('ready');
        console.log('ready')
    };

    const handleRestart = () => {
        socket.emit('client-restart')
    }

    const handleReadySetGoTimeout = () => {

    }

    useEffect(() => {
        socket.on('ready_state', (data) => {
            setIsReady(data);
        });

        socket.on('score', (data) => {
            setScore(data);
        })

        socket.on('rsg', (data) => {
            setMessage(data.message);
        })

        socket.on('countdown', (data) => {
            setCoundown(data.countdown);
        })

        socket.on('start_create', () => {
            setPlaying(true);
            setMessage("Your Turn to create a pattern")
        })

        socket.on('start_follow', () => {
            setMessage("Your Turn to follow the pattern")
        })

        socket.on('end_game', (data) => {
            // combine tie and winner
            setPlaying(false);
            setIsAfterMatch(true);
            if (data.tie) {
                setTie(data.tie)
                setResult('Tie !')
            } else {
                setWinner(data.winner)
                setResult(`The winner is ${data.winner}`)
            }
            console.log(data)
        })

        socket.on('restart', (data) => {
            setPlaying(false);
            setIsAfterMatch(false);
            setTie(false)
            setWinner('')
        })
    }, [socket]);

    return (
        <>
            {playing ? (<>
                <h3>{message}</h3>
                <p>score: {score}</p>
                <p>{countdown}</p>
            </>) : (<>
                {afterMatch ? (<>
                    <h3>{result}</h3>
                    {/* <p>{tie ? 'tie' : 'not tie'}</p>
                    <p>winner: {winner}</p> */}
                    <button onClick={handleRestart}>Restart</button>
                </>) : (<>
                    {isReady ? (<>
                        <p>Waiting for the other player to be ready...</p>
                    </>) : ( <>
                        <button onClick={handleLeave}>leave this room</button>
                        <button
                            onClick={handleReady}
                            className={isReady ? "button-clicked" : "button-default"}
                        >
                            Ready
                        </button> 
                    </>)}
                </>)}
                
            </>)}
            
            <p></p>
            
            
            
        </>
    )
}

export default Status