import React, { useEffect, useState } from 'react'
import socket from '../../socket';
import { useNavigate } from 'react-router-dom';
import './Status.css'

function Status() {
    const [isReady, setIsReady] = useState(false); // data from the server
    const [playing, setPlaying] = useState(false);
    const [afterMatch, setIsAfterMatch] = useState(false);
    
    const [time, setTime] = useState<any>();
    const [message, setMessage] = useState<string>();
    const [result, setResult] = useState<string>();
    
    const navigate = useNavigate();
    const handleLeave = () => {
        socket.emit('leave_room');
        navigate('/')
    };

    const handleReady = () => {
        socket.emit('ready');
        setIsReady(true);
    };

    const handleRestart = () => {
        socket.emit('client-restart')
    }

    useEffect(() => {
        // socket.on('ready_state', (data) => {
        //     setIsReady(data);
        // });

        socket.on('start_game_server', () => {
            setPlaying(true);
            socket.emit('start_game_client');
        })

        socket.on('turn', (data) => {
            setMessage(data.message)
        })

        socket.on('time', (data) => {
            setTime(data.time)
        })

        socket.on('end_game', (data) => {
            // combine tie and winner
            setPlaying(false);
            setIsAfterMatch(true);
            if (data.tie) {
                setResult('Tie !')
            } else {
                setResult(`The winner is ${data.winner}`)
            }
            console.log(data)
        })

        socket.on('restart', (data) => {
            setIsReady(false);
            setPlaying(false);
            setIsAfterMatch(false);
        })
    }, [socket]);

    return (
        <>
            {isReady ? (<>
                <h3>{message}</h3>
                <h3>{time}</h3>
            </>) : (<>
                <button onClick={handleLeave}>leave this room</button>
                <button
                    onClick={handleReady}
                    className={isReady ? "button-clicked" : "button-default"}
                >
                    Ready
                </button> 
            </>)}
            

            {/* {playing ? (<>
                
            </>) : (<>
                {afterMatch ? (<>
                    <h3>{result}</h3>
                    <button onClick={handleRestart}>Restart</button>
                </>) : (<>
                    {isReady ? (<>
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
            </>)} */}
            
            <p></p>
        </>
    )
}

export default Status