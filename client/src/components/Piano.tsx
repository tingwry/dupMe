import React, { useEffect } from 'react';
import { useState } from 'react';
import './component.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function Piano() {
    const allnotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    //sent
    const [noteslist, setNoteslist] = useState<{id: number, note: string}[]>([]);
    const handleClickNote = (item: string) => {
        console.log(item);
        setNoteslist([...noteslist, {id:noteslist.length, note:item}]); //add in array
    };
    console.log(noteslist);
    //socket
    const sendNoteslist = () => {
        console.log("submit button clicked")
        socket.emit("send_noteslist", {noteslist});
    };
    //receive
    const [noteslistReceived, setNoteslistReceived] = useState<{id: number, note: string}[]>([]);

    useEffect(() => {
        socket.on("receive_noteslist", (data) => {
            setNoteslistReceived(data.noteslist);
        });
    }, [socket]);

    return (
        <>
            <h1>piano</h1>
            <div className='piano-container'>
                {allnotes.map((item) => (
                    <div
                    key={item}
                    onClick={() => {handleClickNote(item);}}>
                        {item}
                    </div>
                ))}
            </div>

            <h1>display</h1>
            <div className='piano-container'>
                {noteslist.map((item) => (
                    <div>
                        {item.note}
                    </div>
                ))}
            </div>

            <button onClick={sendNoteslist}>submit</button>

            <h1>received</h1>
            <div className='piano-container'>
                {noteslistReceived.map((item) => (
                    <div>
                        {item.note}
                    </div>
                ))}
            </div>
        </>
    )
}

export default Piano