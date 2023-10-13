import React, { useEffect, useState } from 'react'
import './Component.css';
import socket from '../socket';
import Countdown from './Countdown';


function PianoP2() {
    const allnotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const [notelist, setNotelist] = useState<{id: number, note: string}[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    //handle P2 ready
    const handleReady = () => {
        console.log("P2 ready");
    };

    // Notes clicking
    const handleClickNote = (item: string) => {
        const newNote = {id: notelist.length, note:item};
        setNotelist([...notelist, newNote]); //Add in array
    };

    useEffect(() => {
        console.log("A note added", notelist)
    }, [notelist])

    // Received notes
    const [notelistReceived, setNotelistReceived] = useState<{id: number, note: string}[]>([]);

    useEffect(() => {
        socket.on("receive_notelist", (data) => {
            setNotelistReceived(data);
            console.log("receive_notelist", data);
            setIsRunning(true);
            setNotelist([]);
        });
    }, [socket]);

    // Scoring
    const [score, setScore] = useState(0)

    const checkNotelist = (arrayReceived: {id: number, note: string}[], arraySubmit: {id: number, note: string}[]) => {
        const minLenght = Math.min(arrayReceived.length, arraySubmit.length);
        console.log("checkNotelist", arrayReceived, arraySubmit, minLenght);

        let updatedScore = score;

        for (let i = 0; i < minLenght; i++) {
            if (arrayReceived[i].id === arraySubmit[i].id && arrayReceived[i].note === arraySubmit[i].note) {
                updatedScore++;
                console.log(`same at index ${i}:`, updatedScore);
            }
        };

        setScore(updatedScore);
    };

    return (
        <>
        <h1>Piano P2</h1>
        <p>P1 Seconds left:</p> <Countdown duration={20} running={isRunning} onTimeout={() => checkNotelist(notelistReceived, notelist)} />

        <p>score: {score}</p>

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

        <h1>Received</h1>
        <div className='piano-container'>
            {notelistReceived.map((item) => (
                <div key={item.id}>{item.note}</div>
            ))}
        </div>
        </>
    )
}

export default PianoP2