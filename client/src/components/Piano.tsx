import React, { useEffect, useState } from "react";
import "./Component.css";
import Countdown from "./Countdown";
import socket from "../socket";

interface Props {
  room: string;
}

function Piano({room}: Props) {
    const allnotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const [notelist, setNotelist] = useState<{id: number, note: string}[]>([]);

    const [isP1, setIsP1] = useState(false); //mod1

    const [isFollowing, setIsFollowing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    
    const [notelistReceived, setNotelistReceived] = useState<{id: number, note: string}[]>([]);
    const [score, setScore] = useState(0);

    // Click note
    const handleClickNote = (item: string) => {
        const newNote = {id: notelist.length, note:item};
        setNotelist([...notelist, newNote]); //Add in array
    };

    useEffect(() => {
        console.log("A note added", notelist)
    }, [notelist])

    // First Player can start creating pattern
    const handleStart = () => {
        setNotelist([]);
        setIsCreating(true);
        setIsP1(true);
    };

    // Socket event for sending notes
    const sendNotelist = () => {
        console.log("Notelist is sent", { room, notelist: notelist });
        socket.emit("send_notelist", { room, notelist: notelist });
    };

    // Socket event for
    useEffect(() => {
        // Starting the round after both are ready
        socket.on("start_round", (data) => {
            
        })

        // Receiving notes
        socket.on("receive_notelist", (data) => {
            setNotelistReceived(data.notelist);
            console.log("receive_notelist", data);
            setIsFollowing(true);
            setNotelist([]);
        });
    }, [socket]);

    // Scoring
    const checkNotelist = (arrayReceived: {id: number, note: string}[], arraySubmit: {id: number, note: string}[]) => {
        const minLenght = Math.min(arrayReceived.length, arraySubmit.length);
        console.log("checkNotelist", arrayReceived, arraySubmit, minLenght);

        let updatedScore = score;

        for (let i = 0; i < minLenght; i++) {
            if (arrayReceived[i].id === arraySubmit[i].id && arrayReceived[i].note === arraySubmit[i].note) {
                updatedScore++;
            }
        };

        setScore(updatedScore);

        if (isP1) {
            socket.emit("end_round", "this round ends");
        } else {
            socket.emit("end_turn", "this turn ends");
            setIsCreating(true)
        }
    };

    return (
        <>
            <div className='piano-container'>
            {allnotes.map((item) => (
                <div key={item} onClick={() => {handleClickNote(item);}}>
                    {item}
                </div>
            ))}
            </div>
            
            {/* countdown 3 sec before the turn start */}
            {/* <p>Starting in: </p>
            <Countdown duration={3} running={isCurrentPlayer} onTimeout={() => {setIsCreating(true)}} /> */}
            
            <button onClick={handleStart}>Start</button>
            <p>Create a pattern:</p> 
            <Countdown duration={10} running={isCreating} onTimeout={() => sendNotelist()} />
            <p></p>
            
            <h1>Display</h1>
            <div className='piano-container'>
                {notelist.map((item) => (
                    <div key={item.id}>{item.note}</div>
                ))}
            </div>
            <p>Waiting for ... to create a pattern</p>
            <p>Follow the pattern: </p>
            <Countdown duration={20} running={isFollowing} onTimeout={() => checkNotelist(notelistReceived, notelist)} />

            <h1>Received</h1>
            <div className='piano-container'>
                {notelistReceived.map((item) => (
                    <div key={item.id}>{item.note}</div>
                ))}
            </div>

            <p>score: {score}</p>
        </>
    );
}

export default Piano;
