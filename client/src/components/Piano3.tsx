import React, { useEffect, useState } from "react";
import "./Component.css";
import Countdown from "./Countdown";
import socket from "../socket";
import Score from "./Score";

function Piano3() {
    const allnotes = ["C", "D", "E", "F", "G", "A", "B"];
    const [notelist, setNotelist] = useState<{ id: number; note: string }[]>([]);

    const [round, setRound] = useState(1);

    const [createDuration, setCreateDuration] = useState(5);
    const [isCreating, setIsCreating] = useState(false);
    const [followDuration, setFollowDuration] = useState(7);
    const [isFollowing, setIsFollowing] = useState(false);

    const [notelistReceived, setNotelistReceived] = useState<{ id: number; note: string }[]>([]);

    // Click note
    const handleClickNote = (item: string) => {
        const newNote = { id: notelist.length, note: item };
        const updatedNotelist = [...notelist, newNote]; //Add in array
        setNotelist(updatedNotelist);
        socket.emit('send_notelist', { notelist: updatedNotelist });
    };

    const endCreate = () => {
        socket.emit('end_create');
        setIsCreating(false);
    }

    const endTurn = () => {
        socket.emit('end_turn', { arrayReceived: notelistReceived, arraySubmit: notelist });
        setIsFollowing(false);
        setNotelistReceived([]);
    };

    // Socket event for
    useEffect(() => {
        // Starting the game after both are ready
        socket.on('start_game', (data) => {
        setNotelist([]);
        setIsCreating(true);
        });

        socket.on('start_turn', (data) => {
        setNotelist([]);
        setIsCreating(true);
        });

        socket.on('next_round', (data) =>{
        setRound(data.round);
        });

        socket.on('start_follow', () => {
        setNotelist([]);
        // setNotelistReceived([]);
        console.log('start_follow');
        setIsFollowing(true);
        });
        
        socket.on('receive_notelist', (data) => {
            setNotelistReceived(data.notelist);
        });

    }, [socket]);

    return (
        <>
            <Score />
            <p>Create a pattern:
            <Countdown
                key={`create_${round}`}
                duration={createDuration}
                running={isCreating}
                onTimeout={endCreate}
            />
            </p>

            <p>Follow the pattern: 
            <Countdown
                key={`follow_${round}`}
                duration={followDuration}
                running={isFollowing}
                onTimeout={endTurn}
            />
            </p>

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
    );
}

export default Piano3;
