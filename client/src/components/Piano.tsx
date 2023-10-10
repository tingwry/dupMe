import React, { useEffect, useState } from 'react';
import './Component.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function Piano() {
    const allnotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    // Notes clicking
    const [noteslist, setNoteslist] = useState<{id: number, note: string}[]>([]);
    const handleClickNote = (item: string) => {
        const newNote = {id: noteslist.length, note:item};
        setNoteslist([...noteslist, newNote]); //Add in array
    };

    useEffect(() => {
        console.log("A note added", noteslist)
    }, [noteslist])

    // Socket event for sending notes
    const sendNoteslist = () => {
        console.log("Noteslist is sent", noteslist)
        socket.emit("send_noteslist", noteslist);
    };

    /// Timer for sending notes
    const [secondsLeft, setSecondsLeft] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prevSecondsLeft) => {
                if (prevSecondsLeft === 1) {
                    // sendNoteslist();
                    clearInterval(timer);
                    return 0;
                }
                return prevSecondsLeft - 1;
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (secondsLeft === 0) {
            sendNoteslist();
            setNoteslist([]);
        }
    }, [secondsLeft]);

    // Received notes
    const [noteslistReceived, setNoteslistReceived] = useState<{id: number, note: string}[]>([]);

    useEffect(() => {
        socket.on("receive_noteslist", (data) => {
            setNoteslistReceived(data);
            console.log("receive_noteslist", data);
            setSecondsLeft(20);
            setNoteslist([]);
        });
    }, [socket]);

    return (
        <>
            <h1>Seconds Left: {secondsLeft}</h1>
            
            <h1>Piano</h1>
            <div className='piano-container'>
                {allnotes.map((item) => (
                    <div key={item} onClick={() => {handleClickNote(item);}}>
                        {item}
                    </div>
                ))}
            </div>

            <h1>Display</h1>
            <div className='piano-container'>
                {noteslist.map((item) => (
                    <div key={item.id}>{item.note}</div>
                ))}
            </div>

            <h1>Received</h1>
            <div className='piano-container'>
                {noteslistReceived.map((item) => (
                    <div key={item.id}>{item.note}</div>
                ))}
            </div>
        </>
    )
}

export default Piano