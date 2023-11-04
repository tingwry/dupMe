import React, { useEffect, useState } from 'react'
import socket from '../../socket';

function Ready() {
    const [isReady, setIsReady] = useState(false); // data from the server
    const [gameStatus, setGameStatus] = useState(false);
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
    }, [socket]);


    return (
        <>
        <p></p>
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
        <button onClick={handleRestart}>Restart</button>
        

        </>
    )
}

export default Ready