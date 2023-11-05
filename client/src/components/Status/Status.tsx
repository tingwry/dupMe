import React, { useEffect, useState } from 'react'
import socket from '../../socket';
import './Status.css'
import { useNavigate } from 'react-router-dom';
import ReadySetGo from '../ReadySetGo';

function Status() {
    const [isReady, setIsReady] = useState(false); // data from the server
    const [score, setScore] = useState(0);

    const [playing, setPlaying] = useState(false);
    const [afterMatch, setIsAfterMatch] = useState(false);
    
    const [tie, setTie] = useState(false);
    const [winner, setWinner] = useState<string>();
    const [result, setResult] = useState<string>();

    const [isMyTurn, setIsMyTurn] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    
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

    useEffect(() => {
        socket.on('ready_state', (data) => {
            setIsReady(data);
        });

        socket.on('start_turn', (data) => {
            setPlaying(true);
        })

        socket.on('score', (data) => {
            setScore(data)
        })

        // socket.on('tie', (data) => {
        //     setTie(data);
        // })

        // socket.on('winner', (data) => {
        //     console.log(data)
        //     setWinner(data)
        // })

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
        })
    }, [socket]);

    return (
        <>
            {playing ? (<>
                {/* <ReadySetGo key={isMyTurn} /> */}
                <p>score: {score}</p>
            </>) : (<>
                {afterMatch ? (<>
                    <p>{result}</p>
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