import React, { useEffect, useState } from "react";
import "./Component.css";
import Countdown from "./Countdown";
import socket from "../socket";
import Score from "./Score";

function Piano2() {
    const allnotes = ["C", "D", "E", "F", "G", "A", "B"];
    const [round, setRound] = useState(1);
    const [isMyTurn, setIsMyTurn] = useState(false);

    const [notelist, setNotelist] = useState<{ id: number; note: string }[]>([]);
    const [notelistReceived, setNotelistReceived] = useState<{ id: number; note: string }[]>([]);

    const [countdown, setCountdown] = useState(5)

    const handleClickNote = (item: string) => {
        const newNote = { id: notelist.length, note: item };
        const updatedNotelist = [...notelist, newNote]
        setNotelist(updatedNotelist); //Add in array
        socket.emit('send_notelist', { notelist: updatedNotelist });
        console.log(updatedNotelist)
    };

    // const endTurn = (arrayReceived: {id: number, note: string}[], arraySubmit: {id: number, note: string}[]) => {
    //     socket.emit('end_turn', {arrayReceived: arrayReceived, arraySubmit: arraySubmit});
    //     setNotelistReceived([]);
    // };

    useEffect(() => {
        socket.on('timer', (data) => {
            setCountdown(data.time);
        });

        socket.on('my_turn', (data) => {
            setIsMyTurn(data.isMyTurn);
            setNotelist([]);
            console.log(data);
        })

        socket.on('receive_notelist', (data) => {
            setNotelistReceived(data.notelist);
        })

        socket.on('end_follow', () => {
            console.log('end_follow')
            console.log("arrayReceived:", notelistReceived)
            console.log("arraySubmit:", notelist)
            socket.emit('end_turn', {arrayReceived: notelistReceived, arraySubmit: notelist});
            setNotelistReceived([]);
        })
    }, [socket])

    return (
        <>
            <p>{countdown}</p>
            {isMyTurn ? ('your turn') : ('not your turn')}

            <div className="piano-container">
                {allnotes.map((item) => (
                    <div
                        key={item}
                        onClick={() => {handleClickNote(item);}}
                    >
                        <div>{item}</div>
                    </div>
                ))}
            </div>

            <h1>Display</h1>
            <div className="piano-container">
                {notelist.map((item) => (
                    <div key={item.id}>
                        <div>{item.note}</div>
                    </div>
                ))}
            </div> 

            <h1>Received</h1>
            <div className="piano-container">
                {notelistReceived.map((item) => (
                    <div key={item.id}>
                        <div>{item.note}</div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Piano2