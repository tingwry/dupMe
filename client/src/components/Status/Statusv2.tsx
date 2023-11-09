import React, { useEffect, useState } from 'react'
import socket from '../../socket';
import { useNavigate, Link } from "react-router-dom";
import './Status.css'

function Statusv2() {
    const [isReady, setIsReady] = useState(false); // data from the server
    const [playing, setPlaying] = useState(false);
    const [afterMatch, setIsAfterMatch] = useState(false);

    const [mode, setMode] = useState("Easy");
    
    const [time, setTime] = useState<any>();
    const [message, setMessage] = useState<string>();
    const [result, setResult] = useState<string>();
    
    const navigate = useNavigate();

    const handleLeave = () => {
        socket.emit('leave_room');
        navigate('/');
    };

    const handleReady = () => {
        socket.emit('ready');
        setIsReady(true);
    };

    const handleRestart = () => {
        socket.emit("client-restart");
      };
    
    const handleSurrender = () => {
        socket.emit("surrender");
    };

    const handleMode = (mode: string) => {
        if (mode === "Easy") {
            setMode("Hard");
            socket.emit('set_mode', "Hard");
        } else if (mode === "Hard") {
            setMode("Easy");
            socket.emit('set_mode', "Easy");
        }
    }

    useEffect(() => {
        socket.on('mode', (data) => {
            setMode(data.mode)
        });

        socket.on('turn', (data) => {
            setMessage(data.message)
        });

        socket.on('time', (data) => {
            setTime(data.time)
        });

        socket.on('start_game_server', () => {
            setPlaying(true);
            socket.emit('start_game_client');
        });

        socket.on('start_game', () => {
            setPlaying(true);
        });

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
        });

        socket.on('restart', (data) => {
            setIsReady(false);
            setPlaying(false);
            setIsAfterMatch(false);
            setMessage("");
        });

    }, [socket]);

  return ( <> 
        <h3>{message}</h3>
        {playing ? (<>
            <h3>{time}</h3>
            <button onClick={handleSurrender}>Surrender</button>
        </>) : (<>
            {afterMatch ? (<>
                <button onClick={handleRestart}>Restart</button>
            </>) : (<>
                <button
                    onClick={handleReady}
                    className={isReady ? "button-clicked" : "button-default"}
                >
                    Ready
                </button>
                <p></p>
                <button 
                    onClick={() => handleMode(mode)}
                    disabled={isReady}
                    className={isReady ? "button-disabled" : "button-default"}
                >
                    Mode: {mode}
                </button>
                <p></p>
                <button 
                    onClick={handleLeave}
                    disabled={isReady}
                    className={isReady ? "button-disabled" : "button-default"}
                >
                    Leave This Room
                </button>
            </>)}
        </>)
        }
    </> );
}

export default Statusv2;