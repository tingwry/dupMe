import React, { useEffect, useState } from 'react'
import socket from '../../socket';
import { useNavigate } from 'react-router-dom';
import './Status.css'

function Statusv2() {
    const [isReady, setIsReady] = useState(false); // data from the server
    // const [score, setScore] = useState(0);

    // const [playing, setPlaying] = useState(false);
    // const [afterMatch, setIsAfterMatch] = useState(false);
    const [turn, setTurn] = useState("");
    const [time, setTime] = useState<any>();
    
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

        socket.on('start_turn_server', (data) => {
            // setPlaying(true);
            socket.emit('start_turn_client');
        })

        socket.on('turn', (data) => {
            setTurn(data.turn)
        })

        socket.on('time', (data) => {
            setTime(data.time);
        })

        socket.on('end_game', (data) => {
            // combine tie and winner
            // setPlaying(false);
            // setIsAfterMatch(true);
            if (data.tie) {
                // setResult('Tie !');
                setTurn('Tie !')
            } else {
                // setResult(`The winner is ${data.winner}`);
                setTurn(`The winner is ${data.winner}`);
            }
        })

        // socket.on('restart', (data) => {
        //     setPlaying(false);
        //     setIsAfterMatch(false);
        // })
    }, [socket]);

    return (
        <>
            {/* <h3>{message}</h3>
            <h3>{turn}</h3>
            <h3>{status}</h3> */}

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

            <h3>{turn}</h3>
            <h3>{time}</h3>

            {/* {playing ? (<>
                <p>score: {score}</p>
            </>) : (<>
                {afterMatch ? (<>
                    <p>{result}</p>
                    {/* <p>{tie ? 'tie' : 'not tie'}</p>
                    <p>winner: {winner}</p> */}
                    {/* <button onClick={handleRestart}>Restart</button>
                </>) : (<>
                    
                </>)}
                
            </>)} */}
            
            {/* <p></p> */}
            
            
            
        </>
    )
}

export default Statusv2