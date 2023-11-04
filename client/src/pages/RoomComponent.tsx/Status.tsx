import React, { useEffect, useState } from 'react'
import socket from '../../socket';

function Status() {

    const [isReady, setIsReady] = useState(false); // data from the server
    const [tie, setTie] = useState(false);
    const [winner, setWinner] = useState<string>();

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
        
        socket.on('tie', (data) => {
            setTie(data);
        })

        socket.on('winner', (data) => {
            console.log(data)
            // setWinner(data)
        })
    }, [socket]);

    return (
        <div>
            {isReady ? (
            <p>"Waiting for the other player to be ready..."</p>
            ) : ( 
                <button
                    onClick={handleReady}
                    className={isReady ? "button-clicked" : "button-default"}
                >
                    Ready
                </button> 
            )}
            <p></p>
            <button onClick={handleRestart}>Restart</button>
        </div>
    )
}

export default Status