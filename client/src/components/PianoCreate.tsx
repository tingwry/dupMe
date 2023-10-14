import React, { useEffect, useState } from 'react'
import './Component.css';
import socket from '../socket';
import Countdown from './Countdown';

interface Props {
    room: string;
}

function PianoCreate({room}: Props) {
    const allnotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const [notelist, setNotelist] = useState<{id: number, note: string}[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    // First Player can start creating pattern
    const handleStart = () => {
        console.log("P1 start");
        setNotelist([]);
        setIsRunning(true);
    };

    // Click note
    const handleClickNote = (item: string) => {
        const newNote = {id: notelist.length, note:item};
        setNotelist([...notelist, newNote]); //Add in array
    };

    useEffect(() => {
        console.log("A note added", notelist)
    }, [notelist])

    // Socket event for sending notes
    const sendNotelist = () => {
        console.log("Notelist is sent", { room, notelist: notelist })
        socket.emit("send_notelist", { room, notelist: notelist });
    };
    
    return (
        <>
        <h1>Piano P1</h1>
        <p>P1 Seconds left:</p> 
        <Countdown duration={10} running={isRunning} onTimeout={() => sendNotelist()} />

        <button onClick={handleStart}>Start</button>

        <div className='piano-container'>
            {allnotes.map((item) => (
                <div key={item} onClick={() => {handleClickNote(item);}}>
                    {item}
                </div>
            ))}
        </div>

        <h1>Display</h1>
        <div className='piano-container'>
            {notelist.map((item) => (
                <div key={item.id}>{item.note}</div>
            ))}
        </div>
        </>
    )
}

export default PianoCreate